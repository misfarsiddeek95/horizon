"use client";

import { useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import FloatingAIButton from "@/components/FloatingAIButton";
import SectionCard from "./SectionCard";
import ImageModal from "./ImageModal";
import ValueCreationSection from "./ValueCreation/ValueCreationSection";
import VisualPlaceholder from "./VisualPlaceholder";
import {
  financialDataImages,
  financialDataRatios,
  financialSections,
  nonFinancialSections,
  quickLinks,
  type ActiveImage,
} from "./data";

const tabs = [
  { id: "financial", label: "Financial" },
  { id: "nonfinancial", label: "Non-Financial" },
];

export default function FinancialReviewPage() {
  const [view, setView] = useState("financial");
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);

  return (
    <InnerPageLayout
      title="Financial & Non-Financial Review"
      description="Explore Haycarb’s financial performance and non-financial value creation through a connected, visual review of the year."
      tabs={tabs}
      activeTab={view}
      onTabChange={setView}
      backgroundImage="/images/innerpage/tailer-made-for-you-banner.jpg"
    >
      {view === "financial" ? (
        <div className="grid gap-11">
          {financialSections.map((section) => (
            <SectionCard
              key={section.id}
              heading={section.heading}
              reference={section.reference}
              description={section.description}
              visuals={section.visuals}
              actions={section.actions}
              onVisualSelect={setActiveImage}
            />
          ))}

          <section className="border-t border-v2-border pt-7">
            <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <h2 className="font-heading text-[clamp(30px,3.2vw,44px)] leading-[1.05] text-[#143b53]">
                Supplementary Information
              </h2>
              <p className="font-sans text-[13px] leading-relaxed text-[#5f747e]">
                Quick links to the relevant sections of the PDF report.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex min-h-[112px] items-center justify-between gap-3 overflow-hidden rounded-[17px_17px_17px_6px] border border-[#d9e4e5] bg-white/85 p-[17px] text-[#11384f] shadow-[0_8px_22px_rgba(25,69,73,.025)] transition-colors duration-300 hover:border-[#8fc9c3] hover:bg-white"
                >
                  <span className="absolute inset-x-0 top-0 h-[3px] bg-v2-accent opacity-25 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="flex items-start gap-2.5">
                    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[12px_12px_12px_4px] bg-gradient-to-br from-[#62b86b] to-[#137b72] text-[8px] font-black text-white">
                      PDF
                    </span>
                    <span className="font-sans">
                      <span className="block text-[13px] font-bold leading-[1.3]">
                        {link.title}
                      </span>
                      <span className="mt-1 block text-[10px] text-[#7a8d94]">
                        {link.page}
                      </span>
                    </span>
                  </span>
                  <span className="text-v2-accent-text transition-transform duration-300 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="border-t border-v2-border pt-7">
            <h2 className="font-heading mb-6 text-[clamp(30px,3.2vw,44px)] leading-[1.05] text-[#143b53]">
              Financial Data
            </h2>
            <div className="grid gap-9">
              {financialDataImages.map((block) => (
                <div key={block.title}>
                  <h4 className="font-heading mb-3 text-2xl leading-[1.15] text-[#143b53]">
                    {block.title}
                  </h4>
                  <VisualPlaceholder
                    label={block.label}
                    variant={block.variant}
                    size="data"
                    dimensions={block.dimensions}
                    onSelect={setActiveImage}
                  />
                </div>
              ))}
              <div>
                <h4 className="font-heading mb-3 text-2xl leading-[1.15] text-[#143b53]">
                  Financial Ratios
                </h4>
                <div className="grid grid-cols-1 border-y border-v2-border sm:grid-cols-2 lg:grid-cols-5">
                  {financialDataRatios.map((column) => (
                    <div
                      key={column.title}
                      className="border-b border-v2-border-light py-5 pr-4 last:border-b-0 lg:border-b-0 lg:border-r lg:pl-4 lg:first:pl-0 lg:last:border-r-0"
                    >
                      <h5 className="font-sans mb-3 min-h-[30px] text-[10px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-[#143b53]">
                        {column.title}
                      </h5>
                      {column.items.map((item) => (
                        <div
                          key={item.label}
                          className="border-t border-v2-border-light py-3 first:border-t-0"
                        >
                          <strong className="font-sans block text-[26px] font-semibold leading-none tracking-[-0.035em] text-v2-accent-dark">
                            {item.value}
                          </strong>
                          <span className="mt-1.5 block text-[10px] leading-[1.35] text-[#72848b]">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-11">
          <ValueCreationSection />
          {nonFinancialSections.map((section) => (
            <SectionCard
              key={section.id}
              heading={section.heading}
              reference={section.reference}
              description={section.description}
              visuals={section.visuals}
              actions={section.actions}
              onVisualSelect={setActiveImage}
            />
          ))}
        </div>
      )}

      <ImageModal active={activeImage} onClose={() => setActiveImage(null)} />
      <FloatingAIButton />
    </InnerPageLayout>
  );
}
