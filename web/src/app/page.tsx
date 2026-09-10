import CallWidget from "@/components/CallWidget";
import Hero from "@/components/Hero";
import { Background, CountUp, HoverCard, Reveal } from "@/components/motion";
import { Comparison, CtaBand, Faq, HowItWorks, Marquee, SampleCall } from "@/components/Sections";

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

export default function Home() {
  return (
    <main className="relative">
      <Background />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07070d]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-white">✦</span>
            <span className="font-semibold tracking-tight">Northstar Digital</span>
            <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/50">demo</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <a href="#demo" className="transition hover:text-white">Live demo</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#stack" className="transition hover:text-white">Under the hood</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
            {GITHUB && <a href={GITHUB} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40 hover:text-white">GitHub ↗</a>}
          </nav>
        </div>
      </header>

      <Hero phoneDisplay={PHONE_DISPLAY} phoneE164={PHONE_E164} />
      <Marquee />

      <section id="demo" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-10">
        <Reveal><CallWidget publicKey={PUBLIC_KEY} assistantId={ASSISTANT_ID} /></Reveal>
      </section>

      <div id="how" className="scroll-mt-24"><HowItWorks /></div>
      <SampleCall />
      <Comparison />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <div className="glass grid gap-6 rounded-3xl p-8 sm:grid-cols-3">
            <Stat value={<CountUp value={2} prefix="~" suffix=" min" />} label="average call to qualify and book" />
            <Stat value={<CountUp value={0} />} label="human touches before the lead is in the CRM" />
            <Stat value={<CountUp value={0.07} prefix="$" decimals={2} />} label="per minute, all-in voice cost" />
          </div>
        </Reveal>
      </section>

      <section id="stack" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
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
          <pre className="glass mt-6 overflow-x-auto rounded-2xl p-5 font-mono text-xs leading-relaxed text-white/70">{`caller ──▶ Vapi (Ava) ──tool-calls──▶ n8n ──▶ Google Calendar (free/busy · book · invite)
                │
                └── end-of-call report ──▶ n8n ──▶ Gemini score ──▶ HubSpot · Sheets · Slack · Gmail`}</pre>
        </Reveal>
      </section>

      <div id="faq" className="scroll-mt-24"><Faq /></div>
      <CtaBand phoneDisplay={PHONE_DISPLAY} phoneE164={PHONE_E164} />

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-8 text-xs text-white/40">
        Northstar Digital is a fictional company created for this demo. Demo calls may be recorded and transcribed.
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <p className="grad-text text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-white/60">{label}</p>
    </div>
  );
}
