"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type {
  GameState,
  GameAction,
  SessionData,
  QuestionState,
  Question,
  Category,
  SavedGameState,
  LeaderboardEntry,
  AnswerRecord,
} from "@/types";
import { questionPool } from "@/data/questions";
import { generateGrid } from "@/utils/gridGenerator";
import { saveResult } from "@/data/leaderboard";
import { CONFIG, getAllCategories } from "@/data/config";
import { evaluateBadges } from "@/data/badges";
import { isMuted, setMuted } from "@/utils/sound";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initializeGame() {
  const activePool = questionPool.filter(
    (q) => !CONFIG.EXCLUDED_CATEGORIES.includes(q.category)
  );
  const groupedQuestions = activePool.reduce<Record<string, Question[]>>(
    (acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    },
    {}
  );

  const availableCategories = Object.keys(groupedQuestions);
  const shuffledCategories = shuffle(availableCategories);
  const maxCategoriesToPick = Math.floor(
    CONFIG.MAX_TOTAL_QUESTIONS / CONFIG.QUESTIONS_PER_CATEGORY
  );
  const selectedCategories = shuffledCategories.slice(0, maxCategoriesToPick);

  const selected: Question[] = [];
  for (const category of selectedCategories) {
    const categoryQuestions = groupedQuestions[category];
    const shuffled = shuffle(categoryQuestions);
    selected.push(...shuffled.slice(0, CONFIG.QUESTIONS_PER_CATEGORY));
  }

  const finalSelected = shuffle(selected);
  const questions: QuestionState[] = finalSelected.map((q, i) => ({
    question: q,
    status: "pending" as const,
    number: i + 1,
  }));

  const gridResult = generateGrid(
    finalSelected.map((q, i) => ({ word: q.word, id: q.id, number: i + 1 }))
  );

  return {
    questions,
    wordPlacements: gridResult.placements,
    gridCells: gridResult.gridCells,
    gridWidth: gridResult.width,
    gridHeight: gridResult.height,
  };
}

const categoryDefaults: Record<Category, number> = Object.fromEntries(
  getAllCategories().map((c) => [c, 0]),
) as Record<Category, number>;

