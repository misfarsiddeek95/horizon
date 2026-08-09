import type { Target, Pillar } from "@/data/activateDashboard";
import TargetCard from "./TargetCard";

interface TargetsPanelProps {
  targets: Target[];
  pillar: Pillar;
  pillarName: string;
  onSelectTarget: (target: Target) => void;
}

export default function TargetsPanel({
  targets,
  pillar,
  pillarName,
  onSelectTarget,
}: TargetsPanelProps) {
  const isMany = targets.length > 4;

  return (
    <section
      className="bg-white border border-[#DDE5EB] rounded-[17px] shadow-[0_8px_24px_rgba(15,39,76,.075)] p-3.5 min-w-0"
      style={
        {
          "--accent": pillar.color,
          "--light": pillar.light,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between gap-2.5 mb-1.5">
        <div>
          <div className="text-[15px] font-black text-[#071D43]">
            {pillarName} targets
          </div>
          <div className="text-[9px] text-[#667085] mt-0.5">
            All {targets.length} targets are shown. Select any target for
            milestones, methodology and source.
          </div>
        </div>
      </div>

      <div
        className={
          isMany
            ? "grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 content-start"
            : "grid"
        }
      >
        {targets.map((t) => (
          <TargetCard
            key={t.id}
            target={t}
            pillar={pillar}
            isMany={isMany}
            onSelect={() => onSelectTarget(t)}
          />
        ))}
      </div>
    </section>
  );
}
