"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./motion";

export default function Hero({ phoneDisplay, phoneE164 }: { phoneDisplay: string; phoneE164: string }) {
  return (
    <motion.section initial="hidden" animate="show" className="mx-auto max-w-6xl px-6 pb-10 pt-10 text-center sm:pt-16">
      <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.35em] text-amber-300/80">Voice AI lead qualification</motion.p>
      <motion.h1 variants={fadeUp} custom={1} className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
        Your inbound leads,<br className="hidden sm:block" /> answered in{" "}
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">one ring</span>
          <motion.span aria-hidden className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-amber-300/70"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
        </span>
        .
      </motion.h1>
      <motion.p variants={fadeUp} custom={2} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
        Meet Ava — an AI intake agent that qualifies every caller, books the discovery call on your real calendar, and drops a scored lead into your CRM. No missed calls, no data entry.
      </motion.p>
      <motion.div variants={fadeUp} custom={3} className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <motion.a href="#demo" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="rounded-full bg-amber-400 px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_50px_-10px_rgba(251,191,36,0.9)]">
          🎙 Try it in your browser
        </motion.a>
        {phoneE164 && (
          <motion.a href={`tel:${phoneE164}`} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="rounded-full border border-white/20 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40">
            📞 Call {phoneDisplay}
          </motion.a>
        )}
      </motion.div>
      <motion.p variants={fadeUp} custom={4} className="mt-4 text-xs text-white/40">US number · inbound only · fictional agency persona</motion.p>
    </motion.section>
  );
}
