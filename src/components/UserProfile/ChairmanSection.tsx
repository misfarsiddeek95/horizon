"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Button from "@/components/ui/Button";

interface ChairmanSectionV2Props {
  title: string;
  text: string;
  link?: {
    label: string;
    url: string;
  };
}

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl";

const COLLAPSED_LINES = 5;

export default function ChairmanSectionV2({
  title,
  text,
  link,
}: ChairmanSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const expandedRef = useRef(false);

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
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 lg:gap-12 w-full items-center"
      >
        <div className="relative w-full h-64 sm:h-80 md:h-[28rem] rounded-2xl overflow-hidden">
          <Image
            src="/images/user-profile/chairman.png"
            alt="Chairman"
            fill
            className="object-contain w-full h-full"
            priority
          />
        </div>

        <div className="flex flex-col justify-center w-full h-full mt-0 lg:mt-10">
          <h2
            className={`${HEADING_GRADIENT} text-3xl leading-tight md:text-4xl lg:text-5xl mt-1 md:mt-0 mb-3 md:mb-6`}
          >
            {title}
          </h2>
          <p
            ref={textRef}
            onTransitionEnd={handleTransitionEnd}
            className={`expanding-text max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md ${
              expanded ? "" : "line-clamp-5"
            }`}
          >
            {text}
          </p>
          {text.length > 200 && (
            <button
              onClick={handleToggle}
              aria-expanded={expanded}
              className="mt-2 text-white-main text-base font-semibold underline hover:opacity-70 transition-opacity cursor-pointer self-start"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
          <div className="mt-8 self-start">
            {link ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  radius="full"
                  icon={<PlayIcon />}
                  iconPosition="left"
                >
                  {link.label}
                </Button>
              </a>
            ) : (
              <Button
                variant="primary"
                radius="full"
                icon={<PlayIcon />}
                iconPosition="left"
              >
                Joint Message Video
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
