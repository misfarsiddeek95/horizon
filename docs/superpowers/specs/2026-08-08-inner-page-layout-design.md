# InnerPageLayout Component — Design Spec

## Overview

A reusable page template component that enforces a consistent structure (Banner → Tabs → Content) across all inner pages. Ensures uniform application of Tailwind v4 tokens and WCAG accessibility standards.

## Goals

- Provide a single, clean API for inner page layouts
- Enforce consistent visual structure across pages
- Fix focus ring accessibility globally
- Support optional tabs and description
- Fully responsive on mobile with horizontal scroll for tabs

## Non-Goals

- Compound component pattern or slot-based flexibility
- Animation on the banner (future consideration)
- New CSS token definitions (existing tokens suffice)

---

## Component API

```typescript
// src/components/InnerPageLayout.tsx

import { ReactNode } from "react";

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
```

- **Fully controlled tab state** — parent owns `activeTab` and `onTabChange`
- **Tabs optional** — omit `tabs`/`activeTab`/`onTabChange` for pages without navigation
- **Description optional** — conditionally rendered only when a non-empty string is provided
- **`children`** — page content rendered below the tabs

---

## Banner Design

| Property | Value |
|----------|-------|
| Background | `bg-brand-main` |
| Padding | `py-16 sm:py-20` (~128-160px vertical) |
| Total height | ~200-250px (padding + content) |
| Layout | `max-w-4xl mx-auto text-center px-4` |
| Title font | `font-heading` (Minion Pro) |
| Title size | `text-2xl sm:text-3xl lg:text-4xl` |
| Title weight | `font-bold` |
| Title color | `text-content-inverse` |
| Description font | `font-sans` (Avenir) |
| Description size | `text-base sm:text-lg` |
| Description color | `text-content-inverse/80` |
| Description spacing | `mt-2` |
| Description render | Conditional — only when `description` prop is provided |

---

## Tabs Design

| Property | Value |
|----------|-------|
| Container | `flex justify-center` |
| Mobile scroll | `overflow-x-auto snap-x` |
| Scrollbar | Hidden via CSS (`scrollbar-hide`) |
| Tab list | `role="tablist"`, `flex gap-6 sm:gap-8` |
| Individual tab | `role="tab"`, `aria-selected`, `tabIndex={0}` |
| Tab font | `font-heading` (matching banner title font) |
| Tab size | `text-sm sm:text-base` |
| Inactive color | `text-content-inverse/60` |
| Active color | `text-content-inverse` |
| Hover color | `hover:text-content-inverse` |
| Active indicator | `border-b-2 border-content-inverse` |
| Padding | `pb-2` on each tab |
| Keyboard nav | ArrowLeft/Right, Home/End, Enter/Space |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-content-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-brand-main` |
| Mobile | `whitespace-nowrap` on tabs, horizontal scroll |

---

## Focus Ring — Global Fix

### In `globals.css` (base layer)

```css
@layer base {
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

- Removes default browser blue focus ring globally
- Applies `brand-main` colored outline on keyboard focus only (`focus-visible`)
- Adds `outline-offset: 2px` for visual separation
- Uses `radius-ui-element` for rounded focus rings

### Component-level override (tabs in banner)

The tabs within `InnerPageLayout` override the global ring for better visibility against the brand background:

```
focus-visible:ring-2
focus-visible:ring-content-inverse
focus-visible:ring-offset-2
focus-visible:ring-offset-brand-main
```

This produces a white ring with brand-colored offset on the brand background.

---

## Token Usage Summary

All styling uses existing Tailwind v4 tokens — no new token definitions required.

| Token | Usage |
|-------|-------|
| `bg-brand-main` | Banner background, focus ring color |
| `text-content-inverse` | Banner title, tab text, active tab, focus ring in banner |
| `text-content-inverse/80` | Description text |
| `text-content-inverse/60` | Inactive tab text |
| `font-heading` | Banner title, tab labels (Minion Pro) |
| `font-sans` | Description text (Avenir) |
| `radius-ui-element` | Global focus ring border-radius |

---

## Accessibility Checklist

- [x] `role="tablist"` on tab container
- [x] `role="tab"` on each tab
- [x] `aria-selected` on active tab
- [x] `tabIndex={0}` on tabs
- [x] ArrowLeft/Right keyboard navigation
- [x] Home/End for first/last tab
- [x] Enter/Space to activate tab
- [x] `focus-visible` only (no focus ring on mouse click)
- [x] Focus ring uses theme token color (not arbitrary blue)
- [x] Semantic HTML (`<section>`, `<h1>`, `<p>`)
- [x] Responsive text scaling
- [x] Horizontal scroll for tabs on mobile

---

## Responsive Behavior

| Breakpoint | Banner padding | Title size | Tab size | Tab gap |
|------------|---------------|------------|----------|---------|
| Default | `py-16` | `text-2xl` | `text-sm` | `gap-6` |
| `sm` | `py-20` | `text-3xl` | `text-base` | `gap-6` |
| `lg` | `py-20` | `text-4xl` | `text-base` | `gap-8` |

Tabs container uses `overflow-x-auto snap-x` with hidden scrollbar for horizontal scroll on small screens.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/InnerPageLayout.tsx` | New layout component |

## Files to Modify

| File | Change |
|------|--------|
| `src/app/globals.css` | Add global `focus-visible` base layer rules |
| `src/components/TailorMadeForYou/TailorMadeForYouPage.tsx` | Wrap content with `InnerPageLayout`, remove inline banner and tab code |

## Files to Remove

| File | Reason |
|------|--------|
| `src/components/TailorMadeForYou/HeroBanner.tsx` | Replaced by `InnerPageLayout` banner |
| `src/components/TailorMadeForYou/TabController.tsx` | Replaced by `InnerPageLayout` tabs |

## Files Unchanged

- All chart components (`Financial/*.tsx`, `NonFinancial/*.tsx`)
- `ChartTypeTabs.tsx` (secondary tab level within content)
- `ChartContainer.tsx`
- Token files (`colors.css`, `typography.css`, `radii.css`)
- `types.ts`
