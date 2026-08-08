"use client";

import { useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import { META, PILLARS, TARGETS } from "@/data/activateDashboard";
import type { Target } from "@/data/activateDashboard";
import SummaryCards from "./SummaryCards";
import PillarTabs from "./PillarTabs";
import PillarHero from "./PillarHero";
import TargetsPanel from "./TargetsPanel";
import HighlightsSection from "./HighlightsSection";
import TargetDetailModal from "./TargetDetailModal";
import ClimateDashboardPage from "./ClimateDashboardPage";

const mainTabs = [
  { id: "activate", label: "Activate Dashboard" },
  { id: "climate", label: "Climate Dashboard" },
];

const PILLAR_NAMES = Object.keys(PILLARS) as (keyof typeof PILLARS)[];

export default function ActivateDashboardPage() {
  const [activeTab, setActiveTab] = useState("activate");
  const [activePillar, setActivePillar] = useState(PILLAR_NAMES[0]);
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);

  const pillar = PILLARS[activePillar];
  const pillarTargets = TARGETS.filter((t) => t.pillar === activePillar);

  return (
    <InnerPageLayout
      title="Dashboard"
      description={`Progress towards 2030 targets and ${META.reportingYear} highlights`}
      tabs={mainTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "activate" && (
        <>
          {/* Title zone with PDF buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 pb-4">
            <div>
              <h1 className="font-heading text-brand-main text-[40px] leading-[1.05] tracking-[-0.035em]">
                ACTIVATE 2030 Progress
              </h1>
              <p className="text-[#41516A] text-base mt-2">
                Progress towards 2030 targets and {META.reportingYear} highlights
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href="https://www.haycarb.com/wp-content/uploads/2025/07/ACTIVATE-Haycarb-PLC-ESG-Roadmap-2030.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#D2DDE6] bg-white text-[#071D43] rounded-lg px-3 py-2 text-xs font-extrabold hover:bg-[#F2F6F8] transition-colors whitespace-nowrap"
              >
                Activate Roadmap ↗
              </a>
              <a
                href="https://www.haycarb.com/wp-content/uploads/2026/07/Sustainability-Impact-Report-July.2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#D2DDE6] bg-white text-[#071D43] rounded-lg px-3 py-2 text-xs font-extrabold hover:bg-[#F2F6F8] transition-colors whitespace-nowrap"
              >
                ESG Impact Report ↗
              </a>
            </div>
          </div>

          <SummaryCards />

          <PillarTabs
            activePillar={activePillar}
            onPillarChange={setActivePillar}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(245px,0.78fr)_minmax(570px,2fr)] gap-3.5 items-stretch">
            <PillarHero pillar={pillar} pillarName={activePillar} />
            <TargetsPanel
              targets={pillarTargets}
              pillar={pillar}
              pillarName={activePillar}
              onSelectTarget={setSelectedTarget}
            />
          </div>

          <HighlightsSection pillar={pillar} />
        </>
      )}

      {activeTab === "climate" && <ClimateDashboardPage />}

      {selectedTarget && (
        <TargetDetailModal
          target={selectedTarget}
          pillar={PILLARS[selectedTarget.pillar]}
          onClose={() => setSelectedTarget(null)}
        />
      )}
    </InnerPageLayout>
  );
}
