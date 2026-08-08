# Activate Dashboard — Design Spec

## Overview

Build a `/dashboard` route displaying the "ACTIVATE 2030 Progress" dashboard for Haycarb PLC. The page renders ACTIVATE sustainability targets, pillar navigation, progress tracking, and FY2025/26 highlights based on a provided HTML mockup (`activate-mockup.html`).

## Architecture

### Route Structure

- `src/app/(ui)/dashboard/page.tsx` — Server Component wrapper with metadata
- `src/components/Dashboard/ActivateDashboardPage.tsx` — Client Component, main page logic

### Layout

The entire page is wrapped in `InnerPageLayout` with:
- `title`: `"ACTIVATE 2030 Progress"`
- `tabs`: `[{ id: "activate", label: "Activate Dashboard" }, { id: "climate", label: "Climate Dashboard" }]`
- `activeTab`: state-managed, defaults to `"activate"`
- Climate Dashboard tab renders a placeholder (separate implementation in future phase)

### Data Layer

`src/data/activateDashboard.ts` — typed constants extracted from the mockup's `<script id="appData">` JSON block:

- `META` — reporting year, URLs, source label
- `PILLARS` — object keyed by pillar name (RESTORE, etc.), each with color, light tint, icon, hero image, descriptor, purpose, standout, highlights, and counts
- `TARGETS` — array of target objects with id, pillar, indicator, baseline, current, target2030, milestone2027, milestone2028, unit, progress, status, summary, detail, source, page
- `STATUS_COLORS` — maps status strings to hex colors
- `STATUS_ORDER` — ordered array of status strings
- `GLOBAL_COUNTS` — counts by status across all targets

### TypeScript Interfaces

```typescript
interface Pillar {
  color: string;
  light: string;
  descriptor: string;
  purpose: string;
  iconData: string;
  heroData: string;
  standout: string;
  highlights: Highlight[];
  counts: Record<string, number>;
  targetCount: number;
}

interface Target {
  id: string;
  pillar: string;
  indicator: string;
  baseline: string;
  current: string;
  target2030: string;
  milestone2027: string;
  milestone2028: string;
  unit: string;
  progress: number | null;
  status: string;
  summary: string;
  detail: string;
  source: string;
  page: number;
}

interface Highlight {
  icon: string;
  title: string;
  value: string;
  unit: string;
  page: number;
}
```

## Components

All components live in `src/components/Dashboard/`.

### 1. ActivateDashboardPage.tsx

Client Component. Manages `activePillar` state (defaults to first pillar). Renders:
- Title zone with PDF buttons
- `<SummaryCards />`
- `<PillarTabs activePillar onPillarChange />`
- Analysis grid: `<PillarHero />` | `<TargetsPanel />`
- `<HighlightsSection />`

### 2. Title Zone (inline in ActivateDashboardPage)

- `flex items-end justify-between gap-5 pb-4`
- Left: `<h1>` "ACTIVATE 2030 Progress" + subtitle + source chip
- Right: two PDF buttons aligned to the right

**PDF Buttons:**
- "Activate Roadmap ↗" → `https://www.haycarb.com/wp-content/uploads/2025/07/ACTIVATE-Haycarb-PLC-ESG-Roadmap-2030.pdf`
- "ESG Impact Report ↗" → `https://www.haycarb.com/wp-content/uploads/2026/07/Sustainability-Impact-Report-July.2026.pdf`
- Both open in new tab (`target="_blank" rel="noopener noreferrer"`)
- Styled: `border border-[#D2DDE6] bg-white text-[#071D43] rounded-[8px] px-3 py-2 text-xs font-extrabold hover:bg-[#F2F6F8]`

### 3. SummaryCards.tsx

Props: none (reads from `GLOBAL_COUNTS`)

Renders 4 cards in `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5`.

Each card:
- `bg-white border border-[#DDE5EB] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_5px_15px_rgba(15,39,76,.045)]`
- Icon circle: `w-11 h-11 rounded-full grid place-items-center`
- Label: `text-[11px] font-[850] text-[#253148]`
- Value: `text-[27px] font-black leading-none`
- Note: `text-[9.5px] text-[#667085]`

