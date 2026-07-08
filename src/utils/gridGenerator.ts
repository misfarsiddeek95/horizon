import type { GridCell, WordPlacement } from '@/types';

interface WordInput {
  word: string;
  id: string;
  number: number;
}

interface PlacedWord {
  word: string;
  startX: number;
  startY: number;
  direction: 'across' | 'down';
  questionId: string;
  number: number;
}

interface GridResult {
  placements: WordPlacement[];
  gridCells: GridCell[][];
  width: number;
  height: number;
}

const VIRTUAL_SIZE = 50;
const CENTER = 25;

function buildLetterGrid(placed: PlacedWord[]): Map<string, string> {
  const grid = new Map<string, string>();
  for (const pw of placed) {
    const upper = pw.word.toUpperCase();
    for (let i = 0; i < upper.length; i++) {
      const x = pw.direction === 'across' ? pw.startX + i : pw.startX;
      const y = pw.direction === 'down' ? pw.startY + i : pw.startY;
      grid.set(`${x},${y}`, upper[i]);
    }
  }
  return grid;
}

function isSameDirAt(
  x: number,
  y: number,
  direction: 'across' | 'down',
  placed: PlacedWord[],
): boolean {
  for (const pw of placed) {
    if (pw.direction !== direction) continue;
    const upper = pw.word.toUpperCase();
    for (let i = 0; i < upper.length; i++) {
      const px = pw.direction === 'across' ? pw.startX + i : pw.startX;
      const py = pw.direction === 'down' ? pw.startY + i : pw.startY;
      if (x === px && y === py) return true;
    }
  }
  return false;
}

/**
 * Validates a candidate word placement.
 * Rules:
 *  1. All cells must be within the virtual 50x50 grid.
 *  2. Non-matching letter overwrites are rejected.
 *  3. Same-direction adjacency before/after the word is rejected.
 *  4. A cell's neighbour running the SAME direction (parallel)
 *     that is NOT an intersection point is rejected.
 *  5. Perpendicular neighbours are allowed (they are valid crossings).
 */
