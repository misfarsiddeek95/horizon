"use client";

import type { ActiveImage, VisualSize, VisualVariant } from "./data";

const variantBackgrounds: Record<VisualVariant, string> = {
  default: "linear-gradient(145deg,#dfece7 0%,#c8ddd6 48%,#a8c9be 100%)",
  "alt-blue": "linear-gradient(145deg,#dfecef 0%,#c9dde2 48%,#a9c8ce 100%)",
  "alt-sage": "linear-gradient(145deg,#e7eedf 0%,#d2dfc7 48%,#b6ccb0 100%)",
  "alt-neutral": "linear-gradient(145deg,#ebeae5 0%,#d9dad2 48%,#bcc1b9 100%)",
};

const sizeClasses: Record<VisualSize, string> = {
  standard: "min-h-[300px] sm:min-h-[430px]",
  split: "min-h-[280px] sm:min-h-[410px]",
  data: "min-h-[280px] sm:min-h-[360px]",
  modal: "min-h-[300px] sm:min-h-[520px]",
};

interface VisualPlaceholderProps {
  label: string;
  variant?: VisualVariant;
  size?: VisualSize;
  dimensions?: string;
  modalDimensions?: string;
  onSelect?: (visual: ActiveImage) => void;
}

export default function VisualPlaceholder({
  label,
  variant = "default",
  size = "standard",
  dimensions,
  modalDimensions,
  onSelect,
}: VisualPlaceholderProps) {
  const isInteractive = Boolean(onSelect);

  const handleSelect = () =>
    onSelect?.({ label, variant, dimensions: dimensions ?? "", modalDimensions });

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? `Open ${label} in larger view` : undefined}
      onClick={isInteractive ? handleSelect : undefined}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect();
              }
            }
          : undefined
      }
      style={{ background: variantBackgrounds[variant] }}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-[22px_22px_22px_7px] p-6 text-center sm:p-8 ${sizeClasses[size]} ${
        isInteractive ? "cursor-zoom-in" : "cursor-default"
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 28%,rgba(255,255,255,.5),transparent 26%), linear-gradient(165deg,transparent 45%,rgba(14,107,102,.18) 100%)",
        }}
      />
      <span className="relative z-[1] font-sans text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#416c68]">
        {dimensions ? `${label} - ${dimensions}` : label}
      </span>
      <span className="absolute bottom-[18px] left-5 font-sans text-[8px] font-extrabold uppercase tracking-[0.13em] text-[#416c68] opacity-70">
        Image Placeholder
      </span>
    </div>
  );
}
