import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface StrategyImageSectionV2Props {
  title: string;
  image: string;
  caption: string;
  isGeneralUser?: boolean;
}

const HEADING_GRADIENT =
  "font-heading font-medium bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl text-2xl tracking-tight md:text-3xl lg:text-4xl";

export default function StrategyImageSectionV2({
  title,
  image,
  caption,
  isGeneralUser = false,
}: StrategyImageSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label={title}
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-6" data-animate>
          <h2 className={HEADING_GRADIENT}>{title}</h2>
          <p className="mt-2 md:mt-4 text-sm md:text-lg leading-relaxed text-slate-200 drop-shadow-md">
            {caption}
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl" data-animate>
          <div
            aria-hidden="true"
            className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[24px] bg-gradient-to-br from-brand-main/25 via-accent-main/20 to-transparent"
          />
          <div className="relative overflow-hidden rounded-[24px] shadow-elevated ring-1 ring-white/10 transition-all duration-500 ease-out hover:ring-white/20">
            <Image
              src={image}
              alt={title}
              width={3001}
              height={2232}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="absolute -bottom-4 md:-bottom-6 left-4 md:left-8 hidden rounded-xl border border-white/20 bg-glass px-4 md:px-5 py-2 md:py-3 shadow-lg backdrop-blur-xl sm:block glass-card-hover">
            <p className="font-sans text-xs md:text-sm font-bold tracking-tight text-white">
              {title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
