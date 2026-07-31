# Animated Badge Unlock System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated, full-screen badge unlock experience (glowing modal, inline-canvas confetti, MP3 chime, persistent unlocks) to the Horizon puzzle game.

**Architecture:** A centralized badge engine lives in `PuzzleContext`: a `badgeQueue` in reducer state is fed by a single evaluation effect that calls `evaluateBadges()` from `src/data/badges.ts` (which persists newly-earned ids to `localStorage["horizon-puzzle-badges"]`). `BadgeUnlockModal` is a dumb display component; the puzzle page renders it keyed by the queue head so each queued badge fully remounts (fresh confetti + sound) and the results overlay is gated until the queue drains. A game clock (`elapsedSeconds`, pausing excluded) powers the Speed Demon badge; a shared `isMuted` context state (persisted to `localStorage["horizon-puzzle-muted"]`) is toggled from both the puzzle header and onboarding.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19, TypeScript 5, Tailwind CSS v4, heroicons, pnpm. No test framework exists in this repo — verification is `npx tsc --noEmit` per task and `pnpm build` + `pnpm lint` at the end.

## Global Constraints

- Build must pass with **zero TypeScript errors** and **zero lint warnings** (`pnpm build`, `pnpm lint`).
- **No `any` types.** TypeScript strict mode enforced.
- **No code comments** in production code unless a task explicitly includes them.
- All core UI styling must use semantic tokens (`rounded-ui-element`, `rounded-ui-card`, `bg-surface-default`, `bg-brand-main`, `bg-brand-hover`, `text-content-primary`, `text-content-inverse`, `font-heading`). Raw Tailwind values allowed only for: conditional/status colors, overlay opacity, fixed 48px grid cells.
- **Positioning (STRICT):** badge modal container must be `fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm`.
- Storage keys (exact): badges → `horizon-puzzle-badges` (JSON `string[]` of ids); mute → `horizon-puzzle-muted` (`'1'`/`'0'`).
- Speed Demon time limit: `CONFIG.SPEED_BADGE_TIME_LIMIT_SECONDS = 180`.
- All `localStorage` access must be SSR-safe (`typeof window === 'undefined'` guards).
- Commit after every task with a concise message matching repo style (e.g., `Badge unlock types added`).

---

### Task 1: Core Types

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `BadgeType`, `BadgeDefinition`, `BadgeEvaluation`; `GameState` fields `badgeQueue: string[]`, `isMuted: boolean`, `elapsedSeconds: number`; `SavedGameState` field `elapsedSeconds: number`; new `GameAction` variants `ENQUEUE_BADGES`, `DISMISS_BADGE`, `TOGGLE_MUTE`, `SET_MUTED`, `TICK_GAME_CLOCK`.

- [ ] **Step 1: Add badge types**

Insert after the `SessionData` interface (after line 37):

```ts
export type BadgeType = 'category' | 'achievement';

export interface BadgeDefinition {
  id: string;
  type: BadgeType;
  title: string;
  description: string;
}
```

- [ ] **Step 2: Extend `GameState`**

In `GameState` (currently lines 68–84), add `badgeQueue`, `isMuted`, and `elapsedSeconds`:

```ts
export interface GameState {
  phase: 'onboarding' | 'playing' | 'finished';
  session: SessionData | null;
  questions: QuestionState[];
  activeIndex: number | null;
  gridCells: GridCell[][];
  wordPlacements: WordPlacement[];
  score: number;
  categoryCounts: Record<Category, number>;
  earnedBadges: Record<Category, boolean>;
  timerRemaining: number;
  gridWidth: number;
  gridHeight: number;
  isPaused: boolean;
  aiAssistedQuestions: string[];
  answerHistory: AnswerRecord[];
  badgeQueue: string[];
  isMuted: boolean;
  elapsedSeconds: number;
}

export interface BadgeEvaluation {
  earnedBadges: Record<Category, boolean>;
  phase: GameState['phase'];
  allCorrect: boolean;
  aiUsedCount: number;
  elapsedSeconds: number;
}
```

- [ ] **Step 3: Extend `SavedGameState`**

In `SavedGameState` (currently lines 86–100), add `elapsedSeconds`:

