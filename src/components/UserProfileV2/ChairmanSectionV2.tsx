import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChairmanSectionV2Props {
  title: string;
  text: string;
}

const HEADING_GRADIENT =
  "font-heading font-medium bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl";

export default function ChairmanSectionV2({ title, text }: ChairmanSectionV2Props) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label={title}
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-8">
        <div data-animate className="flex flex-col">
          <h2 className={`${HEADING_GRADIENT} text-3xl leading-tight md:text-4xl lg:text-5xl mb-6`}>
            {title}
          </h2>
          <p className="max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md">
            {text}
          </p>
        </div>

        <div className="relative min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] lg:-mt-16">
          <div className="absolute inset-0 flex items-end justify-center">
            <div
              data-animate
              className="relative z-10 mr-[-4%] w-[46%] max-w-[240px] md:max-w-[280px] lg:max-w-[320px] animate-portrait-float drop-shadow-2xl"
            >
              <Image
                src="/images/user-profile/person01.png"
                alt="Chairman"
                width={339}
                height={464}
                className="h-auto w-full object-contain object-bottom"
                priority
              />
            </div>
            <div
              data-animate
              className="relative z-20 ml-[-4%] w-[46%] max-w-[240px] md:max-w-[280px] lg:max-w-[320px] animate-portrait-float drop-shadow-2xl"
              style={{ animationDelay: "-3s" }}
            >
              <Image
                src="/images/user-profile/person02.png"
                alt="Managing Director"
                width={339}
                height={464}
                className="h-auto w-full object-contain object-bottom"
                priority
              />
            </div>

            <div className="absolute right-0 top-6 z-30 hidden rounded-2xl border border-white/20 bg-glass px-4 py-3 shadow-lg backdrop-blur-xl md:block glass-card-hover">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-main">
                Leadership
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                One vision, one horizon
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 border-t-2 border-dashed border-white/20"
          />
        </div>
      </div>
    </section>
  );
}
