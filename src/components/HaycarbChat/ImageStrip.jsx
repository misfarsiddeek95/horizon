'use client';

import { useState } from 'react';

/**
 * Person photos returned with an answer.
 * URLs are time-limited SAS links from Blob Storage — they expire,
 * so a broken image hides itself rather than showing a placeholder.
 */
export default function ImageStrip({ images }) {
  const [active, setActive] = useState(null);

  if (!images?.length) return null;

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-3">
        {images.map((img, i) => (
          <PersonCard key={i} img={img} onOpen={() => setActive(img)} />
        ))}
      </div>

      {active && (
        <Lightbox img={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}

function PersonCard({ img, onOpen }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <button
      onClick={onOpen}
      className="flex w-[90px] flex-col items-center gap-1.5 text-left"
    >
      <img
        src={img.url}
        alt={img.label ?? ''}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-[90px] w-[80px] rounded-ui-element border-2 border-black/10 object-cover transition-colors hover:border-brand-main"
      />
      {img.label && (
        <span className="text-center text-[10px] leading-tight text-content-primary/70">
          {img.label}
        </span>
      )}
    </button>
  );
}

/**
 * Fixed-position overlay, so it escapes the chat container.
 * If a positioned ancestor traps it, wrap this in a portal.
 */
function Lightbox({ img, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-3 bg-black/85 p-6"
    >
      <img
        src={img.url}
        alt={img.label ?? ''}
        className="max-h-[80vh] max-w-[90vw] rounded-ui-card object-contain"
      />
      {img.label && (
        <span className="text-sm text-white/80">{img.label}</span>
      )}
    </div>
  );
}
