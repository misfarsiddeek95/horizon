# User Profile Microsite — Bento Grid Redesign

## Overview

Rebuild the `/user-profile` microsite page (previously a dated horizontal-band layout in the
haycarb legacy app) as a premium, interactive Bento Grid inside the horizon app. Five stakeholder
tabs (Shareholders, Employees, Customers, Suppliers, General User) driven by tab-local client
state. Uses horizon's `InnerPageLayout` banner, `@heroicons/react` icons, existing design tokens
(`--color-brand-main` #147385), and FY2025/26 data payload. No new dependencies.

## Goals

- Premium, bespoke Bento Grid aesthetic (not generic white-card dashboard UI)
- Horizontal pill tab menu with prominent icons, brand-active state
- Fully mobile-responsive (grid stacks to single column)
- Native CSS fade/slide animation on tab switch (no tailwindcss-animate)
- Exact FY2025/26 data payload, no placeholders
- Download CTAs that open real PDFs from `public/pdf/tbc/`

## Non-Goals

- Backend / persistence / localStorage
- Multi-route segments (single page, tab-local `useState`)
- New design tokens (existing `--color-brand-main` suffices)
- Copying haycarb's legacy layout or GIF icons

---

## Architecture

```
src/app/(ui)/user-profile/page.tsx          Server component + metadata → renders UserProfilePage
src/components/UserProfile/
  UserProfilePage.tsx                        Client; owns activeTab state; banner + pills + grid
  UserProfileTabs.tsx                        Pill tab menu (heroicons + text)
  MetricsCard.tsx                            lg:col-span-12 hero numbers
  MessageCard.tsx                            lg:col-span-7 Chairman/MD brand-tinted block
  FeaturesCard.tsx                           lg:col-span-5 "Key Features Unveiled"
  ListCard.tsx                               lg:col-span-* Highlights / Strategy / Governance
  DownloadButton.tsx                         Pill CTA w/ hover-fill + icon translate
src/data/userProfiles.ts                     Typed FY2025/26 payload
```

### Route page
`src/app/(ui)/user-profile/page.tsx` — Server Component exporting `metadata`
(title "User Profiles | Horizon", description), returns `<UserProfilePage />`. Mirrors the
`dashboard` / `tailor-made-for-you` route pattern.

### State
`UserProfilePage.tsx` uses `useState<TabId>("shareholders")`. No context, no URL sync.
Tab panels re-mount via `key={activeTab}` to trigger the entry animation.

---

## Pill Tab Menu (`UserProfileTabs.tsx`)

| Property | Value |
|----------|-------|
| Container | `flex overflow-x-auto snap-x hide-scrollbar gap-3 pb-4` |
| Pill | `flex items-center gap-2 rounded-full px-5 py-2.5 whitespace-nowrap transition-all duration-300 cursor-pointer` |
| Active | `bg-brand-main text-content-inverse shadow-md` |
| Inactive | `bg-slate-100 text-slate-600 hover:bg-slate-200` |
| Icon size | `h-4 w-4` (heroicons 24/outline) |
| Tablist semantics | `role="tablist"`, `role="tab"`, `aria-selected`, keyboard nav (Arrow/Home/End) following `ChartTypeTabs` pattern |

Icon mapping:
| Tab | Icon |
|---|---|
| Shareholders | `BriefcaseIcon` |
| Employees | `UserGroupIcon` |
| Customers | `StarIcon` |
| Suppliers | `TruckIcon` |
| General User | `GlobeAltIcon` |
| Download CTA | `ArrowDownTrayIcon` |

---

## Bento Grid

Container: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full`.

Card base (all cards):
`bg-white rounded-[20px] border border-slate-200 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(20,115,133,0.08)] transition-all duration-500`

### Row composition (per tab)
| Card | Span |
|------|------|
| MetricsCard | `lg:col-span-12` |
| MessageCard | `lg:col-span-7` |
| FeaturesCard | `lg:col-span-5` |
| ListCards (Highlights / Strategy / Governance) | asymmetric `5 / 4 / 3` (or `6/6` fallback) |

### MetricsCard
- Full-width card; internal metric grid `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6`
- Values: `text-3xl lg:text-4xl font-extrabold text-brand-main`
- Each metric: `border-l-2 border-brand-main/30 pl-4` accent (left-border) with label below
  in `text-sm text-slate-500`
- Supports grouped metric sections (General User: Financial / Non-Financial sub-headings)

### MessageCard
- Chairman/MD quote; brand-tinted background: `bg-gradient-to-br from-brand-main/[0.06] via-white to-white`
- Quote glyph (large `“` in brand color / 10) top-right
- Title `font-heading text-xl font-bold text-content-primary`, body `text-slate-600 leading-relaxed`

### FeaturesCard
- "Key Features Unveiled" — 5 feature groups (AI Digital Report, Sustainability GRI 102/103 +
  SLFRS S1/S2, Financial SLFRS 18, Corporate Governance, Accessibility). Each row: small brand
  icon + bold feature name + muted sub-detail line.

### ListCard
- Generic: `title`, `items: string[]`, optional `download`. Renders title + bulleted list
  (brand bullets). Asymmetric spans assigned by the page per tab.
- Governance variant renders a short paragraph + DownloadButton (Corporate Governance PDF).

### DownloadButton
`inline-flex items-center gap-2 rounded-full bg-brand-main/10 text-brand-main px-6 py-3
text-sm font-semibold transition-all duration-300 hover:bg-brand-main hover:text-white
group cursor-pointer`
Icon: `<ArrowDownTrayIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />`
Renders `<a href={pdf} target="_blank" rel="noopener noreferrer">`.

---

## Data (`src/data/userProfiles.ts`)

```typescript
export type TabId = "shareholders" | "employees" | "customers" | "suppliers" | "generalUser";

