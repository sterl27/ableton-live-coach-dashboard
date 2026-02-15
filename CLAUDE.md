# CLAUDE.md

This file provides guidance for AI assistants working with the Ableton Live Coach Dashboard codebase.

## Project Overview

An interactive dashboard UI inspired by Ableton Live 12 Suite, designed as a coaching interface for AI-powered music production assistance using Gemini 2.5 Flash Native Audio. The app is a single-page React application with a three-column layout: expertise sidebar, central chat hub, and controls sidebar.

## Tech Stack

- **Framework**: React 18 + TypeScript 5.6
- **Build tool**: Vite 6
- **Animation**: Framer Motion 12
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with CSS custom properties (design tokens)
- **Module system**: ESM (`"type": "module"`)

## Common Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build (tsc -b && vite build)
npm run lint      # Run ESLint on the project
npm run preview   # Preview production build locally
```

**Build command is `npm run build`** — this runs TypeScript compilation first (`tsc -b`), then Vite build. Both must pass.

## Project Structure

```
src/
├── main.tsx          # React entry point (StrictMode + root render)
├── App.tsx           # Main application component (all UI logic)
├── App.css           # Component styles (370 lines)
├── index.css         # Global styles and CSS design tokens
├── data.ts           # Constant data (expertise areas, modes, initial messages)
├── vite-env.d.ts     # Vite ambient type declarations
└── assets/
    └── react.svg     # React logo
public/
└── vite.svg          # Vite logo (favicon)
```

## Architecture

### Single-component design

The entire UI lives in `src/App.tsx` (~223 lines). There is no component decomposition, routing, or global state management. All state is local via `useState` hooks in the `App` component.

One nested component exists: `Visualizer({ isActive })` is defined inline within `App.tsx`.

### State variables (all in App.tsx)

| Variable | Type | Purpose |
|----------|------|---------|
| `messages` | `Array<{role, text}>` | Chat message history |
| `inputValue` | `string` | Current text input value |
| `isVoiceActive` | `boolean` | Voice recording toggle |
| `selectedMode` | `string` | Active interaction mode (`'immediate'`, `'deep-dive'`, `'workshop'`, `'critique'`) |

### Layout structure

```
Header (40px fixed)
├── Logo + branding
├── Status indicators (Stream Live, Voice Active)
└── Settings controls

Main (flex: 1)
├── Sidebar-Left (280px) — 10 expertise areas
├── Interaction Hub (flex: 1) — Chat + visualizer + input
└── Sidebar-Right (280px) — Modes, audio params, playback

Footer (28px fixed)
├── Connection status
└── CPU meter
```

### Data layer (`src/data.ts`)

Exports three constants:
- `EXPERTISE_AREAS` — Array of 10 DAW expertise categories (id, title, description)
- `INTERACTION_MODES` — Array of 4 modes (id, label, icon)
- `INITIAL_MESSAGES` — Array with 1 greeting message from the assistant

### Chat simulation

`handleSend()` appends a user message, then uses `setTimeout` (1 second delay) to append a simulated assistant response. There is no real API integration yet.

## Styling Conventions

### CSS design tokens (defined in `src/index.css` `:root`)

**Backgrounds:**
- `--bg-app`: `#121212` — Main app background
- `--bg-panel`: `#242424` — Panel/card backgrounds
- `--bg-header`: `#2b2b2b` — Header background
- `--bg-sidebar`: `#1e1e1e` — Sidebar background
- `--bg-active`: `#3b3b3b` — Active/hover state background

**Accents:**
- `--accent-primary`: `#efdb5e` — Ableton yellow (primary brand color)
- `--accent-secondary`: `#5ec0ef` — Blue accent
- `--accent-success`: `#5eef8c` — Green accent

**Text:**
- `--text-primary`: `#e0e0e0`
- `--text-secondary`: `#9a9a9a`
- `--text-muted`: `#666666`

### Naming conventions

- CSS classes: `kebab-case` (e.g., `.chat-viewport`, `.mode-btn`)
- Variants use compound selectors: `.message.assistant`, `.mode-btn.selected`
- Layout uses flexbox throughout; no CSS Grid
- Transitions: `all 0.2s` is the standard transition
- Border-radius: 4px for small elements, 8px for larger panels

### Animations

- CSS `@keyframes pulse` and `@keyframes glow` for status indicators
- Framer Motion for chat message entrance animations and visualizer bars

## TypeScript Configuration

- **Strict mode** enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Target: ES2020
- JSX: `react-jsx` (automatic transform)
- Module resolution: `bundler`
- Types are mostly inferred; no explicit interface exports in the current codebase

## ESLint Configuration

- Flat config format (`eslint.config.js`)
- Extends: `@eslint/js` recommended + `typescript-eslint` recommended
- Plugins: `react-hooks` (recommended rules), `react-refresh` (warns on non-component exports)
- Ignores: `dist/` directory

## Code Conventions

- **Naming**: `camelCase` for variables/functions, `PascalCase` for components, `UPPER_SNAKE_CASE` for exported constants
- **Imports**: React hooks first, then Lucide icons, then Framer Motion, then local data, then CSS
- **No custom hooks** — all logic is inline
- **No external state management** — local `useState` only
- **No routing** — single-page app with no navigation
- **No testing framework** — no test files or test dependencies exist
- **No environment variables** or `.env` files

## Key Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM rendering |
| `framer-motion` | ^12.27.0 | Animation (message entrances, visualizer bars) |
| `lucide-react` | ^0.562.0 | Icon components (19 icons used in App.tsx) |

## Working with This Codebase

### Adding new features

- Currently all UI is in `App.tsx`. New features can be added there or extracted into new component files under `src/`.
- Static data (lists, configs) should go in `data.ts`.
- New CSS goes in `App.css` for component styles or `index.css` for design tokens/global styles.
- Always use the existing CSS custom properties rather than hardcoding colors.

### Before committing

1. Run `npm run build` to verify TypeScript compiles and Vite builds successfully.
2. Run `npm run lint` to check for ESLint violations.

### Things to watch for

- The `Visualizer` component renders 40 animated bars — be mindful of performance when modifying animation logic.
- Chat messages use array index as key (potential issue if messages are reordered or removed).
- The simulated chat response is hardcoded in `handleSend()` — this will need replacement when integrating a real API.
- No error boundaries or error handling exist currently.
