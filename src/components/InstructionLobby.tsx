"use client";

import type { ReactNode } from "react";
import {
  Squares2X2Icon,
  SparklesIcon,
  TrophyIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { usePuzzle } from "@/context/PuzzleContext";
import { CONFIG, getAllCategories } from "@/data/config";
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ui-element bg-white/10 text-yellow-400">
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

  return (
    <div className="min-h-screen bg-brand-main">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 sm:py-12">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-white/60 hidden sm:block">
            How well do you know Haycarb's Annual Report 2025/26?
          </p>
          <div className="flex items-center gap-3">
            <ExitButton variant="dark" />
            <button
              onClick={startGame}
              className="cursor-pointer rounded-ui-element bg-accent-main px-5 py-2 text-sm font-bold text-content-inverse shadow-lg transition-all hover:brightness-110 active:scale-95"
            >
              Take the Challenge &rarr;
            </button>
          </div>
        </div>
        <header className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            {state.session?.name ?? 'Player'}, Ready for the Challenge?
          </h1>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            Here's everything you need to know before you get started.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LobbyCard icon={<Squares2X2Icon className="h-5 w-5" />} title="The Challenge">
            <p>
              There are <strong className="text-white">{getAllCategories().length} categories</strong> with{" "}
              <strong className="text-white">{CONFIG.QUESTIONS_PER_CATEGORY} questions each</strong> — {CONFIG.MAX_TOTAL_QUESTIONS} questions
              in total. Choose any question from the puzzle and answer in any preferred order.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<SparklesIcon className="h-5 w-5" />}
            title="Need a Hint?"
            highlight
          >
            <p>
              Stuck on a question? After 30 seconds, use <strong className="text-white">&quot;Need Help?&quot;</strong> for
              Annual Report grounded AI assistance, with the answer and supporting context.
            </p>
            <p className="mt-2">
              Keep in mind: Each time it's used, the{" "}
              <strong className="text-yellow-400">points available for that question are reduced by 50%</strong>.
            </p>
          </LobbyCard>

          <LobbyCard icon={<TrophyIcon className="h-5 w-5" />} title="Earn Category Badges">
            <p>
              Answer all available questions in each category correctly to earn a{" "}
              <strong className="text-white">certification badge</strong>. Put your knowledge to the
              test and try to earn them all!
            </p>
          </LobbyCard>

          <LobbyCard icon={<ArrowRightIcon className="h-5 w-5" />} title="Skip for Now">
            <p>
              Not ready to answer a question? Select <strong className="text-white">&quot;Skip for Now&quot;</strong> to move
              on. Once used, the remaining unanswered questions will be presented in sequence,
              allowing you to continue the challenge without interruption.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<ChartBarIcon className="h-5 w-5" />}
            title="Scoring & Leaderboard"
          >
            <p>
              Earn points for every correct answer, with{" "}
              <strong className="text-white">bonus points for faster answers</strong>. Complete the
              challenge and see how your score ranks on the leaderboard.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<Cog8ToothIcon className="h-5 w-5" />}
            title="Good to Know"
            wide
          >
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="text-white">Refresh:</strong> Your progress is automatically
                saved, so you can safely refresh the page.
              </li>
              <li>
                <strong className="text-white">Restart:</strong> Start the challenge again from
                the beginning and clear your current progress.
              </li>
              <li>
                <strong className="text-white">Sound:</strong> Use the speaker icon to turn game
                notifications on or off.
              </li>
            </ul>
          </LobbyCard>
        </div>
      </div>
    </div>
  );
}
