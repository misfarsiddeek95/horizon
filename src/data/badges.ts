import type { BadgeDefinition, BadgeEvaluation, Category } from '@/types';
import { getAllCategories, CONFIG } from './config';

const STORAGE_KEY = 'horizon-puzzle-badges';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getCategoryBadgeId(category: Category): string {
  return `category-${slugify(category)}`;
}

const categoryDefinitions: BadgeDefinition[] = getAllCategories().map(
  (category) => ({
    id: getCategoryBadgeId(category),
    type: 'category' as const,
    title: `${category} Expert`,
    description: `You've successfully answered every question in this challenge.`,
  })
);

export const ACHIEVEMENT_BADGES: Record<string, BadgeDefinition> = {
  'achievement-flawless': {
    id: 'achievement-flawless',
    type: 'achievement',
    title: 'Flawless Run',
    description:
      'Finished the puzzle with zero AI assists and every question correct.',
  },
  'achievement-speed-demon': {
    id: 'achievement-speed-demon',
    type: 'achievement',
    title: 'Speed Demon',
    description: `Completed the whole puzzle in ${CONFIG.SPEED_BADGE_TIME_LIMIT_SECONDS} seconds or less.`,
  },
  'achievement-first-win': {
    id: 'achievement-first-win',
    type: 'achievement',
    title: 'First Win',
    description: 'Completed your first puzzle.',
  },
};

const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = Object.fromEntries([
  ...categoryDefinitions.map((d) => [d.id, d]),
  ...Object.entries(ACHIEVEMENT_BADGES),
]);

export function getBadgeDefinition(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS[id];
}

export function getUnlockedBadges(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

export function markUnlocked(id: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getUnlockedBadges();
  if (current.includes(id)) return false;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  return true;
}

export function evaluateBadges(input: BadgeEvaluation): string[] {
  const newly: string[] = [];

  for (const category of getAllCategories()) {
    if (input.earnedBadges[category]) {
      const id = getCategoryBadgeId(category);
      if (markUnlocked(id)) newly.push(id);
    }
  }

  if (input.phase === 'finished') {
    if (input.aiUsedCount === 0 && input.allCorrect) {
      if (markUnlocked('achievement-flawless')) newly.push('achievement-flawless');
    }
    if (input.elapsedSeconds <= CONFIG.SPEED_BADGE_TIME_LIMIT_SECONDS) {
      if (markUnlocked('achievement-speed-demon')) newly.push('achievement-speed-demon');
    }
    if (markUnlocked('achievement-first-win')) newly.push('achievement-first-win');
  }

  return newly;
}
