'use client';

import { TrophyIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { usePuzzle } from '@/context/PuzzleContext';
import { getAllCategories, CATEGORY_COLORS, CONFIG } from '@/data/config';

export default function CategoryBadges() {
  const { state } = usePuzzle();
  const categories = getAllCategories();

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      {categories.map((cat) => {
        const completedCount = state.categoryCounts[cat] ?? 0;
        const earned = state.earnedBadges?.[cat] ?? false;
        const s = CATEGORY_COLORS[cat];
        const required = CONFIG.QUESTIONS_PER_CATEGORY;

        if (earned) {
          return (
            <div
              key={cat}
              className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-1.5 text-xs font-semibold shadow-md shadow-yellow-200/50"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-300/50 animate-pulse">
                <CheckBadgeIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-yellow-800">{cat}</span>
                <span className="text-[10px] font-bold text-yellow-600 tracking-wider uppercase">
                  Expert
                </span>
              </div>
            </div>
          );
        }

        let wrapperClasses: string;
        let iconClasses: string;
        let showHalfFill: boolean;

        if (completedCount === 0) {
          wrapperClasses = 'bg-transparent border-2 border-gray-200 text-gray-400';
          iconClasses = 'text-gray-300';
          showHalfFill = false;
        } else if (completedCount < required) {
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
