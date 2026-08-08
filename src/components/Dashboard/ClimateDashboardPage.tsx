"use client";

import { useState, useMemo } from "react";
import { CRROS } from "@/data/climateDashboard";
import ClimateTabs from "./ClimateTabs";
import CrroSelectionCard from "./CrroSelectionCard";
import CrroSection from "./CrroSection";

export default function ClimateDashboardPage() {
  const [activeCategory, setActiveCategory] = useState("risks");
  const [selectedCrroId, setSelectedCrroId] = useState<string>("CRRO 1");

  const filteredCrros = useMemo(
    () =>
      CRROS.filter((crro) =>
        activeCategory === "risks"
          ? crro.classification === "Risk"
          : crro.classification === "Opportunity"
      ),
    [activeCategory]
  );

  const effectiveSelectedId = useMemo(() => {
    if (filteredCrros.some((c) => c.id === selectedCrroId)) {
      return selectedCrroId;
    }
    return filteredCrros[0]?.id ?? "CRRO 1";
  }, [filteredCrros, selectedCrroId]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const firstInCategory = CRROS.find((c) =>
      category === "risks"
        ? c.classification === "Risk"
        : c.classification === "Opportunity"
    );
    if (firstInCategory) {
      setSelectedCrroId(firstInCategory.id);
    }
  };

  const selectedCrro = CRROS.find((c) => c.id === effectiveSelectedId);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 mb-6">
        <div>
          <h2 className="font-heading text-brand-main text-[40px] leading-[1.05] tracking-[-0.035em]">
            Climate Risk, Opportunity &amp; Resilience
          </h2>
          <p className="text-[#41516A] text-base mt-2">
            Analysis of climate-related risks and opportunities across Haycarb&apos;s
            operations and value chain, aligned with TCFD recommendations.
          </p>
        </div>
        <a
          href="https://www.haycarb.com/wp-content/uploads/2026/07/Sustainability-Impact-Report-July.2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#D2DDE6] bg-white text-[#071D43] rounded-lg px-3 py-2 text-xs font-extrabold hover:bg-[#F2F6F8] transition-colors whitespace-nowrap shrink-0"
        >
          ESG Impact Report ↗
        </a>
      </div>

      <ClimateTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {filteredCrros.map((crro) => (
          <CrroSelectionCard
            key={crro.id}
            crro={crro}
            isActive={crro.id === effectiveSelectedId}
            onSelect={() => setSelectedCrroId(crro.id)}
          />
        ))}
      </div>

      {selectedCrro && (
        <div className="mt-8">
          <CrroSection key={selectedCrro.id} crro={selectedCrro} />
        </div>
      )}
    </div>
  );
}
