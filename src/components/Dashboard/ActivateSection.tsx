"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import {
  ACTIVATE_ROADMAP_URL,
  PILLARS_V2,
} from "@/data/dashboard/pillars";
import type { PillarId } from "@/data/dashboard/types";
import MetricsBand from "./MetricsBand";
import PillarDetail from "./PillarDetail";
import PillarTabs from "./PillarTabs";

interface ActivateSectionProps {
  activePillar: PillarId;
  onPillarChange: (id: PillarId) => void;
}

export default function ActivateSection({
  activePillar,
  onPillarChange,
}: ActivateSectionProps) {
  return (
    <section id="activate" className="px-[18px] py-[112px] sm:px-8 max-md:py-14">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[60px] grid grid-cols-1 items-start gap-[72px] lg:grid-cols-[minmax(0,1.25fr)_auto] lg:items-end">
          <div>
            <h2 className="mb-0 mt-[10px] font-heading text-[clamp(38px,4.2vw,58px)] font-medium leading-[1.02] tracking-[-0.025em] text-balance">
              Progress towards 2030
            </h2>
            <p className="mb-0 mt-4 max-w-[590px] leading-[1.85] text-[#042b31]/80">
              ACTIVATE 2030 translates our sustainability ambitions into
              measurable action across five pillars. Explore this year’s
              progress, impact metrics, target status and featured stories.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
            <Button
              behavior="link"
              href={ACTIVATE_ROADMAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              icon={<ArrowUpRightIcon className="h-4 w-4" />}
              className="min-h-[48px]"
            >
              ACTIVATE 2030
            </Button>
            <Button
              behavior="link"
              href="/pdf/Sustainability-Dashboard/ACTIVATE-2030/AR Disclosure on Activate 2030 achievements.pdf"
              target="_blank"
              variant="outline"
              icon={<ArrowUpRightIcon className="h-4 w-4" />}
              className="min-h-[48px]"
            >
              Annual Report Disclosure
            </Button>
          </div>
        </div>

        <MetricsBand />

        <PillarTabs active={activePillar} onSelect={onPillarChange} />

        <div key={activePillar} className="animate-tab-pass">
          <PillarDetail pillar={PILLARS_V2[activePillar]} />
        </div>
      </div>
    </section>
  );
}
