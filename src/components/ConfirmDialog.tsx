'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50 p-4">
      <div className="m-auto w-full max-w-sm space-y-5 rounded-ui-card bg-surface-default p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="font-heading text-lg font-bold text-content-primary">
            {title}
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-content-primary/70">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-ui-element border border-zinc-300 px-3 py-2 text-sm font-semibold text-content-primary transition-colors hover:bg-zinc-100"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-ui-element bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
