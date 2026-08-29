"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  ArrowPathIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { mergeAndDownloadPdfs } from "@/utils/mergePdfs";
import HaycarbDocSearch from "@/components/HaycarbDocSearch";

const categories: Record<string, string[]> = {
  "Corporate Overview": [
    "pdf/tbc/Our Approach to Reporting.pdf",
    "pdf/tbc/Performance Highlights.pdf",
    "pdf/tbc/Haycarb at a Glance.pdf",
    "pdf/tbc/53 Years of Resilience , Growth and Value Creation.pdf",
    "pdf/tbc/Our Products.pdf",
    "pdf/tbc/Awards and Recognitions.pdf",
    "pdf/tbc/Chairman’s & Managing Director's Joint Statement.pdf",
    "pdf/tbc/Board of Directors.pdf",
    "pdf/tbc/Management Team.pdf",
    "pdf/tbc/Segment Review and Analysis.pdf",
    "pdf/tbc/Group Value Addition and Distribution.pdf",
  ],
  "Sustainability and Value Creation": [
    "pdf/tbc/Our Value Creation Model.pdf",
    "pdf/tbc/Our Socio-Economic Impact.pdf",
    "pdf/tbc/ACTIVATE - The Core of Value Creation.pdf",
    "pdf/tbc/Consolidated Statement on ESG Performance.pdf",
    "pdf/tbc/Exploring Nature – Related Dependencies.pdf",
    "pdf/tbc/Managing Enterprise Risks and Opportunities.pdf",
    "pdf/tbc/Managing Climate and Sustainability Related Risks and Opportunities – SLFRS S1 and S2 Disclosures.pdf",
    "pdf/tbc/Assurance Report on SLFRS S1 and S2 Disclosures.pdf",
    "pdf/tbc/Assurance Report on the Sustainability Reporting Criteria.pdf",
    "pdf/tbc/Assurance Report on the Integrated Annual Report.pdf",
    "pdf/tbc/GRI Content Index.pdf",
    "pdf/tbc/SASB  Sustainability Disclosure Index.pdf",
    "pdf/tbc/Our Contribution to the SDGs and UN Global Compact.pdf",
    "pdf/tbc/Operating Environment.pdf",
    "pdf/tbc/Our Strategic Framework - SWOT & TOWS.pdf",
    "pdf/tbc/Listening to Our Stakeholders.pdf",
    "pdf/tbc/Determining Material Topics.pdf",
    "pdf/tbc/Strategy and Resource Allocation.pdf",
    "pdf/tbc/Future Outlook.pdf",
  ],
  "Managing our Capitals": [
    "pdf/tbc/Financial Capital.pdf",
    "pdf/tbc/Natural Capital.pdf",
    "pdf/tbc/Intellectual Capital.pdf",
    "pdf/tbc/Human Capital.pdf",
    "pdf/tbc/Social & Relationship Capital.pdf",
    "pdf/tbc/Manufactured Capital.pdf",
    "pdf/tbc/Digital Capital.pdf",
  ],
  "Mindful Governance": [
    "pdf/tbc/Chairman’s Message on Corporate Governance.pdf",
    "pdf/tbc/Corporate Governance.pdf",
    "pdf/tbc/Annual Report of the Board of Directors.pdf",
    "pdf/tbc/Statement of Directors’ Responsibility.pdf",
    "pdf/tbc/Related Party Transactions Review Committee Report.pdf",
    "pdf/tbc/Audit Committee Report.pdf",
    "pdf/tbc/Remuneration Committee Report.pdf",
    "pdf/tbc/Nominations and Governance Committee Report.pdf",
    "pdf/tbc/Statement by the Senior Independent Director.pdf",
  ],
  "Financial Statements": [
    "pdf/tbc/Independent Auditor’s Report.pdf",
    "pdf/tbc/Statement of Profit or Loss.pdf",
    "pdf/tbc/Statement of Comprehensive Income.pdf",
    "pdf/tbc/Statement of Financial Position.pdf",
    "pdf/tbc/Statement of Changes in Equity-Consolidated.pdf",
    "pdf/tbc/Statement of Changes in Equity-Company.pdf",
    "pdf/tbc/Statement of Cash Flows.pdf",
    "pdf/tbc/Notes to the Consolidated Financial Statements.pdf",
  ],
  "Supplementary Information": [
    "pdf/tbc/Financial Calendar.pdf",
    "pdf/tbc/Statement of Group Value Added.pdf",
    "pdf/tbc/Ten-Year Financial Review.pdf",
    "pdf/tbc/Indicative US Dollar Financial Statements.pdf",
    "pdf/tbc/Horizontal and Vertical Analysis.pdf",
    "pdf/tbc/History of Dividends and Scrip Issues.pdf",
    "pdf/tbc/Investor Information.pdf",
    "pdf/tbc/Quarterly Analysis.pdf",
    "pdf/tbc/Group Profile.pdf",
    "pdf/tbc/Economic Landscape Country Report.pdf",
    "pdf/tbc/Glossary of Financial Terms.pdf",
    "pdf/tbc/Corporate Information.pdf",
    "pdf/tbc/Notice of Annual General Meeting.pdf",
    "pdf/tbc/Request Form for Printed Annual Report.pdf",
    "pdf/tbc/Form of Proxy.pdf",
  ],
};

