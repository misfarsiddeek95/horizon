import { ArrowRightIcon, CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import DownloadButtonV2 from "./DownloadButtonV2";

interface GovernanceStrategySectionV2Props {
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

const HEADING_GRADIENT =
  "font-['Minion_Pro'] font-medium bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl text-2xl tracking-tight md:text-3xl lg:text-4xl";

export default function GovernanceStrategySectionV2({
  governance,
  highlights,
  strategy,
}: GovernanceStrategySectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label="Governance and strategy"
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:gap-14 lg:grid-cols-2 lg:gap-20">
        <div data-animate className="flex flex-col">
          {governance ? (
            <>
              <h2 className={HEADING_GRADIENT + " mb-6"}>{governance.title}</h2>
              <p className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md">
                {governance.text}
              </p>
              <div className="mt-6 md:mt-8">
                <DownloadButtonV2 download={governance.download} />
              </div>
            </>
          ) : (
            <>
              <h2 className={HEADING_GRADIENT + " mb-6"}>Key Highlights</h2>
              <ul className="space-y-3 md:space-y-4">
                {highlights?.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 md:gap-3">
                    <CheckCircleIcon className="mt-1 h-4 w-4 md:h-5 md:w-5 shrink-0 text-brand-main" />
                    <span className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-sm">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div data-animate className="flex flex-col">
          <h2 className={HEADING_GRADIENT + " mb-6"}>{strategy.title}</h2>

          {strategy.text ? (
            <p className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md">
              {strategy.text}
            </p>
          ) : (
            <ul className="space-y-3 md:space-y-4">
              {strategy.items?.map((item) => (
                <li key={item} className="flex items-start gap-2 md:gap-3">
                  <ArrowRightIcon className="mt-1.5 h-3 w-3 md:h-4 md:w-4 shrink-0 text-brand-main" />
                  <span className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
            {strategy.download && (
              <DownloadButtonV2 download={strategy.download} />
            )}

            <div className="flex items-center gap-2 md:gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-4 md:px-5 py-3 md:py-4 shadow-lg backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-slate-800/60 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
              <span className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-brand-main/20 text-brand-main">
                <ShieldCheckIcon className="h-4 w-4 md:h-5 md:w-5" />
              </span>
              <p className="text-xs md:text-sm font-medium text-slate-300">
                Governance and strategy working in harmony.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
