import Image from "next/image";
import {
  ChartBarIcon,
  CommandLineIcon,
  GlobeAsiaAustraliaIcon,
  LanguageIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { KEY_FEATURES } from "@/data/userProfiles";

const FEATURE_ICONS = {
  ai: CommandLineIcon,
  sustainability: GlobeAsiaAustraliaIcon,
  financial: ChartBarIcon,
  governance: ShieldCheckIcon,
  accessibility: LanguageIcon,
} as const;

export default function KeyFeaturesBanner() {
  return (
    <section
      aria-label="Key Features Unveiled"
      className="relative -mx-4 overflow-hidden px-4 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-brand-hover via-brand-main to-brand-main"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-main/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent-main/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="animate-user-profile-float flex justify-center lg:justify-start">
          <Image
            src="/images/innerpage/kfu_book.svg"
            alt="Key Features report"
            width={619}
            height={477}
            className="w-full max-w-md drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)] lg:max-w-lg"
          />
        </div>

        <div>
          <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-accent-main lg:text-left">
            This Year in Focus
          </p>
          <h2 className="mt-2 text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-left">
            Key Features Unveiled
          </h2>
          <ul className="mt-10 space-y-6">
            {KEY_FEATURES.map((feature, index) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <li
                  key={feature.title}
                  className="flex items-start gap-4 animate-user-profile-fade-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/25">
                    <Icon className="h-5 w-5 text-accent-main" />
                  </span>
                  <span>
                    <span className="block font-sans text-lg font-bold tracking-tight text-white">
                      {feature.title}
                    </span>
                    <span className="block text-sm leading-relaxed text-white/75">
                      {feature.detail}
                    </span>
                    {feature.subItems && feature.subItems.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
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
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
