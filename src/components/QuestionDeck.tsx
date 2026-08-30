'use client';

import { useMemo } from 'react';
import type { QuestionStatus } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';
import { CATEGORY_COLORS } from '@/data/config';

const STATUS_CONFIG: Record<
  QuestionStatus,
  { extra: string; icon: string; label: string }
> = {
  pending: { extra: '', icon: '○', label: 'Pending' },
  active: { extra: 'ring-2 ring-blue-400/70', icon: '◉', label: 'Active' },
  completed: { extra: '', icon: '✓', label: 'Completed' },
  failed: { extra: '', icon: '✕', label: 'Failed' },
  timeout: { extra: '', icon: '⌛', label: 'Timeout' },
  bypassed: { extra: '', icon: '⏭', label: 'Skipped' },
};

const STATE_CARD: Record<QuestionStatus, string> = {
  pending: '!bg-white/10 !backdrop-blur-lg !border !border-white/20 !text-white !shadow-lg',
  active: '!bg-white/10 !backdrop-blur-lg !border !border-white/20 !text-white !shadow-lg',
  completed: '!bg-green-100/95 !border-green-500 !text-green-900 !font-bold',
  failed: '!bg-red-100/95 !border-red-500 !text-red-900 !font-bold',
  timeout: '!bg-gray-200/95 !border-gray-500 !text-gray-800 !font-bold',
  bypassed: '!bg-yellow-100/95 !border-yellow-500 !text-yellow-900 !font-bold',
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
            className={`min-w-0 flex flex-col !gap-1 rounded-2xl border !p-3 text-left text-xs shadow-lg transition-all duration-300 backdrop-blur-md ${STATE_CARD[qs.status]} ${cfg.extra} ${
              canSelect
                ? 'cursor-pointer hover:bg-white/20 hover:shadow-2xl hover:scale-[1.01]'
                : 'cursor-default'
            }`}
          >
            <div className="flex justify-between items-start gap-2 w-full">
              <span
                className={`truncate rounded-full px-2.5 py-0.5 text-sm font-semibold ${catColor}`}
              >
                {qs.question.category}
              </span>
              <span className="text-lg sm:text-xl font-bold">
                #{qs.number}
              </span>
            </div>

            <p className="font-sans text-[10px] tracking-wider">
              {dashes}
            </p>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${qs.status === 'active' ? 'text-blue-300' : qs.status === 'pending' ? '!text-slate-200' : ''}`}>
                {cfg.icon} {cfg.label}
              </span>
            </div>

            {(qs.status === 'failed' || qs.status === 'timeout') && (
              <div className="mt-1 inline-block px-2 py-1 bg-white/20 text-xs font-medium rounded border border-white/30">
                Correct Answer: <span className="font-bold uppercase">{qs.question.word}</span>
              </div>
            )}

            {qs.status === 'bypassed' && qs.savedTimeRemaining != null && (
              <div className="mt-1 inline-block px-2 py-1 bg-white/20 text-xs font-medium rounded border border-white/30">
                Skipped ({qs.savedTimeRemaining}s left)
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