```ts
  aiAssistedQuestions: string[];
  answerHistory: AnswerRecord[];
  elapsedSeconds: number;
}
```

- [ ] **Step 4: Add new `GameAction` variants**

Extend the `GameAction` union (currently lines 111–122):

```ts
export type GameAction =
  | { type: 'START_GAME'; payload: StartGamePayload }
  | { type: 'SELECT_QUESTION'; payload: number }
  | { type: 'UPDATE_CELL'; payload: { x: number; y: number; letter: string } }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'USE_AI_ASSIST'; payload: { questionId: string } }
  | { type: 'TICK_TIMER' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESTORE_GAME'; payload: SavedGameState }
  | { type: 'RESTART_GAME'; payload: StartGamePayload }
  | { type: 'RESET' }
  | { type: 'ENQUEUE_BADGES'; payload: { badgeIds: string[] } }
  | { type: 'DISMISS_BADGE' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'TICK_GAME_CLOCK' };
```

- [ ] **Step 5: Verify type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 6: Commit**

```bash
git add src/types.ts
git commit -m "Badge unlock types added"
```

---

### Task 2: Speed Demon Config Constant

**Files:**
- Modify: `src/data/config.ts`

**Interfaces:**
- Produces: `CONFIG.SPEED_BADGE_TIME_LIMIT_SECONDS: number` (value `180`).
- Consumes: nothing.

- [ ] **Step 1: Add the constant**

In `CONFIG` (currently lines 4–10), add the new field:

```ts
export const CONFIG = {
  MAX_TOTAL_QUESTIONS: 15,
  QUESTIONS_PER_CATEGORY: 3,
  EXCLUDED_CATEGORIES: [] as string[],
  BASE_POINTS_PER_QUESTION: 10,
  TIME_BONUS_MULTIPLIER: 5,
  SPEED_BADGE_TIME_LIMIT_SECONDS: 180,
};
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/data/config.ts
git commit -m "Badge unlock config constant added"
```

---

### Task 3: Sound Utility and Chime Asset

**Files:**
- Create: `src/utils/sound.ts`
- Create: `public/sounds/badge-unlock.mp3`

**Interfaces:**
- Produces: `isMuted(): boolean`, `setMuted(value: boolean): void`, `playBadgeUnlockSound(): void`.
- Consumes: nothing.

- [ ] **Step 1: Generate the MP3 chime**

