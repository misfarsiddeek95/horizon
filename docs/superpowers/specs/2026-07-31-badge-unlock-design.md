# Animated Badge Unlock System — Design Spec

## Overview

Add an animated, full-screen badge unlock experience to the Horizon puzzle game: a glowing center-screen modal with confetti and sound, backed by persistent badge unlocks in `localStorage["horizon-puzzle-badges"]` and a centralized badge evaluation engine in `PuzzleContext`.

The system celebrates **two badge classes**:

1. **Category certifications** (already tracked in `GameState.earnedBadges`): one per category, earned by correctly answering every question in that category.
2. **Achievement badges** (new): Stricter Flawless, Speed Demon, First Win.

**Critical UX rule (user-approved):** the full-screen modal may only fire **at the end of the game** or **upon completing a full category**. Individual question achievements must never fire mid-game modals. If multiple badges are earned at the same moment, they are queued and shown **sequentially** (one modal per badge, each with its own confetti burst and chime) before the results overlay appears.

---

## 1. Badge Registry & Evaluation (`src/data/badges.ts`, NEW)

### Types (also added to `src/types.ts`)

```ts
export type BadgeType = 'category' | 'achievement';

export interface BadgeDefinition {
  id: string;
  type: BadgeType;
  title: string;
  description: string;
}

export interface BadgeEvaluation {
  earnedBadges: Record<Category, boolean>; // category certs earned THIS game
  phase: 'onboarding' | 'playing' | 'finished';
  allCorrect: boolean;                     // every question status === 'completed'
  aiUsedCount: number;                     // aiAssistedQuestions.length
  elapsedSeconds: number;                  // total active play time
}
```

### Badge definitions

| id | type | title | description | criteria |
|----|------|-------|-------------|----------|
| `category-<slug>` | category | e.g. `"Products & Solutions Certified"` | per-category | all questions in the category answered correctly (from `earnedBadges`) |
| `achievement-flawless` | achievement | "Flawless Run" | finish the puzzle with zero AI assists and every question correct | `phase === 'finished' && aiUsedCount === 0 && allCorrect` |
| `achievement-speed-demon` | achievement | "Speed Demon" | complete the whole puzzle within the time limit | `phase === 'finished' && elapsedSeconds <= CONFIG.SPEED_BADGE_TIME_LIMIT_SECONDS` |
| `achievement-first-win` | achievement | "First Win" | complete your first puzzle | `phase === 'finished'` and id not already persisted |

Category badge id is derived with a `getCategoryBadgeId(category)` slug helper so it never drifts from the category list.

### API

```ts
getCategoryBadgeId(category: Category): string;
getBadgeDefinition(id: string): BadgeDefinition;
getUnlockedBadges(): string[];                 // read "horizon-puzzle-badges" (SSR-safe)
markUnlocked(id: string): boolean;             // append + persist; returns true if newly added
evaluateBadges(input: BadgeEvaluation): string[]; // centralized; returns NEWLY-earned ids only
```

`evaluateBadges` computes every badge whose criteria is satisfied by the input, filters out ids already returned by `getUnlockedBadges()`, and returns the remainder (category certs plus any satisfiable achievements). Because `markUnlocked` persists synchronously, the queue can never contain a duplicate, even when a final-question category cert and achievements are evaluated in the same tick.

**Persistence format:** `horizon-puzzle-badges` = JSON `string[]` of badge ids.

---

## 2. Sound Utility (`src/utils/sound.ts`, NEW)

- `isMuted(): boolean` — reads `localStorage["horizon-puzzle-muted"]` (`'1'` / `'0'`), SSR-safe (`typeof window` guard).
- `setMuted(value: boolean): void` — writes the same key.
- `playBadgeUnlockSound(): void` — no-ops when muted; caches a single `Audio('/sounds/badge-unlock.mp3')` instance; resets `currentTime = 0` before replay; wraps `.play()` in `.catch()` so browser autoplay-policy rejections are swallowed without breaking the game.

### Audio asset (`public/sounds/badge-unlock.mp3`, NEW)

A ~1.2 s two-note arpeggio chime synthesized with `ffmpeg` (layered sine oscillators with exponential decay, pitched to fit the teal/gold brand), written to `public/sounds/badge-unlock.mp3`. Command documented in the implementation plan.

