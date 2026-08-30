'use client';

import { useMemo } from 'react';
import type { QuestionStatus } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';
import { CATEGORY_COLORS } from '@/data/config';

const STATUS_CONFIG: Record<
  QuestionStatus,
  { bg: string; icon: string; label: string }
> = {
  pending: { bg: 'glass-puzzle', icon: '○', label: 'Pending' },
  active: { bg: 'glass-puzzle ring-2 ring-blue-500/50', icon: '◉', label: 'Active' },
  completed: { bg: 'glass-puzzle ring-2 ring-green-500/50', icon: '✓', label: 'Completed' },
  failed: { bg: 'glass-puzzle ring-2 ring-red-500/50', icon: '✕', label: 'Failed' },
  timeout: { bg: 'glass-puzzle opacity-70', icon: '⌛', label: 'Timeout' },
  bypassed: { bg: 'glass-puzzle ring-2 ring-amber-500/50', icon: '⏭', label: 'Skipped' },
};

export default function QuestionDeck() {
  const { state, dispatch } = usePuzzle();
  const { questions, activeIndex } = state;
  const hasActive = activeIndex !== null;

  const handleSelect = (index: number) => {
    if (hasActive || state.isPaused) return;
    const qs = questions[index];
    if (qs.status !== 'pending' && qs.status !== 'bypassed') return;
    dispatch({ type: 'SELECT_QUESTION', payload: index });
  };

  const wordLengths = useMemo(
    () =>
      Object.fromEntries(
        questions.map((q) => [q.question.id, q.question.word.length]),
      ),
    [questions],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {questions.map((qs, i) => {
        const cfg = STATUS_CONFIG[qs.status];
        const canSelect = !hasActive && (qs.status === 'pending' || qs.status === 'bypassed');
        const catColor = CATEGORY_COLORS[qs.question.category]?.card ?? 'bg-zinc-100 text-zinc-600';
        const wLen = wordLengths[qs.question.id] ?? 0;
        const dashes = Array.from({ length: wLen }, () => '_').join(' ');

        return (
          <button
            key={qs.question.id}
            onClick={() => handleSelect(i)}
            disabled={!canSelect}
            className={`min-w-0 flex flex-col gap-1.5 rounded-2xl border border-white/50 p-4 sm:p-6 text-left text-xs shadow-sm transition-all duration-300 ${
              cfg.bg
            } ${
              canSelect
                ? 'cursor-pointer hover:bg-white/50 hover:shadow-2xl hover:scale-[1.01]'
                : 'cursor-default'
            }`}
          >
            <div className="flex justify-between items-start gap-2 w-full">
              <span
                className={`truncate rounded-full px-2.5 py-0.5 text-sm font-semibold ${catColor}`}
              >
                {qs.question.category}
              </span>
              <span className="text-lg sm:text-xl font-bold text-gray-700">
                #{qs.number}
              </span>
            </div>

            <p className="font-sans text-[10px] tracking-wider text-zinc-400">
              {dashes}
            </p>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${qs.status === 'active' ? 'text-blue-700' : 'text-content-primary/50'}`}>
                {cfg.icon} {cfg.label}
              </span>
            </div>

            {(qs.status === 'failed' || qs.status === 'timeout') && (
              <div className="mt-3 inline-block px-2.5 py-1 bg-white/20 text-slate-700 text-xs font-medium rounded border border-white/30">
                Correct Answer: <span className="font-bold text-slate-800 uppercase">{qs.question.word}</span>
              </div>
            )}

            {qs.status === 'bypassed' && qs.savedTimeRemaining != null && (
              <div className="mt-3 inline-block px-2.5 py-1 bg-white/20 text-amber-700 text-xs font-medium rounded border border-white/30">
                Skipped ({qs.savedTimeRemaining}s left)
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
