"use client";

import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: (i: number = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

/** Fade-up on scroll. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      {children}
    </motion.div>
  );
}

/** Card that lifts and glows on hover. */
export function HoverCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors ${className}`}
      whileHover={{ y: -6, borderColor: "rgba(251,191,36,0.45)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(251,191,36,0.10), transparent 60%)" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/** Animated number that counts up when scrolled into view. */
export function CountUp({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => spring.on("change", (v) => { if (ref.current) ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`; }), [spring, prefix, suffix, decimals]);
  return <span ref={ref}>{prefix}{(0).toFixed(decimals)}{suffix}</span>;
}

/** Ambient animated background: drifting gradient orbs + faint grid. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0b0b0f]" />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)" }} />
      <motion.div className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-amber-400/20 blur-[120px]"
        animate={{ x: [-40, 40, -40], y: [0, 30, 0], scale: [1, 1.08, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-0 -right-32 h-[480px] w-[480px] rounded-full bg-sky-500/10 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}

/** Audio-style waveform: bars dance while `active`, rest flat otherwise. */
export function Waveform({ active, bars = 24 }: { active: boolean; bars?: number }) {
  return (
    <div className="flex h-12 items-center justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const peak = 0.35 + Math.abs(Math.sin(i * 1.7)) * 0.65;
        return (
          <motion.span key={i} className="w-[3px] rounded-full bg-amber-300"
            animate={active ? { scaleY: [0.2, peak, 0.3, peak * 0.8, 0.2] } : { scaleY: 0.15 }}
            transition={active ? { duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: (i % 7) * 0.05 } : { duration: 0.4 }}
            style={{ height: 40, transformOrigin: "center" }} />
        );
      })}
    </div>
  );
}
