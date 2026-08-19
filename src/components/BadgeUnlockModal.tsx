"use client";

import { useEffect, useRef, useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import type { BadgeDefinition } from "@/types";
import { playBadgeUnlockSound } from "@/utils/sound";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = ["#147385", "#fbbf24", "#f59e0b", "#ffffff", "#34d399", "#38bdf8"];

function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvas = canvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 9;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: 90 + Math.random() * 60,
      };
    });

    let raf = 0;
    function tick() {
      context.clearRect(0, 0, width, height);
      let alive = false;
      for (const p of particles) {
        p.life += 1;
        if (p.life > p.maxLife) continue;
        alive = true;
        p.vy += 0.12;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        context.save();
        context.translate(p.x, p.y);
        context.rotate(p.rotation);
        context.globalAlpha = alpha;
        context.fillStyle = p.color;
        context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        context.restore();
      }
      if (alive) {
        raf = requestAnimationFrame(tick);
      } else {
        canvas.style.display = "none";
      }
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
}

export default function BadgeUnlockModal({
  badge,
  onClose,
}: {
  badge: BadgeDefinition;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    playBadgeUnlockSound();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Badge unlocked: ${badge.title}`}
    >
      <ConfettiBurst />
      <div
        className={`relative m-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-ui-card bg-surface-default p-8 text-center shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          mounted ? "scale-100" : "scale-0"
        }`}
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-yellow-400/40 blur-xl animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-2xl animate-ping" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl">
            <CheckBadgeIcon className="h-12 w-12 text-white" />
          </div>
        </div>

        <p className="font-sans text-xs font-bold uppercase tracking-widest text-amber-500">
          Badge Unlocked
        </p>
        <h2 className="font-heading text-2xl font-bold text-content-primary">
          {badge.title}
        </h2>
        <p className="text-sm leading-relaxed text-content-primary/70">
          {badge.description}
        </p>

        <button
          onClick={onClose}
          className="mt-2 w-full cursor-pointer rounded-ui-element bg-brand-main px-4 py-2.5 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
