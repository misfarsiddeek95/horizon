"use client";

import { useEffect, useRef, useCallback } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import ChartContainer from "@/components/TailorMadeForYou/ChartContainer";
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
import "@/utils/amChartsSetup";

interface ClimateChartModalProps {
  chartId: string;
  onClose: () => void;
}

export default function ClimateChartModal({
  chartId,
  onClose,
}: ClimateChartModalProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = CLIMATE_CHARTS[chartId];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!chartRef.current || !chart) return;

    const root = am5.Root.new(chartRef.current);

    const responsive = am5themes_Responsive.new(root);

    let legendRef: am5.Legend | null = null;

    responsive.addRule({
      relevant: am5themes_Responsive.widthM,
      applying() {
        xyChart.set("layout", root.verticalLayout);
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
        xyChart.set("layout", root.horizontalLayout);
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

    const xyChart = root.container.children.push(
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

    const isBar = chart.type === "groupedbar";
    const categoryField = isBar ? "segment" : "year";

    const xAxis = xyChart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xRenderer.grid.template.setAll({ location: 1 });

    const yAxis = xyChart.yAxes.push(
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
        text: chart.unit,
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 14,
        fontWeight: "bold",
        fill: am5.color("#667085"),
      })
    );

    if (isBar) {
      const barData = transformBarData(chart);
      xAxis.data.setAll(barData);

      const seriesNames = getSeriesNames(chart);
      const scenarioKeys: Record<string, string> = {
        "Net Zero": "netZero",
        "Current Pathway": "current",
        Divergence: "divergence",
      };

      seriesNames.forEach((name) => {
        const series = xyChart.series.push(
          am5xy.ColumnSeries.new(root, {
            name,
            xAxis,
            yAxis,
            valueYField: name,
            categoryXField: categoryField,
            fill: am5.color(SCENARIO_COLORS[scenarioKeys[name]]),
            stroke: am5.color(SCENARIO_COLORS[scenarioKeys[name]]),
            tooltip: am5.Tooltip.new(root, {
              labelText: `{name}: {valueY}`,
            }),
          })
        );

        series.columns.template.setAll({
          width: am5.percent(80),
          cornerRadiusTL: 4,
          cornerRadiusTR: 4,
        });

        series.data.setAll(barData);
        series.appear();
      });
    } else {
      const lineData = transformLineData(chart);
      xAxis.data.setAll(lineData);

      if (chart.bands && chart.bands.length > 0) {
        chart.bands.forEach((band) => {
          const isProjected = band.label.includes("Projected");
          const rangeDataItem = xAxis.makeDataItem({
            category: String(band.start),
            endCategory: String(band.end),
          });
          const range = xAxis.createAxisRange(rangeDataItem);
          range.get("axisFill")?.setAll({
            fill: am5.color(isProjected ? "#E9DDD7" : "#BFE5E5"),
            fillOpacity: 0.6,
            visible: true,
          });
          range.get("grid")?.set("forceHidden", true);
        });
      }

      const seriesNames = getSeriesNames(chart);
      const projectionStart = chart.projectionStart
        ? String(chart.projectionStart)
        : null;

      seriesNames.forEach((name) => {
        const colorHex = COUNTRY_COLORS[name] || "#667085";
        const seriesColor = am5.color(colorHex);

        if (projectionStart) {
          const historicalData = lineData.filter(
            (d) => Number(d.year) <= Number(projectionStart)
          );
          const projectedData = lineData.filter(
            (d) => Number(d.year) >= Number(projectionStart)
          );

          const historicalSeries = xyChart.series.push(
            am5xy.LineSeries.new(root, {
              name: `${name} (Historical)`,
              xAxis,
              yAxis,
              valueYField: name,
              categoryXField: "year",
              stroke: seriesColor,
              fill: seriesColor,
              tooltip: am5.Tooltip.new(root, {
                labelText: `${name}: {valueY}`,
              }),
            })
          );
          historicalSeries.bullets.push(() =>
            am5.Bullet.new(root, {
              locationY: 0,
              sprite: am5.Circle.new(root, {
                radius: 5,
                fill: seriesColor,
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
              }),
            })
          );
          historicalSeries.data.setAll(historicalData);
          historicalSeries.appear();

          const projectedSeries = xyChart.series.push(
            am5xy.LineSeries.new(root, {
              name: `${name} (Projected)`,
              xAxis,
              yAxis,
              valueYField: name,
              categoryXField: "year",
              stroke: seriesColor,
              fill: seriesColor,
              tooltip: am5.Tooltip.new(root, {
                labelText: `${name}: {valueY}`,
              }),
            })
          );
          projectedSeries.strokes.template.setAll({
            strokeDasharray: [6, 5],
          });
          projectedSeries.bullets.push(() =>
            am5.Bullet.new(root, {
              locationY: 0,
              sprite: am5.Circle.new(root, {
                radius: 4,
                fill: seriesColor,
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
              }),
            })
          );
          projectedSeries.data.setAll(projectedData);
          projectedSeries.appear();
        } else {
          const series = xyChart.series.push(
            am5xy.LineSeries.new(root, {
              name,
              xAxis,
              yAxis,
              valueYField: name,
              categoryXField: "year",
              stroke: seriesColor,
              fill: seriesColor,
              tooltip: am5.Tooltip.new(root, {
                labelText: `{name}: {valueY}`,
              }),
            })
          );
          series.bullets.push(() =>
            am5.Bullet.new(root, {
              locationY: 0,
              sprite: am5.Circle.new(root, {
                radius: 5,
                fill: seriesColor,
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
              }),
            })
          );
          series.data.setAll(lineData);
          series.appear();
        }
      });

      if (projectionStart) {
        const separatorItem = xAxis.makeDataItem({
          category: projectionStart,
        });
        const separatorRange = xAxis.createAxisRange(separatorItem);

        separatorRange.get("grid")?.setAll({
          stroke: am5.color("#7C3AED"),
          strokeDasharray: [4, 4],
          strokeWidth: 2,
          strokeOpacity: 0.7,
          location: 0,
        });

        const historicalLabel = separatorItem.get("label");
        if (historicalLabel) {
          historicalLabel.setAll({
            text: "Historical",
            fontSize: 10,
            fontWeight: "bold",
            fill: am5.color("#7C3AED"),
            y: -8,
            centerX: am5.p100,
            dx: -5,
          });
        }

        const projectedLabel = xAxis.createAxisRange(
          xAxis.makeDataItem({ category: projectionStart })
        );
        const projectedLbl = projectedLabel.get("label");
        if (projectedLbl) {
          projectedLbl.setAll({
            text: "Projected",
            fontSize: 10,
            fontWeight: "bold",
            fill: am5.color("#7C3AED"),
            y: -8,
            centerX: am5.p0,
            dx: 5,
          });
          projectedLabel.get("grid")?.set("forceHidden", true);
        }
      }
    }

    const legend = xyChart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;
    legend.data.pushAll(xyChart.series.values);

    xyChart.set("cursor", am5xy.XYCursor.new(root, {}));

    xyChart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chart]);

  if (!chart) return null;

  const isSignalChart = chartId === "rainfall" || chartId === "enso";
  const hasProjection = !!chart.projectionStart;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chart-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8ED] flex items-start justify-between gap-4">
          <div>
            <h2
              id="chart-modal-title"
              className="font-heading text-lg font-bold text-[#071D43] m-0"
            >
              {chart.title}
            </h2>
            <p className="text-sm text-[#667085] mt-0.5 m-0">
              {chart.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg hover:bg-[#F2F6F8] transition-colors text-[#667085]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 flex-1 min-h-[400px]">
          <ChartContainer ref={chartRef} />
        </div>

        <div className="px-6 pb-4 space-y-3">
          {isSignalChart && (
            <div className="border-l-4 border-[#168E95] bg-[#F0FAF9] rounded-r-lg p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#168E95] mb-1">
                Signal Note
              </div>
              <p className="text-xs text-[#4A586B] leading-[1.5] m-0">
                These are climate signals, not direct measurements. They
                represent modelled projections based on historical patterns and
                climate scenario data.
              </p>
            </div>
          )}

          {hasProjection && (
            <div className="border-l-4 border-[#7C3AED] bg-[#F5F0FF] rounded-r-lg p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#7C3AED] mb-1">
                Projection Note
              </div>
              <p className="text-xs text-[#4A586B] leading-[1.5] m-0">
                Projected values are modelled outcomes based on SSP scenarios and
                should not be treated as deterministic forecasts. Dashed lines
                indicate projected data beyond the observation period.
              </p>
            </div>
          )}

          {chart.insight && (
            <div className="border-l-4 border-[#D2DDE6] bg-[#F5F8FB] rounded-r-lg p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#667085] mb-1">
                Insight
              </div>
              <p className="text-xs text-[#4A586B] leading-[1.5] m-0">
                {chart.insight}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
