# Leaderboard Breakdown View — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add clickable per-user breakdown modal to the Leaderboard showing earned badges and per-question scoring receipt.

**Architecture:** Expand data model with `AnswerRecord[]` tracked in game state and persisted via the API. Leaderboard page stays a Server Component reading `results.json`, passes data to a new `InteractiveLeaderboard` Client Component that handles clicks and modal rendering.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Heroicons

## Global Constraints

- No hardcoded question counts — use `CONFIG` values or dynamic array lengths
- Scoring constants from `CONFIG.BASE_POINTS_PER_QUESTION` (10) and `CONFIG.TIME_BONUS_MULTIPLIER` (5)
- All types must be strict — no `any`
- Build must pass with zero TypeScript errors and zero lint warnings

---

### Task 1: Expand Types

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `AnswerRecord`, expanded `LeaderboardEntry`, `GameState`, `SavedGameState`

- [ ] **Step 1: Add `AnswerRecord` interface**

Add before `LeaderboardEntry`:
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

- [ ] **Step 2: Expand `LeaderboardEntry`**

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

- [ ] **Step 3: Add `answerHistory` to `GameState`**

After `aiAssistedQuestions: string[];`:
```ts
export interface GameState {
  ...
  aiAssistedQuestions: string[];
  answerHistory: AnswerRecord[];
}
```

- [ ] **Step 4: Add `answerHistory` to `SavedGameState`**

Same location:
```ts
export interface SavedGameState {
  ...
  aiAssistedQuestions: string[];
  answerHistory: AnswerRecord[];
}
```

---

### Task 2: Update PuzzleContext Scoring & History

**Files:**
- Modify: `src/context/PuzzleContext.tsx`

**Interfaces:**
- Consumes: `AnswerRecord`, `CONFIG.BASE_POINTS_PER_QUESTION`, `CONFIG.TIME_BONUS_MULTIPLIER`
- Produces: `answerHistory` in state, expanded `saveResult` payload

**Note:** The user explicitly said NOT to commit. Skip git steps.

- [ ] **Step 1: Add `answerHistory: []` to `initialState`**

```ts
const initialState: GameState = {
  ...
  aiAssistedQuestions: [],
  answerHistory: [],
};
```

- [ ] **Step 2: Add `answerHistory: []` to `START_GAME` and `RESTART_GAME`**

In both cases, add:
```ts
answerHistory: [],
```

- [ ] **Step 3: Add `answerHistory` to `RESTORE_GAME`**

```ts
answerHistory: action.payload.answerHistory ?? [],
```

- [ ] **Step 4: Update scoring in `SUBMIT_ANSWER` to use CONFIG and build AnswerRecord**

Replace:
```ts
let questionPoints = 0;
if (isCorrect) {
  const q = activeQ.question;
  const base = 10;
  const timeBonus = Math.floor((state.timerRemaining / q.timeLimit) * 5);
  questionPoints = base + timeBonus;
  if (state.aiAssistedQuestions.includes(q.id)) {
    questionPoints = Math.floor(questionPoints / 2);
  }
}
const score = state.score + questionPoints;
```

With:
```ts
let questionPoints = 0;
if (isCorrect) {
  const q = activeQ.question;
  const base = CONFIG.BASE_POINTS_PER_QUESTION;
  const timeBonus = Math.floor((state.timerRemaining / q.timeLimit) * CONFIG.TIME_BONUS_MULTIPLIER);
  questionPoints = base + timeBonus;
  if (state.aiAssistedQuestions.includes(q.id)) {
    questionPoints = Math.floor(questionPoints / 2);
  }
}
const score = state.score + questionPoints;

const answerRecord: AnswerRecord = {
  questionId: activeQ.question.id,
  clue: activeQ.question.clue,
  category: activeQ.question.category,
  status: newStatus,
  timeRemaining: state.timerRemaining,
  basePoints: isCorrect ? CONFIG.BASE_POINTS_PER_QUESTION : 0,
  timeBonus: isCorrect ? Math.floor((state.timerRemaining / activeQ.question.timeLimit) * CONFIG.TIME_BONUS_MULTIPLIER) : 0,
  aiUsed: state.aiAssistedQuestions.includes(activeQ.question.id),
  totalPointsEarned: questionPoints,
};
```

Add `answerHistory` to the return object:
```ts
return {
  ...state,
  activeIndex: null,
  questions,
  gridCells,
  score,
  categoryCounts,
  earnedBadges,
  answerHistory: [...state.answerHistory, answerRecord],
  phase: allDone ? "finished" : "playing",
  timerRemaining: 60,
};
```

- [ ] **Step 5: Add AnswerRecord for timeouts in `TICK_TIMER`**

