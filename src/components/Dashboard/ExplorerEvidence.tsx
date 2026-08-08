"use client";

import { useState } from "react";
import { CLIMATE_CHARTS } from "@/data/climateCharts";
import EvidenceMiniCard from "./EvidenceMiniCard";
import ClimateChartModal from "./ClimateChartModal";
import SourceModal from "./SourceModal";

interface ExplorerEvidenceProps {
  evidence: { id: string; title: string; insight: string }[];
  color: string;
}

export default function ExplorerEvidence({
  evidence,
  color,
}: ExplorerEvidenceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [selectedSourceKey, setSelectedSourceKey] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    if (CLIMATE_CHARTS[id]) {
      setSelectedChartId(id);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8ED] rounded-[11px] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-brand-main px-4 py-3 flex items-center justify-between gap-3 hover:brightness-110 transition-all duration-200"
      >
        <div className="text-left">
          <div className="text-sm font-extrabold text-white">
            Supporting climate-resilience evidence
          </div>
          <div className="text-xs text-white/70 mt-0.5">
            {evidence.length} supporting evidence{" "}
            {evidence.length === 1 ? "source" : "sources"} &middot; Expand to
            explore the underlying climate, feedstock and market context.
          </div>
        </div>
        <span
          className={`text-lg text-white transition-transform duration-200 ease-in-out shrink-0 ${isOpen ? "rotate-90" : ""}`}
        >
          &#9654;
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {evidence.map((item) => (
                <EvidenceMiniCard
                  key={item.id}
                  chartId={item.id}
                  title={item.title}
                  insight={item.insight}
                  color={color}
                  onClick={() => handleCardClick(item.id)}
                  onSourcesClick={() => setSelectedSourceKey(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedChartId && (
        <ClimateChartModal
          chartId={selectedChartId}
          onClose={() => setSelectedChartId(null)}
        />
      )}

      {selectedSourceKey && (
        <SourceModal
          sourceKey={selectedSourceKey}
          onClose={() => setSelectedSourceKey(null)}
        />
      )}
    </div>
  );
}
