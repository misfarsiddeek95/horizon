'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from './useChat';
import Message from './Message';
import Thinking from './Thinking';
import { exportMessageToPdf } from './exportPdf';
import { ROLES, ANSWER_STYLES, getSuggestions } from './constants';

/**
 * Haycarb Annual Report chat.
 *
 * Fills its parent — give the wrapping element a height.
 *
 * @param endpoint      API route to POST to (proxied, key stays server-side)
 * @param defaultRole   initial stakeholder role
 * @param defaultStyle  'descriptive' | 'short'
 * @param showControls  show role/style selectors in the header
 */
export default function HaycarbChat({
  endpoint = '/api/haycarb-chat',
  defaultRole = 'general',
  defaultStyle = 'descriptive',
  showControls = true
}) {
  const [role, setRole] = useState(defaultRole);
  const [style, setStyle] = useState(defaultStyle);
  const [input, setInput] = useState('');
  const [exportingId, setExportingId] = useState(null);

  const { messages, stage, error, send } = useChat({ endpoint });

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const canvasRefs = useRef({});   // messageId -> [canvas]

  const busy = stage !== 'idle';

  // Track chart canvases so PDF export can capture them
  const handleCanvasReady = useCallback((messageId, chartIndex, canvas) => {
    if (!canvasRefs.current[messageId]) canvasRefs.current[messageId] = [];
    canvasRefs.current[messageId][chartIndex] = canvas;
  }, []);

  const handleExport = useCallback(async (message) => {
    setExportingId(message.id);
    try {
      await exportMessageToPdf({
        message,
        canvases: canvasRefs.current[message.id] ?? []
      });
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setExportingId(null);
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, stage]);

  const submit = (text) => {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    send(value, { role, answerStyle: style });
  };

  return (
    <div className="flex h-full min-h-0 flex-col text-white">

      {messages.length > 0 && (
        <Header
          role={role} setRole={setRole}
          style={style} setStyle={setStyle}
          showControls={showControls}
        />
      )}

      {/* chat area */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {busy && <div className="hc-aura" />}

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-6"
        >
          <div className="mx-auto flex min-h-full w-full max-w-[860px] flex-col gap-5">
            {messages.length === 0 && !busy && (
              <Welcome
                role={role} setRole={setRole}
                style={style} setStyle={setStyle}
                onPick={submit}
              />
            )}

            {messages.map(m => (
              <Message
                key={m.id}
                message={m}
                onCanvasReady={handleCanvasReady}
                onExport={handleExport}
                exportingId={exportingId}
              />
            ))}

            <Thinking stage={stage} />

            {error && (
              <div className="self-start rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 font-sans text-[13px] text-red-200">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* input */}
      <footer className="relative z-10 shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-6">
        <div className="mx-auto flex w-full max-w-[860px] items-end gap-2.5 rounded-2xl border border-white/20 bg-[#020b10]/75 p-2 shadow-2xl backdrop-blur-xl">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={busy}
            placeholder="Ask your questions about Haycarb's Annual Report here…"
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            className="max-h-[120px] flex-1 resize-none rounded-xl border-0 bg-transparent px-2.5 py-2.5 font-sans text-[14px] font-medium leading-normal text-white outline-none placeholder:text-white/70 disabled:opacity-60"
          />

          <button
            onClick={() => submit()}
            disabled={busy || !input.trim()}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-brand-main text-white shadow-md transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-35"
          >
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}

function Header({ role, setRole, style, setStyle, showControls }) {
  return (
    <header className="relative z-10 mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-[860px] shrink-0 flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl border border-white/20 bg-[#020b10]/75 px-5 py-3.5 shadow-xl backdrop-blur-xl sm:mt-6 sm:w-[calc(100%-3rem)]">
      <div className="flex items-center gap-3">
        <div className="relative h-[36px] w-[36px] shrink-0">
          <div className="absolute left-1/2 top-1/2 origin-center" style={{ transform: 'translate(-50%, -50%) scale(0.25)' }}>
            <AiOrb />
          </div>
        </div>

        <div>
          <h1 className="font-heading text-lg text-teal-2">Haycarb AI Assistant</h1>
          <p className="mt-px font-sans text-[11px] font-medium text-white">
            Annual Report 2025/26 · Beyond the Beyond
          </p>
        </div>
      </div>

      {showControls && (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Select value={role} onChange={setRole} options={ROLES} />
          <Select value={style} onChange={setStyle} options={ANSWER_STYLES} />
        </div>
      )}
    </header>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="cursor-pointer rounded-xl border border-white/20 bg-[#020b10]/75 px-3 py-1.5 font-sans text-[12px] font-medium text-white shadow-sm backdrop-blur-xl outline-none focus:border-teal-2"
    >
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-[#0d3443] text-white">{o.label}</option>
      ))}
    </select>
  );
}

/**
 * Welcome screen. The role picker is prominent here because role
 * meaningfully changes the answer — it moves to the header dropdown
 * once a conversation starts.
 */
function Welcome({ role, setRole, style, setStyle, onPick }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 text-center">
      <AiOrb />

      <h2 className="mb-3 font-heading text-2xl font-medium text-white drop-shadow-lg sm:text-3xl">Explore the Annual Report with AI</h2>
      <p className="mx-auto mb-6 w-full max-w-2xl font-sans text-[13px] font-medium leading-relaxed text-white drop-shadow-md">
        Discover insights across the Annual Report, tailored to your profile and interests. Ask questions, explore topics and engage with the report in your preferred language.
      </p>

      <div className="mx-auto mb-6 w-full max-w-2xl rounded-2xl border border-white/20 bg-[#020b10]/75 p-4 shadow-sm backdrop-blur-xl">
        <p className="mb-3 font-sans text-[11px] font-medium text-white">
          Choose a profile and response style to personalise your experience or proceed without a selection.
        </p>

        <div className="mb-4 flex flex-wrap justify-center gap-1.5">
          {ROLES.map(r => (
            <Chip key={r.value} active={role === r.value} onClick={() => setRole(r.value)}>
              {r.label}
            </Chip>
          ))}
        </div>

        <div className="flex justify-center gap-1.5">
          {ANSWER_STYLES.map(s => (
            <Chip key={s.value} active={style === s.value} onClick={() => setStyle(s.value)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 md:grid-cols-2">
        {getSuggestions(role).map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="rounded-xl border border-white/20 bg-[#020b10]/75 px-4 py-2.5 font-sans text-[13px] font-medium leading-snug text-white backdrop-blur-xl transition-colors hover:border-teal-2 hover:bg-[#020b10]/90"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-sans text-[11.5px] transition-colors ${
        active
          ? 'border-teal-2 bg-teal-2/25 text-white'
          : 'border-white/20 bg-[#020b10]/75 text-white hover:border-teal-2'
      }`}
    >
      {children}
    </button>
  );
}

function AiOrb() {
  return (
    <div className="relative mx-auto mb-7 h-36 w-36" style={{ perspective: '800px' }}>
      <div className="animate-orb-pulse absolute -inset-4 rounded-full bg-brand-main/40 blur-xl" />

      <div className="animate-orb-spin absolute inset-0 rounded-full border-2 border-teal-2/90 border-t-transparent">
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-2 shadow-[0_0_10px_3px_rgba(91,178,200,0.85)]" />
      </div>

      <div className="animate-orb-rotate-x absolute inset-1 rounded-full border-2 border-white/60 border-b-transparent">
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.7)]" />
      </div>

      <div className="animate-orb-rotate-y absolute inset-2 rounded-full border-2 border-brand-main/80 border-t-transparent">
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-main shadow-[0_0_10px_3px_rgba(20,115,133,0.85)]" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_7px_rgba(140,224,240,0.8)]" />
    </div>
  );
}
