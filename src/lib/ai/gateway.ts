import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const gateway = createOpenAICompatible({
  name: "vercel-ai-gateway",
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: "https://ai-gateway.vercel.sh/v1",
});

export const ABLETON_COACH_MODEL = process.env.ABLETON_COACH_MODEL ?? "openai/gpt-5.5";
