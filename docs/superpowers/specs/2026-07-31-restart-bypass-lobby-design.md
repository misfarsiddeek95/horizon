# Restart-Bypasses-Lobby + Lobby Contrast — Design Spec

## Overview

Two changes to the previous Instruction Lobby / Exit work:

1. **Restart bypasses the lobby.** Restarting during gameplay immediately wipes the board, generates a fresh grid, and returns to `playing` (clock ticking) — the lobby is skipped. The lobby is now shown **only** on a fresh login.
2. **Lobby contrast.** The card icons and the AI-assist 50% penalty phrase switch from `text-accent-main` to `text-yellow-400` for comfortable readability against the dark teal glassmorphism.

This reverses the earlier "Restart drops back to the lobby" decision (per the updated requirement). `RESTART_GAME` was the only other action setting `phase: 'idle'`; after this change, only `ENTER_LOBBY` does, so the lobby appears exclusively after `enterLobby`.

---

## 1. State (`src/types.ts`)

`RESTART_GAME` regains its payload:

```ts
| { type: 'RESTART_GAME'; payload: StartGamePayload }
```

---

## 2. Context (`src/context/PuzzleContext.tsx`)

### Reducer case `RESTART_GAME` (payload-based, sets `playing`)

```ts
case 'RESTART_GAME': {
  return {
    ...state,
    phase: 'playing',
    session: action.payload.session,
    questions: action.payload.questions,
    gridCells: action.payload.gridCells,
    wordPlacements: action.payload.wordPlacements,
    gridWidth: action.payload.gridWidth,
    gridHeight: action.payload.gridHeight,
    activeIndex: null,
    score: 0,
    categoryCounts: { ...categoryDefaults },
    earnedBadges: { ...badgeDefaults },
    timerRemaining: 60,
    isPaused: false,
    aiAssistedQuestions: [],
    answerHistory: [],
    badgeQueue: [],
    elapsedSeconds: 0,
  };
}
```

### Callback

```ts
const restartGame = useCallback(() => {
  localStorage.removeItem('horizon-puzzle-game-state');
  const gameData = initializeGame();
  dispatch({
    type: 'RESTART_GAME',
    payload: { ...gameData, session: sessionRef.current! },
  });
}, []);
```

The `TICK_GAME_CLOCK` effect starts immediately because `phase === 'playing'` and `isPaused` is false (and `elapsedSeconds` reset to 0).

---

## 3. Flow Validation

1. **New login:** `onboarding` → `enterLobby` → `idle` (Lobby) → Start → `playing`.
2. **Restart:** `playing` → `restartGame()` → wipe + fresh grid → `playing` (lobby skipped, clock ticks).
3. **Exit:** `LOGOUT` → `onboarding` → login again → `enterLobby` → `idle` (lobby on fresh session).

---

## 4. Lobby Contrast (`src/components/InstructionLobby.tsx`)

- Card icon chip: `text-accent-main` → `text-yellow-400` (background stays `bg-white/10`).
- AI Assist penalty phrase ("50% of that word's points"): `text-accent-main` → `text-yellow-400`.
- Everything else (glass cards, `bg-accent-main` Start button, gold highlight border) unchanged.

---

## 5. Files Changed

| File | Change |
|------|--------|
| `src/types.ts` | `RESTART_GAME` gains `payload: StartGamePayload` |
| `src/context/PuzzleContext.tsx` | Payload-based `RESTART_GAME` reducer (→ `playing`); `restartGame()` generates fresh grid |
| `src/components/InstructionLobby.tsx` | Icons + penalty text → `text-yellow-400` |
