# Climate Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Climate Dashboard view with Risks/Opportunities tabs and amCharts line charts for 4 CRROs.

**Architecture:** Client Component rendered inside existing InnerPageLayout when "Climate Dashboard" tab is active. Data extracted from climate-mockup.html into typed constants. Reusable amCharts line chart component for driver and financial data.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, amCharts 5

## Global Constraints

- No raw Tailwind values for core UI styling — use design tokens where available
- No comments in production code unless asked
- No `any` types — TypeScript strict mode
- Build must pass with zero TypeScript errors and zero lint warnings
- All new files created with `write` tool
- No Git operations
- amCharts license: `AM5C-0771-7551-3415-0172`

## File Map

| File | Responsibility |
|------|---------------|
| `src/data/climateDashboard.ts` | Typed CRRO data constants |
| `src/components/Dashboard/ClimateDashboardPage.tsx` | Main Client Component, child tabs, renders CRROs |
| `src/components/Dashboard/ClimateTabs.tsx` | "Risks" / "Opportunities" centered filled tabs |
| `src/components/Dashboard/CrroSection.tsx` | Full CRRO content block |
| `src/components/Dashboard/CrroSummaryStrip.tsx` | 3-column summary strip |
| `src/components/Dashboard/CrroLineChart.tsx` | Reusable amCharts line chart |
| `src/components/Dashboard/ActivateDashboardPage.tsx` | MODIFIED: renders ClimateDashboardPage |

---

### Task 1: Extract CRRO data from climate mockup

**Files:**
- Create: `src/data/climateDashboard.ts`

**Interfaces:**
- Produces: `CrroDriverData`, `CrroFinancialItem`, `CrroData` types and `CRROS` constant

- [ ] **Step 1: Create the data file with TypeScript interfaces and CRRO constants**

