# Activate Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/dashboard` route displaying the "ACTIVATE 2030 Progress" sustainability dashboard with pillar navigation, target tracking, and highlights.

**Architecture:** Client Component wrapped in `InnerPageLayout` with two tabs. Data extracted from `activate-mockup.html` JSON into typed constants. Components broken into focused, reusable units.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4

## Global Constraints

- No raw Tailwind values for core UI styling — use design tokens where available; mockup-specific colors use Tailwind arbitrary values
- No comments in production code unless asked
- No `any` types — TypeScript strict mode
- Build must pass with zero TypeScript errors and zero lint warnings
- All new files created with `write` tool
- No Git operations

## File Map

| File | Responsibility |
|------|---------------|
| `src/app/(ui)/dashboard/page.tsx` | Server Component wrapper with metadata |
| `src/components/Dashboard/ActivateDashboardPage.tsx` | Main Client Component, state management, layout |
| `src/components/Dashboard/SummaryCards.tsx` | 4-card summary grid |
| `src/components/Dashboard/PillarTabs.tsx` | 5-column pillar navigation tabs |
| `src/components/Dashboard/PillarHero.tsx` | Hero card for active pillar |
| `src/components/Dashboard/TargetsPanel.tsx` | Targets list/grid container |
| `src/components/Dashboard/TargetCard.tsx` | Individual target card |
| `src/components/Dashboard/HighlightsSection.tsx` | Highlights + CTA banner |
| `src/data/activateDashboard.ts` | Typed data constants (pillars, targets, status colors) |

---

### Task 1: Extract data from mockup into typed constants

**Files:**
- Create: `src/data/activateDashboard.ts`

**Interfaces:**
- Produces: `Pillar`, `Target`, `Highlight`, `DashboardMeta` types and exported constants `META`, `PILLARS`, `TARGETS`, `STATUS_COLORS`, `STATUS_ORDER`, `GLOBAL_COUNTS`, `STATUS_BG`

- [ ] **Step 1: Create the data file with TypeScript interfaces and extracted constants**

```typescript
export interface Highlight {
  icon: string;
  title: string;
  value: string;
  unit: string;
  page: number;
}

export interface Pillar {
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

export interface Target {
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

export interface DashboardMeta {
  reportingYear: string;
  annualReportUrl: string;
  climateDashboardUrl: string;
  sourceLabel: string;
}

export const META: DashboardMeta = {
  reportingYear: "FY2025/26",
  annualReportUrl: "https://cdn.cse.lk/cmt/upload_report_file/494_1780912833539.pdf",
  climateDashboardUrl: "Haycarb_Climate_Risk_Resilience_Dashboard-External-Facing-v4-Wording-Refined.html",
  sourceLabel: "Haycarb PLC Annual Report 2025/26",
};

export const STATUS_COLORS: Record<string, string> = {
  "Achieved / exceeded": "#197342",
  "On track": "#168E95",
  Progressing: "#526DB0",
  "Requires acceleration": "#EF7B22",
};

export const STATUS_BG: Record<string, string> = {
  "Achieved / exceeded": "#E7F4EC",
  "On track": "#E5F4F4",
  Progressing: "#ECF0FA",
  "Requires acceleration": "#FFF0E4",
};

export const STATUS_ORDER = [
  "Achieved / exceeded",
  "On track",
  "Progressing",
  "Requires acceleration",
] as const;

export const GLOBAL_COUNTS: Record<string, number> = {
  "Achieved / exceeded": 5,
  "On track": 4,
  Progressing: 7,
  "Requires acceleration": 4,
};
```

Then add the `PILLARS` constant with all 5 pillars (RESTORE, INSPIRE, EXCITE, UPLIFT, INNOVATE). Each pillar object includes `color`, `light`, `descriptor`, `purpose`, `iconData` (base64), `heroData` (base64), `standout`, `highlights` array, `counts`, and `targetCount`. Extract these directly from the mockup's JSON data.

Then add the `TARGETS` array with all 20 targets. Each target has `id`, `pillar`, `indicator`, `baseline`, `current`, `target2030`, `milestone2027`, `milestone2028`, `unit`, `progress` (number | null), `status`, `summary`, `detail`, `source`, `page`.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/data/activateDashboard.ts`
Expected: No errors

---

### Task 2: Create the page route wrapper

**Files:**
- Create: `src/app/(ui)/dashboard/page.tsx`

**Interfaces:**
- Consumes: `ActivateDashboardPage` (from Task 3)
- Produces: `/dashboard` route

- [ ] **Step 1: Create the Server Component page wrapper**

```tsx
import type { Metadata } from "next";
import ActivateDashboardPage from "@/components/Dashboard/ActivateDashboardPage";

