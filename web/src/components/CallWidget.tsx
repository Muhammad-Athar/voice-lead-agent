"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Vapi from "@vapi-ai/web";
import { Waveform } from "./motion";

type Line = { role: "assistant" | "user"; text: string };
type Stage = "idle" | "connecting" | "live" | "ended" | "error";

const STEPS = [
  { key: "call", label: "Call connected", hint: "Vapi · Deepgram Nova-3 · Gemini 3.5 Flash" },
  { key: "qualify", label: "Qualifying the lead", hint: "name · need · budget · timeline · decision-maker" },
  { key: "availability", label: "Checking the calendar", hint: "tool → n8n → Google Calendar free/busy" },
  { key: "book", label: "Booking the slot", hint: "tool → n8n → Calendar event + invite" },
  { key: "report", label: "Post-call pipeline", hint: "Gemini score → HubSpot · Sheets · Slack · email" },
] as const;
type StepKey = (typeof STEPS)[number]["key"];

export default function CallWidget({ publicKey, assistantId }: { publicKey: string; assistantId: string }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [speaking, setSpeaking] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [done, setDone] = useState<Set<StepKey>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  const mark = (k: StepKey) => setDone((d) => new Set(d).add(k));

  useEffect(() => {
    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;
    vapi.on("call-start", () => { setStage("live"); mark("call"); });
    vapi.on("call-end", () => { setStage("ended"); setSpeaking(false); mark("report"); });
    vapi.on("speech-start", () => setSpeaking(true));
    vapi.on("speech-end", () => setSpeaking(false));
    vapi.on("error", (e: unknown) => { setStage("error"); setError(typeof e === "string" ? e : JSON.stringify(e)); });
    vapi.on("message", (m: Record<string, unknown>) => {
      const type = m.type as string;
      if (type === "transcript" && m.transcriptType === "final") {
        const role = m.role === "assistant" ? "assistant" : "user";
        setLines((l) => [...l, { role, text: String(m.transcript ?? "") }]);
        if (role === "user") mark("qualify");
      }
      if (type === "tool-calls" || type === "function-call") {
        const s = JSON.stringify(m).toLowerCase();
        if (s.includes("check_availability")) mark("availability");
        if (s.includes("book_slot")) mark("book");
      }
    });
    return () => { vapi.stop(); };
  }, [publicKey]);

  useEffect(() => {
    if (stage !== "live") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [stage]);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [lines]);

  const start = async () => {
    setLines([]); setDone(new Set()); setError(null); setSeconds(0); setStage("connecting");
    try { await vapiRef.current?.start(assistantId); } catch (e) { setStage("error"); setError(String(e)); }
  };
  const stop = () => vapiRef.current?.stop();

  const busy = stage === "connecting" || stage === "live";
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Call panel */}
      <motion.div layout className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <motion.div aria-hidden className="pointer-events-none absolute -inset-px rounded-3xl" animate={{ opacity: busy ? 1 : 0 }}
          style={{ background: "linear-gradient(120deg, color-mix(in oklab, var(--accent) 35%, transparent), transparent 40%, transparent 60%, color-mix(in oklab, var(--accent-2) 35%, transparent))" }} />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-accent-2/80">Live demo</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Talk to Ava in your browser</h3>
          <p className="mt-2 max-w-lg text-sm text-white/60">
            Pretend you&apos;re a business that needs a website, chatbot or automation. Ava will qualify you and book a real slot. Demo calls are capped at 3 minutes.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <Waveform active={busy && speaking} />
            <p className="mt-1 text-center text-xs text-white/50">
              {stage === "idle" && "Ready — microphone permission will be requested"}
              {stage === "connecting" && "Connecting…"}
              {stage === "live" && (speaking ? `Ava is speaking · ${clock}` : `Listening · ${clock}`)}
              {stage === "ended" && `Call ended · ${clock} · watch the pipeline →`}
              {stage === "error" && `Error: ${error}`}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <AnimatePresence mode="wait" initial={false}>
              {!busy ? (
                <motion.button key="start" onClick={start} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="relative rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_-8px_var(--accent)] focus:outline-none focus:ring-2 focus:ring-accent-2/60">
                  {stage === "ended" ? "Call again" : "🎙 Start a call"}
                </motion.button>
              ) : (
                <motion.button key="stop" onClick={stop} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="rounded-full bg-red-500 px-7 py-3 text-sm font-semibold text-white">
                  Hang up
                </motion.button>
              )}
            </AnimatePresence>
            {busy && (
              <span className="flex items-center gap-2 text-xs text-white/60">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>
                live
              </span>
            )}
          </div>

          <div ref={logRef} className="mt-6 h-60 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm">
            {lines.length === 0 && <p className="text-white/40">Transcript appears here in real time.</p>}
            <AnimatePresence initial={false}>
              {lines.map((l, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  className={l.role === "assistant" ? "text-accent-2/90" : "text-white/80"}>
                  <span className="mr-2 text-[10px] uppercase tracking-wider text-white/40">{l.role === "assistant" ? "Ava" : "You"}</span>
                  {l.text}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Pipeline tracker */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-white/50">Behind the scenes</p>
        <ol className="relative mt-5 space-y-5">
          <span aria-hidden className="absolute left-3 top-3 h-[calc(100%-1.5rem)] w-px bg-white/10" />
          {STEPS.map((s, i) => {
            const isDone = done.has(s.key);
            const isNext = !isDone && STEPS.slice(0, i).every((p) => done.has(p.key)) && busy;
            return (
              <li key={s.key} className="relative flex gap-4">
                <motion.span
                  animate={isDone ? { backgroundColor: "#34d399", color: "#000", scale: [1, 1.25, 1] } : isNext ? { backgroundColor: "var(--accent)", color: "#fff" } : { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  transition={{ duration: 0.4 }}
                  className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isNext ? "animate-pulse" : ""}`}>
                  {isDone ? "✓" : i + 1}
                </motion.span>
                <div>
                  <p className={`text-sm font-medium ${isDone ? "text-white" : "text-white/70"}`}>{s.label}</p>
                  <p className="text-xs text-white/40">{s.hint}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-xs leading-relaxed text-white/40">
          Within ~60 s of hang-up the lead is scored 0–100 by Gemini and pushed to HubSpot, a Google Sheet, Slack and the sales inbox. Workflows run on a self-hosted n8n.
        </p>
      </div>
    </div>
  );
}
