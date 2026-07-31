import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import type { LeaderboardEntry, Category } from '@/types';
import InteractiveLeaderboard from '@/components/InteractiveLeaderboard';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  let players: LeaderboardEntry[] = [];

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'results.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const allResults = JSON.parse(fileContents) as LeaderboardEntry[];
    players = allResults
      .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((entry) => ({
        ...entry,
        earnedBadges: (entry.earnedBadges ?? {}) as Record<Category, boolean>,
        answerHistory: entry.answerHistory ?? [],
      }));
  } catch (error) {
    console.error('Error reading result.json:', error);
  }

  return (
    <div className="min-h-screen bg-brand-main flex flex-col items-center px-4 py-10 sm:py-16">
      <Link
        href="/puzzle"
        className="self-start mb-6 text-sm text-white/80 hover:text-white transition-colors"
      >
        &larr; Back to Puzzle
      </Link>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m0 0a6.022 6.022 0 0 1-2.77-.896m0 0a6.022 6.022 0 0 1-.896-2.77m0 0a6.022 6.022 0 0 1 .896-2.77m0 0a5.992 5.992 0 0 1 2.77-.896m0 0a5.99 5.99 0 0 1 2.77.896"/></svg>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Leaderboard
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <InteractiveLeaderboard players={players} />
        </div>
      </div>
    </div>
  );
}
