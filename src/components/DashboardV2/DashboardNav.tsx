"use client";

import type { SectionId } from "@/data/dashboardV2/types";

interface DashboardNavProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "intro", label: "Overview" },
  { id: "activate", label: "ACTIVATE 2030" },
  { id: "climate", label: "S1 & S2 Climate Outlook" },
];

export default function DashboardNav({
  activeSection,
  onNavigate,
}: DashboardNavProps) {
  return (
    <nav
      className="sticky top-0 z-40 border-b border-[var(--color-v2-nav-border)] bg-[var(--color-v2-nav-glass)] backdrop-blur-[22px] backdrop-saturate-[140%]"
      aria-label="Dashboard sections"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-[28px] px-[18px] py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3 text-[16px] font-extrabold tracking-[0.02em]">
          <span
            className="grid h-[38px] w-[38px] place-items-center rounded-[14px_14px_14px_4px] text-[18px] text-white shadow-[0_8px_24px_rgba(19,123,114,.14)]"
            style={{
              background: "linear-gradient(145deg,#62b86b 0%,#137b72 70%)",
            }}
            aria-hidden="true"
          >
            ⌁
          </span>
          <span>
            HAYCARB{" "}
            <span className="font-medium text-[var(--color-v2-label)]">
              Sustainability
            </span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-[var(--color-v2-navlink-border)] bg-[var(--color-v2-navlink-bg)] p-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeSection;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`cursor-pointer rounded-full px-[15px] py-2.5 font-bold transition-colors duration-200 ${
                  isActive
                    ? "bg-white text-[var(--color-v2-navlink-active)] shadow-[0_3px_12px_rgba(27,72,70,.08)]"
                    : "bg-transparent text-[var(--color-v2-navlink-text)] hover:text-[var(--color-v2-navlink-active)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
