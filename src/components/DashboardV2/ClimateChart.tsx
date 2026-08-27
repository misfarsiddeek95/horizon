"use client";

import { useEffect, useRef, useState } from "react";

interface ClimateChartProps {
  title: string;
  axisLabel: string;
  unit: string;
  format: "percent" | "number" | "multiple";
  upperVals: [number, number, number];
  lowerVals: [number, number, number];
  singleEstimate?: boolean;
  accentColor: string;
}

const W = 820;
const H = 350;
const M = { l: 70, r: 35, t: 35, b: 35 } as const;
const HORIZONS = ["ST", "MT", "LT"] as const;
const SWEEP_MS = 1500;

function formatVal(v: number, format: string): string {
  if (format === "percent") return Math.round(v) + "%";
  if (format === "multiple") return v.toFixed(1) + "×";
  return String(v);
}

function fmtAxisLabel(v: number, format: string, maxVal: number): string {
  if (format === "percent") return Math.round(v) + "%";
  if (format === "multiple") return v.toFixed(1) + "×";
  return v.toFixed(maxVal < 10 ? 1 : 0);
}

export default function ClimateChart({
  title,
  axisLabel,
  unit,
  format,
  upperVals,
  lowerVals,
  singleEstimate = false,
  accentColor,
}: ClimateChartProps) {
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

  const vals = [...upperVals, ...lowerVals];
  let minVal = Math.min(0, ...vals);
  let maxVal = Math.max(...vals);
  if (minVal === maxVal) maxVal = minVal + 1;
  const pad = (maxVal - minVal) * 0.12 || 1;
  maxVal += pad;
  if (minVal < 0) minVal -= pad;

  const x = (i: number) => M.l + i * ((W - M.l - M.r) / 2);
  const y = (v: number) =>
    H - M.b - ((v - minVal) / (maxVal - minVal)) * (H - M.t - M.b);

  const sweepTransition = reducedMotion
    ? "none"
    : `clip-path ${SWEEP_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  const axisLines = Array.from({ length: 6 }, (_, i) => {
    const v = minVal + ((maxVal - minVal) * i) / 5;
    return { v, yy: y(v), label: fmtAxisLabel(v, format, maxVal) };
  });

  const upperPath = HORIZONS.map(
    (_, i) => `${i ? "L" : "M"} ${x(i)} ${y(upperVals[i])}`
  ).join(" ");
  const lowerPath = HORIZONS.map(
    (_, i) => `${i ? "L" : "M"} ${x(i)} ${y(lowerVals[i])}`
  ).join(" ");

  let bandPath = "";
  if (!singleEstimate) {
    const highForward = upperVals
      .map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`)
      .join(" ");
    const lowReverse = [...lowerVals]
      .reverse()
      .map((v, ri) => `L ${x(2 - ri)} ${y(v)}`)
      .join(" ");
    bandPath = `${highForward} ${lowReverse} Z`;
  }

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={title}
      className="block h-auto w-full"
    >
        {axisLines.map(({ v, yy, label }) => (
          <g key={v}>
            <line
              x1={M.l}
              x2={W - M.r}
              y1={yy}
              y2={yy}
              stroke="#e2e9ee"
              strokeWidth="1"
            />
            <text
              x={M.l - 10}
              y={yy + 4}
              textAnchor="end"
              fontSize="11"
              fill="#738495"
            >
              {label}
            </text>
          </g>
        ))}

        <line
          x1={M.l}
          x2={M.l}
          y1={M.t}
          y2={H - M.b}
          stroke="#9eacb9"
          strokeWidth="1"
        />
        <line
          x1={M.l}
          x2={W - M.r}
          y1={H - M.b}
          y2={H - M.b}
          stroke="#9eacb9"
          strokeWidth="1"
        />

        <g
          style={{
            clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition: sweepTransition,
          }}
        >
          {bandPath && (
            <path d={bandPath} fill={accentColor} opacity=".10" />
          )}

          {!singleEstimate ? (
            <>
              <path
                d={lowerPath}
                fill="none"
                stroke={accentColor}
                opacity=".62"
                strokeWidth="3"
              />
              <path
                d={upperPath}
                fill="none"
                stroke={accentColor}
                strokeWidth="3.4"
              />
            </>
          ) : (
            <path
              d={lowerPath}
              fill="none"
              stroke={accentColor}
              strokeWidth="3.4"
            />
          )}

          {HORIZONS.map((h, i) => {
            const xx = x(i);
            const yl = y(lowerVals[i]);
            const yh = y(upperVals[i]);
            const same = lowerVals[i] === upperVals[i];
            return (
              <g key={h}>
                <circle
                  cx={xx}
                  cy={yl}
                  r="5"
                  fill={accentColor}
                  opacity={same ? 1 : 0.65}
                  stroke="#fff"
                  strokeWidth="2"
                  style={{
                    opacity: isVisible ? (same ? 1 : 0.65) : 0,
                    transition: reducedMotion
                      ? "none"
                      : "opacity .4s ease-out",
                    transitionDelay: reducedMotion
                      ? "0ms"
                      : `${Math.round((xx / (W - M.r)) * SWEEP_MS)}ms`,
                  }}
                />
                {!same && (
                  <circle
                    cx={xx}
                    cy={yh}
                    r="5"
                    fill={accentColor}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: reducedMotion
                        ? "none"
                        : "opacity .4s ease-out",
                      transitionDelay: reducedMotion
                        ? "0ms"
                        : `${Math.round((xx / (W - M.r)) * SWEEP_MS)}ms`,
                    }}
                  />
                )}
                <text
                  x={xx}
                  y={yl + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={accentColor}
                  opacity=".8"
                >
                  {formatVal(lowerVals[i], format)}
                </text>
                {!same && (
                  <text
                    x={xx}
                    y={yh - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="900"
                    fill={accentColor}
                  >
                    {formatVal(upperVals[i], format)}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        <text
          x="18"
          y={H / 2}
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="800"
          fill="#5f7183"
          transform={`rotate(-90, 18, ${H / 2})`}
        >
          {axisLabel} ({unit})
        </text>
      </svg>
  );
}
