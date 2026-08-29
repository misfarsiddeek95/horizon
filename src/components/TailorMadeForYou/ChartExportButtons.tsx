"use client";

import type { Exporting } from "@amcharts/amcharts5/plugins/exporting";

interface ChartExportButtonsProps {
  exporting: Exporting | null;
}

const formats = [
  { type: "pdf" as const, label: "PDF" },
  { type: "png" as const, label: "PNG" },
  { type: "jpg" as const, label: "JPG" },
];

export default function ChartExportButtons({ exporting }: ChartExportButtonsProps) {
  if (!exporting) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="mr-2 text-sm text-v2-navy-deep">Export:</span>
      {formats.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => exporting.download(type)}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-brand-main/30 bg-white/20 text-v2-navy-deep backdrop-blur-sm transition-all duration-200 hover:bg-brand-main hover:text-content-inverse hover:shadow-md cursor-pointer"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
