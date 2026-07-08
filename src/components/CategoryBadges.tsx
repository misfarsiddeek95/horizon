'use client';

import type { Category } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';

const CATEGORY_ORDER: Category[] = [
  'Innovation',
  'Sustainability',
  'Financials',
  'Governance',
];

const CATEGORY_COLORS: Record<Category, string> = {
  Innovation: 'bg-blue-100 text-blue-700 border-blue-300',
  Sustainability: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  Financials: 'bg-amber-100 text-amber-700 border-amber-300',
  Governance: 'bg-violet-100 text-violet-700 border-violet-300',
};

const CATEGORY_MASTERY_COLORS: Record<Category, string> = {
  Innovation: 'bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/30',
  Sustainability: 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30',
  Financials: 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/30',
  Governance: 'bg-violet-500 text-white border-violet-600 shadow-lg shadow-violet-500/30',
};

export default function CategoryBadges() {
  const { state } = usePuzzle();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3">
      {CATEGORY_ORDER.map((cat) => {
        const count = state.categoryCounts[cat] ?? 0;
        const mastered = count >= 2;
        const base = mastered ? CATEGORY_MASTERY_COLORS[cat] : CATEGORY_COLORS[cat];

        return (
          <div
            key={cat}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${base} ${
              mastered ? 'scale-105' : 'opacity-80'
            }`}
          >
            <span>{cat}</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold">
              {count}
            </span>
            {mastered && <span className="text-[10px]">★</span>}
          </div>
        );
      })}
    </div>
  );
}
