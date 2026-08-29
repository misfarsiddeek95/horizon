'use client';

import { useMemo } from 'react';
import type { QuestionStatus } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';
import { CATEGORY_COLORS } from '@/data/config';

const CATEGORY_PILL_CLASSES: Record<string, string> = {
  'Annual Report Experience': 'border-amber-300/70 bg-amber-400/20 text-amber-100',
  'Company, Governance & Performance': 'border-blue-300/70 bg-blue-400/20 text-blue-100',
  'Products, Solutions & Innovation': 'border-teal-300/70 bg-teal-400/20 text-teal-100',
  'Sustainability, People & Impact': 'border-green-300/70 bg-green-400/20 text-green-100',
  'Markets, Operations & Future Readiness': 'border-cyan-300/70 bg-cyan-400/20 text-cyan-100',
};

const STATUS_CONFIG: Record<
  QuestionStatus,
  { bg: string; icon: string; label: string }
> = {
  pending: { bg: 'bg-black/40 border-white/20', icon: '○', label: 'Pending' },
  active: { bg: 'bg-teal-950/70 border-teal-300 ring-2 ring-teal-300', icon: '◉', label: 'Active' },
  completed: { bg: 'bg-teal-900/60 border-teal-400', icon: '✓', label: 'Completed' },
  failed: { bg: 'bg-red-950/70 border-red-400', icon: '✕', label: 'Failed' },
  timeout: { bg: 'bg-red-950/70 border-red-400', icon: '⌛', label: 'Timeout' },
  bypassed: { bg: 'bg-amber-950/70 border-amber-300', icon: '⏭', label: 'Skipped' },
};

const LEGACY_STATUS_CONFIG: Record<
  QuestionStatus,
  { bg: string; icon: string; label: string }
> = {
  pending: { bg: 'bg-white border-zinc-200', icon: '○', label: 'Pending' },
  active: { bg: 'bg-blue-50 border-blue-400 ring-2 ring-blue-400', icon: '◉', label: 'Active' },
  completed: { bg: 'bg-green-50 border-green-300', icon: '✓', label: 'Completed' },
  failed: { bg: 'bg-red-50 border-red-300', icon: '✕', label: 'Failed' },
  timeout: { bg: 'bg-zinc-100 border-zinc-300', icon: '⌛', label: 'Timeout' },
  bypassed: { bg: 'bg-amber-50 border-amber-300', icon: '⏭', label: 'Skipped' },
};

export default function QuestionDeck() {
  const { state, dispatch } = usePuzzle();
  const { questions, activeIndex } = state;
  const isPlaying = state.phase === 'playing';
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
        const cfg = (isPlaying ? STATUS_CONFIG : LEGACY_STATUS_CONFIG)[qs.status];
        const canSelect = !hasActive && (qs.status === 'pending' || qs.status === 'bypassed');
        const catColor = CATEGORY_COLORS[qs.question.category]?.card ?? 'bg-zinc-100 text-zinc-600';
        const wLen = wordLengths[qs.question.id] ?? 0;
        const dashes = Array.from({ length: wLen }, () => '_').join(' ');

        return (
          <button
            key={qs.question.id}
            onClick={() => handleSelect(i)}
            disabled={!canSelect}
            className={`${isPlaying ? 'min-w-0 flex flex-col gap-1.5 rounded-xl border p-4 text-left text-xs shadow-2xl backdrop-blur-xl transition-all sm:p-6' : 'min-w-0 flex flex-col gap-1.5 rounded-ui-element border p-4 sm:p-6 text-left text-xs shadow-sm transition-all'} ${
              cfg.bg
            } ${
              canSelect
                ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
                : 'cursor-default'
            }`}
          >
            <div className="flex justify-between items-start gap-2 w-full">
              <span
                className={
                  isPlaying
                    ? `truncate rounded-full border px-2.5 py-0.5 text-sm font-semibold ${CATEGORY_PILL_CLASSES[qs.question.category] ?? 'border-white/20 bg-white/10 text-white'}`
                    : `truncate rounded-full px-2.5 py-0.5 text-sm font-semibold ${catColor}`
                }
              >
                {qs.question.category}
              </span>
              <span className={isPlaying ? 'text-lg font-bold text-white sm:text-xl' : 'text-lg sm:text-xl font-bold text-gray-700'}>
                #{qs.number}
              </span>
            </div>

            <p className={isPlaying ? 'font-sans text-[10px] tracking-wider text-white/50' : 'font-sans text-[10px] tracking-wider text-zinc-400'}>
              {dashes}
            </p>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isPlaying ? (qs.status === 'active' ? 'text-teal-200' : qs.status === 'pending' ? 'text-gray-300' : qs.status === 'timeout' ? 'text-red-400' : 'text-white/70') : (qs.status === 'active' ? 'text-blue-700' : 'text-content-primary/50')}`}>
                {cfg.icon} {cfg.label}
              </span>
            </div>

            {(qs.status === 'failed' || qs.status === 'timeout') && (
              <div className={isPlaying ? 'mt-3 inline-block rounded border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80' : 'mt-3 inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200'}>
                Correct Answer: <span className={isPlaying ? 'font-bold uppercase text-white' : 'font-bold text-slate-800 uppercase'}>{qs.question.word}</span>
              </div>
            )}

            {qs.status === 'bypassed' && qs.savedTimeRemaining != null && (
              <div className={isPlaying ? 'mt-3 inline-block rounded border border-amber-300/60 bg-amber-950/70 px-2.5 py-1 text-xs font-medium text-amber-100' : 'mt-3 inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded border border-amber-200'}>
                Skipped ({qs.savedTimeRemaining}s left)
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
