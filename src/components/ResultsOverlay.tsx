'use client';

import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { usePuzzle } from '@/context/PuzzleContext';
import { CONFIG, getAllCategories } from '@/data/config';
import ShareResults from '@/components/ShareResults';

const CATEGORY_ORDER = getAllCategories();

export default function ResultsOverlay({ onClose }: { onClose?: () => void }) {
  const { state, dispatch } = usePuzzle();
  const { score, questions, session } = state;

  function handlePlayAgain() {
    localStorage.removeItem('horizon-puzzle-session');
    dispatch({ type: 'RESET' });
  }

  const earnedCount = CATEGORY_ORDER.filter((c) => state.earnedBadges?.[c]).length;
  const correctCount = questions.filter((q) => q.status === 'completed').length;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative z-[100000] w-full max-w-lg max-h-[90vh] rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl flex flex-col overflow-hidden">

        {/* PINNED HEADER */}
        <div className="shrink-0 p-6 pb-2 text-center relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close results"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          <h2 className="font-heading text-xl font-bold text-[var(--color-tm-teal-blue)]">
            Challenge Complete!
          </h2>
          <p className="mt-1 text-3xl font-extrabold text-teal-600">
            {score} Points
          </p>
          <p className="text-sm font-medium text-[var(--color-tm-teal-blue)]">
            {correctCount} of {CONFIG.MAX_TOTAL_QUESTIONS} Correct
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--color-tm-teal-blue)]">
            Great work, {session?.name ?? 'Player'}!
          </p>
          {earnedCount > 0 && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1 text-xs font-bold text-yellow-800">
              <span aria-hidden="true">🏆</span>
              {earnedCount} Category Badge{earnedCount > 1 ? 's' : ''} Earned
            </p>
          )}
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
        </div>

        {/* PINNED FOOTER */}
        <div className="shrink-0 p-6 pt-4 border-t border-slate-200/60 flex flex-col gap-4">
          <div className="flex gap-3">
            <button
              onClick={() => { window.location.href = '/leaderboard'; }}
              className="flex-1 cursor-pointer rounded-ui-element border border-[var(--color-tm-teal-blue)] px-3 py-2.5 text-xs font-semibold text-[var(--color-tm-teal-blue)] bg-transparent transition-colors hover:bg-[var(--color-tm-teal-blue)]/10"
            >
              View Leaderboard
            </button>
            <button
              onClick={handlePlayAgain}
              className="flex-1 cursor-pointer rounded-ui-element bg-brand-main px-3 py-2.5 text-xs font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
            >
              Play Again
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-slate-200/60 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-tm-teal-blue)]">
              Share your achievement
            </p>
            <ShareResults
              name={session?.name ?? 'Player'}
              score={score}
              time={''}
              badges={earnedCount}
              correct={correctCount}
              total={CONFIG.MAX_TOTAL_QUESTIONS}
            />
          </div>
        </div>

      </div>
    </div>,
    document.body,
  );
}
