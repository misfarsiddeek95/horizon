<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- ========================================================================== -->
<!-- HORIZON — Knowledge Puzzle Game                                              -->
<!-- Permanent architecture & rule reference for all AI interactions             -->
<!-- ========================================================================== -->

# Horizon — Architecture & Rules

## 1. Application Overview

Horizon is a **Next.js (App Router) Crossword/Puzzle Game** built with TypeScript, Tailwind CSS v4, and React 19.

**Core loop:**
1. Player enters name, email, and consent on an onboarding screen.
2. 8 questions are selected (2 per category from 4 categories: Innovation, Sustainability, Financials, Governance), shuffled.
3. Each question has a category, a clue, and a word (the answer).
4. A 2D crossword grid is procedurally generated from the 8 answer words.
5. Player selects a question, types letters into grid cells, and submits answers.
6. Correct answers populate the grid with green-highlighted letters; wrong answers are marked red.
7. A 60-second timer per question; at ≤20s a "Need Help?" button surfaces; at 0s the question times out and locks.
8. After all 8 questions are answered/timeout, a results overlay shows the score (X/8) and category breakdown.
9. Scores are persisted to `src/data/results.json` and displayed on the Leaderboard page.

**Routes:**
- `/` — Home page
- `/puzzle` — Main game view (onboarding → playing → finished)
- `/leaderboard` — Ranked scores (Server Component, reads `results.json`)
- `/chat-help` — Help/tips page
- `/api/result` — REST API for reading/writing scores

---

## 2. Core Architecture & Rules

### 2a. Constraint Satisfaction Grid Generator

**File:** `src/utils/gridGenerator.ts`

- **Virtual 50×50 grid** (`VIRTUAL_SIZE = 50`, `CENTER = 25`).
- Words are sorted **longest first**. The longest word is placed centred at `(25, 25)` horizontally.
- Subsequent words are placed by **intersection**: every new word MUST share a common letter with at least one already-placed word.
- **O(N²) intersection search**: for each remaining word, every letter is checked against every placed word's every letter. When a matching letter is found, the perpendicular position is calculated and validated.
- **Validation rules** (`isValidWordPlacement`):
  1. All cells must be within the 50×50 grid.
  2. Non-matching letter overwrites are rejected.
  3. Same-direction adjacency immediately before or after the word is rejected.
  4. Parallel (same-direction) neighbours at non-intersection cells are rejected.
  5. Perpendicular neighbours are always allowed (valid crossings).
- **Scoring**: proximity to grid centre via Euclidean distance (`proximityScore`). The candidate with the lowest score wins.
- **Fallback**: if a word cannot intersect any existing word, it is placed horizontally at `fpMinX` / `fpMaxY + 2` (directly below the current puzzle footprint).
- **Normalisation**: after all words are placed, coordinates are shifted so the bounding box starts at `(0, 0)` with 1-cell padding.
- **Intersection cells** store multiple `questionIds` in an array within `cellMatrix` — both crossing words can reference the same cell.

### 2b. The 2D Grid Matrix

**File:** `src/components/CrosswordGrid.tsx`

- Grid renders using **strict CSS Grid placement** (`gridColumnStart: x+1`, `gridRowStart: y+1`).
- Every cell is an **immutable 48×48 pixel wrapper** (`w-[48px] h-[48px] shrink-0 flex-none`).
- Grid tracks: `repeat(${gridWidth}, 48px)` / `repeat(${gridHeight}, 48px)`.
- Visual borders are rendered via an **inner absolute overlay** with `w-[calc(100%+1px)] h-[calc(100%+1px)]` — this extends 1px beyond the wrapper to prevent anti-aliasing gaps between adjacent cells.
- Active cell highlighting uses `ring-2 ring-inset ring-blue-500 z-10` on the overlay.
- **Keyboard navigation**: each cell has `data-cell-pos="${x}-${y}"` for arrow-key movement. Click-to-type is also supported.
- Input `<input>` fields only appear on the **active word's cells** and only when the question status is `'active'`.
- Cells do NOT pre-populate with correct letters; letters are only populated after a successful `SUBMIT_ANSWER` action.
- A **scrollable overflow wrapper** (`overflow-x-auto overflow-y-hidden pb-4 snap-x touch-pan-x`) wraps the grid for mobile responsiveness.
- The parent container uses `min-w-0` to allow proper shrinking below the grid's intrinsic width.

### 2c. Data Persistence (Upsert)

**Files:** `src/app/api/result/route.ts`, `src/data/leaderboard.ts`, `src/data/results.json`

