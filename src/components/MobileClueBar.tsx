'use client';

import { usePuzzle } from '@/context/PuzzleContext';

export default function MobileClueBar() {
  const { state, dispatch } = usePuzzle();
  const { activeIndex, questions, wordPlacements, isPaused, phase, answerHistory } = state;

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const placement = activeQ
    ? wordPlacements.find((p) => p.questionId === activeQ.question.id) ?? null
    : null;

  const lastRecord = answerHistory[answerHistory.length - 1];
  const showReveal =
    !activeQ &&
    lastRecord &&
    (lastRecord.status === 'failed' || lastRecord.status === 'timeout');

  const revealQuestion = showReveal
    ? questions.find((q) => q.question.id === lastRecord.questionId)
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
        dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[pendingIndices.length - 1] });
      }
      return;
    }
    const currentPos = pendingIndices.indexOf(activeIndex);
    if (currentPos === -1) {
      dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[pendingIndices.length - 1] });
      return;
    }
    let prevPos = currentPos - 1;
    if (prevPos < 0) prevPos = pendingIndices.length - 1;
    dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[prevPos] });
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
    if (currentPos === -1) {
      dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[0] });
      return;
    }
    let nextPos = currentPos + 1;
    if (nextPos >= pendingIndices.length) nextPos = 0;
    dispatch({ type: 'SELECT_QUESTION', payload: pendingIndices[nextPos] });
  }

  return (
    <div className="block lg:hidden w-full bg-brand-main/80 backdrop-blur-md text-white px-2 py-3 z-50 shadow-lg shrink-0">
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        
        {/* Left SVG Arrow */}
        <button
          onClick={handlePrev}
          disabled={!canNavigate}
          className="p-2 shrink-0 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-default"
        >
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
          ) : showReveal && revealQuestion ? (
            <div className="w-full px-2 py-2 bg-red-500/20 border border-red-400/50 rounded flex flex-col items-center gap-1">
              <span className="text-red-200 text-[10px] font-medium">
                {lastRecord.status === 'timeout' ? "Time's Up!" : 'Incorrect!'}
              </span>
              <span className="text-white text-xs">
                Correct Answer:{' '}
                <span className="font-bold uppercase tracking-wider">
                  {revealQuestion.question.word}
                </span>
              </span>
            </div>
          ) : (
            <span className="text-white/70 text-sm">Tap a grid square to select a question</span>
          )}
        </div>

        {/* Right SVG Arrow */}
        <button
          onClick={handleNext}
          disabled={!canNavigate}
          className="p-2 shrink-0 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-default"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        
      </div>
    </div>
  );
}
