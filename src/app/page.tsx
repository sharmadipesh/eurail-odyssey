"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-4xl font-bold tracking-tight sm:text-6xl"
      >
        Eurail Design
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base text-foreground/60 sm:text-lg"
      >
        Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Inter
      </motion.p>
    </main>
  );
}
