"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import ChartContainer from "@/components/TailorMadeForYou/ChartContainer";
import "@/utils/amChartsSetup";

interface CrroLineChartProps {
  data: { h: string; low: number; high: number }[];
  axis: string;
  unit: string;
  format: "percent" | "number" | "multiple";
  accentColor: string;
}

function formatValue(value: number, format: string, unit: string): string {
  if (format === "percent") return `${value}%`;
  if (format === "multiple") return `${value}×`;
  return `${value} ${unit}`;
}

export default function CrroLineChart({
  data,
  axis,
  unit,
  format,
  accentColor,
}: CrroLineChartProps) {
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
          legendRef.setAll({
            y: undefined,
            centerY: undefined,
            x: am5.p0,
            centerX: am5.p0,
          });
        }
      },
      removing() {
        chart.set("layout", root.horizontalLayout);
        if (legendRef) {
          legendRef.setAll({
            y: am5.p50,
            centerY: am5.p50,
            x: undefined,
            centerX: undefined,
          });
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

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 60,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "h",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );

    yAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
      fill: am5.color("#667085"),
    });

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: `${axis} (${unit})`,
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 14,
        fontWeight: "bold",
        fill: am5.color("#667085"),
      })
    );

    function makeSeries(
      name: string,
      fieldName: string,
      color: am5.Color
    ) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: fieldName,
          categoryXField: "h",
          stroke: color,
          fill: color,
          tooltip: am5.Tooltip.new(root, {
            labelText: `{name}: ${formatValue(0, format, unit).replace("0", "{valueY}")}`,
          }),
        })
      );

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Circle.new(root, {
            radius: 6,
            fill: color,
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 2,
          }),
        })
      );

      series.data.setAll(data);
      series.appear();

      return series;
    }

    const lowColor = am5.color("#4A9CD6");
    const highColor = am5.color("#E8636F");

    const lowSeries = makeSeries("Low", "low", lowColor);
    const highSeries = makeSeries("High", "high", highColor);

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;
    legend.data.push(lowSeries);
    legend.data.push(highSeries);

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, axis, unit, format, accentColor]);

  return <ChartContainer ref={chartRef} />;
}
