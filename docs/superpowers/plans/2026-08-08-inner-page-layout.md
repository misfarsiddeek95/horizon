# InnerPageLayout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable `InnerPageLayout` component with a taller hero banner, centered tabs, and global focus-visible fix, then refactor the TailorMadeForYou page to use it.

**Architecture:** Single template component (`InnerPageLayout`) with fixed structure (Banner → Tabs → Content). Fully controlled tab state. Global focus-visible fix in `globals.css`. All styling uses existing Tailwind v4 tokens.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Next.js App Router

## Global Constraints

- ALL styling must use Tailwind v4 tokens from `src/styles/tokens/*.css`
- NO hardcoded colors, font families, font sizes, or border-radius values
- Focus rings must use `focus-visible` pseudo-class only
- Focus ring color must use `brand-main` token (not arbitrary blue)
- WCAG accessibility: ARIA roles, keyboard navigation, semantic HTML
- No comments in production code unless explicitly asked
- No `any` types — TypeScript strict mode enforced

---

### Task 1: Add Global Focus-Visible Rules

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: None (first task)
- Produces: Global CSS rules for `*:focus` and `*:focus-visible`

- [ ] **Step 1: Read the current globals.css**

```bash
cat src/app/globals.css
```

Expected: See current content with `@import "tailwindcss"`, token imports, `@font-face`, and `@layer base` rules.

- [ ] **Step 2: Add focus-visible rules to the base layer**

Edit `src/app/globals.css`. Inside the existing `@layer base { ... }` block, add the following rules **after** the existing `h1`-`h6` rule:

```css
*:focus {
  outline: none;
}
*:focus-visible {
  outline: 2px solid var(--color-brand-main);
  outline-offset: 2px;
  border-radius: var(--radius-ui-element);
}
```

The final `@layer base` block should look like:

```css
@layer base {
  body {
    background-color: var(--color-surface-muted);
    color: var(--color-content-primary);
    font-family: var(--font-sans);
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-heading);
  }
  *:focus {
    outline: none;
  }
  *:focus-visible {
    outline: 2px solid var(--color-brand-main);
    outline-offset: 2px;
    border-radius: var(--radius-ui-element);
  }
}
```

- [ ] **Step 3: Verify the file is valid CSS**