Run the following `ffmpeg` command from the repo root to synthesize a ~1.2 s three-note arpeggio chime (A5 → C#6 → E6, staggered, with decay):

```bash
ffmpeg -y \
  -f lavfi -i "sine=frequency=880:duration=0.9" \
  -f lavfi -i "sine=frequency=1108.73:duration=0.9" \
  -f lavfi -i "sine=frequency=1318.51:duration=1.0" \
  -filter_complex "[0:a]adelay=0|0,volume=0.5,afade=t=out:st=0.4:d=0.5[note1];[1:a]adelay=150|150,volume=0.45,afade=t=out:st=0.4:d=0.5[note2];[2:a]adelay=300|300,volume=0.4,afade=t=out:st=0.5:d=0.5[note3];[note1][note2][note3]amix=inputs=3:normalize=0[out]" \
  -map "[out]" -ar 44100 -ac 2 public/sounds/badge-unlock.mp3
```

- [ ] **Step 2: Verify the asset exists**

Run: `ls -la public/sounds/badge-unlock.mp3`
Expected: file exists, size roughly 10–30 KB.

- [ ] **Step 3: Create `src/utils/sound.ts`**

```ts
const MUTE_KEY = 'horizon-puzzle-muted';

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(MUTE_KEY) === '1';
}

export function setMuted(value: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MUTE_KEY, value ? '1' : '0');
}

let chime: HTMLAudioElement | null = null;

function getChime(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!chime) chime = new Audio('/sounds/badge-unlock.mp3');
  return chime;
}

export function playBadgeUnlockSound(): void {
  if (isMuted()) return;
  const audio = getChime();
  if (!audio) return;
  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  } catch {
    // Browser autoplay policy rejection — ignored intentionally.
  }
}
```

- [ ] **Step 4: Verify type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 5: Commit**

```bash
git add src/utils/sound.ts public/sounds/badge-unlock.mp3
git commit -m "Badge unlock sound utility and chime added"
```

---

### Task 4: Badge Registry and Evaluation

**Files:**
- Create: `src/data/badges.ts`

**Interfaces:**
- Consumes: `BadgeDefinition`, `BadgeEvaluation`, `Category` from `@/types`; `getAllCategories`, `CONFIG` from `./config`.
- Produces: `getCategoryBadgeId(category: Category): string`, `getBadgeDefinition(id: string): BadgeDefinition | undefined`, `getUnlockedBadges(): string[]`, `markUnlocked(id: string): boolean`, `evaluateBadges(input: BadgeEvaluation): string[]`, `ACHIEVEMENT_BADGES: Record<string, BadgeDefinition>`.

- [ ] **Step 1: Create `src/data/badges.ts`**

```ts
import type { BadgeDefinition, BadgeEvaluation, Category } from '@/types';
import { getAllCategories, CONFIG } from './config';

const STORAGE_KEY = 'horizon-puzzle-badges';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getCategoryBadgeId(category: Category): string {
  return `category-${slugify(category)}`;
}

const categoryDefinitions: BadgeDefinition[] = getAllCategories().map(
  (category) => ({
    id: getCategoryBadgeId(category),
    type: 'category' as const,
    title: `${category} Certified`,
    description: `Correctly answered every question in ${category}.`,
  })
);

export const ACHIEVEMENT_BADGES: Record<string, BadgeDefinition> = {
  'achievement-flawless': {
    id: 'achievement-flawless',
    type: 'achievement',
    title: 'Flawless Run',
    description:
      'Finished the puzzle with zero AI assists and every question correct.',
  },
  'achievement-speed-demon': {
    id: 'achievement-speed-demon',
    type: 'achievement',
    title: 'Speed Demon',
    description: `Completed the whole puzzle in ${CONFIG.SPEED_BADGE_TIME_LIMIT_SECONDS} seconds or less.`,
  },
  'achievement-first-win': {
    id: 'achievement-first-win',
    type: 'achievement',
    title: 'First Win',
    description: 'Completed your first puzzle.',
  },
};

const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = Object.fromEntries([
  ...categoryDefinitions.map((d) => [d.id, d]),
  ...Object.entries(ACHIEVEMENT_BADGES),
]);

export function getBadgeDefinition(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS[id];
}

export function getUnlockedBadges(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

export function markUnlocked(id: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getUnlockedBadges();
  if (current.includes(id)) return false;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  return true;
}

export function evaluateBadges(input: BadgeEvaluation): string[] {
  const newly: string[] = [];

  for (const category of getAllCategories()) {
    if (input.earnedBadges[category]) {
      const id = getCategoryBadgeId(category);
      if (markUnlocked(id)) newly.push(id);
    }
  }

  if (input.phase === 'finished') {
    if (input.aiUsedCount === 0 && input.allCorrect) {
      if (markUnlocked('achievement-flawless')) newly.push('achievement-flawless');
    }
    if (input.elapsedSeconds <= CONFIG.SPEED_BADGE_TIME_LIMIT_SECONDS) {
      if (markUnlocked('achievement-speed-demon')) newly.push('achievement-speed-demon');
    }
    if (markUnlocked('achievement-first-win')) newly.push('achievement-first-win');
  }

  return newly;
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/data/badges.ts
git commit -m "Badge registry and evaluation added"
```

---

### Task 5: Context Integration (Queue, Clock, Mute)

**Files:**
- Modify: `src/context/PuzzleContext.tsx`

**Interfaces:**
- Consumes: `evaluateBadges` from `@/data/badges`; `isMuted`, `setMuted` from `@/utils/sound`; new types/actions from Task 1.
- Produces: reducer handling for `ENQUEUE_BADGES`, `DISMISS_BADGE`, `TOGGLE_MUTE`, `SET_MUTED`, `TICK_GAME_CLOCK`; `badgeQueue`, `isMuted`, `elapsedSeconds` in state; the game-clock effect; the central badge-evaluation effect; the mount mute-init effect.

- [ ] **Step 1: Add imports**

Add to the existing imports block (after line 25):

```ts
import { evaluateBadges } from "@/data/badges";
import { isMuted, setMuted } from "@/utils/sound";
```

- [ ] **Step 2: Extend `initialState`**

In `initialState` (currently lines 91–107), add three fields:

```ts
const initialState: GameState = {
  phase: "onboarding",
  session: null,
  questions: [],
  activeIndex: null,
  gridCells: [],
  wordPlacements: [],
  score: 0,
  categoryCounts: { ...categoryDefaults },
  earnedBadges: { ...badgeDefaults },
  timerRemaining: 60,
  gridWidth: 0,
  gridHeight: 0,
  isPaused: false,
  aiAssistedQuestions: [],
  answerHistory: [],
  badgeQueue: [],
  isMuted: false,
  elapsedSeconds: 0,
};
```

- [ ] **Step 3: Add reducer cases**

Add the five new cases inside `gameReducer`, before the `case "RESET":` (currently line 368):

```ts
    case "ENQUEUE_BADGES": {
      const badgeIds = action.payload.badgeIds.filter(
        (id) => !state.badgeQueue.includes(id)
      );
      if (badgeIds.length === 0) return state;
      return { ...state, badgeQueue: [...state.badgeQueue, ...badgeIds] };
    }

    case "DISMISS_BADGE": {
      return { ...state, badgeQueue: state.badgeQueue.slice(1) };
    }

    case "TOGGLE_MUTE": {
      const next = !state.isMuted;
      setMuted(next);
      return { ...state, isMuted: next };
    }

    case "SET_MUTED": {
      return { ...state, isMuted: action.payload };
    }

    case "TICK_GAME_CLOCK": {
      if (state.phase !== "playing" || state.isPaused) return state;
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
    }
```

- [ ] **Step 4: Reset queue/clock on game start and restart**

In `case "START_GAME":` (currently lines 111–129), add `badgeQueue: [],` and `elapsedSeconds: 0,` after `answerHistory: [],`:

```ts
        aiAssistedQuestions: [],
        answerHistory: [],
        badgeQueue: [],
        elapsedSeconds: 0,
```

In `case "RESTART_GAME":` (currently lines 347–366), add the same two fields after `answerHistory: [],`:

```ts
        aiAssistedQuestions: [],
        answerHistory: [],
        badgeQueue: [],
        elapsedSeconds: 0,
```

- [ ] **Step 5: Restore `elapsedSeconds` in `RESTORE_GAME`**

In `case "RESTORE_GAME":` (currently lines 326–345), add after `answerHistory: action.payload.answerHistory ?? [],`:

```ts
        elapsedSeconds: action.payload.elapsedSeconds ?? 0,
```

- [ ] **Step 6: Add the game-clock effect**

Add this effect after the existing timer effect (after the effect closing at line 401):

```ts
  useEffect(() => {
    if (state.phase !== "playing" || state.isPaused) return;
    const clock = setInterval(() => {
      dispatch({ type: "TICK_GAME_CLOCK" });
    }, 1000);
    return () => clearInterval(clock);
  }, [state.phase, state.isPaused]);
```

- [ ] **Step 7: Add the mute-init effect**

Add this effect (e.g., directly after the game-clock effect):

```ts
  useEffect(() => {
    dispatch({ type: "SET_MUTED", payload: isMuted() });
  }, []);
```

- [ ] **Step 8: Add the central badge-evaluation effect**

Add this effect after the mute-init effect:

```ts
  useEffect(() => {
    const allCorrect =
      state.questions.length > 0 &&
      state.questions.every((q) => q.status === "completed");
    const newly = evaluateBadges({
      earnedBadges: state.earnedBadges,
      phase: state.phase,
      allCorrect,
      aiUsedCount: state.aiAssistedQuestions.length,
      elapsedSeconds: state.elapsedSeconds,
    });
    if (newly.length > 0) {
      dispatch({ type: "ENQUEUE_BADGES", payload: { badgeIds: newly } });
    }
  }, [
    state.earnedBadges,
    state.phase,
    state.questions,
    state.aiAssistedQuestions,
    state.elapsedSeconds,
  ]);
```

- [ ] **Step 9: Verify type-check and lint**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

Run: `pnpm lint`
Expected: no warnings or errors.

- [ ] **Step 10: Commit**

```bash
git add src/context/PuzzleContext.tsx
git commit -m "Badge queue and mute state integrated into context"
```

---

### Task 6: BadgeUnlockModal with Inline Confetti

**Files:**
- Create: `src/components/BadgeUnlockModal.tsx`

**Interfaces:**
- Consumes: `BadgeDefinition` from `@/types`; `playBadgeUnlockSound` from `@/utils/sound`.
- Produces: default-export component `BadgeUnlockModal({ badge, onClose })` plus internal `ConfettiBurst`.

- [ ] **Step 1: Create `src/components/BadgeUnlockModal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import type { BadgeDefinition } from "@/types";
import { playBadgeUnlockSound } from "@/utils/sound";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = ["#147385", "#fbbf24", "#f59e0b", "#ffffff", "#34d399", "#38bdf8"];

function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 9;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: 90 + Math.random() * 60,
      };
    });

    let raf = 0;
    function tick() {
      ctx.clearRect(0, 0, width, height);
      let alive = false;
      for (const p of particles) {
        p.life += 1;
        if (p.life > p.maxLife) continue;
        alive = true;
        p.vy += 0.12;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (alive) {
        raf = requestAnimationFrame(tick);
      } else {
        canvas.style.display = "none";
      }
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
}

export default function BadgeUnlockModal({
  badge,
  onClose,
}: {
  badge: BadgeDefinition;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    playBadgeUnlockSound();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Badge unlocked: ${badge.title}`}
    >
      <ConfettiBurst />
      <div
        className={`relative flex w-full max-w-sm flex-col items-center gap-4 rounded-ui-card bg-surface-default p-8 text-center shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          mounted ? "scale-100" : "scale-0"
        }`}
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-yellow-400/40 blur-xl animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-2xl animate-ping" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl">
            <CheckBadgeIcon className="h-12 w-12 text-white" />
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Badge Unlocked
        </p>
        <h2 className="font-heading text-2xl font-bold text-content-primary">
          {badge.title}
        </h2>
        <p className="text-sm leading-relaxed text-content-primary/70">
          {badge.description}
        </p>

        <button
          onClick={onClose}
          className="mt-2 w-full cursor-pointer rounded-ui-element bg-brand-main px-4 py-2.5 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/BadgeUnlockModal.tsx
