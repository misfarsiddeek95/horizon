import type { MetricGroup } from "@/data/userProfiles";

interface MetricsBandProps {
  groups: MetricGroup[];
}

export default function MetricsBand({ groups }: MetricsBandProps) {
  const grouped = groups.some((group) => group.title);

  const valueClass =
    "whitespace-nowrap text-2xl font-extrabold tracking-tight text-brand-main lg:text-3xl";
  const labelClass = "mt-2 text-sm font-medium leading-snug text-slate-500";

  return (
    <section
      aria-label="Key metrics"
      className="relative -mx-4 overflow-hidden px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
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
                      <p className={valueClass}>{metric.value}</p>
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
                <p className={valueClass}>{metric.value}</p>
                <p className={labelClass}>{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