export interface Metric { value: string; label: string; }
export interface MetricGroup { title?: string; metrics: Metric[]; }
export interface DownloadLink { label: string; pdf: string; }

export interface ProfileTab {
  id: TabId;
  title: string;
  intro?: string;
  metricGroups: MetricGroup[];
  message?: { title: string; text: string };
  highlights?: string[];
  strategy: { title: string; items?: string[]; text?: string; download?: DownloadLink };
  governance?: { title: string; text: string; download: DownloadLink };
}
```

Common `KEY_FEATURES` array (rendered by FeaturesCard) shared across all tabs:
1. AI-Enabled Digital Report (Conversational, Predictive, Multilingual, Interactive)
2. Sustainability Reporting Enhancements (GRI 102 & 103, SLFRS S1 & S2)
3. Financial Reporting Improvements (SLFRS 18)
4. Corporate Governance Presentation
5. Accessibility Advancements (Braille, Sign Language, Video)

Per-tab data uses the exact payload provided (FY2025/26 metrics, messages, highlights,
strategy, governance). PDF hrefs point at `/pdf/tbc/<file>.pdf`:

| Button | PDF |
|---|---|
| Corporate Governance | `Corporate Governance.pdf` |
| HR Strategy | `Human Capital.pdf` |
| Customer Value Proposition | `Our Products.pdf` |
| Supplier Value Proposition | `Listening to Our Stakeholders.pdf` |
| Strategy and Resource Allocation | `Strategy and Resource Allocation.pdf` |

---

## Animation (globals.css)

Native CSS, no new deps:

```css
@keyframes user-profile-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-user-profile-in {
  animation: user-profile-in 0.5s ease-out both;
}
```

Applied to the tab panel container; `key={activeTab}` forces remount per switch.
`.hide-scrollbar` utility added for the pill overflow row.

---

## Accessibility

- `role="tablist"` / `role="tab"` / `aria-selected` / `tabIndex` on pills
- ArrowLeft/Right + Home/End keyboard nav
- Focus ring via existing global `focus-visible` rules
- `aria-label` on download links
- Semantic headings (`h2`) inside cards

---

## Files

### Create
| File | Purpose |
|------|---------|
| `src/app/(ui)/user-profile/page.tsx` | Route + metadata |
| `src/components/UserProfile/UserProfilePage.tsx` | Client shell, tab state, grid composition |
| `src/components/UserProfile/UserProfileTabs.tsx` | Pill menu |
| `src/components/UserProfile/MetricsCard.tsx` | Hero metrics |
| `src/components/UserProfile/MessageCard.tsx` | Chairman/MD block |
| `src/components/UserProfile/FeaturesCard.tsx` | Key Features |
| `src/components/UserProfile/ListCard.tsx` | Highlights/Strategy/Governance |
| `src/components/UserProfile/DownloadButton.tsx` | Pill CTA |
| `src/data/userProfiles.ts` | Typed payload |

### Modify
| File | Change |
|------|--------|
| `src/app/globals.css` | Add `user-profile-in` keyframes + `.hide-scrollbar` utility |

## Verification

- `pnpm lint` — zero warnings
- `pnpm build` — zero TypeScript errors
- Manual: tab switching animation, mobile stacking, PDFs open
