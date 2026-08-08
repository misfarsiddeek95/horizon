import type { Pillar } from "@/data/activateDashboard";

interface PillarHeroProps {
  pillar: Pillar;
  pillarName: string;
}

export default function PillarHero({ pillar, pillarName }: PillarHeroProps) {
  return (
    <article
      className="bg-white border border-[#DDE5EB] rounded-[17px] shadow-[0_8px_24px_rgba(15,39,76,.075)] overflow-hidden border-l-[5px]"
      style={{ borderLeftColor: pillar.color }}
    >
      <div className="h-[158px] relative overflow-hidden bg-[#E7ECEF]">
        <img
          src={pillar.heroData}
          alt={`${pillarName} — ${pillar.descriptor}`}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute left-[-10%] right-[-10%] bottom-[-44px] h-[78px] bg-white rounded-t-[50%]"
          style={{ borderTop: `4px solid ${pillar.color}` }}
        />
      </div>

      <div className="pt-[7px] px-[19px] pb-[18px]">
        <div className="flex items-center gap-2.5">
          <img src={pillar.iconData} alt="" className="w-[58px] h-[58px]" />
          <div>
            <div
              className="text-[22px] font-black leading-none"
              style={{ color: pillar.color }}
            >
              {pillarName}
            </div>
            <div className="text-xs text-[#28613F] mt-1">
              {pillar.descriptor}
            </div>
          </div>
        </div>

        <p className="text-[12.5px] leading-[1.5] text-[#314056] mt-3 mb-3.5">
          {pillar.purpose}
        </p>

        <div className="border-t border-[#DDE5EB] pt-3.5 grid grid-cols-[34px_1fr] gap-2.5">
          <div
            className="w-[33px] h-[33px] rounded-full grid place-items-center text-white text-sm"
            style={{ backgroundColor: pillar.color }}
          >
            ★
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.04em]" style={{ color: pillar.color }}>
              FY2025/26 standout
            </div>
            <div className="text-[11px] leading-[1.4] mt-1">
              {pillar.standout}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
