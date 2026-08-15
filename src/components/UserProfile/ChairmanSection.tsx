import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChairmanSectionProps {
  title: string;
  text: string;
}

export default function ChairmanSection({ title, text }: ChairmanSectionProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label={title}
      className={`group relative -mx-4 rounded-2xl p-4 transition-all duration-1000 ease-out will-change-opacity will-change-transform hover:bg-brand-main/[0.02] ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-orange-400 opacity-30 blur-[120px] transform-gpu backface-hidden translate-z-0"
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="animate-user-profile-fade-up">
          <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight tracking-tighter text-section-title md:text-5xl">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 md:text-lg">
            {text}
          </p>
        </div>

        <div
          className="relative min-h-[400px] animate-user-profile-fade-up sm:min-h-[440px] lg:-mt-16 lg:min-h-[480px]"
          style={{ animationDelay: "150ms" }}
        >
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative z-10 mr-[-4%] w-[46%] max-w-[320px] animate-portrait-float drop-shadow-xl">
              <Image
                src="/images/user-profile/person01.png"
                alt="Chairman"
                width={339}
                height={464}
                className="h-auto w-full object-contain object-bottom"
              />
            </div>
            <div
              className="relative z-20 ml-[-4%] w-[46%] max-w-[320px] animate-portrait-float drop-shadow-xl"
              style={{ animationDelay: "-3s" }}
            >
              <Image
                src="/images/user-profile/person02.png"
                alt="Managing Director"
                width={339}
                height={464}
                className="h-auto w-full object-contain object-bottom"
              />
            </div>

            <div className="absolute right-0 top-6 z-30 hidden rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-md md:block">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-main">
                Leadership
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                One vision, one horizon
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 border-t-2 border-dashed border-brand-main/50"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-4 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-brand-main/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:scale-x-100 group-hover:opacity-100"
      />
    </section>
  );
}
