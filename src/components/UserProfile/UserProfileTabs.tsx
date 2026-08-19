import Image from "next/image";
import { useCallback, useRef } from "react";
import type { TabId } from "@/data/userProfiles";

interface UserProfileTabsProps {
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

export default function UserProfileTabs({
  tabs,
  activeTab,
  onTabChange,
}: UserProfileTabsProps) {
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

  return (
    <div
      role="tablist"
      aria-label="Stakeholder profiles"
      className="flex w-full flex-nowrap justify-start overflow-x-auto px-4 pb-4 pt-4 snap-x hide-scrollbar gap-3 after:content-[''] after:w-4 after:shrink-0 sm:gap-4 xl:justify-center xl:after:w-0 xl:px-0"
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
            className={`group relative flex shrink-0 snap-start cursor-pointer flex-col items-center gap-2 px-6 py-3 text-center transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-main focus-visible:ring-offset-2 ${
              isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={TAB_GIFS[tab.id]}
              alt=""
              aria-hidden="true"
              unoptimized
              width={96}
              height={96}
              className={`h-20 w-20 object-contain transition-transform duration-500 sm:h-24 sm:w-24 ${
                isActive ? "scale-110" : "scale-100 group-hover:scale-105"
              }`}
            />
            <span
              className={`text-base font-semibold tracking-wide transition-colors duration-300 sm:text-lg ${
                isActive ? "text-brand-main" : "text-slate-500 group-hover:text-brand-main"
              }`}
            >
              {tab.title}
            </span>
            <span
              aria-hidden="true"
              className={`absolute inset-x-6 bottom-0 h-1 rounded-full bg-brand-main transition-all duration-500 ${
                isActive ? "animate-user-profile-grow" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
