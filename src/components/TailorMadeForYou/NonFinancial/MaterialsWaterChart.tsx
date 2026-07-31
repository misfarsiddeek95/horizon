"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { materialsWaterData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";
import "@/utils/amChartsSetup";

interface HoverableDataContext {
  hover: () => void;
  unhover: () => void;
}

export default function MaterialsWaterChart() {
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

    xAxis.data.setAll(materialsWaterData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, { inversed: false }),
      })
    );

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "MT / m3",
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

    function createSeries(name: string, field: string) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis,
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

      series.data.setAll(materialsWaterData);
      series.appear(1000);
    }

    createSeries("Waste water treated through treatment plants (m3)", "waste_water");
    createSeries("Water consumption (m3)", "water_consumption");
    createSeries("Solid waste generated (MT)", "solid_waste_gen");
    createSeries("Renewable raw material consumption (MT)", "renewable_raw_material");

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

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <ChartContainer ref={chartRef} />;
}