export const metadata: Metadata = {
  title: "Activate Dashboard | HeyCarb",
  description:
    "ACTIVATE 2030 Progress — track sustainability targets and FY2025/26 highlights.",
};

export default function DashboardPage() {
  return <ActivateDashboardPage />;
}
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build 2>&1 | head -30`
Expected: No errors related to `dashboard/page.tsx`

---

### Task 3: Build the main dashboard page component

**Files:**
- Create: `src/components/Dashboard/ActivateDashboardPage.tsx`

**Interfaces:**
- Consumes: `META`, `PILLARS`, `TARGETS`, `STATUS_COLORS`, `GLOBAL_COUNTS`, `STATUS_BG` from Task 1
- Consumes: `InnerPageLayout` (existing)
- Produces: Renders `SummaryCards`, `PillarTabs`, `PillarHero`, `TargetsPanel`, `HighlightsSection`

- [ ] **Step 1: Create the main Client Component**

```tsx
"use client";

import { useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import { META, PILLARS, TARGETS, STATUS_COLORS, STATUS_BG } from "@/data/activateDashboard";
import SummaryCards from "./SummaryCards";
import PillarTabs from "./PillarTabs";
import PillarHero from "./PillarHero";
import TargetsPanel from "./TargetsPanel";
import HighlightsSection from "./HighlightsSection";

const mainTabs = [
  { id: "activate", label: "Activate Dashboard" },
  { id: "climate", label: "Climate Dashboard" },
];

const PILLAR_NAMES = Object.keys(PILLARS) as (keyof typeof PILLARS)[];

export default function ActivateDashboardPage() {
  const [activeTab, setActiveTab] = useState("activate");
  const [activePillar, setActivePillar] = useState(PILLAR_NAMES[0]);

  const pillar = PILLARS[activePillar];
  const pillarTargets = TARGETS.filter((t) => t.pillar === activePillar);

  return (
    <InnerPageLayout
      title="ACTIVATE 2030 Progress"
      description={`Progress towards 2030 targets and ${META.reportingYear} highlights`}
      tabs={mainTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "activate" && (
        <>
          {/* Title zone with PDF buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 pb-4">
            <div>
              <h1 className="font-heading text-[#071D43] text-[40px] leading-[1.05] tracking-[-0.035em]">
                ACTIVATE 2030 Progress
              </h1>
              <p className="text-[#41516A] text-base mt-2">
                Progress towards 2030 targets and {META.reportingYear} highlights
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href="https://www.haycarb.com/wp-content/uploads/2025/07/ACTIVATE-Haycarb-PLC-ESG-Roadmap-2030.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#D2DDE6] bg-white text-[#071D43] rounded-lg px-3 py-2 text-xs font-extrabold hover:bg-[#F2F6F8] transition-colors whitespace-nowrap"
              >
                Activate Roadmap ↗
              </a>
              <a
                href="https://www.haycarb.com/wp-content/uploads/2026/07/Sustainability-Impact-Report-July.2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#D2DDE6] bg-white text-[#071D43] rounded-lg px-3 py-2 text-xs font-extrabold hover:bg-[#F2F6F8] transition-colors whitespace-nowrap"
              >
                ESG Impact Report ↗
              </a>
            </div>
          </div>

          <SummaryCards />

          <PillarTabs
            activePillar={activePillar}
            onPillarChange={setActivePillar}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(245px,0.78fr)_minmax(570px,2fr)] gap-3.5 items-stretch">
            <PillarHero pillar={pillar} pillarName={activePillar} />
            <TargetsPanel
              targets={pillarTargets}
              pillar={pillar}
              pillarName={activePillar}
            />
          </div>

          <HighlightsSection pillar={pillar} pillarName={activePillar} />
        </>
      )}

      {activeTab === "climate" && (
        <div className="text-center py-20 text-[#667085]">
          <p className="text-lg font-heading">Climate Dashboard</p>
          <p className="text-sm mt-2">Coming soon.</p>
        </div>
      )}
    </InnerPageLayout>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/ActivateDashboardPage.tsx`
Expected: No errors (other components will be "not found" until created)

---

### Task 4: Build SummaryCards component

**Files:**
- Create: `src/components/Dashboard/SummaryCards.tsx`

**Interfaces:**
- Consumes: `TARGETS`, `GLOBAL_COUNTS`, `STATUS_COLORS` from Task 1
- Produces: 4-card summary grid

- [ ] **Step 1: Create the SummaryCards component**

```tsx
import { TARGETS, GLOBAL_COUNTS, STATUS_COLORS } from "@/data/activateDashboard";

const cards = [
  {
    icon: "◎",
    label: "Total commitments",
    value: TARGETS.length,
    note: "Across 5 ACTIVATE pillars",
    color: "#087F8E",
    tint: "#E5F4F5",
  },
  {
    icon: "✓",
    label: "Achieved / maintained",
    value: GLOBAL_COUNTS["Achieved / exceeded"],
    note: "Targets met or maintained",
    color: STATUS_COLORS["Achieved / exceeded"],
    tint: "#E7F4EC",
  },
  {
    icon: "↗",
    label: "On track / progressing",
    value: GLOBAL_COUNTS["On track"] + GLOBAL_COUNTS["Progressing"],
    note: "Moving toward 2030",
    color: STATUS_COLORS["On track"],
    tint: "#E5F4F4",
  },
  {
    icon: "!",
    label: "Requires acceleration",
    value: GLOBAL_COUNTS["Requires acceleration"],
    note: "Further action required",
    color: STATUS_COLORS["Requires acceleration"],
    tint: "#FFF0E4",
  },
];

export default function SummaryCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
      {cards.map((c) => (
        <article
          key={c.label}
          className="bg-white border border-[#DDE5EB] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_5px_15px_rgba(15,39,76,.045)]"
        >
          <div
            className="w-11 h-11 rounded-full grid place-items-center shrink-0 text-xl font-black"
            style={{ backgroundColor: c.tint, color: c.color }}
          >
            {c.icon}
          </div>
          <div>
            <div className="text-[11px] font-[850] text-[#253148]">
              {c.label}
            </div>
            <div
              className="text-[27px] font-black leading-none mt-0.5"
              style={{ color: c.color }}
            >
              {c.value}
            </div>
            <div className="text-[9.5px] text-[#667085]">{c.note}</div>
          </div>
        </article>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/SummaryCards.tsx`
Expected: No errors

---

### Task 5: Build PillarTabs component

**Files:**
- Create: `src/components/Dashboard/PillarTabs.tsx`

**Interfaces:**
- Consumes: `PILLARS` from Task 1
- Produces: `PillarTabs` component with `activePillar` and `onPillarChange` props

- [ ] **Step 1: Create the PillarTabs component**

```tsx
import { PILLARS } from "@/data/activateDashboard";

interface PillarTabsProps {
  activePillar: string;
  onPillarChange: (name: string) => void;
}

const PILLAR_ENTRIES = Object.entries(PILLARS);

export default function PillarTabs({
  activePillar,
  onPillarChange,
}: PillarTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="ACTIVATE 2030 pillars"
      className="grid grid-cols-5 bg-white border border-[#DDE5EB] rounded-[15px] overflow-hidden shadow-[0_8px_24px_rgba(15,39,76,.075)] mb-3.5 max-md:flex max-md:overflow-x-auto"
    >
      {PILLAR_ENTRIES.map(([name, p]) => {
        const isActive = name === activePillar;
        return (
          <button
            key={name}
            role="tab"
            aria-selected={isActive}
            onClick={() => onPillarChange(name)}
            className="min-w-0 border-0 border-r border-r-[#DDE5EB] bg-white px-3 py-2.5 flex items-center justify-center gap-2.5 relative transition-colors max-md:min-w-[200px] max-md:justify-start last:border-r-0 hover:bg-[var(--light)] focus-visible:outline-3 focus-visible:outline-[color-mix(in_srgb,var(--accent)_35%,transparent)] focus-visible:outline-offset-[-3px]"
            style={
              {
                "--accent": p.color,
                "--light": p.light,
                color: p.color,
                background: isActive ? p.light : undefined,
              } as React.CSSProperties
            }
          >
            <div
              className="absolute inset-0 bottom-auto h-[3px]"
              style={{
                background: isActive ? p.color : "transparent",
              }}
            />
            <img
              src={p.iconData}
              alt=""
              aria-hidden="true"
              className="w-12 h-12 object-contain"
            />
            <div className="text-left">
              <div className="text-sm font-black leading-none">{name}</div>
              <div className="text-[9.5px] leading-[1.2] mt-1 text-[#34534B]">
                {p.descriptor}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/PillarTabs.tsx`
Expected: No errors

---

### Task 6: Build PillarHero component

**Files:**
- Create: `src/components/Dashboard/PillarHero.tsx`

**Interfaces:**
- Consumes: `Pillar` type from Task 1
- Produces: Hero card for active pillar

- [ ] **Step 1: Create the PillarHero component**

```tsx
import type { Pillar } from "@/data/activateDashboard";

interface PillarHeroProps {
  pillar: Pillar;
  pillarName: string;
}

export default function PillarHero({ pillar, pillarName }: PillarHeroProps) {
  return (
    <article
      className="bg-white border border-[#DDE5EB] rounded-[17px] shadow-[0_8px_24px_rgba(15,39,76,.075)] overflow-hidden border-l-[5px]"
      style={{ borderLeftColor: pillar.color }}
    >
      <div className="h-[158px] relative overflow-hidden bg-[#E7ECEF]">
        <img
          src={pillar.heroData}
          alt={`${pillarName} — ${pillar.descriptor}`}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute left-[-10%] right-[-10%] bottom-[-44px] h-[78px] bg-white rounded-t-[50%]"
          style={{ borderTop: `4px solid ${pillar.color}` }}
        />
      </div>

      <div className="pt-[7px] px-[19px] pb-[18px]">
        <div className="flex items-center gap-2.5">
          <img src={pillar.iconData} alt="" className="w-[58px] h-[58px]" />
          <div>
            <div
              className="text-[22px] font-black leading-none"
              style={{ color: pillar.color }}
            >
              {pillarName}
            </div>
            <div className="text-xs text-[#28613F] mt-1">
              {pillar.descriptor}
            </div>
          </div>
        </div>

        <p className="text-[12.5px] leading-[1.5] text-[#314056] mt-3 mb-3.5">
          {pillar.purpose}
        </p>

        <div className="border-t border-[#DDE5EB] pt-3.5 grid grid-cols-[34px_1fr] gap-2.5">
          <div
            className="w-[33px] h-[33px] rounded-full grid place-items-center text-white text-sm"
            style={{ backgroundColor: pillar.color }}
          >
            ★
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.04em]" style={{ color: pillar.color }}>
              FY2025/26 standout
            </div>
            <div className="text-[11px] leading-[1.4] mt-1">
              {pillar.standout}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/PillarHero.tsx`
Expected: No errors

---

### Task 7: Build TargetCard component

**Files:**
- Create: `src/components/Dashboard/TargetCard.tsx`

**Interfaces:**
- Consumes: `Target`, `Pillar` types and `STATUS_COLORS`, `STATUS_BG` from Task 1
- Produces: Individual target card

- [ ] **Step 1: Create the TargetCard component**

```tsx
import type { Target, Pillar } from "@/data/activateDashboard";
import { STATUS_COLORS, STATUS_BG } from "@/data/activateDashboard";

interface TargetCardProps {
  target: Target;
  pillar: Pillar;
  isMany: boolean;
}

export default function TargetCard({ target, pillar, isMany }: TargetCardProps) {
  const statusColor = STATUS_COLORS[target.status] || "#667085";
  const statusBg = STATUS_BG[target.status] || "#F5F7F9";

  const statusMain =
    target.progress !== null
      ? target.progress >= 100
        ? "100%"
        : `${target.progress}%`
      : target.status === "Achieved / exceeded"
        ? "Maintained"
        : "";

  const progressPercent =
    target.progress !== null
      ? Math.max(0, Math.min(100, target.progress))
      : null;

  return (
    <button
      className={`w-full border-0 text-left bg-white transition-colors hover:bg-[var(--light)] focus-visible:outline-none ${
        isMany
          ? "border border-[#E2E8ED] rounded-[11px] p-[9px_10px]"
          : "border-b border-b-[#E6EBEF] py-2.5 px-1 last:border-b-0"
      }`}
      style={
        {
          "--accent": pillar.color,
          "--light": pillar.light,
        } as React.CSSProperties
      }
      aria-label={`Open details for ${target.indicator}`}
    >
      <div className="flex items-start justify-between gap-2.5 mb-2">
        <div className="min-w-0 flex-1">
          <div
            className={`font-[850] leading-[1.3] ${
              isMany ? "text-[10.5px]" : "text-[11.5px]"
            }`}
          >
            {target.indicator}
          </div>
          <div
            className={`font-black mt-1 ${isMany ? "text-sm" : "text-[15px]"}`}
            style={{ color: pillar.color }}
          >
            {target.current}
          </div>
          <div className={`text-[#667085] mt-0.5 ${isMany ? "text-[8.5px]" : "text-[9px]"}`}>
            {target.unit}
          </div>
        </div>

        <div
          className={`rounded-[10px] text-center flex flex-col items-center justify-center shrink-0 ${
            isMany ? "min-w-[88px] min-h-[44px] p-[5px_7px]" : "min-w-[104px] min-h-[50px] p-[7px_9px]"
          }`}
          style={{ backgroundColor: statusBg, color: statusColor }}
        >
          <div className={`font-black leading-none ${isMany ? "text-sm" : "text-[17px]"}`}>
            {statusMain}
          </div>
          <div className={`font-[850] leading-[1.25] mt-1 ${isMany ? "text-[7.8px]" : "text-[8.5px]"}`}>
            {target.status}
          </div>
          <div className={`mt-1 opacity-80 ${isMany ? "text-[7px]" : "text-[7.5px]"}`}>
            View details
          </div>
        </div>
      </div>

      <div>
        <div
          className={`grid grid-cols-3 font-bold ${
            isMany ? "text-[7.5px]" : "text-[8px]"
          } text-[#5D6B7C]`}
        >
          <span>Baseline</span>
          <span className="text-center">FY2025/26</span>
          <span className="text-right">2030 target</span>
        </div>
        <div
          className={`grid grid-cols-3 gap-1.5 mt-1 ${
            isMany ? "text-[8.5px]" : "text-[9.5px]"
          } text-[#344257]`}
        >
          <span>{target.baseline}</span>
          <span className="text-center font-black" style={{ color: pillar.color }}>
            {target.current}
          </span>
          <span className="text-right">{target.target2030}</span>
        </div>

        {progressPercent !== null ? (
          <div className="h-[5px] rounded-full bg-[#E5EBF0] mt-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: pillar.color,
              }}
            />
          </div>
        ) : (
          <div className="text-[9px] text-[#6B7787] mt-[7px] leading-[1.3]">
            {target.status === "Requires acceleration"
              ? "Gap-based or multi-part indicator"
              : "Qualitative / status-based commitment"}
          </div>
        )}
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/TargetCard.tsx`
Expected: No errors

---

### Task 8: Build TargetsPanel component

**Files:**
- Create: `src/components/Dashboard/TargetsPanel.tsx`

**Interfaces:**
- Consumes: `Target`, `Pillar` types from Task 1; `TargetCard` from Task 7
- Produces: Targets panel with header and grid of TargetCards

- [ ] **Step 1: Create the TargetsPanel component**

```tsx
import type { Target, Pillar } from "@/data/activateDashboard";
import TargetCard from "./TargetCard";

interface TargetsPanelProps {
  targets: Target[];
  pillar: Pillar;
  pillarName: string;
}

export default function TargetsPanel({
  targets,
  pillar,
  pillarName,
}: TargetsPanelProps) {
  const isMany = targets.length > 4;

  return (
    <section
      className="bg-white border border-[#DDE5EB] rounded-[17px] shadow-[0_8px_24px_rgba(15,39,76,.075)] p-3.5 min-w-0"
      style={
        {
          "--accent": pillar.color,
          "--light": pillar.light,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between gap-2.5 mb-1.5">
        <div>
          <div className="text-[15px] font-black text-[#071D43]">
            {pillarName} targets
          </div>
          <div className="text-[9px] text-[#667085] mt-0.5">
            All {targets.length} targets are shown. Select any target for
            milestones, methodology and source.
          </div>
        </div>
      </div>

      <div
        className={
          isMany
            ? "grid grid-cols-2 gap-x-3 gap-y-2 content-start"
            : "grid"
        }
      >
        {targets.map((t) => (
          <TargetCard key={t.id} target={t} pillar={pillar} isMany={isMany} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/TargetsPanel.tsx`
Expected: No errors

---

### Task 9: Build HighlightsSection component

**Files:**
- Create: `src/components/Dashboard/HighlightsSection.tsx`

**Interfaces:**
- Consumes: `Pillar`, `META` types from Task 1
- Produces: Highlights grid + CTA banner

- [ ] **Step 1: Create the HighlightsSection component**

```tsx
import type { Pillar } from "@/data/activateDashboard";
import { META } from "@/data/activateDashboard";

interface HighlightsSectionProps {
  pillar: Pillar;
  pillarName: string;
}

function sourceLink(page: number): string {
  return `${META.annualReportUrl}#page=${page}`;
}

export default function HighlightsSection({
  pillar,
  pillarName,
}: HighlightsSectionProps) {
  const highlights = pillar.highlights.slice(0, 3);

  return (
    <section
      className="grid grid-cols-[150px_repeat(3,minmax(150px,1fr))_minmax(255px,1.2fr)] gap-2.5 mt-3.5 max-md:grid-cols-1 max-lg:grid-cols-[140px_repeat(2,1fr)]"
      aria-label="FY2025/26 impact highlights"
      style={
        {
          "--accent": pillar.color,
          "--light": pillar.light,
        } as React.CSSProperties
      }
    >
      <div className="bg-white border border-[#DDE5EB] rounded-[13px] p-4 flex items-center font-black leading-[1.25]" style={{ color: pillar.color }}>
        FY2025/26<br />
        Impact highlights
      </div>

      {highlights.map((h, i) => (
        <a
          key={i}
          href={sourceLink(h.page)}
          target="_blank"
          rel="noopener noreferrer"
          title="View Annual Report disclosure"
          className="bg-white border border-[#DDE5EB] rounded-[13px] p-3 flex items-center gap-2.5 no-underline min-h-[94px] transition-transform hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(15,39,76,.09)] focus-visible:outline-none"
        >
          <div
            className="w-10 h-10 rounded-full grid place-items-center shrink-0 text-lg"
            style={{ backgroundColor: pillar.light, color: pillar.color }}
          >
            {h.icon}
          </div>
          <div>
            <div className="text-[8.5px] font-black uppercase text-[#28364B]">
              {h.title}
            </div>
            <div
              className="text-[21px] font-black leading-[1.05] mt-[3px]"
              style={{ color: pillar.color }}
            >
              {h.value}
            </div>
            <div className="text-[9px] leading-[1.25] text-[#47566A]">
              {h.unit} · View disclosure ↗
            </div>
          </div>
        </a>
      ))}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#EDF7FB] to-[#DCEEF6] border border-[#D5E5EE] rounded-[13px] p-4 flex items-center justify-between gap-3 max-md:col-span-1 max-lg:col-span-full">
        <div className="after:absolute after:right-[-25px] after:bottom-[-42px] after:w-[180px] after:h-[105px] after:rounded-full after:bg-[rgba(72,160,186,.13)]">
          <div className="relative z-10 text-[11px] leading-[1.4] max-w-[180px]">
            Explore Haycarb&apos;s climate-related risks, opportunities and
            resilience analysis.
          </div>
        </div>
        <a
          href={META.climateDashboardUrl}
          className="relative z-10 no-underline rounded-full bg-[#006A78] text-white px-3.5 py-2.5 text-[9px] font-black whitespace-nowrap"
        >
          Climate Risk &amp; Resilience →
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --strict src/components/Dashboard/HighlightsSection.tsx`
Expected: No errors

---

### Task 10: Full build verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: Build succeeds with zero TypeScript errors and zero lint warnings

- [ ] **Step 2: Run linter**

Run: `pnpm lint`
Expected: No lint errors or warnings

- [ ] **Step 3: Manual verification**

- Navigate to `/dashboard` — page loads with "Activate Dashboard" tab active
- Verify 4 summary cards render with correct values
- Click each of the 5 pillar tabs — hero, targets, and highlights update
- Verify PDF buttons open correct URLs in new tab
- Verify "Climate Dashboard" tab shows placeholder
- Verify responsive layout on mobile viewport (single column, scrollable tabs)
- Verify excluded sections (snapshot, methodology) are absent
