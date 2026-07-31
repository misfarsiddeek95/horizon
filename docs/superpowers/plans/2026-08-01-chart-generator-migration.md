# Chart Generator Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Chart Generator feature from the legacy haycarb project to the current horizon project, creating a new `/tailor-made-for-you` route with amCharts 5 charts.

**Architecture:** Shared `useAmChart` hook eliminates boilerplate duplication across 6 chart components. Two-level WCAG-compliant tab system. Centralized chart data in a single file. All styling uses Tailwind v4 tokens.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, amCharts 5, TypeScript strict

## Global Constraints

- No comments in production code unless explicitly asked
- No `any` types — TypeScript strict mode
- All styling via Tailwind CSS utilities matching existing project tokens
- No Git commands (no staging, committing, pushing)
- Build must pass with zero TypeScript errors and zero lint warnings
- amCharts license: `AM5C-0771-7551-3415-0172`
- All chart data hardcoded inline (no API calls)

---

## File Map

| File | Purpose |
|------|---------|
| `src/app/(ui)/tailor-made-for-you/page.tsx` | Server Component, exports metadata |
| `src/components/TailorMadeForYou/TailorMadeForYouPage.tsx` | Client Component, main orchestrator |
| `src/components/TailorMadeForYou/HeroBanner.tsx` | Minimal banner with title + description |
| `src/components/TailorMadeForYou/TabController.tsx` | WCAG-compliant main tabs |
| `src/components/TailorMadeForYou/ChartTypeTabs.tsx` | Financial / Non-financial sub-tabs |
| `src/components/TailorMadeForYou/ChartContainer.tsx` | Shared responsive chart wrapper |
| `src/components/TailorMadeForYou/useAmChart.ts` | Shared hook: Root, themes, cleanup |
| `src/components/TailorMadeForYou/Financial/ProfitabilityChart.tsx` | Column chart |
| `src/components/TailorMadeForYou/Financial/FinancialPositionChart.tsx` | Line chart |
| `src/components/TailorMadeForYou/NonFinancial/EmissionsChart.tsx` | Column chart |
| `src/components/TailorMadeForYou/NonFinancial/EnergyConsumptionChart.tsx` | Line chart |
| `src/components/TailorMadeForYou/NonFinancial/MaterialsWaterChart.tsx` | Line chart |
| `src/components/TailorMadeForYou/NonFinancial/SocialGovernanceChart.tsx` | Mixed column + line |
| `src/data/chartData.ts` | All 6 data sets centralized |
| `src/styles/tokens/colors.css` | Add chart color tokens |

---

### Task 1: Install amCharts dependency

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: None
- Produces: `@amcharts/amcharts5` available for import

- [ ] **Step 1: Install amCharts 5**

Run: `pnpm add @amcharts/amcharts5`

Expected: `@amcharts/amcharts5` added to dependencies in package.json

- [ ] **Step 2: Verify installation**

Run: `ls node_modules/@amcharts/amcharts5`

Expected: Directory exists with package files

---

### Task 2: Add chart color tokens to colors.css

**Files:**
- Modify: `src/styles/tokens/colors.css`

**Interfaces:**
- Consumes: None
- Produces: Chart color utilities (`bg-chart-blue`, `text-chart-green`, etc.)

- [ ] **Step 1: Add chart color tokens**

Edit `src/styles/tokens/colors.css` to add the following inside the `@theme` block, after the accent colors section:

```css
  /* --- CHART SERIES COLORS --- */
  --color-chart-blue: oklch(0.55 0.15 255);
  --color-chart-green: oklch(0.65 0.18 130);
  --color-chart-gold: oklch(0.85 0.17 85);
  --color-chart-gray: oklch(0.72 0.02 260);
  --color-chart-orange: oklch(0.68 0.17 50);
  --color-chart-teal: oklch(0.62 0.12 230);
```

- [ ] **Step 2: Verify tokens compile**

Run: `pnpm build 2>&1 | head -20`

Expected: Build starts without CSS compilation errors (may fail later due to missing components, but CSS should be valid)

---

### Task 3: Create centralized chart data file

**Files:**
- Create: `src/data/chartData.ts`

**Interfaces:**
- Consumes: None
- Produces: `profitabilityData`, `financialPositionData`, `emissionsData`, `energyConsumptionData`, `materialsWaterData`, `socialGovernanceData`

- [ ] **Step 1: Create chartData.ts with all 6 data sets**

