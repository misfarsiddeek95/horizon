'use client';

import { useEffect, useRef, useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
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
 * Newest result appears at the bottom of the list.
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
  const bottomRef = useRef(null);

  const busy = stage !== 'idle';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const submit = (text) => {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    setInput('');
    search(value);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm z-0 p-6 card-ai-wrapper">

      <style>{`
        @property --ai-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes ai-border-spin {
          to {
            --ai-angle: 360deg;
          }
        }

        .card-ai-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 3px;
          background: conic-gradient(from var(--ai-angle), #459c98, #f5d482, #e37b58, #042b31, #459c98);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          animation: ai-border-spin 4s linear infinite;
        }
      `}</style>

      {/* The Card Content */}
      <div className="relative z-20">

        {title && (
          <div className="mb-4">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-brand-main">{title}</h2>
            <p className="mt-0.5 text-[11px] text-[#042b31]/80 font-medium">
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
            className="flex-1 rounded-ui-element border border-[#042b31]/20 bg-white/90 px-3.5 py-2.5 text-[13.5px] text-[#042b31] outline-none shadow-sm transition-all placeholder:text-[#042b31]/50 focus:border-brand-main focus:ring-2 focus:ring-brand-main disabled:opacity-60"
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
                className="cursor-pointer rounded-full border border-[#042b31]/20 bg-white/80 px-3 py-1.5 text-[11px] text-[#042b31] font-medium transition-all duration-200 hover:bg-white hover:shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* results — oldest first */}
        {(turns.length > 0 || busy) && (
          <div className="mt-5 flex flex-col gap-5">

            {busy && <Searching />}

            {turns.map(t => (
              <SearchTurn key={t.id} turn={t} onDownload={onDownload} />
            ))}

            {error && (
              <div className="rounded-ui-element border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

      </div>
    </div>
  );
}

function Searching() {
  return (
    <div className="flex gap-2.5 self-start">
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
