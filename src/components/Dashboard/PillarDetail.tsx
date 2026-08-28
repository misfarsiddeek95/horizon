import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { STORY_PDFS } from "@/data/dashboard/pillars";
import { STATUS_TONE_COLOR, type V2Pillar } from "@/data/dashboard/types";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AnimatedRail from "@/components/ui/AnimatedRail";

interface PillarDetailProps {
  pillar: V2Pillar;
}

export default function PillarDetail({ pillar }: PillarDetailProps) {
  const introCopy = pillar.overview || pillar.storyText;

  return (
    <div className="flex flex-col gap-y-[34px]">
      <div className="mt-8 grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div className="relative min-h-[300px] w-full overflow-hidden rounded-[24px_24px_24px_8px] lg:min-h-[340px]">
          <Image
            src="/images/innerpage/dashboard_progress_section.svg"
            alt="Intro Banner"
            fill
            unoptimized
            className="object-cover rounded-3xl"
          />
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="m-0 max-w-[720px] font-heading text-[32px] font-medium leading-[1.16] tracking-[-0.025em] text-balance">
            {pillar.desc}
          </h3>
          <p className="m-0 max-w-[500px] font-sans text-[15px] leading-[1.72] text-[var(--color-v2-text-muted)]">
            {introCopy}
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-v2-border)] pt-9">
        <div className="grid grid-cols-1 items-center gap-x-[34px] gap-y-[10px] border-b border-[var(--color-v2-border-metric)] pb-6 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)]">
          <div className="mt-[38px] flex flex-col justify-center self-stretch rounded-none border-l-[3px] border-[var(--color-v2-accent)] px-[26px] py-[26px] lg:mt-0"
            style={{
              background:
                "linear-gradient(90deg,rgba(220,243,239,.48),rgba(220,243,239,0))",
            }}
          >
            <div className="text-[10px] font-[850] uppercase tracking-[0.13em] text-[var(--color-v2-accent-dark)]">
              FY2025/26 standout
            </div>
            <div className="my-[9px] text-[44px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-v2-accent-dark)] lg:text-[52px] [&>span]:text-[44px] lg:[&>span]:text-[52px]">
              <AnimatedCounter value={pillar.standout} />
            </div>
            <div className="leading-[1.6] text-[var(--color-v2-text-soft)]">
              {pillar.standoutText}
            </div>
          </div>
          <div>
            <h2 className="m-0 mb-[3px] font-heading text-[28px] font-medium leading-[1.2] tracking-[-0.025em]">
              Impact in action
            </h2>
            <p className="mb-4 mt-0 leading-[1.4] text-[var(--color-v2-text-soft)] text-[12px]">
              Selected reported outcomes from the year
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {pillar.impacts.map((impact, index) => (
                <div
                  key={impact.label}
                  className={`flex min-h-[92px] flex-col justify-center py-4 ${
                    index > 0 ? "sm:border-l sm:border-[var(--color-v2-border-metric)] sm:pl-[18px]" : ""
                  }`}
                >
                  <b className="block text-[24px] font-semibold leading-[1.05] tracking-[-0.03em]">
                    {impact.value}
                  </b>
                  <span className="mt-[5px] block text-[11px] leading-[1.35] text-[var(--color-v2-label)]">
                    {impact.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="mb-4 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h3 className="m-0 font-heading text-[28px] font-medium tracking-[-0.025em]">
              Progress towards 2030
            </h3>
            <p className="mb-0 mt-[7px] text-[13px] text-[var(--color-v2-text-muted)]">
              {pillar.commitments
                ? "FY2025/26 performance against ACTIVATE 2030 commitments."
                : "FY2025/26 progress across the selected ACTIVATE pillar."}
            </p>
          </div>
          <div className="whitespace-nowrap text-[12px] font-extrabold text-[var(--color-v2-label)]">
            {pillar.commitments
              ? `${pillar.commitments.length} commitments`
              : `${pillar.progress?.length ?? 0} progress areas`}
          </div>
        </div>

        <div className="overflow-x-auto">
          {pillar.commitments ? (
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <colgroup>
                <col className="w-[29%]" />
                <col className="w-[22%]" />
                <col className="w-[22%]" />
                <col className="w-[27%]" />
              </colgroup>
              <thead>
                <tr>
                  {["Commitment", "FY2025/26", "2030 target", "Status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="border-y border-[var(--color-v2-border)] py-[14px] pr-3 pb-[13px] text-left align-bottom text-[10px] font-[850] uppercase tracking-[0.09em] text-[var(--color-v2-label)]"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pillar.commitments.map((commitment, commitmentIndex) => (
                  <tr key={commitment.name}>
                    <td className="border-b border-[var(--color-v2-border-light)] py-[22px] pr-[18px] align-middle text-[13px] leading-[1.35] text-[var(--color-v2-text-body)]">
                      <span className="text-[14px] font-[850] text-[var(--color-v2-text-strong)]">
                        {commitment.name}
                      </span>
                    </td>
                    <td className="border-b border-[var(--color-v2-border-light)] py-[22px] pr-[18px] align-middle text-[13px] leading-[1.35] text-[var(--color-v2-text-body)]">
                      <span className="text-[15px] font-[850] text-[var(--color-v2-current-value)]">
                        {commitment.current}
                        {commitment.note ? (
                          <small className="mb-0 mt-[3px] block text-[11px] font-semibold text-[var(--color-v2-label)]">
                            {commitment.note}
                          </small>
                        ) : null}
                      </span>
                    </td>
                    <td className="border-b border-[var(--color-v2-border-light)] py-[22px] pr-[18px] align-middle text-[13px] leading-[1.35] text-[var(--color-v2-text-body)]">
                      <span className="font-extrabold text-[#405969]">
                        {commitment.target}
                      </span>
                    </td>
                    <td className="border-b border-[var(--color-v2-border-light)] py-[22px] pr-[18px] align-middle text-[13px] leading-[1.35] text-[var(--color-v2-text-body)]">
                      <span
                        className="block font-[850]"
                        style={{ color: STATUS_TONE_COLOR[commitment.tone] }}
                      >
                        {commitment.status}
                      </span>
                      {typeof commitment.pct === "number" ? (
                        <AnimatedRail
                          pct={commitment.pct}
                          index={commitmentIndex}
                          className="mt-2 h-1 max-w-[190px] overflow-hidden rounded-full bg-[#dfe7e9]"
                          color={STATUS_TONE_COLOR[commitment.tone]}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[560px] table-fixed border-collapse">
              <colgroup>
                <col className="w-[48%]" />
                <col className="w-[22%]" />
                <col className="w-[30%]" />
              </colgroup>
              <thead>
                <tr>
                  {["Progress area", "FY2025/26", "Status"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="border-y border-[var(--color-v2-border)] py-[14px] pr-3 pb-[13px] text-left align-bottom text-[10px] font-[850] uppercase tracking-[0.09em] text-[var(--color-v2-label)]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pillar.progress?.map((item, itemIndex) => (
                  <tr key={item.label}>
                    <td className="border-b border-[var(--color-v2-border-light)] py-[22px] pr-[18px] align-middle text-[13px] leading-[1.35] text-[var(--color-v2-text-body)]">
                      <span className="text-[14px] font-[850] text-[var(--color-v2-text-strong)]">
                        {item.label}
                      </span>
                    </td>
                    <td className="border-b border-[var(--color-v2-border-light)] py-[22px] pr-[18px] align-middle text-[13px] leading-[1.35] text-[var(--color-v2-text-body)]">
                      <span className="text-[15px] font-[850] text-[var(--color-v2-accent-dark)]">
                        {item.pct}%
                      </span>
                    </td>
                    <td className="border-b border-[var(--color-v2-border-light)] py-[22px] pr-[18px] align-middle text-[13px] leading-[1.35] text-[var(--color-v2-text-body)]">
                      <span
                        className="block font-[850]"
                        style={{ color: STATUS_TONE_COLOR.ontrack }}
                      >
                        Progressing
                      </span>
                      <AnimatedRail
                        pct={item.pct}
                        index={itemIndex}
                        className="mt-2 h-1 max-w-[190px] overflow-hidden rounded-full bg-[#dfe7e9]"
                        color={STATUS_TONE_COLOR.ontrack}
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
        className="grid grid-cols-1 overflow-hidden rounded-[24px_24px_24px_8px] text-white shadow-[0_18px_46px_rgba(15,58,76,.12)] lg:grid-cols-[minmax(320px,.9fr)_minmax(0,1.1fr)]"
        style={{
          background:
            "linear-gradient(135deg,var(--color-v2-navy-story) 0%,#0c655f 100%)",
        }}
      >
        <div className="relative min-h-[220px] overflow-hidden lg:min-h-[300px]">
          <Image
            src="/images/innerpage/dashboard_story_banner.svg"
            alt="Featured Story"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="self-center p-[28px_30px] lg:p-[34px_38px]">
          <h4 className="mb-[7px] mt-0 text-[18px] font-medium">
            {pillar.story}
          </h4>
          <p className="mt-[7px] text-[12px] leading-[1.5] text-[#bfd6d7]">
            {pillar.storyText}
          </p>
          <a
            href={STORY_PDFS[pillar.id]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Explore ${pillar.name} featured story in the Sustainability Impact Report`}
            className="mb-0 mt-[9px] inline-flex items-center gap-1.5 text-[12px] font-extrabold text-white underline-offset-4 hover:underline"
          >
            Explore story
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
