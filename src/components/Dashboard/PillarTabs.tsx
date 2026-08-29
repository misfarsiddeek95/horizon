"use client";

import { useEffect, useRef, useState } from "react";
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
  const [indicator, setIndicator] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = buttonRefs.current[active];
    const container = containerRef.current;
    if (!el || !container) return;

    const measure = () => {
      const cRect = container.getBoundingClientRect();
      const bRect = el.getBoundingClientRect();
      setIndicator({
        x: bRect.left - cRect.left,
        y: bRect.top - cRect.top,
        width: bRect.width,
        height: bRect.height,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="ACTIVATE pillars"
      className="relative mb-[82px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {/* Sliding active indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 rounded-2xl border border-[#8fc9c3] bg-white/75 shadow-xl backdrop-blur-md"
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
            ref={(node) => {
              buttonRefs.current[id] = node;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(id)}
            onKeyDown={(event) =>
              moveTabFocus(
                event,
                (index) => onSelect(PILLAR_IDS[index])
              )
            }
            className={`relative cursor-pointer rounded-2xl border border-white/50 bg-white/30 p-4 text-left transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white/40`}
          >
            <div className="relative z-20">
              <span
                className="grid h-9 w-9 place-items-center overflow-hidden rounded-full font-black text-white"
                style={{ background: pillar.accent }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PILLAR_ICONS[id]}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
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
  );
}
