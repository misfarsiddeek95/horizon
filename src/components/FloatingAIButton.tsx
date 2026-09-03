"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function AnimatedAILogo({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, perspective: "800px" }}
    >
      <div className="animate-orb-pulse absolute -inset-1 rounded-full bg-brand-main/40 blur-xl" />

      <div className="animate-orb-spin absolute inset-0 rounded-full border-2 border-teal-2/90 border-t-transparent">
        <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-2 shadow-[0_0_10px_3px_rgba(91,178,200,0.85)]" />
      </div>

      <div className="animate-orb-rotate-x absolute inset-0.5 rounded-full border-2 border-white/60 border-b-transparent">
        <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.7)]" />
      </div>

      <div className="animate-orb-rotate-y absolute inset-1 rounded-full border-2 border-brand-main/80 border-t-transparent">
        <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-main shadow-[0_0_10px_3px_rgba(20,115,133,0.85)]" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_7px_rgba(140,224,240,0.8)]" />
    </div>
  );
}

export default function FloatingAIButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link
      href="/ai-assistant"
      className="group fixed bottom-6 right-6 z-[99] flex h-14 w-14 items-center justify-center rounded-full bg-[#020b10]/80 shadow-2xl backdrop-blur-md transition-transform hover:scale-110 cursor-pointer border border-white/20 max-md:bottom-4 max-md:right-4 max-md:h-12 max-md:w-12"
      aria-label="Open AI Assistant"
    >
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1.5 bg-slate-800 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-md pointer-events-none hidden md:block after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-1 after:border-4 after:border-transparent after:border-l-slate-800">
        AI Assistant
      </span>
      <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
        <AnimatedAILogo size={56} className="max-md:scale-[0.857]" />
      </span>
    </Link>
  );
}
