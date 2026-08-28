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
      <div className="relative overflow-hidden">
        <svg className="absolute inset-0 w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="horizon-texture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                seed="2"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="saturate"
                values="0"
                result="monoNoise"
              />
              <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply" result="textured" />
              <feComponentTransfer in="textured">
                <feFuncA type="linear" slope="1" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0a2a3a 0%, #0f3d4e 15%, #147385 35%, #1a6b5c 50%, #c45e20 70%, #e8943a 82%, #f5c842 92%, #fde68a 100%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-30 transform-gpu backface-hidden translate-z-0"
          style={{ filter: "url(#horizon-texture)" }}
        />

        <div className="absolute bottom-[36%] left-1/2 -translate-x-1/2">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[360px] lg:h-[360px] rounded-full opacity-50 transform-gpu backface-hidden translate-z-0"
            style={{
              background: "radial-gradient(circle, rgba(255,180,60,0.8) 0%, rgba(255,140,40,0.4) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 animate-sun-glow" />
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-[40%]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c45e20" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#a04420" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#7a3018" />
              <stop offset="100%" stopColor="#5a2010" />
            </linearGradient>
          </defs>
          <path
            d="M0,128 C180,80 360,180 540,140 C720,100 900,190 1080,150 C1200,120 1350,160 1440,140 L1440,320 L0,320 Z"
            fill="url(#wave-gradient)"
          />
          <path
            d="M0,180 C200,140 400,200 600,170 C800,140 1000,210 1200,180 C1350,160 1400,190 1440,180 L1440,320 L0,320 Z"
            fill="url(#wave-gradient)"
            opacity="0.6"
          />
        </svg>

        <svg
          className="absolute top-[15%] left-[5%] animate-cloud-drift opacity-30"
          width="180"
          height="60"
          viewBox="0 0 180 60"
          fill="none"
          aria-hidden="true"
        >
          <ellipse cx="60" cy="35" rx="55" ry="20" fill="white" />
          <ellipse cx="100" cy="28" rx="45" ry="22" fill="white" />
          <ellipse cx="130" cy="35" rx="40" ry="18" fill="white" />
        </svg>

        <svg
          className="absolute top-[22%] right-[8%] animate-cloud-drift-slow opacity-20"
          width="140"
          height="50"
          viewBox="0 0 140 50"
          fill="none"
          aria-hidden="true"
        >
          <ellipse cx="45" cy="30" rx="40" ry="16" fill="white" />
          <ellipse cx="80" cy="24" rx="38" ry="18" fill="white" />
          <ellipse cx="105" cy="30" rx="30" ry="14" fill="white" />
        </svg>

        <svg
          className="absolute top-[10%] left-[55%] animate-cloud-drift opacity-15"
          width="120"
          height="40"
          viewBox="0 0 120 40"
          fill="none"
          aria-hidden="true"
        >
          <ellipse cx="35" cy="24" rx="30" ry="14" fill="white" />
          <ellipse cx="65" cy="20" rx="32" ry="16" fill="white" />
          <ellipse cx="90" cy="24" rx="25" ry="12" fill="white" />
        </svg>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col min-h-[460px] sm:min-h-[500px] lg:min-h-[540px]">
          <div className="max-w-4xl mx-auto text-center px-4 pt-16 sm:pt-20 lg:pt-24">
            <h1 className="font-heading text-content-inverse text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">
              {title}
            </h1>
            {description && (
              <p className="font-sans text-content-inverse/80 text-base sm:text-lg mt-3 drop-shadow-md">
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
                      className={`font-heading text-base sm:text-lg lg:text-xl pb-3 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-content-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-brand-main drop-shadow-md ${
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
