"use client";

import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import type * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { emissionsData, energyConsumptionData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";
import ChartSection from "../ChartSection";
import "@/utils/amChartsSetup";
import { setupChartExporting } from "@/utils/amChartsExporting";
import { getChartColor, chartTokens } from "@/utils/chartColors";

const combinedData = emissionsData.map((e) => {
  const energy = energyConsumptionData.find((en) => en.year === e.year);
  return {
    year: e.year,
    total_carbon_emission: e.total_carbon_emission,
    scope_1_emission: e.scope_1_emission,
    scope_2_emission: e.scope_2_emission,
    scope_3_emission: e.scope_3_emission,
    biogenic: e.biogenic,
    renewable_energy: energy?.renewable_energy ?? 0,
    non_renewable: energy?.non_renewable ?? 0,
    total_consumption: energy?.total_consumption ?? 0,
  };
});

export default function EmissionsEnergyChart() {
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

    const xRenderer = am5xy.AxisRendererX.new(root, { minorGridEnabled: true, minGridDistance: 60 });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, { categoryField: "year", renderer: xRenderer, tooltip: am5.Tooltip.new(root, {}) })
    );
    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(combinedData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 1250000,
        strictMinMax: true,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
      })
    );

    yAxis.get("renderer").labels.template.setAll({ visible: false });
    yAxis.get("renderer").grid.template.setAll({ visible: false });

    for (let i = 0; i <= 1250000; i += 250000) {
      const dataItem = yAxis.makeDataItem({ value: i });
      const range = yAxis.createAxisRange(dataItem);

      range.get("grid")?.setAll({
        visible: true,
        strokeOpacity: 0.1,
      });

      range.get("label")?.setAll({
        visible: true,
        text: new Intl.NumberFormat("en-US").format(i),
      });
    }

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

    function createLineSeries(name: string, field: string) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis,
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

      series.data.setAll(combinedData);
      series.appear(1000);
    }

    function createBarSeries(name: string, field: string, color: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
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
      series.data.setAll(combinedData);
      return series;
    }

    createLineSeries("Total Carbon emissions (tCO2e)", "total_carbon_emission");
    createLineSeries("Scope 1 emission (tCO2e)", "scope_1_emission");
    createLineSeries("Scope 2 emission (tCO2e)", "scope_2_emission");
    createLineSeries("Scope 3 emission (tCO2e)", "scope_3_emission");
    createLineSeries("Biogenic emission (tCO2e)", "biogenic");

    createBarSeries("Renewable energy consumption (GJ)", "renewable_energy", getChartColor(chartTokens.tealBlue));
    createBarSeries("Non - renewable energy consumptions (GJ)", "non_renewable", getChartColor(chartTokens.cyanTeal));
    createBarSeries("Total energy consumption (GJ)", "total_consumption", getChartColor(chartTokens.amber));

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;
    legend.data.setAll(chart.series.values);

    legend.itemContainers.template.states.create("hover", {});

    legend.itemContainers.template.events.on("pointerover", function (e) {
      const dataContext = e.target.dataItem?.dataContext as { hover: () => void; unhover: () => void } | undefined;
      dataContext?.hover();
    });
    legend.itemContainers.template.events.on("pointerout", function (e) {
      const dataContext = e.target.dataItem?.dataContext as { hover: () => void; unhover: () => void } | undefined;
      dataContext?.unhover();
    });

    setExportingInstance(setupChartExporting(root, "Emissions_and_Energy_Consumption"));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <ChartSection title="Emissions and Energy Consumption" exporting={exportingInstance}>
      <ChartContainer ref={chartRef} />
    </ChartSection>
  );
}
