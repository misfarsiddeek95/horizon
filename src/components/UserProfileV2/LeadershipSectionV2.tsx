import Image from "next/image";
import type { DownloadLink } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import DownloadButtonV2 from "./DownloadButtonV2";

interface LeadershipSectionV2Props {
  governance: {
    title: string;
    text: string;
    download: DownloadLink;
  };
}

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl text-2xl tracking-tight md:text-3xl lg:text-4xl";

export default function LeadershipSectionV2({
  governance,
}: LeadershipSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label="Leadership and governance"
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        data-animate
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full items-stretch"
      >
        <div className="flex flex-col justify-center w-full h-full">
          <h2 className={HEADING_GRADIENT + " mb-6"}>{governance.title}</h2>
          <p className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md">
            {governance.text}
          </p>
          <div className="mt-6 md:mt-8">
            <DownloadButtonV2 download={governance.download} />
          </div>
        </div>

        <div className="relative w-full h-full min-h-96 md:min-h-full rounded-2xl overflow-hidden">
          <Image
            src="/images/placeholder_one_on_one.png"
            alt={governance.title}
            fill
            className="object-fill w-full h-full rounded-3xl!"
            priority
          />
        </div>
      </div>
    </section>
  );
}
