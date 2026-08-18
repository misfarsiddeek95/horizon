"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChairmanSectionV2Props {
  title: string;
  text: string;
}

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl";

export default function ChairmanSectionV2({ title, text }: ChairmanSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [expanded, setExpanded] = useState(false);

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
      <div data-animate className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 items-stretch">
        <div className="flex items-start justify-center w-full h-full pt-0 px-4 pb-4 lg:px-6 lg:pb-6">
          <div className="relative w-full h-full max-h-full rounded-2xl overflow-hidden">
            <Image
              src="/images/user-profile/chariman.png"
              alt="Chairman"
              fill
              className="object-contain object-center w-full h-full"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className={`${HEADING_GRADIENT} text-3xl leading-tight md:text-4xl lg:text-5xl mb-6`}>
            {title}
          </h2>
          <p className={`max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md ${expanded ? "" : "line-clamp-5"}`}>
            {text}
          </p>
          {text.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-brand-main text-sm font-semibold hover:opacity-70 transition-opacity cursor-pointer self-start"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
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
