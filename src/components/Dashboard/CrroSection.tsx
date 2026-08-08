import { useState } from "react";
import type { CrroData, CrroDriverData, CrroFinancialItem } from "@/data/climateDashboard";
import CrroSummaryStrip from "./CrroSummaryStrip";
import CrroLineChart from "./CrroLineChart";
import ExplorerEvidence from "./ExplorerEvidence";

interface CrroSectionProps {
  crro: CrroData;
}

function formatRangeValue(low: number, high: number, format: string, unit: string): string {
  const fmt = (v: number) => {
    if (format === "percent") return `${v}%`;
    if (format === "multiple") return `${v}×`;
    return `${v} ${unit}`;
  };
  if (low === high) return fmt(low);
  return `${fmt(low)} – ${fmt(high)}`;
}

function EstimatedRange({ metric }: { metric: CrroDriverData | CrroFinancialItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
      <span className="font-extrabold text-[#344257]">Estimated range</span>
      {metric.values.map((v) => (
        <span key={v.h} className="text-[#4A586B]">
          <span className="font-bold text-[#344257]">{v.h}</span>{" "}
          {formatRangeValue(v.low, v.high, metric.format, metric.unit)}
        </span>
      ))}
    </div>
  );
}

function WhatThisMeans({ meaning }: { meaning: string }) {
  return (
    <div className="bg-[#F5F8FB] rounded-lg p-3">
      <div className="text-xs font-extrabold uppercase tracking-[0.05em] text-[#667085] mb-1">
        What this means
      </div>
      <div className="text-sm text-[#4A586B] leading-[1.6]">{meaning}</div>
    </div>
  );
}

function ScopeAndAssumptions({ note }: { note: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-[#E2E8ED] pt-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xs font-extrabold text-[#344257] cursor-pointer hover:text-brand-main transition-colors flex items-center gap-1.5 bg-transparent border-0 p-0"
      >
        <span className={`text-[10px] transition-transform duration-200 ease-in-out ${isOpen ? "rotate-90" : ""}`}>▶</span>
        Scope and assumptions
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-2 text-sm text-[#4A586B] leading-[1.6] pl-3.5">
            {note}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CrroSection({ crro }: CrroSectionProps) {
  const financialData = crro.financial[0];

  return (
    <article className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-brand-main">
          {crro.name}
        </h3>
        <p className="text-sm text-[#4C5C70] mt-1 leading-relaxed">
          {crro.description}
        </p>
      </div>

      <CrroSummaryStrip crro={crro} />

      <div className="bg-white border border-[#E2E8ED] rounded-[11px] p-4 space-y-4">
        <div>
          <h4 className="text-base font-extrabold text-brand-main">
            {crro.driver.title}
          </h4>
          <p className="text-sm text-[#667085] mt-0.5">
            {crro.driver.subtitle}
          </p>
        </div>
        <EstimatedRange metric={crro.driver} />
        <CrroLineChart
          data={crro.driver.values}
          axis={crro.driver.axis}
          unit={crro.driver.unit}
          format={crro.driver.format}
          accentColor={crro.color}
        />
        <WhatThisMeans meaning={crro.driver.meaning} />
        <ScopeAndAssumptions note={crro.driver.note} />
      </div>

      {financialData && (
        <div className="bg-white border border-[#E2E8ED] rounded-[11px] p-4 space-y-4">
          <div>
            <h4 className="text-base font-extrabold text-brand-main">
              {financialData.title}
            </h4>
          <p className="text-sm text-[#667085] mt-0.5">
            {financialData.subtitle}
          </p>
          </div>
          <EstimatedRange metric={financialData} />
          <CrroLineChart
            data={financialData.values}
            axis={financialData.axis}
            unit={financialData.unit}
            format={financialData.format}
            accentColor={crro.color}
          />
          <WhatThisMeans meaning={financialData.meaning} />
          <ScopeAndAssumptions note={financialData.note} />
        </div>
      )}

      <ExplorerEvidence evidence={crro.evidence} color={crro.color} />
    </article>
  );
}
