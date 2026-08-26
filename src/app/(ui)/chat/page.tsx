'use client';

import HaycarbChat from '@/components/HaycarbChat';

export default function ChatPage() {
  return (
    <main
      className="fixed inset-0 isolate flex h-[100dvh] w-full flex-col overflow-hidden text-white"
      style={{ background: 'radial-gradient(120% 120% at 50% 0%, #0a1c24 0%, #051317 50%, #02080c 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-fluid-1 absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-[#0e7490] opacity-40 blur-[180px]" />
        <div className="animate-fluid-2 absolute -right-[10%] top-[10%] h-[50vw] w-[50vw] rounded-full bg-[#0f766e] opacity-40 blur-[200px]" />
        <div className="animate-fluid-3 absolute -bottom-[10%] left-[15%] h-[50vw] w-[50vw] rounded-full bg-[#4d7c0f] opacity-35 blur-[180px]" />
        <div className="animate-fluid-4 absolute left-[30%] top-[30%] h-[50vw] w-[50vw] rounded-full bg-[#115e59] opacity-40 blur-[200px]" />
        <div className="absolute inset-0 bg-black/25" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            opacity: 0.04,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      <HaycarbChat />
    </main>
  );
}
