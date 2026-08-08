"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {
  CLIMATE_CHARTS,
  COUNTRY_COLORS,
  SCENARIO_COLORS,
} from "@/data/climateCharts";
import {
  transformLineData,
  transformBarData,
  getSeriesNames,
} from "@/utils/climateChartTransform";

interface EvidenceMiniCardProps {
  chartId: string;
  title: string;
  insight: string;
  color: string;
  onClick: () => void;
  onSourcesClick?: () => void;
}

export default function EvidenceMiniCard({
  chartId,
  title,
  insight,
  color,
  onClick,
  onSourcesClick,
}: EvidenceMiniCardProps) {
  const sparklineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sparklineRef.current) return;

    const chart = CLIMATE_CHARTS[chartId];
    if (!chart) return;

    const root = am5.Root.new(sparklineRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const xyChart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.set("forceHidden", true);
    xRenderer.grid.template.set("forceHidden", true);

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.set("forceHidden", true);
    yRenderer.grid.template.set("forceHidden", true);

    if (chart.type === "groupedbar") {
      const barData = transformBarData(chart);
      const seriesNames = getSeriesNames(chart);

      const xAxis = xyChart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "segment",
          renderer: xRenderer,
        })
      );
      xAxis.data.setAll(barData);

      const yAxis = xyChart.yAxes.push(
        am5xy.ValueAxis.new(root, { renderer: yRenderer })
      );

      seriesNames.forEach((name) => {
        const series = xyChart.series.push(
          am5xy.ColumnSeries.new(root, {
            name,
            xAxis,
            yAxis,
            valueYField: name,
            categoryXField: "segment",
            clustered: true,
          })
        );
        const scenarioKey = name
          .toLowerCase()
          .replace(/\s+/g, "") as keyof typeof SCENARIO_COLORS;
        const scenarioColor =
          SCENARIO_COLORS[scenarioKey] || SCENARIO_COLORS.current;
        series.columns.template.setAll({
          fill: am5.color(scenarioColor),
          stroke: am5.color(scenarioColor),
        });
        series.data.setAll(barData);
      });
    } else {
      const lineData = transformLineData(chart);
      const seriesNames = getSeriesNames(chart);

      const xAxis = xyChart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "year",
          renderer: xRenderer,
        })
      );
      xAxis.data.setAll(lineData);

      const yAxis = xyChart.yAxes.push(
        am5xy.ValueAxis.new(root, { renderer: yRenderer })
      );

      seriesNames.forEach((name) => {
        const series = xyChart.series.push(
          am5xy.LineSeries.new(root, {
            name,
            xAxis,
            yAxis,
            valueYField: name,
            categoryXField: "year",
          })
        );
        series.strokes.template.setAll({ strokeWidth: 2 });
        const lineColor = COUNTRY_COLORS[name] || color;
        series.set("stroke", am5.color(lineColor));
        series.set("fill", am5.color(lineColor));
        series.data.setAll(lineData);
      });
    }

    xyChart.appear(600, 50);

    return () => {
      root.dispose();
    };
  }, [chartId, color]);

  return (
    <article
      className="bg-white border border-[#E2E8ED] rounded-lg p-3 space-y-2 cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderTop: `2px solid ${color}` }}
      onClick={onClick}
    >
      <h5 className="text-sm font-extrabold text-[#344257] leading-[1.3]">
        {title}
      </h5>
      <p className="text-xs text-[#4A586B] leading-[1.5]">{insight}</p>
      <div ref={sparklineRef} className="h-16 w-full" />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-extrabold text-brand-main">
          View chart &rarr;
        </span>
        {onSourcesClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSourcesClick();
            }}
            className="text-[11px] font-extrabold border border-[#D2DDE6] bg-white text-[#071D43] rounded-lg px-2 py-1 hover:bg-[#EAF5F6] hover:border-[#9FCFD2] hover:text-[#116D72] transition-colors whitespace-nowrap"
          >
            Sources
          </button>
        )}
      </div>
    </article>
  );
}
