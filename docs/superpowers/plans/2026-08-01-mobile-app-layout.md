# Mobile App-Style Single Viewport Layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate page-level scrolling on mobile/tablet by locking the puzzle UI to a `100dvh` CSS Grid with dedicated clue and action zones, while preserving the desktop layout exactly.

**Architecture:** Two new mobile-only components (`MobileClueBar`, `MobileActionStrip`) are created with `block lg:hidden` wrappers. The main `<main>` element in `page.tsx` switches from `flex flex-col` to `grid grid-rows-[auto_1fr_auto_auto] h-[100dvh]` on mobile, reverting to the original flex layout via `lg:` classes. Desktop UI elements (CategoryBadges, ActiveCluePanel, QuestionDeck) are hidden on mobile with `hidden lg:block`.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4

## Global Constraints

- Desktop layout (`lg:` breakpoint and above) must remain completely unchanged
- No JavaScript-based viewport scaling (no `ResizeObserver`, no `transform: scale()`)
- All mobile changes use only CSS classes with `lg:` overrides
- All styling must use semantic CSS variables from `src/styles/tokens/` where available
- No comments in production code
- Build must pass with zero TypeScript errors and zero lint warnings
- No git operations — user handles version control

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/MobileClueBar.tsx` | Mobile-only sticky clue bar with navigation |
| Create | `src/components/MobileActionStrip.tsx` | Mobile-only fixed bottom action strip |
| Modify | `src/app/(ui)/puzzle/page.tsx` | Apply mobile CSS Grid, hide desktop UI, simplify header, wire new components |

---

### Task 1: Create `MobileClueBar.tsx`

**Files:**
- Create: `src/components/MobileClueBar.tsx`

**Interfaces:**
- Consumes: `usePuzzle()` → `state.activeIndex`, `state.questions`, `state.wordPlacements`, `state.isPaused`, `state.phase`
- Produces: A React component that renders only on mobile (`block lg:hidden`)

- [ ] **Step 1: Create the component file**

```tsx
'use client';