git commit -m "Badge unlock modal with confetti added"
```

---

### Task 7: MuteToggle Component

**Files:**
- Create: `src/components/MuteToggle.tsx`

**Interfaces:**
- Consumes: `usePuzzle()` from `@/context/PuzzleContext` (fields `state.isMuted`, action `TOGGLE_MUTE`).
- Produces: default-export icon-button component `MuteToggle`.

- [ ] **Step 1: Create `src/components/MuteToggle.tsx`**

```tsx
"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { usePuzzle } from "@/context/PuzzleContext";

export default function MuteToggle() {
  const { state, dispatch } = usePuzzle();
  const muted = state.isMuted;

  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      className="inline-flex cursor-pointer items-center justify-center rounded-ui-element border border-zinc-300 px-3 py-2 text-sm font-semibold text-content-primary transition-colors hover:bg-zinc-100"
    >
      {muted ? (
        <SpeakerXMarkIcon className="h-4 w-4" />
      ) : (
        <SpeakerWaveIcon className="h-4 w-4" />
      )}
    </button>
  );
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/MuteToggle.tsx
git commit -m "Mute toggle component added"
```

---

### Task 8: Puzzle Page Integration

**Files:**
- Modify: `src/app/(ui)/puzzle/page.tsx`

**Interfaces:**
- Consumes: `BadgeUnlockModal` (Task 6), `MuteToggle` (Task 7), `getBadgeDefinition` from `@/data/badges` (Task 4), `state.badgeQueue`, action `DISMISS_BADGE`.

- [ ] **Step 1: Add imports**

Add after the existing imports (after line 13):

```tsx
import BadgeUnlockModal from '@/components/BadgeUnlockModal';
import MuteToggle from '@/components/MuteToggle';
import { getBadgeDefinition } from '@/data/badges';
```

- [ ] **Step 2: Use `dispatch` and compute the active badge**

Change the `usePuzzle()` destructure (line 16) and add the badge lookup after the `showResults` state line (after line 19):

```tsx
  const { state, dispatch, startGame, restartGame } = usePuzzle();
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [lastPhase, setLastPhase] = useState(state.phase);
  const [showResults, setShowResults] = useState(state.phase === 'finished');

  const activeBadgeId = state.badgeQueue[0] ?? null;
  const activeBadge = activeBadgeId
    ? getBadgeDefinition(activeBadgeId)
    : null;
