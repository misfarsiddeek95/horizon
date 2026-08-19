# Codebase Color Palette & Styling Architecture Mapping

## Overview

Horizon is a Next.js App Router crossword/puzzle game with a multi-page dashboard application. Colors are defined across three layers:

1. **Design Tokens** — `src/styles/tokens/colors.css` via Tailwind v4 `@theme` blocks
2. **Data Constants** — TypeScript files defining status/pillar/category colors
3. **Inline/Utility Classes** — Raw hex, RGBA, and Tailwind utility classes in components

---

## Design Token Colors (`src/styles/tokens/colors.css`)

| Color Variable | Color Value (oklch/hex/rgba) | Codebase Files & UI Sections Applied |
|---|---|---|
| `--color-surface-default` | `oklch(0.99 0.01 250)` | `CrosswordGrid.tsx` (pause overlay card), `ResultsOverlay.tsx` (modal background), `InteractiveLeaderboard.tsx` (player detail modal), `BadgeUnlockModal.tsx` (badge modal) |
| `--color-surface-muted` | `oklch(0.96 0.01 250)` | `globals.css` body background (applied globally to `<body>`) |
| `--color-surface-glass` | `oklch(1 0 0 / 0.1)` | `CrosswordGrid.tsx` (pause overlay card glass), `InstructionLobby.tsx` (lobby cards, sound toggle bar), `globals.css` `.glass-card` utility |
| `--color-content-primary` | `oklch(0.15 0.02 250)` | `globals.css` body text color, `CrosswordGrid.tsx` (pause overlay text), `ResultsOverlay.tsx` (heading, score, labels), `InteractiveLeaderboard.tsx` (modal text), `ActiveCluePanel.tsx` (timer text), `BadgeUnlockModal.tsx` (title, description) |
| `--color-content-inverse` | `oklch(0.99 0.01 250)` | `CrosswordGrid.tsx` (pause overlay button text), `ResultsOverlay.tsx` (play again button text), `InteractiveLeaderboard.tsx` (podium initials), `Onboarding.tsx` (form text), `InstructionLobby.tsx` (heading, body text), `InnerPageLayout.tsx` (hero text), `BadgeUnlockModal.tsx` (button text), `ShareResults.tsx` (button text) |
| `--color-brand-main` | `#147385` | `globals.css` focus ring, `CrosswordGrid.tsx` (pause resume button), `ActiveCluePanel.tsx` (submit button, timer bar), `ResultsOverlay.tsx` (score, play again button), `InteractiveLeaderboard.tsx` (avatar bg), `Onboarding.tsx` (form bg), `InstructionLobby.tsx` (page bg), `ShareResults.tsx` (FB button), `MobileClueBar.tsx` (bar bg), `MobileTimer.tsx` (timer bar), `InnerPageLayout.tsx` (gradient stop), `UserProfile/MetricsBand.tsx` (metric values, group dividers, section lines), `UserProfile/UserProfileTabs.tsx` (active tab text/indicator), `UserProfile/GovernanceStrategySection.tsx` (icons, hover effects), `UserProfile/ChairmanSection.tsx` (icons, border), `Dashboard/ActivateDashboardPage.tsx` (title), `GlobalHeader.tsx` (active link icon), `globals.css` `.glass-card` border glow |
| `--color-brand-hover` | `#0f5c6b` | `CrosswordGrid.tsx` (pause resume button hover), `ActiveCluePanel.tsx` (submit button hover), `ResultsOverlay.tsx` (play again hover), `ShareResults.tsx` (LI button bg), `BadgeUnlockModal.tsx` (button hover) |
| `--color-heading` | `#036984` | `UserProfile/GovernanceStrategySection.tsx` (section heading), `UserProfile/ChairmanSection.tsx` (heading) |
| `--color-section-title` | `oklch(0.484 0.0899 223.74)` | Defined but not directly referenced in components |
| `--color-accent-main` | `oklch(0.7 0.18 45)` | `Onboarding.tsx` (start button bg), `InstructionLobby.tsx` (start button bg), `globals.css` checkbox accent |
| `--color-chart-blue` | `oklch(0.55 0.15 255)` | Chart series colors (amCharts) |
| `--color-chart-green` | `oklch(0.65 0.18 130)` | Chart series colors (amCharts) |
| `--color-chart-gold` | `oklch(0.85 0.17 85)` | Chart series colors (amCharts) |
| `--color-chart-gray` | `oklch(0.72 0.02 260)` | Chart series colors (amCharts) |
| `--color-chart-orange` | `oklch(0.68 0.17 50)` | Chart series colors (amCharts) |
| `--color-chart-teal` | `oklch(0.62 0.12 230)` | Chart series colors (amCharts) |
| `--color-forest` | `#036984` | Persona tab themes |
| `--color-teal` | `#1683a0` | Persona tab themes |
| `--color-lime` | `#b8d65c` | Persona tab themes, `globals.css` super-pop card border glint |
| `--color-teal-2` | `#5bb2c8` | Persona tab themes, `globals.css` icon glow shadow |
| `--color-gold` | `#e0b44b` | Persona tab themes |
| `--color-mint` | `#e9f5f8` | Persona tab themes |
| `--color-ink` | `#15332f` | Persona tab themes |
| `--color-glass` | `rgba(2, 44, 59, 0.72)` | `globals.css` `.glass-card` utility background |
| `--color-glass-strong` | `rgba(1, 34, 46, 0.80)` | `GlobalHeader.tsx` (full-screen nav overlay) |
| `--color-glass-soft` | `rgba(2, 44, 59, 0.62)` | Available for glass surfaces |
| `--color-glass-border` | `rgba(220, 242, 248, 0.22)` | `globals.css` `.glass-card` border |
| `--color-tab-default` | `rgba(2, 44, 59, 0.64)` | Tab states |
| `--color-tab-hover` | `rgba(3, 105, 132, 0.44)` | Tab hover states |
| `--color-tab-hover-border` | `rgba(199, 237, 246, 0.52)` | Tab hover border |
| `--color-tab-active` | `rgba(3, 105, 132, 0.76)` | Tab active state |
| `--color-tab-active-border` | `rgba(199, 237, 246, 0.68)` | Tab active border |
| `--color-spotlight-center` | `rgba(183, 235, 248, 0.13)` | `globals.css` `.persona-spotlight` radial gradient |
| `--color-spotlight-mid` | `rgba(183, 235, 248, 0.035)` | `globals.css` `.persona-spotlight` radial gradient |
| `--color-aura-center` | `rgba(122, 214, 238, 0.12)` | `globals.css` `.cursor-aura` radial gradient |
| `--color-aura-mid` | `rgba(3, 105, 132, 0.055)` | `globals.css` `.cursor-aura` radial gradient |
| `--color-content-muted` | `#d5e7ee` | Available for muted content |
| `--color-glass-faint` | `rgba(2, 44, 59, 0.34)` | Available for faint glass |
| `--color-glass-header` | `rgba(1, 34, 46, 0.76)` | Available for glass headers |
| `--color-glass-card-hover` | `rgba(3, 71, 92, 0.78)` | Available for card hover glass |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.16)` | Subtle borders |
| `--color-border-faint` | `rgba(199, 237, 246, 0.24)` | Faint borders |
| `--color-border-card-hover` | `rgba(199, 237, 246, 0.66)` | Card hover border |

## Shadow Tokens (`src/styles/tokens/colors.css`)

| Shadow Variable | Shadow Value | Codebase Files & UI Sections Applied |
|---|---|---|
| `--shadow-glass-card` | `0 8px 32px 0 rgba(0, 0, 0, 0.4)` | Available for glass card elevation |
| `--shadow-glass-panel` | `0 8px 32px 0 rgba(0, 0, 0, 0.6)` | `globals.css` `.glass-card` utility |
| `--shadow-glass-hover` | `0 0 30px rgba(255, 255, 255, 0.08)` | `globals.css` `.glass-card-hover` utility |
| `--shadow-metric-hover` | `0 26px 60px rgba(0, 21, 31, 0.34)` | Metric card hover shadows |
| `--shadow-elevated` | `0 24px 60px rgba(0, 0, 0, 0.4)` | Elevated panel shadows |
| `--shadow-icon-glow` | `0 0 8px rgba(91, 178, 200, 0.5)` | Icon glow effects |
| `--shadow-scene-active` | `0 0 12px rgba(255, 255, 255, 0.6)` | Active scene highlight |

---

## Data Constant Colors

### ACTIVATE Dashboard Status Colors (`src/data/activateDashboard.ts`)

| Constant | Color Value | Codebase Files & UI Sections Applied |
|---|---|---|
| `STATUS_COLORS["Achieved / exceeded"]` | `#197342` | `Dashboard/SummaryCards.tsx` (card icon/value), `Dashboard/TargetCard.tsx` (status badge), `Dashboard/TargetDetailModal.tsx` (status badge) |
| `STATUS_COLORS["On track"]` | `#168E95` | Same as above + `Dashboard/SourceModal.tsx` (primary disclosure border) |
| `STATUS_COLORS["Progressing"]` | `#526DB0` | Same as above |
| `STATUS_COLORS["Requires acceleration"]` | `#EF7B22` | Same as above |
| `STATUS_BG["Achieved / exceeded"]` | `#E7F4EC` | `Dashboard/SummaryCards.tsx` (icon bg), `Dashboard/TargetCard.tsx` (status bg), `Dashboard/TargetDetailModal.tsx` (status bg) |
| `STATUS_BG["On track"]` | `#E5F4F4` | Same as above |
| `STATUS_BG["Progressing"]` | `#ECF0FA` | Same as above |
| `STATUS_BG["Requires acceleration"]` | `#FFF0E4` | Same as above |