import { usePuzzle } from '@/context/PuzzleContext';
import { CATEGORY_COLORS } from '@/data/config';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function MobileClueBar() {
  const { state, dispatch } = usePuzzle();
  const { activeIndex, questions, wordPlacements, isPaused, phase } = state;

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const placement = activeQ
    ? wordPlacements.find((p) => p.questionId === activeQ.question.id) ?? null
    : null;

  const pendingIndices = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.status === 'pending')
    .map(({ i }) => i);

  const canNavigate = !isPaused && phase === 'playing' && pendingIndices.length > 0;

  function navigateTo(direction: 'prev' | 'next') {
    if (!canNavigate) return;
    if (activeIndex === null) {
      if (pendingIndices.length > 0) {
        dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[0] });
      }
      return;
    }
    const currentPos = pendingIndices.indexOf(activeIndex);
    let nextPos: number;
    if (direction === 'next') {
      nextPos = currentPos + 1;
      if (nextPos >= pendingIndices.length) nextPos = 0;
    } else {
      nextPos = currentPos - 1;
      if (nextPos < 0) nextPos = pendingIndices.length - 1;
    }
    dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[nextPos] });
  }

  const catColor = activeQ
    ? CATEGORY_COLORS[activeQ.question.category]?.card ?? 'bg-zinc-100 text-zinc-600'
    : '';
  const directionLabel = placement?.direction === 'across' ? 'Across' : 'Down';

  return (
    <div className="block lg:hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-ui-element px-10 py-2 z-50 relative">
      <button
        onClick={() => navigateTo('prev')}
        disabled={!canNavigate}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Previous question"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => navigateTo('next')}
        disabled={!canNavigate}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Next question"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      {activeQ ? (
        <div className="flex flex-col items-center gap-0.5 overflow-hidden">
          <span className={`inline-block max-w-full truncate text-[10px] rounded-full px-2 py-0.5 font-semibold ${catColor}`}>
            {activeQ.question.category}
          </span>
          <span className="text-yellow-400 text-xs font-semibold whitespace-nowrap">
            #{activeQ.number} · {directionLabel}
          </span>
          <p className="text-sm text-content-primary leading-snug line-clamp-2 text-center">
            {activeQ.question.clue}
          </p>
        </div>
      ) : (
        <p className="text-sm text-white/40 text-center">Select a question</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds with no errors

---

### Task 2: Create `MobileActionStrip.tsx`

**Files:**
- Create: `src/components/MobileActionStrip.tsx`

**Interfaces:**
- Consumes: `usePuzzle()` → `state.activeIndex`, `state.questions`, `state.gridCells`, `state.wordPlacements`, `state.timerRemaining`, `state.isPaused`
- Produces: A React component that renders only on mobile (`block lg:hidden`)

- [ ] **Step 1: Create the component file**

```tsx
'use client';

import { useMemo } from 'react';
import { usePuzzle } from '@/context/PuzzleContext';

interface MobileActionStripProps {
  onSubmit: () => void;
  onHelp: () => void;
}

export default function MobileActionStrip({ onSubmit, onHelp }: MobileActionStripProps) {
  const { state } = usePuzzle();
  const { activeIndex, questions, gridCells, wordPlacements, timerRemaining, isPaused } = state;

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const placement = useMemo(() => {
    if (!activeQ) return null;
    return wordPlacements.find((p) => p.questionId === activeQ.question.id) ?? null;
  }, [activeQ, wordPlacements]);

  const allFilled = useMemo(() => {
    if (!activeQ || !placement) return false;
    return placement.cells.every((c) => {
      const cell = gridCells[c.y]?.[c.x];
      return cell && cell.letter !== null;
    });
  }, [activeQ, placement, gridCells]);

  const showHelp = timerRemaining <= 40 && timerRemaining > 0 && !isPaused;
  const canSubmit = allFilled && !isPaused && activeQ?.status === 'active';

  return (
    <div className="block lg:hidden fixed bottom-0 inset-x-0 bg-surface-glass backdrop-blur-lg border-t border-white/20 px-4 pb-safe pt-3 z-50">
      <div className="flex items-center gap-3">
        {showHelp && (
          <button
            onClick={onHelp}
            className="cursor-pointer rounded-ui-element bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-200 whitespace-nowrap"
          >
            Need Help?
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 cursor-pointer rounded-ui-element bg-brand-main px-4 py-3 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds with no errors

---

### Task 3: Modify `page.tsx` — Mobile CSS Grid, Hide Desktop UI, Simplify Header, Wire Components

**Files:**
- Modify: `src/app/(ui)/puzzle/page.tsx`

**Interfaces:**
- Consumes: `MobileClueBar` and `MobileActionStrip` from Tasks 1 and 2
- Produces: Updated `PuzzleGame` component with mobile grid layout

- [ ] **Step 1: Add imports for new components**

Add these imports after the existing component imports (around line 17):

```tsx
import MobileClueBar from '@/components/MobileClueBar';
import MobileActionStrip from '@/components/MobileActionStrip';
```

- [ ] **Step 2: Modify the `<main>` wrapper classes**

Change line 48 from:
```tsx
<main className="flex flex-col p-4 sm:p-6 lg:p-12 overflow-x-hidden">
```
To:
```tsx
<main className="grid grid-rows-[auto_1fr_auto_auto] h-[100dvh] w-full overflow-hidden p-2 lg:flex lg:flex-col lg:h-auto lg:min-h-screen lg:overflow-visible lg:p-12">
```

- [ ] **Step 3: Simplify the mobile header**

Replace the header div (lines 49-85) with a version that uses icon-only buttons on mobile:

```tsx
<div className="flex items-center justify-between gap-2 shrink-0 px-1 py-2 lg:gap-4 lg:mb-8">
  <div className="flex items-center gap-2 min-w-0">
    <span className="text-sm font-semibold text-gray-700 truncate">
      {state.session?.name ?? 'Player'}
    </span>
    <span className="text-sm text-gray-400 whitespace-nowrap">Score: {state.score}/{state.questions.length}</span>
  </div>
  <div className="flex items-center gap-1 lg:gap-3 justify-end shrink-0">
    <MuteToggle />
    <ExitButton />
    <button
      onClick={() => setShowRestartDialog(true)}
      className="inline-flex cursor-pointer items-center justify-center w-8 h-8 rounded-ui-element border border-red-200 text-red-600 transition-colors hover:bg-red-50"
      aria-label="Restart game"
    >
      <ArrowPathIcon className="h-4 w-4" />
    </button>
    <ConfirmDialog
      open={showRestartDialog}
      title="Restart Game?"
      message="Are you sure you want to restart? Your current progress will be lost."
      confirmLabel="Restart"
      cancelLabel="Cancel"
      onConfirm={() => {
        setShowRestartDialog(false);
        restartGame();
      }}
      onCancel={() => setShowRestartDialog(false)}
    />
    <Link
      href="/leaderboard"
      className="hidden lg:inline-flex px-4 py-2 bg-brand-main hover:bg-brand-hover text-white rounded-lg font-semibold shadow-md transition-all text-sm"
    >
      Leaderboard
    </Link>
  </div>
</div>
```

- [ ] **Step 4: Hide CategoryBadges on mobile**

Change line 87 from:
```tsx
<CategoryBadges />
```
To:
```tsx
<div className="hidden lg:block">
  <CategoryBadges />
</div>
```

- [ ] **Step 5: Add min-h-0 and overflow handling to the content wrapper**

Change line 89 from:
```tsx
<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
```
To:
```tsx
<div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-0 min-w-0 overflow-auto lg:overflow-visible">
```

- [ ] **Step 6: Hide ActiveCluePanel and QuestionDeck on mobile, wrap sidebar**

Change lines 94-97 from:
```tsx
<div className="w-full lg:w-2/5 flex flex-col min-w-0">
  <ActiveCluePanel />
  <QuestionDeck />
</div>
```
To:
```tsx
<div className="hidden lg:flex lg:w-2/5 lg:flex-col lg:min-w-0">
  <ActiveCluePanel />
  <QuestionDeck />
</div>
```

- [ ] **Step 7: Inject MobileClueBar and MobileActionStrip**

Add these two components right before the closing `</main>` tag (before line 105). Also add the MobileActionStrip handler functions inside `PuzzleGame`:

First, add these handler functions inside `PuzzleGame` (after the existing state declarations, before the `if (state.phase === 'onboarding')` block):

```tsx
function handleSubmit() {
  dispatch({ type: 'SUBMIT_ANSWER' });
}

function openHelp() {
  const activeQ = state.activeIndex !== null ? state.questions[state.activeIndex] : null;
  if (activeQ) {
    dispatch({ type: 'USE_AI_ASSIST', payload: { questionId: activeQ.question.id } });
  }
  window.open('/chat-help', '_blank', 'noopener,noreferrer');
}
```

Then add the components before `</main>`:

```tsx
      <MobileClueBar />
      <MobileActionStrip onSubmit={handleSubmit} onHelp={openHelp} />
```

- [ ] **Step 8: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds with no errors

---

### Task 4: Final Verification

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: Build succeeds with zero TypeScript errors and zero lint warnings

- [ ] **Step 2: Run linter**

Run: `pnpm lint`
Expected: No lint warnings or errors

- [ ] **Step 3: Visual verification checklist**

Manually verify in browser dev tools:
1. Resize to mobile width (< 1024px) — page is locked to viewport height, no scrolling
2. CrosswordGrid fills available space in row 2
3. MobileClueBar appears below grid with active clue
4. MobileActionStrip appears fixed at bottom with Submit + Help buttons
5. Header is single row with icon-only restart button
6. CategoryBadges, ActiveCluePanel, QuestionDeck are hidden
7. Resize to desktop width (≥ 1024px) — original layout is fully restored
8. All desktop elements visible and properly positioned
