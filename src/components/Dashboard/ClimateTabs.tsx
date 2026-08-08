"use client";

import { useCallback, useRef } from "react";

interface ClimateTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const tabs = [
  { id: "risks", label: "Risks" },
  { id: "opportunities", label: "Opportunities" },
];

export default function ClimateTabs({
  activeCategory,
  onCategoryChange,
}: ClimateTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index;

      if (e.key === "ArrowRight") {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        newIndex = 0;
      } else if (e.key === "End") {
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      onCategoryChange(tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    },
    [onCategoryChange]
  );

  return (
    <div className="flex justify-center py-4">
      <div
        role="tablist"
        aria-label="Climate dashboard category"
        className="flex gap-2 bg-[#F5F8FB] p-1 rounded-[12px]"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeCategory;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`climate-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`climate-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => onCategoryChange(tab.id)}
              className={`px-6 py-2.5 rounded-[10px] text-sm font-bold transition-all min-h-[44px] cursor-pointer ${
                isActive
                  ? "bg-brand-main text-content-inverse shadow-sm"
                  : "text-[#4C5C70] hover:bg-white hover:text-[#071D43]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
