"use client";

import { useMemo } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { usePuzzle } from "@/context/PuzzleContext";

interface ActiveCluePanelProps {
  onHelp: () => void;
}

export default function ActiveCluePanel({ onHelp }: ActiveCluePanelProps) {
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
  const showHelp = timerRemaining <= 30 && timerRemaining > 0 && !state.isPaused;
  const urgent = timerRemaining <= 10 && timerRemaining > 0;

  function handleSubmit() {
    dispatch({ type: "SUBMIT_ANSWER" });
  }

  function handleBypass() {
    dispatch({ type: "BYPASS_QUESTION" });
  }

  if (!activeQ) {
    const lastRecord = state.answerHistory[state.answerHistory.length - 1];
    const showReveal =
      lastRecord && (lastRecord.status === "failed" || lastRecord.status === "timeout");

    return (
      <div className="rounded-2xl p-4 sm:p-6 mb-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
        {showReveal ? (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">
                {lastRecord.status === "timeout" ? "Time's Up!" : "Incorrect!"}
              </p>
              <p>
                The correct answer is:{" "}
                <span className="font-bold uppercase tracking-wider">
                  {lastRecord.questionId &&
                    questions.find((q) => q.question.id === lastRecord.questionId)
                      ?.question.word}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xl sm:text-2xl font-medium !text-white !font-bold !drop-shadow-md text-center">
            Select a question to begin
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 sm:p-6 mb-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          #{activeQ.number} &middot; {activeQ.question.category}
        </span>

        <div
          className={`flex items-center gap-1.5 font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold tabular-nums ${
            urgent
              ? "text-red-500 animate-pulse"
              : showHelp
              ? "text-amber-500"
              : "text-white"
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

      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            urgent ? "bg-red-500" : showHelp ? "bg-amber-400" : "bg-cyan-400"
          }`}
          style={{ width: `${Math.max(0, timerRatio * 100)}%` }}
        />
      </div>

      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-white/60">
        {placement?.direction === "across" ? "Across" : "Down"}
      </p>

      <p className="mb-4 text-xl sm:text-2xl md:text-3xl font-bold !text-white !font-bold leading-snug">
        {activeQ.question.clue}
      </p>

      {showHelp && (
        <button
          onClick={onHelp}
          className="mb-3 w-full cursor-pointer rounded-ui-element bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-200"
        >
          Need Help?
        </button>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleBypass}
          disabled={state.isPaused}
          className="flex-1 cursor-pointer rounded-ui-element border border-white/30 px-4 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Skip for Now
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allFilled || state.isPaused}
          className="flex-[2] cursor-pointer rounded-ui-element bg-brand-main px-4 py-2.5 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
