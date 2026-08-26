'use client';

import HaycarbChat from '@/components/HaycarbChat';

export default function ChatPage() {
  return (
    <main className="relative isolate flex h-dvh flex-col overflow-hidden bg-surface-default">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-orb-float absolute -left-24 -top-20 h-[420px] w-[420px] rounded-full bg-teal-2/30 blur-[110px]" />
        <div className="animate-orb-float absolute -right-24 top-1/4 h-[400px] w-[400px] rounded-full bg-chart-teal/25 blur-[120px]" style={{ animationDelay: '-6s' }} />
        <div className="animate-orb-float absolute -bottom-28 left-1/3 h-[480px] w-[480px] rounded-full bg-lime/25 blur-[130px]" style={{ animationDelay: '-12s' }} />
      </div>

      <HaycarbChat />
    </main>
  );
}
