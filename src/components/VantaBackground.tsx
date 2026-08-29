'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let vantaEffect: { destroy(): void } | undefined;
    let isUnmounted = false;
    const initVanta = async () => {
      if (typeof window !== 'undefined' && vantaRef.current) {
        window.THREE = THREE;
        try {
          const { default: NET } = await import('vanta/dist/vanta.net.min');
          if (isUnmounted || !vantaRef.current) return;
          vantaEffect = NET({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x147385,
            backgroundColor: 0x061923,
            points: 14.00,
            maxDistance: 24.00,
            spacing: 16.00,
            showDots: true,
          });
        } catch (error) {
          console.error('Vanta load failed:', error);
        }
      }
    };

    initVanta();
    return () => {
      isUnmounted = true;
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-50 h-screen w-screen bg-[#061923] pointer-events-none"
    />
  );
}
