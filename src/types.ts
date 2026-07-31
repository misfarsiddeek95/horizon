export type Category = 'Company & Identity' | 'Products & Solutions' | 'Innovation, Technology & Future Growth' | 'Sustainability/ESG' | 'Performance & Growth';

export interface Question {
  id: string;
  category: Category;
  word: string;
  clue: string;
  timeLimit: number;
}

export interface GridCell {
  x: number;
  y: number;
  letter: string | null;
  isActive: boolean;
  questionId: string | null;
  wordIndex: number | null;
  cellIndex: number | null;
  isStartOfWord: boolean;
}

export interface WordPlacement {
  word: string;
  startX: number;
  startY: number;
  direction: 'across' | 'down';
  questionId: string;
  questionIndex: number;
  number: number;
  cells: { x: number; y: number; letter: string; index: number }[];
}

export interface SessionData {
  name: string;
  email: string;
  consented: boolean;
}

export type BadgeType = 'category' | 'achievement';

export interface BadgeDefinition {
  id: string;
  type: BadgeType;
  title: string;
  description: string;
}

export type QuestionStatus = 'pending' | 'active' | 'completed' | 'failed' | 'timeout';

export interface QuestionState {
  question: Question;
  status: QuestionStatus;
  number: number;
}

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

export interface LeaderboardEntry {
  name: string;
  email: string;
  score: number;
  date: string;
  earnedBadges: Record<Category, boolean>;
  answerHistory: AnswerRecord[];
}

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

export interface SavedGameState {
  session: SessionData;
  questions: QuestionState[];
  gridCells: GridCell[][];
  wordPlacements: WordPlacement[];
  score: number;
  categoryCounts: Record<Category, number>;
  earnedBadges: Record<Category, boolean>;
  timerRemaining: number;
  activeIndex: number | null;
  gridWidth: number;
  gridHeight: number;
  aiAssistedQuestions: string[];
  answerHistory: AnswerRecord[];
  elapsedSeconds: number;
}

export interface StartGamePayload {
  session: SessionData;
  questions: QuestionState[];
  gridCells: GridCell[][];
  wordPlacements: WordPlacement[];
  gridWidth: number;
  gridHeight: number;
}

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
