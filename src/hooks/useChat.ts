import { useState, useRef, useCallback } from 'react';
import type { ChatMessage, ChatStatus, ExpertiseArea, InteractionMode } from '../types';
import { streamChat } from '../gemini';
import { INITIAL_MESSAGES } from '../data';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const rafRef = useRef<number>(0);

  const sendMessage = useCallback(async (
    text: string,
    mode: InteractionMode['id'],
    area: ExpertiseArea | null,
  ) => {
    if (!text.trim() || status === 'streaming') return;

    setError(null);

    const userMessage: ChatMessage = { role: 'user', text: text.trim() };
    const placeholder: ChatMessage = { role: 'assistant', text: '' };

    setMessages(prev => [...prev, userMessage, placeholder]);
    setStatus('streaming');

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = '';

    const flushToState = () => {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: accumulated };
        return updated;
      });
    };

    try {
      const history = [...messages, userMessage];
      const stream = streamChat(history, mode, area, controller.signal);

      for await (const chunk of stream) {
        if (controller.signal.aborted) break;
        accumulated += chunk;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(flushToState);
      }

      cancelAnimationFrame(rafRef.current);
      flushToState();
      setStatus('idle');
    } catch (err) {
      cancelAnimationFrame(rafRef.current);
      if (controller.signal.aborted) return;

      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);

      if (accumulated) {
        flushToState();
      } else {
        setMessages(prev => prev.slice(0, -1));
      }
      setStatus('error');
    }
  }, [messages, status]);

  const clearError = useCallback(() => setError(null), []);

  return { messages, status, error, sendMessage, clearError };
}
