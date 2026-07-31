# Chart Generator Migration Design

## Overview

Migrate the "Chart Generator" feature from the legacy haycarb project to the current horizon project. This includes a new `/tailor-made-for-you` route with a two-level tab system, a hero banner, and 6 amCharts 5 charts (2 Financial + 4 Non-financial).

## Decisions

| Decision | Choice |
|----------|--------|
| Non-financial charts | All 4 (Emissions, Energy Consumption, Materials/Water, Social/Governance) |
| "Generate Report" tab link | `/reports` (existing route) |
| Hero banner | Minimal centered text (Minion Pro heading + Avenir body) |
| Chart colors | Legacy colors converted to OKLCH tokens |
| Chart data | Centralized in single `chartData.ts` file |
| Architecture | Shared `useAmChart` hook + individual chart components (Approach A) |

## Dependencies

Install `@amcharts/amcharts5` (^5.13.5).

## File Structure

```
src/
├── app/(ui)/tailor-made-for-you/
│   └── page.tsx                          # Server Component, exports metadata
├── components/
│   └── TailorMadeForYou/
│       ├── TailorMadeForYouPage.tsx      # Client Component, main orchestrator
│       ├── HeroBanner.tsx                # Minimal banner
│       ├── TabController.tsx             # WCAG-compliant main tabs
│       ├── ChartTypeTabs.tsx             # Financial / Non-financial sub-tabs
│       ├── ChartContainer.tsx            # Shared responsive wrapper
│       ├── useAmChart.ts                 # Shared hook: Root, themes, cleanup
│       ├── Financial/
│       │   ├── ProfitabilityChart.tsx    # Column chart
│       │   └── FinancialPositionChart.tsx # Line chart
│       └── NonFinancial/
│           ├── EmissionsChart.tsx         # Column chart
│           ├── EnergyConsumptionChart.tsx # Line chart
│           ├── MaterialsWaterChart.tsx    # Line chart
│           └── SocialGovernanceChart.tsx  # Mixed column + line
├── data/
│   └── chartData.ts                      # All 6 data sets centralized
└── styles/tokens/
    └── colors.chart.css                  # Chart color tokens (OKLCH)
```

## Design Tokens

New chart color tokens (OKLCH format, added to `colors.css`):

```css
--color-chart-blue: oklch(0.55 0.15 255);    /* #4472c4 */
--color-chart-green: oklch(0.65 0.18 130);   /* #71ad47 */
--color-chart-gold: oklch(0.85 0.17 85);     /* #ffbf00 */
--color-chart-gray: oklch(0.72 0.02 260);    /* #a5a5a5 */
--color-chart-orange: oklch(0.68 0.17 50);   /* #ee7d30 */
--color-chart-teal: oklch(0.62 0.12 230);    /* #5b9cd5 */
```

## Tab System

### Level 1 — Main Tabs (`TabController.tsx`)
- "Chart Generator" | "Generate your own report"
- "Generate your own report" links to `/reports`
- WCAG: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`
- Keyboard: Arrow keys navigate, Enter/Space activates

### Level 2 — Chart Type Tabs (`ChartTypeTabs.tsx`)
- "Financial" | "Non-financial"
- Visible only when "Chart Generator" tab is active
- Same WCAG compliance pattern

## Chart Specifications

| Chart | Type | Series | Y-Axis |
|-------|------|--------|--------|
| Profitability | Column | 6 (turnover, tax, profit, dividends) | Rs. Bn |
| Financial Position | Line | 6 (assets, liabilities, equity) | Rs. Bn |
| Emissions | Column | 5 (total, scope1-3, biogenic) | tCO2e |
| Energy Consumption | Line | 3 (renewable, non-renewable, total) | GJ |
| Materials & Water | Line | 4 (waste water, consumption, waste, raw material) | MT / m3 |
| Social & Governance | Mixed | 7 (bars + lines) | Rs. Mn / No. |

## Shared Hook (`useAmChart`)

Encapsulates:
- `am5.Root` creation via ref
- Animated + Responsive themes
- Responsive breakpoints (`widthM` for mobile layout switch)
- Cleanup/dispose on unmount
- Returns `{ root, chart }` for series configuration

## Mobile Responsiveness

- ChartContainer: responsive heights (`h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]`)
- amCharts Responsive theme: vertical → horizontal on mobile
- Tabs: `overflow-x-auto` on mobile, `flex-wrap` for sub-tabs
- Touch targets: `min-h-[44px]`
- Page padding: `px-4 sm:px-6 lg:px-8`

## Accessibility

- Tab system: full WCAG 2.1 AA compliance
- Keyboard navigation: Arrow keys, Enter, Space
- ARIA: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`
- Focus management: visible focus indicators
- Screen reader: proper heading hierarchy, descriptive labels

## Styling Conventions

- All styling via Tailwind CSS utilities
- Token-first: use `bg-surface-default`, `text-content-primary`, `rounded-ui-element`, etc.
- Fonts: Minion Pro (headings via `font-heading`), Avenir (body via `font-sans`)
- No comments in production code
- No `any` types
