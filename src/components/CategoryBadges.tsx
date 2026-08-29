'use client';

import { TrophyIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { usePuzzle } from '@/context/PuzzleContext';
import { getAllCategories, CATEGORY_COLORS, CONFIG } from '@/data/config';

const CATEGORY_HEX: Record<string, string> = {
  'Annual Report Experience': '#f59e0b',
  'Company, Governance & Performance': '#3b82f6',
  'Products, Solutions & Innovation': '#14b8a6',
  'Sustainability, People & Impact': '#22c55e',
  'Markets, Operations & Future Readiness': '#06b6d4',
};

export default function CategoryBadges() {
  const { state } = usePuzzle();
  const isPlaying = state.phase === 'playing';
  const categories = getAllCategories();

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      {categories.map((cat) => {
        const completedCount = state.categoryCounts[cat] ?? 0;
        const earned = state.earnedBadges?.[cat] ?? false;
        const s = CATEGORY_COLORS[cat];
        const required = CONFIG.QUESTIONS_PER_CATEGORY;
        const hex = CATEGORY_HEX[cat] ?? '#6b7280';

        if (earned) {
          return (
            <div
              key={cat}
              className={isPlaying ? "inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-black/35 px-4 py-1.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl transition-all" : "inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-semibold shadow-md transition-all"}
              style={{
                backgroundColor: `${hex}15`,
                borderColor: hex,
                color: hex,
                boxShadow: `0 4px 12px ${hex}30`,
              }}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-lg animate-pulse ${s.full}`}>
                <CheckBadgeIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span>{cat}</span>
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
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
          wrapperClasses = `bg-transparent border-2 text-gray-400`;
          iconClasses = `border-2 border-current rounded-full text-gray-300`;
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
            className={isPlaying ? "inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-black/35 px-4 py-1.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl" : "inline-flex items-center gap-2 rounded-full border-2 bg-white px-4 py-1.5 text-xs font-semibold shadow-sm"}
            style={{ borderColor: hex }}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${wrapperClasses}`}
              style={{ borderColor: hex }}
            >
              {showHalfFill && (
                <div className={`absolute top-0 left-0 h-full w-1/2 ${s.halfBg} z-0`} />
              )}
              <TrophyIcon className={`h-4 w-4 ${iconClasses}`} style={{ color: hex }} />
            </div>
            <span className={isPlaying ? "text-white" : "text-gray-700"}>{cat}</span>
            <span className={isPlaying ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/70" : "inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500"}>
              {completedCount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
