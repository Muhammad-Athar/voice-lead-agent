"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

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

export default function CallWidget({
  publicKey,
  assistantId,
}: {
  publicKey: string;
  assistantId: string;
}) {
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
        const text = String(m.transcript ?? "");
        setLines((l) => [...l, { role, text }]);
        if (role === "user") mark("qualify");
      }
      if (type === "tool-calls" || type === "function-call") {
        const names = JSON.stringify(m).toLowerCase();
        if (names.includes("check_availability")) mark("availability");
        if (names.includes("book_slot")) mark("book");
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
  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Call panel */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">Live demo</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Talk to Ava in your browser</h3>
            <p className="mt-1 text-sm text-white/60">Pretend you&apos;re a business that needs a website, chatbot or automation. She&apos;ll qualify you and book a slot. Calls are capped at 3 minutes.</p>
          </div>
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            {busy && <span className={`absolute inset-0 rounded-full bg-amber-400/20 ${speaking ? "animate-ping" : ""}`} />}
            <span className={`relative flex h-12 w-12 items-center justify-center rounded-full text-2xl ${busy ? "bg-amber-400 text-black" : "bg-white/10 text-white/70"}`}>
              {busy ? "🎙" : "📞"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!busy ? (
            <button onClick={start} className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/60">
              {stage === "ended" ? "Call again" : "Start a call"}
            </button>
          ) : (
            <button onClick={stop} className="rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400">Hang up</button>
          )}
          <span className="text-sm text-white/60">
            {stage === "idle" && "Microphone permission will be requested."}
            {stage === "connecting" && "Connecting…"}
            {stage === "live" && (speaking ? `Ava is speaking · ${mm}:${ss}` : `Listening · ${mm}:${ss}`)}
            {stage === "ended" && `Call ended after ${mm}:${ss}. Check the pipeline →`}
            {stage === "error" && `Error: ${error}`}
          </span>
        </div>

        <div ref={logRef} className="mt-6 h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
          {lines.length === 0 && <p className="text-white/40">Transcript appears here in real time.</p>}
          {lines.map((l, i) => (
            <p key={i} className={l.role === "assistant" ? "text-amber-200" : "text-white/80"}>
              <span className="mr-2 text-xs uppercase tracking-wider text-white/40">{l.role === "assistant" ? "Ava" : "You"}</span>
              {l.text}
            </p>
          ))}
        </div>
      </div>

      {/* Pipeline tracker */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Behind the scenes</p>
        <ol className="mt-4 space-y-4">
          {STEPS.map((s, i) => {
            const isDone = done.has(s.key);
            const isNext = !isDone && STEPS.slice(0, i).every((p) => done.has(p.key)) && busy;
            return (
              <li key={s.key} className="flex gap-3">
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isDone ? "bg-emerald-400 text-black" : isNext ? "bg-amber-400/80 text-black animate-pulse" : "bg-white/10 text-white/50"}`}>
                  {isDone ? "✓" : i + 1}
                </span>
                <div>
                  <p className={`text-sm font-medium ${isDone ? "text-white" : "text-white/70"}`}>{s.label}</p>
                  <p className="text-xs text-white/40">{s.hint}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-xs text-white/40">
          Within ~60 s of hang-up the lead is scored 0–100 by Gemini and pushed to HubSpot, a Google Sheet, Slack and the sales inbox. The n8n workflows run on a self-hosted instance.
        </p>
      </div>
    </div>
  );
}
