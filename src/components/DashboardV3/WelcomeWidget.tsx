"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { PILLAR_ICONS, PILLAR_IDS, PILLARS_V2 } from "@/data/dashboardV2/pillars";
import type { SectionId } from "@/data/dashboardV2/types";

interface WelcomeWidgetProps {
  onNavigate: (id: SectionId) => void;
}

export default function WelcomeWidget({ onNavigate }: WelcomeWidgetProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl">
      <div className="relative grid grid-cols-1 items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="font-[850] text-[13px] uppercase tracking-[0.16em] text-[var(--color-mint)]">
            FY 2025/26
          </div>
          <h1 className="mb-7 mt-[18px] max-w-[640px] font-heading text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.02] tracking-[-0.02em] text-balance">
            Sustainability at Haycarb
          </h1>
          <p className="m-0 max-w-[620px] text-[15px] leading-[1.72] text-white/85">
            Sustainability continues to shape how Haycarb creates value today
            while building a more resilient and responsible business for the
            future. ACTIVATE 2030, our sustainability roadmap, translates this
            into measurable action across five key ESG pillars: RESTORE,
            INSPIRE, EXCITE, UPLIFT and INNOVATE.
          </p>
          <div className="my-6 flex flex-wrap gap-3" aria-label="ACTIVATE pillars">
            {PILLAR_IDS.map((id) => (
              <div
                key={id}
                title={PILLARS_V2[id].name}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-white/10 p-[3px] backdrop-blur-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PILLAR_ICONS[id]}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
          <p className="m-0 max-w-[620px] text-[15px] leading-[1.72] text-white/85">
            As an early adopter of SLFRS S1 and S2, Haycarb continues to
            strengthen how we assess and communicate material sustainability
            and climate-related risks and opportunities (SRROs and CRROs)
            across our value chain. Our independently assured disclosures
            provide deeper analysis of the anticipated financial effects of our
            principal climate-related risks and opportunities.
          </p>
          <div className="mt-8 flex w-full flex-wrap gap-3.5 sm:w-auto">
            <Button
              onClick={() => onNavigate("activate")}
              variant="outline"
              className="w-full min-h-[48px] !border-white/30 !bg-white/15 !text-white backdrop-blur-xl hover:!bg-white/25 sm:w-auto"
            >
              Explore ACTIVATE 2030
            </Button>
            <Button
              onClick={() => onNavigate("climate")}
              variant="outline"
              className="w-full min-h-[48px] !border-white/30 !bg-white/15 !text-white backdrop-blur-xl hover:!bg-white/25 sm:w-auto"
            >
              Explore S1 &amp; S2 Climate Outlook
            </Button>
          </div>
        </div>

        <div className="relative hidden min-h-[320px] overflow-hidden rounded-2xl border border-white/20 lg:block">
          <Image
            src="/images/innerpage/dashboard_banner.svg"
            alt="Sustainability at Haycarb"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
