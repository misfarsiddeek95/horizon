# Scoring Engine Documentation

## 1. Overview

Horizon uses a **weighted, unbounded scoring model** that rewards both accuracy and speed. Each correct answer earns base points plus a time bonus based on how quickly the player responded. AI assistance is tracked per-question and applies a 50% penalty only to the specific question where it was used — not the entire session.

All numeric constants are defined in `CONFIG` (`src/data/config.ts`) so values can be tuned without touching the engine logic.

---

## 2. Game Structure

- **15 questions** per game (`CONFIG.MAX_TOTAL_QUESTIONS`)
- Distributed across **5 categories** (`CONFIG.QUESTIONS_PER_CATEGORY = 3` per category)
- Categories: Company & Identity, Products & Solutions, Innovation Technology & Future Growth, Sustainability/ESG, Performance & Growth

---

## 3. Point Calculation (The Math)

### Base Points

Awarded for each **correct** answer. Defined in `CONFIG.BASE_POINTS_PER_QUESTION` (default: `10`).

Incorrect or timed-out questions receive `0` base points.

### Time Bonus

Rewards quick answers. Calculated as:

```
timeBonus = Math.floor((timerRemaining / timeLimit) * CONFIG.TIME_BONUS_MULTIPLIER)
```

Where:
- `timerRemaining` = seconds left on the clock when submitted
- `timeLimit` = the question's total time (typically 60s, defined per-question in `Question.timeLimit`)
- `CONFIG.TIME_BONUS_MULTIPLIER` = scaling factor (default: `5`)

Example at `timeLimit = 60s`:
| Time Remaining | Calculation | Bonus |
|----------------|-------------|-------|
| 60s            | (60/60) × 5 | 5     |
| 30s            | (30/60) × 5 | 2     |
| 5s             | (5/60) × 5  | 0     |

### Per-Question Total

```
questionPoints = basePoints + timeBonus
```

### AI Assist Penalty

When a player clicks "Need Help?" on a question, `USE_AI_ASSIST` is dispatched, adding that question's ID to `aiAssistedQuestions`. If the question is in that array at submission time, the 50% penalty is applied **granularly** (per-question, not globally):

```
if (aiAssistedQuestions.includes(questionId)):
  totalPoints = Math.floor(questionPoints / 2)
```

This means only the AI-assisted question receives half points; all other questions are scored at full value.

**Example scores per question (timeLimit = 60s):**

| Scenario                  | Base | Time Bonus | AI Penalty | Total |
|---------------------------|------|------------|------------|-------|
| Correct, full time        | 10   | 5          | —          | **15** |
| Correct, 30s remaining    | 10   | 2          | —          | **12** |
| Correct, 5s remaining     | 10   | 0          | —          | **10** |
| Correct + AI, full time   | 10   | 5          | ×0.5       | **7**  |
| Correct + AI, 30s         | 10   | 2          | ×0.5       | **6**  |

---

## 4. Timeout & Failure Handling

- **Failed** (wrong answer): `0` points. An `AnswerRecord` is pushed with `status: "failed"` and all point fields set to `0`.
- **Timeout** (timer expired): `0` points. An `AnswerRecord` is pushed with `status: "timeout"` and all point fields set to `0`.

### Grid Cell Locking

Cells for failed or timed-out questions remain **unlocked** so intersecting words can still be completed. Only cells belonging to correctly-answered (`"completed"`) questions are locked (`CrosswordGrid.tsx:74`).

---

## 6. The Receipt System (AnswerRecord)

### Data Shape

```typescript
interface AnswerRecord {
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

### When Records Are Created

1. **`SUBMIT_ANSWER` action** — After validating the answer and calculating points, an `AnswerRecord` is built with the exact values used in the scoring formula:
   - `basePoints` = `CONFIG.BASE_POINTS_PER_QUESTION` (or `0` if wrong)
   - `timeBonus` = computed time bonus (or `0` if wrong)
   - `aiUsed` = whether the question ID is in `aiAssistedQuestions`
   - `totalPointsEarned` = the final `questionPoints` value after any AI penalty
   - `status` = `"completed"` or `"failed"`

2. **`TICK_TIMER` action** (timeout path) — When the timer reaches `0`, a record is created with:
   - `basePoints: 0`, `timeBonus: 0`, `totalPointsEarned: 0`
   - `status: "timeout"`
   - `timeRemaining: 0`

### Persistence

- Records are stored in `GameState.answerHistory` and `SavedGameState.answerHistory`
- On game completion, `answerHistory` is sent to the API (`/api/result`) and stored in `results.json`
- The Leaderboard's receipt modal reads `answerHistory` to display the per-question breakdown with the full math (e.g., "10 (Base) + 3 (Time) [AI -50%] = 7 pts")

### Why clue/category Are Stored Inline

`clue` and `category` are written to the record at submission time so the Leaderboard modal can render the breakdown without needing access to the question pool. The record is self-contained.

---

## 5. Replayability & Multiple Attempts (Leaderboard Logic)

### The "Personal Best" (Upsert) System

The leaderboard identifies players by their **email address**. Each email can only have one entry — the system uses an **upsert** strategy. When a result is submitted via `POST /api/result`, the server checks if the email already exists in `results.json`. If it does, the existing record is updated; if not, a new entry is created.

### Higher Score Scenario

If the same player plays again and achieves a **higher score** than their previous attempt:

- The leaderboard entry is **fully replaced** with the new attempt data:
  - New score
  - New `earnedBadges` (updated certification badges from the better run)
  - New `answerHistory` (the complete per-question receipt from this attempt)
  - Updated `date`
- The old record is discarded — the leaderboard always reflects the player's best performance.

### Lower Score Scenario

If the player plays again and scores **lower or equal** to their previous attempt:

- The leaderboard entry is **left completely untouched**.
- The old higher score, its associated badges, and its detailed answer receipt remain on the leaderboard.
- The new attempt's data is silently ignored.

This guarantees that **replaying never hurts** — players are free to practice and improve without risk of overwriting a good score with a bad one. The leaderboard always displays everyone's personal best.
