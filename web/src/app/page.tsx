import CallWidget from "@/components/CallWidget";
import Hero from "@/components/Hero";
import { Background, CountUp, HoverCard, Reveal } from "@/components/motion";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "";
const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 ?? "";
const GITHUB = process.env.NEXT_PUBLIC_GITHUB_URL ?? "";

const STACK = [
  ["Vapi", "voice orchestration · phone + web"],
  ["Gemini 3.5 Flash", "conversation + lead scoring"],
  ["Deepgram Nova-3", "speech-to-text"],
  ["n8n (self-hosted)", "tool calls + post-call pipeline"],
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
    <main className="relative">
      <Background />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black">✦</span>
          <span className="font-semibold tracking-tight">Northstar Digital</span>
          <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/50">demo</span>
        </div>
        {GITHUB && <a href={GITHUB} target="_blank" rel="noreferrer" className="text-sm text-white/60 transition hover:text-white">Source on GitHub →</a>}
      </header>

      <Hero phoneDisplay={PHONE_DISPLAY} phoneE164={PHONE_E164} />

      <section id="demo" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-8">
        <Reveal><CallWidget publicKey={PUBLIC_KEY} assistantId={ASSISTANT_ID} /></Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal><p className="text-xs uppercase tracking-[0.3em] text-white/50">How it works</p></Reveal>
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i}>
              <HoverCard className="h-full">
                <p className="font-mono text-xs text-amber-300/80">{s.n}</p>
                <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.d}</p>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 sm:grid-cols-3">
            <Stat value={<CountUp value={2} prefix="~" suffix=" min" />} label="average call to qualify and book" />
            <Stat value={<CountUp value={0} />} label="human touches before the lead is in the CRM" />
            <Stat value={<CountUp value={0.07} prefix="$" decimals={2} />} label="per minute, all-in voice cost" />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal><p className="text-xs uppercase tracking-[0.3em] text-white/50">Under the hood</p></Reveal>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map(([name, role], i) => (
            <Reveal key={name} delay={i * 0.5}>
              <HoverCard className="!p-4">
                <p className="font-medium">{name}</p>
                <p className="text-xs text-white/50">{role}</p>
              </HoverCard>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-relaxed text-white/70">{`caller ──▶ Vapi (Ava) ──tool-calls──▶ n8n ──▶ Google Calendar (free/busy · book · invite)
                │
                └── end-of-call report ──▶ n8n ──▶ Gemini score ──▶ HubSpot · Sheets · Slack · Gmail`}</pre>
        </Reveal>
      </section>

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-8 text-xs text-white/40">
        Northstar Digital is a fictional company created for this demo. Demo calls may be recorded and transcribed.
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-semibold tracking-tight text-amber-300">{value}</p>
      <p className="mt-2 text-sm text-white/60">{label}</p>
    </div>
  );
}
