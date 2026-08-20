'use client';

import { useEffect, useState } from 'react';
import { CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { LeaderboardEntry } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';
import { getLeaderboard } from '@/data/leaderboard';
import { CONFIG, getAllCategories } from '@/data/config';
import ShareResults from '@/components/ShareResults';

const CATEGORY_ORDER = getAllCategories();

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ResultsOverlay({ onClose }: { onClose?: () => void }) {
  const { state, dispatch } = usePuzzle();
  const { score, questions, categoryCounts, earnedBadges, session, elapsedSeconds } = state;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getLeaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  function handleCopy() {
    const earned = CATEGORY_ORDER.filter((c) => earnedBadges?.[c]).map(
      (c) => `  \u2705 ${c} Expert`,
    );
    const text = [
      `Crossword Puzzle Results`,
      `Player: ${session?.name ?? 'Unknown'}`,
      `        Score: ${score}/${questions.length}`,
      ...CATEGORY_ORDER.map(
        (c) => `  ${c}: ${categoryCounts[c] ?? 0} completed`,
      ),
      ...(earned.length > 0 ? ['', 'Expertise Earned:', ...earned] : []),
      '',
      'Leaderboard:',
      ...leaderboard.slice(0, 5).map(
        (e, i) =>
          `  ${i + 1}. ${e.name} — ${e.score}`,
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
    earned: earnedBadges?.[c] ?? false,
    total: questions.filter((q) => q.question.category === c).length,
  }));

  const earnedCount = CATEGORY_ORDER.filter((c) => earnedBadges?.[c]).length;

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50 p-4">
      <div className="relative m-auto w-full max-w-lg space-y-5 rounded-ui-card bg-surface-default p-6 shadow-xl">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close results"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        <div className="text-center">
          <h2 className="font-heading text-xl font-bold text-content-primary">
            Puzzle Complete!
          </h2>
          <p className="mt-1 text-3xl font-bold text-brand-main">
            {score} / {questions.length}
          </p>
          <p className="text-sm text-content-primary/50">
            {session?.name ?? 'Player'}
          </p>
          {earnedCount > 0 && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1 text-xs font-bold text-yellow-800">
              <CheckBadgeIcon className="h-4 w-4 text-yellow-600" />
              {earnedCount} Category Certification{earnedCount > 1 ? 's' : ''} Earned
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-content-primary/40">
            Category Breakdown
          </h3>
          {totalByCategory.map(({ category, count, earned, total }) => (
            <div key={category} className="flex items-center gap-2 text-sm">
              {earned ? (
                <div className="flex items-center gap-1.5 w-28">
                  <CheckBadgeIcon className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span className="text-yellow-700 font-semibold truncate">{category}</span>
                </div>
              ) : (
                <span className="w-28 text-content-primary/70 truncate">{category}</span>
              )}
              <div className="flex-1 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className={`h-2 rounded-full transition-all ${
                    earned ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-brand-main'
                  }`}
                  style={{
                    width: `${total > 0 ? (count / total) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className={`w-8 text-right font-sans text-xs ${earned ? 'font-bold text-yellow-700' : 'text-content-primary/50'}`}>
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
                  <span className="font-bold text-brand-main">
                    {entry.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="cursor-pointer rounded-ui-element border border-zinc-300 px-3 py-2 text-xs font-semibold text-content-primary transition-colors hover:bg-zinc-100"
            >
              View Board
            </button>
          )}
          <button
            onClick={handleCopy}
            className="cursor-pointer rounded-ui-element border border-zinc-300 px-3 py-2 text-xs font-semibold text-content-primary transition-colors hover:bg-zinc-100"
          >
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
          <button
            onClick={handlePlayAgain}
            className="cursor-pointer rounded-ui-element bg-brand-main px-3 py-2 text-xs font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
          >
            Play Again
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-zinc-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-content-primary/40">
            Brag about it
          </p>
          <ShareResults
            name={session?.name ?? 'Player'}
            score={score}
            time={formatTime(elapsedSeconds)}
            badges={earnedCount}
            correct={questions.filter((q) => q.status === 'completed').length}
            total={CONFIG.MAX_TOTAL_QUESTIONS}
          />
        </div>
      </div>
    </div>
  );
}
