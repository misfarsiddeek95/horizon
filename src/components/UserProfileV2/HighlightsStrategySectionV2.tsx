import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import DownloadButtonV2 from "./DownloadButtonV2";

gsap.registerPlugin(ScrollTrigger);

interface HighlightsStrategySectionV2Props {
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

export default function HighlightsStrategySectionV2({
  highlights,
  strategy,
}: HighlightsStrategySectionV2Props) {
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
      aria-label="Highlights and strategy"
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
        {highlights && (
          <div data-animate className="flex flex-col">
            <h2 className={HEADING_GRADIENT + " mb-8 text-center"}>Key Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex flex-col items-center"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-700/30 ring-1 ring-white/10">
                    <CheckCircleIcon className="h-8 w-8 text-brand-main" />
                  </span>
                  <p className="mt-4 text-center text-sm md:text-base leading-relaxed text-slate-200 drop-shadow-sm">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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

          {strategy.download && (
            <div className="mt-6 md:mt-8">
              <DownloadButtonV2 download={strategy.download} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
