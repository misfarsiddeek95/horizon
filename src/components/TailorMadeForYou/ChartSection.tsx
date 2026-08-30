import type { ReactNode } from "react";
import type { Exporting } from "@amcharts/amcharts5/plugins/exporting";
import ChartExportButtons from "./ChartExportButtons";

interface ChartSectionProps {
  title: string;
  exporting: Exporting | null;
  children: ReactNode;
}

export default function ChartSection({ title, exporting, children }: ChartSectionProps) {
  return (
    <section className="border-b border-brand-main/10 pb-10 mb-10 last:border-b-0">
      <div className="flex flex-col md:flex-row md:relative items-center justify-center w-full gap-3 md:gap-0 mb-6">
        <h2 className="font-heading text-3xl md:text-4xl font-normal leading-normal text-brand-main text-center">
          {title}
        </h2>
        <div className="flex items-center gap-2 md:absolute md:right-0">
          <ChartExportButtons exporting={exporting} />
        </div>
      </div>
      {children}
    </section>
  );
}
