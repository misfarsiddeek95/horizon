"use client";

import { useState } from "react";
import HeroBanner from "./HeroBanner";
import TabController from "./TabController";
import ChartTypeTabs from "./ChartTypeTabs";
import ProfitabilityChart from "./Financial/ProfitabilityChart";
import FinancialPositionChart from "./Financial/FinancialPositionChart";
import FinancialRatiosChart from "./Financial/FinancialRatiosChart";
import EmissionsChart from "./NonFinancial/EmissionsChart";
import EnergyConsumptionChart from "./NonFinancial/EnergyConsumptionChart";
import MaterialsWaterChart from "./NonFinancial/MaterialsWaterChart";
import SocialGovernanceChart from "./NonFinancial/SocialGovernanceChart";
import ReportGenerator from "@/components/ReportGenerator";

const mainTabs = [
  { id: "chart-generator", label: "Chart Generator" },
  { id: "generate-report", label: "Generate your own report" },
];

export default function TailorMadeForYouPage() {
  const [activeTab, setActiveTab] = useState("chart-generator");
  const [activeChartType, setActiveChartType] = useState("financial");

  return (
    <div className="min-h-screen">
      <HeroBanner />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TabController tabs={mainTabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "chart-generator" && (
          <div role="tabpanel" id="tabpanel-chart-generator" aria-labelledby="tab-chart-generator">
            <ChartTypeTabs activeType={activeChartType} onTypeChange={setActiveChartType} />

            <div className="py-6 space-y-8">
              {activeChartType === "financial" ? (
                <>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Earnings and Profitability (Rs. Bn)
                    </h2>
                    <ProfitabilityChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Financial Position (Rs. Bn)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <FinancialPositionChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Financial Ratios
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <FinancialRatiosChart />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Emissions (tCO2e)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <EmissionsChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Energy Consumption (GJ)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <EnergyConsumptionChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Materials (MT) and Water Management (m<sup>3</sup>)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <MaterialsWaterChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Social and Governance Performance
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <SocialGovernanceChart />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "generate-report" && (
          <div role="tabpanel" id="tabpanel-generate-report" aria-labelledby="tab-generate-report" className="py-6">
            <ReportGenerator />
          </div>
        )}
      </div>
    </div>
  );
}
