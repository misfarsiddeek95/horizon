import type { Pillar } from "@/data/activateDashboard";
import { META } from "@/data/activateDashboard";

interface HighlightsSectionProps {
  pillar: Pillar;
}

function sourceLink(page: number): string {
  return `${META.annualReportUrl}#page=${page}`;
}

export default function HighlightsSection({
  pillar,
}: HighlightsSectionProps) {
  const highlights = pillar.highlights.slice(0, 3);

  return (
    <section
      className="grid grid-cols-[150px_repeat(3,minmax(150px,1fr))_minmax(255px,1.2fr)] gap-2.5 mt-3.5 max-md:grid-cols-1 max-lg:grid-cols-[140px_repeat(2,1fr)]"
      aria-label="FY2025/26 impact highlights"
      style={
        {
          "--accent": pillar.color,
          "--light": pillar.light,
        } as React.CSSProperties
      }
    >
      <div className="bg-white border border-[#DDE5EB] rounded-[13px] p-4 flex items-center font-black leading-[1.25]" style={{ color: pillar.color }}>
        FY2025/26<br />
        Impact highlights
      </div>

      {highlights.map((h, i) => (
        <a
          key={i}
          href={sourceLink(h.page)}
          target="_blank"
          rel="noopener noreferrer"
          title="View Annual Report disclosure"
          className="bg-white border border-[#DDE5EB] rounded-[13px] p-3 flex items-center gap-2.5 no-underline min-h-[94px] transition-transform hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(15,39,76,.09)] focus-visible:outline-none"
        >
          <div
            className="w-10 h-10 rounded-full grid place-items-center shrink-0 text-lg"
            style={{ backgroundColor: pillar.light, color: pillar.color }}
          >
            {h.icon}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-[#28364B]">
              {h.title}
            </div>
            <div
              className="text-[21px] font-black leading-[1.05] mt-[3px]"
              style={{ color: pillar.color }}
            >
              {h.value}
            </div>
            <div className="text-[10px] leading-[1.25] text-[#47566A]">
              {h.unit} · View disclosure ↗
            </div>
          </div>
        </a>
      ))}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#EDF7FB] to-[#DCEEF6] border border-[#D5E5EE] rounded-[13px] p-4 flex items-center justify-between gap-3 max-md:col-span-1 max-lg:col-span-full">
        <div className="after:absolute after:right-[-25px] after:bottom-[-42px] after:w-[180px] after:h-[105px] after:rounded-full after:bg-[rgba(72,160,186,.13)]">
          <div className="relative z-10 text-xs leading-[1.5] max-w-[180px]">
            Explore Haycarb&apos;s climate-related risks, opportunities and
            resilience analysis.
          </div>
        </div>
        <a
          href={META.climateDashboardUrl}
          className="relative z-10 no-underline rounded-full bg-[#006A78] text-white px-3.5 py-2.5 text-[10px] font-black whitespace-nowrap"
        >
          Climate Risk &amp; Resilience →
        </a>
      </div>
    </section>
  );
}
