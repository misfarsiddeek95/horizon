"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import type { V2Crro } from "@/data/dashboardV2/types";
import GlowChart from "./GlowChart";

const ANNUAL_REPORT_URL =
  "https://cdn.cse.lk/cmt/upload_report_file/494_1780912833539.pdf";

interface ClimatePanelProps {
  crro: V2Crro;
}

const CARD =
  "rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl";

export default function ClimatePanel({ crro }: ClimatePanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} overflow-hidden`}>
        <div className="relative isolate flex min-h-[230px] items-center justify-center overflow-hidden p-8 text-center sm:p-10">
          <Image
            src="/images/innerpage/dashboard_progress_section.svg"
            alt="Progress and Outlook"
            fill
            unoptimized
            className="object-cover -z-10"
          />
          <div className="absolute inset-0 -z-[5] bg-[#06323a]/45" aria-hidden="true" />
          <div className="relative z-[1] mx-auto max-w-[860px]">
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-mint)]">
              CRRO {crro.id} · {crro.kind}
            </div>
            <h3 className="m-0 mb-[10px] font-heading text-[30px] font-medium leading-[1.12] tracking-[-0.02em]">
              {crro.title}
            </h3>
            <p className="m-0 text-[13px] leading-[1.65] text-white/85">
              {crro.desc}
            </p>
          </div>
        </div>

        <div className="border-t border-white/15 p-7 sm:p-9">
          <h4 className="mb-5 mt-0 text-center font-heading text-[20px] font-medium">
            Key climate &amp; operational factors
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {crro.factors.map((factor) => (
              <div
                key={factor.title}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl"
              >
                <span
                  aria-hidden="true"
                  className="mb-3 grid h-8 w-8 place-items-center rounded-[10px_10px_10px_3px] bg-[var(--color-mint)]/20 text-[13px] font-black text-[var(--color-mint)]"
                >
                  ✦
                </span>
                <b className="block text-[12.5px] leading-[1.35]">
                  {factor.title}
                </b>
                <span className="mb-0 mt-2 block text-[11.5px] leading-[1.5] text-white/65">
                  {factor.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/15 p-7 sm:p-9">
          <h4 className="mb-5 mt-0 text-center font-heading text-[20px] font-medium">
            What does this mean for Haycarb?
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {crro.meaning.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl"
              >
                <b className="mb-1.5 block text-[12.5px]">{item.title}</b>
                <span className="block text-[11.5px] leading-[1.5] text-white/65">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/15 p-7 sm:p-9">
          <h4 className="mb-1 mt-0 font-heading text-[18px] font-medium">
            Driver and anticipated financial effect
          </h4>
          <p className="mb-5 mt-1 text-[11px] text-white/60">
            Lower and upper estimates across short-, medium- and long-term
            horizons.
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GlowChart
              title={crro.driver}
              upperVals={crro.upper}
              lowerVals={crro.lower}
              isPercent
            />
            <GlowChart
              title={crro.finance}
              upperVals={crro.finU}
              lowerVals={crro.finL}
            />
          </div>
        </div>
      </div>

      <div className={`${CARD} grid grid-cols-1 items-center gap-8 p-7 sm:p-9 lg:grid-cols-[minmax(220px,.75fr)_1.25fr]`}>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-mint)]">
            Resilience Lens
          </div>
          <h3 className="mb-0 mt-2 font-heading text-[21px] font-medium leading-[1.25] tracking-[-0.02em]">
            {crro.lens}
          </h3>
        </div>
        <div>
          <b className="text-[12px]">Net Zero</b>
          <p className="mb-0 mt-1 text-[12px] leading-[1.55] text-white/80">
            {crro.net}
          </p>
          <b className="mb-0 mt-3 block text-[12px]">Divergence</b>
          <p className="mb-0 mt-1 text-[12px] leading-[1.55] text-white/80">
            {crro.div}
          </p>
          <Button
            behavior="link"
            href={`${ANNUAL_REPORT_URL}#page=94`}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="!mt-4 !border-white/30 !bg-white/15 !text-white backdrop-blur-xl hover:!bg-white/25"
          >
            Explore resilience analysis in the Annual Report ↗
          </Button>
        </div>
      </div>
    </div>
  );
}
