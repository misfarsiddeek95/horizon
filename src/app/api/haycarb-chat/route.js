// app/api/haycarb-chat/route.js
//
// Proxies chat requests to the Haycarb API so the API key never reaches
// the browser. Also applies per-user rate limiting — this is the only
// place the real client IP is visible, since the upstream API sees only
// this server's address.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;          // per IP per minute

// In-memory, so it resets on redeploy and doesn't work across multiple
// instances. Fine for a single-instance deployment; swap for Redis or
// Upstash if this ever scales out.
const hits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000)
    };
  }

  entry.count += 1;
  return { allowed: true };
}

// Keep the map from growing unbounded on a long-running server
function sweep() {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip);
  }
}
setInterval(sweep, WINDOW_MS).unref?.();

function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request) {
  try {
    const ip = clientIp(request);
    const limit = rateLimit(ip);

    if (!limit.allowed) {
      return Response.json(
        {
          error: 'rate_limit',
          message: `You've sent a lot of questions. Please wait ${limit.retryAfter} seconds and try again.`,
          retryAfter: limit.retryAfter
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const apiBase = process.env.HAYCARB_API_BASE;
    const apiKey = process.env.HAYCARB_API_KEY;

    if (!apiBase || !apiKey) {
      console.error('Haycarb API configuration is missing.');

      return Response.json(
        {
          error: 'service_unavailable',
          message: 'The service is temporarily unavailable.'
        },
        { status: 503 }
      );
    }

    const res = await fetch(`${apiBase}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(60_000)
    });

    // Forward the API's response untouched — it already returns
    // user-facing error messages in the shape the component expects.
    const responseBody = await res.text();

    return new Response(responseBody, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'application/json'
      }
    });

  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return Response.json(
        {
          error: 'service_unavailable',
          message: 'The service took too long to respond. Please try again.'
        },
        { status: 504 }
      );
    }

    console.error('Haycarb chat proxy error', error);

    return Response.json(
      {
        error: 'unexpected',
        message: 'Something went wrong. Please try again.'
      },
      { status: 500 }
    );
  }
}