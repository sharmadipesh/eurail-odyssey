"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import Chip from "./Chip";
import { EASE } from "./reveal";

// Shade ramp for the bookmark chips: deep indigo (first) → light grey (last).
const DARK = [28, 27, 64]; // indigo-deep  #1C1B40
const LIGHT = [249, 247, 243]; // grey       #F9F7F3

const mix = (t: number) => DARK.map((d, i) => d + (LIGHT[i] - d) * t);

// Pill background at position t (0 = darkest, 1 = lightest).
function shadeBg(t: number) {
  const [r, g, b] = mix(t).map(Math.round);
  return `rgb(${r} ${g} ${b})`;
}

// Flip the label to white on dark fills, ink on light ones.
function shadeText(t: number) {
  const [r, g, b] = mix(t);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1C1B40" : "#FFFFFF";
}

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

export default function Head({ chips }: { chips: readonly string[] }) {
  // Keep the chip cluster on a single line: measure the row's natural width
  // against the space left beside the logo and scale it down to fit. The long
  // Art Direction set (12 chips) would otherwise wrap on narrow screens.
  const fitRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const fit = fitRef.current;
    const row = rowRef.current;
    if (!fit || !row) return;

    const measure = () => {
      const avail = fit.clientWidth;
      const natural = row.scrollWidth; // layout width, unaffected by the scale
      // While the card is parked off-screen its layout is skipped and these read
      // 0 — keep the current scale until it's actually measurable.
      if (avail <= 0 || natural <= 0) return;
      setScale(natural > avail ? Math.max(0.5, avail / natural) : 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(fit);
    ro.observe(row);
    // Cards mount while parked (content-visibility:hidden), where ResizeObserver
    // stays quiet — re-measure the moment the row scrolls into view so the scale
    // is right by the time it's seen.
    const io = new IntersectionObserver(measure);
    io.observe(row);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [chips]);

  return (
    <motion.div
      variants={headContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="flex items-center gap-6"
    >
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

      {/* Available track beside the logo — the row scales to fit this width. */}
      <div ref={fitRef} className="min-w-0 flex-1">
        <motion.div
          ref={rowRef}
          variants={chipGroup}
          style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}
          className="inline-flex flex-nowrap items-center gap-1.5"
        >
          {chips.map((text, i) => {
            const t = chips.length > 1 ? i / (chips.length - 1) : 0;
            return (
              <motion.div key={text} variants={chipItem} className="shrink-0">
                <Chip text={text} bg={shadeBg(t)} color={shadeText(t)} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
