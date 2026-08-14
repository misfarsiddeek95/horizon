"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

const NUMBER_PATTERN = /^([^0-9]*)(\d[\d,]*(?:\.\d+)?)(.*)$/;

function parseValue(value: string) {
  const match = NUMBER_PATTERN.exec(value);
  if (!match) return null;

  const prefix = match[1];
  const numberPart = match[2];
  const suffix = match[3];
  const numericValue = parseFloat(numberPart.replace(/,/g, ""));
  if (Number.isNaN(numericValue)) return null;

  const decimalPlaces = numberPart.includes(".")
    ? numberPart.split(".")[1].length
    : 0;
  const hasCommas = numberPart.includes(",");

  return { prefix, numericValue, suffix, decimalPlaces, hasCommas };
}

function formatNumber(value: number, decimalPlaces: number, hasCommas: boolean) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: hasCommas,
  });
}

export default function AnimatedCounter({ value, duration = 1500 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const animatedRef = useRef(false);

  useEffect(() => {
    const parsed = parseValue(value);
    const element = ref.current;
    if (!parsed || !element) return;

    animatedRef.current = false;
    setDisplay(value);
    let frameId = 0;

    const animate = () => {
      animatedRef.current = true;
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = parsed.numericValue * eased;

        setDisplay(
          `${parsed.prefix}${formatNumber(current, parsed.decimalPlaces, parsed.hasCommas)}${parsed.suffix}`
        );

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !animatedRef.current) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
