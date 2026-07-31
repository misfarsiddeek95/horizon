"use client";

import { useCallback, useRef } from "react";

interface ChartTypeTabsProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

export default function ChartTypeTabs({ activeType, onTypeChange }: ChartTypeTabsProps) {
  const tabs = [
    { id: "financial", label: "Financial" },
    { id: "non-financial", label: "Non-financial" },
  ];

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
    [tabs, onTypeChange]
  );

  return (
    <div
      role="tablist"
      aria-label="Chart type"
      className="flex flex-wrap gap-2 py-4"
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
            className={`px-6 py-2 rounded-ui-element text-sm font-medium transition-all min-h-[44px] cursor-pointer ${
              isActive
                ? "bg-brand-main text-content-inverse"
                : "bg-surface-muted text-content-primary hover:bg-surface-default"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}