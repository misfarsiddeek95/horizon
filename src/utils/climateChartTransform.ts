import type { ClimateChartData } from "@/data/climateCharts";

export interface TransformedLinePoint {
  year: string;
  [key: string]: string | number;
}

export interface TransformedBarPoint {
  segment: string;
  [key: string]: string | number;
}

export function transformLineData(
  chart: ClimateChartData
): TransformedLinePoint[] {
  if (!chart.years || !chart.series) return [];
  const seriesKeys = Object.keys(chart.series);
  return chart.years.map((year, i) => {
    const point: TransformedLinePoint = { year: String(year) };
    for (const key of seriesKeys) {
      point[key] = chart.series![key][i] ?? 0;
    }
    return point;
  });
}

export function transformBarData(
  chart: ClimateChartData
): TransformedBarPoint[] {
  if (!chart.segments) return [];
  return chart.segments.map((seg) => ({
    segment: seg.segment,
    "Net Zero": seg.netZero,
    "Current Pathway": seg.current,
    Divergence: seg.divergence,
  }));
}

export function getSeriesNames(chart: ClimateChartData): string[] {
  if (chart.type === "groupedbar") {
    return ["Net Zero", "Current Pathway", "Divergence"];
  }
  return Object.keys(chart.series ?? {});
}