### ACTIVATE Pillar Colors (`src/data/activateDashboard.ts`)

| Pillar | Color | Light | Codebase Files & UI Sections Applied |
|---|---|---|---|
| RESTORE | `#009DB0` | `#E4F3F4` | `Dashboard/PillarHero.tsx` (hero title, left border, star icon), `Dashboard/PillarTabs.tsx` (active tab bg, indicator bar), `Dashboard/TargetsPanel.tsx` (--accent, --light CSS vars), `Dashboard/TargetCard.tsx` (pillar color for values, progress bar), `Dashboard/HighlightsSection.tsx` (section title, highlight values), `Dashboard/TargetDetailModal.tsx` (current value, source link) |
| INSPIRE | `#AE3A23` | `#F3E3DD` | Same components as above, using pillar color/light |
| EXCITE | `#4EB848` | `#E8F3E5` | Same components as above |
| UPLIFT | `#31B4BF` | `#E4F4F5` | Same components as above |
| INNOVATE | `#F47320` | `#FFF0E5` | Same components as above |

### Dashboard Neutral Colors (Inline Hex)

| Color Value | Purpose | Codebase Files & UI Sections Applied |
|---|---|---|
| `#071D43` | Primary dark text | `Dashboard/TargetsPanel.tsx`, `Dashboard/TargetCard.tsx`, `Dashboard/TargetDetailModal.tsx`, `Dashboard/SourceModal.tsx`, `Dashboard/CrroSummaryStrip.tsx` |
| `#667085` | Muted/secondary text | `Dashboard/TargetsPanel.tsx`, `Dashboard/TargetCard.tsx`, `Dashboard/SummaryCards.tsx`, `Dashboard/TargetDetailModal.tsx`, `Dashboard/CrroSummaryStrip.tsx`, `Dashboard/CrroSelectionCard.tsx`, `Dashboard/SourceModal.tsx`, `Dashboard/CrroLineChart.tsx` |
| `#DDE5EB` | Card borders, dividers | `Dashboard/PillarHero.tsx`, `Dashboard/TargetsPanel.tsx`, `Dashboard/TargetDetailModal.tsx`, `Dashboard/SummaryCards.tsx`, `Dashboard/PillarTabs.tsx`, `Dashboard/HighlightsSection.tsx`, `Dashboard/CrroSummaryStrip.tsx` |
| `#E2E8ED` | Card borders | `Dashboard/TargetCard.tsx`, `Dashboard/EvidenceMiniCard.tsx`, `Dashboard/ExplorerEvidence.tsx`, `Dashboard/SourceModal.tsx`, `Dashboard/CrroSelectionCard.tsx` |
| `#344257` | Medium-dark text | `Dashboard/TargetCard.tsx`, `Dashboard/HighlightsSection.tsx`, `Dashboard/SourceModal.tsx` |
| `#47566A` | Muted description text | `Dashboard/HighlightsSection.tsx` |
| `#28613F` | Pillar descriptor text | `Dashboard/PillarHero.tsx` |
| `#314056` | Body paragraph text | `Dashboard/PillarHero.tsx` |
| `#E5EBF0` | Progress bar track | `Dashboard/TargetCard.tsx` |
| `#F6F8FA` | Info card bg | `Dashboard/TargetDetailModal.tsx` |
| `#E4EAEF` | Info card border | `Dashboard/TargetDetailModal.tsx` |
| `#EEF3F6` | Close button bg | `Dashboard/TargetDetailModal.tsx` |
| `#41516A` | Subtitle text | `Dashboard/ClimateDashboardPage.tsx`, `Dashboard/ActivateDashboardPage.tsx` |
| `#D2DDE6` | Button borders | `Dashboard/ClimateDashboardPage.tsx`, `Dashboard/ActivateDashboardPage.tsx` |
| `#F2F6F8` | Button hover bg | `Dashboard/ClimateDashboardPage.tsx`, `Dashboard/ActivateDashboardPage.tsx` |
| `#5D6B7C` | Grid label text | `Dashboard/TargetCard.tsx` |
| `#6B7787` | Qualitative text | `Dashboard/TargetCard.tsx` |
| `#253148` | Card label text | `Dashboard/SummaryCards.tsx` |
| `#087F8E` | Summary card icon color | `Dashboard/SummaryCards.tsx` |
| `#E5F4F5` | Summary card tint bg | `Dashboard/SummaryCards.tsx` |
| `#E7F4EC` | Summary card tint bg | `Dashboard/SummaryCards.tsx` |
| `#E5F4F4` | Summary card tint bg | `Dashboard/SummaryCards.tsx` |
| `#FFF0E4` | Summary card tint bg | `Dashboard/SummaryCards.tsx` |
| `#34534B` | Pillar tab descriptor text | `Dashboard/PillarTabs.tsx` |
| `#006A78` | Climate CTA button bg | `Dashboard/HighlightsSection.tsx` |
| `#EDF7FB` | Climate card gradient start | `Dashboard/HighlightsSection.tsx` |
| `#DCEEF6` | Climate card gradient end | `Dashboard/HighlightsSection.tsx` |
| `#D5E5EE` | Climate card border | `Dashboard/HighlightsSection.tsx` |
| `#168E95` | Source modal disclosure border | `Dashboard/SourceModal.tsx` |
| `#F7FAFC` | Source modal disclosure bg | `Dashboard/SourceModal.tsx` |
| `#526174` | Source modal body text | `Dashboard/SourceModal.tsx` |
| `#5F6E80` | Source modal meta text | `Dashboard/SourceModal.tsx` |
| `#405065` | Source modal relevance text | `Dashboard/SourceModal.tsx` |
| `#34534B` | Pillar tab descriptor text | `Dashboard/PillarTabs.tsx` |
| `#116D72` | Source link text | `Dashboard/SourceModal.tsx`, `Dashboard/EvidenceMiniCard.tsx` |
| `#174A7E` | AR link text | `Dashboard/SourceModal.tsx` |
| `#EAF5F6` | Source link bg | `Dashboard/SourceModal.tsx`, `Dashboard/EvidenceMiniCard.tsx` |
| `#EDF2FB` | AR link bg | `Dashboard/SourceModal.tsx` |
| `#F2F4F7` | Unavailable source bg | `Dashboard/SourceModal.tsx` |
| `#F5F8FB` | Relevance bg | `Dashboard/SourceModal.tsx` |