function formatPdfName(path: string): string {
  return path.split("/").pop()?.replace(".pdf", "") ?? path;
}

export default function ReportGenerator() {
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);

  const toggleFile = useCallback((file: string) => {
    setSelectedPdfs((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  }, []);

  const handlePreview = useCallback((file: string) => {
    setPreviewUrl((prev) => (prev === file ? null : file));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (selectedPdfs.length === 0) return;
    setIsMerging(true);
    try {
      await mergeAndDownloadPdfs(selectedPdfs);
      setSelectedPdfs([]);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to generate report"
      );
    } finally {
      setIsMerging(false);
    }
  }, [selectedPdfs]);

  return (
    <main className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-brand-main mb-3">
            Generate Your Report
          </h1>
          <p className="text-sm sm:text-base text-content-primary/60 max-w-2xl">
            Select the sections you need from Haycarb PLC&apos;s Annual Report
            and generate a personalized PDF.
          </p>
        </div>

        <div className="mb-8 lg:mb-10">
          <HaycarbDocSearch onDownload={mergeAndDownloadPdfs} />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-2/5 min-w-0">
            <div className="bg-surface-default/80 backdrop-blur-md border border-white/50 shadow-sm rounded-ui-card p-4 sm:p-6 max-h-[40vh] lg:max-h-[calc(100vh-12rem)] overflow-y-auto">
              {Object.entries(categories).map(([category, files]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h2 className="font-heading text-base sm:text-lg text-brand-main mb-3">
                    {category}
                  </h2>
                  <div className="space-y-1.5">
                    {files.map((file) => {
                      const isSelected = selectedPdfs.includes(file);
                      const isPreviewing = previewUrl === file;
                      return (
                        <div
                          key={file}
                          className={`flex items-start gap-2 rounded-ui-element px-3 py-2 transition-colors ${
                            isPreviewing
                              ? "bg-brand-main/10"
                              : "hover:bg-surface-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFile(file)}
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-brand-main)]"
                          />
                          <button
                            type="button"
                            onClick={() => handlePreview(file)}
                            className={`text-left text-sm leading-snug break-words transition-colors cursor-pointer ${
                              isPreviewing
                                ? "text-brand-main font-semibold"
                                : "text-brand-main/80 hover:text-brand-hover hover:underline underline-offset-2"
                            }`}
                          >
                            {formatPdfName(file)}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-3/5 min-w-0">
            <div className="bg-surface-default/80 backdrop-blur-md border border-white/50 shadow-sm rounded-ui-card overflow-hidden h-[40vh] lg:h-[calc(100vh-12rem)] flex flex-col">
              {previewUrl ? (
                <>
                  <div className="flex items-center justify-between border-b border-content-primary/10 px-4 py-2.5">
                    <span className="text-xs sm:text-sm font-medium text-content-primary truncate">
                      {formatPdfName(previewUrl)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(null)}
                      className="ml-2 shrink-0 cursor-pointer rounded p-1 text-content-primary/40 hover:text-content-primary transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <iframe
                    key={previewUrl}
                    src={previewUrl}
                    className="flex-1 w-full border-0"
                    title="PDF Preview"
                  />
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center px-4">
                  <Image
                    src="/images/innerpage/own-report-default.jpeg"
                    alt="Select a PDF to preview"
                    width={600}
                    height={400}
                    className="h-auto w-full max-w-md object-contain"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-content-primary/50">
            {selectedPdfs.length === 0
              ? "No PDFs selected"
              : `${selectedPdfs.length} PDF${selectedPdfs.length !== 1 ? "s" : ""} selected`}
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={selectedPdfs.length === 0 || isMerging}
            className="inline-flex cursor-pointer items-center gap-2 rounded-ui-element bg-brand-main px-6 py-3 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isMerging ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : null}
            {isMerging ? "Generating..." : "Generate Combined PDF"}
          </button>
        </div>
      </div>
    </main>
  );
}
