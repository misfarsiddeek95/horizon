'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

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
        className="h-[90px] w-[80px] rounded-ui-element border-2 border-white/20 object-cover transition-colors hover:border-teal-2"
      />
      {img.label && (
        <span className="text-center text-[10px] leading-tight text-white/70">
          {img.label}
        </span>
      )}
    </button>
  );
}

function Lightbox({ img, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 overscroll-none"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative flex flex-col items-center bg-[#0a192f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-full md:max-w-4xl max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 bg-black/40 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md z-10 flex items-center justify-center cursor-pointer"
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <img
          src={img.url}
          alt={img.label ?? ''}
          className="w-auto max-w-full h-auto max-h-[70vh] object-contain"
        />
        {img.label && (
          <div className="w-full p-4 md:p-5 text-center text-white/90 text-sm md:text-base font-medium bg-white/5">
            {img.label}
          </div>
        )}
      </div>
    </div>
  );
}
