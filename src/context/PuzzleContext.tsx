'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type {
  GameState,
  GameAction,
  SessionData,
  QuestionState,
  Question,
  Category,
} from '@/types';
import { questionPool } from '@/data/questions';
import { generateGrid } from '@/utils/gridGenerator';
import { saveResult } from '@/data/leaderboard';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initializeGame() {
  const groups: Record<Category, Question[]> = {
    Innovation: [],
    Sustainability: [],
    Financials: [],
    Governance: [],
  };
  for (const q of questionPool) {
    groups[q.category].push(q);
  }

  const selected: Question[] = [];
  for (const cat of ['Innovation', 'Sustainability', 'Financials', 'Governance'] as const) {
    const shuffled = shuffle(groups[cat]);
    selected.push(...shuffled.slice(0, 2));
  }

  const finalSelected = shuffle(selected);
  const questions: QuestionState[] = finalSelected.map((q, i) => ({
    question: q,
    status: 'pending' as const,
    number: i + 1,
  }));

  const gridResult = generateGrid(
    finalSelected.map((q, i) => ({ word: q.word, id: q.id, number: i + 1 })),
  );

  return {
    questions,
    wordPlacements: gridResult.placements,
    gridCells: gridResult.gridCells,
    gridWidth: gridResult.width,
    gridHeight: gridResult.height,
  };
}

const categoryDefaults: Record<Category, number> = {
  Innovation: 0,
  Sustainability: 0,
  Financials: 0,
  Governance: 0,
};

const initialState: GameState = {
  phase: 'onboarding',
  session: null,
  questions: [],
  activeIndex: null,
  gridCells: [],
  wordPlacements: [],
  score: 0,
  categoryCounts: { ...categoryDefaults },
  timerRemaining: 60,
  gridWidth: 0,
  gridHeight: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
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
        timerRemaining: 60,
      };
    }

    case 'SELECT_QUESTION': {
      if (state.activeIndex !== null) return state;
      const idx = action.payload;
      if (idx < 0 || idx >= state.questions.length) return state;
      if (state.questions[idx].status !== 'pending') return state;

      const questions = state.questions.map((q, i) => ({
        ...q,
        status: i === idx ? 'active' as const : q.status,
      }));

      return {
        ...state,
        activeIndex: idx,
        questions,
        timerRemaining: state.questions[idx].question.timeLimit,
      };
    }

    case 'UPDATE_CELL': {
      if (state.activeIndex === null) return state;
      const { x, y, letter } = action.payload;
      const activeQ = state.questions[state.activeIndex];
      if (activeQ.status !== 'active') return state;

      const gridCells = state.gridCells.map((row) =>
        row.map((cell) => {
          if (cell.x === x && cell.y === y) {
            return { ...cell, letter: letter.toUpperCase() || null };
          }
          return cell;
        }),
      );

      return { ...state, gridCells };
    }

    case 'SUBMIT_ANSWER': {
      if (state.activeIndex === null) return state;
      const activeQ = state.questions[state.activeIndex];
      if (activeQ.status !== 'active') return state;

      const placement = state.wordPlacements.find(
        (p) => p.questionId === activeQ.question.id,
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

      const newStatus = isCorrect ? 'completed' as const : 'failed' as const;
      const questions = state.questions.map((q, i) =>
        i === state.activeIndex ? { ...q, status: newStatus } : q,
      );

      const categoryCounts = { ...state.categoryCounts };
      if (isCorrect) {
        categoryCounts[activeQ.question.category] =
          (categoryCounts[activeQ.question.category] ?? 0) + 1;
      }

      const score = isCorrect ? state.score + 1 : state.score;

      let gridCells = state.gridCells;
      if (isCorrect) {
        gridCells = gridCells.map((row) =>
          row.map((cell) => {
            if (cell.questionId === activeQ.question.id) {
              const placementCell = placement.cells.find(
                (c) => c.x === cell.x && c.y === cell.y,
              );
              return {
                ...cell,
                letter: placementCell?.letter ?? cell.letter,
              };
            }
            return cell;
          }),
        );
      }

      const allDone = questions.every(
        (q) => q.status !== 'pending' && q.status !== 'active',
      );

      return {
        ...state,
        activeIndex: null,
        questions,
        gridCells,
        score,
        categoryCounts,
        phase: allDone ? 'finished' : 'playing',
        timerRemaining: 60,
      };
    }

    case 'TICK_TIMER': {
      if (state.activeIndex === null) return state;
      const next = state.timerRemaining - 1;
      if (next <= 0) {
        const questions = state.questions.map((q, i) =>
          i === state.activeIndex ? { ...q, status: 'timeout' as const } : q,
        );
        const allDone = questions.every(
          (q) => q.status !== 'pending' && q.status !== 'active',
        );
        return {
          ...state,
          activeIndex: null,
          questions,
          phase: allDone ? 'finished' : 'playing',
          timerRemaining: 0,
        };
      }
      return { ...state, timerRemaining: next };
    }

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

interface PuzzleContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (session: SessionData) => void;
}

const PuzzleContext = createContext<PuzzleContextValue | null>(null);

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.activeIndex !== null && state.phase === 'playing') {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
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
    if (state.phase === 'finished' && state.session) {
      const result = {
        name: state.session.name,
        email: state.session.email,
        score: state.score,
        date: new Date().toISOString(),
      };
      saveResult(result);
      localStorage.setItem('horizon-puzzle-score', JSON.stringify(result));
    }
  }, [state.phase, state.session, state.score]);

  const startGame = useCallback((session: SessionData) => {
    const gameData = initializeGame();
    dispatch({
      type: 'START_GAME',
      payload: { ...gameData, session },
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('horizon-puzzle-session');
    if (saved) {
      try {
        const session = JSON.parse(saved) as SessionData;
        startGame(session);
      } catch {
        localStorage.removeItem('horizon-puzzle-session');
      }
    }
  }, [startGame]);

  return (
    <PuzzleContext.Provider value={{ state, dispatch, startGame }}>
      {children}
    </PuzzleContext.Provider>
  );
}

export function usePuzzle() {
  const ctx = useContext(PuzzleContext);
  if (!ctx) throw new Error('usePuzzle must be used within PuzzleProvider');
  return ctx;
}
