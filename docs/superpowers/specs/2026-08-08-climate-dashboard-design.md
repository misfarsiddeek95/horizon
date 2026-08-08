# Climate Dashboard — Design Spec

## Overview

Build the "Climate Dashboard" view within the `/dashboard` route, displaying climate-related risks and opportunities (CRROs) with amCharts line charts.

## Architecture

### Route Integration

- `ActivateDashboardPage.tsx` renders `ClimateDashboardPage` when `activeTab === "climate"`
- `ClimateDashboardPage` manages its own child tab state (Risks/Opportunities)

### Data Layer

`src/data/climateDashboard.ts` — extracted from `climate-mockup.html`:

```typescript
interface CrroDriverData {
  title: string;
  subtitle: string;
  axis: string;
  unit: string;
  format: "percent" | "number";
  values: { h: string; low: number; high: number }[];
  note: string;
}

interface CrroFinancialItem {
  title: string;
  subtitle: string;
  axis: string;
  unit: string;
  format: "percent" | "number";
  values: { h: string; low: number; high: number }[];
  note: string;
}

interface CrroData {
  id: string;
  shortName: string;
  name: string;
  classification: "Risk" | "Opportunity";
  icon: string;
  color: string;
  light: string;
  description: string;
  keyDriver: string;
  keyFinancial: string;
  driver: CrroDriverData;
  financial: CrroFinancialItem[];
}
```

Exported constants: `CRROS` (array of 4 CrroData objects, ordered CRRO1-4)

### Components

| File | Purpose |
|------|---------|
| `ClimateDashboardPage.tsx` | Main Client Component, child tabs, renders CRROs |
| `ClimateTabs.tsx` | "Risks" / "Opportunities" centered filled tabs |
| `CrroSection.tsx` | Full CRRO content: title, description, summary strip, charts |
| `CrroSummaryStrip.tsx` | 3-column strip: Classification, Key Driver, Financial Effect |
| `CrroLineChart.tsx` | Reusable amCharts Line Chart component |
| `src/data/climateDashboard.ts` | Typed CRRO data constants |

## Tab System

### Main Tabs (existing InnerPageLayout)

- "Activate Dashboard" → calls `onTabChange("activate")`
- "Climate Dashboard" → calls `onTabChange("climate")`, active

### Child Tabs (ClimateTabs)

- Centered, filled style matching `ChartTypeTabs` pattern
- "Risks" → active state: `bg-brand-main text-content-inverse`
- "Opportunities" → active state: `bg-brand-main text-content-inverse`
- Inactive: `bg-surface-muted text-content-primary hover:bg-surface-default`
- Rounded corners using `rounded-ui-element`

## CRRO Content Structure (per CRRO)

### Title & Description

- CRRO name as heading (e.g. "Climate Risk to Raw Material Supply")
- Description paragraph below

### Summary Strip (CrroSummaryStrip)

3 columns only:
1. **Classification** — "Risk" or "Opportunity"
2. **Key Driver** — `crro.keyDriver` text
3. **Financial Effect** — `crro.keyFinancial` text

LT sensitivity and Scenario emphasis are EXCLUDED.

### Charts (sequential, no tabs)

#### Driver Chart Section

1. Title: `crro.driver.title`
2. Subtitle: `crro.driver.subtitle`
3. amCharts Line Chart:
   - X-axis: CategoryAxis with categories ["ST", "MT", "LT"]
   - Y-axis: ValueAxis
   - Two LineSeries: "Low" (low values) and "High" (high values)
   - Bullet markers on each data point
   - Tooltip showing value and horizon
4. Note: `crro.driver.note` in a styled callout box

#### Financial Effect Chart Section

1. Title: `crro.financial[0].title`
2. Subtitle: `crro.financial[0].subtitle`
3. amCharts Line Chart (same structure as driver chart)
   - Uses `crro.financial[0].values` for data
4. Note: `crro.financial[0].note` in a styled callout box

## Chart Implementation (CrroLineChart)

### Props

```typescript
interface CrroLineChartProps {
  data: { h: string; low: number; high: number }[];
  unit: string;
  format: "percent" | "number";
  accentColor: string;
}
```

### amCharts Setup

- Reuse `ChartContainer` for sizing
- `am5.Root` with Animated and Responsive themes
- `am5xy.XYChart` with `panX: false`, `panY: false`
- `CategoryAxis` with `categoryField: "h"` — categories from data (ST, MT, LT)
- `ValueAxis` with `strokeOpacity: 0.1`
- Two `LineSeries`:
  - "Low" series: `valueYField: "low"`, `categoryXField: "h"`
  - "High" series: `valueYField: "high"`, `categoryXField: "h"`
- Both series use `tensionX: 0.8` for smooth curves
- Bullets: `am5.Bullet` with `am5.Circle` (size 8)
- Tooltip: `am5.Tooltip` with `interpolationDuration` and `LabelText`
- Legend at bottom
- Cursor: `am5xy.XYCursor`
- Colors: use `accentColor` prop for series styling

### Data Format

Transform `crro.driver.values` / `crro.financial[0].values` to amCharts format:
```typescript
[{ h: "ST", low: 20, high: 30 }, { h: "MT", low: 55, high: 88 }, { h: "LT", low: 108, high: 160 }]
```

## Styling

- All styling uses Tailwind v4 tokens (`bg-brand-main`, `text-content-inverse`, `rounded-ui-element`, etc.)
- No hardcoded hex colors from mockup — use project tokens
- Summary strip: `bg-white border border-[#DDE5EB] rounded-[14px]` with 3 equal columns
- Chart notes: `bg-surface-muted border-l-3 border-l-brand-main rounded-lg p-3` (matching activate dashboard pattern)
- CRRO sections separated by spacing (`space-y-8`)

## Excluded Sections

- "Driver", "Financial effects", "Pathway", "Compare both" tabs — NOT implemented
- "LT sensitivity" and "Scenario emphasis" in summary strip — NOT implemented
- Mockup's `nav-tabs`, `scenario-switch`, `feature-grid` — NOT implemented
- Mockup's `pathway-card` — NOT implemented

## File Map

```
src/
├── components/Dashboard/
│   ├── ActivateDashboardPage.tsx     — MODIFIED: renders ClimateDashboardPage
│   ├── ClimateDashboardPage.tsx      — NEW: main climate view
│   ├── ClimateTabs.tsx               — NEW: Risks/Opportunities tabs
│   ├── CrroSection.tsx               — NEW: full CRRO content block
│   ├── CrroSummaryStrip.tsx          — NEW: 3-column summary
│   └── CrroLineChart.tsx             — NEW: reusable amCharts line chart
├── data/climateDashboard.ts          — NEW: typed CRRO data
```

## Verification

1. `pnpm build` — zero TypeScript errors
2. Navigate to `/dashboard` → click "Climate Dashboard" tab
3. Verify "Risks" tab shows CRRO 1 and CRRO 2
4. Verify "Opportunities" tab shows CRRO 3 and CRRO 4
5. Verify each CRRO has title, description, summary strip, driver chart, financial chart
6. Verify charts render with ST/MT/LT on X-axis, low/high lines
7. Verify notes appear below each chart
8. Verify responsive layout on mobile
