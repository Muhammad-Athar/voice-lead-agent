"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GlowButton, HoverCard, Reveal } from "./motion";

/* ───────────── Integrations marquee ───────────── */
const LOGOS = ["Vapi", "Google Gemini", "Deepgram", "n8n", "HubSpot", "Google Calendar", "Google Sheets", "Slack", "Gmail", "Next.js", "Vercel", "Oracle Cloud"];
export function Marquee() {
  const items = [...LOGOS, ...LOGOS];
  return (
    <div className="marquee relative mx-auto max-w-6xl overflow-hidden px-6 py-6" style={{ maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }}>
      <div className="marquee-track flex w-max gap-3">
        {items.map((l, i) => (
          <span key={i} className="glass whitespace-nowrap rounded-full px-4 py-2 text-sm text-white/70">{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Sample call transcript + extracted JSON ───────────── */
const TRANSCRIPT: { who: "Ava" | "Caller"; text: string }[] = [
  { who: "Ava", text: "Hi, thanks for calling Northstar Digital, this is Ava. Who am I speaking with?" },
  { who: "Caller", text: "My name is Sarah." },
  { who: "Ava", text: "Hi Sarah, great to meet you. What's the name of your company?" },
  { who: "Caller", text: "Bloom Bakery." },
  { who: "Ava", text: "And what can we help you build — a website, chatbot, automation, or something else?" },
  { who: "Caller", text: "A chatbot for our website to take orders." },
  { who: "Ava", text: "Sounds great. What's your rough budget — under 2k, 2 to 10k, or over?" },
  { who: "Caller", text: "It's around five thousand." },
  { who: "Ava", text: "Perfect. And what's your timeline? ASAP, this quarter, or just exploring?" },
  { who: "Caller", text: "I need it as soon as possible." },
  { who: "Ava", text: "Are you the decision-maker for this project?" },
  { who: "Caller", text: "Yes, I am." },
  { who: "Ava", text: "Let me check the calendar, one moment… I have Tuesday at 10 or Wednesday at 11, Eastern. Which works?" },
  { who: "Caller", text: "Tuesday at 10." },
  { who: "Ava", text: "Booking that for you now… Done — Tuesday at 10 AM Eastern, invite on its way. Thanks Sarah, have a great day!" },
];
const EXTRACTED = `{
  "name": "Sarah",
  "company": "Bloom Bakery",
  "need": "chatbot",
  "need_details": "Order-taking chatbot for the website",
  "budget_band": "2k_to_10k",
  "timeline": "asap",
  "decision_maker": true,
  "email": "sarah@bloombakery.com",
  "booking_confirmed": true,
  "booked_slot": "2026-09-15T14:00:00Z",
  "not_a_fit": false
}
// + Gemini scoring in n8n
{ "score": 80, "tier": "hot",
  "next_action": "Confirm Tuesday and send a scoping doc." }`;

export function SampleCall() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal><p className="text-xs uppercase tracking-[0.3em] text-white/50">A real call, end to end</p></Reveal>
      <Reveal delay={1}><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Two minutes of conversation becomes structured, scored data.</h2></Reveal>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal delay={2}>
          <div className="glass flex h-[460px] flex-col gap-2 overflow-y-auto rounded-3xl p-6">
            {TRANSCRIPT.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: m.who === "Ava" ? -16 : 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-snug ${m.who === "Ava" ? "self-start bg-gradient-to-r from-accent/30 to-accent-2/20" : "self-end bg-white/10"}`}>
                <span className="mr-2 text-[10px] uppercase tracking-wider text-white/50">{m.who}</span>{m.text}
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={3}>
          <div className="glass h-[460px] overflow-hidden rounded-3xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-xs text-white/50">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 font-mono">call.analysis.structuredData</span>
            </div>
            <pre className="h-full overflow-auto p-5 font-mono text-[12.5px] leading-relaxed text-accent-2/90">{EXTRACTED}</pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Before / after ───────────── */
const BEFORE = ["Calls go to voicemail after hours — most never call back", "Someone types notes into the CRM (or doesn't)", "Back-and-forth emails to find a meeting time", "Sales reps qualify tyre-kickers by hand", "No record of what the caller actually said"];
const AFTER = ["Answered on the first ring, 24/7, phone or web", "Structured lead in HubSpot before the rep looks up", "Meeting booked mid-call on the live calendar", "Every lead scored 0–100 with a next action", "Full transcript, summary and recording attached"];
export function Comparison() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <Reveal><p className="text-xs uppercase tracking-[0.3em] text-white/50">Before / after</p></Reveal>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Reveal delay={1}>
          <div className="glass h-full rounded-3xl p-7">
            <h3 className="text-lg font-semibold text-white/70">Without Ava</h3>
            <ul className="mt-4 space-y-3">
              {BEFORE.map((t) => <li key={t} className="flex gap-3 text-sm text-white/55"><span className="mt-0.5 text-red-400/80">✕</span>{t}</li>)}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={2}>
          <div className="relative h-full overflow-hidden rounded-3xl p-[1px]" style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}>
            <div className="h-full rounded-[23px] bg-[#0b0b12] p-7">
              <h3 className="text-lg font-semibold">With Ava</h3>
              <ul className="mt-4 space-y-3">
                {AFTER.map((t) => <li key={t} className="flex gap-3 text-sm text-white/85"><span className="mt-0.5 text-emerald-400">✓</span>{t}</li>)}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
const FAQ = [
  ["Can it use my own phone number?", "Yes. Vapi imports numbers from Twilio, Telnyx and others, or provides free US numbers. Existing lines can be forwarded to Ava after hours or on overflow."],
  ["Which CRM and calendar can it connect to?", "This demo uses HubSpot and Google Calendar, but the n8n layer swaps in Pipedrive, Salesforce, GoHighLevel, Calendly, Cal.com, Outlook and hundreds of other apps without touching the voice side."],
  ["What happens if a tool or API is down?", "Ava keeps the conversation going and tells the caller the team will email time options. The post-call pipeline retries and falls back to rules-based scoring, so no lead is lost."],
  ["Can the script and voice be changed?", "Everything — persona, questions, qualification rules, voice, language — is configuration. Non-English callers and multiple assistants per number are supported."],
  ["What does it cost to run?", "Roughly $0.07 per call-minute on Vapi (speech + model), so a typical two-minute qualification costs about $0.14. n8n is self-hosted for free; the CRM and calendar tiers used here are free."],
  ["Is caller data safe?", "Calls run over Vapi's infrastructure; transcripts and structured data go only to the systems you connect. Recordings can be disabled and data retention configured per assistant."],
];
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <Reveal><p className="text-center text-xs uppercase tracking-[0.3em] text-white/50">FAQ</p></Reveal>
      <div className="mt-6 space-y-3">
        {FAQ.map(([q, a], i) => (
          <Reveal key={q} delay={i * 0.5}>
            <div className="glass overflow-hidden rounded-2xl">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium">
                {q}
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-xl leading-none text-accent-2">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    <p className="px-6 pb-5 text-sm leading-relaxed text-white/60">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────── CTA band ───────────── */
export function CtaBand({ phoneDisplay, phoneE164 }: { phoneDisplay: string; phoneE164: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] p-[1px]" style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}>
          <div className="relative rounded-[31px] bg-[#0b0b12] px-8 py-14 text-center">
            <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-accent/30 blur-[100px]" />
            <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">Hear it for yourself.</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/60">Start a browser call or dial the demo line. Pretend you need a website, a chatbot or an automation — Ava takes it from there.</p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <GlowButton href="#demo">🎙 Start a browser call</GlowButton>
              {phoneE164 && <a href={`tel:${phoneE164}`} className="glass rounded-full px-7 py-3.5 text-sm font-semibold">📞 {phoneDisplay}</a>}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────── How it works ───────────── */
const STEPS = [
  { n: "01", t: "Answers instantly", d: "Every inbound call — phone or website — is picked up on the first ring by Ava, 24/7.", icon: "📞" },
  { n: "02", t: "Qualifies naturally", d: "One question at a time: what they need, budget band, timeline, and whether they can sign off.", icon: "💬" },
  { n: "03", t: "Books the meeting", d: "Mid-call she checks the real sales calendar, offers two open slots and sends the invite.", icon: "📅" },
  { n: "04", t: "Hands off a scored lead", d: "Seconds after hang-up: AI score, summary and next action land in HubSpot, Sheets, Slack and email.", icon: "🚀" },
];
export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal><p className="text-xs uppercase tracking-[0.3em] text-white/50">How it works</p></Reveal>
      <div className="mt-6 grid gap-5 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i}>
            <HoverCard className="h-full">
              <div className="flex items-center justify-between"><span className="text-2xl">{s.icon}</span><span className="font-mono text-xs text-accent-2/80">{s.n}</span></div>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.d}</p>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
