"use client";

import { motion } from "framer-motion";
import { brand } from "@/lib/brand";

export function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6"
    >
      <a href="#" className="group flex items-center gap-2.5">
        <span className="relative flex h-7 w-7 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-plasma-500/30 blur-md transition group-hover:bg-plasma-500/60" />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-plasma-400" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path d="M2 12 L7 12 L9 6 L12 18 L15 9 L17 12 L22 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-display text-xl tracking-tight text-bone-50">{brand.name}</span>
      </a>
      <div className="hidden items-center gap-8 text-sm text-bone-200/70 md:flex">
        <a href="#how" className="transition hover:text-bone-50">How it works</a>
        <a href="#live" className="transition hover:text-bone-50">Live trends</a>
        <a href="#truth" className="transition hover:text-bone-50">Truth filter</a>
        <a href="#start" className="transition hover:text-bone-50">Get started</a>
      </div>
      <a
        href="#start"
        className="group relative inline-flex items-center gap-2 rounded-full border border-bone-50/15 bg-bone-50/5 px-4 py-2 text-sm text-bone-50 transition hover:border-plasma-400/50 hover:bg-bone-50/10"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember-500" />
        </span>
        Live
      </a>
    </motion.nav>
  );
}
