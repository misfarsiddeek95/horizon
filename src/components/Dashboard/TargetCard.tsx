import type { Target, Pillar } from "@/data/activateDashboard";
import { STATUS_COLORS, STATUS_BG } from "@/data/activateDashboard";

interface TargetCardProps {
  target: Target;
  pillar: Pillar;
  isMany: boolean;
  onSelect?: () => void;
}

export default function TargetCard({ target, pillar, isMany, onSelect }: TargetCardProps) {
  const statusColor = STATUS_COLORS[target.status] || "#667085";
  const statusBg = STATUS_BG[target.status] || "#F5F7F9";

  const statusMain =
    target.progress !== null
      ? target.progress >= 100
        ? "100%"
        : `${target.progress}%`
      : target.status === "Achieved / exceeded"
        ? "Maintained"
        : "";

  const progressPercent =
    target.progress !== null
      ? Math.max(0, Math.min(100, target.progress))
      : null;

  return (
    <button
      className={`w-full text-left bg-white transition-colors hover:bg-[var(--light)] focus-visible:outline-none ${
        isMany
          ? "border border-[#E2E8ED] rounded-[11px] p-[9px_10px]"
          : "border-b border-b-[#E6EBEF] py-2.5 px-1 last:border-b-0"
      }`}
      style={
        {
          "--accent": pillar.color,
          "--light": pillar.light,
        } as React.CSSProperties
      }
      aria-label={`Open details for ${target.indicator}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2.5 mb-2">
        <div className="min-w-0 flex-1">
          <div
            className={`font-[850] leading-[1.3] ${
              isMany ? "text-xs" : "text-sm"
            }`}
          >
            {target.indicator}
          </div>
          <div
            className={`font-black mt-1 ${isMany ? "text-sm" : "text-[15px]"}`}
            style={{ color: pillar.color }}
          >
            {target.current}
          </div>
          <div className={`text-[#667085] mt-0.5 ${isMany ? "text-[10px]" : "text-xs"}`}>
            {target.unit}
          </div>
        </div>

        <div
          className={`rounded-[10px] text-center flex flex-col items-center justify-center shrink-0 ${
            isMany ? "min-w-[88px] min-h-[44px] p-[5px_7px]" : "min-w-[104px] min-h-[50px] p-[7px_9px]"
          }`}
          style={{ backgroundColor: statusBg, color: statusColor }}
        >
          <div className={`font-black leading-none ${isMany ? "text-sm" : "text-[17px]"}`}>
            {statusMain}
          </div>
          <div className={`font-[850] leading-[1.25] mt-1 ${isMany ? "text-[10px]" : "text-[10px]"}`}>
            {target.status}
          </div>
          <div className={`mt-1 opacity-80 ${isMany ? "text-[9px]" : "text-[10px]"}`}>
            View details
          </div>
        </div>
      </div>

      <div>
        <div
          className={`grid grid-cols-3 font-bold ${
            isMany ? "text-[9px]" : "text-[10px]"
          } text-[#5D6B7C]`}
        >
          <span>Baseline</span>
          <span className="text-center">FY2025/26</span>
          <span className="text-right">2030 target</span>
        </div>
        <div
          className={`grid grid-cols-3 gap-1.5 mt-1 ${
            isMany ? "text-[11px]" : "text-xs"
          } text-[#344257]`}
        >
          <span>{target.baseline}</span>
          <span className="text-center font-black" style={{ color: pillar.color }}>
            {target.current}
          </span>
          <span className="text-right">{target.target2030}</span>
        </div>

        {progressPercent !== null ? (
          <div className="h-[5px] rounded-full bg-[#E5EBF0] mt-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: pillar.color,
              }}
            />
          </div>
        ) : (
          <div className="text-[11px] text-[#6B7787] mt-[7px] leading-[1.3]">
            {target.status === "Requires acceleration"
              ? "Gap-based or multi-part indicator"
              : "Qualitative / status-based commitment"}
          </div>
        )}
      </div>
    </button>
  );
}
