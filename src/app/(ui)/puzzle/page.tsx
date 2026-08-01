'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowPathIcon, TrophyIcon } from '@heroicons/react/24/outline';
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
import MobileClueBar from '@/components/MobileClueBar';
import MobileActionStrip from '@/components/MobileActionStrip';
import { getBadgeDefinition } from '@/data/badges';

function PuzzleGame() {
  const { state, dispatch, enterLobby, restartGame } = usePuzzle();
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [lastPhase, setLastPhase] = useState(state.phase);
  const [showResults, setShowResults] = useState(state.phase === 'finished');

  function handleSubmit() {
    dispatch({ type: 'SUBMIT_ANSWER' });
  }

  function openHelp() {
    const activeQ = state.activeIndex !== null ? state.questions[state.activeIndex] : null;
    if (activeQ) {
      dispatch({ type: 'USE_AI_ASSIST', payload: { questionId: activeQ.question.id } });
    }
    window.open('/chat-help', '_blank', 'noopener,noreferrer');
  }

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
      <main className="grid grid-rows-[auto_1fr_auto_auto] h-[100dvh] w-full overflow-hidden lg:flex lg:flex-col lg:h-auto lg:min-h-screen lg:overflow-visible lg:p-10 lg:gap-8 bg-[#f8f9fa]">
        
        {/* ROW 1 (Mobile) / HEADER (Desktop) */}
        <div className="shrink-0 w-full flex items-center justify-between px-4 py-3 lg:px-0 lg:py-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-gray-700 truncate">
              {state.session?.name ?? 'Player'}
            </span>
            <span className="text-sm text-gray-400 whitespace-nowrap">Score: {state.score}/{state.questions.length}</span>
          </div>
          <div className="flex items-center gap-1 lg:gap-3 justify-end shrink-0">
            <MuteToggle />
            <ExitButton />
            <button
              onClick={() => setShowRestartDialog(true)}
              className="inline-flex cursor-pointer items-center justify-center w-8 h-8 rounded-ui-element border border-red-200 text-red-600 transition-colors hover:bg-red-50"
              aria-label="Restart game"
            >
              <ArrowPathIcon className="h-4 w-4" />
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
              className="inline-flex items-center justify-center w-8 h-8 lg:w-auto lg:h-auto lg:px-4 lg:py-2 bg-brand-main hover:bg-brand-hover text-white rounded-lg font-semibold shadow-md transition-all text-sm"
            >
              <TrophyIcon className="h-4 w-4 lg:hidden" />
              <span className="hidden lg:inline">Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* COMPACT CATEGORIES (Mobile Only) */}
        <div className="block lg:hidden w-full px-2 py-1 border-b border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center min-w-max scale-90 origin-left">
            <CategoryBadges/>
          </div>
        </div>

        {/* CATEGORIES (Desktop Only) */}
        <div className="hidden lg:block w-full">
          <CategoryBadges />
        </div>

        {/* ROW 2 (Mobile) / TWO-COLUMN LAYOUT (Desktop) */}
        <div className="flex flex-col items-center justify-center min-h-0 min-w-0 w-full overflow-hidden lg:flex-row lg:items-start lg:gap-12 lg:flex-1 lg:overflow-visible">
          <div className="w-full h-full flex flex-col items-center justify-center lg:w-3/5 lg:h-auto">
            <CrosswordGrid />
          </div>
          <div className="hidden lg:flex lg:flex-col lg:w-2/5 lg:gap-6">
            <ActiveCluePanel />
            <QuestionDeck />
          </div>
        </div>

        {/* ROW 3 & 4 (Mobile Only) */}
        <MobileClueBar />
        <MobileActionStrip onSubmit={handleSubmit} onHelp={openHelp} />

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
