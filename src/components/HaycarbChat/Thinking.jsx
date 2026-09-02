'use client';

import { useEffect, useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
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
      <div className="mt-0.5 relative h-[32px] w-[32px] shrink-0 animate-pulse">
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

      <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-md border border-white/20 bg-[#020b10]/75 px-4 py-3.5 shadow-sm backdrop-blur-md">
        <Dots />
        <span className="hc-fade text-[12.5px] font-medium text-white" key={index}>
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
          className="hc-dot h-1.5 w-1.5 rounded-full bg-teal-2"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}
