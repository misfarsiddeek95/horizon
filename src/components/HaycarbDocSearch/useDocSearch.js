import { useState, useCallback, useRef } from 'react';

/**
 * Owns document-search state. Each submitted query produces a "turn"
 * holding the query, the assistant message, and any matched chapters.
 */
export function useDocSearch({ endpoint }) {
  const [turns, setTurns] = useState([]);
  const [stage, setStage] = useState('idle');   // idle | searching
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const search = useCallback(async (query) => {
    const text = query?.trim();
    if (!text || stage !== 'idle') return;

    setError(null);
    setStage('searching');

    const turnId = crypto.randomUUID();
    setTurns(prev => [...prev, { id: turnId, query: text, message: null, matches: [] }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
        signal: abortRef.current.signal
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error) {
        setError(data?.message ?? 'Something went wrong. Please try again.');
        // drop the incomplete turn so the UI doesn't show an empty result
        setTurns(prev => prev.filter(t => t.id !== turnId));
        return;
      }

      setTurns(prev => prev.map(t =>
        t.id === turnId
          ? { ...t, message: data.message, matches: data.matches ?? [] }
          : t
      ));

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Something went wrong. Please try again.');
        setTurns(prev => prev.filter(t => t.id !== turnId));
      }
    } finally {
      setStage('idle');
      abortRef.current = null;
    }
  }, [endpoint, stage]);

  const reset = useCallback(() => {
    setTurns([]);
    setError(null);
    setStage('idle');
  }, []);

  return { turns, stage, error, search, reset };
}