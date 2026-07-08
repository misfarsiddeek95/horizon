'use client';

import { useEffect, useState } from 'react';
import type { LeaderboardEntry, Category } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';
import { getLeaderboard } from '@/data/leaderboard';

const CATEGORY_ORDER: Category[] = [
  'Innovation',
  'Sustainability',
  'Financials',
  'Governance',
];

const CATEGORY_LABELS: Record<Category, string> = {
  Innovation: 'Innovation',
  Sustainability: 'Sustainability',
  Financials: 'Financials',
  Governance: 'Governance',
};

export default function ResultsOverlay() {
  const { state, dispatch } = usePuzzle();
  const { score, questions, categoryCounts, session } = state;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getLeaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  function handleCopy() {
    const text = [
      `Crossword Puzzle Results`,
      `Player: ${session?.name ?? 'Unknown'}`,
      `Score: ${score}/8`,
      ...CATEGORY_ORDER.map(
        (c) => `  ${CATEGORY_LABELS[c]}: ${categoryCounts[c] ?? 0} completed`,
      ),
      '',
      'Leaderboard:',
      ...leaderboard.slice(0, 5).map(
        (e, i) =>
          `  ${i + 1}. ${e.name} — ${e.score}/8`,
      ),
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePlayAgain() {
    localStorage.removeItem('horizon-puzzle-session');
    dispatch({ type: 'RESET' });
  }

  const totalByCategory = CATEGORY_ORDER.map((c) => ({
    category: c,
    count: categoryCounts[c] ?? 0,
    total: questions.filter((q) => q.question.category === c).length,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg space-y-5 rounded-ui-card bg-surface-default p-6 shadow-xl">
        <div className="text-center">
          <h2 className="font-heading text-xl font-bold text-content-primary">
            Puzzle Complete!
          </h2>
          <p className="mt-1 text-3xl font-bold text-brand-main">
            {score} / 8
          </p>
          <p className="text-sm text-content-primary/50">
            {session?.name ?? 'Player'}
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-content-primary/40">
            Category Breakdown
          </h3>
          {totalByCategory.map(({ category, count, total }) => (
            <div key={category} className="flex items-center gap-2 text-sm">
              <span className="w-28 text-content-primary/70">{category}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-2 rounded-full bg-brand-main transition-all"
                  style={{
                    width: `${total > 0 ? (count / total) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-8 text-right font-mono text-xs text-content-primary/50">
                {count}/{total}
              </span>
            </div>
          ))}
        </div>

        {leaderboard.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-primary/40">
              Leaderboard
            </h3>
            <div className="space-y-1">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div
                  key={`${entry.email}-${entry.date}`}
                  className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold text-content-primary/50 w-5">
                    {i + 1}.
                  </span>
                  <span className="flex-1 text-content-primary">
                    {entry.name}
                  </span>
                  <span className="font-mono font-bold text-brand-main">
                    {entry.score}/8
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 rounded-ui-element border border-zinc-300 px-3 py-2 text-xs font-semibold text-content-primary transition-colors hover:bg-zinc-100"
          >
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex-1 rounded-ui-element bg-brand-main px-3 py-2 text-xs font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