const badgeDefaults: Record<Category, boolean> = Object.fromEntries(
  getAllCategories().map((c) => [c, false]),
) as Record<Category, boolean>;

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

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      return {
        ...state,
        phase: "playing",
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
        aiAssistedQuestions: [],
        answerHistory: [],
        badgeQueue: [],
        elapsedSeconds: 0,
      };
    }

    case "SELECT_QUESTION": {
      if (state.activeIndex !== null) return state;
      const idx = action.payload;
      if (idx < 0 || idx >= state.questions.length) return state;
      if (state.questions[idx].status !== "pending") return state;

      const questions = state.questions.map((q, i) => ({
        ...q,
        status: i === idx ? ("active" as const) : q.status,
      }));

      return {
        ...state,
        activeIndex: idx,
        questions,
        timerRemaining: state.questions[idx].question.timeLimit,
      };
    }

    case "UPDATE_CELL": {
      if (state.activeIndex === null) return state;
      const { x, y, letter } = action.payload;
      const activeQ = state.questions[state.activeIndex];
      if (activeQ.status !== "active") return state;

      const gridCells = state.gridCells.map((row) =>
        row.map((cell) => {
          if (cell.x === x && cell.y === y) {
            return { ...cell, letter: letter.toUpperCase() || null };
          }
          return cell;
        })
      );

      return { ...state, gridCells };
    }

    case "USE_AI_ASSIST": {
      const { questionId } = action.payload;
      if (state.aiAssistedQuestions.includes(questionId)) return state;
      return {
        ...state,
        aiAssistedQuestions: [...state.aiAssistedQuestions, questionId],
      };
    }

    case "SUBMIT_ANSWER": {
      if (state.activeIndex === null) return state;
      const activeQ = state.questions[state.activeIndex];
      if (activeQ.status !== "active") return state;

      const placement = state.wordPlacements.find(
        (p) => p.questionId === activeQ.question.id
      );
      if (!placement) return state;

      const allFilled = placement.cells.every((c) => {
        const cell = state.gridCells[c.y]?.[c.x];
        return cell && cell.letter !== null;
      });
      if (!allFilled) return state;

      const correctWord = placement.word.toUpperCase();
      let isCorrect = true;
      for (const c of placement.cells) {
        const cell = state.gridCells[c.y]?.[c.x];
        if (!cell || cell.letter !== correctWord[c.index]) {
          isCorrect = false;
          break;
        }
      }

      const newStatus = isCorrect
        ? ("completed" as const)
        : ("failed" as const);
      const questions = state.questions.map((q, i) =>
        i === state.activeIndex ? { ...q, status: newStatus } : q
      );

      const categoryCounts = { ...state.categoryCounts };
      const earnedBadges = { ...state.earnedBadges };
      if (isCorrect) {
        const cat = activeQ.question.category;
        categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
        if (categoryCounts[cat] >= CONFIG.QUESTIONS_PER_CATEGORY) {
          earnedBadges[cat] = true;
        }
      }

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

      let gridCells = state.gridCells;
      if (isCorrect) {
        gridCells = gridCells.map((row) =>
          row.map((cell) => {
            if (cell.questionId === activeQ.question.id) {
              const placementCell = placement.cells.find(
                (c) => c.x === cell.x && c.y === cell.y
              );
              return {
                ...cell,
                letter: placementCell?.letter ?? cell.letter,
              };
            }
            return cell;
          })
        );
      }

      const allDone = questions.every(
        (q) => q.status !== "pending" && q.status !== "active"
      );

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
    }

    case "TICK_TIMER": {
      if (state.activeIndex === null) return state;
      if (state.isPaused) return state;
      const next = state.timerRemaining - 1;
      if (next <= 0) {
        const timeoutActiveQ = state.questions[state.activeIndex];
        const timeoutRecord: AnswerRecord = {
          questionId: timeoutActiveQ.question.id,
          clue: timeoutActiveQ.question.clue,
          category: timeoutActiveQ.question.category,
          status: "timeout" as const,
          timeRemaining: 0,
          basePoints: 0,
          timeBonus: 0,
          aiUsed: state.aiAssistedQuestions.includes(timeoutActiveQ.question.id),
          totalPointsEarned: 0,
        };
        const questions = state.questions.map((q, i) =>
          i === state.activeIndex ? { ...q, status: "timeout" as const } : q
        );
        const allDone = questions.every(
          (q) => q.status !== "pending" && q.status !== "active"
        );
        return {
          ...state,
          activeIndex: null,
          questions,
          answerHistory: [...state.answerHistory, timeoutRecord],
          phase: allDone ? "finished" : "playing",
          timerRemaining: 0,
          isPaused: false,
        };
      }
      return { ...state, timerRemaining: next };
    }

    case "PAUSE_GAME": {
      if (state.phase !== "playing") return state;
      return { ...state, isPaused: true };
    }

    case "RESUME_GAME": {
      if (state.phase !== "playing" || !state.isPaused) return state;
      return { ...state, isPaused: false };
    }

    case "RESTORE_GAME": {
      return {
        ...state,
        phase: "playing",
        isPaused: false,
        session: action.payload.session,
        questions: action.payload.questions,
        gridCells: action.payload.gridCells,
        wordPlacements: action.payload.wordPlacements,
        score: action.payload.score,
        categoryCounts: action.payload.categoryCounts,
        earnedBadges: action.payload.earnedBadges ?? { ...badgeDefaults },
        timerRemaining: action.payload.timerRemaining,
        activeIndex: action.payload.activeIndex,
        gridWidth: action.payload.gridWidth,
        gridHeight: action.payload.gridHeight,
        aiAssistedQuestions: action.payload.aiAssistedQuestions ?? [],
        answerHistory: action.payload.answerHistory ?? [],
        elapsedSeconds: action.payload.elapsedSeconds ?? 0,
      };
    }

    case "RESTART_GAME": {
      return {
        ...state,
        phase: "playing",
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

    case "RESET":
      return { ...initialState, isMuted: state.isMuted };

    default:
      return state;
  }
}

interface PuzzleContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (session: SessionData) => void;
  restartGame: () => void;
}

