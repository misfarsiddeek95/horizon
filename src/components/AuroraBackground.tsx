type AuroraBackgroundProps = {
  className?: string;
};

export default function AuroraBackground({ className = '' }: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-ink" />
      <div className="aurora-blob animate-fluid-1 absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-teal mix-blend-screen opacity-50 blur-[150px] will-change-transform" />
      <div className="aurora-blob animate-fluid-2 absolute -bottom-[10%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-lime mix-blend-screen opacity-45 blur-[180px] will-change-transform" />
      <div className="aurora-blob animate-fluid-3 absolute left-[25%] top-[25%] h-[50vw] w-[50vw] rounded-full bg-teal-2 mix-blend-screen opacity-55 blur-[200px] will-change-transform" />
      <div className="aurora-blob animate-fluid-4 absolute -bottom-[5%] -left-[5%] h-[50vw] w-[50vw] rounded-full bg-forest mix-blend-screen opacity-50 blur-[150px] will-change-transform max-sm:hidden" />
      <div className="aurora-noise absolute inset-0" />
    </div>
  );
}
