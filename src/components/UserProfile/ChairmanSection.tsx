"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function ChairmanSectionV2({
  title,
  text,
  link,
}: ChairmanSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [expanded, setExpanded] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const expandedRef = useRef(false);

  const youtubeId = link ? extractYouTubeId(link.url) : null;

  const closeVideo = useCallback(() => setIsVideoOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVideoOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isVideoOpen, closeVideo]);

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
              <Button
                variant="primary"
                radius="full"
                icon={<PlayIcon />}
                iconPosition="left"
                onClick={() => setIsVideoOpen(true)}
              >
                {link.label}
              </Button>
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

      {isVideoOpen && mounted && youtubeId && createPortal(
        <div
          className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 md:p-10"
          onClick={closeVideo}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              aria-label="Close video"
              className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-colors hover:bg-white/20 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0`}
              title="Joint Message Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
