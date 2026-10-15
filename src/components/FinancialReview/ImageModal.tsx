"use client";

import { useEffect } from "react";
import Image from "next/image";
import VisualPlaceholder from "./VisualPlaceholder";
import type { ActiveImage } from "./data";

interface ImageModalProps {
  active: ActiveImage | null;
  onClose: () => void;
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

  const imageClassName =
    active.fit === "cover"
      ? "absolute inset-0 w-full h-full object-cover"
      : "absolute inset-0 w-full h-full object-contain bg-white p-4 md:p-6";

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
          <div className="relative min-h-[300px] sm:min-h-[520px] overflow-hidden rounded-[22px_22px_22px_7px]">
            <Image
              src={active.src}
              alt={active.label}
              fill
              sizes="1180px"
              className={`${imageClassName} border-none outline-none`}
            />
          </div>
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
