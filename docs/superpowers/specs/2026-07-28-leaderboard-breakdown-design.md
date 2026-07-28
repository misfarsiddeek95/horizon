# Leaderboard Breakdown View — Design Spec

## Overview

Add a detailed per-user breakdown view to the Leaderboard. Clicking a row reveals the player's earned category badges and a per-question receipt showing the exact scoring math.

---

## 1. Data Model

### New type: `AnswerRecord` (in `src/types.ts`)

```ts
export interface AnswerRecord {
  questionId: string;
  clue: string;
  category: Category;
  status: QuestionStatus;
  timeRemaining: number;
  basePoints: number;
  timeBonus: number;
  aiUsed: boolean;
  totalPointsEarned: number;
}
```

- `clue` and `category` stored inline so the leaderboard is self-contained (no question-bank lookup needed).
- `status` captures completed/failed/timeout — failed/timeout records carry 0 pts but are included so the receipt shows all questions.
- All numeric values (timeRemaining, basePoints, timeBonus, totalPointsEarned) stored at the moment of submission.

### Expanded `LeaderboardEntry` (in `src/types.ts`)

```ts
export interface LeaderboardEntry {
  name: string;
  email: string;
  score: number;
  date: string;
  earnedBadges: Record<Category, boolean>;
  answerHistory: AnswerRecord[];
}
```

### Expanded `GameState` / `SavedGameState`

- Add `answerHistory: AnswerRecord[]` to both interfaces.
- Initialized as `[]`, reset on START_GAME / RESTART_GAME, persisted in RESTORE_GAME and save-game localStorage.

---

## 2. Scoring Engine Changes (PuzzleContext)

### SUBMIT_ANSWER reducer

After computing `questionPoints` for the submitted question, build an `AnswerRecord` and push it:

```
record = {
  questionId, clue, category,
  status: completed|failed,
  timeRemaining: state.timerRemaining,
  basePoints: isCorrect ? CONFIG.BASE_POINTS_PER_QUESTION : 0,
  timeBonus: isCorrect ? floor((timerRemaining / timeLimit) * CONFIG.TIME_BONUS_MULTIPLIER) : 0,
  aiUsed: aiAssistedQuestions.includes(id),
  totalPointsEarned: questionPoints,
}
answerHistory: [...state.answerHistory, record]
```

### TICK_TIMER (timeout path)

When a question times out, push an `AnswerRecord` with `status: 'timeout'` and all points = 0.

### Finished-game submission effect

When `state.phase === 'finished'`, expand the `saveResult()` call to include:
- `earnedBadges` (already in state)
- `answerHistory` (newly tracked)

Also persist `answerHistory` in the save-game localStorage payload.

---

## 3. API Layer (route.ts)

### Validation change

- Remove the `score > CONFIG.MAX_TOTAL_QUESTIONS` cap — the new weighted scoring far exceeds it. Score is an unbounded positive number.

### Expanded `ResultEntry` interface

```ts
interface ResultEntry {
  name: string;
  email: string;
  score: number;
  date: string;
  earnedBadges?: Record<string, boolean>;
  answerHistory?: AnswerRecord[];
}
```

- `earnedBadges` and `answerHistory` are optional in the API to maintain backward compatibility with existing records.
- Passed through on read/write — the upsert logic remains the same.

### GET response

Returns top 10 sorted by score descending. Each entry includes `earnedBadges` and `answerHistory` if present.

### POST validation

- Name/email/score validation unchanged except removing the MAX_TOTAL_QUESTIONS ceiling.
- Accept optional `earnedBadges` and `answerHistory` fields from the body.
- Store them alongside the existing fields.

---

## 4. Leaderboard UI

### Architecture pattern

Server Component → Client Component wrapper (Option 3 per user choice).

### `leaderboard/page.tsx` (Server Component)

- Reads `results.json` directly via `fs.readFile`.
- Parses and types the data with the expanded `LeaderboardEntry` interface (with fallback `{}` for `earnedBadges` and `[]` for `answerHistory` on legacy entries).
- Passes the typed array to `<InteractiveLeaderboard players={players} />`.

### `InteractiveLeaderboard.tsx` (new Client Component, `"use client"`)

**State:**
- `selectedEmail: string | null` — tracks which player's breakdown is open.

**Row rendering:**
- Same glassmorphism styling as current leaderboard.
- Each row is clickable (`onClick` sets `selectedEmail`).
- Active row shows a subtle visual indicator (e.g., expanded chevron or highlight).

**Modal (overlay div, no external library):**
- Positioned: `fixed inset-0 z-50` with `bg-black/50` backdrop.
- Card: `max-w-lg mx-auto mt-20` with `bg-surface-default rounded-ui-card p-6`.

**Modal Header:**
- Player name + score.
- Badge section: for each category where `earnedBadges[cat] === true`, render a pill/badge with the category name and a check icon (uses `CheckBadgeIcon` from heroicons, matching ResultsOverlay style).

**Modal Receipt Table:**
- Title: "Score Breakdown" or "Answer History".
- One row per `AnswerRecord` in the history.
- Each row format: `#N | {clue} | {base} (Base) + {bonus} (Time) [AI -50%] = {total} pts`
- Color coding: completed = normal text, failed/timeout = gray/muted text.
- AI-assisted rows display the `[AI -50%]` badge in amber.

**Close:**
- Close button (X icon) in top-right corner.
- Click backdrop to close.
- `selectedEmail = null` to dismiss.

### No hardcoded counts

All dynamic values derived from array lengths (`answerHistory.length`, `Object.keys(earnedBadges)`, etc.). No literal "8" or "15" in any component or logic.

---

## 5. Files Changed

| File | Change |
|------|--------|
| `src/types.ts` | Add `AnswerRecord` interface; expand `LeaderboardEntry`, `GameState`, `SavedGameState` |
| `src/context/PuzzleContext.tsx` | Build `AnswerRecord` in SUBMIT_ANSWER and timeout; expand saveResult payload; persist answerHistory |
| `src/app/api/result/route.ts` | Remove score cap; expand `ResultEntry`; pass through badges + history |
| `src/data/leaderboard.ts` | Update `saveResult` / `getLeaderboard` types if needed (they use `LeaderboardEntry` which is updated) |
| `src/app/(ui)/leaderboard/page.tsx` | Pass typed data (with fallbacks) to `InteractiveLeaderboard` |
| `src/components/InteractiveLeaderboard.tsx` | NEW — client component with clickable rows + modal |
| `src/data/results.json` | No structural change; new fields appended on write |

---

## 6. Edge Cases

- **Legacy entries** (no `earnedBadges` / `answerHistory`): display as before with no modal breakdown (or show a "No breakdown data" message).
- **Empty answerHistory**: if `answerHistory` is empty or missing, the modal shows the badges but shows "No breakdown available" for the receipt.
- **Upsert behavior**: when a player improves their score, the new entry replaces the old one with full data. If the new score is lower (existing score kept), the old breakdown data is preserved.