Cards:
1. ◎ Total commitments — `TARGETS.length` — "Across 5 ACTIVATE pillars" — teal
2. ✓ Achieved / maintained — `GLOBAL_COUNTS["Achieved / exceeded"]` — green
3. ↗ On track / progressing — `GLOBAL_COUNTS["On track"] + GLOBAL_COUNTS["Progressing"]` — teal
4. ! Requires acceleration — `GLOBAL_COUNTS["Requires acceleration"]` — orange

### 4. PillarTabs.tsx

Props: `activePillar: string`, `onPillarChange: (name: string) => void`

Renders 5-column tab bar: `grid grid-cols-5 bg-white border border-[#DDE5EB] rounded-[15px] overflow-hidden shadow-[0_8px_24px_rgba(15,39,76,.075)] mb-3.5`

Each tab:
- Shows pillar icon (base64 `<img>`) + name + descriptor
- Active: tinted background with 3px colored top border
- On mobile: horizontal scroll (`flex overflow-x-auto`, `min-w-[200px]` per tab)

### 5. PillarHero.tsx

Props: `pillar: Pillar`, `pillarName: string`

Card with left border accent: `border-l-[5px]` in pillar color.

Contains:
- Hero photo section (base64 image, `h-[158px]`, curved bottom edge via CSS)
- Pillar icon + title + descriptor
- Purpose paragraph
- Standout callout: star icon + "FY2025/26 standout" label + text

### 6. TargetsPanel.tsx

Props: `targets: Target[]`, `pillar: Pillar`, `pillarName: string`

Panel header: "{PILLAR} targets" + note "All {n} targets are shown..."

Target grid:
- If >4 targets: `grid grid-cols-2 gap-x-3 gap-y-2` with card-style targets
- If ≤4 targets: single-column list with dividers

### 7. TargetCard.tsx

Props: `target: Target`, `pillar: Pillar`

Renders:
- Indicator name (bold)
- Current value (large, colored)
- Unit (muted)
- Status box: colored background + status text + "View details"
- Journey row: Baseline → FY2025/26 → 2030 target
- Progress bar (if numeric progress available)

### 8. HighlightsSection.tsx

Props: `pillar: Pillar`, `pillarName: string`

Renders:
- "FY2025/26 Impact highlights" title card
- 3 HighlightCards (from `pillar.highlights.slice(0, 3)`)
- CTA banner: "Explore Haycarb's climate-related risks..." + Climate Dashboard link

Each HighlightCard:
- Icon circle + title + value + unit
- Links to Annual Report page

## Styling Approach

- Mockup-specific colors use Tailwind arbitrary values: `text-[#071D43]`, `bg-[#197342]`, etc.
- Existing tokens used where applicable: `rounded-ui-card` for cards
- Responsive breakpoints match mockup: `sm:`, `md:`, `lg:` prefixes
- Mobile: single-column layouts, horizontal scroll for pillar tabs
- Font: inherits project's `font-sans` (Avenir) for body, `font-heading` (Minion Pro) for headings

## Excluded Sections

- Snapshot/pie chart (`<aside id="snapshot">`) — NOT implemented
- Methodology accordion (`<section id="method">`) — NOT implemented
- Site header from mockup — NOT implemented (separate component)
- Target detail modal — NOT implemented in this phase

## File Map

```
src/
├── app/(ui)/dashboard/page.tsx          — Server Component wrapper
├── components/Dashboard/
│   ├── ActivateDashboardPage.tsx        — Main Client Component
│   ├── SummaryCards.tsx                  — 4-card summary grid
│   ├── PillarTabs.tsx                   — Pillar navigation tabs
│   ├── PillarHero.tsx                   — Hero card for active pillar
│   ├── TargetsPanel.tsx                 — Targets list/grid container
│   ├── TargetCard.tsx                   — Individual target card
│   └── HighlightsSection.tsx            — Highlights + CTA
└── data/activateDashboard.ts            — Typed data constants
```

## Verification

1. `pnpm build` — zero TypeScript errors
2. Manual: navigate to `/dashboard`, verify both tabs render
3. Manual: click pillar tabs, verify hero/targets/highlights update
4. Manual: verify PDF buttons open correct URLs in new tab
5. Manual: verify responsive layout on mobile viewport
6. Manual: verify excluded sections (snapshot, methodology) are absent
