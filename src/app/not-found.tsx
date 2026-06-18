"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

const digit: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const catPop: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 16, delay: 0.15 },
  },
};

function Cat() {
  return (
    <article
      className="cat-art"
      role="img"
      aria-labelledby="catAlt"
      // Sized to sit between the two 4s like a round "0".
      style={{ fontSize: "clamp(1.7px, 0.34vw, 3.4px)" }}
    >
      <div id="catAlt" className="cat-alt">
        Cartoon of a navy cat drawn in cute/kawaii style
      </div>
      <div className="shadow" />
      <div className="tail" />
      <div className="body">
        <div className="leg" />
        <div className="leg" />
        <div className="paw" />
        <div className="paw" />
      </div>
      <div className="head">
        <div className="ear" />
        <div className="ear" />
        <div className="face">
          <div className="whisker" />
          <div className="whisker" />
          <div className="whisker" />
          <div className="whisker" />
          <div className="eye" />
          <div className="eye" />
          <div className="nose" />
          <div className="mouth" />
          <div className="tongue" />
        </div>
      </div>
    </article>
  );
}

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen w-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#FBFAF7] px-6 text-center">
      {/* Soft brand glows for depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[12vw] -top-[18vh] -z-10 h-[60vh] w-[60vh] rounded-full bg-brand-yellow opacity-40 blur-[130px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-[18vh] -right-[10vw] -z-10 h-[55vh] w-[55vh] rounded-full bg-indigo-bright opacity-20 blur-[140px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.16, 0.28, 0.16] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center"
      >
        {/* 4 — cat — 4 */}
        <div className="flex items-center justify-center gap-2 sm:gap-5">
          <motion.span
            variants={digit}
            className="bg-gradient-to-br from-ink to-indigo-bright bg-clip-text font-sans text-[clamp(120px,24vw,280px)] font-extrabold leading-none tracking-[-0.04em] text-transparent"
          >
            4
          </motion.span>

          <motion.div
            variants={catPop}
            whileHover={{ scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="cursor-pointer"
          >
            <Cat />
          </motion.div>

          <motion.span
            variants={digit}
            className="bg-gradient-to-br from-ink to-indigo-bright bg-clip-text font-sans text-[clamp(120px,24vw,280px)] font-extrabold leading-none tracking-[-0.04em] text-transparent"
          >
            4
          </motion.span>
        </div>

        <motion.h1
          variants={item}
          className="mt-4 font-sans text-[clamp(26px,4.5vw,46px)] font-semibold tracking-[-0.02em] text-ink"
        >
          You&apos;ve reached the end of the line.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 max-w-md font-sans text-base font-normal leading-relaxed text-ink/55 sm:text-lg"
        >
          This page took a different route — but{" "}
          <span className="font-medium text-ink">Meih Meih</span> will happily
          give you wings back to familiar tracks.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/" aria-label="Back to home">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink px-7 py-3.5 font-sans text-base font-medium text-white shadow-[0_14px_40px_-12px_rgba(27,32,64,0.55)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-brand-yellow opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
              />
              <svg
                className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M14 8H3M7 4 3 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="relative">Back home</span>
            </motion.span>
          </Link>

          <Link href="/visual-system" aria-label="Explore the Visual System">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-7 py-3.5 font-sans text-base font-medium text-ink backdrop-blur transition-colors hover:border-ink/30"
            >
              Visual System
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