- **Server Component reads** (`leaderboard/page.tsx`): imports `fs` and `path` directly, reads `src/data/results.json`, sorts descending by score, returns top 10.
- **API route** (`/api/result`):
  - `GET`: reads `results.json`, sorts descending by score (ties broken by most recent date), returns top 10.
  - `POST`: accepts `{ name, email, score, date }`, validates fields, reads existing results, **upserts by email**:
    - If email exists: keeps the **highest** score (`Math.max`), updates `name` and `date`.
    - If email is new: appends the entry.
  - Writes back to `results.json` after every mutation.
- **Client-side helper** (`leaderboard.ts`): `saveResult()` POSTs to `/api/result`; `getLeaderboard()` GETs from `/api/result` — both return `boolean` / `LeaderboardEntry[]`.

### 2d. State Management

**File:** `src/context/PuzzleContext.tsx`

- Context API + `useReducer` pattern.
- **Game phases**: `onboarding` → `playing` → `finished`.
- **Question selection**: 2 questions randomly selected per category (from 6 in `questionPool`), shuffled to produce the final 8.
- **Reducer actions**:
  - `START_GAME` — Initialises session, questions, grid, and placement data.
  - `SELECT_QUESTION` — Sets a pending question to active, starts timer.
  - `UPDATE_CELL` — Writes a letter to a grid cell by coordinate (no `questionId` guard — intersection cells work because component-level `isInputEnabled` enforces active-word scoping).
  - `SUBMIT_ANSWER` — Validates all filled cells against the correct word; on success populates letters and increments score/category count; on failure marks as failed; transitions to `finished` if all questions done.
  - `TICK_TIMER` — Decrements timer; at 0 marks as `timeout` and releases the question.
  - `RESET` — Returns to onboarding.
- **Timer**: starts at `question.timeLimit` (60s). A `useEffect` with `setInterval` ticks every second while `activeIndex !== null`.
- **Session persistence**: `horizon-puzzle-session` (name, email) in localStorage; score saved to `horizon-puzzle-score` on game finish via `saveResult()`.

---

## 3. UI/UX & Design System

### 3a. The Design Token Rule (STRICT)

> **ALL** styling in new components MUST use the semantic CSS variables defined in `src/styles/tokens/`. Raw Tailwind values (e.g. `bg-blue-500`, `rounded-xl`, `p-4`, `text-gray-700`) are **FORBIDDEN** for core UI styling — use tokens instead.

**Token files (loaded in order by `globals.css`):**

| File | Purpose |
|------|---------|
| `src/styles/tokens/colors.css` | Surface, content, brand, accent, border, and status colour tokens |
| `src/styles/tokens/typography.css` | Font family tokens (`--font-sans`, `--font-heading`) |
| `src/styles/tokens/radii.css` | Border radius tokens (`--radius-ui-element`, `--radius-ui-card`, `--radius-ui-grid`, `--radius-ui-button`, `--radius-ui-pill`) |

**Available token classes (Tailwind v4 generates utilities from `@theme`):**

```css
/* Surfaces */
bg-surface-default    bg-surface-muted    bg-surface-glass

/* Content */
text-content-primary   text-content-inverse

/* Brand */
bg-brand-main   bg-brand-hover   text-brand-main

/* Accent */
bg-accent-main   text-accent-main

/* Radii */
rounded-ui-element   rounded-ui-card
```

**Exceptions** — the following cases may use raw values:
- Dynamic/conditional colours (e.g. status colours for question cards: pending=white, active=blue, completed=green, failed=red, timeout=gray). These are not tokenised because they're conditional state, not core UI styling.
- Overlay opacity values.
- Fixed 48px grid cell dimensions (physical layout constraint).
- Spacing/padding values not covered by tokens.

### 3b. Typography

- **Body font (Avenir)**: applied globally via `font-sans` utility class and `body { font-family: var(--font-sans); }`.
- **Heading font (Minion Pro)**: applied globally to all `h1`–`h6` elements via `@layer base`.
- **Font files**: stored in `src/app/fonts/` (`Avenir.ttc`, `MinionPro-Regular.otf`), loaded via CSS `@font-face` in `globals.css`.
  - `.ttc` uses `format("truetype-collection")`.
  - `.otf` uses `format("opentype")`.
- **Font-family utilities**:
  - `font-sans` → Avenir (body).
  - `font-heading` → Minion Pro (headings only; use on non-heading elements only when they need to visually match the heading font).

### 3c. Glassmorphism

- Used prominently on the **Leaderboard page** (`app/(ui)/leaderboard/page.tsx`).
- Pattern: `bg-surface-glass backdrop-blur-lg border border-white/20 shadow-2xl`.
- Background gradient: `from-slate-900 via-indigo-950 to-slate-900`.
- Podium top-3: gold/silver/bronze gradient overlays using `TrophyIcon`.
- Use `bg-surface-glass` (defined in `colors.css`) for glass surfaces going forward.

