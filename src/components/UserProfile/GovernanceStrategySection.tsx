import { ArrowRightIcon, CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import DownloadButton from "./DownloadButton";

interface GovernanceStrategySectionProps {
  governance?: {
    title: string;
    text: string;
    download: DownloadLink;
  };
  highlights?: string[];
  strategy: {
    title: string;
    items?: string[];
    text?: string;
    download?: DownloadLink;
  };
}

const headingClass =
  "font-['Minion_Pro'] font-medium text-4xl tracking-tight text-heading md:text-5xl";

export default function GovernanceStrategySection({
  governance,
  highlights,
  strategy,
}: GovernanceStrategySectionProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label="Governance and strategy"
      className={`group relative -mx-4 rounded-2xl p-4 transition-all duration-1000 ease-out will-change-opacity will-change-transform hover:bg-brand-main/[0.02] ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="animate-user-profile-fade-up">
          {governance ? (
            <>

              <h2 className={headingClass}>{governance.title}</h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                {governance.text}
              </p>
              <div className="mt-8">
                <DownloadButton download={governance.download} />
              </div>
            </>
          ) : (
            <>

              <h2 className={headingClass}>Key Highlights</h2>
              <ul className="mt-8 space-y-4">
                {highlights?.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-1 h-5 w-5 shrink-0 text-brand-main" />
                    <span className="text-lg leading-relaxed text-slate-700">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div
          className="animate-user-profile-fade-up"
          style={{ animationDelay: "150ms" }}
        >

          <h2 className={headingClass}>{strategy.title}</h2>

          {strategy.text ? (
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              {strategy.text}
            </p>
          ) : (
            <ul className="mt-8 space-y-4">
              {strategy.items?.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ArrowRightIcon className="mt-1.5 h-4 w-4 shrink-0 text-brand-main" />
                  <span className="text-lg leading-relaxed text-slate-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {strategy.download && (
            <div className="mt-8">
              <DownloadButton download={strategy.download} />
            </div>
          )}

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-md">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-main/10 text-brand-main">
              <ShieldCheckIcon className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium text-slate-500">
              Governance and strategy working in harmony.
            </p>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-4 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-brand-main/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:scale-x-100 group-hover:opacity-100"
      />
    </section>
  );
}
