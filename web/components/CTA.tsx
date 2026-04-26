"use client";

import { motion } from "framer-motion";

const steps = [
  { cmd: "git clone <repo>", note: "clone the bot" },
  { cmd: "npm install && cp .env.example .env", note: "install deps, set env" },
  { cmd: "# add ANTHROPIC_API_KEY + REDDIT_*", note: "Anthropic console + reddit.com/prefs/apps" },
  { cmd: "npm run dry-run", note: "preview a draft, no posting" },
  { cmd: "npm run live", note: "ship the first real post" },
  { cmd: "npm run loop", note: "keep it running on a server" },
];

export function CTA() {
  return (
    <section id="start" className="relative mx-auto max-w-7xl px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="card relative overflow-hidden rounded-3xl p-10 sm:p-16"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-plasma-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-plasma-400/80">
              ten minutes to first post
            </p>
            <h3 className="mt-3 font-display text-4xl leading-tight text-display-gradient sm:text-5xl">
              Plug in your keys.<br />Watch it work.
            </h3>
            <p className="mt-6 max-w-md text-bone-200/60">
              Everything is in the repo. The README walks you through Reddit
              app creation, env vars, dry-run, and your first live post.
              Deploy the loop to a $5 VPS or a free Railway worker, and it
              runs while you sleep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://github.com/wiggjamie9-afk/jamie-wigg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-bone-50 px-5 py-2.5 text-sm font-medium text-ink-950 transition hover:scale-[1.02]"
              >
                Open the repo
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="https://www.reddit.com/prefs/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-bone-50/15 px-5 py-2.5 text-sm text-bone-50 transition hover:border-plasma-400/50 hover:bg-bone-50/5"
              >
                Create Reddit app
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-bone-50/10 bg-ink-950/60 p-2 font-mono text-sm shadow-2xl">
            <div className="flex items-center gap-1.5 px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-ember-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-bone-200/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-plasma-400/50" />
              <span className="ml-3 text-[10px] uppercase tracking-widest text-bone-200/40">
                terminal · ~/jamie-wigg
              </span>
            </div>
            <div className="space-y-1.5 rounded-xl bg-ink-950 p-5 leading-relaxed">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-3"
                >
                  <span className="text-plasma-400/80">$</span>
                  <span className="text-bone-50">
                    {s.cmd.startsWith("#") ? (
                      <span className="text-bone-200/40">{s.cmd}</span>
                    ) : (
                      <>
                        {s.cmd}
                        <span className="ml-3 text-xs text-bone-200/30"># {s.note}</span>
                      </>
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
