import Image from "next/image";
import { useCallback, useRef } from "react";
import type { TabId } from "@/data/userProfiles";

interface UserProfileTabsV2Props {
  tabs: { id: TabId; title: string }[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

const TAB_GIFS: Record<TabId, string> = {
  shareholders: "/icons/user-profile/shareholders.gif",
  employees: "/icons/user-profile/employees.gif",
  customers: "/icons/user-profile/customers.gif",
  suppliers: "/icons/user-profile/suppliers.gif",
  generalUser: "/icons/user-profile/general_user.gif",
};

export default function UserProfileTabsV2({
  tabs,
  activeTab,
  onTabChange,
}: UserProfileTabsV2Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
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

  const handleSpotlightMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      e.currentTarget.style.setProperty("--spot-x", `${x}%`);
      e.currentTarget.style.setProperty("--spot-y", `${y}%`);
    },
    []
  );

  return (
    <div
      role="tablist"
      aria-label="Stakeholder profiles"
      className="flex flex-nowrap overflow-x-auto no-scrollbar px-2 md:px-4 snap-x snap-mandatory gap-1 md:gap-2"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseMove={handleSpotlightMove}
            className={`group relative flex shrink-0 snap-start cursor-pointer flex-col items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-center transition-all duration-300 persona-spotlight focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
              isActive
                ? "opacity-100 text-white"
                : "opacity-60 text-slate-300 hover:opacity-100 hover:text-white"
            }`}
          >
            <Image
              src={TAB_GIFS[tab.id]}
              alt=""
              aria-hidden="true"
              unoptimized
              width={96}
              height={96}
              className={`h-10 w-10 object-contain transition-all duration-500 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 ${
                isActive
                  ? "scale-110 brightness-125 drop-shadow-icon-glow"
                  : "scale-100 group-hover:scale-105"
              }`}
            />
            <span
              className={`text-[10px] md:text-xs lg:text-sm font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
                isActive ? "text-white" : "text-slate-300 group-hover:text-white"
              }`}
            >
              {tab.title}
            </span>
            <span
              aria-hidden="true"
              className={`absolute inset-x-3 md:inset-x-4 bottom-0 h-0.5 rounded-full bg-tab-active-border transition-all duration-500 ${
                isActive ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
