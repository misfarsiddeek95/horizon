"use client";

import { useEffect, useCallback, useState } from "react";
import type { Target, Pillar } from "@/data/activateDashboard";
import { STATUS_COLORS, STATUS_BG, META } from "@/data/activateDashboard";

interface TargetDetailModalProps {
  target: Target;
  pillar: Pillar;
  onClose: () => void;
}

function sourceLink(page: number): string {
  return `${META.annualReportUrl}#page=${page}`;
}

export default function TargetDetailModal({
  target,
  pillar,
  onClose,
}: TargetDetailModalProps) {
  const statusColor = STATUS_COLORS[target.status] || "#667085";
  const statusBg = STATUS_BG[target.status] || "#F5F7F9";
  const [isVisible, setIsVisible] = useState(false);

  const statusNumber =
    target.progress !== null
      ? target.progress >= 100
        ? "100%"
        : `${target.progress}%`
      : "";

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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-5 transition-opacity duration-300 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundColor: "rgba(4,18,43,.58)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full max-w-[880px] max-h-[88vh] overflow-auto bg-white rounded-[17px] shadow-[0_25px_70px_rgba(0,0,0,.28)] transition-all duration-300 ease-out ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
        style={
          {
            "--accent": pillar.color,
            "--light": pillar.light,
          } as React.CSSProperties
        }
      >
        <div className="flex justify-between items-center px-[19px] py-4 border-b border-[#DDE5EB]">
          <h2
            id="modal-title"
            className="text-lg m-0 font-heading"
            style={{ color: "#071D43" }}
          >
            {target.indicator}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-[34px] h-[34px] rounded-full border-0 bg-[#EEF3F6] text-lg cursor-pointer hover:bg-[#DDE5EB] active:scale-95 transition-all duration-150"
          >
            ×
          </button>
        </div>

        <div className="px-[19px] py-[17px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="text-[28px] font-black"
                style={{ color: pillar.color }}
              >
                {target.current}
              </div>
              <div className="text-[#667085] text-[11px] mt-1">
                {target.unit}
              </div>
            </div>
            <div
              className="rounded-[10px] text-center flex flex-col items-center justify-center min-w-[130px] p-[7px_9px]"
              style={{ backgroundColor: statusBg, color: statusColor }}
            >
              <div className="text-[17px] font-black leading-none">
                {statusNumber}
              </div>
              <div className="text-[8.5px] font-[850] leading-[1.25] mt-1">
                {target.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-[9px] my-[15px] max-md:grid-cols-2">
            <div className="bg-[#F6F8FA] border border-[#E4EAEF] rounded-[10px] p-2.5">
              <span className="block text-[8px] uppercase tracking-[0.05em] text-[#667085] font-extrabold">
                Baseline
              </span>
              <b className="block mt-1 text-[11px] text-[#071D43]">
                {target.baseline}
              </b>
            </div>
            <div className="bg-[#F6F8FA] border border-[#E4EAEF] rounded-[10px] p-2.5">
              <span className="block text-[8px] uppercase tracking-[0.05em] text-[#667085] font-extrabold">
                2027 milestone
              </span>
              <b className="block mt-1 text-[11px] text-[#071D43]">
                {target.milestone2027}
              </b>
            </div>
            <div className="bg-[#F6F8FA] border border-[#E4EAEF] rounded-[10px] p-2.5">
              <span className="block text-[8px] uppercase tracking-[0.05em] text-[#667085] font-extrabold">
                2028 milestone
              </span>
              <b className="block mt-1 text-[11px] text-[#071D43]">
                {target.milestone2028}
              </b>
            </div>
            <div className="bg-[#F6F8FA] border border-[#E4EAEF] rounded-[10px] p-2.5">
              <span className="block text-[8px] uppercase tracking-[0.05em] text-[#667085] font-extrabold">
                2030 target
              </span>
              <b className="block mt-1 text-[11px] text-[#071D43]">
                {target.target2030}
              </b>
            </div>
          </div>

          <p className="text-xs leading-[1.55] text-[#4C5C70]">
            <b>{target.summary}</b>
          </p>
          <p className="text-xs leading-[1.55] text-[#4C5C70]">
            {target.detail}
          </p>

          <div className="flex gap-2 items-center mt-[15px]">
            <a
              href={sourceLink(target.page)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E7F4F5] text-[#08727B] no-underline rounded-[9px] px-[11px] py-2 text-[10px] font-black hover:brightness-95 active:scale-[0.97] transition-all duration-150"
            >
              View {target.source} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
