# Instruction Lobby — Design Spec

## Overview

Add an **Instruction Lobby** screen shown between onboarding and the crossword grid. It renders a comprehensive pre-game guide (all rules visible at a glance — no accordions/tabs), lets the player configure audio via the shared `MuteToggle`, and gates the game behind an explicit **Start Game** button. The timer and grid are never initialized until that button is clicked.

The codebase already implements most of the supporting mechanics (5 categories × 3 questions = 15, `START_GAME`, phase-guarded clocks, 50% AI penalty, badge evaluation, autosave). This spec's scope is the `idle` phase, the lobby component, and the flow wiring.

**Critical UX rules (user-approved):**

1. **Fresh sessions land on the lobby.** New players (or returners with a saved session but no mid-game state) must pass through the InstructionLobby and click Start Game before the grid mounts or any clock starts.
2. **Mid-game restores bypass the lobby.** A user who refreshes/closes the tab mid-game is restored directly into the active grid, and `TICK_GAME_CLOCK` resumes correctly from the restored `elapsedSeconds`.
3. **Restart drops back to the lobby.** Clicking Restart wipes all progress and returns to the lobby (session preserved), rather than restarting the clock immediately.
4. **Lobby is readable in portrait.** The landscape-only gate stays applied to the grid; the lobby renders on any orientation.

---

## 1. State Machine (`src/types.ts`)

### Phase union

```ts
phase: 'onboarding' | 'idle' | 'playing' | 'finished';
```

`idle` is the lobby phase. `GameState` gains no new fields.

### Action changes

```ts
| { type: 'ENTER_LOBBY'; payload: SessionData }   // NEW
| { type: 'RESTART_GAME' }                        // payload removed
```

- **`ENTER_LOBBY`** — stores the session, sets phase `'idle'`, and clears all game data (questions, grid, placements, score, timer). Critically, **no grid is generated** here; that guarantees the timer/grid stay uninitialized in the lobby.
- **`START_GAME`** — unchanged. Generates the grid and flips `idle → playing`. The reducer has no phase guard on it, so it already works from `idle`.
- **`RESTART_GAME`** — now takes no payload. Keeps the session, wipes all progress, sets phase `'idle'` (lands on the lobby). The fresh grid is generated only when the user clicks Start Game.
- `BadgeEvaluation.phase` derives from `GameState['phase']` and picks up `'idle'` automatically.

---

## 2. Context (`src/context/PuzzleContext.tsx`)

### New / changed callbacks

```ts
enterLobby(session: SessionData): void   // NEW — persists session to localStorage, dispatches ENTER_LOBBY
startGame(): void                        // signature changed — no session arg; reads sessionRef.current
restartGame(): void                      // drops saved game state, dispatches RESTART_GAME (→ lobby)
```

- `startGame()` is now called only by the lobby's Start Game button. It runs `initializeGame()` and dispatches `START_GAME` with the current session from `sessionRef.current`.
- `Onboarding.onStart` now wires to `enterLobby` instead of `startGame`.

### Reducer cases

- **`ENTER_LOBBY`**: `{ ...state, phase: 'idle', session, questions: [], gridCells: [], wordPlacements: [], score: 0, categoryCounts: defaults, earnedBadges: defaults, timerRemaining: 60, activeIndex: null, gridWidth: 0, gridHeight: 0, isPaused: false, aiAssistedQuestions: [], answerHistory: [], badgeQueue: [], elapsedSeconds: 0 }`. Preserves `isMuted`.
- **`RESTART_GAME`**: same shape as `ENTER_LOBBY` but keeps the existing session (`state.session`) instead of a payload. Phase `'idle'`.
- **`START_GAME`**: unchanged.

### Mount auto-restore (priority order, unchanged first branch)

1. `horizon-puzzle-game-state` exists → `RESTORE_GAME` (straight into the grid; `TICK_GAME_CLOCK` resumes because `phase === 'playing'` and `isPaused` is false, and `elapsedSeconds` comes from the saved payload).
2. `horizon-puzzle-session` exists → `enterLobby(session)` (previously auto-started into `playing`).
3. Neither → `onboarding`.

### Clock safety

No changes required — both intervals are already phase-guarded:
- `TICK_TIMER`: fires only while `activeIndex !== null && phase === 'playing'`.
- `TICK_GAME_CLOCK`: fires only while `phase === 'playing' && !isPaused`.

