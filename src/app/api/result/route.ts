import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '@/data/config';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'results.json');

interface ResultEntry {
  name: string;
  email: string;
  score: number;
  timeRemaining: number;
  aiUsed: boolean;
  date: string;
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
      .sort((a, b) => b.score - a.score || b.timeRemaining - a.timeRemaining)
      .slice(0, 10);
    return NextResponse.json({ results: sorted });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { name, email, score, timeRemaining, aiUsed, date } = body as Record<string, unknown>;

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
    const newEntry = {
      name: name.trim(),
      email,
      score,
      timeRemaining: typeof timeRemaining === 'number' ? timeRemaining : 0,
      aiUsed: typeof aiUsed === 'boolean' ? aiUsed : false,
      date: typeof date === 'string' ? date : new Date().toISOString(),
    };

    const existingIndex = results.findIndex((r) => r.email === newEntry.email);
    if (existingIndex !== -1) {
      if (newEntry.score > results[existingIndex].score) {
        results[existingIndex].score = newEntry.score;
        results[existingIndex].timeRemaining = newEntry.timeRemaining;
        results[existingIndex].aiUsed = newEntry.aiUsed;
        results[existingIndex].date = newEntry.date;
        results[existingIndex].name = newEntry.name;
      }
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