In the `next <= 0` branch, before the return, build and append a timeout record:
```ts
const activeQ = state.questions[state.activeIndex];
const timeoutRecord: AnswerRecord = {
  questionId: activeQ.question.id,
  clue: activeQ.question.clue,
  category: activeQ.question.category,
  status: "timeout" as const,
  timeRemaining: 0,
  basePoints: 0,
  timeBonus: 0,
  aiUsed: state.aiAssistedQuestions.includes(activeQ.question.id),
  totalPointsEarned: 0,
};
```

Add to return:
```ts
answerHistory: [...state.answerHistory, timeoutRecord],
```

- [ ] **Step 6: Expand `saveResult` payload in the finished-game effect**

Replace the result construction at lines 373-378:
```ts
const result = {
  name: state.session.name,
  email: state.session.email,
  score: state.score,
  date: new Date().toISOString(),
  earnedBadges: state.earnedBadges,
  answerHistory: state.answerHistory,
};
saveResult(result);
localStorage.setItem("horizon-puzzle-score", JSON.stringify(result));
```

- [ ] **Step 7: Add `answerHistory` to the save-game localStorage payload**

Add to the `saveData` object:
```ts
answerHistory: state.answerHistory,
```

And add `state.answerHistory` to the useEffect dependency array.

---

### Task 3: Update API Route

**Files:**
- Modify: `src/app/api/result/route.ts`

**Interfaces:**
- Consumes: `AnswerRecord`, `Category`
- Updates: `ResultEntry`, validation logic

- [ ] **Step 1: Update `ResultEntry` interface**

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

- [ ] **Step 2: Remove score cap validation**

Replace:
```ts
if (typeof score !== 'number' || score < 0 || score > CONFIG.MAX_TOTAL_QUESTIONS) {
  return NextResponse.json(
    { success: false, error: `Score must be between 0 and ${CONFIG.MAX_TOTAL_QUESTIONS}` },
    { status: 400 },
  );
}
```

With:
```ts
if (typeof score !== 'number' || score < 0) {
  return NextResponse.json(
    { success: false, error: 'Score must be a non-negative number' },
    { status: 400 },
  );
}
```

- [ ] **Step 3: Pass through `earnedBadges` and `answerHistory` in POST**

In `newEntry`, add:
```ts
const bodyRecord = body as Record<string, unknown>;
const newEntry: ResultEntry = {
  name: name.trim(),
  email,
  score,
  date: typeof date === 'string' ? date : new Date().toISOString(),
  earnedBadges: (bodyRecord.earnedBadges as Record<string, boolean> | undefined) ?? undefined,
  answerHistory: (bodyRecord.answerHistory as AnswerRecord[] | undefined) ?? undefined,
};
```

---

### Task 4: Update Leaderboard Page (Server Component)

**Files:**
- Modify: `src/app/(ui)/leaderboard/page.tsx`

**Interfaces:**
- Consumes: `LeaderboardEntry`
- Produces: Typed props for `InteractiveLeaderboard`

- [ ] **Step 1: Update `PlayerEntry` interface and parsing**

Replace:
```ts
interface PlayerEntry {
  name: string;
  score: number;
}
```

With:
```ts
import type { LeaderboardEntry as LeaderboardEntryType, Category } from '@/types';
```

Replace the parsing block:
```ts
const allResults = JSON.parse(fileContents) as LeaderboardEntryType[];
players = allResults
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
  .map((entry) => ({
    ...entry,
    earnedBadges: (entry.earnedBadges ?? {}) as Record<Category, boolean>,
    answerHistory: entry.answerHistory ?? [],
  }));
```

- [ ] **Step 2: Replace the rendered list with `<InteractiveLeaderboard>`**

Import and use:
```tsx
import InteractiveLeaderboard from '@/components/InteractiveLeaderboard';

// Replace the full .map(...) section with:
<InteractiveLeaderboard players={players} />
```

Remove the now-unused `TrophyIcon` import (it moves to the client component).

---

### Task 5: Create InteractiveLeaderboard Client Component

**Files:**
- Create: `src/components/InteractiveLeaderboard.tsx`

**Interfaces:**
- Consumes: `LeaderboardEntry` with `earnedBadges` and `answerHistory`

- [ ] **Step 1: Write the component file**