### Puzzle Game Category Colors (`src/data/config.ts`)

| Category | Card Class | Codebase Files & UI Sections Applied |
|---|---|---|
| Company & Identity | `bg-blue-100 text-blue-600` | `QuestionDeck.tsx` (category badge), `InteractiveLeaderboard.tsx` (certification badge), `CategoryBadges.tsx` (trophy badge states) |
| Products & Solutions | `bg-teal-100 text-teal-600` | Same as above |
| Innovation, Technology & Future Growth | `bg-cyan-100 text-cyan-600` | Same as above |
| Sustainability/ESG | `bg-emerald-100 text-emerald-600` | Same as above |
| Performance & Growth | `bg-amber-100 text-amber-600` | Same as above |

### Chart Series Colors (amCharts)

| Series | Color Value | Codebase Files & UI Sections Applied |
|---|---|---|
| Social/Governance: Investment in R&D | `#a5a5a5` | `TailorMadeForYou/NonFinancial/SocialGovernanceChart.tsx` |
| Social/Governance: Investment in CSR | `#ffbf00` | Same file |
| Social/Governance: Investment in suppliers | `#4472c4` | Same file |
| Social/Governance: Avg training hours | `#5b9cd5` | Same file |
| Social/Governance: New products | `#ee7d30` | Same file |
| Social/Governance: Total audits | `#71ad47` | Same file |
| CRRO Line Chart: Low | `#4A9CD6` | `Dashboard/CrroLineChart.tsx` |
| CRRO Line Chart: High | `#E8636F` | `Dashboard/CrroLineChart.tsx` |

