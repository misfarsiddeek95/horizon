"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import { CRROS_V2 } from "@/data/dashboardV2/crros";
import {
  ACTIVATE_ROADMAP_URL,
  PILLARS_V2,
} from "@/data/dashboardV2/pillars";
import type { CrroId, PillarId, SectionId } from "@/data/dashboardV2/types";
import ClimatePanel from "./ClimatePanel";
import CrroCluster from "./CrroCluster";
import KpiCards from "./KpiCards";
import PillarCluster from "./PillarCluster";
import PillarPanel from "./PillarPanel";
import SidebarNav from "./SidebarNav";
import WelcomeWidget from "./WelcomeWidget";

export default function DashboardPageV3() {
  const [activeSection, setActiveSection] = useState<SectionId>("intro");
  const [activePillar, setActivePillar] = useState<PillarId>("restore");
  const [activeCrro, setActiveCrro] = useState<CrroId>(1);

  const handleNavigate = (id: SectionId) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen font-sans text-white">
      <div
        className="fixed inset-0 -z-20"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(160deg,#147385 0%,#0f5c6b 45%,#1c5e70 100%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 85% 12%,var(--color-spotlight-center),transparent 32%),radial-gradient(circle at 8% 85%,var(--color-aura-center),transparent 38%)",
        }}
      />

      <div className="mx-auto flex max-w-[1560px] flex-col lg:flex-row">
        <SidebarNav
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main className="min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-8 lg:pt-10">
          <section id="intro" className="scroll-mt-24">
            <WelcomeWidget onNavigate={handleNavigate} />
          </section>

          <section id="activate" className="mt-14 scroll-mt-24">
            <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-[720px]">
                <h2 className="mb-0 mt-0 font-heading text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.05] tracking-[-0.02em] text-balance">
                  Progress towards 2030
                </h2>
                <p className="mb-0 mt-4 text-[14px] leading-[1.8] text-white/75">
                  ACTIVATE 2030 translates our sustainability ambitions into
                  measurable action across five pillars. Explore this year’s
                  progress, impact metrics, target status and featured stories.
                </p>
              </div>
              <div className="flex w-full flex-wrap gap-3 lg:w-auto">
                <Button
                  behavior="link"
                  href={ACTIVATE_ROADMAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  icon={<ArrowUpRightIcon className="h-4 w-4" />}
                  className="!border-white/30 !bg-white/15 !text-white backdrop-blur-xl hover:!bg-white/25"
                >
                  ACTIVATE 2030
                </Button>
                <Button
                  disabled
                  variant="outline"
                  title="Final AR Disclosure URL required from client"
                  className="!border-white/15 !bg-white/5 !text-white/50"
                >
                  AR Disclosure · link pending
                </Button>
              </div>
            </div>
            <KpiCards />
            <div className="mt-10">
              <PillarCluster active={activePillar} onSelect={setActivePillar} />
              <div key={activePillar} className="animate-fade-in mt-8">
                <PillarPanel pillar={PILLARS_V2[activePillar]} />
              </div>
            </div>
          </section>

          <section id="climate" className="mt-14 scroll-mt-24">
            <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-[720px]">
                <h2 className="mb-0 mt-0 font-heading text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.05] tracking-[-0.02em] text-balance">
                  S1 &amp; S2 Climate Risk &amp; Opportunity Outlook
                </h2>
                <p className="mb-0 mt-4 text-[14px] leading-[1.8] text-white/75">
                  Explore Haycarb’s principal climate-related risks and
                  opportunities in one connected view. Select a CRRO to
                  understand why it matters, the factors considered, the
                  estimated driver and financial-effect ranges, and the
                  resilience implications across climate futures.
                </p>
              </div>
              <div className="flex w-full flex-wrap gap-3 lg:w-auto">
                <Button
                  disabled
                  variant="outline"
                  title="Final AR Disclosure URL required from client"
                  className="!border-white/15 !bg-white/5 !text-white/50"
                >
                  AR Disclosure · link pending
                </Button>
              </div>
            </div>
            <CrroCluster active={activeCrro} onSelect={setActiveCrro} />
            <div key={activeCrro} className="animate-fade-in mt-8">
              <ClimatePanel crro={CRROS_V2[activeCrro]} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
