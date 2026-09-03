"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AuroraBackground = dynamic(() => import("@/components/AuroraBackground"), {
  ssr: false,
});

const FRAME_COUNT = 240;

export default function UserProfileBackgroundScrubber() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [ready, setReady] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT));

  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const contentHeightRef = { current: 0 };
    const measureContent = () => {
      const el = document.querySelector(".original-content-block");
      if (el) {
        contentHeightRef.current = el.getBoundingClientRect().height;
      }
    };
    measureContent();
    window.addEventListener("resize", measureContent);

    const images = imagesRef.current;
    if (!images[0] || !images[0].complete) return;

    let animationFrameId: number;
    let lastScrollY = -1;

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const currentScrollY = window.scrollY;
      if (currentScrollY === lastScrollY) return;
      lastScrollY = currentScrollY;

      const contentHeight = contentHeightRef.current;
      const scrollProgress =
        contentHeight > 0 ? currentScrollY / contentHeight : 0;

      const t = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollProgress * FRAME_COUNT)
      );

      const img = images[t];
      if (!img || !img.complete) return;

      const baseImg = images[0];
      if (!baseImg || !baseImg.complete) return;

      const hRatio = canvas.width / baseImg.width;
      const vRatio = canvas.height / baseImg.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (canvas.width - baseImg.width * ratio) / 2;
      const centerShiftY = (canvas.height - baseImg.height * ratio) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1.0;
      context.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
      );
    };

    lastScrollY = -1;
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", measureContent);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const img = imagesRef.current[0];
    if (!img || !img.complete) return;

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (canvas.width - img.width * ratio) / 2;
    const centerShiftY = (canvas.height - img.height * ratio) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1.0;
    context.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
    );
  }, [ready]);

  useEffect(() => {
    const BATCH_SIZE = 20;
    let cancelled = false;

    const loadImage = (src: string, retries = 1): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) setLoadedFrames((prev) => prev + 1);
          resolve(img);
        };
        img.onerror = () => {
          if (retries > 0) {
            loadImage(src, 0).then(resolve);
          } else {
            console.error(`Failed to load frame: ${src}`);
            if (!cancelled) setLoadedFrames((prev) => prev + 1);
            resolve(null);
          }
        };
        img.src = src;
      });
    };

    const loadBatch = async (start: number) => {
      const end = Math.min(start + BATCH_SIZE, FRAME_COUNT);
      const batch: Promise<HTMLImageElement | null>[] = [];
      for (let i = start; i < end; i++) {
        const src = `/user_profile_frames_v1/frame_${(i + 1).toString().padStart(4, "0")}.webp`;
        batch.push(loadImage(src));
      }
      const results = await Promise.all(batch);
      for (let i = 0; i < results.length; i++) {
        imagesRef.current[start + i] = results[i] as HTMLImageElement;
      }
      if (!cancelled && start === 0) setReady(true);
    };

    const loadAll = async () => {
      for (let start = 0; start < FRAME_COUNT; start += BATCH_SIZE) {
        if (cancelled) return;
        await loadBatch(start);
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    const progress = Math.min(100, Math.round((loadedFrames / FRAME_COUNT) * 100));
    return (
      <div className="fixed inset-0 w-screen h-screen z-[9999] isolate overflow-hidden text-white">
        <AuroraBackground />
        <div className="absolute inset-0 z-10 bg-slate-900/40 backdrop-blur-sm" />
        <div className="relative z-20 flex h-full flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg
              className="h-20 w-20 animate-spin"
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="4"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="var(--color-brand-main)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="90, 150"
                strokeDashoffset="0"
              />
            </svg>
            <span className="absolute text-lg font-semibold tracking-widest text-white tabular-nums">
              {progress}
              <span className="text-sm">%</span>
            </span>
          </div>
          <p className="mt-6 text-sm font-light tracking-[0.25em] uppercase text-white/50">
            Loading experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 bg-black pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5))",
        }}
      />
    </div>
  );
}
