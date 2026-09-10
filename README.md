# Ava — Voice AI Lead Qualification

Inbound voice agent that qualifies sales leads in ~2 minutes, books discovery calls, and hands off scored leads to your CRM — all without human intervention.

## Live Demo

**Live demo:** https://voice-lead-agent.vercel.app  
**Demo phone:** +1 (213) 451-4180 (US inbound, 3-minute cap)

*Northstar Digital is a fictional company created for this demo.*

---

## What It Does

- **Answers instantly** — every inbound call (phone or browser) is picked up on the first ring, 24/7
- **Qualifies naturally** — one question at a time: name, company, what you need (website / chatbot / automation / other), budget band, timeline, decision-maker status
- **Books mid-call** — checks the real sales calendar, offers two open slots in plain English, sends a Google Calendar invite before the call ends
- **Hands off scored leads** — within seconds of hang-up: Gemini scores the lead 0–100 with a tier (hot/warm/cold), one-sentence reasoning, and a next action that lands in HubSpot, Google Sheets, Slack, and email

---

## How a Call Flows

1. Caller dials the US number or clicks the demo button on the landing page
2. Vapi connects to Ava (Gemini 3.5 Flash, Deepgram Nova-3 STT, Vapi "Clara" voice)
3. Ava asks qualifying questions one at a time, collects responses
4. After collecting email, Ava calls `check_availability` → n8n reads Google Calendar free/busy for next 5 business days (10:00–17:00 ET)
5. Ava offers two slots; caller picks one
6. Ava calls `book_slot` → n8n creates a 20-minute Google Calendar event, sends invite to caller's email
7. Ava confirms details and ends the call
8. Vapi sends `end-of-call-report` webhook to n8n with structured data (name, need, budget, timeline, transcript, etc.)
9. n8n: Gemini scores the lead → HubSpot contact upsert (custom properties: lead_score, lead_tier, budget_band, project_timeline, call_summary) in parallel with Google Sheets row, Slack alert, and email digest with transcript

**Graceful degradation:** If a tool fails, Ava says "I'll have the team email you two time options" and the call continues; the post-call pipeline retries scoring up to 3 times with a fallback rule-based score so the pipeline never stalls.

---

## Architecture

```
Landing Page (Next.js / Vercel) ── @vapi-ai/web SDK ──▶ Vapi Assistant ◀── Free US Phone
                                                      │  LLM: Gemini 3.5 Flash
                                                      │  STT: Deepgram Nova-3
                                  Tool Calls (REST) ──┤  TTS: Vapi Clara
                                                      ▼
                                             n8n (Self-Hosted)
                                          ├─ WF-1: Calendar Availability + Booking
                                          └─ WF-2: Post-Call Scoring + CRM Sync
```

| Component | Purpose | Tech |
|-----------|---------|------|
| Voice | Phone + web inbound | Vapi |
| LLM | Conversation, structured extraction, lead scoring | Google Gemini 3.5 Flash |
| STT | Live transcription | Deepgram Nova-3 |
| Automation | Tool calls + webhooks + data pipeline | n8n 2.33 (Docker Compose) |
| Calendar | Free/busy + booking | Google Calendar API |
| CRM | Lead storage + scoring + custom fields | HubSpot (free tier) |
| Ledger | Lead history | Google Sheets |
| Alerts | Instant notification | Slack + Gmail HTML |
| Hosting (backend) | n8n + Caddy reverse proxy | Oracle Cloud Always-Free VM (Ubuntu 24.04) |
| Hosting (frontend) | Landing page + browser call widget | Next.js 16, Tailwind, Framer Motion on Vercel |

---

## What Makes It Production-Grade

- **Structured outputs with schema** — Vapi's analysis extracts lead fields into a JSON schema; summary + success/fail evaluation included
- **Tool timeouts + spoken fallbacks** — 20-second timeout on calendar checks and booking; if failed, Ava says the team will email two times
- **Retry + fallback scoring** — n8n retries Gemini scoring up to 3 times; if all fail, a rule-based score (from budget band, timeline and decision-maker) kicks in so leads never drop
- **Idempotent CRM upsert** — HubSpot contacts keyed by email; updates never create duplicates
- **3-minute call cap** — `maxDurationSeconds: 180` prevents runaway calls
- **Secrets scrubbed** — workflow exports contain `__PLACEHOLDER__` for all credentials; `.env` keys never committed
- **One-command deploy** — `scripts/deploy-workflows.sh` substitutes placeholders, SSHes to the Oracle VM, imports workflows, and restarts n8n

---

## Repository Layout

