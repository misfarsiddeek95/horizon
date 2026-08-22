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
      <span className="text-xs text-content-primary/50 font-medium">Export:</span>
      {formats.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => exporting.download(type)}
          className="rounded-ui-element bg-surface-muted px-3 py-1.5 text-xs font-semibold text-content-primary ring-1 ring-content-primary/15 transition-colors hover:bg-brand-main/10 hover:text-brand-main cursor-pointer"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
