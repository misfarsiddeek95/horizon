"use client";

import { useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import { PROFILE_TABS, type TabId } from "@/data/userProfiles";
import UserProfileTabs from "./UserProfileTabs";
import MetricsBand from "./MetricsBand";
import ChairmanSection from "./ChairmanSection";
import GovernanceStrategySection from "./GovernanceStrategySection";
import StrategyImageSection from "./StrategyImageSection";
import KeyFeaturesBanner from "./KeyFeaturesBanner";

const TAB_LABELS = PROFILE_TABS.map((tab) => ({
  id: tab.id,
  title: tab.title,
}));

function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
    >
      <div className="absolute bottom-0 -left-60 h-[700px] w-[700px] rounded-full bg-cyan-500 opacity-30 blur-[120px] transform-gpu backface-hidden translate-z-0" />
    </div>
  );
}

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("shareholders");

  const tab = PROFILE_TABS.find((t) => t.id === activeTab) ?? PROFILE_TABS[0];

  const isGeneralUser = activeTab === "generalUser";

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden">
      <AmbientGlow />
      <InnerPageLayout
        title="User Profiles"
        description="Explore Haycarb through the lens that matters to you — performance, strategy, and sustainable value creation."
      >
        <UserProfileTabs
          tabs={TAB_LABELS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="relative z-10 flex w-full flex-col gap-12 md:gap-16">
          <div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="animate-user-profile-in flex w-full flex-col gap-12 md:gap-16"
          >
            {tab.intro && (
              <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-600 sm:text-xl">
                {tab.intro}
              </p>
            )}

          <MetricsBand groups={tab.metricGroups} />

          {tab.message && (
            <ChairmanSection title={tab.message.title} text={tab.message.text} />
          )}

          <GovernanceStrategySection
            governance={tab.governance}
            highlights={tab.highlights}
            strategy={tab.strategy}
          />

          {tab.strategyImage && (
            <StrategyImageSection
              title={tab.strategyImage.title}
              image={tab.strategyImage.image}
              caption={tab.strategyImage.caption}
              isGeneralUser={isGeneralUser}
            />
          )}
        </div>

        <KeyFeaturesBanner />
        </div>
      </InnerPageLayout>
    </div>
  );
}
