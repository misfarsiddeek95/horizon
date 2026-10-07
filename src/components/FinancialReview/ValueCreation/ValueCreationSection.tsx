"use client";

import Image from "next/image";
import { useState } from "react";
import ValueCreationTabs from "./ValueCreationTabs";
import {
  CAPITALS,
  ENVIRONMENTAL_IMPACTS,
  OUTCOMES,
  OUTPUT_METRICS,
  PLANET_FOCUS,
  STAGES,
  STRATEGY_PILLARS,
  STRATEGY_RIBBON,
  TRANSFORMATION_TRACKS,
  VALUE_CREATION_COPY,
  VALUE_CREATION_IMAGES,
  renderIconNodes,
  type StageId,
} from "./valueCreationData";

type DesktopArrow = "right" | "down" | "left";

const AC_FLOW_PLACEMENTS = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-3 lg:col-span-2 lg:row-start-2",
  "lg:col-start-1 lg:col-span-2 lg:row-start-2",
];

const AC_FLOW_ARROWS: (DesktopArrow | undefined)[] = [
  "right",
  "right",
  "right",
  "down",
  "left",
  undefined,
];

const ARROW_CLASS = "absolute text-2xl leading-none text-[#e67f45]";

function PanelHead({ stage }: { stage: StageId }) {
  const meta = STAGES[stage];
  return (
    <div className="mb-6 flex flex-col items-start gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-2xl md:text-3xl font-bold leading-[1.3] text-v2-navy-deep">
          {meta.label}
        </h3>
        <p className="mt-2 max-w-[820px] font-sans text-sm md:text-base leading-[1.6] text-v2-text-muted">
          {meta.description}
        </p>
      </div>
      <span className="shrink-0 rounded-full border border-v2-border bg-v2-wash px-3 py-1.5 text-caption font-bold text-v2-accent-text">
        {meta.badge}
      </span>
    </div>
  );
}

interface FlowStepProps {
  step: string;
  isLast: boolean;
  desktopArrow?: DesktopArrow;
  className?: string;
}

function FlowStep({ step, isLast, desktopArrow, className }: FlowStepProps) {
  return (
    <div
      className={`relative flex min-h-[108px] items-center justify-center rounded-[16px_16px_16px_5px] border border-v2-border bg-white p-3 text-center text-caption font-bold leading-[1.35] text-v2-navy-deep ${className ?? ""}`}
    >
      {step}
      {!isLast && (
        <span aria-hidden="true" className={`${ARROW_CLASS} -bottom-8 left-1/2 -translate-x-1/2 lg:hidden`}>
          ↓
        </span>
      )}
      {desktopArrow === "right" && (
        <span aria-hidden="true" className={`${ARROW_CLASS} -right-5 top-1/2 hidden -translate-y-1/2 lg:block`}>
          →
        </span>
      )}
      {desktopArrow === "down" && (
        <span aria-hidden="true" className={`${ARROW_CLASS} -bottom-8 left-1/2 hidden -translate-x-1/2 lg:block`}>
          ↓
        </span>
      )}
      {desktopArrow === "left" && (
        <span aria-hidden="true" className={`${ARROW_CLASS} -left-5 top-1/2 hidden -translate-y-1/2 lg:block`}>
          ←
        </span>
      )}
    </div>
  );
}

