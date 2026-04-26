"use client";

import { motion } from "framer-motion";

const filters = [
  { kw: "no fabricated stats", body: "If the model doesn't know a number, it speaks generally or asks the community. Better an honest question than a confident lie." },
  { kw: "no clickbait", body: "Headlines under 280 chars, no ALL CAPS, no emoji spam. The hook has to come from the substance, not the typography." },
  { kw: "platform-rule aware", body: "Posts go to subs you own or your own profile by default. Disclosed automation. Cooldowns between posts. Built to last, not to spam." },
  { kw: "discussion-first", body: "Every draft ends on an open question. The goal is real replies, not vanity engagement." },
];

export function TruthFilter() {
  return (
    <section id="truth" className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="md:sticky md:top-24 md:self-start"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-plasma-400/80">
            the part most bots skip
          </p>
          <h3 className="mt-3 font-display text-4xl leading-tight text-display-gradient sm:text-5xl">
            A truth filter, baked in.
          </h3>
          <p className="mt-6 text-bone-200/60">
            Most engagement bots burn the account they&rsquo;re running on. Spam,
            fake stats, scraped slop — banned in a week. {" "}
            <span className="text-bone-50">This one is built to outlast every algorithm change.</span>
          </p>
          <div className="mt-8 hairline" />
          <p className="mt-8 font-display text-xl italic text-bone-200/70">
            &ldquo;Reach is earned, not extracted.&rdquo;
          </p>
        </motion.div>

        <div className="space-y-4">
          {filters.map((f, i) => (
            <motion.div
              key={f.kw}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card group relative overflow-hidden rounded-2xl p-7 transition hover:border-plasma-400/30"
            >
              <div className="flex items-start gap-5">
                <span className="mt-1.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-plasma-400/30 bg-plasma-500/10">
                  <svg className="h-3.5 w-3.5 text-plasma-400" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h4 className="font-display text-lg text-bone-50">{f.kw}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-bone-200/60">{f.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
