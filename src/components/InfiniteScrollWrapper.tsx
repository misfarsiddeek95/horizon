"use client";
import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";

export default function InfiniteScrollWrapper({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    lenis.on("scroll", () => {
      if (!contentRef.current) return;
      const contentHeight = contentRef.current.getBoundingClientRect().height;

      if (lenis.scroll >= contentHeight) {
        lenis.scrollTo(lenis.scroll - contentHeight, { immediate: true });
      }
      if (lenis.scroll <= 0 && lenis.velocity < 0) {
        lenis.scrollTo(contentHeight, { immediate: true });
      }
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="w-full">
      <div ref={contentRef} className="w-full original-content-block">{children}</div>
      <div className="w-full pointer-events-none" aria-hidden="true">{children}</div>
    </div>
  );
}
