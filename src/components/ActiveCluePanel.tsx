"use client";

import { useMemo } from "react";
import { usePuzzle } from "@/context/PuzzleContext";

export default function ActiveCluePanel() {
  const { state, dispatch } = usePuzzle();
  const { activeIndex, questions, timerRemaining, wordPlacements, gridCells } =
    state;

  const activeQ = activeIndex !== null ? questions[activeIndex] : null;
  const placement = useMemo(() => {
    if (!activeQ) return null;
    return (
      wordPlacements.find((p) => p.questionId === activeQ.question.id) ?? null
    );
  }, [activeQ, wordPlacements]);

  const allFilled = useMemo(() => {
    if (!activeQ || !placement) return false;
    return placement.cells.every((c) => {
      const cell = gridCells[c.y]?.[c.x];
      return cell && cell.letter !== null;
    });
  }, [activeQ, placement, gridCells]);

  const timerRatio = activeQ ? timerRemaining / activeQ.question.timeLimit : 1;
  const showHelp = timerRemaining <= 20 && timerRemaining > 0 && !state.isPaused;
  const urgent = timerRemaining <= 10 && timerRemaining > 0;

  function handleSubmit() {
    dispatch({ type: "SUBMIT_ANSWER" });
  }

  function openHelp() {
    dispatch({ type: "MARK_AI_USED" });
    window.open("/chat-help", "_blank", "noopener,noreferrer");
  }

  if (!activeQ) {
    return (
      <div className="rounded-ui-card bg-surface-default p-4 sm:p-6 text-center shadow-sm mb-4">
        <p className="text-xl sm:text-2xl font-medium text-gray-500">
          Select a question to begin
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-ui-card bg-surface-default p-4 sm:p-6 shadow-sm mb-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600">
          #{activeQ.number} &middot; {activeQ.question.category}
        </span>

        <div
          className={`flex items-center gap-1.5 font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold tabular-nums ${
            urgent
              ? "text-red-500 animate-pulse"
              : showHelp
              ? "text-amber-500"
              : "text-content-primary"
          }`}
        >
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{Math.ceil(timerRemaining)}s</span>
          {state.isPaused && (
            <span className="ml-1 text-sm font-medium text-amber-500">(Paused)</span>
          )}
        </div>
      </div>

      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            urgent ? "bg-red-500" : showHelp ? "bg-amber-400" : "bg-brand-main"
          }`}
          style={{ width: `${Math.max(0, timerRatio * 100)}%` }}
        />
      </div>

      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-content-primary/40">
        {placement?.direction === "across" ? "Across" : "Down"}
      </p>

      <p className="mb-4 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
        {activeQ.question.clue}
      </p>

      {showHelp && (
        <button
          onClick={openHelp}
          className="mb-3 w-full cursor-pointer rounded-ui-element bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-200"
        >
          Need Help?
        </button>
      )}

      <button
        onClick={handleSubmit}
        disabled={!allFilled || state.isPaused}
        className="w-full cursor-pointer rounded-ui-element bg-brand-main px-4 py-2.5 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit Answer
      </button>
    </div>
  );
}
