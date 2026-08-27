'use client';

import { useState } from 'react';
import { DISCLAIMER, detectLang } from './constants';

/**
 * Icon-only action row under assistant messages.
 * Labels are tooltips rather than visible text.
 * The AI disclaimer sits on the same row, pushed right, and wraps
 * below the buttons when there isn't space.
 */
export default function MessageActions({ message, onExport, exporting }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard needs https or localhost — fail quietly elsewhere
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/10 pt-2.5">
      <div className="flex items-center gap-1">
        <ActionButton onClick={copy} label={copied ? 'Copied' : 'Copy answer'}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </ActionButton>

        <ActionButton
          onClick={onExport}
          disabled={exporting}
          label={exporting ? 'Preparing PDF…' : 'Download as PDF'}
        >
          {exporting ? <Spinner /> : <PdfIcon />}
        </ActionButton>
      </div>

      <p className="ml-auto max-w-[380px] text-right text-[10px] font-medium leading-snug text-white">
        {DISCLAIMER[detectLang(message.content)]}
      </p>
    </div>
  );
}

function ActionButton({ onClick, disabled, label, children }) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex h-8 w-8 items-center justify-center rounded-ui-element text-white/70 transition-colors hover:bg-white/10 hover:text-teal-2 disabled:opacity-60"
      >
        {children}
      </button>

      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-ui-element bg-white/95 px-2 py-1 text-[10px] text-[#071f2b] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current" strokeWidth="2">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-brand-main" strokeWidth="2.5">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current" strokeWidth="2">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M12 12v5m0 0l-2-2m2 2l2-2" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] animate-spin fill-none stroke-brand-main" strokeWidth="2.5">
      <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
    </svg>
  );
}
