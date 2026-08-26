"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { CRROS_V2 } from "@/data/dashboardV2/crros";
import type { CrroId, PillarId, SectionId } from "@/data/dashboardV2/types";
import ActivateSection from "./ActivateSection";
import ClimateCrroDetail from "./ClimateCrroDetail";
import CrroTabs from "./CrroTabs";
import DashboardHero from "./DashboardHero";
import DashboardNav from "./DashboardNav";

export default function DashboardPageV2() {
  const [activePillar, setActivePillar] = useState<PillarId>("restore");
  const [activeCrro, setActiveCrro] = useState<CrroId>(1);
  const [activeSection, setActiveSection] = useState<SectionId>("intro");

  const handleNavigate = (id: SectionId) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="min-h-screen font-sans text-[var(--color-v2-ink)]"
      style={{
        background:
          "linear-gradient(180deg,#fbfcfd 0%,#f5f8f8 48%,#f8faf9 100%)",
      }}
    >
      <DashboardNav activeSection={activeSection} onNavigate={handleNavigate} />
      <DashboardHero onNavigate={handleNavigate} />

      <ActivateSection
        activePillar={activePillar}
        onPillarChange={setActivePillar}
      />

      <section
        id="climate"
        className="border-t border-[#e2eaed] px-[18px] py-[112px] sm:px-8"
        style={{
          background:
            "linear-gradient(180deg,#f1f6f7 0%,#f7faf9 62%,#ffffff 100%)",
        }}
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-[34px] grid grid-cols-1 items-start gap-[72px] lg:grid-cols-[minmax(0,1.25fr)_auto] lg:items-end">
            <div>
              <h2 className="mb-0 mt-[10px] font-heading text-[clamp(38px,4.2vw,58px)] font-medium leading-[1.02] tracking-[-0.025em] text-balance">
                S1 &amp; S2 Climate Risk &amp; Opportunity Outlook
              </h2>
              <p className="mb-0 mt-4 max-w-[590px] leading-[1.85] text-[var(--color-v2-text-muted)]">
                Explore Haycarb’s principal climate-related risks and
                opportunities in one connected view. Select a CRRO to
                understand why it matters, the factors considered, the
                estimated driver and financial-effect ranges, and the
                resilience implications across climate futures.
              </p>
            </div>
            <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
              <Button
                disabled
                variant="secondary"
                title="Final AR Disclosure URL required from client"
                className="min-h-[48px] disabled:opacity-100"
              >
                Annual Report Disclosure · link pending
              </Button>
            </div>
          </div>

          <CrroTabs active={activeCrro} onSelect={setActiveCrro} />

          <div key={activeCrro} className="animate-fade-in">
            <ClimateCrroDetail crro={CRROS_V2[activeCrro]} />
          </div>
        </div>
      </section>
    </div>
  );
}
