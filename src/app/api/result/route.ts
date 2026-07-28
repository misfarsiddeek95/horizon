import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '@/data/config';
import type { AnswerRecord } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'results.json');

interface ResultEntry {
  name: string;
  email: string;
  score: number;
  date: string;
  earnedBadges?: Record<string, boolean>;
  answerHistory?: AnswerRecord[];
}

async function readResults(): Promise<ResultEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as ResultEntry[];
  } catch {
    return [];
  }
}

async function writeResults(results: ResultEntry[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(results, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const results = await readResults();
    const sorted = results
      .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    return NextResponse.json({ results: sorted });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { name, email, score, date } = body as Record<string, unknown>;

    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 },
      );
    }

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { success: false, error: 'Score must be a non-negative number' },
        { status: 400 },
      );
    }

    if (typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 },
      );
    }

    const results = await readResults();
    const bodyRecord = body as Record<string, unknown>;
    const newEntry: ResultEntry = {
      name: name.trim(),
      email,
      score,
      date: typeof date === 'string' ? date : new Date().toISOString(),
      earnedBadges: (bodyRecord.earnedBadges as Record<string, boolean> | undefined) ?? undefined,
      answerHistory: (bodyRecord.answerHistory as AnswerRecord[] | undefined) ?? undefined,
    };

    const existingIndex = results.findIndex((r) => r.email === newEntry.email);
    if (existingIndex !== -1) {
      results[existingIndex].score = Math.max(results[existingIndex].score, newEntry.score);
      results[existingIndex].date = newEntry.date;
      results[existingIndex].name = newEntry.name;
      if (newEntry.earnedBadges) results[existingIndex].earnedBadges = newEntry.earnedBadges;
      if (newEntry.answerHistory) results[existingIndex].answerHistory = newEntry.answerHistory;
    } else {
      results.push(newEntry);
    }
    await writeResults(results);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
