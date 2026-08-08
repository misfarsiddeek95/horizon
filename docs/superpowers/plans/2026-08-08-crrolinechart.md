# CrroLineChart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable amCharts line chart component for the Climate Dashboard that renders short-term (ST), medium-term (MT), and long-term (LT) data as two line series (low/high values) with responsive layout.

**Architecture:** Follow existing amCharts patterns in the codebase: use `ChartContainer` for sizing, amCharts 5 with XY chart, category axis for time periods, and two line series. The component will be client-side only and accept data, unit, format, and accent color props.

**Tech Stack:** React 19, TypeScript, amCharts 5, Tailwind CSS v4 (for utility classes via ChartContainer), Next.js App Router.

## Global Constraints

- Use TypeScript strict mode, no `any` types.
- Follow existing code style: no comments, concise naming.
- Use the semantic design tokens where possible (though ChartContainer uses raw Tailwind classes, which is acceptable as per exceptions).
- All styling in the component itself should rely on ChartContainer for layout; no additional styling needed.
- Must pass `npx tsc --noEmit --strict` on the created file.

---

### Task 1: Create CrroLineChart component

**Files:**
- Create: `src/components/Dashboard/CrroLineChart.tsx`

**Interfaces:**
- Consumes: `ChartContainer` from `@/components/TailorMadeForYou/ChartContainer`
- Produces: `CrroLineChart` component with props: `data`, `unit`, `format`, `accentColor`

- [ ] **Step 1: Write the failing test**

No test file required for this task (component is visual, no unit logic). However, we can create a simple smoke test to ensure the component renders without crashing. But the spec doesn't require tests. We'll skip test steps and move to implementation.

- [ ] **Step 2: Create the component file**

```tsx
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
          tensionX: 0.8,
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

    const lowColor = am5.color(accentColor);
    const highColor = am5.color(accentColor).brighten(-0.2);

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
  }, [data, unit, format, accentColor]);

  return <ChartContainer ref={chartRef} />;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/CrroLineChart.tsx`
Expected: No errors (other component imports will fail until created)

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/CrroLineChart.tsx
git commit -m "feat: add CrroLineChart component for Climate Dashboard"
```

---

## Self-Review

1. **Spec coverage:** The spec only requires creating the component file and verifying TypeScript compiles. Both are covered in Task 1.
2. **Placeholder scan:** No placeholders; all code is fully provided.
3. **Type consistency:** The component uses the exact types from the brief. No inconsistencies.

The plan is complete.