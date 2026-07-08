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

const CATEGORY_STYLES: Record<
  Category,
  {
    border400: string;
    halfBg: string;
    halfIcon: string;
    fullBg: string;
    fullBorder: string;
    fullShadow: string;
  }
> = {
  Innovation: {
    border400: 'border-blue-400',
    halfBg: 'bg-blue-100',
    halfIcon: 'text-blue-500',
    fullBg: 'bg-blue-500',
    fullBorder: 'border-blue-500',
    fullShadow: 'shadow-blue-200',
  },
  Sustainability: {
    border400: 'border-emerald-400',
    halfBg: 'bg-emerald-100',
    halfIcon: 'text-emerald-500',
    fullBg: 'bg-emerald-500',
    fullBorder: 'border-emerald-500',
    fullShadow: 'shadow-emerald-200',
  },
  Financials: {
    border400: 'border-amber-400',
    halfBg: 'bg-amber-100',
    halfIcon: 'text-amber-500',
    fullBg: 'bg-amber-500',
    fullBorder: 'border-amber-500',
    fullShadow: 'shadow-amber-200',
  },
  Governance: {
    border400: 'border-violet-400',
    halfBg: 'bg-violet-100',
    halfIcon: 'text-violet-500',
    fullBg: 'bg-violet-500',
    fullBorder: 'border-violet-500',
    fullShadow: 'shadow-violet-200',
  },
};

export default function CategoryBadges() {
  const { state } = usePuzzle();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3">
      {CATEGORY_ORDER.map((cat) => {
        const completedCount = state.categoryCounts[cat] ?? 0;
        const s = CATEGORY_STYLES[cat];

        let wrapperClasses: string;
        let iconClasses: string;
        let showHalfFill: boolean;

        if (completedCount === 0) {
          wrapperClasses = 'bg-transparent border-2 border-gray-200 text-gray-400';
          iconClasses = 'text-gray-300';
          showHalfFill = false;
        } else if (completedCount === 1) {
          wrapperClasses = `relative overflow-hidden bg-transparent border-2 ${s.border400} ${s.halfIcon}`;
          iconClasses = `relative z-10 ${s.halfIcon}`;
          showHalfFill = true;
        } else {
          wrapperClasses = `bg-transparent border-2 ${s.fullBorder} ${s.fullShadow} ${s.fullBg} text-white shadow-md`;
          iconClasses = 'text-white';
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
