"use client";

import { motion } from "framer-motion";
import { brand } from "@/lib/brand";
import { Halo } from "./Halo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Halo />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-32 sm:pt-24 sm:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-bone-50/10 bg-bone-50/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-bone-200/70">
            <span className="h-1 w-1 rounded-full bg-plasma-400" />
            v0.1 · global trend engine
          </div>

          <h1 className="font-display text-[clamp(2.8rem,7.5vw,6.5rem)] leading-[0.95] tracking-tightest text-display-gradient">
            {brand.name}.
          </h1>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,3.6vw,2.8rem)] italic leading-tight text-bone-200/90">
            the world&rsquo;s <span className="text-accent-gradient not-italic font-medium">heartbeat,</span>
            <br className="hidden sm:inline" /> drafted for you.
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-bone-200/70 sm:text-lg">
            {brand.longDesc}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="#start"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-bone-50 px-6 py-3 text-sm font-medium text-ink-950 transition hover:scale-[1.02]"
            >
              <span className="relative">Plug in your keys</span>
              <svg className="relative h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#live"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-bone-50/15 px-6 py-3 text-sm text-bone-50 transition hover:border-plasma-400/50 hover:bg-bone-50/5"
            >
              See what&rsquo;s trending now
            </a>
          </motion.div>
        </motion.div>

        <HeroOrbits />
      </div>
    </section>
  );
}

function HeroOrbits() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1.2 }}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 mx-auto h-[420px] w-full max-w-5xl"
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone-50/[0.06]"
          style={{ width: `${i * 280}px`, height: `${i * 280}px` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 30, ease: "linear", repeat: Infinity }}
        >
          <span
            className="absolute h-2 w-2 rounded-full bg-plasma-400 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
            style={{ top: "-4px", left: "50%" }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