```typescript
export const profitabilityData = [
  { year: "2021", group_turnover: 25, profit_before_tax: 4, group_tax: 1, profit_after_tax: 4, profit_attr: 3, dividends: 1 },
  { year: "2022", group_turnover: 33, profit_before_tax: 5, group_tax: 1, profit_after_tax: 4, profit_attr: 3, dividends: 1 },
  { year: "2023", group_turnover: 61, profit_before_tax: 8, group_tax: 2, profit_after_tax: 7, profit_attr: 6, dividends: 2 },
  { year: "2024", group_turnover: 43, profit_before_tax: 6, group_tax: 2, profit_after_tax: 4, profit_attr: 4, dividends: 2 },
  { year: "2025", group_turnover: 43, profit_before_tax: 6, group_tax: 1, profit_after_tax: 4, profit_attr: 4, dividends: 1 },
];

export const financialPositionData = [
  { year: "2021", total_assets: 25, total_liab: 10.24, revenue_reserves: 12, equity: 15, current_assets: 16, current_liabilities: 9 },
  { year: "2022", total_assets: 40, total_liab: 19.19, revenue_reserves: 17, equity: 21, current_assets: 29, current_liabilities: 17 },
  { year: "2023", total_assets: 40, total_liab: 14.98, revenue_reserves: 21, equity: 25, current_assets: 27, current_liabilities: 13 },
  { year: "2024", total_assets: 40, total_liab: 14.52, revenue_reserves: 22, equity: 26, current_assets: 26, current_liabilities: 12 },
  { year: "2025", total_assets: 46, total_liab: 16.22, revenue_reserves: 25, equity: 30, current_assets: 28, current_liabilities: 11 },
];

export const emissionsData = [
  { year: "2023", total_carbon_emission: 28396, scope_1_emission: 12622, scope_2_emission: 13330, scope_3_emission: 2444, biogenic: 41305 },
  { year: "2024", total_carbon_emission: 26696, scope_1_emission: 10903, scope_2_emission: 13485, scope_3_emission: 2308, biogenic: 48658 },
  { year: "2025", total_carbon_emission: 44554, scope_1_emission: 13741, scope_2_emission: 14356, scope_3_emission: 16457, biogenic: 31429 },
];

export const energyConsumptionData = [
  { year: "2023", renewable_energy: 942301, non_renewable: 265139, total_consumption: 1207440 },
  { year: "2024", renewable_energy: 885612, non_renewable: 247352, total_consumption: 1132964 },
  { year: "2025", renewable_energy: 850874, non_renewable: 290821, total_consumption: 1141695 },
];

export const materialsWaterData = [
  { year: "2023", waste_water: 196918, water_consumption: 649683, solid_waste_gen: 6589, renewable_raw_material: 158885 },
  { year: "2024", waste_water: 241465, water_consumption: 732634, solid_waste_gen: 5503, renewable_raw_material: 152221 },
  { year: "2025", waste_water: 321433, water_consumption: 696595, solid_waste_gen: 5112, renewable_raw_material: 146563 },
];

export const socialGovernanceData = [
  { year: "2021", avg_training_hours: 8.9, new_products: 16, investment_rd: 187, investment_csr: 40.2, investment_suppliers: 6.0, total_audits: 55, env_non_compliance: 0 },
  { year: "2022", avg_training_hours: 12.1, new_products: 14, investment_rd: 231, investment_csr: 40.8, investment_suppliers: 2.5, total_audits: 59, env_non_compliance: 0 },
  { year: "2023", avg_training_hours: 17.3, new_products: 16, investment_rd: 209, investment_csr: 50.4, investment_suppliers: 20.6, total_audits: 108, env_non_compliance: 0 },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/data/chartData.ts`

Expected: No errors

---

### Task 4: Create useAmChart shared hook

**Files:**
- Create: `src/components/TailorMadeForYou/useAmChart.ts`

**Interfaces:**
- Consumes: `@amcharts/amcharts5`, `@amcharts/amcharts5/xy`, themes
- Produces: `useAmChart(containerRef, options)` returning `{ root, chart }`

- [ ] **Step 1: Create useAmChart.ts**

