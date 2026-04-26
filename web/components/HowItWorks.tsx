"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    label: "Listen",
    title: "Four signals, one heartbeat.",
    body:
      "Reddit r/all, Hacker News, Google Trends, YouTube — pulled in parallel, normalized, and merged. Cross-source matches get boosted; single-source noise sinks.",
  },
  {
    n: "02",
    label: "Think",
    title: "Drafted in your voice.",
    body:
      "Claude turns the top trend into a post. Strict JSON output, prompt-cached for speed. Every draft must end on an open question — discussion-first, never bait.",
  },
  {
    n: "03",
    label: "Ship",
    title: "Posted, logged, rate-limited.",
    body:
      "OAuth-authenticated Reddit publish. Every trend, draft, and post recorded in SQLite. Built-in cooldown between posts — never spam, never sleeps.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 max-w-2xl"
      >
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-plasma-400/80">
          three movements
        </p>
        <h3 className="mt-3 font-display text-4xl leading-tight text-display-gradient sm:text-5xl">
          Listen. Think. Ship.
        </h3>
        <p className="mt-4 max-w-lg text-bone-200/60">
          The whole pipeline runs in under a minute. You set it once, then check
          the log when you feel like it.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="card card-hover relative overflow-hidden rounded-2xl p-8"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-bone-200/40">{s.label}</span>
              <span className="font-display text-5xl text-bone-50/10">{s.n}</span>
            </div>
            <h4 className="mt-8 font-display text-2xl leading-tight text-bone-50">{s.title}</h4>
            <p className="mt-3 text-sm leading-relaxed text-bone-200/60">{s.body}</p>
            <span className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-plasma-500/[0.04] blur-2xl" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
