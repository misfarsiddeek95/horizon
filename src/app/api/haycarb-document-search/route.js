// app/api/haycarb-document-search/route.js
//
// Proxies document-search requests to the Haycarb API so the API key
// never reaches the browser.
//
// It also applies per-IP rate limiting. This is where the actual client
// IP is visible because the upstream API normally sees the proxy server.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;
const API_TIMEOUT_MS = 70_000;

// This in-memory rate limiter is suitable for the current single-instance
// deployment. It resets when the server restarts or the application is
// redeployed.
//
// If the frontend later scales across multiple server instances, replace
// this with a shared store such as Redis or Upstash.
const hits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now >= entry.resetAt) {
    hits.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS
    });

    return {
      allowed: true
    };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(
        1,
        Math.ceil((entry.resetAt - now) / 1000)
      )
    };
  }

  entry.count += 1;

  return {
    allowed: true
  };
}

// Prevent the in-memory map from growing indefinitely on a
// long-running server.
function sweep() {
  const now = Date.now();

  for (const [ip, entry] of hits) {
    if (now >= entry.resetAt) {
      hits.delete(ip);
    }
  }
}

setInterval(sweep, WINDOW_MS).unref?.();

function clientIp(request) {
  const forwarded =
    request.headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded
      .split(',')[0]
      .trim();
  }

  return (
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(request) {
  try {
    // ── Per-IP rate limiting ───────────────────────────────────────

    const ip = clientIp(request);
    const limit = rateLimit(ip);

    if (!limit.allowed) {
      return Response.json(
        {
          error: 'rate_limit',
          message:
            `You've made a lot of searches. ` +
            `Please wait ${limit.retryAfter} seconds and try again.`,
          retryAfter: limit.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': limit.retryAfter.toString()
          }
        }
      );
    }

    // ── Read incoming request ──────────────────────────────────────

    const body = await request.json();

    // ── Server-side API configuration ─────────────────────────────

    const apiBase =
      process.env.HAYCARB_API_BASE;

    const apiKey =
      process.env.HAYCARB_API_KEY;

    if (!apiBase || !apiKey) {
      console.error(
        'Haycarb API configuration is missing.'
      );

      return Response.json(
        {
          error: 'service_unavailable',
          message:
            'The service is temporarily unavailable.'
        },
        {
          status: 503
        }
      );
    }

    // ── Forward request to the .NET API ────────────────────────────

    const response = await fetch(
      `${apiBase}/api/document-search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(body),
        cache: 'no-store',

        // The .NET API has a 60-second document-search timeout.
        // Give it another 10 seconds to return its controlled response.
        signal: AbortSignal.timeout(API_TIMEOUT_MS)
      }
    );

    // Forward the API response unchanged. This preserves validation,
    // rate-limit, timeout and service-error responses.
    const responseBody =
      await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') ??
          'application/json'
      }
    });
  } catch (error) {
    // ── Proxy timeout ──────────────────────────────────────────────

    if (
      error?.name === 'TimeoutError' ||
      error?.name === 'AbortError'
    ) {
      return Response.json(
        {
          error: 'service_unavailable',
          message:
            'The search took too long to respond. Please try again.'
        },
        {
          status: 504
        }
      );
    }

    // ── Unexpected proxy failure ───────────────────────────────────

    console.error(
      'Haycarb document-search proxy error',
      error
    );

    return Response.json(
      {
        error: 'unexpected',
        message:
          'Something went wrong. Please try again.'
      },
      {
        status: 500
      }
    );
  }
}