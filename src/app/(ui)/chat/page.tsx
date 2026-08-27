'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import HALO from 'vanta/dist/vanta.halo.min';
import HaycarbChat from '@/components/HaycarbChat';

export default function ChatPage() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof HALO> | null>(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    const effect = HALO({
      THREE,
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      baseColor: 0x0d9488,
      backgroundColor: 0x020b10,
      size: 1.5,
      amplitudeFactor: 0.5,
    });

    setVantaEffect(effect);

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      <div className="relative z-10 h-full w-full">
        <HaycarbChat />
      </div>
    </div>
  );
}
