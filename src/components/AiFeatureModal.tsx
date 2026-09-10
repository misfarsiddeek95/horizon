'use client';

import { useEffect, useState } from 'react';
import {
  GlobeAltIcon,
  UserIcon,
  RectangleStackIcon,
  ChartBarIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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

export default function AiFeatureModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const hasSeenModal = sessionStorage.getItem('hasSeenAIPopup');
    if (!hasSeenModal) {
      setShowModal(true);
      sessionStorage.setItem('hasSeenAIPopup', 'true');
    }
  }, []);

  if (!isMounted) return null;
  if (!showModal) return null;

  return (
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
  );
}
