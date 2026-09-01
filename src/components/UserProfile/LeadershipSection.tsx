"use client";

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
  return (
    <section
      aria-label={governance.title}
      className="relative"
    >
      <div className="flex flex-col items-center mx-auto max-w-4xl text-center px-4">
        <h2 className={`${HEADING_GRADIENT} mb-4 text-center`}>
          {governance.title}
        </h2>

        <div className="mt-2 flex flex-col items-center">
          {governance.paragraphs.map((paragraph, index) => (
            <p
              key={`${governance.title}-${index}`}
              className="max-w-3xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-slate-200 drop-shadow-md pb-5"
            >
              {paragraph}
            </p>
          ))}
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
        </div>
      </div>
    </section>
  );
}
