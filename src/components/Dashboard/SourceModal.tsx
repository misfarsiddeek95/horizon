"use client";

import { useEffect, useCallback, useState } from "react";
import { SOURCE_LIBRARY, SOURCE_MAP, ANNUAL_REPORT_URL } from "@/data/climateSources";

interface SourceModalProps {
  sourceKey: string;
  onClose: () => void;
}

export default function SourceModal({ sourceKey, onClose }: SourceModalProps) {
  const entry = SOURCE_MAP[sourceKey];
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsVisible(true));
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!entry) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-modal-title"
    >
      <div className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col overflow-hidden transition-all duration-300 ease-out ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}>
        <div className="px-6 py-4 border-b border-[#E2E8ED] flex items-start justify-between gap-4">
          <div>
            <h2
              id="source-modal-title"
              className="font-heading text-lg font-bold text-[#071D43] m-0"
            >
              Sources · {entry.name}
            </h2>
            <p className="text-sm text-[#667085] mt-0.5 m-0">{entry.supports}</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-lg hover:bg-slate-200/80 active:scale-95 transition-all duration-150 text-[#667085]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <p className="text-xs text-[#667085] mb-4">
            The following sources were used in the preparation of this analysis.
          </p>
          <div className="space-y-3">
            {entry.sources.map((id) => {
              const source = SOURCE_LIBRARY[id];
              if (!source) return null;
              return (
                <div
                  key={id}
                  className="border border-[#E2E8ED] rounded-lg p-3"
                >
                  <div className="text-sm font-extrabold text-[#344257]">
                    {source.title}
                  </div>
                  <div className="text-xs text-[#667085] mt-1">
                    {source.organisation} · {source.year}
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-main hover:underline mt-1 inline-block"
                    >
                      View source &rarr;
                    </a>
                  )}
                  {source.supports && (
                    <div className="text-[11px] text-[#4A586B] mt-2 leading-[1.45]">
                      {source.supports}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {entry.annualReport && entry.annualReport.length > 0 && (
          <div className="px-6 py-3 border-t border-[#E2E8ED] bg-[#F5F8FB]">
            <div className="text-xs font-extrabold text-[#344257] mb-1">
              Annual Report References
            </div>
            {entry.annualReport.map((ref, i) => (
              <a
                key={i}
                href={`${ANNUAL_REPORT_URL}#page=${ref.pdfPage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-main hover:underline block"
              >
                {ref.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
