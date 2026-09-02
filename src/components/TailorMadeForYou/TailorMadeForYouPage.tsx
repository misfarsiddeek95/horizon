"use client";

import { useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import ChartTypeTabs from "./ChartTypeTabs";
import ProfitabilityChart from "./Financial/ProfitabilityChart";
import FinancialPositionChart from "./Financial/FinancialPositionChart";
import FinancialRatiosChart from "./Financial/FinancialRatiosChart";
import EmissionsEnergyChart from "./NonFinancial/EmissionsEnergyChart";
import MaterialsWaterChart from "./NonFinancial/MaterialsWaterChart";
import SocialGovernanceChart from "./NonFinancial/SocialGovernanceChart";
import ReportGenerator from "@/components/ReportGenerator";

const mainTabs = [
  { id: "chart-generator", label: "Chart Generator" },
  { id: "generate-report", label: "Generate Your Own Report" },
];

export default function TailorMadeForYouPage() {
  const [activeTab, setActiveTab] = useState("chart-generator");
  const [activeChartType, setActiveChartType] = useState("financial");

  return (
    <InnerPageLayout
      title="Tailor Made For You"
      description="Explore your company's performance with interactive charts and reports."
      tabs={mainTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      backgroundImage="/images/innerpage/tailer-made-for-you-banner.jpg"
    >
      {activeTab === "chart-generator" && (
        <>
          <ChartTypeTabs
            activeType={activeChartType}
            onTypeChange={setActiveChartType}
          />
          <div className="mt-8 space-y-8">
            {activeChartType === "financial" ? (
              <>
                <ProfitabilityChart />
                <FinancialPositionChart />
                <FinancialRatiosChart />
              </>
            ) : (
              <>
                <EmissionsEnergyChart />
                <MaterialsWaterChart />
                <SocialGovernanceChart />
              </>
            )}
          </div>
        </>
      )}
      {activeTab === "generate-report" && <ReportGenerator />}
    </InnerPageLayout>
  );
}
