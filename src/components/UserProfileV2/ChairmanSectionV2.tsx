import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChairmanSectionV2Props {
  title: string;
  text: string;
}

const HEADING_GRADIENT =
  "font-heading font-medium bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl";

const CARD_BASE =
  "rounded-2xl bg-glass-faint border border-border-subtle p-6 md:p-8 lg:p-10 backdrop-blur-xl transition-all duration-500 ease-out hover:bg-glass-card-hover hover:border-border-card-hover hover:shadow-metric-hover";

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
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div data-animate className={`${CARD_BASE} relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex items-end justify-center overflow-hidden`}>
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <div
              className="relative z-10 mr-[-4%] w-[46%] max-w-[200px] md:max-w-[240px] lg:max-w-[280px] animate-portrait-float drop-shadow-2xl"
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
              className="relative z-20 ml-[-4%] w-[46%] max-w-[200px] md:max-w-[240px] lg:max-w-[280px] animate-portrait-float drop-shadow-2xl"
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
          </div>

          <div className="absolute right-0 top-0 z-30 rounded-bl-xl rounded-tr-2xl bg-glass-faint border border-border-subtle px-4 py-3 shadow-glass-card backdrop-blur-xl transition-all duration-500 ease-out hover:bg-glass-card-hover hover:border-border-card-hover hover:shadow-metric-hover">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-main">
              Leadership
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              One vision, one horizon
            </p>
          </div>
        </div>

        <div data-animate className={`${CARD_BASE} flex flex-col justify-center`}>
          <h2 className={`${HEADING_GRADIENT} text-3xl leading-tight md:text-4xl lg:text-5xl mb-6`}>
            {title}
          </h2>
          <p className="max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
