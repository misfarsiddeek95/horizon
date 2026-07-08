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
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-ui-card bg-surface-default p-8 shadow-sm"
      >
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-bold text-content-primary">
            Crossword Puzzle
          </h1>
          <p className="text-sm text-content-primary/60">
            Enter your details to begin
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-content-primary"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-ui-element border border-zinc-300 bg-white px-3 py-2 text-sm text-content-primary outline-none focus:border-brand-main focus:ring-2 focus:ring-brand-main/20"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-content-primary"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-ui-element border border-zinc-300 bg-white px-3 py-2 text-sm text-content-primary outline-none focus:border-brand-main focus:ring-2 focus:ring-brand-main/20"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand-main focus:ring-brand-main/20"
          />
          <label htmlFor="consent" className="text-sm text-content-primary/70">
            I consent to store my score and email
          </label>
        </div>
        {errors.consent && (
          <p className="text-xs text-red-500">{errors.consent}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-ui-element bg-brand-main px-4 py-2.5 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
