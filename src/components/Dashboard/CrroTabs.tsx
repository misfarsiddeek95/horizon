"use client";

import { CRROS_V2, CRRO_IDS } from "@/data/dashboard/crros";
import type { CrroId } from "@/data/dashboard/types";
import { moveTabFocus } from "./tabKeyboard";

interface CrroTabsProps {
  active: CrroId;
  onSelect: (id: CrroId) => void;
}

export default function CrroTabs({ active, onSelect }: CrroTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Climate risks and opportunities"
      className="mb-[26px] grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
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
            className={`relative min-h-[128px] cursor-pointer overflow-hidden rounded-[18px_18px_18px_6px] border bg-white/[.78] p-[18px_18px_17px] text-left transition-all duration-200 hover:bg-[rgba(226,241,239,.42)] ${
              isActive
                ? "border-[#8fc9c3] bg-white shadow-[0_16px_34px_rgba(25,69,73,.07)]"
                : "border-[#d9e4e5] shadow-[0_10px_26px_rgba(25,69,73,.03)]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-[3px] bg-[var(--color-v2-accent)] ${
                isActive ? "opacity-100" : "opacity-20"
              }`}
            />
            <div className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-v2-accent-text)]">
              CRRO {id} · {crro.kind}
            </div>
            <div className="mt-[14px] text-[15px] font-[850] leading-[1.3] text-[var(--color-v2-text-strong)]">
              {crro.tabTitle}
            </div>
            <div className="mt-[6px] text-[10px] leading-[1.35] text-[var(--color-v2-label)]">
              {crro.tabType}
            </div>
          </button>
        );
      })}
    </div>
  );
}
