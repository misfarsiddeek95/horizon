import { ArrowRightIcon, CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";
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

const eyebrowClass = "text-xs font-bold uppercase tracking-[0.25em] text-brand-main";
const headingClass =
  "mt-3 font-sans text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl";

export default function GovernanceStrategySection({
  governance,
  highlights,
  strategy,
}: GovernanceStrategySectionProps) {
  return (
    <section
      aria-label="Governance and strategy"
      className="group relative -mx-4 rounded-2xl p-4 transition-colors duration-500 hover:bg-brand-main/[0.02]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="animate-user-profile-fade-up">
          {governance ? (
            <>
              <p className={eyebrowClass}>Accountability</p>
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
              <p className={eyebrowClass}>Highlights</p>
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
          <p className={eyebrowClass}>Direction</p>
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

          <div className="mt-10 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-main/10 text-brand-main">
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
