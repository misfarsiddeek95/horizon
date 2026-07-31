# Exit (Logout / Switch Player) — Design Spec

## Overview

Add an **Exit** control that completely clears the current player's session and returns the app to a fresh onboarding state for a new user. It fixes the state-sync trap where clearing `localStorage` from DevTools gets overwritten by React's in-memory state: the callback wipes all persisted data **and** dispatches a reducer action so React's memory is cleared atomically with it.

**Critical UX rules (user-approved):**

1. **Confirm before wiping.** The Exit button opens a `ConfirmDialog` because an accidental click would destroy badges and game progress. Terminology is **"Exit"** (gaming UI), not "Logout".
2. **Audio preference survives.** `horizon-puzzle-muted` is intentionally NOT cleared.
3. **Secondary styling.** The Exit button must not compete with primary actions (e.g., the glowing Start Game button).

---

## 1. State (`src/types.ts`)

Add to the `GameAction` union:

```ts
| { type: 'LOGOUT' }
```

No `GameState` field changes. `BadgeEvaluation.phase` is unaffected (`'onboarding'` is already in the union).

---

## 2. Context (`src/context/PuzzleContext.tsx`)

### Reducer case `LOGOUT`

```ts
case 'LOGOUT':
  return { ...initialState, isMuted: state.isMuted };
```

Same semantics as the existing `RESET` case: `phase: 'onboarding'`, `session: null`, all questions/grid/score/badges/timers cleared, audio preference preserved.

### Callback

```ts
const logout = useCallback(() => {
  localStorage.removeItem('horizon-puzzle-session');
  localStorage.removeItem('horizon-puzzle-game-state');
  localStorage.removeItem('horizon-puzzle-score');
  localStorage.removeItem('horizon-puzzle-badges');
  dispatch({ type: 'LOGOUT' });
}, []);
```

- `horizon-puzzle-session` — identity (cleared).
- `horizon-puzzle-game-state` — mid-game autosave (cleared). *(Note: the user's request referenced `horizon-puzzle-state`; the real key in the codebase is `horizon-puzzle-game-state`.)*
- `horizon-puzzle-score` — last saved result (cleared).
- `horizon-puzzle-badges` — achievement persistence (cleared, per requirement).
- `horizon-puzzle-muted` — audio preference (kept).

Add `logout` to `PuzzleContextValue` and the provider value.

---

## 3. `ExitButton` (`src/components/ExitButton.tsx`, NEW)

- Client component consuming `usePuzzle()`.
- `variant?: 'light' | 'dark'` prop, matching the `MuteToggle` pattern:
  - `light`: `border-zinc-300 text-content-primary hover:bg-zinc-100` (puzzle header).
  - `dark`: `border-white/20 text-white hover:bg-white/10` (glass lobby).
- Icon: `ArrowRightStartOnRectangleIcon` from `@heroicons/react/24/outline` (the "arrow leaving a bracket").
- Label: **"Exit"**.
- Opens the existing `ConfirmDialog`:
  - title: **"Exit Game?"**
  - message: **"Are you sure you want to exit? Your session, badges, and current game progress will be permanently deleted."**
  - confirmLabel: **"Exit"**, cancelLabel: **"Cancel"**.
- On confirm: calls `logout()` and closes the dialog.

---

## 4. Integration

- **Puzzle header** (`src/app/(ui)/puzzle/page.tsx`): render `<ExitButton />` (light) next to the Restart button in the header action row.
- **InstructionLobby** (`src/components/InstructionLobby.tsx`): render `<ExitButton variant="dark" />` at the top-right of the lobby header so players can switch identity before starting.

---

## 5. Files Changed

| File | Change |
|------|--------|
| `src/types.ts` | Add `LOGOUT` action |
| `src/context/PuzzleContext.tsx` | `LOGOUT` reducer case, `logout()` callback, context value |
| `src/components/ExitButton.tsx` | NEW — button + ConfirmDialog, light/dark variants |
| `src/app/(ui)/puzzle/page.tsx` | ExitButton in header |
| `src/components/InstructionLobby.tsx` | ExitButton (dark) in lobby header |
