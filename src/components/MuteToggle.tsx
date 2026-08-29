"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { usePuzzle } from "@/context/PuzzleContext";

interface MuteToggleProps {
  variant?: "light" | "dark";
}

export default function MuteToggle({ variant = "light" }: MuteToggleProps) {
  const { state, dispatch } = usePuzzle();
  const muted = state.isMuted;

  const styleClass =
    variant === "dark"
      ? "border border-blue-400/80 text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 backdrop-blur-md transition-colors"
      : "border-zinc-300 text-content-primary hover:bg-zinc-100";

  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      className={`inline-flex cursor-pointer items-center justify-center rounded-ui-element border px-3 py-2 text-sm font-semibold transition-colors ${styleClass}`}
    >
      {muted ? (
        <SpeakerXMarkIcon className="h-4 w-4" />
      ) : (
        <SpeakerWaveIcon className="h-4 w-4" />
      )}
    </button>
  );
}
