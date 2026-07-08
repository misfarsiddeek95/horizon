'use client';

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
