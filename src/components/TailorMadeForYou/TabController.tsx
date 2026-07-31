"use client";

import { useCallback, useRef, useEffect } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabControllerProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabController({ tabs, activeTab, onTabChange }: TabControllerProps) {
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
      onTabChange(tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    },
    [tabs, onTabChange]
  );

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    if (activeIndex >= 0) {
      tabRefs.current[activeIndex]?.focus();
    }
  }, [activeTab, tabs]);

  return (
    <div
      role="tablist"
      aria-label="Main navigation"
      className="flex border-b border-zinc-200"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const commonProps = {
          ref: (el: HTMLButtonElement | null) => {
            tabRefs.current[index] = el;
          },
          role: "tab" as const,
          id: `tab-${tab.id}`,
          "aria-selected": isActive,
          "aria-controls": `tabpanel-${tab.id}`,
          tabIndex: isActive ? 0 : -1,
          onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
          className: `px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
            isActive
              ? "border-b-2 border-brand-main text-brand-main"
              : "text-content-primary/60 hover:text-content-primary hover:bg-surface-muted"
          }`,
        };

        return (
          <button
            key={tab.id}
            {...commonProps}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
