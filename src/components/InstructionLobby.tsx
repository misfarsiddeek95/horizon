"use client";

import type { ReactNode } from "react";
import {
  Squares2X2Icon,
  SparklesIcon,
  TrophyIcon,
  ChartBarIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import { usePuzzle } from "@/context/PuzzleContext";
import MuteToggle from "@/components/MuteToggle";
import ExitButton from "@/components/ExitButton";

interface LobbyCardProps {
  icon: ReactNode;
  title: string;
  highlight?: boolean;
  wide?: boolean;
  children: ReactNode;
}

function LobbyCard({
  icon,
  title,
  highlight = false,
  wide = false,
  children,
}: LobbyCardProps) {
  return (
    <section
      className={`rounded-ui-card border bg-surface-glass p-5 shadow-2xl backdrop-blur-lg sm:p-6 ${
        highlight ? "border-accent-main/40" : "border-white/20"
      } ${wide ? "md:col-span-2" : ""}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ui-element bg-white/10 text-accent-main">
          {icon}
        </div>
        <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function InstructionLobby() {
  const { state, startGame } = usePuzzle();
  const playerName = state.session?.name ?? "Player";

  return (
    <div className="min-h-screen bg-brand-main">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 sm:py-12">
        <div className="mb-4 flex justify-end">
          <ExitButton variant="dark" />
        </div>
        <header className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Ready, {playerName}?
          </h1>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            Everything you need to know before diving into the puzzle.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LobbyCard icon={<Squares2X2Icon className="h-5 w-5" />} title="Board & Cards">
            <p>
              There are <strong className="text-white">5 categories</strong> with{" "}
              <strong className="text-white">3 questions each</strong> — 15 questions
              total. Click a question card to select it and answer in any order.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<SparklesIcon className="h-5 w-5" />}
            title="AI Assist Penalty"
            highlight
          >
            <p>
              Stuck? The <strong className="text-white">&quot;Need Help?&quot;</strong> button
              provides AI assistance, but it costs{" "}
              <strong className="text-accent-main">50% of that word&apos;s points</strong>.
            </p>
          </LobbyCard>

          <LobbyCard icon={<TrophyIcon className="h-5 w-5" />} title="Badges">
            <p>
              Answer all <strong className="text-white">3 questions in a category</strong>{" "}
              to earn a <strong className="text-white">Certification Badge</strong>. Play
              perfectly or quickly to unlock special{" "}
              <strong className="text-white">hidden achievements</strong>.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<ChartBarIcon className="h-5 w-5" />}
            title="Leaderboard & Scoring"
          >
            <p>
              Correct answers earn points — including a{" "}
              <strong className="text-white">speed bonus</strong>. The leaderboard tracks
              the <strong className="text-white">top global scores</strong>.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<Cog8ToothIcon className="h-5 w-5" />}
            title="Game Controls"
            wide
          >
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="text-white">Refresh:</strong> safe — your progress is
                automatically saved.
              </li>
              <li>
                <strong className="text-white">Restart:</strong> wipes all progress and
                starts a fresh session.
              </li>
              <li>
                <strong className="text-white">Speaker icon:</strong> mutes or unmutes
                the game&apos;s sound effects.
              </li>
            </ul>
          </LobbyCard>
        </div>

        <footer className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 rounded-ui-element border border-white/20 bg-surface-glass px-4 py-2 backdrop-blur-lg">
            <span className="text-sm font-medium text-white/70">
              Sound effects
            </span>
            <MuteToggle variant="dark" />
          </div>
          <button
            onClick={startGame}
            className="cursor-pointer rounded-ui-element bg-accent-main px-14 py-5 font-heading text-2xl font-bold text-content-inverse shadow-[0_0_50px_rgba(245,197,66,0.55)] transition-all hover:brightness-110 active:scale-95"
          >
            Start Game
          </button>
        </footer>
      </div>
    </div>
  );
}
