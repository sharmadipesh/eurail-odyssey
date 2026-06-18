"use client";

import { motion, type Variants } from "framer-motion";
import classNames from "classnames";

// Shared buttery easing (matches Banner.tsx / CardStackScroll.tsx).
export const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ *
 * Reusable reveal system — drop these on any section's content.
 *
 *   <motion.div variants={revealParent} initial="hidden"
 *     whileInView="show" viewport={{ once: true, amount: 0.3 }}>
 *     <motion.div variants={revealGroup}>
 *       <MaskLine>line one</MaskLine>          // headings: clip + slide up
 *       <MaskLine>line two</MaskLine>
 *     </motion.div>
 *     <motion.div variants={revealGroup}>
 *       <motion.p variants={revealUp}>body…</motion.p>   // body: blur + rise
 *     </motion.div>
 *   </motion.div>
 *
 * whileInView pairs naturally with the card stack: an off-screen card
 * (translateX 100%) isn't intersecting, so its content reveals exactly
 * as the card slides into view.
 * ------------------------------------------------------------------ */

// Top-level orchestrator: staggers each column/group.
export const revealParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

// Group orchestrator: staggers the lines / paragraphs inside a column.
export const revealGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

// A single line sliding up from behind its clip mask.
export const revealLine: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

// Body element: soft blur + rise into focus.
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

// Underline that draws itself in left → right, after the line has landed.
export const drawUnderline: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: EASE, delay: 0.45 } },
};

// Brush highlight that wipes in left → right, as if drawn under the word.
// Clip-based (not scale) so the stroke is revealed, never squished.
// The underline shares its line's start, so this delay (> the 0.9s line
// reveal) makes the highlight begin only after the text has finished landing.
export const drawHighlight: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  show: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.7, ease: EASE, delay: 0.95 },
  },
};

// Element that snaps into place with a springy pop (great for scattered art).
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 240, damping: 16 },
  },
};

// Empty wrapper variant so the clip mask propagates "show" to its inner line.
const maskWrapper: Variants = { hidden: {}, show: {} };

interface MaskLineProps {
  children: React.ReactNode;
  className?: string;
}

/** A headline line that reveals by sliding up from behind a clip mask. */
export function MaskLine({ children, className }: MaskLineProps) {
  return (
    <motion.span
      variants={maskWrapper}
      className={classNames(
        "block overflow-hidden pb-[0.14em] -mb-[0.14em]",
        className
      )}
    >
      <motion.span variants={revealLine} className="block">
        {children}
      </motion.span>
    </motion.span>
  );
}
