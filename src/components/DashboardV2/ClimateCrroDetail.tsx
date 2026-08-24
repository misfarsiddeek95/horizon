"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import type { V2Crro } from "@/data/dashboardV2/types";
import ClimateChart from "./ClimateChart";

const ANNUAL_REPORT_URL =
  "https://cdn.cse.lk/cmt/upload_report_file/494_1780912833539.pdf";

interface ClimateCrroDetailProps {
  crro: V2Crro;
}

export default function ClimateCrroDetail({ crro }: ClimateCrroDetailProps) {
  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-[24px_24px_24px_8px] border border-[#dce6e7] bg-white shadow-[0_18px_42px_rgba(18,63,69,.06)]">
        <div
          role="img"
          aria-label={`Banner for ${crro.title}`}
          className="relative flex min-h-[250px] items-center justify-center overflow-hidden p-[34px_38px] text-center"
          style={{
            background:
              "linear-gradient(135deg,#143d4f 0%,#0d5d61 58%,#147c74 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 82% 18%,rgba(255,255,255,.12),transparent 28%),linear-gradient(150deg,rgba(3,31,44,.12),rgba(3,31,44,.34))",
            }}
          />
          <div className="relative z-[1] mx-auto max-w-[900px] text-white">
            <h3 className="m-0 mb-[10px] max-w-[860px] font-heading text-[34px] font-medium leading-[1.12] tracking-[-0.025em]">
              {crro.title}
            </h3>
            <p className="m-0 max-w-[860px] text-[13px] leading-[1.6] text-[#d9e8e7]">
              {crro.desc}
            </p>
          </div>
        </div>

        <div className="bg-surface-default px-6 pt-[26px] pb-7">
          <div className="mb-2 flex items-center justify-center gap-[18px] text-center">
            <h2 className="m-0 mb-[15px] text-[18px] font-bold leading-[1.3] text-[var(--color-v2-navy-deep)]">
              Key climate &amp; operational factors
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {crro.factors.map((factor) => (
              <div
                key={factor.title}
                className="relative flex min-h-[82px] items-center py-[18px] pl-[58px] pr-4"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 grid h-[30px] w-[30px] -translate-y-1/2 place-items-center rounded-[10px_10px_10px_3px] bg-[#e1f3f0] text-[13px] font-black text-[var(--color-v2-accent-text)]"
                >
                  ✦
                </span>
                <b className="block text-[11.5px] leading-[1.35] text-[var(--color-v2-navy-deep)]">
                  {factor.title}
                  <span className="sr-only">{`: ${factor.text}`}</span>
                </b>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#edf2f1] bg-white px-6 pt-[28px] pb-[30px]">
          <div className="mb-2 flex items-center justify-center gap-[18px] text-center">
            <h2 className="m-0 mb-[15px] text-[18px] font-bold leading-[1.3] text-[var(--color-v2-navy-deep)]">
              What does this mean for Haycarb?
            </h2>
          </div>
          <div className="mt-1 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {crro.meaning.map((item) => (
              <div
                key={item.title}
                className="rounded-[16px_16px_16px_5px] bg-white p-[18px_18px_18px_20px] shadow-[0_8px_22px_rgba(20,62,66,.04)]"
              >
                <b className="mb-[6px] block text-[12px] text-[var(--color-v2-navy-deep)]">
                  {item.title}
                </b>
                <span className="block text-[11px] leading-[1.5] text-[var(--color-v2-text-soft)]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 pb-5">
          <div className="mb-4 flex items-end justify-between gap-5">
            <div>
              <h4 className="m-0 text-[18px] text-[var(--color-v2-navy-deep)]">
                Driver and anticipated financial effect
              </h4>
              <p className="mb-0 mt-1 text-[10px] text-[var(--color-v2-label)]">
                Lower and upper estimates across short-, medium- and long-term
                horizons.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ClimateChart
              title={crro.driver}
              upperVals={crro.upper}
              lowerVals={crro.lower}
              isPercent
            />
            <ClimateChart
              title={crro.finance}
              upperVals={crro.finU}
              lowerVals={crro.finL}
            />
          </div>
        </div>
      </div>

      <div
        className="mt-[18px] grid grid-cols-1 items-center gap-[46px] rounded-[22px_22px_22px_8px] p-[28px_30px] text-white shadow-[0_18px_42px_rgba(13,70,73,.12)] lg:grid-cols-[minmax(220px,.75fr)_1.25fr]"
        style={{
          background:
            "linear-gradient(120deg,#0b3d50 0%,#0c6d66 76%)",
        }}
      >
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a9d5d2]">
            Resilience Lens
          </div>
          <h3 className="mb-0 mt-[6px] font-heading text-[21px] font-medium tracking-[-0.025em]">
            {crro.lens}
          </h3>
        </div>
        <div>
          <b className="text-[12px]">Net Zero</b>
          <p className="mb-0 mt-[5px] text-[12px] leading-[1.5] text-[#d4e8e7]">
            {crro.net}
          </p>
          <b className="mb-0 mt-[10px] block text-[12px]">Divergence</b>
          <p className="mb-0 mt-[5px] text-[12px] leading-[1.5] text-[#d4e8e7]">
            {crro.div}
          </p>
          <Button
            behavior="link"
            href={`${ANNUAL_REPORT_URL}#page=94`}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            icon={<ArrowUpRightIcon className="h-4 w-4" />}
            className="!mt-3.5 !min-h-[42px] w-full max-w-full whitespace-nowrap !bg-white !px-4 !py-[11px] !text-[12px] !text-[color:var(--color-v2-navy-btn)] sm:w-max"
          >
            Explore resilience analysis in the Annual Report ↗
          </Button>
        </div>
      </div>
    </div>
  );
}