function isValidWordPlacement(
  word: string,
  startX: number,
  startY: number,
  direction: 'across' | 'down',
  placed: PlacedWord[],
): boolean {
  const upper = word.toUpperCase();
  const letterGrid = buildLetterGrid(placed);

  const cells: { x: number; y: number; letter: string; index: number }[] = [];
  for (let i = 0; i < upper.length; i++) {
    const x = direction === 'across' ? startX + i : startX;
    const y = direction === 'down' ? startY + i : startY;
    if (x < 0 || x >= VIRTUAL_SIZE || y < 0 || y >= VIRTUAL_SIZE) return false;
    cells.push({ x, y, letter: upper[i], index: i });
  }

  // Rule 2: No non-matching letter overwrites
  for (const c of cells) {
    const existing = letterGrid.get(`${c.x},${c.y}`);
    if (existing !== undefined && existing !== c.letter) return false;
  }

  // Rule 3: Same-direction adjacency before start and after end
  const beforeX = direction === 'across' ? startX - 1 : startX;
  const beforeY = direction === 'down' ? startY - 1 : startY;
  if (letterGrid.has(`${beforeX},${beforeY}`) && isSameDirAt(beforeX, beforeY, direction, placed)) return false;

  const afterIdx = upper.length;
  const afterX = direction === 'across' ? startX + afterIdx : startX;
  const afterY = direction === 'down' ? startY + afterIdx : startY;
  if (letterGrid.has(`${afterX},${afterY}`) && isSameDirAt(afterX, afterY, direction, placed)) return false;

  // Rule 4: Parallel (same-direction) adjacency at non-intersection cells
  const cellSet = new Set(cells.map((c) => `${c.x},${c.y}`));
  for (const c of cells) {
    const parallelNeighbours: { x: number; y: number }[] =
      direction === 'across'
        ? [{ x: c.x, y: c.y - 1 }, { x: c.x, y: c.y + 1 }]
        : [{ x: c.x - 1, y: c.y }, { x: c.x + 1, y: c.y }];

    for (const adj of parallelNeighbours) {
      const key = `${adj.x},${adj.y}`;
      if (letterGrid.has(key) && !cellSet.has(key) && isSameDirAt(adj.x, adj.y, direction, placed)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Euclidean distance from the word's centroid to the virtual grid centre.
 * Lower is better.
 */
function proximityScore(
  word: string,
  startX: number,
  startY: number,
  direction: 'across' | 'down',
): number {
  const upper = word.toUpperCase();
  let sumX = 0, sumY = 0;
  for (let i = 0; i < upper.length; i++) {
    sumX += direction === 'across' ? startX + i : startX;
    sumY += direction === 'down' ? startY + i : startY;
  }
  const cx = sumX / upper.length;
  const cy = sumY / upper.length;
  const dx = cx - CENTER;
  const dy = cy - CENTER;
  return Math.sqrt(dx * dx + dy * dy);
}

export function generateGrid(words: WordInput[]): GridResult {
  if (words.length === 0) {
    return { placements: [], gridCells: [], width: 0, height: 0 };
  }

  const sorted = [...words].sort((a, b) => b.word.length - a.word.length);

  const placed: PlacedWord[] = [];
  const placements: WordPlacement[] = [];

  // Place the longest word across at the centre of the virtual grid
  const first = sorted[0];
  const firstLen = first.word.length;
  const firstX = CENTER - Math.floor(firstLen / 2);

  placed.push({ word: first.word, startX: firstX, startY: CENTER, direction: 'across', questionId: first.id, number: first.number });
  placements.push({
    word: first.word,
    startX: firstX,
    startY: CENTER,
    direction: 'across',
    questionId: first.id,
    questionIndex: 0,
    number: first.number,
    cells: first.word.toUpperCase().split('').map((letter, i) => ({
      x: firstX + i,
      y: CENTER,
      letter,
      index: i,
    })),
  });

  // Place remaining words
  for (let wi = 1; wi < sorted.length; wi++) {
    const current = sorted[wi];
    const upper = current.word.toUpperCase();

    type Candidate = { startX: number; startY: number; direction: 'across' | 'down'; score: number };
    let best: Candidate | null = null;

    for (const pw of placed) {
      const pwUpper = pw.word.toUpperCase();

      for (let ci = 0; ci < upper.length; ci++) {
        for (let pj = 0; pj < pwUpper.length; pj++) {
          if (upper[ci] !== pwUpper[pj]) continue;

          const direction: 'across' | 'down' = pw.direction === 'across' ? 'down' : 'across';
          const startX = pw.direction === 'across' ? pw.startX + pj : pw.startX - ci;
          const startY = pw.direction === 'down' ? pw.startY + pj : pw.startY - ci;

          if (!isValidWordPlacement(upper, startX, startY, direction, placed)) continue;

          const score = proximityScore(upper, startX, startY, direction);
          if (!best || score < best.score) {
            best = { startX, startY, direction, score };
          }
        }
      }
    }

    let startX: number;
    let startY: number;
    let direction: 'across' | 'down';

    if (best) {
      startX = best.startX;
      startY = best.startY;
      direction = best.direction;
    } else {
      // Fallback: scan for an empty zone with a 1-cell gap from all placed words
      const occupied = buildLetterGrid(placed);
      let found = false;
      startX = 0;
      startY = 0;
      direction = 'across';
      for (let attemptY = 0; attemptY < VIRTUAL_SIZE && !found; attemptY++) {
        for (let attemptX = 0; attemptX < VIRTUAL_SIZE && !found; attemptX++) {
          const candidateCells: { x: number; y: number }[] = [];
          let valid = true;
          for (let i = 0; i < upper.length; i++) {
            const cx = attemptX + i;
            const cy = attemptY;
            if (cx >= VIRTUAL_SIZE || cy >= VIRTUAL_SIZE) { valid = false; break; }
            candidateCells.push({ x: cx, y: cy });
          }
          if (!valid) continue;

          // Check no overlap with any occupied cell
          for (const c of candidateCells) {
            if (occupied.has(`${c.x},${c.y}`)) { valid = false; break; }
          }
          if (!valid) continue;

          // Check 1-cell gap from all occupied cells
          for (const c of candidateCells) {
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = c.x + dx;
                const ny = c.y + dy;
                if (nx >= 0 && nx < VIRTUAL_SIZE && ny >= 0 && ny < VIRTUAL_SIZE) {
                  if (occupied.has(`${nx},${ny}`)) { valid = false; break; }
                }
              }
              if (!valid) break;
            }
            if (!valid) break;
          }
          if (!valid) continue;

          startX = attemptX;
          startY = attemptY;
          direction = 'across' as const;
          found = true;
        }
      }

      if (!found) {
        startX = 2;
        startY = 2 + wi * 2;
        direction = 'across' as const;
      }
    }

    placed.push({
      word: current.word,
      startX,
      startY,
      direction,
      questionId: current.id,
      number: current.number,
    });

    const cells = upper.split('').map((letter, i) => ({
      x: direction === 'across' ? startX + i : startX,
      y: direction === 'down' ? startY + i : startY,
      letter,
      index: i,
    }));

    placements.push({
      word: current.word,
      startX,
      startY,
      direction,
      questionId: current.id,
      questionIndex: wi,
      number: current.number,
      cells,
    });
  }

  // Normalize coordinates to (0, 0)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of placements) {
    for (const c of p.cells) {
      if (c.x < minX) minX = c.x;
      if (c.x > maxX) maxX = c.x;
      if (c.y < minY) minY = c.y;
      if (c.y > maxY) maxY = c.y;
    }
  }

  const padding = 1;
  const width = maxX - minX + 1 + 2 * padding;
  const height = maxY - minY + 1 + 2 * padding;
  const offsetX = minX - padding;
  const offsetY = minY - padding;

  // Build gridCells — merge at intersections
  const gridCells: GridCell[][] = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      letter: null,
      isActive: false,
      questionId: null,
      wordIndex: null,
      cellIndex: null,
      isStartOfWord: false,
    })),
  );

  for (let pi = 0; pi < placements.length; pi++) {
    const p = placements[pi];
    const newCells = p.cells.map((c) => ({
      x: c.x - offsetX,
      y: c.y - offsetY,
      letter: c.letter,
      index: c.index,
    }));

    placements[pi] = {
      ...p,
      startX: p.startX - offsetX,
      startY: p.startY - offsetY,
      cells: newCells,
    };

    for (const c of newCells) {
      if (c.y >= 0 && c.y < height && c.x >= 0 && c.x < width) {
        const existing = gridCells[c.y][c.x];
        gridCells[c.y][c.x] = {
          x: c.x,
          y: c.y,
          letter: null,
          isActive: true,
          questionId: existing.isActive ? existing.questionId : p.questionId,
          wordIndex: existing.isActive ? existing.wordIndex : pi,
          cellIndex: existing.isActive ? existing.cellIndex : c.index,
          isStartOfWord: existing.isActive ? existing.isStartOfWord : c.index === 0,
        };
      }
    }
  }

  return { placements, gridCells, width, height };
}
