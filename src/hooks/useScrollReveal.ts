"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = "0px",
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealedRef.current) return;

    if (typeof IntersectionObserver === "undefined") {
      revealedRef.current = true;
      const id = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (revealedRef.current) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          revealedRef.current = true;
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, revealed };
}
