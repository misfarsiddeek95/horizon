"use client";

import Button from "@/components/ui/Button";
import { PILLAR_ICONS, PILLARS_V2, PILLAR_IDS } from "@/data/dashboard/pillars";
import type { SectionId } from "@/data/dashboard/types";

interface DashboardHeroProps {
  onNavigate: (id: SectionId) => void;
}

export default function DashboardHero({ onNavigate }: DashboardHeroProps) {
  return (
    <header
      id="intro"
      className="relative isolate overflow-hidden px-[18px] pt-[66px] pb-[54px] text-white sm:px-8"
      style={{ background: "linear-gradient(135deg, #0f5c6b 0%, #147385 50%, #1a8fa0 100%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 82% 20%,rgba(61,171,166,.14),transparent 30%),radial-gradient(circle at 96% 78%,rgba(103,183,126,.08),transparent 24%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="max-w-[1080px]">
          <div className="font-[850] text-[14px] uppercase tracking-[0.16em] text-[var(--color-v2-hero-kicker)]">
            FY 2025/26
          </div>
          <h1 className="mt-[18px] mb-8 max-w-[930px] font-heading font-medium leading-[0.98] tracking-[-0.025em] text-balance text-[clamp(36px,6vw,82px)]">
            Sustainability at Haycarb
          </h1>
          <p className="m-0 max-w-[1040px] text-[18px] leading-[1.72] text-[var(--color-v2-hero-copy)]">
            Sustainability continues to shape how Haycarb creates value today
            while building a more resilient and responsible business for the
            future. ACTIVATE 2030, our sustainability roadmap, translates this
            into measurable action across five key ESG pillars: RESTORE,
            INSPIRE, EXCITE, UPLIFT and INNOVATE.
          </p>
          <div
            className="my-[26px] mb-[30px] mt-[26px] flex flex-wrap gap-[18px]"
            aria-label="ACTIVATE pillars"
          >
            {PILLAR_IDS.map((id) => (
              <div
                key={id}
                title={PILLARS_V2[id].name}
                className="grid h-[58px] w-[58px] place-items-center rounded-full border-4 border-white/[.92] bg-white p-0 shadow-[0_0_0_2px_rgba(255,255,255,.2)]"
              >
                <span
                  className="grid h-[46px] w-[46px] place-items-center overflow-hidden rounded-full"
                  style={{ background: PILLARS_V2[id].accent }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PILLAR_ICONS[id]}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-contain"
                  />
                </span>
              </div>
            ))}
          </div>
          <p className="m-0 max-w-[1040px] text-[18px] leading-[1.72] text-[var(--color-v2-hero-copy)]">
            As an early adopter of SLFRS S1 and S2, Haycarb continues to
            strengthen how we assess and communicate material sustainability
            and climate-related risks and opportunities (SRROs and CRROs)
            across our value chain. Our independently assured disclosures
            provide deeper analysis of the anticipated financial effects of our
            principal climate-related risks and opportunities.
          </p>
          <div className="mt-[34px] flex w-full flex-wrap gap-3.5 sm:w-auto">
            <Button
              variant="primary"
              onClick={() => onNavigate("activate")}
              className="w-full min-h-[48px] !border !border-white !bg-white !text-[color:var(--color-v2-navy-deep)] shadow-none hover:!bg-white hover:!shadow-none sm:w-auto"
            >
              Explore ACTIVATE 2030
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("climate")}
              className="w-full min-h-[48px] !border !border-white/35 !bg-white/10 !text-white backdrop-blur-[8px] hover:!bg-white/20 sm:w-auto"
            >
              Explore S1 &amp; S2 Outlook
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
