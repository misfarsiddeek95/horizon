import type { MetricGroup } from "@/data/userProfiles";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface MetricsBandV2Props {
  groups: MetricGroup[];
}

export default function MetricsBandV2({ groups }: MetricsBandV2Props) {
  const grouped = groups.some((group) => group.title);

  return (
    <section aria-label="Key metrics" className="w-full">
      {grouped ? (
        <div className="flex flex-col gap-8 md:gap-12">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
                <span className="h-px flex-1 bg-white/25" />
                <h3 className="shrink-0 font-['Minion_Pro'] font-medium text-xs md:text-sm uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                  {group.title}
                </h3>
                <span className="h-px flex-1 bg-white/25" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5 lg:gap-6">
                {group.metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5 lg:gap-6">
          {groups[0]?.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      )}
    </section>
  );
}

function MetricCard({
  metric,
}: {
  metric: { value: string; label: string };
}) {
  return (
    <div
      data-animate
      className="group bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-slate-800/70 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
    >
      <p className="whitespace-nowrap text-lg md:text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
        <AnimatedCounter value={metric.value} />
      </p>
      <p className="mt-1.5 md:mt-2 text-xs md:text-sm font-medium leading-snug text-slate-300">
        {metric.label}
      </p>
    </div>
  );
}
