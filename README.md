# Ableton Live 12 Suite Interactive Coach Dashboard

A professional Ableton Live 12 coaching interface upgraded to **Next.js App Router**, **Vercel AI SDK**, **Vercel AI Gateway**, and **shadcn-compatible UI structure**.

The dashboard is designed for an AI-native Ableton workflow: fast coaching, Live 12 expertise navigation, streaming responses, mode-aware prompts, and a future local Ableton bridge.

---

## Stack

```txt
Next.js App Router
React + TypeScript
Vercel AI SDK
Vercel AI Gateway
shadcn/ui-compatible config
Framer Motion
Lucide React
CSS design tokens
```

---

## Features

- Ableton Live 12 cockpit UI
- Streaming AI coach via `/api/chat`
- Vercel AI Gateway provider
- Mode-aware coaching prompts
- Expertise shortcuts for Live performance, sound design, MPE, mixing, arrangement, Max for Live, MIDI effects, Link, and hardware integration
- Animated voice / stream visualizer
- shadcn-compatible `components.json`
- Future-ready local Ableton bridge environment variable

---

## Run Locally

```bash
git clone https://github.com/sterl27/ableton-live-coach-dashboard.git
cd ableton-live-coach-dashboard
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Environment

```bash
AI_GATEWAY_API_KEY=
ABLETON_COACH_MODEL=openai/gpt-5.5
ABLETON_BRIDGE_URL=http://127.0.0.1:8765
```

`ABLETON_BRIDGE_URL` is reserved for a future local-only bridge. The dashboard does not claim to control Ableton unless a bridge confirms execution.

---

## Project Structure

```txt
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       └── button.tsx
├── lib/
│   ├── ai/
│   │   └── gateway.ts
│   └── utils.ts
├── App.tsx
├── App.css
├── data.ts
└── index.css
```

---

## Interaction Modes

```txt
Immediate Help  → quick workflow blockers
Deep Dive       → root-cause explanation
Workshop        → guided build/tutorial
Critique        → arrangement and mix review
```

---

## Roadmap

```txt
v0.3
├── Add Web Audio microphone analysis
├── Replace simulated visualizer with AnalyserNode
├── Add typed Ableton command schema
├── Add local bridge API route
├── Add Supabase memory/session persistence
└── Add Max for Live Hermes Link docs
```

---

## License

MIT
