"use client";

import { PILLAR_ICONS, PILLARS_V2, PILLAR_IDS } from "@/data/dashboardV2/pillars";
import type { PillarId } from "@/data/dashboardV2/types";
import { moveTabFocus } from "../DashboardV2/tabKeyboard";

interface PillarClusterProps {
  active: PillarId;
  onSelect: (id: PillarId) => void;
}

export default function PillarCluster({ active, onSelect }: PillarClusterProps) {
  return (
    <div
      role="tablist"
      aria-label="ACTIVATE pillars"
      className="flex flex-wrap gap-3"
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
              moveTabFocus(event, (index) => onSelect(PILLAR_IDS[index]))
            }
            className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-full border px-4 py-2.5 text-left backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl ${
              isActive
                ? "border-white/30 bg-white/20 text-white shadow-2xl"
                : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            style={
              isActive
                ? { boxShadow: "inset 0 -3px 0 var(--color-mint)" }
                : undefined
            }
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-white/25 bg-white/10 p-[3px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PILLAR_ICONS[id]}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-black leading-tight">
                {pillar.name}
              </span>
              <span className="block truncate text-[11px] text-white/60">
                {pillar.descriptor}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
