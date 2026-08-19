"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChairmanSectionV2Props {
  title: string;
  text: string;
}

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl";

const COLLAPSED_LINES = 5;

export default function ChairmanSectionV2({
  title,
  text,
}: ChairmanSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const expandedRef = useRef(false);

  const handleScrollToStrategy = () => {
    document
      .getElementById("scene-strategy")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleToggle = () => {
    const el = textRef.current;
    if (!el) {
      expandedRef.current = !expandedRef.current;
      setExpanded(expandedRef.current);
      return;
    }

    el.style.maxHeight = `${el.getBoundingClientRect().height}px`;

    if (expandedRef.current) {
      expandedRef.current = false;
      requestAnimationFrame(() => {
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        el.style.maxHeight = `${lineHeight * COLLAPSED_LINES}px`;
      });
    } else {
      expandedRef.current = true;
      setExpanded(true);
      requestAnimationFrame(() => {
        el.style.maxHeight = `${el.scrollHeight}px`;
      });
    }
  };

  const handleTransitionEnd = (
    e: React.TransitionEvent<HTMLParagraphElement>
  ) => {
    if (e.propertyName !== "max-height" || e.target !== e.currentTarget) return;
    const el = textRef.current;
    if (!el) return;
    el.style.maxHeight = "";
    if (!expandedRef.current) {
      setExpanded(false);
    }
  };

  return (
    <section
      ref={ref}
      aria-label={title}
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        data-animate
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full items-stretch"
      >
        <div className="relative w-full h-full min-h-96 md:min-h-full rounded-2xl overflow-hidden">
          <Image
            src="/images/user-profile/chariman.png"
            alt="Chairman"
            fill
            className="object-contain w-full h-full"
            priority
          />
        </div>

        <div className="flex flex-col justify-center w-full h-full mt-0 lg:mt-10">
          <h2
            className={`${HEADING_GRADIENT} text-3xl leading-tight md:text-4xl lg:text-5xl mb-6`}
          >
            {title}
          </h2>
          <p
            ref={textRef}
            onTransitionEnd={handleTransitionEnd}
            className={`expanding-text max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md ${
              expanded ? "" : "line-clamp-6"
            }`}
          >
            {text}
          </p>
          {text.length > 200 && (
            <button
              onClick={handleToggle}
              aria-expanded={expanded}
              className="mt-2 text-white-main text-sm font-semibold hover:opacity-70 transition-opacity cursor-pointer self-start"
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
