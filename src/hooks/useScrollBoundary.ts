"use client";
import { useCallback, useRef } from "react";

export function useScrollBoundary() {
  const ref = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (e.deltaY < 0 && atTop) {
      return;
    }
    if (e.deltaY > 0 && atBottom) {
      return;
    }

    e.stopPropagation();
  }, []);

  return { ref, handleWheel };
}
