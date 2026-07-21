export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ExpertiseArea {
  id: number;
  title: string;
  description: string;
}

export interface InteractionMode {
  id: 'immediate' | 'deep-dive' | 'workshop' | 'critique';
  label: string;
  icon: string;
}

export type ChatStatus = 'idle' | 'streaming' | 'error';
