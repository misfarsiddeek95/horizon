import type { LeaderboardEntry } from '@/types';

export async function saveResult(entry: LeaderboardEntry): Promise<boolean> {
  try {
    const res = await fetch('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch('/api/result');
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}
