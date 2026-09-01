'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import HaycarbChat from '@/components/HaycarbChat';

const AuroraBackground = dynamic(() => import('@/components/AuroraBackground'), {
  ssr: false,
});

const PAGE_COLOR = '#081F2B';

export default function ChatPage() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevRootBg = root.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    root.style.backgroundColor = PAGE_COLOR;
    body.style.backgroundColor = PAGE_COLOR;
    return () => {
      root.style.backgroundColor = prevRootBg;
      body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  return (
    <main
      className="relative isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-[#081F2B] text-white"
    >
      <AuroraBackground />

      <HaycarbChat />
    </main>
  );
}
