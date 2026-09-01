"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { PDFDocumentProxy, PDFPageProxy, PageViewport } from "pdfjs-dist";

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function loadPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

interface PdfCanvasViewerProps {
  url: string;
  className?: string;
}

export default function PdfCanvasViewer({ url, className = "" }: PdfCanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);

  const renderPage = useCallback(async (pageNum: number) => {
    const doc = pdfDocRef.current;
    if (!doc || !canvasRef.current || !containerRef.current) return;

    const page: PDFPageProxy = await doc.getPage(pageNum);
    const containerWidth = containerRef.current.clientWidth;
    const viewport: PageViewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / viewport.width;
    const scaledViewport: PageViewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    await page.render({ canvas: null, canvasContext: ctx, viewport: scaledViewport }).promise;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const lib = await loadPdfjs();
        if (cancelled) return;

        const encodedUrl = url
          .split("/")
          .map((part, i, arr) => (i === arr.length - 1 ? encodeURIComponent(part) : encodeURIComponent(part)))
          .join("/");

        const doc = await lib.getDocument({ url: encodedUrl }).promise;
        if (cancelled) return;

        pdfDocRef.current = doc;
        setTotalPages(doc.numPages);
        setLoading(false);

        const page: PDFPageProxy = await doc.getPage(1);
        if (cancelled || !canvasRef.current || !containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth;
        const viewport: PageViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewport.width;
        const scaledViewport: PageViewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        await page.render({ canvas: null, canvasContext: ctx, viewport: scaledViewport }).promise;
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load PDF");
        setLoading(false);
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      pdfDocRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    if (currentPage > 0 && pdfDocRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage, renderPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleResize() {
      if (currentPage > 0 && pdfDocRef.current) {
        renderPage(currentPage);
      }
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [currentPage, renderPage]);

  if (loading) {
    return (
      <div className={`flex flex-1 items-center justify-center ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-main border-t-transparent" />
          <p className="text-xs text-content-primary/50">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-1 items-center justify-center ${className}`}>
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <p className="text-sm text-red-500">Failed to load PDF</p>
          <p className="text-xs text-content-primary/40">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-1 flex-col min-h-0 ${className}`}>
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-start justify-center bg-slate-100"
      >
        <canvas
          ref={canvasRef}
          className="max-w-full"
          style={{ display: "block" }}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-content-primary/10 bg-white px-4 py-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="cursor-pointer rounded p-1.5 text-content-primary/60 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="text-xs font-medium text-content-primary/70 tabular-nums">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="cursor-pointer rounded p-1.5 text-content-primary/60 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
