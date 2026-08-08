import type { CrroData } from "@/data/climateDashboard";

interface CrroSelectionCardProps {
  crro: CrroData;
  isActive: boolean;
  onSelect: () => void;
}

export default function CrroSelectionCard({
  crro,
  isActive,
  onSelect,
}: CrroSelectionCardProps) {
  return (
    <button
      className={`w-full text-left bg-white border rounded-[11px] p-[9px_10px] transition-colors focus-visible:outline-none ${
        isActive
          ? "border-[2px] shadow-sm"
          : "border-[#E2E8ED] hover:bg-[var(--light)]"
      }`}
      style={
        {
          "--accent": crro.color,
          "--light": crro.light,
          ...(isActive
            ? { borderColor: crro.color }
            : {}),
        } as React.CSSProperties
      }
      aria-label={`View details for ${crro.shortName}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2.5 mb-2">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-[850] leading-[1.3]">
            {crro.id}
          </div>
          <div
            className="font-black text-sm mt-1"
            style={{ color: crro.color }}
          >
            {crro.shortName}
          </div>
          <div className="text-[10px] text-[#667085] mt-0.5">
            {crro.classification}
          </div>
        </div>

        <div
          className="rounded-[10px] text-center flex flex-col items-center justify-center shrink-0 min-w-[88px] min-h-[44px] p-[5px_7px]"
          style={{ backgroundColor: crro.light, color: crro.color }}
        >
          <div
            className="w-5 h-5 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: crro.iconSvg }}
          />
          <div className="text-[9.5px] font-[850] leading-[1.25] mt-1">
            {crro.classification}
          </div>
          <div className="text-[8.5px] opacity-80 mt-1">View details</div>
        </div>
      </div>
    </button>
  );
}
