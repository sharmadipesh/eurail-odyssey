"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

/* Two justified rows of stills and short films. `play` marks the clips;
 * `ratio` (from the source asset) drives both the flex weight and the box
 * aspect, so each row fills the width at a uniform height without cropping. */
type Tile = { n: number; ratio: number; play?: boolean };

const ROW_ONE: Tile[] = [
  { n: 1, ratio: 290 / 386 },
  { n: 2, ratio: 582 / 386 },
  { n: 3, ratio: 308 / 386, play: true },
  { n: 4, ratio: 686 / 386, play: true },
  { n: 5, ratio: 288 / 386, play: true },
  { n: 6, ratio: 256 / 384 },
];
const ROW_TWO: Tile[] = [
  { n: 7, ratio: 284 / 378 },
  { n: 8, ratio: 502 / 378, play: true },
  { n: 9, ratio: 302 / 378 },
  { n: 10, ratio: 566 / 378 },
  { n: 11, ratio: 350 / 378 },
  { n: 12, ratio: 302 / 378 },
];

/* Flex-basis seed; nudges wrapping on narrow screens while the proportional
 * grow keeps natural aspect ratios on a single justified row. */
const BASIS = 120;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

function Tile({ tile }: { tile: Tile }) {
  return (
    <motion.div
      variants={item}
      className="group relative cursor-pointer overflow-hidden rounded-[8px] ring-1 ring-[#1B2040]/[0.06]"
      style={{ flexGrow: tile.ratio, flexBasis: tile.ratio * BASIS, aspectRatio: tile.ratio }}
    >
      <Image
        src={`/images/video/section-19/${tile.n}.png`}
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      {tile.play && (
        <div className="absolute bottom-3 left-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/35 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40">
            <svg width="13" height="15" viewBox="0 0 15 17" fill="none" className="ml-[2px]" aria-hidden>
              <path d="M0 0L15 8.5L0 17V0Z" fill="white" fillOpacity="0.95" />
            </svg>
          </span>
        </div>
      )}
    </motion.div>
  );
}

function Row({ tiles }: { tiles: Tile[] }) {
  return (
    <motion.div variants={row} className="flex flex-wrap justify-center gap-2.5 lg:flex-nowrap">
      {tiles.map((t) => (
        <Tile key={t.n} tile={t} />
      ))}
    </motion.div>
  );
}

export default function Section19() {
  return (
    <Sections
      style={{
        container: "px-8!",
        children: "flex min-h-[90vh] items-center",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto flex w-full max-w-[1720px] flex-col gap-2.5"
      >
        <Row tiles={ROW_ONE} />
        <Row tiles={ROW_TWO} />
      </motion.div>
    </Sections>
  );
}