Both are structurally dead in `idle`.

---

## 3. `InstructionLobby` (`src/components/InstructionLobby.tsx`, NEW)

Client component. Reads `state.session` for the greeting and `startGame()` from `usePuzzle()`.

### Styling (STRICT token rule)

- Page background: `bg-brand-main` (teal), matching the leaderboard's dark theme.
- Glass cards: `bg-surface-glass backdrop-blur-lg border border-white/20 shadow-2xl rounded-ui-card`.
- Content text: `text-white` / `text-white/70` (inverse-on-dark, same family as leaderboard). Headings use `font-heading` (global `h*` rule already applies).
- Gold accents (icons, highlights): `text-accent-main`; emphasis borders use `border-accent-main/40`.
- The Start Game button is the single glowing CTA: `bg-accent-main` (gold) with a gold glow shadow (`shadow-[0_0_...]`), `rounded-ui-element`, large padding, `hover:` brightness shift. Raw values only for the glow/opacity/conditional cases (allowed exceptions).

### Layout

```
page (bg-brand-main, min-h-screen, centered, px-4, py-8..12, max-w-4xl)
├── Header — title + player greeting
├── Card grid — grid-cols-1 md:grid-cols-2 gap-4
│    ├── 1. Board & Cards
│    ├── 2. AI Assist Penalty   (gold-highlighted border)
│    ├── 3. Badges
│    ├── 4. Leaderboard & Scoring
│    └── 5. Game Controls
└── Footer — MuteToggle + massive glowing Start Game button
```

### Card content (matches current config exactly)

1. **Board & Cards** (`Squares2X2Icon`) — "5 categories, 3 questions each — 15 questions total. Click a question card to select it and answer in any order."
2. **AI Assist Penalty** (`SparklesIcon`, gold emphasis) — "Stuck? The 'Need Help?' button provides AI assistance, but it costs 50% of that word's points."
3. **Badges** (`TrophyIcon`) — "Answer all 3 questions in a category to earn a Certification Badge. Play perfectly or quickly to unlock special hidden achievements."
4. **Leaderboard & Scoring** (`ChartBarIcon`) — "Correct answers earn points (base + time bonus). The leaderboard tracks the top global scores."
5. **Game Controls** (`Cog8ToothIcon`) — three bullets: Refresh = safe, progress auto-saved; Restart = wipes all progress and starts fresh; Speaker icon = mutes/unmutes game SFX.

### Footer

- `MuteToggle` inline (prominent, "configure audio before starting").
- **Start Game** button — massive, glowing, dispatches via `startGame()`. On click the lobby unmounts, the grid mounts, and the clocks start.

---

## 4. Page Integration (`src/app/(ui)/puzzle/page.tsx`)

```tsx
if (state.phase === 'onboarding') return <Onboarding onStart={enterLobby} />;
if (state.phase === 'idle')      return <InstructionLobby />;
// playing / finished → existing grid layout (unchanged)
```

- `idle` renders the lobby **without** the `forceLandscape` gate — instructions stay readable in portrait. The gate remains on the grid/playing layout.
- Header Restart button unchanged — it now dispatches `restartGame()`, which returns to the lobby.

---

## 5. Edge Cases

- **Mid-game refresh** → restored into the grid; clock resumes from restored `elapsedSeconds`.
- **Returning player, no mid-game save** → lands on lobby, not the grid.
- **Restart** → wipes progress, returns to lobby; grid regenerates on the next Start click.
- **Lobby refresh** → session persists; user returns to the lobby (no mid-game state exists yet).
- **Mute preference** → shared with header/onboarding via context; persists globally.
- **`startGame` with null session** → impossible in practice (lobby only renders with a session); `sessionRef.current!` non-null assertion mirrors existing `RESTART_GAME` usage.

---

## 6. Files Changed

| File | Change |
|------|--------|
| `src/types.ts` | Add `'idle'` to phase union; add `ENTER_LOBBY` action; drop `RESTART_GAME` payload |
| `src/context/PuzzleContext.tsx` | `enterLobby`, `startGame()` signature, `restartGame()`; `ENTER_LOBBY`/`RESTART_GAME` reducers; mount restore → lobby |
| `src/components/InstructionLobby.tsx` | NEW — lobby with glass card grid, MuteToggle, Start Game |
| `src/app/(ui)/puzzle/page.tsx` | `idle` branch renders lobby; onboarding wired to `enterLobby` |
