"use client";

export default function AIGlowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-brand-main/20 via-surface-muted to-teal-2/20"
    >
      <div className="absolute -left-[12%] top-[8%] h-[42vw] w-[42vw] min-h-[320px] min-w-[320px] rounded-full bg-brand-main/8 blur-[100px] transform-gpu animate-ai-glow-one" />
      <div className="absolute -right-[14%] top-[20%] h-[38vw] w-[38vw] min-h-[280px] min-w-[280px] rounded-full bg-teal/6 blur-[100px] transform-gpu animate-ai-glow-two" />
      <div className="absolute bottom-[4%] left-[18%] h-[34vw] w-[34vw] min-h-[260px] min-w-[260px] rounded-full bg-teal-2/5 blur-[100px] transform-gpu animate-ai-glow-three" />
      <div className="absolute right-[12%] bottom-[8%] h-[28vw] w-[28vw] min-h-[220px] min-w-[220px] rounded-full bg-heading-end/30 blur-[100px] transform-gpu animate-ai-glow-four" />
    </div>
  );
}
