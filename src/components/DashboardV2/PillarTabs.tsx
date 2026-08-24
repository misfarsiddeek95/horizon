"use client";

import { PILLAR_ICONS, PILLARS_V2, PILLAR_IDS } from "@/data/dashboardV2/pillars";
import type { PillarId } from "@/data/dashboardV2/types";
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
            className={`cursor-pointer border-b border-[var(--color-v2-border-light)] p-[28px_20px] text-left transition-colors duration-200 last:border-b-0 hover:bg-[rgba(226,241,239,.42)] sm:max-lg:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 ${
              isActive ? "" : "bg-transparent"
            }`}
            style={
              isActive
                ? {
                    background:
                      "linear-gradient(180deg,var(--color-v2-wash-active-from),var(--color-v2-wash-active-to))",
                    boxShadow:
                      "inset 0 -3px 0 var(--color-v2-accent)",
                  }
                : undefined
            }
          >
            <span
              className="grid h-9 w-9 place-items-center overflow-hidden rounded-[13px_13px_13px_4px] font-black text-white"
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
            <div className="mt-[9px] text-[13px] font-black">{pillar.name}</div>
            <div className="mt-[3px] text-[11px] text-[var(--color-v2-text-soft)]">
              {pillar.descriptor}
            </div>
          </button>
        );
      })}
    </div>
  );
}
