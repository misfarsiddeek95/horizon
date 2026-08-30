'use client';

import { useState } from 'react';
import type { SessionData } from '@/types';

interface OnboardingProps {
  onStart: (session: SessionData) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Onboarding({ onStart }: OnboardingProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consented, setConsented] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address';
    if (!consented) next.consent = 'You must consent to continue';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const session: SessionData = {
      name: name.trim(),
      email: email.trim(),
      consented,
    };

    localStorage.setItem('horizon-puzzle-session', JSON.stringify(session));
    onStart(session);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        src="/videos/puzzle_background.mp4"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none bg-[#10243e]/70"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 mx-auto w-11/12 max-w-md space-y-6 !bg-white/10 !backdrop-blur-xl !border !border-white/20 !shadow-2xl rounded-2xl p-6 md:p-10"
      >
        <div className="space-y-3 text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight !text-white !drop-shadow-md sm:text-4xl">
            Haycarb FY2025/26{" "}
            <span className="text-yellow-400">Crossword Challenge</span>
          </h1>
          <p className="text-sm !text-slate-100 !drop-shadow-sm">Enter your details to begin</p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm !text-white !font-medium !mb-1 !drop-shadow-sm"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full !bg-white/10 !border !border-white/40 !rounded-lg !px-4 !py-2 !text-white !shadow-inner placeholder:!text-slate-300 focus:!bg-white/20 focus:!border-white focus:!ring-2 focus:!ring-white/50 !transition-all outline-none"
            placeholder="Your name"
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm !text-white !font-medium !mb-1 !drop-shadow-sm"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full !bg-white/10 !border !border-white/40 !rounded-lg !px-4 !py-2 !text-white !shadow-inner placeholder:!text-slate-300 focus:!bg-white/20 focus:!border-white focus:!ring-2 focus:!ring-white/50 !transition-all outline-none"
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
          <label htmlFor="consent" className="text-sm !text-slate-100 !drop-shadow-sm">
            I consent to store my score and email
          </label>
        </div>
        {errors.consent && (
          <p className="text-xs text-red-400">{errors.consent}</p>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer !bg-brand-main !text-white !font-bold !shadow-lg hover:!shadow-xl hover:!brightness-110 !transition-all rounded-lg px-4 py-3 text-base hover:scale-105 active:scale-95"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
