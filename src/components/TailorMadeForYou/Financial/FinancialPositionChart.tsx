"use client";

import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import type * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { financialPositionData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";
import ChartSection from "../ChartSection";
import "@/utils/amChartsSetup";
import { setupChartExporting } from "@/utils/amChartsExporting";

interface HoverableDataContext {
  hover: () => void;
  unhover: () => void;
}

export default function FinancialPositionChart() {
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
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
        pinchZoomX: true,
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, { minorGridEnabled: true });
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({ location: 0.5, multiLocation: 0.5 });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
        snapTooltip: true,
      })
    );

    xAxis.data.setAll(financialPositionData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        min: 0,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, { inversed: false }),
      })
    );

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "Rs. Bn",
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 14,
        fontWeight: "bold",
      })
    );

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { alwaysShow: false, xAxis, positionX: 1 })
    );
    cursor.lineY.set("visible", false);
    cursor.lineX.set("focusable", true);

    function createSeries(name: string, field: string, color: string) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: "year",
          stroke: am5.color(color),
        })
      );

      const tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        pointerOrientation: "horizontal",
        labelText: "[bold]{name}[/]\n{categoryX}: {valueY}",
      });

      tooltip.get("background")?.setAll({
        fill: series.get("stroke"),
        fillOpacity: 0.9,
        stroke: series.get("stroke"),
      });

      series.set("tooltip", tooltip);

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { radius: 5, fill: am5.color(color) }),
        })
      );
      series.set("setStateOnChildren", true);
      series.states.create("hover", {});
      series.mainContainer.set("setStateOnChildren", true);
      series.mainContainer.states.create("hover", {});
      series.strokes.template.states.create("hover", { strokeWidth: 4 });

      series.data.setAll(financialPositionData);
      series.appear(1000);
    }

    createSeries("Total Assets", "total_assets", "#225C73");
    createSeries("Total liabilities", "total_liab", "#2198A6");
    createSeries("Revenue Reserves", "revenue_reserves", "#D98C4A");
    createSeries("Equity", "equity", "#D9653B");
    createSeries("Current Assets", "current_assets", "#6CB8A3");
    createSeries("Current Liabilities", "current_liabilities", "#FCDAA4");

    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal", marginBottom: 20 }));

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;

    legend.itemContainers.template.states.create("hover", {});

    legend.itemContainers.template.events.on("pointerover", function (e) {
      const dataContext = e.target.dataItem?.dataContext as HoverableDataContext | undefined;
      dataContext?.hover();
    });
    legend.itemContainers.template.events.on("pointerout", function (e) {
      const dataContext = e.target.dataItem?.dataContext as HoverableDataContext | undefined;
      dataContext?.unhover();
    });

    legend.data.setAll(chart.series.values);

    chart.plotContainer.events.on("pointerout", () => cursor.set("positionX", 1));
    chart.plotContainer.events.on("pointerover", () => cursor.set("positionX", undefined));

    setExportingInstance(setupChartExporting(root, "Financial_Position_Rs_Bn"));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <ChartSection title="Financial Position (Rs.Bn)" exporting={exportingInstance}>
      <ChartContainer ref={chartRef} />
    </ChartSection>
  );
}
