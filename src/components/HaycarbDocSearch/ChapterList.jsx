'use client';

import { useState, useMemo } from 'react';

/**
 * Matched chapters as a pre-checked list, grouped by category.
 * Download hands the selected file paths to the host app's own
 * merge function, passed in via onDownload.
 */
export default function ChapterList({ matches, onDownload }) {
  // everything selected by default — user unticks what they don't want
  const [selected, setSelected] = useState(() => new Set(matches.map(m => m.file)));
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map();
    matches.forEach(m => {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category).push(m);
    });
    return [...map.entries()];
  }, [matches]);

  const toggle = (file) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(file)) {
        next.delete(file);
      } else {
        next.add(file);
      }
      return next;
    });
  };

  const download = async () => {
    if (selected.size === 0 || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      // preserve the order the API returned rather than Set order
      const paths = matches.filter(m => selected.has(m.file)).map(m => m.file);
      await onDownload?.(paths);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  if (!matches?.length) return null;

  return (
    <div className="mt-3 rounded-ui-element border border-black/10 bg-surface-muted p-4">
      {grouped.map(([category, items]) => (
        <div key={category} className="mb-4 last:mb-0">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-content-primary/50">
            {category}
          </div>

          <div className="space-y-1">
            {items.map(m => (
              <label
                key={m.file}
                className="flex cursor-pointer items-start gap-2.5 rounded-ui-element px-2 py-1.5 transition-colors hover:bg-brand-main/10"
              >
                <input
                  type="checkbox"
                  checked={selected.has(m.file)}
                  onChange={() => toggle(m.file)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-brand-main"
                />
                <span className="text-[13px] leading-snug text-content-primary">
                  {m.section}
                  <span className="ml-2 text-[11px] text-content-primary/50">p.{m.page}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/10 pt-3">
        <span className="text-[11px] text-content-primary/50">
          {selected.size === 0
            ? 'Nothing selected'
            : `${selected.size} chapter${selected.size !== 1 ? 's' : ''} selected`}
        </span>

        <button
          onClick={download}
          disabled={selected.size === 0 || busy}
          className="flex items-center gap-2 rounded-ui-element bg-brand-main px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? <Spinner /> : <DownloadIcon />}
          {busy ? 'Preparing…' : 'Download PDF'}
        </button>
      </div>

      {failed && (
        <p className="mt-2 text-right text-[11px] text-red-600">
          Couldn&apos;t prepare the download. Please try again.
        </p>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 animate-spin fill-none stroke-current" strokeWidth="2.5">
      <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
    </svg>
  );
}
