# Alic3X Ableton Assistant — implementation design
Date: 2026-10-17
Repository: sterl27/ableton-live-coach-dashboard
Inspected master tree: 390e9fab7959f1e80ceea8451b222450767a9566

## Outcome
A compact conversational companion for Ableton Live 12 Suite. Ableton remains the DAW. The assistant reads available session state and performs a deliberately small set of verified actions. Keep the existing repository and Next.js app. Do not combine VIP portals, rebuild the DAW, add vector storage, or migrate to a new monorepo.

## Observed baseline
src/App.tsx has streaming coach chat, decorative animated bars, a voice toggle without capture, hardcoded audio parameters, and simulated CPU usage. src/app/api/chat/route.ts streams general coaching without tool execution. main.py only checks a database connection. ABLETON_BRIDGE_URL is explicitly reserved for future use. These are not implemented DAW capabilities.

## Deployment decision
Use the existing Next.js application for the web UI and server-side model credentials. Run a companion service on the same computer as Ableton. A hosted Next.js server cannot address the user's localhost. The initial reliable control release runs Next.js and its companion locally on one machine. A hosted coaching page may be published separately, but must show session control unavailable until a separately authenticated relay transport exists. Do not expose the OSC socket or local HTTP port publicly to make hosting work.

A relay is deferred: it adds authentication, tenancy and connectivity complexity before the local execution contract is proven. This trades immediate remote control for a verifiable first release. Do not describe hosted coaching as completed DAW control.

## Interface
One responsive chat surface with collapsible session context. Header states: not configured, connecting, connected, disconnected, and error. Connected requires a successful Live query, not merely an HTTP service responding. Show snapshot age, current tempo, available track names and playback state only when reported. Remove decorative meters presented as measurements and the nonfunctional microphone toggle. Preserve text chat, retry, cancellation and readable errors. Never fabricate a session in production. Any demonstration fixture is explicitly marked demo.

## Local adapter
Use one AbletonOSC adapter, with its supported messages verified against the upstream implementation before coding. Ports are configuration, not assumptions copied from the Gemini conversation. Bind the companion HTTP listener to loopback. Require a randomly generated pairing credential; keep it out of URLs, logs and chat context. Enforce an exact origin allowlist, host validation and request body limits. No wildcard CORS, arbitrary OSC addresses, arbitrary file paths, shell execution or model-generated Python.

Serialize requests whose OSC responses cannot be correlated safely. Apply deadlines, discard stale replies, and invalidate connection state on timeout. A transport response must be checked for the expected address, argument shape and target. Queue writes behind reads so verification is not confused by another command. Do not automatically retry a write after an uncertain outcome.

## First capabilities
1. Read session summary: tempo, playback, available tracks, track identifiers, mute and volume where exposed.
2. Start and stop playback.
3. Set tempo within validated Live-supported bounds.
4. Mute or unmute a uniquely resolved track.
5. Set a uniquely resolved track's volume using the adapter's documented parameter representation.

Resolve track names to exact current identifiers. Duplicate names require a choice; never choose the first silently. Refresh the session before a write and reject a changed target. Relative dB changes are enabled only after the volume representation and conversion are established from authoritative implementation evidence. Until then, offer supported absolute values or explain the limitation. An implementation may reduce this capability set if the upstream adapter cannot verify it reliably.

## Command lifecycle
Each action receives a command ID and typed validated arguments. Record requested action, resolved target, observed before state, dispatch time and verification result. Distinguish proposed, executing, verified, failed and uncertain. The word completed is reserved for a matching readback. A timeout after sending means uncertain, not failed and safe to retry. Session changes invalidate outstanding proposals.

For reversible setters, retain the observed before value. Offer restore only after checking the current value still matches this action's verified result; otherwise ask the user to resolve the conflict. Do not advertise generic Ableton undo unless supported by the bridge. Delete, overwrite, record, import, arrangement generation and destructive device operations are outside this release.

## AI boundary
The model proposes typed actions; trusted application code validates and executes them. Session data is untrusted context, not instructions. Exclude pairing and provider credentials. The browser handles no model provider secret. Text coaching remains available without a bridge, with a clear statement that the session is unavailable. Chat must not claim audio analysis unless an actual recording or uploaded file has been analyzed.

Validate incoming chat shape and size. Handle missing model configuration, upstream errors and cancellation explicitly. Preserve the repository's current provider integration until compatibility is checked; do not invent SDK methods.

## Audio
Audio capture and librosa analysis are a later increment. Session metadata is not audio. The initial assistant can explain workflow but cannot diagnose a mix from track names or decorative meters.

## Verification and release
Automated adapter tests use an explicitly identified fake transport to verify timeouts, stale replies, duplicate names, bounds, incorrect readback, disconnected sessions, authorization, origin rejection and no automatic write retries. UI checks cover small screens, keyboard operation, busy state, errors and actual connection transitions. Run the production build and type checks.

A real-device acceptance test is required on the user's Live 12 Suite machine: connect, read actual session; start and stop; change tempo and read it back; mute and restore a selected track; disconnect and verify controls stop claiming connection. Tests on a fake transport do not satisfy this gate.

Publish only after build checks pass. Report hosted coaching and local session-control acceptance separately. Deployment success is not evidence of Live control. A release is not fully accepted until the real-device test passes.

## Implementation order
1. Remove misleading UI and introduce typed connection and action states.
2. Implement local adapter, pairing checks and command tests.
3. Add tool orchestration and session context.
4. Connect compact widget and verify errors and responsiveness.
5. Build and publish a coaching deployment; deliver companion setup.
6. Perform real-device acceptance and report remaining limits.
