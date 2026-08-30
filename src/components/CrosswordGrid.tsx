'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { usePuzzle } from '@/context/PuzzleContext';

interface CellRenderData {
  x: number;
  y: number;
  isOccupied: boolean;
  isStartOfWord: boolean;
  questionIds: string[];
}

export default function CrosswordGrid() {
  const { state, dispatch } = usePuzzle();
  const { gridCells, gridWidth, gridHeight, activeIndex, questions, wordPlacements } = state;

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const activePlacement = useMemo(
    () =>
      activeQ && activeQ.status === 'active'
        ? wordPlacements.find((p) => p.questionId === activeQ.question.id) ?? null
        : null,
    [activeQ, wordPlacements],
  );

  const cellMatrix = useMemo(() => {
    const matrix: CellRenderData[][] = [];
    for (let y = 0; y < gridHeight; y++) {
      const row: CellRenderData[] = [];
      for (let x = 0; x < gridWidth; x++) {
        row.push({ x, y, isOccupied: false, isStartOfWord: false, questionIds: [] });
      }
      matrix.push(row);
    }
    for (const pw of wordPlacements) {
      for (const c of pw.cells) {
        const cell = matrix[c.y][c.x];
        cell.isOccupied = true;
        cell.questionIds.push(pw.questionId);
        if (c.index === 0 && !cell.isStartOfWord) {
          cell.isStartOfWord = true;
        }
      }
    }
    return matrix;
  }, [wordPlacements, gridWidth, gridHeight]);

  const getCellStatus = useCallback(
    (questionIds: string[]) => {
      for (const qid of questionIds) {
        const qState = questions.find((q) => q.question.id === qid);
        if (!qState) continue;
        if (qState.status === 'active') return 'active';
        if (qState.status === 'completed') return 'completed';
        if (qState.status === 'failed') return 'failed';
        if (qState.status === 'timeout') return 'timeout';
      }
      return 'pending';
    },
    [questions],
  );

  const getClueNumber = useCallback(
    (x: number, y: number) => {
      const pw = wordPlacements.find((p) => p.startX === x && p.startY === y);
      return pw?.number ?? null;
    },
    [wordPlacements],
  );

  const lockedSet = useMemo(() => {
    const locked = new Set<string>();
    const terminal = new Set(['completed']);
    for (const pw of wordPlacements) {
      const qs = questions.find((q) => q.question.id === pw.questionId);
      if (qs && terminal.has(qs.status)) {
        for (const c of pw.cells) {
          locked.add(`${c.x},${c.y}`);
        }
      }
    }
    return locked;
  }, [wordPlacements, questions]);

  const focusCell = useCallback((x: number, y: number, scroll?: boolean) => {
    const el = document.querySelector<HTMLInputElement>(
      `[data-cell-pos="${x}-${y}"]`,
    );
    if (el) {
      el.focus();
      if (scroll) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, []);

  useEffect(() => {
    if (activePlacement && activeQ?.status === 'active') {
      const first = activePlacement.cells[0];
      focusCell(first.x, first.y, true);
    }
  }, [activePlacement, activeQ?.status, focusCell]);

  const handleInput = useCallback(
    (x: number, y: number, value: string) => {
      const letter = value.slice(0, 1).toUpperCase();
      if (!activePlacement) return;

      const currentCell = activePlacement.cells.find((c) => c.x === x && c.y === y);
      if (!currentCell) return;

      const existingLetter = gridCells[y]?.[x]?.letter ?? null;

      // Cell belongs to a completed/failed/timeout word — lock it
      if (lockedSet.has(`${x},${y}`)) {
        if (letter && letter === existingLetter) {
          const nextIdx = currentCell.index + 1;
          if (nextIdx < activePlacement.word.length) {
            focusCell(activePlacement.cells[nextIdx].x, activePlacement.cells[nextIdx].y);
          }
        }
        return;
      }

      // Same letter already in cell — just advance
      if (letter && letter === existingLetter) {
        const nextIdx = currentCell.index + 1;
        if (nextIdx < activePlacement.word.length) {
          focusCell(activePlacement.cells[nextIdx].x, activePlacement.cells[nextIdx].y);
        }
        return;
      }

      if (letter !== existingLetter) {
        dispatch({
          type: 'UPDATE_CELL',
          payload: { x, y, letter },
        });
      }

      if (letter) {
        const nextIdx = currentCell.index + 1;
        if (nextIdx < activePlacement.word.length) {
          focusCell(activePlacement.cells[nextIdx].x, activePlacement.cells[nextIdx].y);
        }
      }
    },
    [dispatch, activePlacement, focusCell, gridCells, lockedSet],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, x: number, y: number) => {
      if (!activePlacement) return;

      const currentCell = activePlacement.cells.find((c) => c.x === x && c.y === y);
      if (!currentCell) return;

      if (e.key === 'Backspace') {
        if (lockedSet.has(`${x},${y}`)) return;
        e.preventDefault();
        e.preventDefault();
        const existingLetter = gridCells[y]?.[x]?.letter;
        if (existingLetter) {
          dispatch({
            type: 'UPDATE_CELL',
            payload: { x, y, letter: '' },
          });
        } else {
          const prevIdx = currentCell.index - 1;
          if (prevIdx >= 0) {
            const prevCell = activePlacement.cells[prevIdx];
            dispatch({
              type: 'UPDATE_CELL',
              payload: { x: prevCell.x, y: prevCell.y, letter: '' },
            });
            focusCell(prevCell.x, prevCell.y);
          }
        }
        return;
      }

      let nextIdx: number | null = null;
      if (activePlacement.direction === 'across') {
        if (e.key === 'ArrowRight') nextIdx = currentCell.index + 1;
        if (e.key === 'ArrowLeft') nextIdx = currentCell.index - 1;
      } else {
        if (e.key === 'ArrowDown') nextIdx = currentCell.index + 1;
        if (e.key === 'ArrowUp') nextIdx = currentCell.index - 1;
      }

      if (
        nextIdx !== null &&
        nextIdx >= 0 &&
        nextIdx < activePlacement.word.length
      ) {
        e.preventDefault();
        const nextCell = activePlacement.cells[nextIdx];
        focusCell(nextCell.x, nextCell.y);
      }
    },
    [activePlacement, focusCell, gridCells, dispatch, lockedSet],
  );

  if (gridHeight === 0 || gridWidth === 0) {
    return (
      <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-2xl glass-puzzle">
        <p className="text-sm text-gray-400">Loading puzzle...</p>
      </div>
    );
  }

  const hasPaused = state.isPaused && state.phase === 'playing';

  return (
    <div className="glass-puzzle rounded-2xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[500px] w-full max-w-full relative">
      {hasPaused && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-sm rounded-xl">
          <div className="rounded-ui-card bg-surface-glass backdrop-blur-lg border border-white/20 px-8 py-6 text-center shadow-2xl">
            <p className="text-xl font-bold text-content-primary">Game Paused</p>
            <p className="mt-1 text-sm text-content-primary/50">
              Timer and input are frozen
            </p>
            <button
              onClick={() => dispatch({ type: 'RESUME_GAME' })}
              className="mt-4 cursor-pointer rounded-ui-element bg-brand-main px-6 py-2 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
            >
              Resume
            </button>
          </div>
        </div>
      )}
      <div className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-4 px-2 sm:px-4 snap-x touch-pan-x">
        <div className="flex items-start bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-6">
          <div
            className="grid w-max min-w-full [--cell-size:24px] lg:[--cell-size:45px]"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, var(--cell-size))`,
            gridTemplateRows: `repeat(${gridHeight}, var(--cell-size))`,
          }}
        >
          {cellMatrix.map((row, y) =>
            row.map((cellData, x) => {
              const isInactive = !cellData.isOccupied;

              if (isInactive) {
                return (
                  <div
                    key={`${x}-${y}`}
                    className="relative w-[24px] h-[24px] lg:w-[45px] lg:h-[45px] flex-none shrink-0 bg-transparent pointer-events-none"
                    style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
                  />
                );
              }

              const cellLetter = gridCells[y]?.[x]?.letter ?? null;
              const status = getCellStatus(cellData.questionIds);
              const number = getClueNumber(x, y);
              const isCellActive = activePlacement && cellData.questionIds.includes(activePlacement.questionId);
              const isInputEnabled = isCellActive && activeQ?.status === 'active' && !state.isPaused;
              const showLetter = cellLetter && (status !== 'pending');

              let overlayBg = 'bg-white/60 backdrop-blur-md';
              if (status === 'completed') overlayBg = 'bg-green-50';
              else if (status === 'failed') overlayBg = 'bg-red-50';
              else if (status === 'timeout') overlayBg = 'bg-gray-100';
              else if (isCellActive) overlayBg = 'bg-blue-50';

              const overlayClasses = `absolute top-0 left-0 w-[calc(100%+1px)] h-[calc(100%+1px)] border border-gray-400 ${overlayBg}${isCellActive ? ' ring-2 ring-inset ring-blue-500 z-10' : ' z-0'}`;

              return (
                <div
                  key={`${x}-${y}`}
                  className="relative w-[24px] h-[24px] lg:w-[45px] lg:h-[45px] flex-none shrink-0"
                  style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
                >
                  <div className={overlayClasses} />

                  {number && (
                    <span className="absolute top-1 left-1 text-[5px] lg:text-[10px] font-semibold font-sans text-gray-500 pointer-events-none z-20">
                      {number}
                    </span>
                  )}

                  {isInputEnabled ? (
                    <input
                      data-cell-pos={`${x}-${y}`}
                      type="text"
                      maxLength={1}
                      autoCapitalize="characters"
                      autoComplete="off"
                      spellCheck={false}
                      value={cellLetter ?? ''}
                      onChange={(e) => handleInput(x, y, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, x, y)}
                      className="absolute inset-0 w-full h-full text-center text-base lg:text-2xl font-bold font-sans uppercase outline-none bg-transparent text-slate-900 z-30"
                      aria-label={`Cell ${x},${y}${number ? ' Clue ' + number : ''}`}
                    />
                  ) : (
                    showLetter && (
                      <span className={`absolute inset-0 flex items-center justify-center text-base lg:text-2xl font-bold text-slate-900 z-30${status === 'completed' ? ' text-green-700' : status === 'failed' ? ' text-red-600' : status === 'timeout' ? ' text-gray-400' : ''}`}>
                        {cellLetter}
                      </span>
                    )
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
