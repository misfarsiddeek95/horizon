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
      ? "border-white/20 text-white hover:bg-white/10"
      : "!bg-blue-600 !text-white hover:!bg-blue-700 !border-none !shadow-lg";

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
