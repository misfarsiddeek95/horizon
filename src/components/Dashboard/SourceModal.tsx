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
      <div className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ease-out ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}>
        <div className="px-6 py-4 border-b border-[#E2E8ED] flex items-start justify-between gap-4">
          <div>
            <h2
              id="source-modal-title"
              className="font-heading text-lg font-bold text-[#071D43] m-0"
            >
              Sources · {entry.name}
            </h2>
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

        <div className="px-6 py-5 flex-1 overflow-y-auto space-y-5">
          <p className="text-sm text-[#526174] leading-[1.55] m-0">
            {entry.supports}
          </p>

          <div className="space-y-3">
            {entry.sources.map((id) => {
              const source = SOURCE_LIBRARY[id];
              if (!source) return null;
              return (
                <article
                  key={id}
                  className="border border-[#DCE5ED] rounded-[14px] p-4 bg-white"
                >
                  <h4 className="text-[15px] font-heading font-bold text-[#071D43] m-0 mb-2">
                    {source.title}
                  </h4>
                  <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-[#5F6E80] mb-2">
                    <span>
                      <strong className="text-[#344257]">Organisation:</strong>{" "}
                      {source.organisation}
                    </span>
                    <span>
                      <strong className="text-[#344257]">Year:</strong>{" "}
                      {source.year}
                    </span>
                  </div>
                  {source.supports && (
                    <div className="text-[13px] text-[#405065] bg-[#F5F8FB] rounded-[9px] px-3 py-2.5 leading-[1.5] mb-3">
                      <strong>Relevance:</strong> {source.supports}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 no-underline rounded-[9px] px-2.5 py-2 text-[13px] font-[850] bg-[#EAF5F6] text-[#116D72] hover:underline"
                      >
                        View original source ↗
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-[9px] px-2.5 py-2 bg-[#F2F4F7] text-[#667085] text-[13px] font-[750]">
                        Cited in the Annual Report; no single public link identified
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="border-l-[3px] border-[#168E95] bg-[#F7FAFC] rounded-lg px-3 py-3 text-[13px] text-[#526174] leading-[1.45]">
            <strong>Primary disclosure:</strong> Haycarb PLC Annual Report 2025/26
            <br />
            <strong>Dashboard role:</strong> Interactive presentation of the
            published climate-risk, opportunity, financial-effect and resilience
            disclosures.
          </div>

          {entry.annualReport && entry.annualReport.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.annualReport.map((ref, i) => (
                <a
                  key={i}
                  href={`${ANNUAL_REPORT_URL}#page=${ref.pdfPage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 no-underline rounded-[9px] px-2.5 py-2 text-[13px] font-[850] bg-[#EDF2FB] text-[#174A7E] hover:underline"
                >
                  View Annual Report disclosure · {ref.label} ↗
                </a>
              ))}
            </div>
          )}

          <div className="text-[12px] text-[#667085] leading-[1.45]">
            External links open in a new browser tab. Where the Annual Report
            cites a source category but does not identify one exact public URL,
            this is stated clearly.
          </div>
        </div>
      </div>
    </div>
  );
}