```
.
├── vapi/
│   ├── assistant.json          # Ava's system prompt, tools, structured outputs schema, success rubric
│   └── tools.json              # check_availability & book_slot function definitions
├── workflows/
│   ├── voice-lead-calendar-tools.json    # n8n WF-1: Calendar availability + booking
│   └── voice-lead-post-call.json         # n8n WF-2: Score lead, upsert HubSpot, Sheets, Slack, email
├── web/                         # Next.js 16 landing page + web call widget
│   ├── src/app/page.tsx        # Hero + call widget + stack + how-it-works
│   └── .env.example
├── deploy/
│   ├── docker-compose.yml      # n8n 2.33.3 + Caddy (sslip.io hostname)
│   ├── Caddyfile               # Auto Let's Encrypt, reverse proxy
│   └── README.md
├── scripts/
│   ├── vapi.py                 # Admin CLI: register-gemini, upsert-assistant, register-tools, enable-booking, list-calls
│   ├── deploy-workflows.sh     # Push workflows to Oracle VM, substitute placeholders, restart n8n
│   ├── n8n-import.sh           # Local n8n workflow import
│   ├── n8n-export.sh           # Workflow export with secrets stripped
│   └── n8n-last-exec.py        # Debug: fetch last workflow execution logs
├── test/
│   ├── fixtures/
│   │   ├── end-of-call-report.json     # Sample Vapi webhook payload
│   │   ├── tool-check-availability.json
│   │   └── tool-book-slot.json
│   └── web-call.html           # Simple page to test browser call locally
├── docs/
│   └── plan.md                 # Phase-1 architecture and constraints
└── .env                        # Secrets: VAPI_PRIVATE_KEY, GEMINI_API_KEY, HUBSPOT_*, SLACK_WEBHOOK_URL, etc. (not committed)
```

---

## Running It Yourself

### Prerequisites

- Vapi account with free US phone number + API keys (VAPI_PRIVATE_KEY, VAPI_PUBLIC_KEY)
- Google Cloud project with Calendar API enabled, Gemini API key
- HubSpot free account with private-app token
- Slack workspace with a webhook URL (optional, for alerts)
- n8n (local dev or hosted instance)
- Oracle Cloud Always-Free VM (or any VPS) for production deployment
- Vercel account for landing page (optional)

### Setup Steps

1. **Copy `.env.example` to `.env`** and fill in the keys:
   ```bash
   VAPI_PRIVATE_KEY=...
   VAPI_PUBLIC_KEY=...
   GEMINI_API_KEY=...
   HUBSPOT_PRIVATE_APP_TOKEN=...
   SLACK_WEBHOOK_URL=...
   SALES_EMAIL=...
   SHEET_ID=...
   SALES_CALENDAR_ID=primary
   HUBSPOT_CRED_ID=...
   GCAL_CRED_ID=...
   N8N_WEBHOOK_BASE=https://n8n.your-domain.com/webhook
   ```

2. **Create the assistant in Vapi** from `vapi/assistant.json`:
   ```bash
   python3 scripts/vapi.py upsert-assistant
   ```

3. **Set up n8n locally** (or use Oracle VM with `deploy/docker-compose.yml`):
   ```bash
   docker compose -f deploy/docker-compose.yml up -d
   # Create credentials in n8n UI: Google Sheets, Google Calendar, Gmail, HubSpot, Gemini
   ```

4. **Import workflows**:
   ```bash
   scripts/n8n-import.sh  # local n8n
   # OR for production:
   scripts/deploy-workflows.sh  # SSH to Oracle VM, import, restart
   ```

5. **Register Vapi tools** and enable booking:
   ```bash
   python3 scripts/vapi.py register-tools
   python3 scripts/vapi.py enable-booking
   python3 scripts/vapi.py upsert-assistant
   ```

6. **Run the landing page**:
   ```bash
   cd web
   npm install
   cp .env.example .env.local  # fill in VAPI keys + assistant ID
   npm run dev
   ```

7. **Attach a phone number** to the assistant (Vapi dashboard → Phone Numbers, or `POST /phone-number` with `provider: "vapi"`) and test with a real call.

---

## Testing

- **Fixtures** in `test/fixtures/` contain sample payloads for end-of-call-report, check-availability, and book-slot
- **Local testing**: `scripts/n8n-last-exec.py` fetches the last execution logs from n8n to debug workflow failures
- **Web call test page**: `test/web-call.html` — open in a browser to test the call widget without deploying
- **Vapi logs**: Dashboard → Logs tab shows transcript, structured extraction, and cost per call

---

## Cost

- **Vapi**: ~$0.07 per call-minute all-in (STT + TTS + LLM overhead); typical call ~2 minutes = ~$0.14 per lead
- **Gemini API**: the in-call model is billed through Vapi; post-call scoring uses your own Gemini key (free tier; ~500 tokens per lead)
- **Google Calendar, Sheets, Gmail, OAuth**: Free tier (OAuth scopes only)
- **HubSpot**: Free tier (≤10 custom properties; this setup uses 5)
- **n8n**: Self-hosted on Oracle Always-Free VM (no cost) or n8n Cloud paid plans
- **Hosting**: Vercel (free tier for landing page), Oracle Always-Free VM (free tier)

**Bottom line**: ~$0.14 per qualified lead on Vapi alone; everything else free or self-hosted.

---

## License

MIT
