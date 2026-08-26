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
    <div className="flex h-full min-h-0 flex-col text-content-primary">

      <Header
        role={role} setRole={setRole}
        style={style} setStyle={setStyle}
        showControls={showControls}
      />

      {/* chat area */}
      <div className="relative flex-1 overflow-hidden">
        {busy && <div className="hc-aura" />}

        <div
          ref={scrollRef}
          className="relative h-full overflow-y-auto px-5 py-6"
        >
          <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5">
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
              <div className="self-start rounded-ui-element border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* input */}
      <footer className="relative z-10 shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-6">
        <div className="mx-auto flex w-full max-w-[860px] items-end gap-2.5 rounded-2xl border border-white/40 bg-white/40 p-2 shadow-2xl backdrop-blur-xl">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={busy}
            placeholder="Ask anything about the Haycarb Annual Report…"
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
            className="max-h-[120px] flex-1 resize-none rounded-xl border-0 bg-transparent px-2.5 py-2.5 font-sans text-[14px] leading-normal text-content-primary outline-none placeholder:text-content-primary/40 disabled:opacity-60"
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
    <header className="relative z-10 mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-[860px] shrink-0 flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl border border-white/40 bg-white/40 px-5 py-3.5 shadow-xl backdrop-blur-xl sm:mt-6 sm:w-[calc(100%-3rem)]">
      <div className="flex items-center gap-3">
        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-white/40 bg-gradient-to-br from-brand-main to-brand-hover shadow-md">
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <circle cx="12" cy="10" r="4" fill="var(--hc-gold)" />
            <path d="M2 18 Q6 12 12 14 Q18 16 22 18" stroke="var(--hc-blue-soft)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M2 21 Q6 16 12 17 Q18 18 22 21" stroke="var(--hc-blue-rich)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <div>
          <h1 className="font-heading text-lg text-brand-main">Haycarb AI Assistant</h1>
          <p className="mt-px font-sans text-[11px] text-content-primary/60">
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
      className="cursor-pointer rounded-xl border border-white/40 bg-white/60 px-3 py-1.5 font-sans text-[12px] text-content-primary shadow-sm backdrop-blur-md outline-none focus:border-brand-main"
    >
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-surface-default text-content-primary">{o.label}</option>
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
    <div className="m-auto max-w-[520px] px-4 py-10 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-main to-brand-hover text-sm font-bold text-white shadow-lg">
        AI
      </div>

      <h2 className="mb-3 font-heading text-2xl text-brand-main sm:text-3xl">Ask about the Annual Report</h2>
      <p className="mb-6 font-sans text-[13px] leading-relaxed text-content-primary/70">
        I can answer questions about Haycarb&apos;s financial performance,
        sustainability, strategy and more — in any language including Sinhala and Tamil.
      </p>

      <div className="mb-6 rounded-2xl border border-white/40 bg-white/50 p-4 shadow-sm backdrop-blur-md">
        <p className="mb-3 font-sans text-[11px] text-content-primary/50">
          Answers are tailored to who&apos;s asking — pick one, or just start typing
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

      <div className="flex flex-col gap-2 text-left">
        {getSuggestions(role).map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="flex items-center gap-2.5 rounded-xl border border-white/40 bg-white/50 px-3.5 py-2.5 font-sans text-[13px] backdrop-blur-md transition-colors hover:border-brand-main hover:bg-white/70"
          >
            <span className="text-brand-main">→</span>
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
          ? 'border-brand-main bg-brand-main/10 text-brand-main'
          : 'border-white/40 bg-white/40 text-content-primary/70 hover:border-brand-main'
      }`}
    >
      {children}
    </button>
  );
}
