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

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("shareholders");

  const tab = PROFILE_TABS.find((t) => t.id === activeTab) ?? PROFILE_TABS[0];

  const isGeneralUser = activeTab === "generalUser";

  return (
    <InnerPageLayout
      title="User Profiles"
      description="Explore Haycarb through the lens that matters to you — performance, strategy, and sustainable value creation."
    >
      <UserProfileTabs
        tabs={TAB_LABELS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex w-full flex-col gap-8 md:gap-12">
        <div
          key={activeTab}
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="animate-user-profile-in flex w-full flex-col gap-8 md:gap-12"
        >
          {tab.intro && (
            <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-600 sm:text-xl animate-user-profile-fade-up">
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
  );
}
