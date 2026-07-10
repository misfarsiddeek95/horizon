'use client';

import { TrophyIcon } from '@heroicons/react/24/solid';
import { usePuzzle } from '@/context/PuzzleContext';
import { getAllCategories, CATEGORY_COLORS } from '@/data/config';

export default function CategoryBadges() {
  const { state } = usePuzzle();
  const categories = getAllCategories();

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      {categories.map((cat) => {
        const completedCount = state.categoryCounts[cat] ?? 0;
        const s = CATEGORY_COLORS[cat];

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
