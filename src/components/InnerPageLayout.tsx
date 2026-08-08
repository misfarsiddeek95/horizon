"use client";

import { ReactNode, useCallback, useRef } from "react";

interface Tab {
  id: string;
  label: string;
}

interface InnerPageLayoutProps {
  title: string;
  description?: string;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
}

export default function InnerPageLayout({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  children,
}: InnerPageLayoutProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!tabs || !activeTab || !onTabChange) return;

      const currentIndex = tabs.findIndex((t) => t.id === activeTab);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      onTabChange(tabs[nextIndex].id);

      const nextTab = tabListRef.current?.children[nextIndex] as HTMLElement;
      nextTab?.focus();
    },
    [tabs, activeTab, onTabChange]
  );

  return (
    <section>
      <div className="bg-brand-main">
        <div className="flex flex-col min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]">
          <div className="max-w-4xl mx-auto text-center px-4 pt-16 sm:pt-20 lg:pt-24">
            <h1 className="font-heading text-content-inverse text-2xl sm:text-3xl lg:text-4xl font-bold">
              {title}
            </h1>
            {description && (
              <p className="font-sans text-content-inverse/80 text-base sm:text-lg mt-3">
                {description}
              </p>
            )}
          </div>

          {tabs && tabs.length > 0 && onTabChange && (
            <div className="mt-auto pb-6">
              <div className="overflow-x-auto snap-x scrollbar-hide">
                <div
                  ref={tabListRef}
                  role="tablist"
                  aria-label="Page navigation"
                  className="flex justify-center gap-8 sm:gap-10 px-4"
                  onKeyDown={handleKeyDown}
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      tabIndex={activeTab === tab.id ? 0 : -1}
                      onClick={() => onTabChange(tab.id)}
                      className={`font-heading text-base sm:text-lg lg:text-xl pb-3 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-content-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-brand-main ${
                        activeTab === tab.id
                          ? "text-content-inverse border-b-4 border-content-inverse"
                          : "text-content-inverse/60 hover:text-content-inverse border-b-4 border-transparent"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </section>
  );
}
