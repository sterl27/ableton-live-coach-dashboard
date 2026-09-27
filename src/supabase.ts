import { createClient } from '@supabase/supabase-js';
import type { ChatMessage } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

export async function saveSession(
  sessionId: string,
  messages: ChatMessage[],
  mode: string,
  areaId: number | null,
): Promise<void> {
  if (!supabase) return;
  await supabase.from('chat_sessions').upsert({
    id: sessionId,
    messages: JSON.stringify(messages),
    mode,
    area_id: areaId,
    updated_at: new Date().toISOString(),
  });
}

export async function loadLatestSession(): Promise<{
  id: string;
  messages: ChatMessage[];
  mode: string;
  areaId: number | null;
} | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('chat_sessions')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;
  return {
    id: data.id,
    messages: JSON.parse(data.messages),
    mode: data.mode,
    areaId: data.area_id,
  };
}
