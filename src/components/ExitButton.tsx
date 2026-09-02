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
      : "!bg-red-600 !text-white hover:!bg-red-700 !border-none !shadow-lg";

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-ui-element border px-3 py-2 text-sm font-semibold transition-colors max-md:!w-8 max-md:!h-8 max-md:!min-w-[32px] max-md:!p-1.5 max-md:!rounded-md ${styleClass}`}
      >
        <ArrowRightStartOnRectangleIcon className="h-4 w-4 max-md:!w-4 max-md:!h-4" />
        <span className="max-md:hidden">Logout</span>
      </button>
      <ConfirmDialog
        open={showDialog}
        title="Logout?"
        message="Are you sure you want to log out? Please note that only completed game scores and badges will be saved."
        confirmLabel="Logout"
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
