import { useState, useCallback, useRef } from 'react';

/**
 * Owns conversation state and the API call.
 * Keeps full history for display; sends only the last N turns to the API.
 */
export function useChat({ endpoint, historyTurns = 6 }) {
  const [messages, setMessages] = useState([]);   // full history for display
  const [stage, setStage] = useState('idle');     // idle | sending | thinking
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const send = useCallback(async (text, { role, answerStyle }) => {
    if (!text?.trim() || stage !== 'idle') return;

    setError(null);
    setStage('sending');

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);

    // API expects { role, content } and only the turns before this one
    const history = messages
      .slice(-historyTurns)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));

    abortRef.current = new AbortController();

    try {
      // brief 'sending' beat before switching to 'thinking'
      const stageTimer = setTimeout(() => setStage('thinking'), 400);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          role,
          answerStyle,
          conversationHistory: history
        }),
        signal: abortRef.current.signal
      });

      clearTimeout(stageTimer);

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error) {
        setError(data?.message ?? 'Something went wrong. Please try again.');
        return;
      }

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
        charts: data.charts ?? null,
        images: data.images ?? null,
        pdfBase64: data.pdfBase64 ?? null
      }]);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setStage('idle');
      abortRef.current = null;
    }
  }, [endpoint, historyTurns, messages, stage]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStage('idle');
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setStage('idle');
  }, []);

  return { messages, stage, error, send, cancel, reset };
}