### 3d. Mobile Responsiveness

- **Grid overflow**: the crossword grid is wrapped in `overflow-x-auto overflow-y-hidden pb-4 snap-x touch-pan-x` to allow horizontal scrolling without breaking the page layout.
- **Layout stack**: `flex flex-col lg:flex-row` — stacks vertically on mobile, side-by-side on desktop (60/40 split via `w-full lg:w-3/5` / `w-full lg:w-2/5`).
- **Containment**: `min-w-0` on flex children prevents them from expanding beyond the viewport to accommodate the grid's intrinsic width.
- **Grid alignment**: `justify-start md:justify-center` — left-aligned on mobile (so no left-side clipping), centred on larger screens.
- **Scroll padding**: `px-2 sm:px-4` on the scroll wrapper prevents cells from sitting flush against the screen edge.
- **Question deck**: `grid-cols-1 sm:grid-cols-2` — single column on narrow screens, two columns on tablet/desktop.
- **Category badges**: `flex flex-wrap justify-center gap-4 sm:gap-6` — wrap on narrow screens, wider gaps on desktop.

---

## 4. File Structure

```
src/
├── app/
│   ├── (ui)/
│   │   ├── leaderboard/page.tsx    — Server Component, reads results.json
│   │   ├── puzzle/page.tsx         — Client Component, main game view
│   │   └── chat-help/page.tsx      — Help page
│   ├── api/result/route.ts         — REST API for scores (GET/POST)
│   ├── fonts/                      — Avenir.ttc, MinionPro-Regular.otf
│   ├── globals.css                 — Tailwind v4 imports, @font-face, @layer base
│   └── layout.tsx                  — Root layout
├── components/
│   ├── ActiveCluePanel.tsx         — Current clue, timer, submit button
│   ├── CategoryBadges.tsx          — 4 category trophy badges with completion state
│   ├── CrosswordGrid.tsx           — 2D grid matrix rendering
│   ├── Onboarding.tsx              — Name/email/consent form
│   ├── QuestionDeck.tsx            — 8 question cards grid
│   └── ResultsOverlay.tsx          — End-game results modal
├── context/
│   └── PuzzleContext.tsx           — Game state (useReducer + Context API)
├── data/
│   ├── leaderboard.ts              — Client-side fetch wrappers
│   ├── questions.ts                — 24 questions (6 per category)
│   └── results.json                — Persistent score storage
├── styles/tokens/
│   ├── colors.css                  — @theme colour tokens
│   ├── typography.css              — @theme font tokens
│   └── radii.css                   — @theme radius tokens
├── types.ts                        — All TypeScript interfaces & types
└── utils/
    └── gridGenerator.ts            — Crossword placement algorithm
```

---

## 5. Key Conventions

- **No comments** in production code unless explicitly asked.
- **No `any` types** — TypeScript strict mode is enforced.
- **No emojis** unless the user explicitly requests them.
- Build must pass with **zero TypeScript errors and zero lint warnings**.
- Before committing: run `pnpm build`, review `git status` + `git diff`, and write concise commit messages matching the repo style.
- All new files must be created with `write` tool (not `bash`).
- Always prefer **editing existing files** over creating new ones unless the task explicitly requires a new file.

---

## 6. Caching & Static Asset Versioning (STRICT)

**CLAUDE.md is `@AGENTS.md`** — it includes this file, so AGENTS.md is the single source of truth for both.

### The `/user-profiles` background scrub frames
- Live in `public/user_profile_frames_v1/` (currently **240 WebP** files, `frame_0001.webp` … `frame_0240.webp`).
- Are loaded by `src/components/UserProfileBackgroundScrubber.tsx` and drawn to a fixed canvas that scrubs with page scroll.
- Are served with **`Cache-Control: public, max-age=31536000, immutable`** via the `headers()` config in `next.config.ts`, matching the `/user_profile_frames_v1/:path*` source.

### CRITICAL: never regenerate frames in place
Returning browsers cache these frames **immutably for a full year**. Because the URLs never revalidate, overwriting or appending frames inside `public/user_profile_frames_v1/` will **not** reach repeat visitors — they will keep serving the old cached frames.

To change the frames, ALWAYS:
1. Create a **new versioned folder** — `public/user_profile_frames_v2/`, `v3/`, etc. (use `git mv` from the previous version to preserve history).
2. Update the frame URL path in `UserProfileBackgroundScrubber.tsx` to the new folder.
3. Add a matching immutable `Cache-Control` header entry in `next.config.ts` `headers()` for the new `/user_profile_frames_vN/:path*` source.
4. Keep frames as WebP and never change `FRAME_COUNT`/batch/loader-gate behaviour without explicit design approval.
