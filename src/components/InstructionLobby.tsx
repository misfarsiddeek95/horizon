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
      className={`!bg-white/10 !backdrop-blur-xl !border !border-white/20 !shadow-2xl hover:!bg-white/15 hover:!scale-[1.02] !transition-all !duration-300 rounded-2xl p-5 sm:p-6 ${
        highlight ? "!border-yellow-400/40" : ""
      } ${wide ? "md:col-span-2" : ""}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center !bg-white/10 !border !border-white/20 rounded-ui-element text-yellow-400">
          {icon}
        </div>
        <h2 className="font-heading text-lg !text-white !font-bold !drop-shadow-md">{title}</h2>
      </div>
      <div className="text-sm !text-slate-100 !leading-relaxed !drop-shadow-sm">{children}</div>
    </section>
  );
}

export default function InstructionLobby() {
  const { state, startGame } = usePuzzle();

  return (
    <div className="relative min-h-screen">
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
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-4 py-8 sm:py-12">
        <div className="mb-4 flex items-center justify-end sm:justify-between">
          <p className="text-sm !text-slate-100 !drop-shadow-sm hidden sm:block">
            How well do you know Haycarb&apos;s Annual Report 2025/26?
          </p>
          <div className="flex items-center gap-3">
            <ExitButton variant="dark" />
            <button
              onClick={startGame}
              className="hidden md:inline-flex cursor-pointer !bg-brand-main !text-white !font-bold !shadow-lg hover:!shadow-xl hover:!brightness-110 !transition-all rounded-lg px-5 py-2 text-sm active:scale-95 items-center"
            >
              Take the Challenge &rarr;
            </button>
          </div>
        </div>
        <header className="mb-8 text-center">
          <h1 className="font-heading text-3xl !text-white !font-bold !drop-shadow-md sm:text-4xl">
            {state.session?.name ?? 'Player'}, Ready for the Challenge?
          </h1>
          <p className="mt-2 text-sm !text-slate-100 !drop-shadow-sm sm:text-base">
            Here&apos;s everything you need to know before you get started.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LobbyCard icon={<Squares2X2Icon className="h-5 w-5" />} title="The Challenge">
            <p>
              There are <strong className="!text-white">{getAllCategories().length} categories</strong> with{" "}
              <strong className="!text-white">{CONFIG.QUESTIONS_PER_CATEGORY} questions each</strong> — {CONFIG.MAX_TOTAL_QUESTIONS} questions
              in total. Choose any question from the puzzle and answer in any preferred order.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<SparklesIcon className="h-5 w-5" />}
            title="Need a Hint?"
            highlight
          >
            <p>
              Stuck on a question? After 30 seconds, use <strong className="!text-white">&quot;Need Help?&quot;</strong> for
              Annual Report grounded AI assistance, with the answer and supporting context.
            </p>
            <p className="mt-2">
              Keep in mind: Each time it&apos;s used, the{" "}
              <strong className="!text-yellow-400">points available for that question are reduced by 50%.</strong>
            </p>
          </LobbyCard>

          <LobbyCard icon={<TrophyIcon className="h-5 w-5" />} title="Earn Category Badges">
            <p>
              Answer all available questions in each category correctly to earn a{" "}
              <strong className="!text-white">certification badge</strong>. Put your knowledge to the
              test and try to earn them all!
            </p>
          </LobbyCard>

          <LobbyCard icon={<ArrowRightIcon className="h-5 w-5" />} title="Skip for Now">
            <p>
              Not ready to answer a question? Select <strong className="!text-white">&quot;Skip for Now&quot;</strong> to move
              on. Once used, all remaining unanswered skipped questions must be answered to complete your run.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<ChartBarIcon className="h-5 w-5" />}
            title="Scoring & Leaderboard"
          >
            <p>
              Earn points for every correct answer, with{" "}
              <strong className="!text-white">bonus points for faster answers</strong>. Complete the
              challenge and see how your score ranks on the leaderboard.
            </p>
          </LobbyCard>

          <LobbyCard
            icon={<Cog8ToothIcon className="h-5 w-5" />}
            title="Good to Know"
          >
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="!text-white">Refresh:</strong> Your progress is automatically
                saved, so you can safely refresh the page.
              </li>
              <li>
                <strong className="!text-white">Restart:</strong> Start the challenge again from
                the beginning and clear your current progress.
              </li>
              <li>
                <strong className="!text-white">Sound:</strong> Use the speaker icon to turn game
                notifications on or off.
              </li>
            </ul>
          </LobbyCard>
        </div>

        <div className="mt-8 flex md:hidden justify-center">
          <button
            onClick={startGame}
            className="cursor-pointer !bg-brand-main !text-white !font-bold !shadow-lg hover:!shadow-xl hover:!brightness-110 !transition-all rounded-lg px-6 py-3 text-sm active:scale-95"
          >
            Take the Challenge &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
