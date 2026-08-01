# Mobile App-Style Single Viewport Layout

**Date:** 2026-08-01
**Status:** Approved
**Goal:** Eliminate page-level scrolling on mobile/tablet (`< lg:` breakpoint). Lock the puzzle UI to a `100dvh` CSS Grid with dedicated zones for the grid, clue, and actions.

---

## Golden Rule: Desktop Immunity

The desktop layout (triggered at `lg:` breakpoint and above) is flawless. All mobile structural changes are strictly quarantined using Tailwind's default mobile-first classes and completely disabled using `lg:` prefixes.

- No JavaScript-based viewport scaling (no `ResizeObserver`, no inline `transform: scale()`).
- All mobile changes use only CSS classes with `lg:` overrides.

---

## Current Desktop DOM Structure (Must Not Change)

```
<main className="flex flex-col p-4 sm:p-6 lg:p-12 overflow-x-hidden">
  <div className="flex flex-col sm:flex-row ...">  ← Header
  </div>
  <CategoryBadges />
  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">  ← Content wrapper
    <div className="w-full lg:w-3/5 ...">  ← CrosswordGrid
    </div>
    <div className="w-full lg:w-2/5 ...">  ← Sidebar (ActiveCluePanel + QuestionDeck)
    </div>
  </div>
  {ResultsOverlay} {BadgeUnlockModal}
</main>
```

---

## New Component 1: `MobileClueBar.tsx`

**File:** `src/components/MobileClueBar.tsx`
**Wrapper:** `block lg:hidden` — never renders on desktop.

### Layout
```
┌─────────────────────────────────────────────┐
│ [◀]  [Category Pill]  3 · Down             │
│      Clue text goes here and truncates...   │ [▶]
└─────────────────────────────────────────────┘
```

### Details
- Container: `bg-white/10 backdrop-blur-md border border-white/20 rounded-ui-element px-3 py-2 z-50`
- **Category pill:** `text-[10px] rounded-full px-2 py-0.5 truncate max-w-[120px]` — uses `CATEGORY_COLORS` from `config.ts`
- **Clue number + direction:** `text-yellow-400 text-xs font-semibold` — e.g. "3 · Down"
- **Clue text:** `text-sm text-content-primary leading-snug line-clamp-2`
- **Nav buttons** (`<` / `>`): absolute-positioned on left/right edges, `text-white/60 hover:text-white`, `disabled:opacity-30`
- **State consumed:** `activeIndex`, `questions`, `wordPlacements` from `usePuzzle()`
- **When no question active:** Shows "Select a question" in muted text
- **Nav logic:** Cycles to next/prev `pending` question index (wraps around). Dispatches `SELECT_QUESTION`. Disabled when no pending questions remain or game is paused.

---

## New Component 2: `MobileActionStrip.tsx`

**File:** `src/components/MobileActionStrip.tsx`
**Wrapper:** `block lg:hidden` — never renders on desktop.

### Layout
```
┌─────────────────────────────────────────────┐
│  [ Submit Answer (flex-1) ]  [Need Help?]    │
└─────────────────────────────────────────────┘
```

### Details
- Container: `fixed bottom-0 inset-x-0 bg-surface-glass backdrop-blur-lg border-t border-white/20 px-4 pb-safe pt-3 z-50`
- **Submit button:** `flex-1 bg-brand-main text-content-inverse py-3 rounded-ui-element font-semibold text-sm`, disabled when not all cells filled or paused
- **Help button:** `bg-amber-100 text-amber-700 px-4 py-3 rounded-ui-element font-semibold text-sm`, only visible when `timerRemaining <= 40 && timerRemaining > 0 && !isPaused`
- **Props:** Receives `onSubmit` and `onHelp` callback props
- **Safe area:** `pb-safe` ensures spacing above mobile OS home bars

---

## Mobile CSS Grid in `page.tsx`

### `<main>` wrapper changes

**Mobile (default classes):**
```
grid grid-rows-[auto_1fr_auto_auto] h-[100dvh] w-full overflow-hidden p-2
```

**Desktop reset (`lg:` classes):**
```
lg:flex lg:flex-col lg:h-auto lg:min-h-screen lg:overflow-visible lg:p-12
```

### Grid Row Mapping

| Row | Content | Mobile Classes | Desktop Classes |
|-----|---------|----------------|-----------------|
| 1 | Header (score, timer, icon-only controls) | `flex items-center justify-between px-1 py-2 shrink-0` | `lg:flex lg:items-center lg:justify-between lg:gap-4 lg:mb-8` |
| 2 | CrosswordGrid + Sidebar wrapper | `flex items-center justify-center min-h-0 min-w-0 overflow-auto` | `lg:block lg:w-full` |
| 3 | `<MobileClueBar />` | rendered directly | `hidden lg:hidden` (component handles) |
| 4 | `<MobileActionStrip />` | rendered directly | `hidden lg:hidden` (component handles) |

### Desktop Column Layout (inside Row 2 wrapper)

On `lg:`, the inner content div retains its current structure:
```
<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
  <div className="w-full lg:w-3/5 ...">CrosswordGrid</div>
  <div className="w-full lg:w-2/5 ...">ActiveCluePanel + QuestionDeck</div>
</div>
```

---

## Hide Desktop UI on Mobile

- **CategoryBadges:** `hidden lg:block`
- **ActiveCluePanel:** `hidden lg:block` (inside sidebar div)
- **QuestionDeck:** `hidden lg:block` (inside sidebar div)

---

## Mobile Header Simplification

The header (Row 1) on mobile becomes a single compact row:

```
[Name · Score: 3/8]        [Timer: 45s] [🔇][✕][↻][🏆]
```

- **Timer:** Displayed prominently, using urgency coloring (red pulse at ≤10s, amber at ≤40s)
- **Score:** Left side, compact format
- **Controls:** Icon-only buttons (no text labels), `w-8 h-8` touch targets
- **Must not wrap:** `flex-nowrap whitespace-nowrap` enforced
- **Restart button:** On mobile, show only the `ArrowPathIcon` (no "Restart" text)

---

## State Wiring

No new reducer actions needed. Both new components consume existing state:

- **MobileClueBar:** `activeIndex`, `questions`, `wordPlacements` (for clue text, direction, category)
- **MobileActionStrip:** `onSubmit` → `dispatch({ type: 'SUBMIT_ANSWER' })`, `onHelp` → opens `/chat-help` and dispatches `USE_AI_ASSIST`
- **Header timer:** Reads `timerRemaining`, `activeQ.question.timeLimit`, `isPaused` from state

---

## Desktop Immunity Verification Checklist

After implementation, verify:
1. `lg:` breakpoint shows the original flexbox layout with sidebar
2. CategoryBadges visible on desktop
3. ActiveCluePanel + QuestionDeck visible on desktop
4. No `ResizeObserver`, no `transform: scale()`, no JS-based viewport manipulation
5. Grid cell sizes remain 48px on desktop (controlled by `--cell-size` CSS variable)
6. `<main>` on desktop is `flex flex-col` (same as current)
7. Inner content div on desktop is `flex flex-row` (same as current)
