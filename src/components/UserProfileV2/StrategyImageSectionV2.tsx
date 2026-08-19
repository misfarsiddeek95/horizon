import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface StrategyImageSectionV2Props {
  title: string;
  image: string;
  caption: string;
  isGeneralUser?: boolean;
}

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl text-2xl tracking-tight md:text-3xl lg:text-4xl";

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

        <div className="relative -mx-6 -mb-6 md:-mx-8 md:-mb-8 lg:-mx-10 lg:-mb-10" data-animate>
          <div className="relative overflow-hidden rounded-b-[24px] ring-1 ring-white/10 transition-all duration-500 ease-out hover:ring-white/20">
            <Image
              src={image}
              alt={title}
              width={1448}
              height={1086}
              sizes="(min-width: 1024px) 100vw, 100vw"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