---

## Crossword Grid Status Colors (Tailwind Utilities)

| Status | Background Class | Text Class | Codebase Files & UI Sections Applied |
|---|---|---|---|
| `pending` | `bg-white` | (none) | `CrosswordGrid.tsx` (cell overlay) |
| `active` | `bg-blue-50` | `ring-blue-500` | `CrosswordGrid.tsx` (active cell highlight ring) |
| `completed` | `bg-green-50` | `text-green-700` | `CrosswordGrid.tsx` (correct answer cells) |
| `failed` | `bg-red-50` | `text-red-600` | `CrosswordGrid.tsx` (wrong answer cells) |
| `timeout` | `bg-gray-100` | `text-gray-400` | `CrosswordGrid.tsx` (timed-out cells) |

## Question Deck Status Colors

| Status | Background Classes | Codebase Files & UI Sections Applied |
|---|---|---|
| `pending` | `bg-white border-zinc-200` | `QuestionDeck.tsx` |
| `active` | `bg-blue-50 border-blue-400 ring-2 ring-blue-400` | `QuestionDeck.tsx` |
| `completed` | `bg-green-50 border-green-300` | `QuestionDeck.tsx` |
| `failed` | `bg-red-50 border-red-300` | `QuestionDeck.tsx` |
| `timeout` | `bg-zinc-100 border-zinc-300` | `QuestionDeck.tsx` |

