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
import MobileTimer from '@/components/MobileTimer';
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
      <main className="grid grid-rows-[auto_auto_1fr_auto_auto] h-[100dvh] w-full overflow-hidden lg:flex lg:flex-col lg:h-auto lg:min-h-screen lg:overflow-visible lg:p-10 lg:gap-8 bg-[#f8f9fa]">
        
        {/* ROW 1 (Mobile) / HEADER (Desktop) */}
        <div className="shrink-0 w-full max-w-full flex items-center justify-between flex-nowrap px-3 py-3 lg:px-0 lg:py-0">
          <div className="flex flex-col items-start justify-center overflow-hidden mr-2 lg:flex-row lg:items-center lg:gap-2">
            <span className="font-bold text-sm truncate w-full max-w-[120px] lg:max-w-none">
              {state.session?.name ?? 'Player'}
            </span>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              Score: {state.score}/{state.questions.length}
            </span>
          </div>
          <div className="flex items-center gap-1 lg:gap-3 justify-end shrink-0">
            <MuteToggle />
            <ExitButton />
            <button
              onClick={() => setShowRestartDialog(true)}
              className="inline-flex cursor-pointer items-center justify-center w-7 h-7 rounded-ui-element border border-red-200 text-red-600 transition-colors hover:bg-red-50"
              aria-label="Restart game"
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
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
              className="inline-flex items-center justify-center w-7 h-7 lg:w-auto lg:h-auto lg:px-4 lg:py-2 bg-brand-main hover:bg-brand-hover text-white rounded-lg font-semibold shadow-md transition-all text-sm"
            >
              <TrophyIcon className="h-3.5 w-3.5 lg:hidden" />
              <span className="hidden lg:inline">Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* COMPACT CATEGORIES (Mobile Only) */}
        <div className="block lg:hidden w-full px-2 py-2 border-b border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar shrink-0 min-h-[50px]">
          <div className="flex items-center min-w-max scale-90 origin-left">
            <CategoryBadges/>
          </div>
        </div>

        {/* MOBILE TIMER */}
        <div className="block lg:hidden w-full px-4 py-3 shrink-0 bg-white border-b border-slate-200 z-10 relative">
          <MobileTimer />
        </div>

        {/* CATEGORIES (Desktop Only) */}
        <div className="hidden lg:block w-full">
          <CategoryBadges />
        </div>

        {/* MIDDLE SECTION: Grid (Mobile) / TWO-COLUMN LAYOUT (Desktop) */}
        <div className="w-full flex-1 min-h-0 overflow-hidden flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:overflow-visible lg:w-full">
          
          {/* LEFT COLUMN: Grid Container */}
          {/* Added p-4 for mobile spacing around the canvas */}
          <div className="w-full h-full flex flex-col p-4 min-w-0 lg:p-0 lg:w-[60%] lg:shrink-0 lg:h-auto lg:overflow-visible">
            
            {/* THE WHITE CANVAS (Fixed on mobile, transparent on desktop) */}
            <div className="w-full h-full bg-white rounded-xl shadow-sm flex flex-col overflow-hidden lg:bg-transparent lg:shadow-none lg:overflow-visible">
              
              {/* THE SCROLLABLE INTERIOR */}
              {/* CRITICAL FIX: overflow-auto is now INSIDE the canvas. 
                  Added pb-32 to allow the user to scroll the bottom of the grid far above the clue bar. 
                  Added touch-pan-x touch-pan-y to ensure the grid doesn't steal touch events. */}
              <div className="flex-1 overflow-auto w-full h-full p-4 pb-32 touch-pan-x touch-pan-y lg:p-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:overflow-visible">
                
                {/* THE GRID SCIZER */}
                <div className="w-max mx-auto">
                  <CrosswordGrid />
                </div>
                
              </div>
            </div>
            
          </div>

          {/* RIGHT COLUMN: Cards (Desktop Only) */}
          <div className="hidden lg:flex lg:flex-col lg:w-[40%] lg:shrink-0 lg:gap-6 min-w-0">
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
