"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChairmanSectionV2Props {
  title: string;
  text: string;
}

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl";

const CARD_BASE =
  "rounded-2xl bg-glass-faint border border-border-subtle p-6 md:p-8 lg:p-10 backdrop-blur-xl transition-all duration-500 ease-out hover:bg-glass-card-hover hover:border-border-card-hover hover:shadow-metric-hover";

export default function ChairmanSectionV2({ title, text }: ChairmanSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  const handleScrollToStrategy = () => {
    document.getElementById("scene-strategy")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      aria-label={title}
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div data-animate className={`${CARD_BASE} mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 md:gap-12 items-center`}>
        <div className="flex items-center justify-center">
          <div className="relative w-full animate-portrait-float drop-shadow-2xl">
            <Image
              src="/images/user-profile/chariman.png"
              alt="Chairman"
              width={339}
              height={464}
              className="h-auto w-full object-contain object-bottom"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className={`${HEADING_GRADIENT} text-3xl leading-tight md:text-4xl lg:text-5xl mb-6`}>
            {title}
          </h2>
          <p className="max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md">
            {text}
          </p>
          <button
            onClick={handleScrollToStrategy}
            className="mt-8 inline-flex items-center gap-2 text-white font-semibold text-sm md:text-base transition-colors duration-300 hover:opacity-70 self-end cursor-pointer"
          >
            Continue to Strategy
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