```typescript
import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";

am5.addLicense("AM5C-0771-7551-3415-0172");

interface UseAmChartOptions {
  panX?: boolean;
  panY?: boolean;
  wheelX?: string;
  wheelY?: string;
  pinchZoomX?: boolean;
  layout?: "vertical" | "horizontal";
}

interface UseAmChartReturn {
  root: am5.Root;
  chart: am5xy.XYChart;
  legend: am5.Legend;
}

export function useAmChart(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseAmChartOptions = {}
): UseAmChartReturn | null {
  const resultRef = useRef<UseAmChartReturn | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const root = am5.Root.new(containerRef.current);

    const responsive = am5themes_Responsive.new(root);

    const chartRef = { current: null as am5xy.XYChart | null };
    const legendRef = { current: null as am5.Legend | null };

    responsive.addRule({
      relevant: am5themes_Responsive.widthM,
      applying() {
        if (chartRef.current) {
          chartRef.current.set("layout", root.verticalLayout);
        }
        if (legendRef.current) {
          legendRef.current.setAll({
            y: undefined,
            centerY: undefined,
            x: am5.p0,
            centerX: am5.p0,
          });
        }
      },
      removing() {
        if (chartRef.current) {
          chartRef.current.set("layout", root.horizontalLayout);
        }
        if (legendRef.current) {
          legendRef.current.setAll({
            y: am5.p50,
            centerY: am5.p50,
            x: undefined,
            centerX: undefined,
          });
        }
      },
    });

    root.setThemes([am5themes_Animated.new(root), responsive]);

    const defaultLayout = options.layout === "horizontal"
      ? root.horizontalLayout
      : root.verticalLayout;

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: options.panX ?? false,
        panY: options.panY ?? false,
        wheelX: (options.wheelX as typeof am5xy.XYChart.prototype.get "wheelX") ?? "panX",
        wheelY: (options.wheelY as typeof am5xy.XYChart.prototype.get "wheelY") ?? "zoomX",
        pinchZoomX: options.pinchZoomX ?? false,
        paddingLeft: 0,
        layout: defaultLayout,
      })
    );

    chartRef.current = chart;

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    legendRef.current = legend;

    resultRef.current = { root, chart, legend };

    return () => {
      root.dispose();
    };
  }, []);

  return resultRef.current;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/useAmChart.ts`

Expected: No errors (ignore missing module errors for amcharts since it's installed)

---

### Task 5: Create ChartContainer component

**Files:**
- Create: `src/components/TailorMadeForYou/ChartContainer.tsx`

**Interfaces:**
- Consumes: None
- Produces: `<ChartContainer ref={ref} />` — a responsive div wrapper

- [ ] **Step 1: Create ChartContainer.tsx**

```typescript
import { forwardRef } from "react";

interface ChartContainerProps {
  className?: string;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] ${className}`}
      />
    );
  }
);

ChartContainer.displayName = "ChartContainer";

export default ChartContainer;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/ChartContainer.tsx`

Expected: No errors

---

### Task 6: Create ProfitabilityChart (Financial)

**Files:**
- Create: `src/components/TailorMadeForYou/Financial/ProfitabilityChart.tsx`

**Interfaces:**
- Consumes: `useAmChart`, `profitabilityData` from `chartData.ts`, `ChartContainer`
- Produces: `<ProfitabilityChart />` component

- [ ] **Step 1: Create ProfitabilityChart.tsx**

```typescript
"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { profitabilityData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";

am5.addLicense("AM5C-0771-7551-3415-0172");

export default function ProfitabilityChart() {
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
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;

    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.setAll({ location: 1 });
    xAxis.data.setAll(profitabilityData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
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

    function makeSeries(name: string, fieldName: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: fieldName,
          categoryXField: "year",
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
      });

      series.data.setAll(profitabilityData);
      series.appear();

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        })
      );

      legend.data.push(series);
    }

    makeSeries("Group Turnover", "group_turnover");
    makeSeries("Profit before taxation", "profit_before_tax");
    makeSeries("Group taxation", "group_tax");
    makeSeries("Profit after tax", "profit_after_tax");
    makeSeries("Profit attributable to equity holders of the parent", "profit_attr");
    makeSeries("Dividends", "dividends");

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <ChartContainer ref={chartRef} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/Financial/ProfitabilityChart.tsx`

Expected: No errors

---

### Task 7: Create FinancialPositionChart (Financial)

**Files:**
- Create: `src/components/TailorMadeForYou/Financial/FinancialPositionChart.tsx`

**Interfaces:**
- Consumes: `useAmChart` (or inline pattern), `financialPositionData` from `chartData.ts`, `ChartContainer`
- Produces: `<FinancialPositionChart />` component

- [ ] **Step 1: Create FinancialPositionChart.tsx**

```typescript
"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { financialPositionData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";

