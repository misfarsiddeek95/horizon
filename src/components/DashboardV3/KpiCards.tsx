"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface Kpi {
  label: string;
  value: string;
  sub: string;
  accent: string;
}

const KPIS: Kpi[] = [
  {
    label: "Total commitments",
    value: "20",
    sub: "Across 5 ACTIVATE pillars",
    accent: "#ffffff",
  },
  {
    label: "Achieved / maintained",
    value: "5",
    sub: "Targets met or maintained",
    accent: "var(--color-lime)",
  },
  {
    label: "On track / progressing",
    value: "11",
    sub: "Moving toward 2030",
    accent: "var(--color-mint)",
  },
  {
    label: "Requires acceleration",
    value: "4",
    sub: "Further action required",
    accent: "var(--color-gold)",
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {KPIS.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl"
        >
          <div className="flex items-center gap-2 text-[10px] font-[850] uppercase tracking-[0.13em] text-white/70">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: kpi.accent }}
              aria-hidden="true"
            />
            {kpi.label}
          </div>
          <div
            className="mb-1 mt-3 font-semibold leading-none tracking-[-0.03em] [&>span]:text-[40px] lg:[&>span]:text-[48px]"
            style={{ color: kpi.accent }}
          >
            <AnimatedCounter value={kpi.value} />
          </div>
          <div className="text-[12px] text-white/60">{kpi.sub}</div>
        </div>
      ))}
    </div>
  );
}
