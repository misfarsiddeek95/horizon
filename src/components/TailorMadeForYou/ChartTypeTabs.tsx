"use client";

import { useCallback, useRef } from "react";

interface ChartTypeTabsProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

const tabs = [
  { id: "financial", label: "Financial" },
  { id: "non-financial", label: "Non-financial" },
];

export default function ChartTypeTabs({ activeType, onTypeChange }: ChartTypeTabsProps) {
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
      onTypeChange(tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    },
    [onTypeChange]
  );

  return (
    <div className="flex justify-center py-6">
      <div
        role="tablist"
        aria-label="Chart type"
        className="relative flex items-center p-1 rounded-full border-2 border-brand-main/30 bg-white/10 backdrop-blur-sm w-fit mx-auto"
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-brand-main rounded-full transition-transform duration-300 ease-out shadow-sm ${
            activeType === "non-financial" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeType;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              id={`charttype-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`charttype-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => onTypeChange(tab.id)}
              className={`relative z-10 w-36 px-4 py-2 text-center text-sm font-semibold transition-colors duration-300 whitespace-nowrap focus:outline-none rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-main focus-visible:ring-offset-2 ${
                isActive ? "text-content-inverse" : "text-v2-navy-deep hover:text-content-primary"
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
