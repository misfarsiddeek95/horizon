"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { usePuzzle } from "@/context/PuzzleContext";

export default function MuteToggle() {
  const { state, dispatch } = usePuzzle();
  const muted = state.isMuted;

  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      className="inline-flex cursor-pointer items-center justify-center rounded-ui-element border border-zinc-300 px-3 py-2 text-sm font-semibold text-content-primary transition-colors hover:bg-zinc-100"
    >
      {muted ? (
        <SpeakerXMarkIcon className="h-4 w-4" />
      ) : (
        <SpeakerWaveIcon className="h-4 w-4" />
      )}
    </button>
  );
}