function InputsPanel() {
  return (
    <>
      <PanelHead stage="inputs" />
      <div className="grid grid-cols-1 gap-3.5 border-t border-v2-border pt-5 md:grid-cols-2 lg:grid-cols-4">
        {CAPITALS.map((capital) => (
          <article
            key={capital.title}
            className="relative min-h-[210px] overflow-hidden rounded-[20px_20px_20px_7px] border border-[rgba(23,53,65,.08)] p-[18px]"
            style={{ background: capital.background }}
          >
            <div
              className="grid h-[42px] w-[42px] place-items-center rounded-[12px] text-white"
              style={{ background: capital.iconBackground }}
            >
              <svg
                viewBox={capital.icon.viewBox}
                className="h-[25px] w-[25px] fill-none stroke-current stroke-linecap-round stroke-linejoin-round"
                strokeWidth={2.2}
              >
                {renderIconNodes(capital.icon.nodes)}
              </svg>
            </div>
            <h4 className="mb-1.5 mt-3 text-sm font-bold text-v2-navy-deep">{capital.title}</h4>
            <p className="mb-3 text-caption leading-[1.4] text-v2-text-soft">{capital.description}</p>
            {capital.stats.map((stat) => (
              <div key={stat.label} className="text-caption leading-[1.65] text-v2-text-body">
                {stat.label}{" "}
                <span className="font-extrabold text-v2-navy-deep">{stat.value}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </>
  );
}

function StrategyPanel() {
  return (
    <>
      <PanelHead stage="strategy" />
      <div className="grid grid-cols-1 gap-3.5 border-t border-v2-border pt-5 md:grid-cols-2 lg:grid-cols-4">
        {STRATEGY_PILLARS.map((pillar) => (
          <article
            key={pillar.number}
            className="min-h-[180px] rounded-[20px_20px_20px_7px] border border-v2-border bg-gradient-to-b from-white to-[#fffaf6] p-5"
          >
            <div className="mb-3.5 grid h-12 w-12 place-items-center rounded-[15px] bg-[#fce9dd] text-sm font-extrabold text-[#e67f45]">
              {pillar.number}
            </div>
            <h4 className="mb-2 text-sm font-bold text-v2-navy-deep">{pillar.title}</h4>
            <p className="text-caption leading-[1.55] text-v2-text-soft">{pillar.text}</p>
          </article>
        ))}
      </div>
      <div className="mt-[18px] flex flex-wrap items-center justify-between gap-5 rounded-[18px_18px_18px_6px] bg-gradient-to-r from-v2-accent-dark to-v2-accent p-[18px_22px] text-white">
        <strong className="text-sm font-bold">{STRATEGY_RIBBON.title}</strong>
        <span className="text-caption leading-[1.4] opacity-90">{STRATEGY_RIBBON.detail}</span>
      </div>
    </>
  );
}

function TransformationPanel() {
  return (
    <>
      <PanelHead stage="transformation" />
      <div className="grid grid-cols-1 gap-4 border-t border-v2-border pt-5 lg:grid-cols-2">
        {TRANSFORMATION_TRACKS.map((track) => (
          <article
            key={track.id}
            className="min-w-0 rounded-[22px_22px_22px_7px] border border-v2-border bg-gradient-to-b from-white to-[#fcfcfb] p-[18px]"
          >
            <h4 className="mb-3.5 text-lg font-extrabold tracking-[-0.02em] text-v2-navy-deep">
              {track.title}
            </h4>
            {track.id === "activated-carbon" ? (
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-4">
                {track.steps.map((step, index) => (
                  <FlowStep
                    key={step}
                    step={step}
                    isLast={index === track.steps.length - 1}
                    desktopArrow={AC_FLOW_ARROWS[index]}
                    className={AC_FLOW_PLACEMENTS[index]}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-4">
                {track.steps.map((step, index) => (
                  <FlowStep
                    key={step}
                    step={step}
                    isLast={index === track.steps.length - 1}
                    desktopArrow={index === track.steps.length - 1 ? undefined : "right"}
                    className="flex-1"
                  />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

function OutputsPanel() {
  return (
    <>
      <PanelHead stage="outputs" />
      <div className="grid grid-cols-1 gap-4 border-t border-v2-border pt-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {OUTPUT_METRICS.map((metric) => (
            <article
              key={metric.value}
              className="flex min-h-[170px] min-w-0 flex-col rounded-[20px_20px_20px_7px] border border-v2-border bg-white p-5"
            >
              <div className="text-caption font-extrabold uppercase tracking-[0.1em] text-v2-label">
                {metric.label}
              </div>
              <div className="mt-2.5 mb-2 break-words text-2xl md:text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-v2-navy-deep">
                {metric.value}
              </div>
              <p className="text-caption leading-[1.5] text-v2-text-soft">{metric.text}</p>
            </article>
          ))}
        </div>
        <div className="min-w-0 rounded-[22px_22px_22px_7px] border border-[#d6e6de] bg-gradient-to-b from-[#eff8f5] to-[#e1efe8] p-[22px]">
          <h4 className="mb-3.5 text-xl font-bold text-v2-navy-deep">Environmental Impact</h4>
          <div className="grid gap-3">
            {ENVIRONMENTAL_IMPACTS.map((impact) => (
              <div
                key={impact.label}
                className="rounded-[16px] border border-[#dce8e1] bg-white p-4"
              >
                <div className="break-words text-3xl md:text-5xl font-semibold leading-none tracking-[-0.045em] text-v2-navy-deep">
                  {impact.value}
                </div>
                <p className="mt-1.5 text-caption text-v2-text-soft">{impact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function OutcomesPanel() {
  return (
    <>
      <PanelHead stage="outcomes" />
      <div className="grid grid-cols-1 gap-4 border-t border-v2-border pt-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {OUTCOMES.map((outcome) => (
            <article
              key={outcome.title}
              className="rounded-[18px_18px_18px_6px] border border-v2-border bg-white p-4"
            >
              <h4 className="mb-2 text-sm font-bold text-v2-navy-deep">{outcome.title}</h4>
              <p className="text-caption leading-[1.5] text-v2-text-soft">{outcome.text}</p>
            </article>
          ))}
        </div>
        <div className="min-w-0 rounded-[22px_22px_22px_7px] border border-[#d3e8e3] bg-gradient-to-b from-[#f2fbfa] to-[#e6f5f2] p-[22px]">
          <h4 className="mb-3.5 text-xl font-bold text-v2-navy-deep">Communities &amp; Planet</h4>
          <div className="grid gap-3">
            {PLANET_FOCUS.map((focus) => (
              <div
                key={focus.title}
                className="rounded-[16px] border border-[#dce9e5] bg-white p-4"
              >
                <b className="mb-1 block text-caption font-bold text-v2-navy-deep">{focus.title}</b>
                <span className="block text-caption leading-[1.45] text-v2-text-soft">
                  {focus.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StagePanel({ stage }: { stage: StageId }) {
  if (stage === "inputs") return <InputsPanel />;
  if (stage === "strategy") return <StrategyPanel />;
  if (stage === "transformation") return <TransformationPanel />;
  if (stage === "outputs") return <OutputsPanel />;
  return <OutcomesPanel />;
}

export default function ValueCreationSection() {
  const [activeStage, setActiveStage] = useState<StageId>("inputs");
  const illustration = VALUE_CREATION_IMAGES.illustration;
  const wheel = VALUE_CREATION_IMAGES.wheel;

  return (
    <section className="relative overflow-hidden border-t border-v2-border py-12 md:py-16">
      <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-2 lg:gap-11">
        <div className="flex w-full min-w-0 flex-col lg:pt-8">
          <p className="text-caption font-black uppercase tracking-[0.1em] text-v2-accent-text">
            {VALUE_CREATION_COPY.kicker}
          </p>
          <h2 className="mt-3.5 font-heading text-2xl md:text-4xl font-medium leading-[1.02] tracking-[-0.025em] text-balance text-v2-ink">
            {VALUE_CREATION_COPY.title}
          </h2>
          <div className="mt-6 w-full max-w-full overflow-hidden rounded-[20px_20px_20px_6px] border border-[#d9e8e7] bg-[#eaf5f3]">
            <Image
              src={illustration.src}
              alt={illustration.alt}
              width={illustration.width}
              height={illustration.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="block h-auto w-full max-w-full object-contain"
            />
          </div>
          <p className="mt-6 max-w-[500px] font-sans text-sm md:text-base leading-[1.85] text-brand-muted">
            {VALUE_CREATION_COPY.intro}
          </p>
          <div className="mt-6 h-0.5 w-[66px] rounded-full bg-v2-accent" />
          <p className="mt-3.5 text-caption text-v2-label">{VALUE_CREATION_COPY.hint}</p>
        </div>
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[25px_25px_25px_8px] border border-[#dbe8e7] bg-[#eef8f6]">
          <Image
            src={wheel.src}
            alt={wheel.alt}
            width={wheel.width}
            height={wheel.height}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="block h-auto w-full max-w-full object-contain"
          />
        </div>
      </div>

      <div className="mt-12 border-t border-v2-border pt-4">
        <ValueCreationTabs active={activeStage} onSelect={setActiveStage} />
      </div>

      <div key={activeStage} className="animate-fade-in pt-8 md:pt-12">
        <StagePanel stage={activeStage} />
      </div>
    </section>
  );
}
