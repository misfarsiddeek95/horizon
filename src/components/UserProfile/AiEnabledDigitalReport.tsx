
import { KEY_FEATURES } from "@/data/userProfiles";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl text-center text-3xl tracking-tight sm:text-4xl lg:text-5xl";

const aiFeature = KEY_FEATURES.find((f) => f.icon === "ai");

const iconMap: Record<string, string> = {
  "Conversational Report Intelligence": "/icons/user-profile/The Next Horizon of Intelligent Reporting/Web Icons-01.svg",
  "Adaptive Stakeholder Experiences": "/icons/user-profile/The Next Horizon of Intelligent Reporting/Web Icons-02.svg",
  "Predictive Intelligence Analytics": "/icons/user-profile/The Next Horizon of Intelligent Reporting/Web Icons-03.svg",
  "Multilingual & Accessible Intelligence": "/icons/user-profile/The Next Horizon of Intelligent Reporting/Web Icons-04.svg",
  "AI-Powered Insight Visualisation & Report Generation": "/icons/user-profile/The Next Horizon of Intelligent Reporting/Web Icons-05.svg",
  "Interactive Impact Intelligence": "/icons/user-profile/The Next Horizon of Intelligent Reporting/Web Icons-07.svg",
  "Gamified Report Exploration": "/icons/user-profile/The Next Horizon of Intelligent Reporting/Web Icons-08.svg",
};

interface AiEnabledDigitalReportProps {
  aiReportText?: string;
}

export default function AiEnabledDigitalReport({
  aiReportText,
}: AiEnabledDigitalReportProps) {
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
          {aiReportText}
        </p>
        {aiFeature.subItems && aiFeature.subItems.length > 0 && (
          <div data-animate className="flex flex-wrap justify-center gap-4">
            {aiFeature.subItems.map((subItem) => (
              <span
                key={subItem}
                className="flex items-center gap-2 rounded-full px-5 py-2 md:px-6 md:py-2.5 text-lg md:text-xl font-medium text-slate-200 ring-1 ring-white/20 transition-all duration-300 hover:ring-white/30"
                style={{
                  background:
                    "linear-gradient(to right, rgba(252, 232, 178, 0.3), rgba(131, 222, 237, 0.3))",
                }}
              >
                <img
                  src={iconMap[subItem]}
                  alt={subItem}
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
                {subItem}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
