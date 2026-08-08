import type { CrroData } from "@/data/climateDashboard";
import CrroSummaryStrip from "./CrroSummaryStrip";
import CrroLineChart from "./CrroLineChart";

interface CrroSectionProps {
  crro: CrroData;
}

export default function CrroSection({ crro }: CrroSectionProps) {
  const financialData = crro.financial[0];

  return (
    <article className="space-y-5">
      <div>
        <h3
          className="text-xl font-black text-brand-main"
        >
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
          <p className="text-xs text-[#667085] mt-0.5">
            {crro.driver.subtitle}
          </p>
        </div>
        <CrroLineChart
          data={crro.driver.values}
          axis={crro.driver.axis}
          unit={crro.driver.unit}
          format={crro.driver.format}
          accentColor={crro.color}
        />
        <div className="bg-[#F5F8FB] border-l-[3px] rounded-lg p-3 text-xs text-[#4A586B] leading-[1.45]" style={{ borderLeftColor: crro.color }}>
          {crro.driver.note}
        </div>
      </div>

      {financialData && (
        <div className="bg-white border border-[#E2E8ED] rounded-[11px] p-4 space-y-4">
          <div>
            <h4 className="text-base font-extrabold text-brand-main">
              {financialData.title}
            </h4>
            <p className="text-xs text-[#667085] mt-0.5">
              {financialData.subtitle}
            </p>
          </div>
          <CrroLineChart
            data={financialData.values}
            axis={financialData.axis}
            unit={financialData.unit}
            format={financialData.format}
            accentColor={crro.color}
          />
          <div className="bg-[#F5F8FB] border-l-[3px] rounded-lg p-3 text-xs text-[#4A586B] leading-[1.45]" style={{ borderLeftColor: crro.color }}>
            {financialData.note}
          </div>
        </div>
      )}
    </article>
  );
}
