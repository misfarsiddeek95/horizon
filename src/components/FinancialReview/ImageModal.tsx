"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import VisualPlaceholder from "./VisualPlaceholder";
import type { ActiveImage } from "./data";

interface ImageModalProps {
  active: ActiveImage | null;
  onClose: () => void;
}

interface ZoomableImageProps {
  src: string;
  label: string;
  fit?: "cover";
}

interface Point {
  x: number;
  y: number;
}

interface ZoomView {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const BUTTON_STEP = 0.5;
const WHEEL_SENSITIVITY = 0.0025;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const distanceBetween = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const midpointBetween = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

function ZoomableImage({ src, label, fit }: ZoomableImageProps) {
  const [view, setView] = useState<ZoomView>({ scale: 1, x: 0, y: 0 });
  const [interacting, setInteracting] = useState(false);
  const viewRef = useRef<ZoomView>({ scale: 1, x: 0, y: 0 });
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef({
    startDistance: 0,
    startScale: 1,
    startOffset: { x: 0, y: 0 },
    startCenter: { x: 0, y: 0 },
    startPoint: { x: 0, y: 0 },
  });

  const commit = useCallback((next: ZoomView) => {
    viewRef.current = next;
    setView(next);
  }, []);

  const clampOffset = useCallback((scale: number, offset: Point): Point => {
    const surface = surfaceRef.current;
    if (!surface || scale <= 1) return { x: 0, y: 0 };
    const { width, height } = surface.getBoundingClientRect();
    const maxX = (width * (scale - 1)) / 2;
    const maxY = (height * (scale - 1)) / 2;
    return {
      x: clamp(offset.x, -maxX, maxX),
      y: clamp(offset.y, -maxY, maxY),
    };
  }, []);

  const zoomTo = useCallback(
    (nextScale: number) => {
      const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      const offset = clampOffset(scale, viewRef.current);
      commit({ scale, ...offset });
    },
    [clampOffset, commit]
  );

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomTo(viewRef.current.scale - event.deltaY * WHEEL_SENSITIVITY);
    };

    surface.addEventListener("wheel", handleWheel, { passive: false });
    return () => surface.removeEventListener("wheel", handleWheel);
  }, [zoomTo]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    setInteracting(true);

    const points = [...pointers.current.values()];
    if (points.length >= 2) {
      gesture.current.startDistance = distanceBetween(points[0], points[1]);
      gesture.current.startCenter = midpointBetween(points[0], points[1]);
      gesture.current.startScale = viewRef.current.scale;
      gesture.current.startOffset = { x: viewRef.current.x, y: viewRef.current.y };
      return;
    }

    gesture.current.startPoint = { x: event.clientX, y: event.clientY };
    gesture.current.startOffset = { x: viewRef.current.x, y: viewRef.current.y };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const points = [...pointers.current.values()];
    if (points.length >= 2) {
      const distance = distanceBetween(points[0], points[1]);
      const startDistance = gesture.current.startDistance || distance;
      const scale = clamp(
        gesture.current.startScale * (distance / startDistance),
        MIN_SCALE,
        MAX_SCALE
      );
      const center = midpointBetween(points[0], points[1]);
      const offset = clampOffset(scale, {
        x: gesture.current.startOffset.x + (center.x - gesture.current.startCenter.x),
        y: gesture.current.startOffset.y + (center.y - gesture.current.startCenter.y),
      });
      commit({ scale, ...offset });
      return;
    }

    if (viewRef.current.scale <= MIN_SCALE) return;
    const offset = clampOffset(viewRef.current.scale, {
      x: gesture.current.startOffset.x + (event.clientX - gesture.current.startPoint.x),
      y: gesture.current.startOffset.y + (event.clientY - gesture.current.startPoint.y),
    });
    commit({ scale: viewRef.current.scale, ...offset });
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);

    if (pointers.current.size === 0) {
      setInteracting(false);
      return;
    }

    const [remaining] = [...pointers.current.values()];
    gesture.current.startPoint = remaining;
    gesture.current.startOffset = { x: viewRef.current.x, y: viewRef.current.y };
    gesture.current.startScale = viewRef.current.scale;
  };

  const handleDoubleClick = () => {
    zoomTo(viewRef.current.scale > MIN_SCALE ? MIN_SCALE : 2);
  };

  const imageClassName =
    fit === "cover"
      ? "absolute inset-0 w-full h-full object-cover"
      : "absolute inset-0 w-full h-full object-contain bg-white p-4 md:p-6";

  const zoomed = view.scale > MIN_SCALE;
  const surfaceCursor = zoomed
    ? interacting
      ? "cursor-grabbing"
      : "cursor-grab"
    : "cursor-zoom-in";

  return (
    <div className="relative">
      <div
        ref={surfaceRef}
        role="img"
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onDoubleClick={handleDoubleClick}
        style={{ touchAction: "none" }}
        className={`relative min-h-[300px] select-none overflow-hidden rounded-[22px_22px_22px_7px] sm:min-h-[520px] ${surfaceCursor}`}
      >
        <div
          className="absolute inset-0 origin-center will-change-transform"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
            transition: interacting ? "none" : "transform 180ms ease-out",
          }}
        >
          <Image
            src={src}
            alt={label}
            fill
            sizes="1180px"
            draggable={false}
            className={`${imageClassName} border-none outline-none`}
          />
        </div>
      </div>
      <div className="absolute bottom-3 left-3 z-[3] flex items-center gap-0.5 rounded-full bg-v2-ink/90 p-1 text-white shadow-[0_8px_24px_rgba(0,0,0,.2)] sm:bottom-5 sm:left-5">
        <button
          type="button"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={() => zoomTo(view.scale - BUTTON_STEP)}
          disabled={view.scale <= MIN_SCALE}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-xl leading-none transition-colors duration-200 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Reset zoom"
          title="Reset zoom"
          onClick={() => zoomTo(MIN_SCALE)}
          className="min-w-[54px] cursor-pointer rounded-full px-1 text-[11px] font-bold tabular-nums transition-colors duration-200 hover:bg-white/15"
        >
          {Math.round(view.scale * 100)}%
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={() => zoomTo(view.scale + BUTTON_STEP)}
          disabled={view.scale >= MAX_SCALE}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-xl leading-none transition-colors duration-200 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function ImageModal({ active, onClose }: ImageModalProps) {
  useEffect(() => {
    if (!active) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, onClose]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Expanded image"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#071c28]/85 p-4 backdrop-blur-md sm:p-7"
    >
      <div className="relative max-h-[94vh] w-full max-w-[1180px] overflow-auto rounded-[22px] bg-white p-3 shadow-[0_24px_80px_rgba(0,0,0,.28)] sm:p-[18px]">
        <button
          type="button"
          autoFocus
          aria-label="Close image"
          onClick={onClose}
          className="absolute right-5 top-5 z-[3] grid h-[42px] w-[42px] place-items-center rounded-full bg-v2-ink/90 text-2xl leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,.2)] transition-colors duration-300 hover:bg-[#0f7c78] sm:h-[46px] sm:w-[46px] sm:text-[26px]"
        >
          ×
        </button>
        {active.src ? (
          <ZoomableImage
            key={active.src}
            src={active.src}
            label={active.label}
            fit={active.fit}
          />
        ) : (
          <VisualPlaceholder
            label={active.label}
            variant={active.variant}
            size="modal"
            dimensions={active.modalDimensions ?? active.dimensions}
          />
        )}
      </div>
    </div>
  );
}
