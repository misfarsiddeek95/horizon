"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
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
              dimensions={visual.dimensions}
              modalDimensions={visual.modalDimensions}
              src={visual.src}
              fit={visual.fit}
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
            dimensions={visuals[0].dimensions}
            modalDimensions={visuals[0].modalDimensions}
            src={visuals[0].src}
            fit={visuals[0].fit}
            onSelect={onVisualSelect}
          />
        </div>
      )}
      <p className="mt-4 max-w-[920px] font-sans leading-[1.72] text-[#5f747e]">
        {description}
      </p>
      {actions && actions.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {actions.map((action) =>
            action.href ? (
              <Button
                key={action.label}
                behavior="link"
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="min-h-[48px]"
                icon={<ArrowUpRightIcon className="h-4 w-4" />}
              >
                {action.label}
              </Button>
            ) : (
              <Button
                key={action.label}
                type="button"
                variant="primary"
                className="min-h-[48px]"
                icon={<ArrowUpRightIcon className="h-4 w-4" />}
              >
                {action.label}
              </Button>
            )
          )}
        </div>
      )}
    </section>
  );
}
