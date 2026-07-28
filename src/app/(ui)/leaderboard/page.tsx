import Link from 'next/link';
import { TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface PlayerEntry {
  name: string;
  score: number;
  timeRemaining: number;
  aiUsed: boolean;
}

export default async function LeaderboardPage() {
  let players: PlayerEntry[] = [];

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'results.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const allResults = JSON.parse(fileContents) as PlayerEntry[];
    players = allResults
      .sort((a, b) => b.score - a.score || b.timeRemaining - a.timeRemaining)
      .slice(0, 10);
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
          <TrophyIcon className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Leaderboard
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          {players.length === 0 && (
            <p className="text-center text-white/60 py-8">
              No scores yet. Play a game to appear here!
            </p>
          )}

          {players.map((player, i) => {
            const rank = i + 1;

            let rowClasses =
              'flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors';

            let rankIcon: React.ReactNode;
            let nameClasses = 'text-white/85';
            let scoreClasses = 'text-white';

            if (rank === 1) {
              rowClasses +=
                ' bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/50';
              nameClasses = 'text-xl font-extrabold text-white';
              scoreClasses = 'text-xl font-extrabold text-yellow-300';
              rankIcon = (
                <TrophyIcon className="w-8 h-8 text-yellow-300 flex-shrink-0" />
              );
            } else if (rank === 2) {
              rowClasses +=
                ' bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/50';
              nameClasses = 'text-lg font-bold text-white';
              scoreClasses = 'text-lg font-bold text-white/85';
              rankIcon = (
                <TrophyIcon className="w-7 h-7 text-white/80 flex-shrink-0" />
              );
            } else if (rank === 3) {
              rowClasses +=
                ' bg-gradient-to-r from-amber-700/20 to-transparent border-amber-700/50';
              nameClasses = 'text-lg font-bold text-white';
              scoreClasses = 'text-lg font-bold text-amber-300';
              rankIcon = (
                <TrophyIcon className="w-6 h-6 text-amber-300 flex-shrink-0" />
              );
            } else {
              rankIcon = (
                <span className="w-8 text-center text-white/50 text-sm">
                  {rank}
                </span>
              );
            }

            return (
              <div key={`${player.name}-${i}`} className={rowClasses}>
                <div className="flex items-center gap-4 min-w-0">
                  {rankIcon}
                  <div className="flex flex-col min-w-0">
                    <span className={`truncate ${nameClasses}`}>
                      {player.name}
                    </span>
                    {player.aiUsed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300/80 mt-0.5">
                        <SparklesIcon className="w-3 h-3" />
                        Helper Used
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className={scoreClasses}>{player.score}</span>
                    {player.aiUsed && (
                      <span className="block text-[10px] text-white/40">-50% AI penalty</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