am5.addLicense("AM5C-0771-7551-3415-0172");

interface HoverableDataContext {
  hover: () => void;
  unhover: () => void;
}

export default function FinancialPositionChart() {
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

      series.data.setAll(financialPositionData);
      series.appear(1000);
    }

    createSeries("Total Assets", "total_assets");
    createSeries("Total liabilities", "total_liab");
    createSeries("Revenue Reserves", "revenue_reserves");
    createSeries("Equity", "equity");
    createSeries("Current Assets", "current_assets");
    createSeries("Current Liabilities", "current_liabilities");

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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/Financial/FinancialPositionChart.tsx`

Expected: No errors

---

### Task 8: Create EmissionsChart (Non-Financial)

**Files:**
- Create: `src/components/TailorMadeForYou/NonFinancial/EmissionsChart.tsx`

**Interfaces:**
- Consumes: `emissionsData` from `chartData.ts`, `ChartContainer`
- Produces: `<EmissionsChart />` component

- [ ] **Step 1: Create EmissionsChart.tsx**

```typescript
"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { emissionsData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";

am5.addLicense("AM5C-0771-7551-3415-0172");

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
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name} in {categoryX}: {valueY} {info}",
          }),
        })
      );
      series.columns.template.setAll({ tooltipY: am5.percent(10), templateField: "columnSettings" });
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/NonFinancial/EmissionsChart.tsx`

Expected: No errors

---

### Task 9: Create EnergyConsumptionChart (Non-Financial)

**Files:**
- Create: `src/components/TailorMadeForYou/NonFinancial/EnergyConsumptionChart.tsx`

**Interfaces:**
- Consumes: `energyConsumptionData` from `chartData.ts`, `ChartContainer`
- Produces: `<EnergyConsumptionChart />` component

- [ ] **Step 1: Create EnergyConsumptionChart.tsx**

```typescript
"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { energyConsumptionData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";

am5.addLicense("AM5C-0771-7551-3415-0172");

export default function EnergyConsumptionChart() {
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
    xAxis.data.setAll(energyConsumptionData);

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
        text: "GJ",
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
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name} in {categoryX}: {valueY} {info}",
          }),
        })
      );
      series.strokes.template.setAll({ strokeWidth: 3, templateField: "strokeSettings" });
      series.data.setAll(energyConsumptionData);
      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            strokeWidth: 3,
            stroke: series.get("stroke"),
            radius: 5,
            fill: root.interfaceColors.get("background"),
          }),
        })
      );
      return series;
    }

    const s1 = createLineSeries("Renewable energy consumption (GJ)", "renewable_energy");
    createLineSeries("Non - renewable energy consumptions (GJ)", "non_renewable");
    createLineSeries("Total energy consumption (GJ)", "total_consumption");

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 })
    );
    legendRef = legend;
    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);
    s1.appear();

    return () => {
      root.dispose();
    };
  }, []);

  return <ChartContainer ref={chartRef} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/NonFinancial/EnergyConsumptionChart.tsx`

Expected: No errors

---

### Task 10: Create MaterialsWaterChart (Non-Financial)

**Files:**
- Create: `src/components/TailorMadeForYou/NonFinancial/MaterialsWaterChart.tsx`

**Interfaces:**
- Consumes: `materialsWaterData` from `chartData.ts`, `ChartContainer`
- Produces: `<MaterialsWaterChart />` component

- [ ] **Step 1: Create MaterialsWaterChart.tsx**

```typescript
"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { materialsWaterData } from "@/data/chartData";
import ChartContainer from "../ChartContainer";

am5.addLicense("AM5C-0771-7551-3415-0172");

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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/NonFinancial/MaterialsWaterChart.tsx`

Expected: No errors

---

### Task 11: Create SocialGovernanceChart (Non-Financial)

**Files:**
- Create: `src/components/TailorMadeForYou/NonFinancial/SocialGovernanceChart.tsx`

**Interfaces:**
- Consumes: `socialGovernanceData` from `chartData.ts`, `ChartContainer`
- Produces: `<SocialGovernanceChart />` component

- [ ] **Step 1: Create SocialGovernanceChart.tsx**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/NonFinancial/SocialGovernanceChart.tsx`

