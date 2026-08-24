"use client";

import { Fragment, useEffect, useRef, useState } from "react";

interface GlowChartProps {
  title: string;
  upperVals: [number, number, number];
  lowerVals: [number, number, number];
  isPercent?: boolean;
}

const XS = [55, 190, 325] as const;
const HORIZONS = ["ST", "MT", "LT"] as const;
const SWEEP_MS = 1500;

export default function GlowChart({
  title,
  upperVals,
  lowerVals,
  isPercent = false,
}: GlowChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const max = Math.max(...upperVals) * 1.15;
  const y = (v: number) => 190 - (v / max) * 145;

  const upperPoints = upperVals.map((v, i) => `${XS[i]},${y(v)}`).join(" ");
  const lowerPoints = lowerVals.map((v, i) => `${XS[i]},${y(v)}`).join(" ");
  const areaPoints = [
    `${XS[0]},${y(upperVals[0])}`,
    `${XS[1]},${y(upperVals[1])}`,
    `${XS[2]},${y(upperVals[2])}`,
    `${XS[2]},${y(lowerVals[2])}`,
    `${XS[1]},${y(lowerVals[1])}`,
    `${XS[0]},${y(lowerVals[0])}`,
  ].join(" ");

  const label = /Cost|Revenue/.test(title) ? "Financial effect" : "Driver";
  const sweepTransition = reducedMotion
    ? "none"
    : `clip-path ${SWEEP_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.08em] text-white/60">
        {label}
      </div>
      <h4 className="mb-[2px] mt-[7px] text-[15px] font-medium leading-[1.35]">
        {title}
      </h4>
      <p className="m-0 mb-2 text-[11px] text-white/55">
        ST · MT · LT scenario range
      </p>
      <svg
        ref={ref}
        viewBox="0 0 380 235"
        role="img"
        aria-label={title}
        className="block h-auto w-full"
      >
        <line x1="45" y1="190" x2="345" y2="190" stroke="rgba(255,255,255,.25)" />
        <line x1="45" y1="145" x2="345" y2="145" stroke="rgba(255,255,255,.12)" />
        <line x1="45" y1="100" x2="345" y2="100" stroke="rgba(255,255,255,.12)" />
        <line x1="45" y1="55" x2="345" y2="55" stroke="rgba(255,255,255,.12)" />
        {XS.map((x, i) => (
          <text
            key={HORIZONS[i]}
            x={x}
            y="210"
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,.7)"
          >
            {HORIZONS[i]}
          </text>
        ))}
        <g
          style={{
            clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition: sweepTransition,
          }}
        >
          <polygon points={areaPoints} fill="rgba(255,255,255,.12)" />
          <polyline
            points={upperPoints}
            fill="none"
            stroke="var(--color-mint)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(233,245,248,.5))" }}
          />
          <polyline
            points={lowerPoints}
            fill="none"
            stroke="var(--color-lime)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(184,214,92,.45))" }}
          />
          {XS.map((x, i) => (
            <Fragment key={HORIZONS[i]}>
              <circle
                cx={x}
                cy={y(upperVals[i])}
                r="4"
                fill="var(--color-mint)"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity .4s ease-out",
                  transitionDelay: reducedMotion
                    ? "0ms"
                    : `${Math.round((x / 345) * SWEEP_MS)}ms`,
                }}
              />
              <circle
                cx={x}
                cy={y(lowerVals[i])}
                r="4"
                fill="var(--color-lime)"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity .4s ease-out",
                  transitionDelay: reducedMotion
                    ? "0ms"
                    : `${Math.round((x / 345) * SWEEP_MS)}ms`,
                }}
              />
              <text
                x={x}
                y={y(upperVals[i]) - 9}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#ffffff"
              >
                {upperVals[i]}
                {isPercent ? "%" : ""}
              </text>
            </Fragment>
          ))}
        </g>
        <line
          x1="220"
          y1="224"
          x2="240"
          y2="224"
          stroke="var(--color-mint)"
          strokeWidth="3"
        />
        <text x="245" y="228" fontSize="9" fill="rgba(255,255,255,.65)">
          Upper estimate
        </text>
        <line
          x1="70"
          y1="224"
          x2="90"
          y2="224"
          stroke="var(--color-lime)"
          strokeWidth="3"
        />
        <text x="95" y="228" fontSize="9" fill="rgba(255,255,255,.65)">
          Lower estimate
        </text>
      </svg>
    </div>
  );
}
