import { useCallback, useRef } from "react";
import { Lottie } from "lottie-react";
import type { TabId } from "@/data/userProfiles";

import shareholdersAnim from "@/../public/icons/user-profile/Shareholders.json";
import employeesAnim from "@/../public/icons/user-profile/Employees.json";
import customersAnim from "@/../public/icons/user-profile/Customers.json";
import suppliersAnim from "@/../public/icons/user-profile/Suppliers.json";
import generalUsersAnim from "@/../public/icons/user-profile/General Users.json";

interface UserProfileTabsV2Props {
  tabs: { id: TabId; title: string }[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  vertical?: boolean;
}

const TAB_ANIMATIONS: Record<TabId, object> = {
  shareholders: shareholdersAnim,
  employees: employeesAnim,
  customers: customersAnim,
  suppliers: suppliersAnim,
  generalUser: generalUsersAnim,
};

export default function UserProfileTabsV2({
  tabs,
  activeTab,
  onTabChange,
  vertical = false,
}: UserProfileTabsV2Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let newIndex = index;

      if (vertical) {
        if (e.key === "ArrowDown") {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowUp") {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        }
      } else {
        if (e.key === "ArrowRight") {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft") {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        }
      }

      if (e.key === "Home") {
        newIndex = 0;
      } else if (e.key === "End") {
        newIndex = tabs.length - 1;
      } else if (newIndex === index) {
        return;
      }

      e.preventDefault();
      onTabChange(tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    },
    [tabs, onTabChange, vertical]
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
      className={`flex overflow-y-auto no-scrollbar snap-mandatory gap-1 md:gap-2 ${
        vertical
          ? "flex-col items-center snap-y py-4"
          : "flex-nowrap overflow-x-auto px-2 md:px-4 snap-x"
      }`}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            type="button"
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
                ? "opacity-100 text-white bg-white/10 backdrop-blur-sm rounded-xl"
                : "opacity-60 text-slate-300 hover:opacity-100 hover:text-white hover:bg-white/5 rounded-xl"
            }`}
          >
            <div
              className={`h-10 w-10 transition-all duration-500 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 ${
                isActive
                  ? "scale-110 brightness-125 drop-shadow-icon-glow"
                  : "scale-100 group-hover:scale-105"
              }`}
            >
              <Lottie
                src={TAB_ANIMATIONS[tab.id]}
                loop={isActive}
                autoplay={isActive}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <span
              className={`text-[10px] md:text-xs lg:text-sm font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
                isActive ? "text-white" : "text-slate-300 group-hover:text-white"
              }`}
            >
              {tab.title}
            </span>
            {!vertical && (
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 md:inset-x-4 bottom-0 h-0.5 rounded-full bg-tab-active-border transition-all duration-500 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            )}
            {vertical && (
              <span
                aria-hidden="true"
                className={`absolute inset-y-3 md:inset-y-4 right-0 w-0.5 rounded-full bg-tab-active-border transition-all duration-500 ${
                  isActive ? "scale-y-100" : "scale-y-0"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
