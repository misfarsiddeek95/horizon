'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HaycarbChat from '@/components/HaycarbChat';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import {
  GlobeAltIcon,
  UserIcon,
  RectangleStackIcon,
  ChartBarIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AuroraBackground = dynamic(() => import('@/components/AuroraBackground'), {
  ssr: false,
});

const PAGE_COLOR = '#081F2B';

const aiFeatures = [
  {
    icon: GlobeAltIcon,
    title: 'Multilingual AI Engagement',
    desc: 'Ask questions and receive responses in your preferred language',
  },
  {
    icon: UserIcon,
    title: 'Stakeholder Tailored Intelligence',
    desc: 'Receive insights aligned to your stakeholder profile',
  },
  {
    icon: RectangleStackIcon,
    title: 'Depth on Demand',
    desc: 'Choose between concise summaries and more detailed responses',
  },
  {
    icon: ChartBarIcon,
    title: 'Visual Intelligence, On Demand',
    desc: 'Transform information into charts, graphs for easier interpretation',
  },
  {
    icon: DocumentTextIcon,
    title: 'Boardroom Ready PDF Outputs',
    desc: 'Download responses and visuals as polished PDFs',
  },
];

export default function ChatPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioReadyRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenAIPopup');
    if (!hasSeenModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowModal(true);
      sessionStorage.setItem('hasSeenAIPopup', 'true');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevRootBg = root.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    body.dataset.aiChat = "true";
    root.style.backgroundColor = PAGE_COLOR;
    body.style.backgroundColor = PAGE_COLOR;
    return () => {
      delete body.dataset.aiChat;
      root.style.backgroundColor = prevRootBg;
      body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  useEffect(() => {
    const audio = new Audio('/sounds/ai.mp3');
    audio.volume = 0.2;
    audio.loop = true;
    audioRef.current = audio;

    audio.play().then(() => { audioReadyRef.current = true; }).catch(() => {});

    const handleInteraction = () => {
      if (!audioReadyRef.current && audio.paused) {
        audio.play().then(() => { audioReadyRef.current = true; }).catch(() => {});
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
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#020b10]/80 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-[#020b10]/95 max-md:top-4 max-md:right-4 max-md:bottom-auto max-md:h-10 max-md:w-10"
        aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="h-5 w-5" />
        ) : (
          <SpeakerWaveIcon className="h-5 w-5" />
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#020b10]/80 border border-white/20 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              className="absolute top-4 right-4 cursor-pointer text-white/50 transition-colors hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="mb-6 text-2xl sm:text-3xl text-white font-heading text-center">
              Unlock AI Capabilities
            </h2>

            <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto sm:gap-5">
              {aiFeatures.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-main sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg text-white font-heading font-semibold tracking-wide">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
