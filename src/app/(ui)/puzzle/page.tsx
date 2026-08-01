'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { PuzzleProvider, usePuzzle } from '@/context/PuzzleContext';
import Onboarding from '@/components/Onboarding';
import InstructionLobby from '@/components/InstructionLobby';
import CategoryBadges from '@/components/CategoryBadges';
import CrosswordGrid from '@/components/CrosswordGrid';
import ActiveCluePanel from '@/components/ActiveCluePanel';
import QuestionDeck from '@/components/QuestionDeck';
import ResultsOverlay from '@/components/ResultsOverlay';
import ConfirmDialog from '@/components/ConfirmDialog';
import BadgeUnlockModal from '@/components/BadgeUnlockModal';
import MuteToggle from '@/components/MuteToggle';
import ExitButton from '@/components/ExitButton';
import { getBadgeDefinition } from '@/data/badges';

function PuzzleGame() {
  const { state, dispatch, enterLobby, restartGame } = usePuzzle();
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [lastPhase, setLastPhase] = useState(state.phase);
  const [showResults, setShowResults] = useState(state.phase === 'finished');

  const activeBadgeId = state.badgeQueue[0] ?? null;
  const activeBadge = activeBadgeId
    ? getBadgeDefinition(activeBadgeId)
    : null;

  if (lastPhase !== state.phase) {
    setLastPhase(state.phase);
    if (state.phase === 'finished') {
      setShowResults(true);
    }
  }

  if (state.phase === 'onboarding') {
    return <Onboarding onStart={enterLobby} />;
  }

  if (state.phase === 'idle') {
    return <InstructionLobby />;
  }

  return (
    <>
      <main className="flex flex-col p-4 sm:p-6 lg:p-12 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {state.session?.name ?? 'Player'}
          </span>
          <span className="text-sm text-gray-400">Score: {state.score}/{state.questions.length}</span>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <MuteToggle />
          <ExitButton />
          <button
            onClick={() => setShowRestartDialog(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-ui-element border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Restart
          </button>
          <ConfirmDialog
            open={showRestartDialog}
            title="Restart Game?"
            message="Are you sure you want to restart? Your current progress will be lost."
            confirmLabel="Restart"
            cancelLabel="Cancel"
            onConfirm={() => {
              setShowRestartDialog(false);
              restartGame();
            }}
            onCancel={() => setShowRestartDialog(false)}
          />
          <Link
            href="/leaderboard"
            className="px-4 py-2 bg-brand-main hover:bg-brand-hover text-white rounded-lg font-semibold shadow-md transition-all text-sm"
          >
            Leaderboard
          </Link>
        </div>
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

      {state.phase === 'finished' &&
        showResults &&
        state.badgeQueue.length === 0 && (
          <ResultsOverlay onClose={() => setShowResults(false)} />
        )}
    </main>

    {activeBadge && (
      <BadgeUnlockModal
        key={activeBadge.id}
        badge={activeBadge}
        onClose={() => dispatch({ type: 'DISMISS_BADGE' })}
      />
    )}
    </>
  );
}

export default function PuzzlePage() {
  return (
    <PuzzleProvider>
      <PuzzleGame />
    </PuzzleProvider>
  );
}
