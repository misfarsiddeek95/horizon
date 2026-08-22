"use client";

import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import type * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { financialRatiosData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";
import ChartExportButtons from "../ChartExportButtons";
import "@/utils/amChartsSetup";
import { setupChartExporting } from "@/utils/amChartsExporting";

interface HoverableDataContext {
  hover: () => void;
  unhover: () => void;
}

export default function FinancialRatiosChart() {
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

    chart.children.unshift(
      am5.Label.new(root, {
        text: "Financial Ratios",
        fontSize: 26,
        fontFamily: "Minion Pro, serif",
        fill: am5.color(0x147385),
        x: am5.p50,
        centerX: am5.p50,
        paddingTop: 10,
        paddingBottom: 10,
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

    xAxis.data.setAll(financialRatiosData);

    const yAxisPercent = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        min: 0,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, { inversed: false }),
      })
    );

    yAxisPercent.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "%",
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 14,
        fontWeight: "bold",
      })
    );

    const yAxisRatio = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 1,
        min: 0,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, { inversed: false, opposite: true }),
      })
    );

    yAxisRatio.children.push(
      am5.Label.new(root, {
        rotation: 90,
        text: "Time",
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

    function createPercentSeries(name: string, field: string) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis: yAxisPercent,
          valueYField: field,
          categoryXField: "year",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryX}: {valueY}%",
          }),
        })
      );

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { radius: 5, fill: series.get("fill") }),
        })
      );
      series.set("setStateOnChildren", true);
      series.states.create("hover", {});
      series.mainContainer.set("setStateOnChildren", true);
      series.mainContainer.states.create("hover", {});
      series.strokes.template.states.create("hover", { strokeWidth: 4 });

      series.data.setAll(financialRatiosData);
      series.appear(1000);
    }

    function createRatioSeries(name: string, field: string) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis: yAxisRatio,
          valueYField: field,
          categoryXField: "year",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryX}: {valueY}",
          }),
        })
      );

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { radius: 5, fill: series.get("fill") }),
        })
      );
      series.set("setStateOnChildren", true);
      series.states.create("hover", {});
      series.mainContainer.set("setStateOnChildren", true);
      series.mainContainer.states.create("hover", {});
      series.strokes.template.states.create("hover", { strokeWidth: 4 });

      series.data.setAll(financialRatiosData);
      series.appear(1000);
    }

    createPercentSeries("Profit before tax margin", "profit_before_tax_margin");
    createPercentSeries("Return on equity", "return_on_equity");
    createPercentSeries("Return on assets", "return_on_assets");
    createPercentSeries("Gearing", "gearing");
    createPercentSeries("Interest cover", "interest_cover");
    createRatioSeries("Asset turnover", "asset_turnover");
    createRatioSeries("Current ratio", "current_ratio");

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

    setExportingInstance(setupChartExporting(root, "Financial_Ratios"));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <ChartExportButtons exporting={exportingInstance} />
      </div>
      <ChartContainer ref={chartRef} />
    </div>
  );
}
