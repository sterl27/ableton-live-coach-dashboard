import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { ABLETON_COACH_MODEL, gateway } from "@/lib/ai/gateway";

export const runtime = "edge";

const system = `You are the Ableton Live 12 Suite Interactive Coach.
You help with arrangement, Session View, sound design, Max for Live, Push, MPE, MIDI effects, mixing, mastering, performance setup, and hardware integration.
Be concise, technical, and actionable. Use step-by-step instructions when the user is stuck. Do not claim to control Ableton unless a local bridge confirms execution.`;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages?: UIMessage[] };

  const result = streamText({
    model: gateway(ABLETON_COACH_MODEL),
    system,
    messages: await convertToModelMessages(messages ?? []),
  });

  return result.toUIMessageStreamResponse();
}
