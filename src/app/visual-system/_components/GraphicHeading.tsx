"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import { MaskLine, revealParent, revealGroup, EASE } from "./reveal";

// Display heading, one entry per line (matches the reference layout).
const LINES = ["Graphics", "& Motion", "Graphics"];

// Logo drops in from above and pulls into focus — same as Head.tsx.
const logoReveal: Variants = {
  hidden: { opacity: 0, y: -16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

/**
 * Chapter-title slide: the interrail mark, then a big display heading that
 * reveals line by line. Inter / 800 / 150px / 90% leading / -4% tracking.
 */
export default function GraphicHeading() {
  return (
    <div className="flex h-screen flex-col bg-white px-14 py-10">
      <motion.div
        variants={revealParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex h-full flex-col"
      >
        {/* Logo only — the reference omits the section nav chips */}
        <motion.div variants={logoReveal} className="shrink-0">
          <Link href="/" aria-label="Back to home">
            <Image
              width={100}
              height={24}
              alt="eurail-logo"
              src="/images/eu-rail-blue.svg"
            />
          </Link>
        </motion.div>

        {/* Display heading — masked, line-by-line reveal */}
        <motion.h2
          variants={revealGroup}
          className="flex flex-1 flex-col justify-center font-sans text-[150px] font-extrabold leading-[0.9] tracking-[-0.04em] text-ink"
        >
          {LINES.map((line, i) => (
            <MaskLine key={i}>{line}</MaskLine>
          ))}
        </motion.h2>
      </motion.div>
    </div>
  );
}
