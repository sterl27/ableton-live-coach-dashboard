import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, ExpertiseArea, InteractionMode } from './types';

const MODE_INSTRUCTIONS: Record<InteractionMode['id'], string> = {
  'immediate': 'Be concise and direct. Give the shortest actionable answer possible. Lead with the specific shortcut, menu path, or setting name. No preamble.',
  'deep-dive': 'Provide thorough, in-depth explanations. Cover the underlying signal flow, routing architecture, or technical reasoning. Use examples and explain trade-offs between approaches.',
  'workshop': 'Guide the user step-by-step through a hands-on exercise. Number each step. Be specific about what to click, where to drag, and what parameter values to set.',
  'critique': 'Act as a critical reviewer. Analyze the user\'s approach, identify potential issues with gain staging, arrangement structure, sound design choices, or workflow efficiency. Suggest concrete improvements with reasoning.',
};

function buildSystemPrompt(mode: InteractionMode['id'], area: ExpertiseArea | null): string {
  let prompt = `You are a professional Ableton Live 12 Suite interactive coach. You have expert-level knowledge of every feature in Live 12, including:

- Session View and Arrangement View workflows
- All Suite instruments: Wavetable, Drift, Meld, Analog, Operator, Collision, Tension, Electric, Sampler, Simpler
- Drum Rack, Instrument Rack, Audio Effect Rack, MIDI Effect Rack
- All audio effects (EQ Eight, Compressor, Glue Compressor, Saturator, Corpus, Hybrid Reverb, etc.)
- All MIDI effects (Arpeggiator, Chord, Scale, MIDI Transformation Tools)
- Max for Live devices and development
- Push 2 and Push 3 integration, MPE support
- MIDI routing, sidechain routing, audio routing
- Warping, time-stretching, and beat-matching
- Automation, modulation, and envelope followers
- Ableton Link, tempo sync, and network collaboration
- Hardware integration, External Instrument, CV Tools
- Live 12-specific features: MIDI Transformation Tools, Scale Mode, Drift improvements, new MIDI generators

Always give practical, actionable advice. Reference specific Live 12 UI elements, menu paths (e.g., "Edit > Preferences > Audio"), and keyboard shortcuts (e.g., Cmd+D to duplicate). Use proper Ableton terminology.`;

  prompt += `\n\n## Response Style\n${MODE_INSTRUCTIONS[mode]}`;

  if (area) {
    prompt += `\n\n## Current Focus Area\nThe user is currently focused on "${area.title}" (${area.description}). Prioritize answers related to this domain. When the question is ambiguous, interpret it through this lens.`;
  }

  return prompt;
}

export function isApiKeyConfigured(): boolean {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return typeof key === 'string' && key.length > 0 && key !== 'your_api_key_here';
}

export async function* streamChat(
  messages: ChatMessage[],
  mode: InteractionMode['id'],
  area: ExpertiseArea | null,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('API key not configured. Create a .env file with VITE_GEMINI_API_KEY.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: buildSystemPrompt(mode, area),
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: msg.text }],
  }));

  try {
    const result = await model.generateContentStream({ contents });

    for await (const chunk of result.stream) {
      if (signal?.aborted) return;
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status === 403) {
      throw new Error('Invalid API key. Check your .env file.');
    } else if (error.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    } else if (error.status === 400) {
      throw new Error('Conversation too long. Try starting a new chat.');
    } else if (error.status && error.status >= 500) {
      throw new Error('Gemini is temporarily unavailable. Try again shortly.');
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('Network error. Check your internet connection.');
    }
    throw new Error(error.message || 'An unexpected error occurred.');
  }
}
