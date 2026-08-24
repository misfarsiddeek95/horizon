"use client";

import {
  BoltIcon,
  GlobeAltIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import type { SectionId } from "@/data/dashboardV2/types";

interface SidebarNavProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

const NAV_ITEMS: { id: SectionId; label: string; short: string; Icon: typeof BoltIcon }[] = [
  { id: "intro", label: "Overview", short: "Overview", Icon: Squares2X2Icon },
  { id: "activate", label: "ACTIVATE 2030", short: "ACTIVATE 2030", Icon: BoltIcon },
  {
    id: "climate",
    label: "S1 & S2 Climate Outlook",
    short: "Climate Outlook",
    Icon: GlobeAltIcon,
  },
];

const GLASS_PILL =
  "flex items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl cursor-pointer";

export default function SidebarNav({
  activeSection,
  onNavigate,
}: SidebarNavProps) {
  return (
    <>
      <nav
        aria-label="Dashboard sections"
        className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-white/20 bg-white/10 px-5 pb-6 backdrop-blur-xl lg:flex"
      >
        <div className="mt-20 flex flex-col gap-2">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = id === activeSection;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? "true" : undefined}
                className={`${GLASS_PILL} px-4 py-3 text-left text-[13px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white shadow-2xl"
                    : "border-white/10 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-auto rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
          <div className="text-[10px] font-[850] uppercase tracking-[0.13em] text-white/60">
            Reporting year
          </div>
          <div className="mt-1 text-[18px] font-semibold">FY 2025/26</div>
        </div>
      </nav>

      <nav
        aria-label="Dashboard sections"
        className="sticky top-24 z-40 mx-4 flex items-center gap-2 overflow-x-auto rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-xl lg:hidden"
      >
        {NAV_ITEMS.map(({ id, short, Icon }) => {
          const isActive = id === activeSection;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? "true" : undefined}
              className={`${GLASS_PILL} whitespace-nowrap px-4 py-2 text-[12px] font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "border-transparent bg-transparent text-white/70"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {short}
            </button>
          );
        })}
      </nav>
    </>
  );
}
