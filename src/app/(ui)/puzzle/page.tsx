'use client';

import Link from 'next/link';
import { PuzzleProvider, usePuzzle } from '@/context/PuzzleContext';
import Onboarding from '@/components/Onboarding';
import CategoryBadges from '@/components/CategoryBadges';
import CrosswordGrid from '@/components/CrosswordGrid';
import ActiveCluePanel from '@/components/ActiveCluePanel';
import QuestionDeck from '@/components/QuestionDeck';
import ResultsOverlay from '@/components/ResultsOverlay';

function PuzzleGame() {
  const { state, startGame } = usePuzzle();

  if (state.phase === 'onboarding') {
    return <Onboarding onStart={startGame} />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {state.session?.name ?? 'Player'}
          </span>
          <span className="text-sm text-gray-400">Score: {state.score}/8</span>
        </div>
        <Link
          href="/leaderboard"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition-all text-sm"
        >
          View Leaderboard
        </Link>
      </div>

      <CategoryBadges />

      <div className="flex flex-1 flex-col gap-4 px-4 pb-6 lg:flex-row lg:gap-6 lg:px-6">
        <div className="flex items-start justify-center lg:w-[60%]">
          <CrosswordGrid />
        </div>

        <div className="flex flex-col gap-4 lg:w-[40%]">
          <ActiveCluePanel />
          <QuestionDeck />
        </div>
      </div>

      {state.phase === 'finished' && <ResultsOverlay />}
    </div>
  );
}

export default function PuzzlePage() {
  return (
    <PuzzleProvider>
      <PuzzleGame />
    </PuzzleProvider>
  );
}
