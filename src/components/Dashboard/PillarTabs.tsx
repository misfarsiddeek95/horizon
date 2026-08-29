"use client";

import { PILLAR_ICONS, PILLARS_V2, PILLAR_IDS } from "@/data/dashboard/pillars";
import type { PillarId } from "@/data/dashboard/types";
import { moveTabFocus } from "./tabKeyboard";

interface PillarTabsProps {
  active: PillarId;
  onSelect: (id: PillarId) => void;
}

export default function PillarTabs({ active, onSelect }: PillarTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="ACTIVATE pillars"
      className="mb-[82px] grid grid-cols-1 border-y border-[var(--color-v2-border)] sm:grid-cols-2 lg:grid-cols-5"
    >
      {PILLAR_IDS.map((id) => {
        const pillar = PILLARS_V2[id];
        const isActive = id === active;
        return (
          <button
            key={id}
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
            className={`relative cursor-pointer border-b border-[var(--color-v2-border-light)] p-[28px_20px] text-left transition-all duration-300 ease-out last:border-b-0 hover:bg-[rgba(226,241,239,.42)] sm:max-lg:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 ${
              isActive ? "" : "bg-transparent"
            }`}
            style={
              isActive
                ? {
                    background:
                      "linear-gradient(180deg,var(--color-v2-wash-active-from),var(--color-v2-wash-active-to))",
                  }
                : undefined
            }
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[var(--color-v2-accent)] transition-all duration-300 ease-out ${
                isActive ? "scale-x-100" : "scale-x-0"
              }`}
            />
            <span
              className="grid h-9 w-9 place-items-center overflow-hidden rounded-full font-black text-white transition-all duration-300 ease-out"
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
            <div className="mt-[9px] text-[13px] font-black transition-colors duration-200">
              {pillar.name}
            </div>
            <div className="mt-[3px] text-[11px] text-[#042b31]/75 transition-colors duration-200">
              {pillar.descriptor}
            </div>
          </button>
        );
      })}
    </div>
  );
}
