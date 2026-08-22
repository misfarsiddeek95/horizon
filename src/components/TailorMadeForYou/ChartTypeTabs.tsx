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
        className="inline-flex gap-1 bg-surface-muted/80 p-1.5 rounded-ui-card shadow-sm ring-1 ring-content-primary/10"
      >
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
              className={`px-8 py-3 rounded-ui-element text-base font-bold transition-all min-h-[48px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted ${
                isActive
                  ? "bg-brand-main text-content-inverse shadow-md"
                  : "bg-surface-default text-content-primary hover:bg-brand-main/10 hover:text-brand-main ring-1 ring-content-primary/15"
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