```tsx
"use client";

import { useState } from "react";
import { TrophyIcon, CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { LeaderboardEntry, AnswerRecord, Category } from "@/types";
import { CATEGORY_COLORS, getAllCategories } from "@/data/config";

const ALL_CATEGORIES = getAllCategories();

export default function InteractiveLeaderboard({
  players,
}: {
  players: LeaderboardEntry[];
}) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const selectedPlayer = selectedEmail
    ? players.find((p) => p.email === selectedEmail)
    : null;

  function handleClose() {
    setSelectedEmail(null);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {players.length === 0 && (
          <p className="text-center text-white/60 py-8">
            No scores yet. Play a game to appear here!
          </p>
        )}

        {players.map((player, i) => {
          const rank = i + 1;
          const isSelected = selectedEmail === player.email;

          let rowClasses =
            "flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer";
          if (isSelected) {
            rowClasses += " ring-2 ring-white/40";
          }

          let rankIcon: React.ReactNode;
          let nameClasses = "text-white/85";
          let scoreClasses = "text-white";

          if (rank === 1) {
            rowClasses += " bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/50";
            nameClasses = "text-xl font-extrabold text-white";
            scoreClasses = "text-xl font-extrabold text-yellow-300";
            rankIcon = <TrophyIcon className="w-8 h-8 text-yellow-300 flex-shrink-0" />;
          } else if (rank === 2) {
            rowClasses += " bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/50";
            nameClasses = "text-lg font-bold text-white";
            scoreClasses = "text-lg font-bold text-white/85";
            rankIcon = <TrophyIcon className="w-7 h-7 text-white/80 flex-shrink-0" />;
          } else if (rank === 3) {
            rowClasses += " bg-gradient-to-r from-amber-700/20 to-transparent border-amber-700/50";
            nameClasses = "text-lg font-bold text-white";
            scoreClasses = "text-lg font-bold text-amber-300";
            rankIcon = <TrophyIcon className="w-6 h-6 text-amber-300 flex-shrink-0" />;
          } else {
            rankIcon = <span className="w-8 text-center text-white/50 text-sm">{rank}</span>;
          }

          return (
            <div
              key={player.email}
              className={rowClasses}
              onClick={() => setSelectedEmail(isSelected ? null : player.email)}
            >
              <div className="flex items-center gap-4 min-w-0">
                {rankIcon}
                <span className={`truncate ${nameClasses}`}>{player.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={scoreClasses}>{player.score} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-lg mt-10 mb-10 rounded-ui-card bg-surface-default p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="font-heading text-xl font-bold text-content-primary">
                {selectedPlayer.name}
              </h2>
              <p className="mt-1 text-3xl font-bold text-brand-main">
                {selectedPlayer.score} pts
              </p>
            </div>

            {/* Earned Badges */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-content-primary/40">
                Certifications Earned
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.filter((c) => selectedPlayer.earnedBadges[c]).length === 0 ? (
                  <p className="text-sm text-content-primary/50">No certifications earned</p>
                ) : (
                  ALL_CATEGORIES.filter((c) => selectedPlayer.earnedBadges[c]).map((cat) => (
                    <span
                      key={cat}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[cat]?.card ?? "bg-zinc-100 text-zinc-700"}`}
                    >
                      <CheckBadgeIcon className="h-3.5 w-3.5" />
                      {cat}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Score Breakdown */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-content-primary/40">
                Score Breakdown
              </h3>
              {selectedPlayer.answerHistory.length === 0 ? (
                <p className="text-sm text-content-primary/50">No breakdown data available</p>
              ) : (
                <div className="space-y-2">
                  {selectedPlayer.answerHistory.map((record, idx) => (
                    <div
                      key={record.questionId}
                      className={`rounded-md bg-zinc-50 p-3 text-xs ${
                        record.status === "failed" || record.status === "timeout"
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-content-primary/60">
                          #{idx + 1}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            record.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : record.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <p className="mb-1 font-medium text-content-primary truncate">
                        {record.clue}
                      </p>
                      <p className="text-content-primary/60">
                        <span className="font-mono">{record.basePoints}</span>{" "}
                        (Base)
                        {record.status === "completed" && (
                          <>
                            {" + "}
                            <span className="font-mono">{record.timeBonus}</span>{" "}
                            (Time)
                          </>
                        )}
                        {record.aiUsed && (
                          <>
                            {" "}
                            <span className="inline-flex items-center rounded bg-amber-100 px-1 py-0.5 text-[10px] font-bold text-amber-700">
                              AI -50%
                            </span>
                          </>
                        )}
                        {" = "}
                        <span className="font-mono font-bold text-content-primary">
                          {record.totalPointsEarned}
                        </span>{" "}
                        pts
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

---

### Task 6: Build Verification

**Files:**
- All modified + new files

- [ ] **Step 1: Run the build**

```bash
pnpm build
```

Expected: ✓ Compiled successfully, zero TypeScript errors, zero lint warnings.

- [ ] **Step 2: Manual smoke test**

1. Play a game on `/puzzle` — answer some questions, use AI assist on some, let some time out
2. Visit `/leaderboard` — verify the new entry appears with a score > 15 (points-based)
3. Click the row — verify the modal opens with badges and score breakdown
4. Verify the math: base + time bonus = total (with AI -50% shown where applicable)
5. Verify timeout/failed questions appear with "timeout"/"failed" badge and 0 pts
6. Click backdrop or X to close modal
7. Verify existing leaderboard entries (without badges/history) still render and show "No breakdown data available"
