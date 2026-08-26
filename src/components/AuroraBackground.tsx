type AuroraBackgroundProps = {
  className?: string;
};

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function AuroraBackground({ className = '' }: AuroraBackgroundProps) {
  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-[#081F2B]" />
        <div className="animate-fluid-1 absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-brand-main/80 mix-blend-screen blur-[150px] will-change-transform" />
        <div className="animate-fluid-2 absolute -right-[10%] top-[5%] h-[50vw] w-[50vw] rounded-full bg-brand-main/50 mix-blend-screen blur-[200px] will-change-transform" />
        <div className="animate-fluid-3 absolute -bottom-[10%] -left-[5%] h-[50vw] w-[50vw] rounded-full bg-brand-main/30 mix-blend-screen blur-[180px] will-change-transform" />
        <div className="animate-fluid-4 absolute -bottom-[5%] -right-[5%] h-[50vw] w-[50vw] rounded-full bg-[color-mix(in_srgb,var(--color-brand-main)_25%,black)] mix-blend-screen blur-[200px] will-change-transform" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: NOISE_SVG,
          opacity: 0.05,
          mixBlendMode: 'overlay'
        }}
      />
    </>
  );
}
