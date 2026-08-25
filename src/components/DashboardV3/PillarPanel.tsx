"use client";

import Image from "next/image";
import { IMPACT_REPORT_URL } from "@/data/dashboardV2/pillars";
import { type V2Pillar } from "@/data/dashboardV2/types";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATUS_TONE_TEXT_V3 } from "./statusTones";
import AnimatedRail from "@/components/ui/AnimatedRail";

interface PillarPanelProps {
  pillar: V2Pillar;
}

const CARD =
  "rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl";

export default function PillarPanel({ pillar }: PillarPanelProps) {
  const introCopy = pillar.overview || pillar.storyText;

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} p-7 sm:p-9`}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative min-h-[260px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/innerpage/dashboard_progress_section.svg"
              alt={`${pillar.name} pillar banner`}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-[10px] font-[850] uppercase tracking-[0.13em] text-[var(--color-mint)]">
              {pillar.name} · {pillar.descriptor}
            </div>
            <h3 className="m-0 font-heading text-[28px] font-medium leading-[1.18] tracking-[-0.02em] text-balance">
              {pillar.desc}
            </h3>
            <p className="m-0 font-sans text-[14px] leading-[1.75] text-white/80">
              {introCopy}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-x-8 gap-y-6 border-t border-white/15 pt-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col justify-center self-stretch rounded-2xl border-l-[3px] border-[var(--color-mint)] bg-white/5 px-6 py-6">
            <div className="text-[10px] font-[850] uppercase tracking-[0.13em] text-white/70">
              FY2025/26 Standout
            </div>
            <div className="my-2 font-semibold leading-none tracking-[-0.03em] text-[var(--color-mint)] [&>span]:text-[40px] lg:[&>span]:text-[48px]">
              <AnimatedCounter value={pillar.standout} />
            </div>
            <div className="text-[13px] leading-[1.6] text-white/75">
              {pillar.standoutText}
            </div>
          </div>
          <div>
            <h4 className="mb-4 mt-0 font-heading text-[24px] font-medium tracking-[-0.02em]">
              Impact in action
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {pillar.impacts.map((impact) => (
                <div
                  key={impact.label}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl"
                >
                  <b className="block text-[22px] font-semibold tracking-[-0.02em]">
                    {impact.value}
                  </b>
                  <span className="mt-1 block text-[11px] leading-[1.35] text-white/65">
                    {impact.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${CARD} p-7 sm:p-9`}>
        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h3 className="m-0 font-heading text-[26px] font-medium tracking-[-0.02em]">
              Progress towards 2030
            </h3>
            <p className="mb-0 mt-2 text-[13px] text-white/70">
              {pillar.commitments
                ? "FY2025/26 performance against ACTIVATE 2030 commitments."
                : "FY2025/26 progress across the selected ACTIVATE pillar."}
            </p>
          </div>
          <div className="whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[12px] font-extrabold text-white/80">
            {pillar.commitments
              ? `${pillar.commitments.length} commitments`
              : `${pillar.progress.length} progress areas`}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/15">
          {pillar.commitments ? (
            <table className="w-full min-w-[760px] border-collapse bg-white/5">
              <thead>
                <tr>
                  {["Commitment", "FY2025/26", "2030 target", "Status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="border-b border-white/15 px-5 py-4 text-left text-[10px] font-[850] uppercase tracking-[0.09em] text-white/70"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pillar.commitments.map((commitment, commitmentIndex) => (
                  <tr
                    key={commitment.name}
                    className="transition-colors duration-300 hover:bg-white/10"
                  >
                    <td className="border-b border-white/10 px-5 py-4 text-[13px] font-bold text-white">
                      {commitment.name}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-[13px] text-white/85">
                      <span className="block font-semibold text-[var(--color-mint)]">
                        {commitment.current}
                      </span>
                      {commitment.note ? (
                        <small className="block text-[11px] text-white/55">
                          {commitment.note}
                        </small>
                      ) : null}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-[13px] font-semibold text-white/85">
                      {commitment.target}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4">
                      <span
                        className={`block text-[13px] font-[850] ${STATUS_TONE_TEXT_V3[commitment.tone]}`}
                      >
                        {commitment.status}
                      </span>
                      {typeof commitment.pct === "number" ? (
                        <AnimatedRail
                          pct={commitment.pct}
                          index={commitmentIndex}
                          className={`mt-2 h-1 max-w-[170px] overflow-hidden rounded-full bg-white/20 ${STATUS_TONE_TEXT_V3[commitment.tone]}`}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[560px] border-collapse bg-white/5">
              <thead>
                <tr>
                  {["Progress area", "FY2025/26", "Status"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="border-b border-white/15 px-5 py-4 text-left text-[10px] font-[850] uppercase tracking-[0.09em] text-white/70"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pillar.progress.map((item, itemIndex) => (
                  <tr
                    key={item.label}
                    className="transition-colors duration-300 hover:bg-white/10"
                  >
                    <td className="border-b border-white/10 px-5 py-4 text-[13px] font-bold text-white">
                      {item.label}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-[13px] font-semibold text-[var(--color-mint)]">
                      {item.pct}%
                    </td>
                    <td className="border-b border-white/10 px-5 py-4">
                      <span
                        className={`block text-[13px] font-[850] ${STATUS_TONE_TEXT_V3.ontrack}`}
                      >
                        Progressing
                      </span>
                      <AnimatedRail
                        pct={item.pct}
                        index={itemIndex}
                        className={`mt-2 h-1 max-w-[170px] overflow-hidden rounded-full bg-white/20 ${STATUS_TONE_TEXT_V3.ontrack}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div
        className={`${CARD} grid grid-cols-1 overflow-hidden lg:grid-cols-[minmax(300px,.9fr)_minmax(0,1.1fr)]`}
      >
        <div className="relative min-h-[220px] lg:min-h-[280px]">
          <Image
            src="/images/innerpage/dashboard_story_banner.svg"
            alt="Featured Story"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="self-center p-7 sm:p-9">
          <div className="text-[10px] font-[850] uppercase tracking-[0.13em] text-[var(--color-mint)]">
            Featured story
          </div>
          <h4 className="mb-2 mt-2 font-heading text-[20px] font-medium">
            {pillar.story}
          </h4>
          <p className="m-0 text-[13px] leading-[1.6] text-white/85">
            {pillar.storyText}
          </p>
          <p className="mb-0 mt-2 text-[12px] text-white/60">
            Project overview placeholder: a short summary of the initiative,
            the action taken and the outcome achieved during the year.
          </p>
          <a
            href={`${IMPACT_REPORT_URL}#page=${pillar.page}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Explore ${pillar.name} featured story in the Sustainability Impact Report`}
            className="mb-0 mt-4 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-extrabold text-white backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-white/20 hover:shadow-2xl"
          >
            Explore story · Impact Report p.{pillar.page} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
