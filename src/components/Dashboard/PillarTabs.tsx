"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { PILLAR_ICONS, PILLARS_V2, PILLAR_IDS } from "@/data/dashboard/pillars";
import type { PillarId } from "@/data/dashboard/types";
import { moveTabFocus } from "./tabKeyboard";

interface PillarTabsProps {
  active: PillarId;
  onSelect: (id: PillarId) => void;
}

const GLIDE_EASE = "cubic-bezier(0.25,1,0.5,1)";

export default function PillarTabs({ active, onSelect }: PillarTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
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
        aria-label="ACTIVATE pillars"
        className="relative mb-[82px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 max-md:!flex max-md:!flex-row max-md:!overflow-x-auto max-md:!flex-nowrap max-md:!snap-x max-md:!snap-mandatory max-md:!scrollbar-hide max-md:!gap-3 max-md:!px-4 max-md:!pb-6"
      >
        {/* Desktop: sliding indicator */}
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute z-10 rounded-2xl border border-[#8fc9c3] bg-white/75 shadow-xl backdrop-blur-md"
          style={{
            width: indicator.width,
            height: indicator.height,
            transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0)`,
            transition: `transform 0.45s ${GLIDE_EASE}, width 0.45s ${GLIDE_EASE}, height 0.45s ${GLIDE_EASE}`,
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,#042b31_0%,#459c98_40%,#e37b58_70%,#f5d482_100%)] [mask-image:linear-gradient(transparent_0,transparent_calc(100%-6px),#fff_calc(100%-6px),#fff_100%)] [-webkit-mask-image:linear-gradient(transparent_0,transparent_calc(100%-6px),#fff_calc(100%-6px),#fff_100%)]"
          />
        </div>

        {PILLAR_IDS.map((id) => {
          const pillar = PILLARS_V2[id];
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
              onKeyDown={(event) => moveTabFocus(event, (index) => onSelect(PILLAR_IDS[index]))}
              className="relative cursor-pointer rounded-2xl border border-white/50 bg-white/30 p-4 text-left transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white/40 max-md:!relative max-md:!m-0 max-md:!p-0 max-md:!w-[160px] max-md:!min-w-[160px] max-md:!flex-shrink-0 max-md:!overflow-visible max-md:!snap-center"
            >
              {/* Mobile: inline active background */}
              {isActive && (
                <div
                  aria-hidden="true"
                  className="md:hidden absolute inset-0 z-0 rounded-xl border border-[#8fc9c3] bg-white/75 shadow-xl backdrop-blur-md"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(90deg,#042b31_0%,#459c98_40%,#e37b58_70%,#f5d482_100%)] [mask-image:linear-gradient(transparent_0,transparent_calc(100%-6px),#fff_calc(100%-6px),#fff_100%)] [-webkit-mask-image:linear-gradient(transparent_0,transparent_calc(100%-6px),#fff_calc(100%-6px),#fff_100%)]"
                  />
                </div>
              )}
              <div className="relative z-10 w-full h-full max-md:!p-4 max-md:!flex max-md:!flex-col max-md:!bg-transparent">
                <span
                  className="grid h-9 w-9 place-items-center overflow-hidden rounded-full font-black text-white"
                  style={{ background: pillar.accent }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PILLAR_ICONS[id]} alt="" aria-hidden="true" className="h-full w-full object-contain" />
                </span>
                <div className={`mt-[9px] text-[13px] transition-colors duration-200 ${isActive ? "font-bold text-[#042b31]" : "font-black text-[#042b31]"}`}>
                  {pillar.name}
                </div>
                <div className={`mt-[3px] text-[11px] transition-colors duration-200 ${isActive ? "font-medium text-[#042b31]/80" : "text-[#042b31]/75"}`}>
                  {pillar.descriptor}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
