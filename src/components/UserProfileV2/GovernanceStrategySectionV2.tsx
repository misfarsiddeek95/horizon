import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import DownloadButtonV2 from "./DownloadButtonV2";

gsap.registerPlugin(ScrollTrigger);

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
  "font-heading font-medium heading-gradient drop-shadow-2xl text-2xl tracking-tight md:text-3xl lg:text-4xl";

export default function GovernanceStrategySectionV2({
  governance,
  highlights,
  strategy,
}: GovernanceStrategySectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = timelineContainerRef.current;
    if (!container || !strategy.items || strategy.text) return;

    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>(".strategy-node-wrapper");
      if (nodes.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
        },
      });

      nodes.forEach((node) => {
        const dot = node.querySelector(".strategy-dot");
        const text = node.querySelector(".strategy-text");
        const line = node.querySelector(".strategy-line");

        tl.to([dot, text], {
          scale: 1,
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "back.out(1.5)",
        });

        if (line) {
          tl.to(line, {
            scaleY: 1,
            duration: 0.3,
            ease: "power1.inOut",
          });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [strategy.items, strategy.text]);

  return (
    <section
      ref={ref}
      aria-label="Governance and strategy"
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:gap-7 lg:grid-cols-2 lg:gap-10">
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
            <div
              ref={timelineContainerRef}
              className="relative strategy-timeline-container flex flex-col"
            >
              {strategy.items?.map((item, index) => (
                <div
                  key={index}
                  className={`relative pl-14 strategy-node-wrapper ${
                    index !== (strategy.items?.length ?? 0) - 1 ? "pb-10" : ""
                  }`}
                >
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-glass-faint border-2 border-brand-main flex items-center justify-center z-10 strategy-dot scale-0 shadow-lg">
                    <span className="text-white text-xs font-bold font-sans">
                      {index + 1}
                    </span>
                  </div>

                  {index !== (strategy.items?.length ?? 0) - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-brand-main origin-top scale-y-0 strategy-line" />
                  )}

                  <p className="text-slate-200 text-sm md:text-base leading-relaxed strategy-text opacity-0 translate-x-4 pt-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
            {strategy.download && (
              <DownloadButtonV2 download={strategy.download} />
            )}

            <div className="flex items-center gap-2 md:gap-3 rounded-2xl border border-white/10 bg-glass/50 px-4 md:px-5 py-3 md:py-4 shadow-lg backdrop-blur-xl glass-card-hover">
              <span className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
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
