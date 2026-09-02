'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HaycarbChat from '@/components/HaycarbChat';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

const AuroraBackground = dynamic(() => import('@/components/AuroraBackground'), {
  ssr: false,
});

const PAGE_COLOR = '#081F2B';

export default function ChatPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

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

  useEffect(() => {
    const audio = new Audio('/sounds/ai.mp3');
    audio.volume = 0.2;
    audio.loop = true;
    audioRef.current = audio;

    audio.play().then(() => setAudioReady(true)).catch(() => {});

    const handleInteraction = () => {
      if (!audioReady && audio.paused) {
        audio.play().then(() => setAudioReady(true)).catch(() => {});
      }
    };
    document.addEventListener('click', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  return (
    <main
      className="relative isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-[#081F2B] text-white"
    >
      <AuroraBackground />

      <HaycarbChat />

      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#020b10]/80 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-[#020b10]/95 max-md:bottom-4 max-md:right-4 max-md:h-10 max-md:w-10"
        aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="h-5 w-5" />
        ) : (
          <SpeakerWaveIcon className="h-5 w-5" />
        )}
      </button>
    </main>
  );
}
