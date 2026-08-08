import { PILLARS } from "@/data/activateDashboard";

interface PillarTabsProps {
  activePillar: string;
  onPillarChange: (name: string) => void;
}

const PILLAR_ENTRIES = Object.entries(PILLARS);

export default function PillarTabs({
  activePillar,
  onPillarChange,
}: PillarTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="ACTIVATE 2030 pillars"
      className="grid grid-cols-5 bg-white border border-[#DDE5EB] rounded-[15px] overflow-hidden shadow-[0_8px_24px_rgba(15,39,76,.075)] mb-3.5 max-md:flex max-md:overflow-x-auto"
    >
      {PILLAR_ENTRIES.map(([name, p]) => {
        const isActive = name === activePillar;
        return (
          <button
            key={name}
            role="tab"
            aria-selected={isActive}
            onClick={() => onPillarChange(name)}
            className="min-w-0 border-0 border-r border-r-[#DDE5EB] bg-white px-3 py-2.5 flex items-center justify-center gap-2.5 relative transition-colors max-md:min-w-[200px] max-md:justify-start last:border-r-0 hover:bg-[var(--light)] focus-visible:outline-3 focus-visible:outline-[color-mix(in_srgb,var(--accent)_35%,transparent)] focus-visible:outline-offset-[-3px]"
            style={
              {
                "--accent": p.color,
                "--light": p.light,
                color: p.color,
                background: isActive ? p.light : undefined,
              } as React.CSSProperties
            }
          >
            <div
              className="absolute inset-0 bottom-auto h-[3px]"
              style={{
                background: isActive ? p.color : "transparent",
              }}
            />
            <img
              src={p.iconData}
              alt=""
              aria-hidden="true"
              className="w-12 h-12 object-contain"
            />
            <div className="text-left">
              <div className="text-sm font-black leading-none">{name}</div>
              <div className="text-[9.5px] leading-[1.2] mt-1 text-[#34534B]">
                {p.descriptor}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
