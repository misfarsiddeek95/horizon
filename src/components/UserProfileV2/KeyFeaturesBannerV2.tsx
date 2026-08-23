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
  "font-heading font-medium heading-gradient drop-shadow-2xl text-center text-3xl tracking-tight sm:text-4xl lg:text-left lg:text-5xl";

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
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[1fr_1.5fr] lg:gap-7">
        <div
          data-animate
          className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-0 -mt-6 -mx-6 md:-mt-8 md:-mx-8 lg:-mt-10 lg:-mb-10 lg:-ml-10 lg:mr-0 lg:h-[calc(100%+5rem)]"
        >
          <Image
            src="/images/innerpage/book.jpeg"
            alt="Key Features report"
            fill
            className="object-cover object-center rounded-t-3xl lg:rounded-t-none lg:rounded-l-3xl w-full h-full"
            priority
          />
        </div>

        <div className="flex flex-col">
          <h2 data-animate className={`${HEADING_GRADIENT} mb-8`}>
            This year in focus: Key Features
          </h2>

          <div className="grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <div
                  key={feature.title}
                  data-animate
                  className="animate-user-profile-fade-up rounded-3xl bg-glass p-4 md:p-6 glass-card-hover"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-brand-main/20 text-white ring-1 ring-white/20">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 md:mt-4 font-heading font-medium text-base md:text-lg tracking-tight heading-gradient">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm leading-relaxed text-slate-300">
                    {feature.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
