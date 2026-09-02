"use client";

export default function SmokyBackground() {
  return (
    <div
      aria-hidden="true"
      suppressHydrationWarning
      className="fixed inset-0 -z-50 w-full h-full pointer-events-none bg-slate-50 overflow-hidden"
    >
      <div suppressHydrationWarning className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-[#a6eeff] opacity-60 mix-blend-multiply filter blur-[100px] md:blur-[140px] animate-blob-drift-1" />
      <div suppressHydrationWarning className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] rounded-full bg-[#ffe9b1] opacity-60 mix-blend-multiply filter blur-[100px] md:blur-[140px] animate-blob-drift-2" />
      <div suppressHydrationWarning className="absolute top-[30%] left-[25%] w-[40vw] h-[40vh] rounded-full bg-[#d4f5ff] opacity-40 mix-blend-multiply filter blur-[80px] md:blur-[120px] animate-blob-drift-3" />
    </div>
  );
}
