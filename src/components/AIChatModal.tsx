'use client';

import { useState, useEffect, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Question } from '@/types';
import { questionPool } from '@/data/questions';
import { usePuzzle } from '@/context/PuzzleContext';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeQuestion: Question | null;
}

export default function AIChatModal({ isOpen, onClose, activeQuestion }: AIChatModalProps) {
  const { state } = usePuzzle();
  const [isTyping, setIsTyping] = useState(true);
  const isPlaying = state.phase === 'playing';

  const fullQuestionData = useMemo(
    () => (activeQuestion ? questionPool.find((q) => q.id === activeQuestion.id) ?? null : null),
    [activeQuestion]
  );

  const descriptionToRender = fullQuestionData?.description || 'No additional information available.';

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(true);
    }
  }, [isOpen, activeQuestion?.id]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!activeQuestion) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className={isPlaying ? "relative flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl border border-white/20 bg-black/50 shadow-2xl backdrop-blur-xl" : "w-full max-w-md bg-white rounded-t-2xl shadow-2xl sm:rounded-2xl flex flex-col max-h-[80vh] sm:mt-0"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-teal-600 rounded-t-2xl sm:rounded-t-2xl shrink-0">
          <span className="text-sm font-semibold text-white">AI Assistant</span>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className={isPlaying ? "flex-1 space-y-3 overflow-y-auto bg-black/20 p-4" : "flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50"}>
          <div className="flex justify-end">
            <div className="bg-brand-main text-white px-3 py-2 rounded-lg rounded-tr-none shadow-sm text-sm max-w-[80%]">
              I need a hint for this clue.
            </div>
          </div>

          <div className="flex justify-start">
            <div className={isPlaying ? "max-w-[85%] rounded-lg rounded-tl-none border border-white/15 bg-white/10 p-3 text-sm leading-relaxed text-white shadow-sm" : "bg-white border border-teal-100 text-slate-700 p-3 rounded-lg rounded-tl-none shadow-sm text-sm leading-relaxed max-w-[85%]"}>
              {isTyping ? (
                <span className="flex items-center gap-1 text-slate-400 italic">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse [animation-delay:100ms]">●</span>
                  <span className="animate-pulse [animation-delay:200ms]">●</span>
                </span>
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: descriptionToRender,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
