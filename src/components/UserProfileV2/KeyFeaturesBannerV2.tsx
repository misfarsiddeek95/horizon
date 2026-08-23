import Image from "next/image";
import {
  ChartBarIcon,
  CommandLineIcon,
  GlobeAsiaAustraliaIcon,
  LanguageIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { KEY_FEATURES } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FEATURE_ICONS = {
  ai: CommandLineIcon,
  sustainability: GlobeAsiaAustraliaIcon,
  financial: ChartBarIcon,
  governance: ShieldCheckIcon,
  accessibility: LanguageIcon,
} as const;

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl text-center text-3xl tracking-tight sm:text-4xl lg:text-5xl";

export default function KeyFeaturesBannerV2() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const features = KEY_FEATURES.filter((f) => f.icon !== "ai");

  return (
    <section
      ref={ref}
      aria-label="This year in focus: Key Features"
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl flex flex-col items-center">
        <h2 data-animate className={`${HEADING_GRADIENT} mb-4`}>
          This year in focus: Key Features
        </h2>
        <p
          data-animate
          className="max-w-2xl text-center text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md mb-12"
        >
          Donec hendrerit arcu vitae auctor imperdiet. Phasellus consequat
          lectus vitae sapien posuere posuere. Donec sollicitudin ipsum vel
          congue cursus. Praesent molestie tempor nunc at vestibulum.
        </p>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-8">
            {features.map((feature, index) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <div
                  key={feature.title}
                  data-animate
                  className="flex flex-row items-start gap-5"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-brand-main/20 text-white ring-1 ring-white/20">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div className="flex flex-col">
                    <h3 className="font-heading font-medium text-lg tracking-tight heading-gradient md:text-xl">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            data-animate
            className="relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]"
          >
            <Image
              src="/images/innerpage/book.jpeg"
              alt="Key Features report"
              fill
              className="object-cover object-center rounded-3xl w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
