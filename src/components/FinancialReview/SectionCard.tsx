"use client";

import VisualPlaceholder from "./VisualPlaceholder";
import type { ActiveImage, ActionLink } from "./data";

interface SectionCardProps {
  heading: string;
  reference: string;
  description: string;
  visuals: ActiveImage[];
  actions?: ActionLink[];
  onVisualSelect: (visual: ActiveImage) => void;
}

export default function SectionCard({
  heading,
  reference,
  description,
  visuals,
  actions,
  onVisualSelect,
}: SectionCardProps) {
  const actionClassName =
    "inline-flex min-h-[38px] cursor-pointer items-center rounded-full border border-[#cfdcda] bg-white px-3.5 py-2 text-[11px] font-extrabold text-v2-navy-btn transition-colors duration-300 hover:border-[#8fc9c3] hover:bg-[#fbfdfc]";

  return (
    <section className="border-t border-v2-border pt-6">
      <h3 className="font-heading max-w-[1050px] text-[clamp(28px,3vw,40px)] font-medium leading-[1.08] text-[#143b53]">
        {heading}
      </h3>
      <p className="mt-1.5 font-sans text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#81929a]">
        {reference}
      </p>
      {visuals.length > 1 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {visuals.map((visual) => (
            <VisualPlaceholder
              key={visual.label}
              label={visual.label}
              variant={visual.variant}
              size="split"
              onSelect={onVisualSelect}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <VisualPlaceholder
            label={visuals[0].label}
            variant={visuals[0].variant}
            size="standard"
            onSelect={onVisualSelect}
          />
        </div>
      )}
      <p className="mt-4 max-w-[920px] font-sans text-sm leading-[1.72] text-[#5f747e]">
        {description}
      </p>
      {actions && actions.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2">
          {actions.map((action) =>
            action.href ? (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClassName}
              >
                {action.label} ↗
              </a>
            ) : (
              <button
                key={action.label}
                type="button"
                className={actionClassName}
              >
                {action.label} ↗
              </button>
            )
          )}
        </div>
      )}
    </section>
  );
}