---

## Timer State Colors

| Timer State | Text Color | Bar Color | Codebase Files & UI Sections Applied |
|---|---|---|---|
| Normal (>40s) | `text-content-primary` | `bg-brand-main` | `ActiveCluePanel.tsx`, `MobileTimer.tsx` |
| Help threshold (≤40s) | `text-amber-500` | `bg-amber-400` | `ActiveCluePanel.tsx`, `MobileTimer.tsx` |
| Urgent (≤10s) | `text-red-500 animate-pulse` | `bg-red-500` | `ActiveCluePanel.tsx`, `MobileTimer.tsx` |
| Paused | `text-amber-500 "(Paused)"` | (frozen) | `ActiveCluePanel.tsx`, `MobileTimer.tsx` |

---

## Leaderboard Podium Colors

| Rank | Snake Gradient | Score Text | Crown Aura | Codebase Files & UI Sections Applied |
|---|---|---|---|---|
| 1st | `conic-gradient(transparent 70%, rgba(253,224,71,1) 100%)` | `text-yellow-300` | `bg-yellow-400/50 blur-[40px]` + `shadow-[0_20px_50px_-10px_#00FFFF]` + `drop-shadow-[0_0_5px_#FFD700]` | `InteractiveLeaderboard.tsx` |
| 2nd | `conic-gradient(transparent 70%, rgba(203,213,225,1) 100%)` | `text-slate-300` | (none) | `InteractiveLeaderboard.tsx` |
| 3rd | `conic-gradient(transparent 70%, rgba(217,119,6,1) 100%)` | `text-amber-500` | (none) | `InteractiveLeaderboard.tsx` |

