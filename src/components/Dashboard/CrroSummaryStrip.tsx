import type { CrroData } from "@/data/climateDashboard";

interface CrroSummaryStripProps {
  crro: CrroData;
}

export default function CrroSummaryStrip({ crro }: CrroSummaryStripProps) {
  return (
    <div className="grid grid-cols-3 gap-4 bg-white border border-[#DDE5EB] rounded-[14px] p-4 shadow-[0_5px_15px_rgba(15,39,76,.045)]">
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#667085]">
          Classification
        </div>
        <div
          className="mt-1 text-sm font-bold"
          style={{ color: crro.color }}
        >
          {crro.classification}
        </div>
      </div>
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#667085]">
          Key driver
        </div>
        <div className="mt-1 text-sm font-bold text-[#071D43]">
          {crro.keyDriver}
        </div>
      </div>
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#667085]">
          Financial effect
        </div>
        <div className="mt-1 text-sm font-bold text-[#071D43]">
          {crro.keyFinancial}
        </div>
      </div>
    </div>
  );
}
