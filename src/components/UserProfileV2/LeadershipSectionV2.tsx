"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";
import Button from "@/components/ui/Button";

interface LeadershipSectionV2Props {
  governance: {
    title: string;
    paragraphs: string[];
    download: DownloadLink;
  };
}

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl text-3xl leading-tight md:text-4xl lg:text-5xl";

export default function LeadershipSectionV2({
  governance,
}: LeadershipSectionV2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePara, setActivePara] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      if (progress < 1 / 3) setActivePara(0);
      else if (progress < 2 / 3) setActivePara(1);
      else setActivePara(2);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={governance.title}
      className="relative h-[50vh] mb-0"
    >
      <div className="sticky top-32 flex h-auto flex-col items-center mx-auto max-w-4xl text-center px-4">
        <h2 className={`${HEADING_GRADIENT} mb-4 text-center`}>
          {governance.title}
        </h2>

        <div className="grid mt-2">
          {governance.paragraphs.map((paragraph, index) => (
            <div
              key={index}
              className={`col-start-1 row-start-1 flex flex-col items-center transition-opacity duration-500 ${
                activePara === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <p className="max-w-3xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-slate-200 drop-shadow-md pb-5">
                {paragraph}
              </p>
              {index === 2 && (
                <Button
                  behavior="link"
                  href={governance.download.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  radius="full"
                  icon={<ArrowDownTrayIcon />}
                  iconPosition="right"
                  aria-label={`Download ${governance.download.label}`}
                >
                  {governance.download.label}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
