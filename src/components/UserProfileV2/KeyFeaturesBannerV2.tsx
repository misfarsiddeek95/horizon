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
  "font-['Minion_Pro'] font-medium bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl text-center text-3xl tracking-tight sm:text-4xl lg:text-left lg:text-5xl";

export default function KeyFeaturesBannerV2() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [heroFeature, ...restFeatures] = KEY_FEATURES;

  return (
    <section
      ref={ref}
      aria-label="Key Features Unveiled"
      className={`group relative w-full transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
        <div data-animate className="animate-user-profile-float flex items-center justify-center lg:justify-start">
          <Image
            src="/images/innerpage/kfu_book.svg"
            alt="Key Features report"
            width={619}
            height={477}
            className="w-full max-w-[200px] sm:max-w-xs drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)] lg:max-w-sm"
          />
        </div>

        <div className="flex flex-col">
          <h2 data-animate className={`${HEADING_GRADIENT} mb-8`}>
            Key Features Unveiled
          </h2>

          <div className="grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2">
            <div
              data-animate
              className="animate-user-profile-fade-up rounded-3xl border border-white/10 bg-slate-900/50 p-4 md:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-slate-800/60 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] sm:col-span-2"
            >
              <HeroFeature feature={heroFeature} />
            </div>

            {restFeatures.map((feature, index) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <div
                  key={feature.title}
                  data-animate
                  className="animate-user-profile-fade-up rounded-3xl border border-white/10 bg-slate-900/50 p-4 md:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-slate-800/60 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
                  style={{ animationDelay: `${150 + index * 120}ms` }}
                >
                  <span className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-brand-main/20 text-white ring-1 ring-white/20">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 md:mt-4 font-['Minion_Pro'] font-medium text-base md:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
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

function HeroFeature({ feature }: { feature: (typeof KEY_FEATURES)[number] }) {
  const Icon = FEATURE_ICONS[feature.icon];
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 md:gap-8">
      <span className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-main/20 text-white ring-1 ring-white/20">
        <Icon className="h-6 w-6 md:h-7 md:w-7" />
      </span>
      <div>
        <h3 className="font-['Minion_Pro'] font-medium text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 sm:text-xl md:text-2xl">
          {feature.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm md:text-base leading-relaxed text-slate-200 drop-shadow-md">
          {feature.detail}
        </p>
        {feature.subItems && feature.subItems.length > 0 && (
          <ul className="mt-4 md:mt-5 flex flex-wrap gap-2">
            {feature.subItems.map((subItem) => (
              <li
                key={subItem}
                className="rounded-full bg-white/10 px-2.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-medium text-slate-200 ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:ring-white/30"
              >
                {subItem}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
