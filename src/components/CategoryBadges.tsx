'use client';

import { TrophyIcon } from '@heroicons/react/24/solid';
import type { Category } from '@/types';
import { usePuzzle } from '@/context/PuzzleContext';

const CATEGORY_ORDER: Category[] = [
  'Innovation',
  'Sustainability',
  'Financials',
  'Governance',
];

const BADGE_STYLES: Record<
  Category,
  {
    base: string;
    halfBg: string;
    iconHalf: string;
    full: string;
    iconFull: string;
  }
> = {
  Innovation: {
    base: 'border-blue-400 text-blue-600',
    halfBg: 'bg-blue-100',
    iconHalf: 'relative z-10 text-blue-500',
    full: 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200',
    iconFull: 'text-white',
  },
  Sustainability: {
    base: 'border-green-400 text-green-600',
    halfBg: 'bg-green-100',
    iconHalf: 'relative z-10 text-green-500',
    full: 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200',
    iconFull: 'text-white',
  },
  Financials: {
    base: 'border-amber-400 text-amber-600',
    halfBg: 'bg-amber-100',
    iconHalf: 'relative z-10 text-amber-500',
    full: 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200',
    iconFull: 'text-white',
  },
  Governance: {
    base: 'border-purple-400 text-purple-600',
    halfBg: 'bg-purple-100',
    iconHalf: 'relative z-10 text-purple-500',
    full: 'bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-200',
    iconFull: 'text-white',
  },
};

export default function CategoryBadges() {
  const { state } = usePuzzle();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3">
      {CATEGORY_ORDER.map((cat) => {
        const completedCount = state.categoryCounts[cat] ?? 0;
        const s = BADGE_STYLES[cat];

        let wrapperClasses: string;
        let iconClasses: string;
        let showHalfFill: boolean;

        if (completedCount === 0) {
          wrapperClasses = 'bg-transparent border-2 border-gray-200 text-gray-400';
          iconClasses = 'text-gray-300';
          showHalfFill = false;
        } else if (completedCount === 1) {
          wrapperClasses = `relative overflow-hidden bg-transparent border-2 ${s.base}`;
          iconClasses = s.iconHalf;
          showHalfFill = true;
        } else {
          wrapperClasses = `${s.full}`;
          iconClasses = s.iconFull;
          showHalfFill = false;
        }

        return (
          <div
            key={cat}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold shadow-sm"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${wrapperClasses}`}>
              {showHalfFill && (
                <div className={`absolute top-0 left-0 h-full w-1/2 ${s.halfBg} z-0`} />
              )}
              <TrophyIcon className={`h-4 w-4 ${iconClasses}`} />
            </div>
            <span className="text-gray-700">{cat}</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
              {completedCount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
