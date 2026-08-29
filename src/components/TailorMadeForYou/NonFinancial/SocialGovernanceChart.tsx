"use client";

import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import type * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { socialGovernanceData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";
import ChartSection from "../ChartSection";
import "@/utils/amChartsSetup";
import { setupChartExporting } from "@/utils/amChartsExporting";

export default function SocialGovernanceChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [exportingInstance, setExportingInstance] = useState<am5exporting.Exporting | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);

    const responsive = am5themes_Responsive.new(root);

    let legendRef: am5.Legend | null = null;

    responsive.addRule({
      relevant: am5themes_Responsive.widthM,
      applying() {
        chart.set("layout", root.verticalLayout);
        if (legendRef) {
          legendRef.setAll({ y: undefined, centerY: undefined, x: am5.p0, centerX: am5.p0 });
        }
      },
      removing() {
        chart.set("layout", root.horizontalLayout);
        if (legendRef) {
          legendRef.setAll({ y: am5.p50, centerY: am5.p50, x: undefined, centerX: undefined });
        }
      },
    });

    root.setThemes([am5themes_Animated.new(root), responsive]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

    const xRenderer = am5xy.AxisRendererX.new(root, { minorGridEnabled: true, minGridDistance: 50 });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, { categoryField: "year", renderer: xRenderer, tooltip: am5.Tooltip.new(root, {}) })
    );
    xRenderer.grid.template.setAll({ location: 0.5 });
    xAxis.data.setAll(socialGovernanceData);

    const yAxisBar = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 280,
        strictMinMax: true,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );

    yAxisBar.get("renderer").labels.template.setAll({ visible: false });
    yAxisBar.get("renderer").grid.template.setAll({ visible: false });

    for (let i = 0; i <= 280; i += 20) {
      const dataItem = yAxisBar.makeDataItem({ value: i });
      const range = yAxisBar.createAxisRange(dataItem);
      range.get("grid")?.setAll({ visible: true, strokeOpacity: 0.1 });
      range.get("label")?.setAll({ visible: true, text: String(i) });
    }

    yAxisBar.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "Rs. Mn",
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 14,
        fontWeight: "bold",
      })
    );

    const yAxisLine = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 240,
        strictMinMax: true,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1, opposite: true }),
      })
    );

    yAxisLine.get("renderer").labels.template.setAll({ visible: false });
    yAxisLine.get("renderer").grid.template.setAll({ visible: false });

    for (let i = 0; i <= 240; i += 20) {
      const dataItem = yAxisLine.makeDataItem({ value: i });
      const range = yAxisLine.createAxisRange(dataItem);
      range.get("grid")?.setAll({ visible: true, strokeOpacity: 0.1 });
      range.get("label")?.setAll({ visible: true, text: String(i) });
    }

    yAxisLine.children.push(
      am5.Label.new(root, {
        rotation: 90,
        text: "No.",
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 14,
        fontWeight: "bold",
      })
    );

    function createBarSeries(name: string, field: string, color: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis: yAxisBar,
          valueYField: field,
          categoryXField: "year",
          clustered: true,
        })
      );

      const tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        pointerOrientation: "horizontal",
        labelText: "{name} in {categoryX}: {valueY}",
      });

      tooltip.get("background")?.setAll({
        fill: series.get("fill"),
        fillOpacity: 0.9,
        stroke: series.get("fill"),
      });

      series.set("tooltip", tooltip);

      series.columns.template.setAll({
        tooltipY: am5.percent(10),
        fill: am5.color(color),
        stroke: am5.color(color),
      });
      series.data.setAll(socialGovernanceData);
      return series;
    }

    function createLineSeries(name: string, field: string, color: string) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis: yAxisLine,
          valueYField: field,
          categoryXField: "year",
        })
      );

      const tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        pointerOrientation: "horizontal",
        labelText: "{name} in {categoryX}: {valueY}",
      });

      tooltip.get("background")?.setAll({
        fill: series.get("stroke"),
        fillOpacity: 0.9,
        stroke: series.get("stroke"),
      });

      series.set("tooltip", tooltip);

      series.strokes.template.setAll({ strokeWidth: 3, stroke: am5.color(color) });
      series.data.setAll(socialGovernanceData);

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(color),
            strokeWidth: 3,
            stroke: am5.color(color),
          }),
        })
      );

      return series;
    }

    createBarSeries("Investment in R&D (Rs. Mn)", "investment_rd", "#225C73");
    createBarSeries("Investment in CSR (Rs. Mn)", "investment_csr", "#2198A6");
    createBarSeries("Investment in suppliers (Rs. Mn)", "investment_suppliers", "#D98C4A");

    createLineSeries("Average training hours per employee (No.)", "avg_training_hours", "#8663dc");
    createLineSeries("New products developed (No.)", "new_products", "#a554b3");
    createLineSeries("Total audits conducted on management systems (No.)", "total_audits", "#c94f9c");
    createLineSeries("Instances of environmental non-compliance (No.)", "env_non_compliance", "#e8437f");

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;
    legend.data.setAll(chart.series.values);

    setExportingInstance(setupChartExporting(root, "Social_and_Governance_Performance"));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <ChartSection title="Social and Governance Performance" exporting={exportingInstance}>
      <ChartContainer ref={chartRef} />
    </ChartSection>
  );
}
