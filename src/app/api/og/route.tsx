import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get('name') || 'A Player';
  const score = searchParams.get('score') || '0';
  const time = searchParams.get('time') || '0:00';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0d1b2a 0%, #147385 100%)',
          fontFamily: 'sans-serif',
          padding: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 64px',
            borderRadius: 24,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div
            style={{
              display: 'flex',
              color: '#facc15',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Haycarb FY2025/26
          </div>
          <div
            style={{
              display: 'flex',
              color: '#ffffff',
              fontSize: 46,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Crossword Challenge
          </div>
          <div
            style={{
              width: 96,
              height: 4,
              borderRadius: 2,
              background: '#facc15',
              marginTop: 24,
            }}
          />
          <div
            style={{
              display: 'flex',
              color: '#ffffff',
              fontSize: 64,
              fontWeight: 700,
              marginTop: 32,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
              marginTop: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 180,
                padding: '20px 32px',
                borderRadius: 16,
                background: 'rgba(13, 27, 42, 0.6)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  color: '#facc15',
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                Score
              </div>
              <div
                style={{
                  display: 'flex',
                  color: '#ffffff',
                  fontSize: 56,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {score}/8
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 180,
                padding: '20px 32px',
                borderRadius: 16,
                background: 'rgba(13, 27, 42, 0.6)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  color: '#facc15',
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                Time
              </div>
              <div
                style={{
                  display: 'flex',
                  color: '#ffffff',
                  fontSize: 56,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {time}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
