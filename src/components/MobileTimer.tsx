'use client';

import { usePuzzle } from '@/context/PuzzleContext';

export default function MobileTimer() {
  const { state } = usePuzzle();
  const { activeIndex, questions, timerRemaining, isPaused } = state;

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const timerRatio = activeQ ? timerRemaining / activeQ.question.timeLimit : 1;
  const showHelp = timerRemaining <= 40 && timerRemaining > 0 && !isPaused;
  const urgent = timerRemaining <= 10 && timerRemaining > 0;

  if (!activeQ) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-1.5 font-sans text-lg font-extrabold tabular-nums ${
          urgent
            ? "text-red-500 animate-pulse"
            : showHelp
            ? "text-amber-500"
            : "text-white"
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{Math.ceil(timerRemaining)}s</span>
        {isPaused && (
          <span className="ml-1 text-xs font-medium text-amber-500">(Paused)</span>
        )}
      </div>
      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            urgent ? "bg-red-500" : showHelp ? "bg-amber-400" : "bg-brand-main"
          }`}
          style={{ width: `${Math.max(0, timerRatio * 100)}%` }}
        />
      </div>
    </div>
  );
}
