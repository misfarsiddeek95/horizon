"use client";

import { CRROS_V2, CRRO_IDS } from "@/data/dashboardV2/crros";
import type { CrroId } from "@/data/dashboardV2/types";
import { moveTabFocus } from "../DashboardV2/tabKeyboard";

interface CrroClusterProps {
  active: CrroId;
  onSelect: (id: CrroId) => void;
}

export default function CrroCluster({ active, onSelect }: CrroClusterProps) {
  return (
    <div
      role="tablist"
      aria-label="Climate risks and opportunities"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {CRRO_IDS.map((id) => {
        const crro = CRROS_V2[id];
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
              moveTabFocus(event, (index) => onSelect(CRRO_IDS[index]))
            }
            className={`relative min-h-[124px] cursor-pointer overflow-hidden rounded-3xl border p-5 text-left backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl ${
              isActive
                ? "border-white/30 bg-white/20 text-white shadow-2xl"
                : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-[3px] bg-[var(--color-mint)] transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-30"
              }`}
            />
            <span className="block text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-mint)]">
              CRRO {id} · {crro.kind}
            </span>
            <span className="mb-0 mt-3 block text-[15px] font-[850] leading-[1.3]">
              {crro.tabTitle}
            </span>
            <span className="mb-0 mt-1.5 block text-[11px] leading-[1.4] text-white/60">
              {crro.tabType}
            </span>
          </button>
        );
      })}
    </div>
  );
}