---

## 3. Context State & Actions (`src/types.ts`, `src/context/PuzzleContext.tsx`)

### New `GameState` fields

```ts
badgeQueue: string[];   // badge ids queued for display (transient, not persisted)
isMuted: boolean;       // mirrors localStorage "horizon-puzzle-muted"
elapsedSeconds: number; // total active (non-paused) play time this game
```

`SavedGameState` gains `elapsedSeconds` (accurate Speed Demon timing on restore). `badgeQueue` is deliberately **not** persisted (transient; a mid-modal reload loses the queue but the badge is already safely persisted). `isMuted` is a global preference and is **not** part of saved game state — it is always initialized from localStorage on provider mount.

### New reducer actions

```ts
| { type: 'ENQUEUE_BADGES'; payload: { badgeIds: string[] } }
| { type: 'DISMISS_BADGE' }          // shifts badgeQueue[0]
| { type: 'TOGGLE_MUTE' }            // flips isMuted + persists
| { type: 'TICK_GAME_CLOCK' }        // increments elapsedSeconds
```

`START_GAME` / `RESTART_GAME` reset `badgeQueue: []`, `elapsedSeconds: 0`; `RESTORE_GAME` restores `elapsedSeconds`; `RESET` returns to `initialState` (badgeQueue `[]`, elapsedSeconds `0`, isMuted read on mount).

### Game clock effect

A `setInterval` ticking `TICK_GAME_CLOCK` every second while `phase === 'playing' && !isPaused` (independent of `activeIndex`). Paused time and tab-hidden time are excluded so Speed Demon is fair. Effect cleaned up on dependency change.

### Central badge evaluation effect

Watches `[state.earnedBadges, state.phase]` (plus the scalar values it consumes). On each change it builds a `BadgeEvaluation` from current state and dispatches `ENQUEUE_BADGES` with the result of `evaluateBadges(...)`, calling `markUnlocked(id)` for each returned id first.

- **Mid-game:** only category certs are satisfiable → they enqueue the moment a category is completed (per UX rule).
- **Game end:** achievements become satisfiable; a cert earned on the final question is already persisted by the same effect's earlier tick, so it is not double-enqueued.

Because persistence happens in the effect before enqueue, evaluation is idempotent across re-renders.

### Mute state

On provider mount, `isMuted` is initialized from `isMuted()` (localStorage) via a small effect dispatching a setter action (avoid SSR localStorage access at module scope). `TOGGLE_MUTE` persists immediately. Context is the single source of truth consumed by both the header and onboarding toggles.

---

## 4. `BadgeUnlockModal` (`src/components/BadgeUnlockModal.tsx`, NEW)

### Positioning (STRICT)

```html
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
```

Guarantees the badge is dead-center on every screen size.

### Entrance animation

- Wrapper mounts at `scale-0` and transitions to `scale-100` via a mount effect + `requestAnimationFrame`.
- Classes: `transition-transform duration-500` with the spring-like back-out bezier `ease-[cubic-bezier(0.34,1.56,0.64,1)]`.
- Behind the badge icon: concentric glowing rings (`animate-ping` + `animate-pulse`) built from radial gradients, tinted by the badge's category color (certs) or gold (achievements).

### Badge display

- Large badge icon: `CheckBadgeIcon` / `TrophyIcon` (heroicons, already used by the app) inside a circular gradient disc. Certs reuse the category color mapping from `CATEGORY_COLORS` (gold/amber for the earned state as in `CategoryBadges.tsx`); achievements use a gold-to-amber gradient.
- Bold badge title (`font-heading`), description text, and a prominent **"Awesome!"** close button (`bg-brand-main hover:bg-brand-hover text-content-inverse`, `rounded-ui-element`).

### Confetti (inline canvas, NEW `ConfettiBurst` sub-component)

- A `fixed inset-0 z-[60] pointer-events-none` `<canvas>` sized to the viewport.
- On mount, spawns ~120 particles from the screen center with random initial velocity, gravity, and spin; teal/gold/white palette; `requestAnimationFrame` physics loop; auto-cleanup and canvas unmount after ~2.5 s.
- No external dependency (user-approved inline fallback).

