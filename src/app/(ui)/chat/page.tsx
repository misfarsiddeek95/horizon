'use client';

import AuroraBackground from '@/components/AuroraBackground';
import HaycarbChat from '@/components/HaycarbChat';

export default function ChatPage() {
  return (
    <main
      className="fixed inset-0 isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-[#081F2B] text-white"
    >
      <AuroraBackground />

      <HaycarbChat />
    </main>
  );
}
