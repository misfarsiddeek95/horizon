import Link from 'next/link';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { CONFIG } from '@/data/config';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ name?: string; score?: string; time?: string; badges?: string }>;
};

async function getOrigin() {
  const h = await headers();
  const protocol = h.get('x-forwarded-proto')?.split(',')[0] ?? 'https';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  return `${protocol}://${host}`;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const name = sp.name || 'A Player';
  const score = sp.score || '0';
  const time = sp.time || '0:00';
  const badges = sp.badges || '0';

  const imageUrl = `${await getOrigin()}/api/og?name=${encodeURIComponent(name)}&score=${encodeURIComponent(score)}&time=${encodeURIComponent(time)}&badges=${encodeURIComponent(badges)}`;

  const title = `${name} scored ${score}/${CONFIG.MAX_TOTAL_QUESTIONS} in the Haycarb Crossword Challenge!`;
  const description = `${name} completed the puzzle in ${time} and earned ${badges} category badges. Can you beat this score?`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const sp = await searchParams;
  const name = sp.name || 'A Player';
  const score = sp.score || '0';
  const time = sp.time || '0:00';
  const badges = sp.badges || '0';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#147385] to-[#0d1b2a] px-4 py-12">
      <div className="w-full max-w-xl rounded-ui-card border border-white/20 bg-surface-glass p-8 shadow-2xl backdrop-blur-lg sm:p-12">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            Haycarb FY2025/26
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-content-inverse sm:text-4xl">
            Crossword Challenge
          </h1>
        </div>

        <div className="mt-10 space-y-3 text-center">
          <p className="text-lg text-white/80">
            Check out <span className="font-bold text-white">{name}</span>&apos;s score!
          </p>
          <p className="text-6xl font-extrabold text-yellow-400">
            {score}
            <span className="text-2xl text-white/70"> / {CONFIG.MAX_TOTAL_QUESTIONS}</span>
          </p>
          <p className="text-sm font-medium text-white/60">
            Completed in {time}
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
            <span aria-hidden="true">🏆</span>
            {badges} Category Badge{badges === '1' ? '' : 's'} Earned
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/puzzle"
            className="w-full rounded-ui-button bg-yellow-400 px-6 py-4 text-center text-lg font-bold text-slate-900 shadow-lg transition-colors hover:bg-yellow-300 sm:w-auto sm:px-10"
          >
            Play the Game
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            View Leaderboard &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
