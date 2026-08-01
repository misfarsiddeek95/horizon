'use client';

import { useMemo } from 'react';
import { usePuzzle } from '@/context/PuzzleContext';

interface MobileActionStripProps {
  onSubmit: () => void;
  onHelp: () => void;
}

export default function MobileActionStrip({ onSubmit, onHelp }: MobileActionStripProps) {
  const { state } = usePuzzle();
  const { activeIndex, questions, gridCells, wordPlacements, timerRemaining, isPaused } = state;

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

  const showHelp = timerRemaining <= 40 && timerRemaining > 0 && !isPaused;
  const canSubmit = allFilled && !isPaused && activeQ?.status === 'active';

  return (
    <div className="block lg:hidden w-full bg-white border-t border-slate-200 px-4 pt-4 pb-8 z-50">
      <div className="flex gap-2 w-full">
        {showHelp && (
          <button
            onClick={onHelp}
            className="cursor-pointer rounded-ui-element bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-200 whitespace-nowrap"
          >
            Need Help?
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 cursor-pointer rounded-ui-element bg-brand-main px-4 py-3 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
