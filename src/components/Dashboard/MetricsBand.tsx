import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface Metric {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}

const METRICS: Metric[] = [
  { label: "Total commitments", value: "20", sub: "Across 5 ACTIVATE pillars" },
  {
    label: "Achieved / maintained",
    value: "5",
    sub: "Targets met or maintained",
    accent: "#4f8f55",
  },
  {
    label: "On track / progressing",
    value: "11",
    sub: "Moving toward 2030",
    accent: "#178a87",
  },
  {
    label: "Requires acceleration",
    value: "4",
    sub: "Further action required",
    accent: "#d17b2e",
  },
];

export default function MetricsBand() {
  return (
    <div
      className="mb-[78px] mt-[54px] grid grid-cols-1 border-y border-[var(--color-v2-border-metric)] sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Commitment status"
    >
      {METRICS.map((metric) => (
        <div
          key={metric.label}
          className="relative border-b border-[var(--color-v2-border-metric)] py-[34px] pr-[30px] last:border-b-0 sm:[&:not(:first-child)]:pl-7 sm:odd:border-r lg:border-b-0 lg:last:border-r-0"
        >
          <div className="font-[850] text-[10px] uppercase tracking-[0.13em] text-[var(--color-v2-label)]">
            {metric.label}
          </div>
          <div
            className="my-[14px] mb-[7px] text-[48px] font-semibold leading-none tracking-[-0.045em] [&>span]:text-[48px]"
            style={metric.accent ? { color: metric.accent } : undefined}
          >
            <AnimatedCounter value={metric.value} />
          </div>
          <div className="text-[13px] text-[var(--color-v2-text-faint)]">
            {metric.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
