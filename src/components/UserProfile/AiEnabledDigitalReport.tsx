import { CommandLineIcon } from "@heroicons/react/24/outline";
import { KEY_FEATURES } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl text-center text-3xl tracking-tight sm:text-4xl lg:text-5xl";

const aiFeature = KEY_FEATURES.find((f) => f.icon === "ai");

export default function AiEnabledDigitalReport() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  if (!aiFeature) return null;

  return (
    <section
      ref={ref}
      id="ai-enabled-report"
      aria-label="AI-Enabled Digital Report"
      className={`group relative w-full pb-16 lg:pb-24 transition-all duration-1000 ease-out will-change-opacity will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
        <h2 data-animate className={`${HEADING_GRADIENT} mb-4`}>
          {aiFeature.title}
        </h2>
        <p
          data-animate
          className="max-w-2xl text-sm md:text-base lg:text-lg leading-relaxed text-slate-200 drop-shadow-md mb-8"
        >
          Donec hendrerit arcu vitae auctor imperdiet. Phasellus consequat
          lectus vitae sapien posuere posuere. Donec sollicitudin ipsum vel
          congue cursus. Praesent molestie tempor nunc at vestibulum.
        </p>
        {aiFeature.subItems && aiFeature.subItems.length > 0 && (
          <div data-animate className="flex flex-wrap justify-center gap-4">
            {aiFeature.subItems.map((subItem) => (
              <span
                key={subItem}
                className="rounded-full px-5 py-2 md:px-6 md:py-2.5 text-lg md:text-xl font-medium text-slate-200 ring-1 ring-white/20 transition-all duration-300 hover:ring-white/30"
                style={{
                  background:
                    "linear-gradient(to right, rgba(252, 232, 178, 0.3), rgba(131, 222, 237, 0.3))",
                }}
              >
                {subItem}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