```

- [ ] **Step 3: Add the mute toggle to the header**

In the header controls div (currently line 74), insert `<MuteToggle />` before the Restart button:

```tsx
        <div className="flex items-center gap-3">
          <MuteToggle />
          <button
            onClick={() => setShowRestartDialog(true)}
```

- [ ] **Step 4: Gate the results overlay and render the modal**

Replace the results line (currently line 116):

```tsx
      {state.phase === 'finished' && showResults && <ResultsOverlay onClose={() => setShowResults(false)} />}
    </main>
    </>
```

with:

```tsx
      {state.phase === 'finished' &&
        showResults &&
        state.badgeQueue.length === 0 && (
          <ResultsOverlay onClose={() => setShowResults(false)} />
        )}
    </main>

    {activeBadge && (
      <BadgeUnlockModal
        key={activeBadge.id}
        badge={activeBadge}
        onClose={() => dispatch({ type: 'DISMISS_BADGE' })}
      />
    )}
    </>
```

- [ ] **Step 5: Verify type-check and lint**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

Run: `pnpm lint`
Expected: no warnings or errors.

- [ ] **Step 6: Commit**

```bash
git add 'src/app/(ui)/puzzle/page.tsx'
git commit -m "Badge unlock modal wired into puzzle page"
```

---

### Task 9: Onboarding Sound Toggle

**Files:**
- Modify: `src/components/Onboarding.tsx`

**Interfaces:**
- Consumes: `MuteToggle` from `@/components/MuteToggle` (Task 7).

- [ ] **Step 1: Add the import**

Add after line 4:

```tsx
import MuteToggle from '@/components/MuteToggle';
```

- [ ] **Step 2: Render the sound-setting row before the submit button**

Insert between the consent error block and the submit button (between lines 110 and 112):

```tsx
        <div className="flex items-center justify-between rounded-ui-element border border-zinc-200 px-3 py-2">
          <span className="text-sm font-medium text-content-primary">
            Sound effects
          </span>
          <MuteToggle />
        </div>
