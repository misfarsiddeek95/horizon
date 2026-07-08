'use client';

import { useMemo } from 'react';
import type { QuestionStatus } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';

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

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  Innovation: 'bg-blue-100 text-blue-600',
  Sustainability: 'bg-emerald-100 text-emerald-600',
  Financials: 'bg-amber-100 text-amber-600',
  Governance: 'bg-violet-100 text-violet-600',
};

export default function QuestionDeck() {
  const { state, dispatch } = usePuzzle();
  const { questions, activeIndex } = state;
  const hasActive = activeIndex !== null;

  const handleSelect = (index: number) => {
    if (hasActive) return;
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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {questions.map((qs, i) => {
        const cfg = STATUS_CONFIG[qs.status];
        const canSelect = !hasActive && qs.status === 'pending';
        const catColor = CATEGORY_BADGE_COLORS[qs.question.category] ?? 'bg-zinc-100 text-zinc-600';
        const wLen = wordLengths[qs.question.id] ?? 0;
        const dashes = Array.from({ length: wLen }, () => '_').join(' ');

        return (
          <button
            key={qs.question.id}
            onClick={() => handleSelect(i)}
            disabled={!canSelect}
            className={`flex flex-col gap-1.5 rounded-ui-element border p-4 sm:p-6 text-left text-xs shadow-sm transition-all ${
              cfg.bg
            } ${
              canSelect
                ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
                : 'cursor-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${catColor}`}
              >
                {qs.question.category}
              </span>
              <span className="text-lg sm:text-xl font-bold text-gray-700">
                #{qs.number}
              </span>
            </div>

            <p className="font-mono text-[10px] tracking-wider text-zinc-400">
              {dashes}
            </p>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${qs.status === 'active' ? 'text-blue-700' : 'text-content-primary/50'}`}>
                {cfg.icon} {cfg.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