### Audio

- Calls `playBadgeUnlockSound()` in a mount effect.

### Dismissal

- "Awesome!" button → `onClose`.
- `Escape` key → `onClose` (keydown listener).
- Backdrop click → `onClose` (only when the click target is the backdrop itself, not the card).
- A11y: `role="dialog"`, `aria-modal="true"`, `aria-label` describing the unlocked badge.

### Props

```ts
{ badge: BadgeDefinition; onClose: () => void }
```

---

## 5. Mute Toggle (`src/components/MuteToggle.tsx`, NEW)

- A compact icon button (heroicons `SpeakerWaveIcon` / `SpeakerXMarkIcon`) reading `isMuted` from `usePuzzle()` and dispatching `TOGGLE_MUTE`.
- Rendered in two places:
  1. **Puzzle header** (`puzzle/page.tsx`) — next to the Restart button.
  2. **Onboarding** (`src/components/Onboarding.tsx`) — a sound-setting row before the start button.
- Both controls share context state → same `horizon-puzzle-muted` key; preference persists globally.

---

## 6. Page Integration (`src/app/(ui)/puzzle/page.tsx`)

- Render the modal when `state.badgeQueue.length > 0`:

```tsx
{state.badgeQueue[0] && (
  <BadgeUnlockModal
    key={state.badgeQueue[0]}
    badge={getBadgeDefinition(state.badgeQueue[0])}
    onClose={() => dispatch({ type: 'DISMISS_BADGE' })}
  />
)}
```

- `key={state.badgeQueue[0]}` forces a full remount per badge → each queued badge gets a fresh confetti burst + chime.
- `ResultsOverlay` renders only when `phase === 'finished' && state.badgeQueue.length === 0` — badges play out first, then results.
- Add `<MuteToggle />` to the header row.
- `PuzzleGame` already calls `dispatch` via `usePuzzle()`; the modal close dispatches `DISMISS_BADGE`.

---

## 7. Config (`src/data/config.ts`)

```ts
SPEED_BADGE_TIME_LIMIT_SECONDS: 180,
```

---

## 8. Edge Cases

- **Multiple simultaneous unlocks** → sequential modals; each badge gets its own confetti + sound; queue drains via `DISMISS_BADGE`.
- **Already-unlocked badge** → filtered by `evaluateBadges`; never re-triggers.
- **Muted** → modal + confetti still show; only audio suppressed.
- **Autoplay blocked** → `.catch()` swallows; game unaffected.
- **SSR/localStorage** → all storage access guarded by `typeof window`.
- **Reload mid-modal** → transient queue lost; badge already persisted → will not re-trigger (user-accepted).
- **Restored game** → `elapsedSeconds` restored so Speed Demon stays fair; `badgeQueue` empty.
- **Stricter Flawless** → requires every question `'completed'` AND zero AI assists; a failed/timeout question disqualifies it.
- **Speed Demon fairness** → paused/tab-hidden time excluded from `elapsedSeconds`.

---

## 9. Files Changed

| File | Change |
|------|--------|
| `src/data/badges.ts` | NEW — badge registry, persistence, `evaluateBadges` |
| `src/utils/sound.ts` | NEW — mute persistence + SFX playback |
| `src/components/BadgeUnlockModal.tsx` | NEW — modal + inline `ConfettiBurst` |
| `src/components/MuteToggle.tsx` | NEW — shared toggle |
| `src/types.ts` | Add `BadgeType`, `BadgeDefinition`, `BadgeEvaluation`; extend `GameState`/`SavedGameState`; new actions |
| `src/context/PuzzleContext.tsx` | Queue state, eval effect, game clock, mute action |
| `src/app/(ui)/puzzle/page.tsx` | Modal render, results gating, header toggle |
| `src/components/Onboarding.tsx` | Sound toggle |
| `src/data/config.ts` | `SPEED_BADGE_TIME_LIMIT_SECONDS` |
| `public/sounds/badge-unlock.mp3` | NEW — ffmpeg-generated chime |

No changes to `src/data/results.json` (badges already persisted there) or the API route.
