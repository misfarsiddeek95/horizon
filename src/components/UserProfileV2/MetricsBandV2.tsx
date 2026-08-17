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
        <div className="text-center mb-4 md:mb-6 max-w-2xl mx-auto">
          <h2
            data-animate
            className="font-heading font-medium text-3xl leading-tight md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-3 md:mb-4"
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
                  <h3 className="shrink-0 font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-content-muted">
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
      className="super-pop-card metric-card-enter relative flex flex-col items-center justify-center p-5 md:p-6 rounded-2xl bg-glass-faint border border-border-subtle transition-all duration-300 hover:bg-glass-card-hover hover:border-border-card-hover hover:-translate-y-2 hover:scale-[1.08] hover:shadow-metric-hover min-w-[160px] sm:min-w-[200px] lg:min-w-[220px] flex-1 max-w-[280px] text-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-white relative z-10">
        <AnimatedCounter value={metric.value} />
      </p>
      <p className="font-sans text-[10px] md:text-xs font-medium uppercase tracking-widest text-content-muted mt-2 relative z-10">
        {metric.label}
      </p>
    </div>
  );
}
