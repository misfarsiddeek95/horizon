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
  const hasGroupTitles = groups.some((g) => g.title);

  return (
    <section aria-label="Key metrics" className="w-full">
      {tabTitle && (
        <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          <h2
            data-animate
            className="font-['Minion_Pro'] font-medium text-3xl leading-tight md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-3 md:mb-4"
          >
            {tabTitle} metrics
          </h2>
          {tabIntro && (
            <p
              data-animate
              className="font-sans text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md"
            >
              {tabIntro}
            </p>
          )}
        </div>
      )}

      {hasGroupTitles ? (
        <div className="flex flex-col gap-8 md:gap-10">
          {groups.map((group, groupIdx) => (
            <div key={group.title}>
              {group.title && (
                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                  <span className="h-px flex-1 bg-white/25" />
                  <h3 className="shrink-0 font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-[#d5e7ee]">
                    {group.title}
                  </h3>
                  <span className="h-px flex-1 bg-white/25" />
                </div>
              )}
              <div className="flex flex-wrap justify-center items-stretch gap-4 md:gap-5 lg:gap-6">
                {group.metrics.map((metric, cardIdx) => (
                  <MetricCard
                    key={metric.label}
                    metric={metric}
                    delay={(groupIdx * group.metrics.length + cardIdx) * 0.08}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center items-stretch gap-4 md:gap-5 lg:gap-6">
          {groups[0]?.metrics.map((metric, cardIdx) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              delay={cardIdx * 0.08}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function MetricCard({
  metric,
  delay = 0,
}: {
  metric: { value: string; label: string };
  delay?: number;
}) {
  return (
    <div
      className="super-pop-card metric-card-enter relative flex flex-col items-center justify-center p-5 md:p-6 rounded-2xl bg-[rgba(2,44,59,0.34)] border border-[rgba(255,255,255,0.16)] transition-all duration-300 hover:bg-[rgba(3,71,92,0.78)] hover:border-[rgba(199,237,246,0.66)] hover:-translate-y-2 hover:scale-[1.08] hover:shadow-[0_26px_60px_rgba(0,21,31,0.34)] min-w-[160px] sm:min-w-[200px] lg:min-w-[220px] flex-1 max-w-[280px] text-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="font-['Minion_Pro'] text-2xl md:text-3xl lg:text-4xl font-semibold text-white relative z-10">
        <AnimatedCounter value={metric.value} />
      </p>
      <p className="font-sans text-[10px] md:text-xs font-medium uppercase tracking-widest text-[#d5e7ee] mt-2 relative z-10">
        {metric.label}
      </p>
    </div>
  );
}