---

## Background Gradient Colors

| Gradient | Color Values | Codebase Files & UI Sections Applied |
|---|---|---|
| InnerPageLayout hero | `linear-gradient(180deg, #0a2a3a 0%, #0f3d4e 15%, #147385 35%, #1a6b5c 50%, #c45e20 70%, #e8943a 82%, #f5c842 92%, #fde68a 100%)` | `InnerPageLayout.tsx` (sunrise hero gradient) |
| Wave gradient | `#c45e20 → #a04420 → #7a3018 → #5a2010` | `InnerPageLayout.tsx` (SVG wave overlay) |
| Share page bg | `from-[#0d1b2a] via-[#147385] to-[#0d1b2a]` | `app/share/page.tsx` |
| OG image bg | `linear-gradient(135deg, #0d1b2a 0%, #147385 100%)` | `app/api/og/route.tsx` |
| Sun glow | `radial-gradient(circle, rgba(255,180,60,0.8) 0%, rgba(255,140,40,0.4) 40%, transparent 70%)` | `InnerPageLayout.tsx` (sun aura) |
| Sun ball | `from-amber-300 via-orange-400 to-amber-500` | `InnerPageLayout.tsx` |

---

## Badge Unlock Modal Colors

| Element | Color Value | Codebase Files & UI Sections Applied |
|---|---|---|
| Confetti particle palette | `["#147385", "#fbbf24", "#f59e0b", "#ffffff", "#34d399", "#38bdf8"]` | `BadgeUnlockModal.tsx` (confetti canvas) |
| Badge glow (yellow) | `bg-yellow-400/40 blur-xl` | `BadgeUnlockModal.tsx` |
| Badge glow (cyan) | `bg-cyan-400/30 blur-2xl` | `BadgeUnlockModal.tsx` |
| Badge circle | `from-yellow-400 to-amber-500` | `BadgeUnlockModal.tsx` |
| Badge unlocked text | `text-amber-500` | `BadgeUnlockModal.tsx` |

---

## Onboarding & Lobby Colors

| Element | Color Value | Codebase Files & UI Sections Applied |
|---|---|---|
| Onboarding page bg | `bg-brand-main` (`#147385`) | `Onboarding.tsx` |
| Form card | `border-white/20 bg-white/10 backdrop-blur-md` | `Onboarding.tsx` |
| Input focus | `border-yellow-400 focus:ring-2 focus:ring-yellow-400` | `Onboarding.tsx` |
| Start button | `bg-accent-main` (oklch amber) with `hover:shadow-[0_0_15px_rgba(250,204,21,0.5)]` | `Onboarding.tsx` |
| Error text | `text-red-400` | `Onboarding.tsx` |
| Lobby page bg | `bg-brand-main` | `InstructionLobby.tsx` |
| Lobby card icon bg | `bg-white/10 text-yellow-400` | `InstructionLobby.tsx` |
| Start button shadow | `shadow-[0_0_50px_rgba(245,197,66,0.55)]` | `InstructionLobby.tsx` |

---

## CSS Animation Colors (globals.css)

| Animation | Colors Used | Codebase Files & UI Sections Applied |
|---|---|---|
| `sun-glow` keyframes | `rgba(255,165,0,0.4)`, `rgba(255,140,0,0.2)`, `rgba(255,165,0,0.5)`, `rgba(255,140,0,0.3)` | `globals.css` `.animate-sun-glow`, `InnerPageLayout.tsx` (sun) |
| `.custom-scrollbar` | `rgba(255, 255, 255, 0.2)` thumb, `transparent` track | `globals.css` |
| `.glass-card-hover:hover` | `rgba(30, 41, 59, 0.7)` bg, `rgba(255, 255, 255, 0.2)` border | `globals.css` |

