'use client';

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
  return (
    <div
      className={`mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-ui-element text-[11px] font-bold tracking-wide ${
        isUser
          ? 'bg-content-primary text-content-inverse'
          : 'bg-gradient-to-br from-brand-main to-brand-hover text-white'
      }`}
    >
      {isUser ? 'YOU' : 'AI'}
    </div>
  );
}
