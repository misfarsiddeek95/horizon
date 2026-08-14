import Image from "next/image";

interface StrategyImageSectionProps {
  title: string;
  image: string;
  caption: string;
  isGeneralUser?: boolean;
}

export default function StrategyImageSection({
  title,
  image,
  caption,
  isGeneralUser = false,
}: StrategyImageSectionProps) {
  return (
    <section
      aria-label={title}
      className="group relative w-full bg-surface-muted"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl animate-user-profile-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-main">
            In Focus
          </p>
          <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{caption}</p>
        </div>

        <div
          className="mt-10 animate-user-profile-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className={`relative mx-auto ${isGeneralUser ? "max-w-4xl" : "max-w-5xl"}`}>
            <div
              aria-hidden="true"
              className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[24px] bg-gradient-to-br from-brand-main/25 via-accent-main/20 to-transparent"
            />
            <div className="relative overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(20,115,133,0.2)] ring-1 ring-slate-900/5">
              <Image
                src={image}
                alt={title}
                width={3001}
                height={2232}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="mx-auto block h-auto w-full object-contain"
              />
            </div>
            <div className="absolute -bottom-6 left-8 hidden rounded-xl border border-slate-100 bg-white px-5 py-3 shadow-lg sm:block">
              <p className="font-sans text-sm font-bold tracking-tight text-brand-main">
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-4 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-brand-main/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:scale-x-100 group-hover:opacity-100"
      />
    </section>
  );
}
