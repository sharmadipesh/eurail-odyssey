"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

import Chip from "./Chip";
import { EASE } from "./reveal";

const CHIPS = [
  { text: "VISUAL SYSTEM" },
  { text: "INTRODUCTION", isActive: true },
  { text: "BASKETS" },
];

// Orchestrate: logo first, then the chip cluster.
const headContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// Logo drops in from above and pulls into focus.
const logoReveal: Variants = {
  hidden: { opacity: 0, y: -16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

// Chip cluster staggers its own children.
const chipGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

// Each chip springs up into place.
const chipItem: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 26 },
  },
};

export default function Head() {
  return (
    <motion.div
      variants={headContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="flex items-center gap-10"
    >
      <motion.div variants={logoReveal}>
        <Image
          width={100}
          height={24}
          alt="eurail-logo"
          src="/images/eu-rail-blue.svg"
        />
      </motion.div>

      <motion.div variants={chipGroup} className="flex items-center gap-3">
        {CHIPS.map((chip) => (
          <motion.div key={chip.text} variants={chipItem}>
            <Chip text={chip.text} isActive={chip.isActive} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
