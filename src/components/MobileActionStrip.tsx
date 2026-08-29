'use client';

import { useMemo } from 'react';
import { usePuzzle } from '@/context/PuzzleContext';

interface MobileActionStripProps {
  onSubmit: () => void;
  onHelp: () => void;
}

export default function MobileActionStrip({ onSubmit, onHelp }: MobileActionStripProps) {
  const { state, dispatch } = usePuzzle();
  const { activeIndex, questions, gridCells, wordPlacements, timerRemaining, isPaused } = state;
  const isPlaying = state.phase === 'playing';

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const placement = useMemo(() => {
    if (!activeQ) return null;
    return wordPlacements.find((p) => p.questionId === activeQ.question.id) ?? null;
  }, [activeQ, wordPlacements]);

  const allFilled = useMemo(() => {
    if (!activeQ || !placement) return false;
    return placement.cells.every((c) => {
      const cell = gridCells[c.y]?.[c.x];
      return cell && cell.letter !== null;
    });
  }, [activeQ, placement, gridCells]);

  const showHelp = timerRemaining <= 30 && timerRemaining > 0 && !isPaused;
  const canSubmit = allFilled && !isPaused && activeQ?.status === 'active';
  const canBypass = !isPaused && activeQ?.status === 'active';

  function handleBypass() {
    dispatch({ type: 'BYPASS_QUESTION' });
  }

  return (
    <div className={isPlaying ? 'block lg:hidden z-50 w-full border-t border-white/15 bg-black/55 px-4 pt-4 pb-8 backdrop-blur-xl' : 'block lg:hidden w-full bg-white border-t border-slate-200 px-4 pt-4 pb-8 z-50'}>
      <div className="flex gap-2 w-full">
        {showHelp && (
          <button
            onClick={onHelp}
            className={isPlaying ? 'cursor-pointer rounded-ui-element border border-amber-300/60 bg-amber-950/70 px-4 py-3 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-900/70 whitespace-nowrap' : 'cursor-pointer rounded-ui-element bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-200 whitespace-nowrap'}
          >
            Need Help?
          </button>
        )}
        <button
          onClick={handleBypass}
          disabled={!canBypass}
          className={isPlaying ? 'cursor-pointer rounded-ui-element border border-white/30 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap' : 'cursor-pointer rounded-ui-element border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap'}
        >
          Skip
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={isPlaying ? 'flex-1 cursor-pointer rounded-ui-element bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40' : 'flex-1 cursor-pointer rounded-ui-element bg-brand-main px-4 py-3 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40'}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