```

- [ ] **Step 3: Verify type-check and lint**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

Run: `pnpm lint`
Expected: no warnings or errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Onboarding.tsx
git commit -m "Sound toggle added to onboarding"
```

---

### Task 10: Full Build Verification

**Files:**
- None (verification only).

- [ ] **Step 1: Full production build**

Run: `pnpm build`
Expected: build succeeds with zero TypeScript errors.

- [ ] **Step 2: Full lint**

Run: `pnpm lint`
Expected: no warnings or errors.

- [ ] **Step 3: Manual smoke-test checklist (via `pnpm dev`)**

1. Start `pnpm dev` and open `/puzzle`.
2. Onboarding shows a "Sound effects" toggle; toggling it persists across reload (`horizon-puzzle-muted` in devtools).
3. Complete a full category mid-game → center-screen badge modal appears with confetti burst and chime; "Awesome!", Escape, and backdrop click all dismiss it.
4. Finish the game → each newly earned badge plays sequentially (one full modal each), then the results overlay appears only after the queue drains.
5. Reload during a badge modal → badge remains unlocked in `horizon-puzzle-badges` and never re-triggers.
6. Toggle mute off → no chime, but modal + confetti still show.
7. The header speaker button toggles the same mute state as onboarding.

- [ ] **Step 4: Review changes**

Run: `git status && git log --oneline -10`
Expected: all nine commits present; working tree clean.
