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
    <main className="flex flex-col p-4 sm:p-6 lg:p-12 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
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

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-3/5 flex-shrink max-w-full min-w-0">
          <CrosswordGrid />
        </div>

        <div className="w-full lg:w-2/5 flex flex-col min-w-0">
          <ActiveCluePanel />
          <QuestionDeck />
        </div>
      </div>

      {state.phase === 'finished' && <ResultsOverlay />}
    </main>
  );
}

export default function PuzzlePage() {
  return (
    <PuzzleProvider>
      <PuzzleGame />
    </PuzzleProvider>
  );
}