Run: `cat src/app/globals.css`
Expected: No syntax errors, file is well-formed.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add global focus-visible rules for keyboard accessibility"
```

---

### Task 2: Create InnerPageLayout Component

**Files:**
- Create: `src/components/InnerPageLayout.tsx`

**Interfaces:**
- Consumes: Tailwind v4 tokens from `src/styles/tokens/*.css`
- Produces: `InnerPageLayout` component exported from `src/components/InnerPageLayout.tsx`

- [ ] **Step 1: Create the component file**

Create `src/components/InnerPageLayout.tsx` with the following content:

```tsx
"use client";

import { ReactNode, useCallback, useRef, useEffect } from "react";

interface Tab {
  id: string;
  label: string;
}

interface InnerPageLayoutProps {
  title: string;
  description?: string;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
}

export default function InnerPageLayout({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  children,
}: InnerPageLayoutProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!tabs || !activeTab || !onTabChange) return;

      const currentIndex = tabs.findIndex((t) => t.id === activeTab);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      onTabChange(tabs[nextIndex].id);

      const nextTab = tabListRef.current?.children[nextIndex] as HTMLElement;
      nextTab?.focus();
    },
    [tabs, activeTab, onTabChange]
  );

  return (
    <section>
      <div className="bg-brand-main py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="font-heading text-content-inverse text-2xl sm:text-3xl lg:text-4xl font-bold">
            {title}
          </h1>
          {description && (
            <p className="font-sans text-content-inverse/80 text-base sm:text-lg mt-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {tabs && tabs.length > 0 && onTabChange && (
        <div className="border-b border-white/10">
          <div className="overflow-x-auto snap-x scrollbar-hide">
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Page navigation"
              className="flex justify-center gap-6 sm:gap-8 px-4"
              onKeyDown={handleKeyDown}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => onTabChange(tab.id)}
                  className={`font-heading text-sm sm:text-base pb-2 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-content-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-brand-main ${
                    activeTab === tab.id
                      ? "text-content-inverse border-b-2 border-content-inverse"
                      : "text-content-inverse/60 hover:text-content-inverse border-b-2 border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/InnerPageLayout.tsx`
Expected: No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/InnerPageLayout.tsx
git commit -m "feat: add InnerPageLayout component with banner, tabs, and content"
```

---

### Task 3: Refactor TailorMadeForYouPage to Use InnerPageLayout

**Files:**
- Modify: `src/components/TailorMadeForYou/TailorMadeForYouPage.tsx`

**Interfaces:**
- Consumes: `InnerPageLayout` from `src/components/InnerPageLayout.tsx`
- Produces: Updated `TailorMadeForYouPage` component using `InnerPageLayout`

- [ ] **Step 1: Read the current TailorMadeForYouPage.tsx**

```bash
cat src/components/TailorMadeForYou/TailorMadeForYouPage.tsx
```

Expected: See current component with `HeroBanner`, `TabController`, `ChartTypeTabs`, and chart imports.

- [ ] **Step 2: Rewrite TailorMadeForYouPage.tsx**

Replace the entire content of `src/components/TailorMadeForYou/TailorMadeForYouPage.tsx` with:

```tsx
"use client";

import { useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import ChartTypeTabs from "./ChartTypeTabs";
import ProfitabilityChart from "./Financial/ProfitabilityChart";
import FinancialPositionChart from "./Financial/FinancialPositionChart";
import FinancialRatiosChart from "./Financial/FinancialRatiosChart";
import EmissionsChart from "./NonFinancial/EmissionsChart";
import EnergyConsumptionChart from "./NonFinancial/EnergyConsumptionChart";
import MaterialsWaterChart from "./NonFinancial/MaterialsWaterChart";
import SocialGovernanceChart from "./NonFinancial/SocialGovernanceChart";
import ReportGenerator from "@/components/ReportGenerator";

const mainTabs = [
  { id: "chart-generator", label: "Chart Generator" },
  { id: "generate-report", label: "Generate your own report" },
];

export default function TailorMadeForYouPage() {
  const [activeTab, setActiveTab] = useState("chart-generator");
  const [activeChartType, setActiveChartType] = useState("financial");

  return (
    <InnerPageLayout
      title="Tailor Made For You"
      description="Explore your company's performance with interactive charts and reports."
      tabs={mainTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "chart-generator" && (
        <>
          <ChartTypeTabs
            activeType={activeChartType}
            onTypeChange={setActiveChartType}
          />
          <div className="mt-8 space-y-8">
            {activeChartType === "financial" ? (
              <>
                <ProfitabilityChart />
                <FinancialPositionChart />
                <FinancialRatiosChart />
              </>
            ) : (
              <>
                <EmissionsChart />
                <EnergyConsumptionChart />
                <MaterialsWaterChart />
                <SocialGovernanceChart />
              </>
            )}
          </div>
        </>
      )}
      {activeTab === "generate-report" && <ReportGenerator />}
    </InnerPageLayout>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/components/TailorMadeForYou/TailorMadeForYouPage.tsx`
Expected: No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/TailorMadeForYou/TailorMadeForYouPage.tsx
git commit -m "refactor: use InnerPageLayout in TailorMadeForYouPage"
```

---

### Task 4: Remove Obsolete Components

**Files:**
- Delete: `src/components/TailorMadeForYou/HeroBanner.tsx`
- Delete: `src/components/TailorMadeForYou/TabController.tsx`

**Interfaces:**
- Consumes: None
- Produces: Removed files, no remaining imports

- [ ] **Step 1: Verify no other files import HeroBanner or TabController**

Run: `grep -r "HeroBanner\|TabController" src/ --include="*.tsx" --include="*.ts"`
Expected: Only references in `HeroBanner.tsx` and `TabController.tsx` themselves (if any), or no matches.

- [ ] **Step 2: Delete the files**

```bash
rm src/components/TailorMadeForYou/HeroBanner.tsx
rm src/components/TailorMadeForYou/TabController.tsx
```

- [ ] **Step 3: Verify TypeScript compiles after deletion**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors (no broken imports).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove HeroBanner and TabController (replaced by InnerPageLayout)"
```

---

### Task 5: Verify Build and Fix Any Issues

**Files:**
- No file changes expected (only verification)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Clean build with zero errors

- [ ] **Step 1: Run the full build**

Run: `pnpm build`
Expected: Build completes with zero TypeScript errors and zero lint warnings.

- [ ] **Step 2: If build fails, fix errors**

If there are TypeScript errors or lint warnings, fix them in the relevant files and re-run the build.

- [ ] **Step 3: Verify the page renders correctly**

Run: `pnpm dev`
Expected: Navigate to `/tailor-made-for-you` and verify:
- Banner is taller with title and description
- Tabs are centered with underline active indicator
- Tab keyboard navigation works (ArrowLeft/Right, Home/End)
- Focus rings appear only on keyboard navigation (not mouse clicks)
- Focus rings use `brand-main` color (teal), not arbitrary blue
- Charts render correctly under the tabs
- Mobile: tabs scroll horizontally if needed

- [ ] **Step 4: Commit any fixes (if needed)**

```bash
git add -A
git commit -m "fix: resolve build issues for InnerPageLayout"
```

---

## Post-Implementation Checklist

- [ ] Banner uses `bg-brand-main` with `py-16 sm:py-20`
- [ ] Title uses `font-heading` token (Minion Pro)
- [ ] Description uses `font-sans` token (Avenir)
- [ ] Tabs use `font-heading` token
- [ ] Tabs are centered with `flex justify-center`
- [ ] Active tab has `border-b-2 border-content-inverse`
- [ ] Focus rings use `focus-visible` only
- [ ] Focus ring color uses `brand-main` token
- [ ] Tab keyboard navigation works (ArrowLeft/Right, Home/End)
- [ ] ARIA roles: `role="tablist"`, `role="tab"`, `aria-selected`
- [ ] Mobile: horizontal scroll with hidden scrollbar
- [ ] All tokens used — no hardcoded values
- [ ] Build passes with zero errors
