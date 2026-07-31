"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { emissionsData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";
import "@/utils/amChartsSetup";

export default function EmissionsChart() {
  const chartRef = useRef<HTMLDivElement>(null);

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

    const xRenderer = am5xy.AxisRendererX.new(root, { minorGridEnabled: true, minGridDistance: 60 });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, { categoryField: "year", renderer: xRenderer, tooltip: am5.Tooltip.new(root, {}) })
    );
    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(emissionsData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "tCO2e",
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 14,
        fontWeight: "bold",
      })
    );

    function createColumnSeries(name: string, field: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: "year",
          clustered: true,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name} in {categoryX}: {valueY} {info}",
          }),
        })
      );
      series.columns.template.setAll({ tooltipY: am5.percent(10) });
      series.data.setAll(emissionsData);
      return series;
    }

    createColumnSeries("Total Carbon emissions (tCO2e)", "total_carbon_emission");
    createColumnSeries("Scope 1 emission (tCO2e)", "scope_1_emission");
    createColumnSeries("Scope 2 emission (tCO2e)", "scope_2_emission");
    createColumnSeries("Scope 3 emission (tCO2e)", "scope_3_emission");
    createColumnSeries("Biogenic emission (tCO2e)", "biogenic");

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;
    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <ChartContainer ref={chartRef} />;
}
