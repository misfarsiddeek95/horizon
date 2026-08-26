'use client';

import { useEffect, useState } from 'react';
import { THINKING_MESSAGES } from './constants';

/**
 * Typing bubble shown while awaiting a response.
 * Cycles through messages once past the initial 'sending' beat.
 * Unmounts when idle, so the message index resets on its own.
 */
export default function Thinking({ stage }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (stage !== 'thinking') return;
    const t = setInterval(
      () => setIndex(i => (i + 1) % THINKING_MESSAGES.length),
      2600
    );
    return () => clearInterval(t);
  }, [stage]);

  if (stage === 'idle') return null;

  return (
    <div className="flex w-full max-w-[820px] gap-2.5 self-start">
      <div className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-ui-element bg-gradient-to-br from-brand-main to-brand-hover text-[11px] font-bold text-white">
        AI
      </div>

      <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-md border border-white/30 bg-white/50 px-4 py-3.5 shadow-sm backdrop-blur-md">
        <Dots />
        <span className="hc-fade text-[12.5px] text-content-primary/70" key={index}>
          {stage === 'sending' ? 'Sending…' : THINKING_MESSAGES[index]}
        </span>
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="hc-dot h-1.5 w-1.5 rounded-full bg-brand-main"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}
