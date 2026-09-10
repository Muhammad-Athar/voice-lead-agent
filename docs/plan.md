# Voice AI Lead Qualification — Phase 1 plan (2026-09-10)

## Goal
Portfolio piece: an inbound voice agent ("Ava" at fictional agency "Northstar Digital") that
answers phone **and** browser calls, qualifies the lead (name, company, need, budget band,
timeline, decision-maker), checks Google Calendar availability mid-call, books a slot, and
after the call scores the lead with Gemini and pushes it to HubSpot + Sheets + Slack + email.

Metric line for Upwork: "qualifies and books a lead in a ~2-minute call, zero human touch."

## Architecture
```
Landing page (Next.js / Vercel) ── @vapi-ai/web ──▶ Vapi assistant ◀── free US phone number
                                                    │  LLM: Gemini via BYOK (free)
                                                    │  Structured Outputs: lead fields
                                   tool-calls ──────┤  check_availability / book_slot
                                                    ▼
                                              n8n (public)
                                               ├─ WF-1 tools:   webhook → Calendar free/busy → slots | create event
                                               └─ WF-2 post-call: end-of-call-report → Gemini score → HubSpot
                                                                  → Sheets ledger → Slack + email alert
```
Call works even if n8n is down (assistant degrades gracefully on tool failure).

## Constraints / facts (verified Sept 2026)
- Vapi: account shows **5 credits** (≈30–40 test minutes). No card. Free US numbers. `maxDurationSeconds` = 180 on the assistant.
- BYOK Gemini key in Vapi → LLM cost 0. STT/TTS still consume credits.
- HubSpot free: private-app token; ≤10 custom properties (we use 5: lead_score, budget_band, timeline, need_summary, call_recording_url).
- Calendar: existing ExpenseFlow Google OAuth client + Calendar scope.
- n8n hosting: Oracle Always-Free first; fallback n8n Cloud 14-day trial (no card).

## Steps
| # | Step | Who | Status |
|---|------|-----|--------|
| 1 | Vapi account, API keys + Gemini BYOK into `.env` / Integrations | user | done |
| 2 | Create assistant via API (`vapi/assistant.json`): prompt, Gemini model, voice, structured outputs, max duration | Claude | done |
| 3 | Test web call from dashboard ("Test" → talk) — verify transcript + structured output in Logs | user+Claude | done |
| 4 | Google Cloud: enable Calendar API, add scope; n8n Calendar credential | user | done |
| 5 | HubSpot free account → private app token → 5 custom properties | user | done |
| 6 | WF-2 post-call workflow in local n8n, tested with a replayed end-of-call payload | Claude | done |
| 7 | WF-1 tool workflow (availability + booking); register tools on assistant | Claude | done |
| 8 | Public n8n hosting (Oracle or n8n Cloud); import workflows; set Server URL on assistant | user+Claude | done |
| 9 | Free US phone number → attach assistant; real phone test call | user+Claude | done |
| 10 | Next.js landing page with web-call button; deploy to Vercel | Claude, user connects Vercel | done |
| 11 | README, scrubbed workflow exports, 6 screenshots, 60–90 s video, portfolio copy | Claude + user records | |
| 12 | GitHub push (Muhammad-Athar/voice-lead-agent), add to Upwork profile | user | |

## Conversation design (Ava)
1. Greeting + purpose ("I can get you set up with the right person — a few quick questions").
2. Name → company → what they need (website / automation / AI / other).
3. Budget band (under 2k / 2–10k / 10k+) → timeline (ASAP / this quarter / exploring).
4. Are you the decision-maker?
5. Offer 2 slots from `check_availability` → confirm → `book_slot` → read back date/time, ask for email.
6. Close. Tool failure → "I'll have the team email you two times to choose from."