Expected: No errors

---

### Task 12: Create HeroBanner component

**Files:**
- Create: `src/components/TailorMadeForYou/HeroBanner.tsx`

**Interfaces:**
- Consumes: None
- Produces: `<HeroBanner />` component

- [ ] **Step 1: Create HeroBanner.tsx**

```typescript
export default function HeroBanner() {
  return (
    <section className="bg-brand-main py-12 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-content-inverse mb-4">
        Tailor Made for You
      </h1>
      <p className="font-sans text-base sm:text-lg text-content-inverse/80 max-w-3xl mx-auto">
        Visually explore performance data through customizable, interactive charts.
        Select key metrics and timeframes to generate dynamic visuals.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/HeroBanner.tsx`

Expected: No errors

---

### Task 13: Create TabController (WCAG-compliant main tabs)

**Files:**
- Create: `src/components/TailorMadeForYou/TabController.tsx`

**Interfaces:**
- Consumes: None
- Produces: `<TabController activeTab={tab} onTabChange={fn} />` component

- [ ] **Step 1: Create TabController.tsx**

```typescript
"use client";

import { useCallback, useRef, useEffect } from "react";

interface Tab {
  id: string;
  label: string;
  href?: string;
}

interface TabControllerProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabController({ tabs, activeTab, onTabChange }: TabControllerProps) {
  const tabRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index;

      if (e.key === "ArrowRight") {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        newIndex = 0;
      } else if (e.key === "End") {
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const tab = tabs[newIndex];
      if (tab.href) {
        window.location.href = tab.href;
      } else {
        onTabChange(tab.id);
      }
      tabRefs.current[newIndex]?.focus();
    },
    [tabs, onTabChange]
  );

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    if (activeIndex >= 0) {
      tabRefs.current[activeIndex]?.focus();
    }
  }, [activeTab, tabs]);

  return (
    <div
      role="tablist"
      aria-label="Main navigation"
      className="flex border-b border-zinc-200"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const commonProps = {
          ref: (el: HTMLButtonElement | HTMLAnchorElement | null) => {
            tabRefs.current[index] = el;
          },
          role: "tab" as const,
          id: `tab-${tab.id}`,
          "aria-selected": isActive,
          "aria-controls": tab.href ? undefined : `tabpanel-${tab.id}`,
          tabIndex: isActive ? 0 : -1,
          onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
          className: `px-6 py-3 text-sm font-medium transition-colors ${
            isActive
              ? "border-b-2 border-brand-main text-brand-main"
              : "text-content-primary/60 hover:text-content-primary hover:bg-surface-muted"
          }`,
        };

        if (tab.href) {
          return (
            <a key={tab.id} href={tab.href} {...commonProps}>
              {tab.label}
            </a>
          );
        }

        return (
          <button
            key={tab.id}
            {...commonProps}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/TabController.tsx`

Expected: No errors

---

### Task 14: Create ChartTypeTabs (Financial / Non-financial sub-tabs)

**Files:**
- Create: `src/components/TailorMadeForYou/ChartTypeTabs.tsx`

**Interfaces:**
- Consumes: None
- Produces: `<ChartTypeTabs activeType={type} onTypeChange={fn} />` component

- [ ] **Step 1: Create ChartTypeTabs.tsx**

