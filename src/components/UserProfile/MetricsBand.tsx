import type { MetricGroup } from "@/data/userProfiles";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface MetricsBandProps {
  groups: MetricGroup[];
}

export default function MetricsBand({ groups }: MetricsBandProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const grouped = groups.some((group) => group.title);

  const valueClass =
    "whitespace-nowrap text-2xl font-extrabold tracking-tight text-brand-main lg:text-3xl";
  const labelClass = "mt-2 text-sm font-medium leading-snug text-slate-500";

  return (
    <section
      ref={ref}
      aria-label="Key metrics"
      className={`group relative -mx-4 px-4 py-16 transition-all duration-1000 ease-out sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-brand-main/5 via-brand-main/10 to-brand-main/5"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]"
      >
        <span className="select-none text-[16rem] font-extrabold leading-none text-brand-main">
          %
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {grouped ? (
          <div className="flex flex-col gap-16 lg:gap-20">
            {groups.map((group, groupIndex) => (
              <div key={group.title}>
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-brand-main/25" />
                  <h3 className="shrink-0 text-sm font-bold uppercase tracking-[0.25em] text-brand-main">
                    {group.title}
                  </h3>
                  <span className="h-px flex-1 bg-brand-main/25" />
                </div>
                <div
                  className={`mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 ${
                    groupIndex === 0 ? "lg:gap-x-10" : ""
                  }`}
                >
                  {group.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex flex-col justify-center border-l-2 border-brand-main/30 pl-4 sm:pl-5"
                    >
                      <p className={valueClass}>
                        <AnimatedCounter value={metric.value} />
                      </p>
                      <p className={labelClass}>{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {groups[0]?.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col justify-center border-l-2 border-brand-main/30 pl-4 sm:pl-5"
              >
                <p className={valueClass}>
                  <AnimatedCounter value={metric.value} />
                </p>
                <p className={labelClass}>{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-4 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-brand-main/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:scale-x-100 group-hover:opacity-100"
      />
    </section>
  );
}
