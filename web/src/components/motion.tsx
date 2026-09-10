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

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      {children}
    </motion.div>
  );
}

/** Glass card with lift, cursor-tracking glow and a gradient border on hover. */
export function HoverCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect(); if (!r || !ref.current) return;
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`group glass relative overflow-hidden rounded-2xl p-6 ${className}`}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ padding: 1, background: "linear-gradient(120deg, var(--accent), var(--accent-2))", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function CountUp({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => spring.on("change", (v) => { if (ref.current) ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`; }), [spring, prefix, suffix, decimals]);
  return <span ref={ref}>{prefix}{(0).toFixed(decimals)}{suffix}</span>;
}

/** Ambient background: drifting gradient orbs + faint grid + noise. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070d]" />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "72px 72px", maskImage: "radial-gradient(ellipse at top, black 15%, transparent 65%)" }} />
      <motion.div className="absolute -top-40 left-1/3 h-[640px] w-[640px] rounded-full bg-accent/25 blur-[140px]"
        animate={{ x: [-60, 60, -60], y: [0, 40, 0], scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-1/4 -right-40 h-[520px] w-[520px] rounded-full bg-accent-2/15 blur-[140px]"
        animate={{ x: [0, -70, 0], y: [0, 60, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-0 -left-40 h-[480px] w-[480px] rounded-full bg-fuchsia-500/10 blur-[140px]"
        animate={{ x: [0, 80, 0], y: [0, -40, 0] }} transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}

/** Audio-style waveform. */
export function Waveform({ active, bars = 28 }: { active: boolean; bars?: number }) {
  return (
    <div className="flex h-12 items-center justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const peak = 0.35 + Math.abs(Math.sin(i * 1.7)) * 0.65;
        return (
          <motion.span key={i} className="w-[3px] rounded-full bg-gradient-to-t from-accent to-accent-2"
            animate={active ? { scaleY: [0.2, peak, 0.3, peak * 0.8, 0.2] } : { scaleY: 0.15 }}
            transition={active ? { duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: (i % 7) * 0.05 } : { duration: 0.4 }}
            style={{ height: 40, transformOrigin: "center" }} />
        );
      })}
    </div>
  );
}

/** Primary gradient button with glow. */
export function GlowButton({ children, href, onClick, className = "" }: { children: ReactNode; href?: string; onClick?: () => void; className?: string }) {
  const cls = `relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_50px_-10px_var(--accent)] transition ${className}`;
  const inner = <span className="relative">{children}</span>;
  return href ? (
    <motion.a href={href} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className={cls}>{inner}</motion.a>
  ) : (
    <motion.button onClick={onClick} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className={cls}>{inner}</motion.button>
  );
}
