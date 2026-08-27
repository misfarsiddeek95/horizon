"use client";

import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import type { V2Crro } from "@/data/dashboardV2/types";
import ClimateChart from "./ClimateChart";

const ANNUAL_REPORT_URL =
  "https://cdn.cse.lk/cmt/upload_report_file/494_1780912833539.pdf";

const CRRO_PAGE: Record<number, number> = { 1: 73, 2: 77, 3: 80, 4: 84 };

const TIME_HORIZONS = [
  { key: "ST", period: "FY 2026/27" },
  { key: "MT", period: "FY 2027/28\u2013FY 2029/30" },
  { key: "LT", period: "Beyond FY 2029/30" },
] as const;

function fmtRangeVal(v: number, format: string): string {
  if (format === "percent") return v + "%";
  if (format === "multiple") return Number(v).toFixed(1) + "\u00d7";
  return String(v);
}

function formatVal(v: number, format: string): string {
  if (format === "percent") return Math.round(v) + "%";
  if (format === "multiple") return v.toFixed(1) + "\u00d7";
  return String(v);
}

interface ClimateCrroDetailProps {
  crro: V2Crro;
}

export default function ClimateCrroDetail({ crro }: ClimateCrroDetailProps) {
  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-[24px_24px_24px_8px] border border-[#dce6e7] bg-white shadow-[0_18px_42px_rgba(18,63,69,.06)]">
        <div className="relative isolate flex min-h-[250px] items-center justify-center overflow-hidden p-[34px_38px] text-center">
          <Image
            src="/images/innerpage/dashboard_progress_section.svg"
            alt="Progress and Outlook"
            fill
            unoptimized
            className="object-cover -z-10"
          />
          <div className="relative z-[1] mx-auto max-w-[900px] text-white">
            <h3 className="m-0 mb-[10px] max-w-[860px] font-heading text-[clamp(38px,4.2vw,58px)] font-medium leading-[1.02] tracking-[-0.025em]">
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

        <div className="p-[18px_20px_16px]">
          <div className="relative mb-[14px] block text-center" style={{ paddingLeft: "155px", paddingRight: "155px" }}>
            <h4 className="m-0 text-[13px] font-black uppercase leading-[1.2] tracking-[0.08em]" style={{ color: crro.color }}>
              Driver and anticipated financial effect
            </h4>
            <p className="mt-[6px] mb-0 text-[10.8px] leading-[1.4] text-[#7a8998]">
              Quantified operational drivers and financial effects across the short, medium and long term.
            </p>
            <a
              href={`${ANNUAL_REPORT_URL}#page=${CRRO_PAGE[crro.id]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-0 top-[-5px] inline-flex whitespace-nowrap rounded-[9px] border border-[#cfdae1] bg-white px-[9px] py-[7px] text-[9.5px] font-[850] text-[var(--navy)] no-underline"
            >
              View disclosure ↗
            </a>
          </div>

          <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-2">
            <section className="min-w-0 overflow-hidden rounded-[14px] border border-[#dce5ea] bg-white p-[16px_15px_13px]" style={{ "--accent": crro.color } as React.CSSProperties}>
              <div className="mb-[8px] text-[10px] font-black uppercase tracking-[0.09em]" style={{ color: crro.color }}>
                Driver
              </div>
              <div className="text-[16px] leading-[1.25] min-h-[40px]">{crro.driver}</div>
              <div className="mt-[4px] min-h-[31px] text-[11px] leading-[1.4] text-[#7a8998]">{crro.driverSubtitle}</div>
              <ClimateChart
                title={crro.driver}
                axisLabel={crro.driverAxis}
                unit={crro.driverUnit}
                format={crro.driverFormat}
                upperVals={crro.upper}
                lowerVals={crro.lower}
                singleEstimate={crro.driverSingleEstimate}
                accentColor={crro.color}
              />
              <div className="mt-[-4px] grid grid-cols-3 px-[8.5%]">
                {TIME_HORIZONS.map((h) => (
                  <div key={h.key} className="text-center">
                    <b className="block text-[10.5px] text-[var(--navy)]">{h.key}</b>
                    <small className="block text-[8.8px] leading-[1.25] text-[#8795a2] whitespace-normal">{h.period}</small>
                  </div>
                ))}
              </div>
              <div className="mt-[8px] flex flex-wrap justify-center gap-[10px] text-[8.5px] font-[800] text-[#657586]">
                {!crro.driverSingleEstimate ? (
                  <>
                    <span className="flex items-center gap-[6px]">
                      <span className="inline-block h-[2px] w-[18px] rounded-sm" style={{ background: crro.color, opacity: 0.62 }} />
                      Lower estimate
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <span className="inline-block h-[2px] w-[18px] rounded-sm" style={{ background: crro.color }} />
                      Upper estimate
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <span className="inline-block h-[8px] w-[18px] rounded-[3px]" style={{ background: crro.color, opacity: 0.16 }} />
                      Estimated range
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-[6px]">
                    <span className="inline-block h-[2px] w-[18px] rounded-sm" style={{ background: crro.color }} />
                    Estimated pathway
                  </span>
                )}
              </div>
              <div className="mt-[8px] flex flex-wrap gap-[8px] border-t border-[#e5ebef] pt-[10px] text-[8.8px] leading-[1.35] text-[#627486]">
                <b className="text-[var(--navy)]">{crro.driverSingleEstimate ? "Estimated pathway" : "Estimated range"}</b>
                {crro.driverSingleEstimate
                  ? TIME_HORIZONS.map((h) => (
                      <span key={h.key}><b>{h.key}</b> {formatVal(crro.upper[TIME_HORIZONS.indexOf(h)], crro.driverFormat)}</span>
                    ))
                  : TIME_HORIZONS.map((h) => {
                      const i = TIME_HORIZONS.indexOf(h);
                      return (
                        <span key={h.key}><b>{h.key}</b> {fmtRangeVal(crro.lower[i], crro.driverFormat)}\u2013{fmtRangeVal(crro.upper[i], crro.driverFormat)}{crro.driverFormat === "number" && crro.driverUnit ? " " + crro.driverUnit : ""}</span>
                      );
                    })
                }
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-[14px] border border-[#dce5ea] bg-white p-[16px_15px_13px]" style={{ "--accent": crro.color } as React.CSSProperties}>
              <div className="mb-[8px] text-[10px] font-black uppercase tracking-[0.09em]" style={{ color: crro.color }}>
                Financial effect
              </div>
              <div className="text-[16px] leading-[1.25] min-h-[40px]">{crro.finance}</div>
              <div className="mt-[4px] min-h-[31px] text-[11px] leading-[1.4] text-[#7a8998]">{crro.financeSubtitle}</div>
              <ClimateChart
                title={crro.finance}
                axisLabel={crro.financeAxis}
                unit={crro.financeUnit}
                format={crro.financeFormat}
                upperVals={crro.finU}
                lowerVals={crro.finL}
                singleEstimate={crro.financeSingleEstimate}
                accentColor={crro.color}
              />
              <div className="mt-[-4px] grid grid-cols-3 px-[8.5%]">
                {TIME_HORIZONS.map((h) => (
                  <div key={h.key} className="text-center">
                    <b className="block text-[10.5px] text-[var(--navy)]">{h.key}</b>
                    <small className="block text-[8.8px] leading-[1.25] text-[#8795a2] whitespace-normal">{h.period}</small>
                  </div>
                ))}
              </div>
              <div className="mt-[8px] flex flex-wrap justify-center gap-[10px] text-[8.5px] font-[800] text-[#657586]">
                {!crro.financeSingleEstimate ? (
                  <>
                    <span className="flex items-center gap-[6px]">
                      <span className="inline-block h-[2px] w-[18px] rounded-sm" style={{ background: crro.color, opacity: 0.62 }} />
                      Lower estimate
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <span className="inline-block h-[2px] w-[18px] rounded-sm" style={{ background: crro.color }} />
                      Upper estimate
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <span className="inline-block h-[8px] w-[18px] rounded-[3px]" style={{ background: crro.color, opacity: 0.16 }} />
                      Estimated range
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-[6px]">
                    <span className="inline-block h-[2px] w-[18px] rounded-sm" style={{ background: crro.color }} />
                    Estimated pathway
                  </span>
                )}
              </div>
              <div className="mt-[8px] flex flex-wrap gap-[8px] border-t border-[#e5ebef] pt-[10px] text-[8.8px] leading-[1.35] text-[#627486]">
                <b className="text-[var(--navy)]">{crro.financeSingleEstimate ? "Estimated pathway" : "Estimated range"}</b>
                {crro.financeSingleEstimate
                  ? TIME_HORIZONS.map((h) => (
                      <span key={h.key}><b>{h.key}</b> {formatVal(crro.finU[TIME_HORIZONS.indexOf(h)], crro.financeFormat)}</span>
                    ))
                  : TIME_HORIZONS.map((h) => {
                      const i = TIME_HORIZONS.indexOf(h);
                      return (
                        <span key={h.key}><b>{h.key}</b> {fmtRangeVal(crro.finL[i], crro.financeFormat)}\u2013{fmtRangeVal(crro.finU[i], crro.financeFormat)}{crro.financeFormat === "number" && crro.financeUnit ? " " + crro.financeUnit : ""}</span>
                      );
                    })
                }
              </div>
            </section>
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
            Annual Report Climate Resilience Assessment ↗
          </Button>
        </div>
      </div>
    </div>
  );
}
