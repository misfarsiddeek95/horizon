'use client';

import { useState } from 'react';
import type { SessionData } from '@/types';
import MuteToggle from '@/components/MuteToggle';

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-main px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-11/12 max-w-md space-y-6 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-10"
      >
        <div className="space-y-3 text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
            Haycarb FY2025/26{" "}
            <span className="text-yellow-400">Crossword Challenge</span>
          </h1>
          <p className="text-sm text-white/70">Enter your details to begin</p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white/80"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-ui-element border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            placeholder="Your name"
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/80"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-ui-element border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
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
          <label htmlFor="consent" className="text-sm text-white/70">
            I consent to store my score and email
          </label>
        </div>
        {errors.consent && (
          <p className="text-xs text-red-400">{errors.consent}</p>
        )}

        <div className="flex items-center justify-between rounded-ui-element border border-white/20 bg-white/5 px-3 py-2">
          <span className="text-sm font-medium text-white/80">
            Sound effects
          </span>
          <MuteToggle variant="dark" />
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-ui-element bg-accent-main px-4 py-3 text-base font-semibold text-content-inverse transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] active:scale-95"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
