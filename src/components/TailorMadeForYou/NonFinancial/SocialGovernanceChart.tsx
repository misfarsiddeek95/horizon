"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { socialGovernanceData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";

am5.addLicense("AM5C-0771-7551-3415-0172");

export default function SocialGovernanceChart() {
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

    const xRenderer = am5xy.AxisRendererX.new(root, { minorGridEnabled: true, minGridDistance: 50 });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, { categoryField: "year", renderer: xRenderer, tooltip: am5.Tooltip.new(root, {}) })
    );
    xRenderer.grid.template.setAll({ location: 0.5 });
    xAxis.data.setAll(socialGovernanceData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.2,
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "Rs. Mn / No.",
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
          yAxis,
          valueYField: field,
          categoryXField: "year",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name} in {categoryX}: {valueY}",
          }),
        })
      );
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
          yAxis,
          valueYField: field,
          categoryXField: "year",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name} in {categoryX}: {valueY}",
          }),
        })
      );
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

    createBarSeries("Investment in R&D (Rs. Mn)", "investment_rd", "#a5a5a5");
    createBarSeries("Investment in CSR (Rs. Mn)", "investment_csr", "#ffbf00");
    createBarSeries("Investment in suppliers (Rs. Mn)", "investment_suppliers", "#4472c4");
    createBarSeries("Total audits conducted on management systems (No.)", "total_audits", "#71ad47");

    createLineSeries("Average training hours per employee (No.)", "avg_training_hours", "#5b9cd5");
    createLineSeries("New products developed (No.)", "new_products", "#ee7d30");
    createLineSeries("Instances of environmental non-compliance (No.)", "env_non_compliance", "#5b9cd5");

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
