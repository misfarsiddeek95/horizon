'use client';

import { usePuzzle } from '@/context/PuzzleContext';

export default function MobileClueBar() {
  const { state, dispatch } = usePuzzle();
  const { activeIndex, questions, wordPlacements, isPaused, phase } = state;

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const placement = activeQ
    ? wordPlacements.find((p) => p.questionId === activeQ.question.id) ?? null
    : null;

  const pendingIndices = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.status === 'pending')
    .map(({ i }) => i);

  const canNavigate = !isPaused && phase === 'playing' && pendingIndices.length > 0;

  const activeClue = activeQ
    ? {
        category: activeQ.question.category,
        number: activeQ.number,
        direction: placement?.direction === 'across' ? 'Across' : 'Down',
        text: activeQ.question.clue,
      }
    : null;

  function handlePrev() {
    if (!canNavigate) return;
    if (activeIndex === null) {
      if (pendingIndices.length > 0) {
        dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[0] });
      }
      return;
    }
    const currentPos = pendingIndices.indexOf(activeIndex);
    let nextPos = currentPos - 1;
    if (nextPos < 0) nextPos = pendingIndices.length - 1;
    dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[nextPos] });
  }

  function handleNext() {
    if (!canNavigate) return;
    if (activeIndex === null) {
      if (pendingIndices.length > 0) {
        dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[0] });
      }
      return;
    }
    const currentPos = pendingIndices.indexOf(activeIndex);
    let nextPos = currentPos + 1;
    if (nextPos >= pendingIndices.length) nextPos = 0;
    dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[nextPos] });
  }

  return (
    <div className="block lg:hidden w-full bg-brand-main text-white px-2 py-3 z-50 shadow-lg shrink-0">
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        
        {/* Left SVG Arrow */}
        <button onClick={handlePrev} className="p-2 shrink-0 text-white/70 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        {/* Clue Content (Allowed to grow) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          {activeClue ? (
            <>
              <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 mb-1 truncate max-w-full">
                {activeClue.category || 'Category'}
              </span>
              <span className="text-yellow-400 text-xs font-bold mb-1">
                {activeClue.number} · {activeClue.direction}
              </span>
              {/* CRITICAL: whitespace-normal allows full text wrapping */}
              <span className="text-sm font-medium text-white whitespace-normal break-words">
                {activeClue.text}
              </span>
            </>
          ) : (
            <span className="text-white/70 text-sm">Tap a grid square to select a question</span>
          )}
        </div>

        {/* Right SVG Arrow */}
        <button onClick={handleNext} className="p-2 shrink-0 text-white/70 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        
      </div>
    </div>
  );
}