```typescript
"use client";

import { useCallback, useRef } from "react";

interface ChartTypeTabsProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

export default function ChartTypeTabs({ activeType, onTypeChange }: ChartTypeTabsProps) {
  const tabs = [
    { id: "financial", label: "Financial" },
    { id: "non-financial", label: "Non-financial" },
  ];

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index;

      if (e.key === "ArrowRight") {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        newIndex = 0;
      } else if (e.key === "End") {
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      onTypeChange(tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    },
    [tabs, onTypeChange]
  );

  return (
    <div
      role="tablist"
      aria-label="Chart type"
      className="flex flex-wrap gap-2 py-4"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeType;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            id={`charttype-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`charttype-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => onTypeChange(tab.id)}
            className={`px-6 py-2 rounded-ui-element text-sm font-medium transition-all min-h-[44px] ${
              isActive
                ? "bg-brand-main text-content-inverse"
                : "bg-surface-muted text-content-primary hover:bg-surface-default"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/ChartTypeTabs.tsx`

Expected: No errors

---

### Task 15: Create TailorMadeForYouPage (main orchestrator)

**Files:**
- Create: `src/components/TailorMadeForYou/TailorMadeForYouPage.tsx`

**Interfaces:**
- Consumes: `HeroBanner`, `TabController`, `ChartTypeTabs`, all 6 chart components
- Produces: `<TailorMadeForYouPage />` component

- [ ] **Step 1: Create TailorMadeForYouPage.tsx**

```typescript
"use client";

import { useState } from "react";
import HeroBanner from "./HeroBanner";
import TabController from "./TabController";
import ChartTypeTabs from "./ChartTypeTabs";
import ProfitabilityChart from "./Financial/ProfitabilityChart";
import FinancialPositionChart from "./Financial/FinancialPositionChart";
import EmissionsChart from "./NonFinancial/EmissionsChart";
import EnergyConsumptionChart from "./NonFinancial/EnergyConsumptionChart";
import MaterialsWaterChart from "./NonFinancial/MaterialsWaterChart";
import SocialGovernanceChart from "./NonFinancial/SocialGovernanceChart";

const mainTabs = [
  { id: "chart-generator", label: "Chart Generator" },
  { id: "generate-report", label: "Generate your own report", href: "/reports" },
];

export default function TailorMadeForYouPage() {
  const [activeTab, setActiveTab] = useState("chart-generator");
  const [activeChartType, setActiveChartType] = useState("financial");

  return (
    <div className="min-h-screen">
      <HeroBanner />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TabController tabs={mainTabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "chart-generator" && (
          <div role="tabpanel" id="tabpanel-chart-generator" aria-labelledby="tab-chart-generator">
            <ChartTypeTabs activeType={activeChartType} onTypeChange={setActiveChartType} />

            <div className="py-6 space-y-8">
              {activeChartType === "financial" ? (
                <>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Earnings and Profitability (Rs. Bn)
                    </h2>
                    <ProfitabilityChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Financial Position (Rs. Bn)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <FinancialPositionChart />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Emissions (tCO2e)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <EmissionsChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Energy Consumption (GJ)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <EnergyConsumptionChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Materials (MT) and Water Management (m<sup>3</sup>)
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <MaterialsWaterChart />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-main mb-4">
                      Social and Governance Performance
                    </h2>
                    <p className="text-center text-sm font-bold text-content-primary mb-2">
                      Slide to explore
                    </p>
                    <SocialGovernanceChart />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/TailorMadeForYouPage.tsx`

Expected: No errors

---

### Task 16: Create route page (Server Component)

**Files:**
- Create: `src/app/(ui)/tailor-made-for-you/page.tsx`

**Interfaces:**
- Consumes: `TailorMadeForYouPage`
- Produces: `/tailor-made-for-you` route

- [ ] **Step 1: Create page.tsx**

```typescript
import type { Metadata } from "next";
import TailorMadeForYouPage from "@/components/TailorMadeForYou/TailorMadeForYouPage";

export const metadata: Metadata = {
  title: "Tailor Made for You | HeyCarb",
  description: "Explore performance data through customizable, interactive charts.",
};

export default function TailorMadeForYou() {
  return <TailorMadeForYouPage />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/app/\(ui\)/tailor-made-for-you/page.tsx`

Expected: No errors

---

### Task 17: Final build verification

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Clean build

- [ ] **Step 1: Run full build**

Run: `pnpm build`

Expected: Build completes with zero TypeScript errors and zero lint warnings

- [ ] **Step 2: Fix any build errors**

If build fails, fix the issues and re-run until clean.

- [ ] **Step 3: Verify route exists**

Run: `curl -s http://localhost:3000/tailor-made-for-you | head -20` (with dev server running)

Expected: HTML response with the page content

---

### Task 18: Remove unused useAmChart hook (cleanup)

**Files:**
- Delete: `src/components/TailorMadeForYou/useAmChart.ts`

**Interfaces:**
- Consumes: None
- Produces: Cleaner codebase (hook was designed but not used by individual charts due to their specific configurations)

- [ ] **Step 1: Delete useAmChart.ts**

Since each chart has unique configuration needs (different pan/scroll/cursor settings, different series creation patterns), the shared hook adds complexity without sufficient benefit. The charts use inline amCharts setup which is clearer for this use case.

Run: `rm src/components/TailorMadeForYou/useAmChart.ts`

- [ ] **Step 2: Final build verification**

Run: `pnpm build`

Expected: Build completes cleanly
