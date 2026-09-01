'use client';

import { useState, useEffect, useRef } from 'react';
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
import AIChatModal from '@/components/AIChatModal';
import { getBadgeDefinition } from '@/data/badges';

function PuzzleGame() {
  const { state, dispatch, enterLobby, restartGame } = usePuzzle();
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [lastPhase, setLastPhase] = useState(state.phase);
  const [showResults, setShowResults] = useState(state.phase === 'finished');
  const [chatOpen, setChatOpen] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Audio('/sounds/game.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.15;
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    const audio = bgMusicRef.current;
    if (!audio) return;
    if (state.isMuted || state.phase !== 'playing') {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [state.isMuted, state.phase]);

  const activeQuestion = state.activeIndex !== null ? state.questions[state.activeIndex] : null;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatOpen(false);
  }, [activeQuestion?.question.id, activeQuestion?.status]);

  function handleSubmit() {
    dispatch({ type: 'SUBMIT_ANSWER' });
  }

  function openHelp() {
    if (activeQuestion) {
      dispatch({ type: 'USE_AI_ASSIST', payload: { questionId: activeQuestion.question.id } });
    }
    setChatOpen(true);
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
      <main className="relative z-10 grid grid-rows-[auto_auto_auto_1fr_auto_auto] h-[100dvh] w-full overflow-hidden lg:flex lg:flex-col lg:h-auto lg:min-h-screen lg:overflow-visible lg:p-10 lg:gap-8 bg-transparent">
        
        {/* ROW 1 (Mobile) / HEADER (Desktop) */}
        <div className="relative z-[100] shrink-0 w-full max-w-full flex items-center justify-between flex-nowrap pl-20 max-md:pl-4 pr-3 py-3 lg:pl-20 lg:pr-0 lg:py-0 gap-2 max-md:gap-2">
          <div className="flex flex-col items-start justify-center overflow-hidden mr-2 min-w-0 shrink max-md:flex-1 max-md:min-w-0 max-md:ml-0 max-md:pl-0 max-md:mr-0 max-md:text-left lg:flex-row lg:items-center lg:gap-2">
            <span className="font-bold text-sm truncate min-w-0 shrink text-white max-md:truncate">
              {state.session?.name ?? 'Player'}
            </span>
            <span className="text-xs text-slate-100 whitespace-nowrap shrink-0">
              Score: {state.score}/{state.questions.length}
            </span>
          </div>
          <div className="flex items-center gap-1 lg:gap-3 justify-end shrink-0">
            <MuteToggle />
            <ExitButton />
            <button
              onClick={() => setShowRestartDialog(true)}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-2 border max-md:w-10 max-md:h-10 max-md:p-0 max-md:gap-0 max-md:flex max-md:items-center max-md:justify-center max-md:rounded-lg rounded-ui-element text-sm font-semibold transition-colors !bg-amber-500 !text-white hover:!bg-amber-600 !border-none !shadow-lg transition-colors"
              aria-label="Restart game"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="max-md:hidden">Restart</span>
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
              className="inline-flex items-center justify-center gap-1.5 w-7 h-7 max-md:w-10 max-md:h-10 max-md:p-0 max-md:gap-0 max-md:flex max-md:items-center max-md:justify-center max-md:rounded-lg lg:w-auto lg:h-auto lg:px-4 lg:py-2 !bg-brand-main hover:!bg-brand-hover !text-white !border-none !shadow-lg rounded-lg font-semibold transition-all text-sm"
            >
              <TrophyIcon className="h-4 w-4" />
              <span className="max-md:hidden">Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* COMPACT CATEGORIES (Mobile Only) */}
        <div className="block lg:hidden w-full pl-2 pr-6 py-2 border-b border-white/20 bg-white/10 backdrop-blur-md overflow-x-auto no-scrollbar shrink-0 min-h-[50px]">
          <div className="flex items-center min-w-max">
            <CategoryBadges/>
          </div>
        </div>

        {/* MOBILE SKIPPED NUMBER PAD (Mobile Only) */}
        {state.questions.some((q) => q.status === 'bypassed') && (
          <div className="block lg:hidden w-full px-4 py-3 bg-white/10 backdrop-blur-md border-b border-white/20 shrink-0 flex-none overflow-x-auto no-scrollbar z-10 relative">
            <div className="flex items-center gap-3 min-w-max">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider flex-none">Skipped:</span>
              <div className="flex items-center gap-2">
                {state.questions
                  .map((q, i) => ({ q, i }))
                  .filter(({ q }) => q.status === 'bypassed')
                  .map(({ q, i }) => (
                    <button
                      key={q.question.id}
                      onClick={() => {
                        if (state.activeIndex === null && !state.isPaused) {
                          dispatch({ type: 'SELECT_QUESTION', payload: i });
                        }
                      }}
                      disabled={state.activeIndex !== null || state.isPaused}
                      className="w-8 h-8 rounded bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0 disabled:opacity-50 disabled:cursor-default"
                      aria-label={`Resume skipped question ${q.number}`}
                    >
                      {q.number}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* MOBILE TIMER */}
        <div className="block lg:hidden w-full px-4 py-3 shrink-0 bg-white/10 backdrop-blur-md border-b border-white/20 z-10 relative">
          <MobileTimer />
        </div>

        {/* CATEGORIES (Desktop Only) */}
        <div className="hidden lg:block w-full">
          <CategoryBadges />
        </div>

        {/* MIDDLE SECTION: Grid (Mobile) / TWO-COLUMN LAYOUT (Desktop) */}
        <div className="w-full flex-1 min-h-0 overflow-hidden flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:overflow-visible lg:w-full">
          
          {/* LEFT COLUMN: Grid Container */}
          <div className="w-full h-full flex flex-col p-4 min-w-0 lg:p-0 lg:w-[60%] lg:shrink-0 lg:h-auto lg:overflow-visible">
            
            <div className="w-full h-full flex flex-col overflow-hidden lg:overflow-visible">
              
              <div className="flex-1 overflow-auto w-full h-full p-4 pb-32 touch-pan-x touch-pan-y lg:p-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:overflow-visible">
                
                <div className="w-max mx-auto lg:w-full lg:mx-auto">
                  <CrosswordGrid />
                </div>
                
              </div>
            </div>
            
          </div>

          {/* RIGHT COLUMN: Cards (Desktop Only) */}
          <div className="hidden lg:flex lg:flex-col lg:w-[40%] lg:shrink-0 lg:gap-6 min-w-0">
            <ActiveCluePanel onHelp={openHelp} />
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
        onClose={() => {
          const viewed = JSON.parse(localStorage.getItem('horizon-viewed-badges') || '[]');
          if (!viewed.includes(activeBadgeId)) {
            localStorage.setItem('horizon-viewed-badges', JSON.stringify([...viewed, activeBadgeId]));
          }
          dispatch({ type: 'DISMISS_BADGE' });
        }}
      />
    )}
    {chatOpen && activeQuestion && (
      <AIChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeQuestion={activeQuestion.question}
      />
    )}
    </>
  );
}

export default function PuzzleGameView() {
  return (
    <PuzzleProvider>
      <PuzzleGame />
    </PuzzleProvider>
  );
}
