"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeUp, GlowButton } from "./motion";

const SCRIPT: { who: "ava" | "caller"; text: string }[] = [
  { who: "ava", text: "Hi, thanks for calling Northstar Digital, this is Ava. Who am I speaking with?" },
  { who: "caller", text: "Sarah, from Bloom Bakery." },
  { who: "ava", text: "Great to meet you, Sarah. What can we help you build?" },
  { who: "caller", text: "A chatbot for our website to take orders." },
  { who: "ava", text: "Rough budget — under 2k, 2 to 10k, or over?" },
  { who: "caller", text: "Around five thousand, as soon as possible." },
  { who: "ava", text: "Let me check the calendar… Tuesday at 10 or Wednesday at 11, Eastern?" },
  { who: "caller", text: "Tuesday works." },
  { who: "ava", text: "Booked. You'll get the invite in a moment — thanks, Sarah!" },
];

function AgentVisual() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % (SCRIPT.length + 1)), 2200); return () => clearInterval(t); }, []);
  const visible = SCRIPT.slice(Math.max(0, i - 3), i);
  const talking = i > 0 && SCRIPT[i - 1]?.who === "ava";
  return (
    <motion.div initial={{ opacity: 0, y: 30, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-sm" style={{ perspective: 1200 }}>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="glass relative rounded-[28px] p-5 shadow-[0_30px_80px_-30px_rgba(139,92,246,0.5)]">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="orb-ring absolute inset-0 rounded-full opacity-90" />
            <div className="absolute inset-[3px] rounded-full bg-[#0b0b12]" />
            <motion.div animate={talking ? { scale: [1, 1.15, 1] } : { scale: 1 }} transition={{ duration: 0.8, repeat: talking ? Infinity : 0 }}
              className="absolute inset-[9px] rounded-full bg-gradient-to-br from-accent to-accent-2" />
          </div>
          <div>
            <p className="text-sm font-semibold">Ava · Northstar Digital</p>
            <p className="flex items-center gap-1.5 text-xs text-white/50">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" /></span>
              {i === 0 ? "Incoming call…" : talking ? "Speaking" : "Listening"}
            </p>
          </div>
          <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/50">00:{String(i * 9).padStart(2, "0")}</span>
        </div>
        <div className="mt-4 flex h-56 flex-col justify-end gap-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {visible.map((m, k) => (
              <motion.div key={`${i}-${k}-${m.text.slice(0, 8)}`} layout initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${m.who === "ava" ? "self-start bg-gradient-to-r from-accent/30 to-accent-2/20 text-white" : "self-end bg-white/10 text-white/90"}`}>
                {m.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-white/50">
          {[["Budget", "$2k–10k"], ["Timeline", "ASAP"], ["Booked", "Tue 10:00"]].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-white/10 bg-black/30 py-2"><p className="uppercase tracking-wider">{k}</p><p className="mt-0.5 text-xs font-semibold text-white">{v}</p></div>
          ))}
        </div>
      </motion.div>
      <motion.div aria-hidden animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-accent/30 to-accent-2/20 blur-3xl" />
    </motion.div>
  );
}

export default function Hero({ phoneDisplay, phoneE164 }: { phoneDisplay: string; phoneE164: string }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-12 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
      <motion.div initial="hidden" animate="show" className="text-center lg:text-left">
        <motion.p variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" /> Voice AI · lead qualification · live demo
        </motion.p>
        <motion.h1 variants={fadeUp} custom={1} className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[64px]">
          Your inbound leads, answered in <span className="grad-text">one ring</span>.
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/65 lg:mx-0">
          Meet Ava — an AI intake agent that qualifies every caller, books the discovery call on your real calendar, and drops a scored lead into your CRM. No missed calls, no data entry.
        </motion.p>
        <motion.div variants={fadeUp} custom={3} className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <GlowButton href="#demo">🎙 Try it in your browser</GlowButton>
          {phoneE164 && (
            <motion.a href={`tel:${phoneE164}`} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="glass rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30">
              📞 Call {phoneDisplay}
            </motion.a>
          )}
        </motion.div>
        <motion.p variants={fadeUp} custom={4} className="mt-4 text-xs text-white/40">US number · inbound only · fictional agency persona · calls capped at 3 min</motion.p>
      </motion.div>
      <AgentVisual />
    </section>
  );
}
