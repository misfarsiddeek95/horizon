'use client';

import { useMemo } from 'react';
import type { QuestionStatus } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';
import { CATEGORY_COLORS } from '@/data/config';

const STATUS_CONFIG: Record<
  QuestionStatus,
  { bg: string; icon: string; label: string }
> = {
  pending: { bg: 'bg-white border-zinc-200', icon: '○', label: 'Pending' },
  active: { bg: 'bg-blue-50 border-blue-400 ring-2 ring-blue-400', icon: '◉', label: 'Active' },
  completed: { bg: 'bg-green-50 border-green-300', icon: '✓', label: 'Completed' },
  failed: { bg: 'bg-red-50 border-red-300', icon: '✕', label: 'Failed' },
  timeout: { bg: 'bg-zinc-100 border-zinc-300', icon: '⌛', label: 'Timeout' },
};

export default function QuestionDeck() {
  const { state, dispatch } = usePuzzle();
  const { questions, activeIndex } = state;
  const hasActive = activeIndex !== null;

  const handleSelect = (index: number) => {
    if (hasActive || state.isPaused) return;
    const qs = questions[index];
    if (qs.status !== 'pending') return;
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
        const canSelect = !hasActive && qs.status === 'pending';
        const catColor = CATEGORY_COLORS[qs.question.category]?.card ?? 'bg-zinc-100 text-zinc-600';
        const wLen = wordLengths[qs.question.id] ?? 0;
        const dashes = Array.from({ length: wLen }, () => '_').join(' ');

        return (
          <button
            key={qs.question.id}
            onClick={() => handleSelect(i)}
            disabled={!canSelect}
            className={`min-w-0 flex flex-col gap-1.5 rounded-ui-element border p-4 sm:p-6 text-left text-xs shadow-sm transition-all ${
              cfg.bg
            } ${
              canSelect
                ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
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
              <div className="mt-3 inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200">
                Correct Answer: <span className="font-bold text-slate-800 uppercase">{qs.question.word}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