const PuzzleContext = createContext<PuzzleContextValue | null>(null);

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.activeIndex !== null && state.phase === "playing") {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.activeIndex, state.phase]);

  useEffect(() => {
    if (state.phase !== "playing" || state.isPaused) return;
    const clock = setInterval(() => {
      dispatch({ type: "TICK_GAME_CLOCK" });
    }, 1000);
    return () => clearInterval(clock);
  }, [state.phase, state.isPaused]);

  useEffect(() => {
    dispatch({ type: "SET_MUTED", payload: isMuted() });
  }, []);

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

  useEffect(() => {
    if (state.phase === "finished" && state.session) {
      const result: LeaderboardEntry = {
        name: state.session.name,
        email: state.session.email,
        score: state.score,
        date: new Date().toISOString(),
        earnedBadges: state.earnedBadges,
        answerHistory: state.answerHistory,
      };
      saveResult(result);
      localStorage.setItem("horizon-puzzle-score", JSON.stringify(result));
      localStorage.removeItem("horizon-puzzle-game-state");
    }
  }, [state.phase, state.session, state.score, state.earnedBadges, state.answerHistory]);

  useEffect(() => {
    if (state.phase === "playing") {
      const saveData: SavedGameState = {
        session: state.session!,
        questions: state.questions,
        gridCells: state.gridCells,
        wordPlacements: state.wordPlacements,
        score: state.score,
        categoryCounts: state.categoryCounts,
        earnedBadges: state.earnedBadges,
        timerRemaining: state.timerRemaining,
        activeIndex: state.activeIndex,
        gridWidth: state.gridWidth,
        gridHeight: state.gridHeight,
        aiAssistedQuestions: state.aiAssistedQuestions,
        answerHistory: state.answerHistory,
        elapsedSeconds: state.elapsedSeconds,
      };
      localStorage.setItem(
        "horizon-puzzle-game-state",
        JSON.stringify(saveData)
      );
    }
  }, [
    state.phase,
    state.session,
    state.questions,
    state.gridCells,
    state.wordPlacements,
    state.score,
    state.categoryCounts,
    state.earnedBadges,
    state.timerRemaining,
    state.activeIndex,
    state.gridWidth,
    state.gridHeight,
    state.aiAssistedQuestions,
    state.answerHistory,
    state.elapsedSeconds,
  ]);

  useEffect(() => {
    if (state.phase !== "playing") return;

    function handleVisibilityChange() {
      if (document.hidden) {
        dispatch({ type: "PAUSE_GAME" });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [state.phase]);

  const sessionRef = useRef(state.session);

  useEffect(() => {
    sessionRef.current = state.session;
  }, [state.session]);

  const startGame = useCallback((session: SessionData) => {
    const gameData = initializeGame();
    dispatch({
      type: "START_GAME",
      payload: { ...gameData, session },
    });
  }, []);

  const restartGame = useCallback(() => {
    localStorage.removeItem("horizon-puzzle-game-state");
    const gameData = initializeGame();
    dispatch({
      type: "RESTART_GAME",
      payload: { ...gameData, session: sessionRef.current! },
    });
  }, []);

  useEffect(() => {
    const savedGame = localStorage.getItem("horizon-puzzle-game-state");
    if (savedGame) {
      try {
        const parsed: SavedGameState = JSON.parse(savedGame);
        dispatch({ type: "RESTORE_GAME", payload: parsed });
        return;
      } catch {
        localStorage.removeItem("horizon-puzzle-game-state");
      }
    }

    const saved = localStorage.getItem("horizon-puzzle-session");
    if (saved) {
      try {
        const session = JSON.parse(saved) as SessionData;
        startGame(session);
      } catch {
        localStorage.removeItem("horizon-puzzle-session");
      }
    }
  }, [startGame]);

  return (
    <PuzzleContext.Provider value={{ state, dispatch, startGame, restartGame }}>
      {children}
    </PuzzleContext.Provider>
  );
}

export function usePuzzle() {
  const ctx = useContext(PuzzleContext);
  if (!ctx) throw new Error("usePuzzle must be used within PuzzleProvider");
  return ctx;
}
