"use client";

import Image from "next/image";
import classNames from "classnames";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

type T = { n: number; a: number; label?: string };

// Three justified rows. `a` = aspect ratio (w/h) → used as the flex weight so
// every image keeps its shape while each row fills the width at one height.
const ROW1: T[] = [
  { n: 1, a: 1.333 },
  { n: 2, a: 1.333 },
  { n: 3, a: 1.333 },
  { n: 4, a: 1.333 },
  { n: 5, a: 0.802 },
  { n: 6, a: 0.802 },
  { n: 7, a: 0.746 },
  { n: 8, a: 0.746 },
  { n: 9, a: 0.683 },
  { n: 10, a: 0.675 },
];
const ROW2: T[] = [
  { n: 11, a: 1.333 },
  { n: 12, a: 1.333, label: "AMSTERDAM" },
  { n: 13, a: 1.508 },
  { n: 14, a: 1.333 },
  { n: 15, a: 1.5 },
  { n: 16, a: 1.333, label: "MILANO" },
  { n: 17, a: 0.746 },
  { n: 18, a: 0.746 },
];
const ROW3: T[] = [
  { n: 19, a: 0.75 },
  { n: 20, a: 0.798 },
  { n: 21, a: 0.75 },
  { n: 22, a: 0.75 },
  { n: 23, a: 1.331 },
  { n: 24, a: 1.331 },
  { n: 25, a: 0.798 },
  { n: 26, a: 0.798 },
  { n: 27, a: 0.75 },
  { n: 28, a: 0.752 },
  { n: 29, a: 0.798 },
];

const TOP_LABELS = [
  { t: "LONDON", w: 1.333 },
  { t: "COPENHAGEN", w: 1.333 },
  { t: "PARIS", w: 2.666 },
  { t: "BRUSSELS", w: 4.454 },
];
const BOTTOM_LABELS = [
  { t: "BARCELONA", w: 3.048, center: false },
  { t: "ROME", w: 2.662, center: true },
  { t: "BERLIN", w: 3.896, center: true },
];

const collage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};
const tileVar: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function PlayButton() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/40 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40">
        <svg width="11" height="13" viewBox="0 0 15 17" fill="none" className="ml-[2px]" aria-hidden>
          <path d="M0 0L15 8.5L0 17V0Z" fill="white" fillOpacity="0.95" />
        </svg>
      </span>
    </div>
  );
}

function Tile({ n, a, label }: T) {
  return (
    <motion.div
      variants={tileVar}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      style={{ flexGrow: a, flexBasis: 0 }}
      className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[4px] ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-[filter,box-shadow] duration-500 hover:shadow-[0_14px_36px_-14px_rgba(0,0,0,0.5)] group-hover/collage:brightness-[0.62] group-hover/collage:grayscale-[0.2] hover:!brightness-100 hover:!grayscale-0"
    >
      <Image
        src={`/images/video/section-13/${n}.png`}
        alt=""
        fill
        sizes="(max-width: 1024px) 30vw, 14vw"
        className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5"
      />
      {label && (
        <div className="pointer-events-none absolute bottom-1.5 left-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#F5C518] drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
            {label}
          </span>
        </div>
      )}
      <PlayButton />
    </motion.div>
  );
}

function Row({ tiles }: { tiles: T[] }) {
  return (
    <motion.div variants={group} className="flex h-[clamp(132px,16.5vh,186px)] gap-2">
      {tiles.map((t) => (
        <Tile key={t.n} {...t} />
      ))}
    </motion.div>
  );
}

function Label({ t, w, center }: { t: string; w: number; center?: boolean }) {
  return (
    <motion.span
      variants={tileVar}
      style={{ flexGrow: w, flexBasis: 0 }}
      className={classNames(
        "min-w-0 font-mono text-[12px] uppercase tracking-[0.14em] text-[#1B2040]/80",
        center && "text-center",
      )}
    >
      {t}
    </motion.span>
  );
}

export default function Section13() {
  return (
    <Sections
      style={{ container: "px-8!", children: "flex min-h-[90vh] items-center justify-center" }}
    >
      <motion.div
        variants={collage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="group/collage mx-auto flex w-full max-w-[1700px] flex-col gap-[10px]"
      >
        {/* top city labels */}
        <motion.div variants={group} className="flex gap-2 px-1">
          {TOP_LABELS.map((l) => (
            <Label key={l.t} {...l} />
          ))}
        </motion.div>

        <Row tiles={ROW1} />
        <Row tiles={ROW2} />
        <Row tiles={ROW3} />

        {/* bottom city labels */}
        <motion.div variants={group} className="flex gap-2 px-1">
          {BOTTOM_LABELS.map((l) => (
            <Label key={l.t} {...l} />
          ))}
        </motion.div>
      </motion.div>
    </Sections>
  );
}
