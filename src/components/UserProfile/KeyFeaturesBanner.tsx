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

export default function KeyFeaturesBanner() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [heroFeature, ...restFeatures] = KEY_FEATURES;

  return (
    <section
      ref={ref}
      aria-label="Key Features Unveiled"
      className={`group relative -mx-4 px-4 py-20 transition-all duration-1000 ease-out will-change-opacity will-change-transform sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-brand-hover via-brand-main to-brand-main"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-main/30 blur-3xl transform-gpu backface-hidden translate-z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent-main/10 blur-3xl transform-gpu backface-hidden translate-z-0"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
        <div className="animate-user-profile-float flex items-center justify-center lg:justify-start">
          <Image
            src="/images/innerpage/kfu_book.svg"
            alt="Key Features report"
            width={619}
            height={477}
            className="w-full max-w-xs drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)] sm:max-w-sm"
          />
        </div>

        <div>
          <h2 className="mt-3 font-heading text-center text-4xl font-extrabold tracking-tighter text-white sm:text-5xl lg:text-left">
            Key Features Unveiled
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div
              className="animate-user-profile-fade-up rounded-3xl border border-white/25 bg-white/10 p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-2"
            >
              <HeroFeature feature={heroFeature} />
            </div>

            {restFeatures.map((feature, index) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <div
                  key={feature.title}
                  className="animate-user-profile-fade-up rounded-3xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${150 + index * 120}ms` }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/25 text-white ring-1 ring-white/50">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-sans text-lg font-bold tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {feature.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-4 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-accent-main/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:scale-x-100 group-hover:opacity-100"
      />
    </section>
  );
}

function HeroFeature({ feature }: { feature: (typeof KEY_FEATURES)[number] }) {
  const Icon = FEATURE_ICONS[feature.icon];
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-white ring-1 ring-white/50">
        <Icon className="h-7 w-7" />
      </span>
      <div>
        <h3 className="font-sans text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          {feature.title}
        </h3>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/80">
          {feature.detail}
        </p>
        {feature.subItems && feature.subItems.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {feature.subItems.map((subItem) => (
              <li
                key={subItem}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-white/20"
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
