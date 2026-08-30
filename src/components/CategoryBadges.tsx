'use client';

import { useEffect, useRef, useState } from 'react';
import { Lottie } from 'lottie-react';
import { usePuzzle } from '@/context/PuzzleContext';
import { getAllCategories, CATEGORY_COLORS, CONFIG } from '@/data/config';

const TROPHY_DEFAULT = '/icons/game/wired-outline-3261-trophy-ornate-line-loop-roll.json';
const TROPHY_COMPLETED = '/icons/game/wired-outline-3259-trophy-ornate-in-reveal.json';

const CATEGORY_HEX: Record<string, string> = {
  'Annual Report Experience': '#f59e0b',
  'Company, Governance & Performance': '#3b82f6',
  'Products, Solutions & Innovation': '#14b8a6',
  'Sustainability, People & Impact': '#22c55e',
  'Markets, Operations & Future Readiness': '#06b6d4',
};

function useLottieAnimations() {
  const [defaultAnim, setDefaultAnim] = useState<unknown>(null);
  const [completedAnim, setCompletedAnim] = useState<unknown>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    Promise.all([
      fetch(TROPHY_DEFAULT).then((r) => r.json()),
      fetch(TROPHY_COMPLETED).then((r) => r.json()),
    ])
      .then(([d, c]) => {
        setDefaultAnim(d);
        setCompletedAnim(c);
      })
      .catch(() => {});
  }, []);

  return { defaultAnim, completedAnim };
}

export default function CategoryBadges() {
  const { state } = usePuzzle();
  const categories = getAllCategories();
  const { defaultAnim, completedAnim } = useLottieAnimations();

  return (
    <>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(-50%) rotate(0deg) scaleY(1); }
          25% { transform: translateX(-50%) rotate(2deg) scaleY(1.3); }
          50% { transform: translateX(-50%) rotate(0deg) scaleY(0.8); }
          75% { transform: translateX(-50%) rotate(-2deg) scaleY(1.2); }
        }
        .animate-wave { animation: wave 2s ease-in-out infinite; }
      `}</style>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      {categories.map((cat) => {
        const completedCount = state.categoryCounts[cat] ?? 0;
        const earned = state.earnedBadges?.[cat] ?? false;
        const s = CATEGORY_COLORS[cat];
        const required = CONFIG.QUESTIONS_PER_CATEGORY;
        const hex = CATEGORY_HEX[cat] ?? '#6b7280';
        const progress = Math.min((completedCount / required) * 100, 100);
        const animData = earned ? completedAnim : defaultAnim;

        return (
          <div key={cat} className="flex md:flex-col items-center gap-2 md:gap-0 md:w-32">

            {/* ── Desktop Circular UI ── */}
            <div className="hidden md:flex flex-col items-center w-full">
              <div className="relative">
                <div
                  className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl border-2 overflow-hidden"
                  style={{ borderColor: hex }}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div
                      className="absolute bottom-0 left-0 w-full transition-all duration-700 ease-out"
                      style={{ height: `${progress}%`, backgroundColor: hex, opacity: 0.35 }}
                    />
                    {progress === 50 && (
                      <div
                        className="absolute left-1/2 w-[200%] h-3 animate-wave rounded-[40%]"
                        style={{
                          bottom: `calc(${progress}% - 6px)`,
                          backgroundColor: hex,
                          opacity: 0.35,
                          transform: 'translateX(-50%)',
                        }}
                      />
                    )}
                  </div>
                  <div className="relative z-10 [&_path]:!stroke-current" style={{ color: hex }}>
                    {animData ? (
                      <Lottie src={animData} loop={true} autoplay={true} className="w-12 h-12" />
                    ) : (
                      <div className="w-12 h-12 rounded-full animate-pulse" style={{ backgroundColor: `${hex}30` }} />
                    )}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {completedCount}
                </div>
              </div>
              <span className="text-center text-xs font-semibold text-white whitespace-normal leading-snug mt-1">
                {cat}
              </span>
            </div>

            {/* ── Mobile Pill UI ── */}
            <div
              className="relative flex md:hidden items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-semibold shadow-lg overflow-hidden"
              style={{ borderColor: hex }}
            >
              <div
                className="absolute inset-0 -z-10 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: hex, opacity: 0.2 }}
              />
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0"
                style={{ borderColor: hex }}
              >
                <div className="[&_path]:!stroke-current" style={{ color: hex }}>
                  {animData ? (
                    <Lottie src={animData} loop={true} autoplay={true} className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/30" />
                  )}
                </div>
              </div>
              <span className="!text-white !font-bold !drop-shadow-md whitespace-nowrap">{cat}</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold !text-white !drop-shadow-md shrink-0">
                {completedCount}
              </span>
            </div>

          </div>
        );
      })}
    </div>
    </>
  );
}
