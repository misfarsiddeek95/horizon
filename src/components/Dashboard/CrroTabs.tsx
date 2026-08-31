"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { CRROS_V2, CRRO_IDS } from "@/data/dashboard/crros";
import type { CrroId } from "@/data/dashboard/types";
import { moveTabFocus } from "./tabKeyboard";

interface CrroTabsProps {
  active: CrroId;
  onSelect: (id: CrroId) => void;
}

const GLIDE_EASE = "cubic-bezier(0.25,1,0.5,1)";

export default function CrroTabs({ active, onSelect }: CrroTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  useEffect(() => {
    const el = buttonRefs.current[active];
    const container = containerRef.current;
    if (!el || !container) return;

    const measure = () => {
      const cRect = container.getBoundingClientRect();
      const bRect = el.getBoundingClientRect();
      setIndicator({
        x: bRect.left - cRect.left + container.scrollLeft,
        y: bRect.top - cRect.top,
        width: bRect.width,
        height: bRect.height,
      });
    };

    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    measure();
    const rafId = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    container.addEventListener("scroll", measure);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
      container.removeEventListener("scroll", measure);
    };
  }, [active]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScroll({
        left: scrollLeft > 0,
        right: Math.ceil(scrollLeft + clientWidth) < scrollWidth,
      });
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <div className="relative max-md:w-full">
      {canScroll.left && (
        <button
          type="button"
          onClick={() => containerRef.current?.scrollBy({ left: -160, behavior: "smooth" })}
          className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-full shadow-lg text-white cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
      )}

      {canScroll.right && (
        <button
          type="button"
          onClick={() => containerRef.current?.scrollBy({ left: 160, behavior: "smooth" })}
          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-full shadow-lg text-white cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      )}

      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="tablist"
        aria-label="Climate risks and opportunities"
        className="relative mb-[26px] grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 max-md:!flex max-md:!flex-row max-md:!overflow-x-auto max-md:!flex-nowrap max-md:!snap-x max-md:!snap-mandatory max-md:!scrollbar-hide max-md:!gap-3 max-md:!px-4 max-md:!pb-6"
      >
        {/* Desktop: sliding indicator */}
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute z-10 overflow-hidden rounded-[18px_18px_18px_6px] border border-[#8fc9c3] bg-white shadow-[0_16px_34px_rgba(25,69,73,.07)]"
          style={{
            width: indicator.width,
            height: indicator.height,
            transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0)`,
            transition: `transform 0.45s ${GLIDE_EASE}, width 0.45s ${GLIDE_EASE}, height 0.45s ${GLIDE_EASE}`,
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[18px_18px_18px_6px] bg-[linear-gradient(90deg,#042b31_0%,#459c98_40%,#e37b58_70%,#f5d482_100%)] [mask-image:linear-gradient(#fff_0_0,#fff_3px,transparent_3px)] [-webkit-mask-image:linear-gradient(#fff_0_0,#fff_3px,transparent_3px)]"
          />
        </div>

        {CRRO_IDS.map((id) => {
          const crro = CRROS_V2[id];
          const isActive = id === active;
          return (
            <button
              key={id}
              ref={(node) => { buttonRefs.current[id] = node; }}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(id)}
              onKeyDown={(event) => moveTabFocus(event, (index) => onSelect(CRRO_IDS[index]))}
              className="relative min-h-[128px] cursor-pointer rounded-[18px_18px_18px_6px] border border-[#d9e4e5] bg-white/[.78] p-[18px_18px_17px] text-left shadow-[0_10px_26px_rgba(25,69,73,.03)] transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[rgba(226,241,239,.42)] max-md:!relative max-md:!m-0 max-md:!p-0 max-md:!w-[160px] max-md:!min-w-[160px] max-md:!min-h-0 max-md:!flex-shrink-0 max-md:!overflow-visible max-md:!snap-center"
            >
              {/* Mobile: inline active background */}
              {isActive && (
                <div
                  aria-hidden="true"
                  className="md:hidden absolute inset-0 z-0 overflow-hidden rounded-[18px_18px_18px_6px] border border-[#8fc9c3] bg-white shadow-[0_16px_34px_rgba(25,69,73,.07)]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[18px_18px_18px_6px] bg-[linear-gradient(90deg,#042b31_0%,#459c98_40%,#e37b58_70%,#f5d482_100%)] [mask-image:linear-gradient(#fff_0_0,#fff_3px,transparent_3px)] [-webkit-mask-image:linear-gradient(#fff_0_0,#fff_3px,transparent_3px)]"
                  />
                </div>
              )}
              <div className="relative z-20 max-md:!p-[18px_18px_17px] max-md:!flex max-md:!flex-col max-md:!bg-transparent">
                <div className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-v2-accent-text)]">
                  CRRO {id} · {crro.kind}
                </div>
                <div className={`mt-[14px] text-[15px] font-[850] leading-[1.3] transition-colors duration-200 ${isActive ? "text-[#042b31]" : "text-[var(--color-v2-text-strong)]"}`}>
                  {crro.tabTitle}
                </div>
                <div className={`mt-[6px] text-[10px] leading-[1.35] transition-colors duration-200 ${isActive ? "text-[#042b31]/75" : "text-[var(--color-v2-label)]"}`}>
                  {crro.tabType}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
