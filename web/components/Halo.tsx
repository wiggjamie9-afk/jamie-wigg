"use client";

import { motion } from "framer-motion";

export function Halo() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{ opacity: { duration: 2 }, rotate: { duration: 80, ease: "linear", repeat: Infinity } }}
      >
        <div className="shimmer h-[760px] w-[760px] rounded-full" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-[420px] w-[420px] rounded-full bg-plasma-500/10 blur-3xl" />
      </motion.div>
      <div className="absolute inset-0 grid-bg" />
    </div>
  );
}
