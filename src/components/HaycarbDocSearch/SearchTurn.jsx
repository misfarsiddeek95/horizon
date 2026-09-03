'use client';

import { UserIcon, SparklesIcon } from '@heroicons/react/24/solid';
import ChapterList from './ChapterList';

/**
 * One search exchange — the user's query, then the assistant's
 * reply with any matched chapters.
 */
export default function SearchTurn({ turn, onDownload }) {
  return (
    <div className="flex flex-col gap-3">

      {/* user query */}
      <div className="flex flex-row-reverse gap-2.5 self-end">
        <Avatar isUser />
        <div className="max-w-[calc(100%-40px)] rounded-ui-element rounded-br-sm border border-transparent bg-brand-main px-4 py-2.5 text-[13.5px] text-content-inverse">
          {turn.query}
        </div>
      </div>

      {/* assistant reply — only once it has arrived */}
      {turn.message && (
        <div className="flex gap-2.5 self-start">
          <Avatar />
          <div className="w-full max-w-[calc(100%-40px)]">
            <div className="rounded-ui-element rounded-bl-sm border border-black/10 bg-surface-muted px-4 py-3 text-[13.5px] leading-relaxed text-content-primary">
              {turn.message}
            </div>

            <ChapterList matches={turn.matches} onDownload={onDownload} />
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({ isUser }) {
  if (isUser) {
    return (
      <div className="mt-0.5 relative h-[32px] w-[32px] shrink-0">
        <div
          className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.3)]"
          style={{ background: 'linear-gradient(135deg, var(--color-tm-teal-blue), #147385, var(--color-tm-teal-blue))' }}
        />
        <div
          className="absolute inset-[2px] rounded-full flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
          style={{ background: 'linear-gradient(135deg, var(--color-brand-main), var(--color-teal-2), var(--color-brand-main))' }}
        >
          <UserIcon className="h-3.5 w-3.5 text-white/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-0.5 relative h-[32px] w-[32px] shrink-0">
      <div
        className="absolute inset-[-3px] rounded-full blur-[4px] opacity-50 animate-[aiGlow_3s_ease-in-out_infinite]"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-main), var(--color-tm-cyan-teal), var(--color-chart-teal))' }}
      />
      <div
        className="absolute inset-[-2px] rounded-full shadow-[0_0_10px_var(--color-brand-main),0_0_18px_var(--color-tm-cyan-teal)]"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-main), var(--color-tm-cyan-teal), var(--color-chart-teal))' }}
      />
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-hover), var(--color-brand-main))' }}
      >
        <SparklesIcon className="h-4 w-4 text-white drop-shadow-[0_0_4px_var(--color-tm-cyan-teal)]" />
      </div>
    </div>
  );
}
