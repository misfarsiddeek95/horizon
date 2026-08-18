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
      <h2 data-animate className={HEADING_GRADIENT + " mb-6"}>
        {governance.title}
      </h2>
      <p
        data-animate
        className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md max-w-4xl"
      >
        {governance.text}
      </p>
      <div data-animate className="mt-6 md:mt-8">
        <DownloadButtonV2 download={governance.download} />
      </div>
    </section>
  );
}
