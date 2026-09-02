"use client";

import { useState, useEffect } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import SmokyBackground from "@/components/SmokyBackground";
import FloatingAIButton from "@/components/FloatingAIButton";
import { CRROS_V2 } from "@/data/dashboard/crros";
import type { CrroId, PillarId, SectionId } from "@/data/dashboard/types";
import ActivateSection from "./ActivateSection";
import ClimateCrroDetail from "./ClimateCrroDetail";
import CrroTabs from "./CrroTabs";
import DashboardHero from "./DashboardHero";

export default function DashboardPageV2() {
  const [activePillar, setActivePillar] = useState<PillarId>("restore");
  const [activeCrro, setActiveCrro] = useState<CrroId>(1);
  const [, setActiveSection] = useState<SectionId>("intro");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  const handleNavigate = (id: SectionId) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="relative isolate min-h-screen overflow-hidden font-sans text-[var(--color-v2-ink)]"
    >
      <SmokyBackground />

      <DashboardHero onNavigate={handleNavigate} />

      <ActivateSection
        activePillar={activePillar}
        onPillarChange={setActivePillar}
      />

      <section
        id="climate"
        className="border-t border-[#e2eaed] px-[18px] pt-[112px] pb-8 sm:px-8 max-md:pt-14"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-[34px] grid grid-cols-1 items-start gap-[72px] lg:grid-cols-[minmax(0,1.25fr)_auto] lg:items-end">
            <div>
              <h2 className="mb-0 mt-[10px] font-heading text-[clamp(38px,4.2vw,58px)] font-medium leading-[1.02] tracking-[-0.025em] text-balance">
                S1 &amp; S2 Climate Risk &amp; Opportunity Outlook
              </h2>
              <p className="mb-0 mt-4 font-heading text-[clamp(20px,2.2vw,28px)] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-v2-text)]">
                How does climate change affect our value chain?
              </p>
              <p className="mb-0 mt-4 max-w-[590px] leading-[1.85] text-[var(--color-v2-text-muted)]">
                Explore four principal climate-related risks and
                opportunities, from the factors shaping each issue to the
                potential operational and financial effects across the
                short, medium and long term.
              </p>
            </div>
            <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
              <Button
                behavior="link"
                href="/pdf/Sustainability-Dashboard/S1 & S2 Climate Risk & Opportunity Outlook/S1 & S2 Climate Risk & Opportunity Outlook - AR disclosure.pdf"
                target="_blank"
                variant="primary"
                icon={<ArrowUpRightIcon className="h-4 w-4" />}
                className="min-h-[48px]"
              >
                Annual Report Disclosure
              </Button>
            </div>
          </div>

          <CrroTabs active={activeCrro} onSelect={setActiveCrro} />

          <div key={activeCrro} className="animate-fade-in">
            <ClimateCrroDetail crro={CRROS_V2[activeCrro]} />
          </div>
        </div>
      </section>

      <FloatingAIButton />
    </div>
  );
}
