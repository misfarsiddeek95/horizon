# Dashboard Typography & Legibility Audit Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase all descriptive/metadata text sizes across the Activate and Climate dashboards by 1–2 steps, while preserving visual hierarchy and responsive layout integrity.

**Architecture:** Systematic find-and-replace across 12 dashboard components. Each component gets a typography pass bumping `text-[9px]→text-[10px]`, `text-[10px]→text-xs`, `text-xs→text-sm`, etc. Layout containers are checked for overflow after each change.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4

---

## Global Constraints

- NO Git operations. Local file modifications only.
- All styling uses Tailwind CSS utility classes and existing design tokens.
- Font families must use application fonts (`font-sans` = Avenir, `font-heading` = Minion Pro).
- Responsive behavior must not break. Use `sm:`/`md:` prefixes if needed.
- Build must pass with zero TypeScript errors. Lint must have zero errors (3 `<img>` warnings acceptable).

## Typography Scale Rules

| Current | Target | Rationale |
|---------|--------|-----------|
| `text-[7px]` | `text-[8.5px]` | Bottom labels too small |
| `text-[7.5px]` | `text-[9px]` | Sub-labels illegible |
| `text-[7.8px]` | `text-[9.5px]` | Status text in compact cards |
| `text-[8px]` | `text-[9.5px]` | Column headers |
| `text-[8.5px]` | `text-[10px]` | Unit text, secondary labels |
| `text-[9px]` | `text-[10px]` | Notes, metadata |
| `text-[9.5px]` | `text-[11px]` | Subtitle notes |
| `text-[10px]` | `text-[11px]` | Source buttons, CTAs |
| `text-[10.5px]` | `text-xs` (12px) | Card titles |
| `text-[11px]` | `text-xs` (12px) | Labels, category names |
| `text-[11.5px]` | `text-xs` (12px) | Indicator titles |
| `text-xs` (12px) | `text-sm` (14px) | Body text, descriptions |
| `text-sm` (14px) | `text-base` (16px) | Card headings (only if needed) |

---

## Task 1: SummaryCards.tsx

**File:** `src/components/Dashboard/SummaryCards.tsx`

- [ ] `text-[11px]` → `text-xs` (card label)
- [ ] `text-[9.5px]` → `text-[11px]` (card note)

## Task 2: TargetCard.tsx

**File:** `src/components/Dashboard/TargetCard.tsx`

- [ ] `text-[10.5px]` → `text-xs` (indicator isMany)
- [ ] `text-[11.5px]` → `text-xs` (indicator default)
- [ ] `text-[8.5px]` → `text-[10px]` (unit isMany)
- [ ] `text-[9px]` → `text-[10px]` (unit default)
- [ ] `text-[7.8px]` → `text-[9.5px]` (status label isMany)
- [ ] `text-[8.5px]` → `text-[9.5px]` (status label default)
- [ ] `text-[7px]` → `text-[8.5px]` (view details isMany)
- [ ] `text-[7.5px]` → `text-[9px]` (view details default)
- [ ] `text-[7.5px]` → `text-[8.5px]` (column header isMany)
- [ ] `text-[8px]` → `text-[9.5px]` (column header default)
- [ ] `text-[8.5px]` → `text-[10px]` (column value isMany)
- [ ] `text-[9.5px]` → `text-[11px]` (column value default)
- [ ] `text-[9px]` → `text-[10px]` (qualitative fallback)

## Task 3: PillarHero.tsx

**File:** `src/components/Dashboard/PillarHero.tsx`

- [ ] `text-xs` → `text-sm` (descriptor)
- [ ] `text-[12.5px]` → `text-sm` (purpose paragraph)
- [ ] `text-[9px]` → `text-[10px]` (standout label)
- [ ] `text-[11px]` → `text-xs` (standout text)

## Task 4: HighlightsSection.tsx

**File:** `src/components/Dashboard/HighlightsSection.tsx`

- [ ] `text-[8.5px]` → `text-[10px]` (highlight title)
- [ ] `text-[21px]` → `text-xl` (highlight value — keep large but use token)
- [ ] `text-[9px]` → `text-[10px]` (unit + disclosure)
- [ ] `text-[11px]` → `text-xs` (climate card description)
- [ ] `text-[9px]` → `text-[10px]` (climate CTA button)

## Task 5: EvidenceMiniCard.tsx

**File:** `src/components/Dashboard/EvidenceMiniCard.tsx`

- [ ] `text-xs` → `text-sm` (card title)
- [ ] `text-[11px]` → `text-xs` (insight text)
- [ ] `text-[11px]` → `text-xs` (view chart CTA)
- [ ] `text-[10px]` → `text-[11px]` (sources button)

## Task 6: ExplorerEvidence.tsx

**File:** `src/components/Dashboard/ExplorerEvidence.tsx`

- [ ] `text-[11px]` → `text-xs` (subtitle)

## Task 7: CrroSummaryStrip.tsx

**File:** `src/components/Dashboard/CrroSummaryStrip.tsx`

- [ ] All three `text-[11px]` → `text-xs` (labels)

## Task 8: CrroSelectionCard.tsx

**File:** `src/components/Dashboard/CrroSelectionCard.tsx`

- [ ] `text-[10.5px]` → `text-xs` (CRRO ID)
- [ ] `text-[8.5px]` → `text-[10px]` (classification)
- [ ] `text-[7.8px]` → `text-[9.5px]` (classification in badge)
- [ ] `text-[7px]` → `text-[8.5px]` (view details)

## Task 9: CrroSection.tsx

**File:** `src/components/Dashboard/CrroSection.tsx`

- [ ] `text-[11px]` → `text-xs` (what-this-means label)
- [ ] `text-xs` → `text-sm` (what-this-means body)
- [ ] `text-xs` → `text-sm` (scope body)
- [ ] `text-xs` → `text-sm` (driver subtitle)
- [ ] `text-xs` → `text-sm` (financial subtitle)

## Task 10: TargetDetailModal.tsx

**File:** `src/components/Dashboard/TargetDetailModal.tsx`

- [ ] `text-[11px]` → `text-xs` (unit)
- [ ] `text-[8.5px]` → `text-[10px]` (status label)
- [ ] `text-[8px]` → `text-[9.5px]` (milestone label ×4)
- [ ] `text-[11px]` → `text-xs` (milestone value ×4)
- [ ] `text-xs` → `text-sm` (summary paragraph)
- [ ] `text-xs` → `text-sm` (detail paragraph)
- [ ] `text-[10px]` → `text-[11px]` (source link)

## Task 11: ClimateChartModal.tsx

**File:** `src/components/Dashboard/ClimateChartModal.tsx`

- [ ] `text-[11px]` → `text-xs` (signal/projection/insight labels ×3)
- [ ] `text-xs` → `text-sm` (signal/projection/insight body ×3)

## Task 12: SourceModal.tsx

**File:** `src/components/Dashboard/SourceModal.tsx`

- [ ] `text-xs` → `text-sm` (description text)
- [ ] `text-xs` → `text-sm` (source link)
- [ ] `text-[11px]` → `text-xs` (supports text)
- [ ] `text-xs` → `text-sm` (annual report heading)
- [ ] `text-xs` → `text-sm` (annual report links)

## Task 13: Verify Build & Lint

- [ ] Run `pnpm build` — zero errors
- [ ] Run `pnpm lint` — zero errors (3 `<img>` warnings acceptable)
