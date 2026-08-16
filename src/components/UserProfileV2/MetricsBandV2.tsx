import { useCallback } from "react";
import type { MetricGroup } from "@/data/userProfiles";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface MetricsBandV2Props {
  groups: MetricGroup[];
  tabTitle?: string;
  tabIntro?: string;
}

export default function MetricsBandV2({
  groups,
  tabTitle,
  tabIntro,
}: MetricsBandV2Props) {
  return (
    <section aria-label="Key metrics" className="w-full">
      {tabTitle && (
        <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          <h2 className="font-['Minion_Pro'] font-medium text-2xl md:text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-3 md:mb-4">
            {tabTitle} metrics
          </h2>
          {tabIntro && (
            <p className="font-sans text-sm md:text-base text-slate-300 leading-relaxed">
              {tabIntro}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center items-stretch gap-4 md:gap-5 lg:gap-6">
        {groups.map((group) =>
          group.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))
        )}
      </div>
    </section>
  );
}

function MetricCard({
  metric,
}: {
  metric: { value: string; label: string };
}) {
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
      e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
    },
    []
  );

  return (
    <div
      data-animate
      onMouseMove={handleMouseMove}
      className="metric flex flex-col justify-between p-5 md:p-6 rounded-2xl min-w-[160px] sm:min-w-[200px] lg:min-w-[220px] flex-1 max-w-[280px]"
    >
      <p className="font-sans text-[10px] md:text-xs font-medium uppercase tracking-widest text-[#d5e7ee] relative z-10">
        {metric.label}
      </p>
      <p className="font-['Minion_Pro'] text-2xl md:text-3xl lg:text-4xl font-semibold text-white mt-3 relative z-10">
        <AnimatedCounter value={metric.value} />
      </p>
    </div>
  );
}
