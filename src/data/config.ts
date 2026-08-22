import type { Category } from '@/types';
import { questionPool } from './questions';

export const CONFIG = {
  MAX_TOTAL_QUESTIONS: 10,
  QUESTIONS_PER_CATEGORY: 2,
  EXCLUDED_CATEGORIES: [] as string[],
  BASE_POINTS_PER_QUESTION: 10,
  TIME_BONUS_MULTIPLIER: 5,
  SPEED_BADGE_TIME_LIMIT_SECONDS: 180,
};

export function getAllCategories(): Category[] {
  return [...new Set(questionPool.map((q) => q.category))]
    .filter((c) => !CONFIG.EXCLUDED_CATEGORIES.includes(c)) as Category[];
}

export const CATEGORY_COLORS: Record<
  string,
  {
    base: string;
    halfBg: string;
    iconHalf: string;
    full: string;
    iconFull: string;
    card: string;
  }
> = {
  'Annual Report Experience': {
    base: 'border-amber-400 text-amber-600',
    halfBg: 'bg-amber-100',
    iconHalf: 'relative z-10 text-amber-500',
    full: 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200',
    iconFull: 'text-white',
    card: 'bg-amber-100 text-amber-600',
  },
  'Company, Governance & Performance': {
    base: 'border-blue-400 text-blue-600',
    halfBg: 'bg-blue-100',
    iconHalf: 'relative z-10 text-blue-500',
    full: 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200',
    iconFull: 'text-white',
    card: 'bg-blue-100 text-blue-600',
  },
  'Products, Solutions & Innovation': {
    base: 'border-teal-400 text-teal-600',
    halfBg: 'bg-teal-100',
    iconHalf: 'relative z-10 text-teal-500',
    full: 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-200',
    iconFull: 'text-white',
    card: 'bg-teal-100 text-teal-600',
  },
  'Sustainability, People & Impact': {
    base: 'border-green-400 text-green-600',
    halfBg: 'bg-green-100',
    iconHalf: 'relative z-10 text-green-500',
    full: 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200',
    iconFull: 'text-white',
    card: 'bg-emerald-100 text-emerald-600',
  },
  'Markets, Operations & Future Readiness': {
    base: 'border-cyan-400 text-cyan-600',
    halfBg: 'bg-cyan-100',
    iconHalf: 'relative z-10 text-cyan-500',
    full: 'bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-200',
    iconFull: 'text-white',
    card: 'bg-cyan-100 text-cyan-600',
  },
};