---

## OG Image Colors (Route Handler)

| Element | Color Value | Codebase Files & UI Sections Applied |
|---|---|---|
| Background gradient | `linear-gradient(135deg, #0d1b2a 0%, #147385 100%)` | `app/api/og/route.tsx` |
| Glass card | `rgba(255, 255, 255, 0.08)` bg, `rgba(255, 255, 255, 0.18)` border | `app/api/og/route.tsx` |
| "Haycarb" text | `#facc15` (yellow-400) | `app/api/og/route.tsx` |
| Score/time labels | `#facc15` | `app/api/og/route.tsx` |
| Score/time values | `#ffffff` | `app/api/og/route.tsx` |
| Stat card bg | `rgba(13, 27, 42, 0.6)` | `app/api/og/route.tsx` |
| Stat card border | `rgba(250, 204, 21, 0.4)` | `app/api/og/route.tsx` |
| Badge pill bg | `rgba(250, 204, 21, 0.1)` | `app/api/og/route.tsx` |
| Badge pill border | `rgba(250, 204, 21, 0.25)` | `app/api/og/route.tsx` |
| Divider bar | `#facc15` | `app/api/og/route.tsx` |
| Muted score text | `rgba(255, 255, 255, 0.7)` | `app/api/og/route.tsx` |

---

## Profile Page Colors

| Element | Color Value | Codebase Files & UI Sections Applied |
|---|---|---|
| Metrics band bg | `from-brand-main/5 via-brand-main/10 to-brand-main/5` | `UserProfile/MetricsBand.tsx` |
| Metric value | `text-brand-main` | `UserProfile/MetricsBand.tsx` |
| Metric label | `text-slate-500` | `UserProfile/MetricsBand.tsx` |
| Group divider | `bg-brand-main/25` | `UserProfile/MetricsBand.tsx` |
| Section divider line | `border-brand-main/30` | `UserProfile/MetricsBand.tsx` |
| Hover underline | `via-brand-main/40` | `UserProfile/MetricsBand.tsx` |
| Tab active text | `text-brand-main` | `UserProfile/UserProfileTabs.tsx` |
| Tab active indicator | `bg-brand-main` | `UserProfile/UserProfileTabs.tsx` |
| Strategy icon | `text-brand-main` | `UserProfile/GovernanceStrategySection.tsx` |
| Chairman bg blur | `bg-orange-400 opacity-30 blur-[120px]` | `UserProfile/ChairmanSection.tsx` |
| Chairman badge | `border-white/40 bg-white/70 backdrop-blur-md` | `UserProfile/ChairmanSection.tsx` |
| Chairman badge text | `text-brand-main` | `UserProfile/ChairmanSection.tsx` |
| Chairman border | `border-brand-main/50` | `UserProfile/ChairmanSection.tsx` |

---

## Color Architecture Summary

- **Primary brand**: `#147385` (teal) — used across 15+ components for buttons, progress bars, headings, and section accents
- **Accent/highlight**: oklch amber (`#facc15` approximate) — CTA buttons, badge unlock, start game
- **Status green**: `#197342` — achieved/exceeded targets
- **Status teal**: `#168E95` — on-track targets
- **Status blue**: `#526DB0` — progressing targets
- **Status orange**: `#EF7B22` — requires acceleration targets
- **Neutral dark**: `#071D43` — primary text in dashboard cards
- **Neutral muted**: `#667085` — secondary/meta text across dashboard
- **Neutral border**: `#DDE5EB` — card borders, dividers in dashboard
- **Glass surfaces**: `rgba(2, 44, 59, 0.72)` — overlays, modals, global nav
- **Pillar-specific**: RESTORE (`#009DB0`), INSPIRE (`#AE3A23`), EXCITE (`#4EB848`), UPLIFT (`#31B4BF`), INNOVATE (`#F47320`)
