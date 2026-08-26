'use client';

import { useState } from 'react';
import { useDocSearch } from './useDocSearch';
import SearchTurn from './SearchTurn';

const SUGGESTIONS = [
  'Financial statements',
  'Board of directors',
  'Dividend history',
  'Sustainability and ESG'
];

/**
 * Haycarb Annual Report chapter finder.
 *
 * Sizes to its content, so it can sit anywhere on a page.
 * Newest result appears directly under the input.
 *
 * @param endpoint    API route to POST to (proxied, key stays server-side)
 * @param onDownload  async (filePaths: string[]) => void — the host app's
 *                    own PDF merge function
 * @param title       optional heading; pass null to hide
 */
export default function HaycarbDocSearch({
  endpoint = '/api/haycarb-document-search',
  onDownload,
  title = 'Find a chapter'
}) {
  const [input, setInput] = useState('');
  const { turns, stage, error, search } = useDocSearch({ endpoint });

  const busy = stage !== 'idle';

  const submit = (text) => {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    setInput('');
    search(value);
  };

  return (
    <div className="rounded-ui-card border border-black/10 bg-surface-default p-5 text-content-primary">

      {title && (
        <div className="mb-4">
          <h2 className="font-heading text-lg text-brand-main">{title}</h2>
          <p className="mt-0.5 text-[11px] text-content-primary/70">
            Describe what you&apos;re looking for and download the relevant chapters
          </p>
        </div>
      )}

      {/* input */}
      <div className="flex items-center gap-2.5">
        <input
          type="text"
          value={input}
          disabled={busy}
          placeholder="e.g. dividend history, board of directors…"
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          className="flex-1 rounded-ui-element border border-black/10 bg-surface-default px-3.5 py-2.5 text-[13.5px] text-content-primary outline-none transition-colors placeholder:text-content-primary/40 focus:border-brand-main disabled:opacity-60"
        />
        <button
          onClick={() => submit()}
          disabled={busy || !input.trim()}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-ui-element bg-brand-main transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-35"
        >
          <SearchIcon />
        </button>
      </div>

      {/* suggestions, before any search */}
      {turns.length === 0 && !busy && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] text-content-primary/70 transition-colors hover:border-brand-main hover:bg-brand-main/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* results — newest first, since the input is at the top */}
      {(turns.length > 0 || busy) && (
        <div className="mt-5 flex flex-col gap-5">

          {busy && <Searching />}

          {[...turns].reverse().map(t => (
            <SearchTurn key={t.id} turn={t} onDownload={onDownload} />
          ))}

          {error && (
            <div className="rounded-ui-element border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Searching() {
  return (
    <div className="flex gap-2.5 self-start">
      <div className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-ui-element bg-gradient-to-br from-brand-main to-brand-hover text-[11px] font-bold text-white">
        AI
      </div>
      <div className="flex items-center gap-2.5 rounded-ui-element rounded-bl-sm border border-black/10 bg-surface-muted px-4 py-3.5">
        <span className="flex gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="hc-dot h-1.5 w-1.5 rounded-full bg-brand-main"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </span>
        <span className="text-[12.5px] text-content-primary/70">Looking through the report…</span>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white" strokeWidth="2.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
