import Image from "next/image";
import type { ReactNode } from "react";
import type { Exporting } from "@amcharts/amcharts5/plugins/exporting";
import ChartExportButtons from "./ChartExportButtons";

interface ChartSectionProps {
  title: string;
  exporting: Exporting | null;
  children: ReactNode;
  mobileImage?: string;
  mobileImageAlt?: string;
}

export default function ChartSection({
  title,
  exporting,
  children,
  mobileImage,
  mobileImageAlt,
}: ChartSectionProps) {
  return (
    <section className="border-b border-brand-main/10 pb-10 mb-10 last:border-b-0">
      <div
        className={`${
          mobileImage ? "hidden md:flex" : "flex"
        } flex-col md:flex-row md:relative items-center justify-center w-full gap-3 md:gap-0 mb-6`}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-normal leading-normal text-brand-main text-center">
          {title}
        </h2>
        <div className="flex items-center gap-2 md:absolute md:right-0">
          <ChartExportButtons exporting={exporting} />
        </div>
      </div>
      {mobileImage ? (
        <>
          <div className="md:hidden">
            <Image
              src={mobileImage}
              alt={mobileImageAlt ?? `${title} chart`}
              width={1254}
              height={1254}
              sizes="(max-width: 767px) 100vw, 1px"
              className="w-full h-auto"
            />
          </div>
          <div className="hidden md:block">{children}</div>
        </>
      ) : (
        children
      )}
    </section>
  );
}
