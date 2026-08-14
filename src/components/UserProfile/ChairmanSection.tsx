import Image from "next/image";

interface ChairmanSectionProps {
  title: string;
  text: string;
}

export default function ChairmanSection({ title, text }: ChairmanSectionProps) {
  return (
    <section aria-label={title} className="relative w-full overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="animate-user-profile-fade-up">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-main">
            Chairman&rsquo;s &amp; Managing Director&rsquo;s Message
          </p>
          <h2 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight text-slate-800 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            {text}
          </p>
        </div>

        <div
          className="relative min-h-[400px] animate-user-profile-fade-up sm:min-h-[440px] lg:min-h-[480px]"
          style={{ animationDelay: "150ms" }}
        >
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative z-10 mr-[-4%] w-[46%] max-w-[320px] drop-shadow-xl">
              <Image
                src="/images/user-profile/person01.png"
                alt="Chairman"
                width={339}
                height={464}
                className="h-auto w-full object-contain object-bottom"
              />
            </div>
            <div className="relative z-20 ml-[-4%] w-[46%] max-w-[320px] drop-shadow-xl">
              <Image
                src="/images/user-profile/person02.png"
                alt="Managing Director"
                width={339}
                height={464}
                className="h-auto w-full object-contain object-bottom"
              />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 border-t-2 border-dashed border-brand-main/50"
          />
        </div>
      </div>
    </section>
  );
}
