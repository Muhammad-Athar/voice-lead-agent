import CallWidget from "@/components/CallWidget";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "";
const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 ?? "";
const GITHUB = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/Muhammad-Athar";

const STACK = [
  ["Vapi", "voice orchestration, phone + web"],
  ["Gemini 3.5 Flash", "conversation + lead scoring"],
  ["Deepgram Nova-3", "speech-to-text"],
  ["n8n (self-hosted)", "tools + post-call pipeline"],
  ["Google Calendar", "availability + booking"],
  ["HubSpot", "CRM contact + custom properties"],
  ["Google Sheets", "lead ledger"],
  ["Slack + Gmail", "instant alerts"],
];

const STEPS = [
  { n: "01", t: "Answers instantly", d: "Every inbound call — phone or website — is picked up on the first ring by Ava, 24/7." },
  { n: "02", t: "Qualifies naturally", d: "One question at a time: what they need, budget band, timeline, and whether they can sign off." },
  { n: "03", t: "Books the meeting", d: "Mid-call she checks the real sales calendar, offers two open slots and sends the invite." },
  { n: "04", t: "Hands off a scored lead", d: "Seconds after hang-up: AI score, summary and next action land in HubSpot, Sheets, Slack and email." },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black">✦</span>
          <span className="font-semibold tracking-tight">Northstar Digital</span>
          <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/50">demo</span>
        </div>
        <a href={GITHUB} target="_blank" rel="noreferrer" className="text-sm text-white/60 transition hover:text-white">Source on GitHub →</a>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">Voice AI lead qualification</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Your inbound leads, answered in <span className="text-amber-300">one ring</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/65">
          Meet Ava — an AI intake agent that qualifies every caller, books the discovery call on your real calendar, and drops a scored lead into your CRM. No missed calls, no data entry.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#demo" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300">🎙 Try it in your browser</a>
          {PHONE_E164 && (
            <a href={`tel:${PHONE_E164}`} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40">
              📞 Call {PHONE_DISPLAY}
            </a>
          )}
        </div>
        <p className="mt-3 text-xs text-white/40">US number · inbound only · demo persona &ldquo;Northstar Digital&rdquo;, a fictional agency</p>
      </section>

      <section id="demo" className="mx-auto max-w-6xl px-6 py-8">
        <CallWidget publicKey={PUBLIC_KEY} assistantId={ASSISTANT_ID} />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="font-mono text-xs text-amber-300/80">{s.n}</p>
              <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:grid-cols-3">
          {[["~2 min", "average call to qualify + book"], ["0", "human touches before the lead is in the CRM"], ["$0.07", "per minute, all-in voice cost"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-3xl font-semibold text-amber-300">{v}</p>
              <p className="mt-1 text-sm text-white/60">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Under the hood</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map(([name, role]) => (
            <div key={name} className="rounded-xl border border-white/10 px-4 py-3">
              <p className="font-medium">{name}</p>
              <p className="text-xs text-white/50">{role}</p>
            </div>
          ))}
        </div>
        <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-white/70">{`caller ──▶ Vapi (Ava) ──tool-calls──▶ n8n ──▶ Google Calendar (free/busy, book)
                │
                └── end-of-call report ──▶ n8n ──▶ Gemini score ──▶ HubSpot · Sheets · Slack · Gmail`}</pre>
      </section>

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-8 text-sm text-white/50">
        Portfolio build by <a href={GITHUB} className="text-white/80 hover:text-white" target="_blank" rel="noreferrer">Muhammad Athar</a> — AI automation engineer (n8n · voice agents · RAG chatbots · Next.js). Northstar Digital is a fictional company used for the demo.
      </footer>
    </main>
  );
}
