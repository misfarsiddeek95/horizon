"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedRailProps {
  pct: number;
  className: string;
  index?: number;
}

export default function AnimatedRail({
  pct,
  className,
  index = 0,
}: AnimatedRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

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

  return (
    <div
      ref={ref}
      className={`mt-2 h-1 max-w-[170px] overflow-hidden rounded-full bg-white/20 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        className="block h-full rounded-full bg-current transition-[width] duration-1000 ease-out motion-reduce:transition-none"
        style={{
          width: isVisible ? `${pct}%` : "0%",
          transitionDelay: `${index * 120}ms`,
        }}
      />
    </div>
  );
}