```typescript
export interface CrroDriverData {
  title: string;
  subtitle: string;
  axis: string;
  unit: string;
  format: "percent" | "number" | "multiple";
  values: { h: string; low: number; high: number }[];
  note: string;
}

export interface CrroFinancialItem {
  title: string;
  subtitle: string;
  axis: string;
  unit: string;
  format: "percent" | "number" | "multiple";
  values: { h: string; low: number; high: number }[];
  note: string;
}

export interface CrroData {
  id: string;
  shortName: string;
  name: string;
  classification: "Risk" | "Opportunity";
  color: string;
  light: string;
  description: string;
  keyDriver: string;
  keyFinancial: string;
  driver: CrroDriverData;
  financial: CrroFinancialItem[];
}

export const CRROS: CrroData[] = [
  {
    id: "CRRO 1",
    shortName: "Raw material supply",
    name: "Climate Risk to Raw Material Supply",
    classification: "Risk",
    color: "#174A7E",
    light: "#DCEBFA",
    description: "Climate risk to raw material supply, covering coconut shell and coconut shell charcoal.",
    keyDriver: "Coconut shell charcoal cost pressure",
    keyFinancial: "Incremental raw material cost",
    driver: {
      title: "Estimated Average Coconut Shell Charcoal Cost Increase Across Major Sourcing Regions",
      subtitle: "Compared with the FY 2025/26 baseline",
      axis: "CSC cost increase from baseline",
      unit: "%",
      format: "percent",
      values: [
        { h: "ST", low: 20, high: 30 },
        { h: "MT", low: 55, high: 88 },
        { h: "LT", low: 108, high: 160 },
      ],
      note: "The estimates represent the combined average increase in coconut shell charcoal costs across Sri Lanka, India, Indonesia and Thailand. The ranges reflect increasing supply pressure from climate variability, higher production demand, tightening coconut-shell availability and greater reliance on higher-cost sourcing channels.",
    },
    financial: [
      {
        title: "Estimated Incremental Raw Material Cost Increase",
        subtitle: "Compared with FY 2025/26 raw material costs",
        axis: "Incremental raw material cost",
        unit: "LKR bn",
        format: "number",
        values: [
          { h: "ST", low: 5.5, high: 8.3 },
          { h: "MT", low: 14.3, high: 22.8 },
          { h: "LT", low: 29.2, high: 43.9 },
        ],
        note: "The estimated financial effect represents the additional raw material cost arising from the projected increase in coconut shell charcoal prices and does not represent total raw material expenditure. Near-term impacts are expected to be concentrated in Sri Lanka, while medium- and long-term exposure increases across all sourcing regions.",
      },
    ],
  },
  {
    id: "CRRO 2",
    shortName: "Physical water risk",
    name: "Physical Climate-Related Water Risk",
    classification: "Risk",
    color: "#168E95",
    light: "#DDF3F3",
    description: "Water risk arising from changes in water availability, water quality and hydrological variability.",
    keyDriver: "Loss of usable washing water",
    keyFinancial: "Incremental revenue loss",
    driver: {
      title: "Estimated Loss of Usable Water for Product Washing",
      subtitle: "Percentage reduction in available washing water",
      axis: "Water availability reduction",
      unit: "%",
      format: "percent",
      values: [
        { h: "ST", low: 5, high: 10 },
        { h: "MT", low: 15, high: 30 },
        { h: "LT", low: 20, high: 30 },
      ],
      note: "Washing is required for selected activated carbon grades, including all energy storage carbons and certain air- and water-purification products. The model separately assesses water demand for washing and steam generation, recognising that steam generation requires considerably less water per metric tonne of output.",
    },
    financial: [
      {
        title: "Incremental Revenue Loss",
        subtitle: "Estimated revenue impact from reduced production",
        axis: "Revenue loss",
        unit: "LKR bn",
        format: "number",
        values: [
          { h: "ST", low: 0.5, high: 1.7 },
          { h: "MT", low: 2, high: 8 },
          { h: "LT", low: 3, high: 8 },
        ],
        note: "The estimated revenue loss mainly reflects reduced production of washing-dependent grades. Energy Storage Carbon production is expected to be prioritised, but may also be affected under more severe or prolonged water constraints where resilience measures are insufficient. Revenue loss is presented as a range to reflect variability across scenarios.",
      },
    ],
  },
  {
    id: "CRRO 3",
    shortName: "Renewable energy opportunity",
    name: "Renewable Energy Adoption Opportunity",
    classification: "Opportunity",
    color: "#4A9B52",
    light: "#E4F2E3",
    description: "Opportunity to scale renewable energy adoption in response to fossil-fuel price volatility and supply disruption.",
    keyDriver: "Renewable energy share",
    keyFinancial: "Fossil-fuel-related cost reduction",
    driver: {
      title: "Renewable Energy Share under the ACTIVATE 2030 Boundary",
      subtitle: "Projected increase in renewable energy share",
      axis: "Renewable energy share",
      unit: "%",
      format: "percent",
      values: [
        { h: "ST", low: 9, high: 9 },
        { h: "MT", low: 30, high: 30 },
        { h: "LT", low: 50, high: 50 },
      ],
      note: "Haycarb has historically used waste heat to generate steam, which remains a major component of its renewable energy use. However, the ACTIVATE 2030 renewable energy target excludes this legacy utilisation and measures progress from the FY 2022/23 baseline through additional renewable energy sources.",
    },
    financial: [
      {
        title: "Estimated Reduction in Fossil-Fuel-Related Cost of Sales",
        subtitle: "Estimated financial benefit from reduced exposure to fossil-fuel-related costs",
        axis: "Anticipated cost reduction",
        unit: "%",
        format: "percent",
        values: [
          { h: "ST", low: 0, high: 0 },
          { h: "MT", low: 5, high: 15 },
          { h: "LT", low: 10, high: 15 },
        ],
        note: "No cost reduction is anticipated in the short term due to the initial investment required to expand renewable energy capacity. Financial benefits are expected to materialise over the medium and long term as renewable energy use increases. The percentages are presented as positive values to show the magnitude of the anticipated reduction in fossil-fuel-related cost of sales; they do not represent an increase in cost.",
      },
    ],
  },
  {
    id: "CRRO 4",
    shortName: "Value-added carbon opportunity",
    name: "Growing Market Demand Opportunity",
    classification: "Opportunity",
    color: "#7253A6",
    light: "#EDE7F7",
    description: "Opportunity from growing demand for value-added carbons used in energy storage, advanced water purification and air purification.",
    keyDriver: "Climate-solution-focused ESC production expansion",
    keyFinancial: "Climate-solution revenue opportunity",
    driver: {
      title: "Indicative Energy Storage Carbon Production Expansion",
      subtitle: "Production index relative to FY 2025/26 (baseline = 1.0)",
      axis: "Production index",
      unit: "×",
      format: "multiple",
      values: [
        { h: "ST", low: 1, high: 1.4 },
        { h: "MT", low: 1.4, high: 3 },
        { h: "LT", low: 3, high: 3.4 },
      ],
      note: "Production values are presented as an index relative to FY 2025/26, which is set at 1.0. The chart shows the indicative expansion in Energy Storage Carbon production attributable specifically to climate-solution demand, rather than total Energy Storage Carbon expansion, and does not disclose absolute production volumes.",
    },
    financial: [
      {
        title: "Climate-Solution Revenue Opportunity",
        subtitle: "Estimated incremental revenue from climate-solution applications",
        axis: "Revenue uplift",
        unit: "LKR bn",
        format: "number",
        values: [
          { h: "ST", low: 0.5, high: 1 },
          { h: "MT", low: 2, high: 5 },
          { h: "LT", low: 5, high: 8 },
        ],
        note: "The estimated revenue uplift reflects only climate-solution applications of Energy Storage Carbons. Revenue from other Energy Storage Carbon applications not directly linked to climate solutions, as well as Haycarb's other major product applications, including air and water purification, has been excluded.",
      },
    ],
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/data/climateDashboard.ts`
Expected: No errors

