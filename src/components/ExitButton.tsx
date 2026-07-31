"use client";

import { useState } from "react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { usePuzzle } from "@/context/PuzzleContext";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ExitButtonProps {
  variant?: "light" | "dark";
}

export default function ExitButton({ variant = "light" }: ExitButtonProps) {
  const { logout } = usePuzzle();
  const [showDialog, setShowDialog] = useState(false);

  const styleClass =
    variant === "dark"
      ? "border-white/20 text-white/80 hover:bg-white/10"
      : "border-zinc-300 text-gray-500 hover:bg-zinc-100";

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-ui-element border px-3 py-2 text-sm font-semibold transition-colors ${styleClass}`}
      >
        <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
        Exit
      </button>
      <ConfirmDialog
        open={showDialog}
        title="Exit Game?"
        message="Are you sure you want to exit? Your session, badges, and current game progress will be permanently deleted."
        confirmLabel="Exit"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowDialog(false);
          logout();
        }}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
}
