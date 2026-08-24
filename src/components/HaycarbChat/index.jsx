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
    <div className="flex h-full min-h-[500px] flex-col bg-surface-default text-content-primary">

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
          <div className="flex flex-col gap-5">
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
      <footer className="border-t border-black/10 bg-surface-muted px-5 py-3.5">
        <div className="mx-auto flex max-w-[820px] items-end gap-2.5">
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
            className="max-h-[120px] flex-1 resize-none rounded-ui-element border border-black/10 bg-surface-default px-3.5 py-2.5 text-[13.5px] leading-normal text-content-primary outline-none transition-colors placeholder:text-content-primary/40 focus:border-brand-main disabled:opacity-60"
          />

          <button
            onClick={() => submit()}
            disabled={busy || !input.trim()}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-ui-element bg-brand-main transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-35"
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
    <header className="relative flex shrink-0 items-center gap-3.5 border-b border-black/10 bg-surface-muted px-6 py-3.5">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-ui-element border border-black/10 bg-gradient-to-br from-brand-main to-brand-hover">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <circle cx="12" cy="10" r="4" fill="var(--hc-gold)" />
          <path d="M2 18 Q6 12 12 14 Q18 16 22 18" stroke="var(--hc-blue-soft)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M2 21 Q6 16 12 17 Q18 18 22 21" stroke="var(--hc-blue-rich)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div>
        <h1 className="text-sm font-semibold">Haycarb AI Assistant</h1>
        <p className="mt-px text-[11px] text-content-primary/70">
          Annual Report 2025/26 · Beyond the Beyond
        </p>
      </div>

      {showControls && (
        <div className="ml-auto flex items-center gap-2">
          <Select value={role} onChange={setRole} options={ROLES} />
          <Select value={style} onChange={setStyle} options={ANSWER_STYLES} />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-hover via-accent-main to-brand-hover opacity-60" />
    </header>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="cursor-pointer rounded-ui-element border border-black/10 bg-surface-default px-2 py-1 text-[11px] text-content-primary outline-none focus:border-brand-main"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
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
    <div className="m-auto max-w-[520px] px-4 py-8 text-center">
      <div className="relative mx-auto mb-5 h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(247,198,106,0.15),transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--hc-gold),var(--hc-orange))] shadow-[0_0_24px_rgba(247,198,106,0.4)]" />
      </div>

      <h2 className="mb-2 text-lg font-semibold">Ask about the Annual Report</h2>
      <p className="mb-6 text-[13px] leading-relaxed text-content-primary/70">
        I can answer questions about Haycarb&apos;s financial performance,
        sustainability, strategy and more — in any language including Sinhala and Tamil.
      </p>

      <div className="mb-6 rounded-ui-card border border-black/10 bg-surface-muted p-4">
        <p className="mb-3 text-[11px] text-content-primary/50">
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
            className="flex items-center gap-2.5 rounded-ui-element border border-black/10 bg-surface-muted px-3.5 py-2.5 text-[13px] transition-colors hover:border-brand-main hover:bg-surface-default"
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
      className={`rounded-full border px-3 py-1.5 text-[11.5px] transition-colors ${
        active
          ? 'border-brand-main bg-brand-main/10 text-brand-main'
          : 'border-black/10 text-content-primary/70 hover:border-brand-main'
      }`}
    >
      {children}
    </button>
  );
}
