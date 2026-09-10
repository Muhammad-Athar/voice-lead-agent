# Upwork portfolio package — Ava (Voice AI Lead Qualification)

## Title (Upwork limit 70 chars)

```
Voice AI Agent That Qualifies Leads & Books Meetings (Vapi + n8n)
```

## Portfolio description (paste as-is)

```
Ava is an inbound voice agent that answers phone and website calls, qualifies the caller, books a discovery call on the sales team's real Google Calendar mid-conversation, and hands off a scored lead to the CRM — with zero human touches.

What happens on every call
• Ava answers on the first ring (US phone number or a "Talk to Ava" button on the website).
• She asks one question at a time: what they need, budget band, timeline, decision-maker, email.
• She calls a live tool to read the calendar, offers two open slots, books the one the caller picks and sends the invite.
• She closes the call herself.
• Seconds later, Gemini scores the lead 0–100 (hot / warm / cold) with a one-line reason and a next action, and the lead lands in HubSpot (custom properties), a Google Sheet, a Slack alert and an email digest with the full transcript.

Built with
Vapi (voice + phone), Gemini 3.5 Flash, Deepgram, n8n (self-hosted on Oracle Cloud with Docker + Caddy HTTPS), Google Calendar / Sheets / Gmail APIs, HubSpot API, Next.js + Framer Motion landing page on Vercel.

Production details clients care about
• Structured JSON extraction from every call (schema-enforced), plus summary and pass/fail evaluation.
• Tool timeouts with spoken fallbacks — a calendar outage never breaks the call.
• Retry + rules-based fallback scoring so no lead is dropped.
• Idempotent CRM upsert by email; 3-minute call cap; secrets scrubbed from all exports; one-command deploy.

Result: a lead is qualified, booked and in the CRM in about 2 minutes, at roughly $0.07 per call-minute.

Live demo: <VERCEL_URL>  ·  Demo line: +1 (213) 451-4180  ·  Code: https://github.com/Muhammad-Athar/voice-lead-agent
```

## Skills tags to attach
Voice AI · AI Agent Development · n8n · Automation · API Integration · Google Gemini · HubSpot · Next.js · Chatbot Development · Workflow Automation

## Screenshots (8, in this order — retina, 16:10, no browser chrome where possible)

1. **Landing hero** — the full hero with the glowing "Try it in your browser" button and phone CTA.
2. **Live call in progress** — waveform active, transcript showing 4–5 turns, "Behind the scenes" panel with steps 1–3 green. (Take mid-call while Ava is checking the calendar.)
3. **Vapi call log** — Vapi dashboard → Logs → the call → Analysis tab showing Structured Data JSON (name, need, budget_band, timeline, booking_confirmed=true) and the summary.
4. **n8n post-call workflow** — full canvas of "Voice Lead — Post-Call Pipeline" after a successful execution (all nodes green). Executions view is fine too.
5. **n8n calendar tools workflow** — canvas of "Voice Lead — Calendar Tools (Vapi)" with the Switch fanning into availability / booking.
6. **HubSpot contact** — the contact record with the "Voice Lead Qualification" property group visible: Lead Score, Lead Tier, Budget Band, Project Timeline, Call Summary.
7. **Slack alert** — the Block Kit card (🔥 HOT lead · 80/100 · name, need, budget, timeline, meeting, summary, next action).
8. **Google Calendar** — the booked "Discovery call — <name>" event with the invitee, next to the Gmail digest if it fits in one frame.

Nice-to-have 9: the Google Sheet "Leads" tab with 2–3 rows.

## 90-second demo video — shot list & voice-over

| t | Screen | Voice-over |
|---|---|---|
| 0–8 s | Landing page hero | "Every missed call is a lost lead. Ava answers inbound calls, qualifies the caller and books the meeting — automatically." |
| 8–40 s | Click "Start a call", real conversation (trim pauses): name → need → budget → timeline → email | "Here's a real call. Ava asks one thing at a time and adapts to what the caller says." |
| 40–55 s | Ava: "let me check the calendar" → offers two slots → caller picks → "booked" | "Mid-call she checks the live Google Calendar through n8n, offers two open slots, and books the one the caller picks." |
| 55–62 s | "Behind the scenes" panel all green, Ava hangs up | "She ends the call herself." |
| 62–75 s | n8n execution (all nodes green) → HubSpot contact with score 80 / hot | "Seconds later, Gemini scores the lead and n8n pushes it into HubSpot with the score, tier, budget and a summary…" |
| 75–85 s | Slack alert + email digest + calendar event | "…plus a Slack alert, an email digest with the transcript, and the calendar invite is already out." |
| 85–90 s | Landing page with phone number + GitHub link | "Phone or web, 24/7, about seven cents a minute. Code and live demo linked below." |

Recording tips: 1440×900 browser window, hide bookmarks bar, mute notifications, record the call audio from system output (Ava's voice) + mic; cut dead air between turns; keep the final cut under 95 s.

## One-line metric for the profile card
"Qualifies and books an inbound lead in a ~2-minute call — zero human touches, ~$0.14 per lead."