---

### Task 2: Build CrroLineChart component

**Files:**
- Create: `src/components/Dashboard/CrroLineChart.tsx`

**Interfaces:**
- Consumes: `ChartContainer` from `@/components/TailorMadeForYou/ChartContainer`
- Produces: `CrroLineChart` component with `data`, `unit`, `format`, `accentColor` props

- [ ] **Step 1: Create the CrroLineChart component**

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/CrroLineChart.tsx`
Expected: No errors (other component imports will fail until created)

---

### Task 3: Build CrroSummaryStrip component

**Files:**
- Create: `src/components/Dashboard/CrroSummaryStrip.tsx`

**Interfaces:**
- Consumes: `CrroData` type from `@/data/climateDashboard`
- Produces: `CrroSummaryStrip` component

- [ ] **Step 1: Create the CrroSummaryStrip component**

```tsx
import type { CrroData } from "@/data/activateDashboard";

interface CrroSummaryStripProps {
  crro: CrroData;
}

export default function CrroSummaryStrip({ crro }: CrroSummaryStripProps) {
  return (
    <div className="grid grid-cols-3 gap-4 bg-white border border-[#DDE5EB] rounded-[14px] p-4 shadow-[0_5px_15px_rgba(15,39,76,.045)]">
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#667085]">
          Classification
        </div>
        <div
          className="mt-1 text-sm font-bold"
          style={{ color: crro.color }}
        >
          {crro.classification}
        </div>
      </div>
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#667085]">
          Key driver
        </div>
        <div className="mt-1 text-sm font-bold text-[#071D43]">
          {crro.keyDriver}
        </div>
      </div>
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#667085]">
          Financial effect
        </div>
        <div className="mt-1 text-sm font-bold text-[#071D43]">
          {crro.keyFinancial}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/CrroSummaryStrip.tsx`
Expected: No errors

---

### Task 4: Build CrroSection component

**Files:**
- Create: `src/components/Dashboard/CrroSection.tsx`

**Interfaces:**
- Consumes: `CrroData` type from `@/data/climateDashboard`; `CrroSummaryStrip` from Task 3; `CrroLineChart` from Task 2
- Produces: `CrroSection` component

- [ ] **Step 1: Create the CrroSection component**

```tsx
import type { CrroData } from "@/data/climateDashboard";
import CrroSummaryStrip from "./CrroSummaryStrip";
import CrroLineChart from "./CrroLineChart";

interface CrroSectionProps {
  crro: CrroData;
}

export default function CrroSection({ crro }: CrroSectionProps) {
  const financialData = crro.financial[0];

  return (
    <article className="space-y-5">
      <div>
        <h3
          className="text-xl font-black"
          style={{ color: crro.color }}
        >
          {crro.name}
        </h3>
        <p className="text-sm text-[#4C5C70] mt-1 leading-relaxed">
          {crro.description}
        </p>
      </div>

      <CrroSummaryStrip crro={crro} />

      <div className="space-y-4">
        <div>
          <h4 className="text-base font-extrabold text-[#071D43]">
            {crro.driver.title}
          </h4>
          <p className="text-xs text-[#667085] mt-0.5">
            {crro.driver.subtitle}
          </p>
        </div>
        <CrroLineChart
          data={crro.driver.values}
          unit={crro.driver.unit}
          format={crro.driver.format}
          accentColor={crro.color}
        />
        <div className="bg-[#F5F8FB] border-l-[3px] rounded-lg p-3 text-xs text-[#4A586B] leading-[1.45]" style={{ borderLeftColor: crro.color }}>
          {crro.driver.note}
        </div>
      </div>

      {financialData && (
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-extrabold text-[#071D43]">
              {financialData.title}
            </h4>
            <p className="text-xs text-[#667085] mt-0.5">
              {financialData.subtitle}
            </p>
          </div>
          <CrroLineChart
            data={financialData.values}
            unit={financialData.unit}
            format={financialData.format}
            accentColor={crro.color}
          />
          <div className="bg-[#F5F8FB] border-l-[3px] rounded-lg p-3 text-xs text-[#4A586B] leading-[1.45]" style={{ borderLeftColor: crro.color }}>
            {financialData.note}
          </div>
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/CrroSection.tsx`
Expected: No errors

---

### Task 5: Build ClimateTabs component

**Files:**
- Create: `src/components/Dashboard/ClimateTabs.tsx`

**Interfaces:**
- Produces: `ClimateTabs` component with `activeCategory` and `onCategoryChange` props

- [ ] **Step 1: Create the ClimateTabs component**

```tsx
"use client";

import { useCallback, useRef } from "react";

interface ClimateTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const tabs = [
  { id: "risks", label: "Risks" },
  { id: "opportunities", label: "Opportunities" },
];

export default function ClimateTabs({
  activeCategory,
  onCategoryChange,
}: ClimateTabsProps) {
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
      onCategoryChange(tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    },
    [onCategoryChange]
  );

  return (
    <div className="flex justify-center py-4">
      <div
        role="tablist"
        aria-label="Climate dashboard category"
        className="flex gap-2 bg-[#F5F8FB] p-1 rounded-[12px]"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeCategory;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`climate-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`climate-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => onCategoryChange(tab.id)}
              className={`px-6 py-2.5 rounded-[10px] text-sm font-bold transition-all min-h-[44px] cursor-pointer ${
                isActive
                  ? "bg-brand-main text-content-inverse shadow-sm"
                  : "text-[#4C5C70] hover:bg-white hover:text-[#071D43]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/ClimateTabs.tsx`
Expected: No errors

---

### Task 6: Build ClimateDashboardPage component

**Files:**
- Create: `src/components/Dashboard/ClimateDashboardPage.tsx`

**Interfaces:**
- Consumes: `CRROS` from `@/data/climateDashboard`; `ClimateTabs` from Task 5; `CrroSection` from Task 4
- Produces: `ClimateDashboardPage` component

- [ ] **Step 1: Create the ClimateDashboardPage component**

```tsx
"use client";

import { useState } from "react";
import { CRROS } from "@/data/climateDashboard";
import ClimateTabs from "./ClimateTabs";
import CrroSection from "./CrroSection";

export default function ClimateDashboardPage() {
  const [activeCategory, setActiveCategory] = useState("risks");

  const filteredCrros = CRROS.filter((crro) =>
    activeCategory === "risks"
      ? crro.classification === "Risk"
      : crro.classification === "Opportunity"
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#071D43] tracking-tight">
          Climate Risk, Opportunity &amp; Resilience
        </h2>
        <p className="text-sm text-[#667085] mt-1 max-w-2xl">
          Analysis of climate-related risks and opportunities across Haycarb&apos;s
          operations and value chain, aligned with TCFD recommendations.
        </p>
      </div>

      <ClimateTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="mt-6 space-y-10">
        {filteredCrros.map((crro) => (
          <CrroSection key={crro.id} crro={crro} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/ClimateDashboardPage.tsx`
Expected: No errors

---

### Task 7: Integrate ClimateDashboardPage into ActivateDashboardPage

**Files:**
- Modify: `src/components/Dashboard/ActivateDashboardPage.tsx`

**Interfaces:**
- Consumes: `ClimateDashboardPage` from Task 6
- Produces: Updated `ActivateDashboardPage` that renders `ClimateDashboardPage` when climate tab is active

- [ ] **Step 1: Update ActivateDashboardPage to import and render ClimateDashboardPage**

Replace the "Coming soon" placeholder with the ClimateDashboardPage import and render.

Add import at top:
```tsx
import ClimateDashboardPage from "./ClimateDashboardPage";
```

Replace the climate tab placeholder:
```tsx
{activeTab === "climate" && <ClimateDashboardPage />}
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds with zero TypeScript errors

---

### Task 8: Full build verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: Build succeeds, `/dashboard` route listed

- [ ] **Step 2: Run linter**

Run: `pnpm lint`
Expected: No lint errors (only acceptable `<img>` warnings from base64 data URIs)

- [ ] **Step 3: Manual verification checklist**

- Navigate to `/dashboard` → click "Climate Dashboard" tab
- Verify "Risks" tab shows CRRO 1 (Raw Material Supply) and CRRO 2 (Physical Water Risk)
- Click "Opportunities" tab → verify CRRO 3 (Renewable Energy) and CRRO 4 (Market Demand)
- Verify each CRRO has: title, description, summary strip (3 columns only)
- Verify driver chart renders with ST/MT/LT on X-axis, low/high lines
- Verify financial chart renders with ST/MT/LT on X-axis, low/high lines
- Verify note text appears below each chart in styled callout box
- Verify responsive layout on mobile viewport
- Verify "Activate Dashboard" tab switches back to activate view
