"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-27";

/* Two justified rows of stills. `ratio` (w/h, from the source asset) drives both
 * the flex weight and the box aspect, so each row fills the width at a uniform
 * height without cropping. */
type Tile = { n: number; ratio: number };

const ROW_ONE: Tile[] = [
  { n: 1, ratio: 392 / 524 },
  { n: 2, ratio: 392 / 522 },
  { n: 3, ratio: 364 / 524 },
  { n: 4, ratio: 420 / 524 },
  { n: 5, ratio: 368 / 520 },
  { n: 6, ratio: 416 / 520 },
];
const ROW_TWO: Tile[] = [
  { n: 7, ratio: 310 / 414 },
  { n: 8, ratio: 310 / 412 },
  { n: 9, ratio: 652 / 412 },
  { n: 10, ratio: 646 / 412 },
  { n: 11, ratio: 444 / 412 },
];

/* Flex-basis seed; nudges wrapping on narrow screens while the proportional
 * grow keeps natural aspect ratios on a single justified row. */
const BASIS = 120;

// The journey-molecule concept, in two columns under the board.
const LEFT =
  "Every traveller's journey drawn as a molecule. Cities as nodes, rail lines as bonds. The shape changes for every person. The graphic system stays the same. Small filled dots for the cities a traveller visited. Thin yellow lines connecting them in the order they happened. The molecule layered over hero images or videos / gifs.";
const RIGHT =
  "Dots arrive first; the bonds complete the journey one line at a time. Different shape for every traveller or content piece, same animation grammar. The signature of the brand isn't a logo here. It's the shape of where you went (not literally).";
const AVOID = "[Avoid: Realistic geography. Country borders. Map shading.]";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const textItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

function Tile({ tile }: { tile: Tile }) {
  return (
    <motion.div
      variants={item}
      className="group relative overflow-hidden rounded-[4px] ring-1 ring-[#1B2040]/[0.06]"
      style={{
        flexGrow: tile.ratio,
        flexBasis: tile.ratio * BASIS,
        aspectRatio: tile.ratio,
      }}
    >
      <Image
        src={`${BASE}/${tile.n}.png`}
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
    </motion.div>
  );
}

function Row({ tiles }: { tiles: Tile[] }) {
  return (
    <motion.div
      variants={row}
      className="flex flex-wrap justify-center gap-2.5 lg:flex-nowrap"
    >
      {tiles.map((t) => (
        <Tile key={t.n} tile={t} />
      ))}
    </motion.div>
  );
}

export default function Graphic2() {
  return (
    <Sections group="graphics"
      style={{ container: "px-8!", children: "flex min-h-[90vh] items-center" }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto flex w-full max-w-[1360px] flex-col gap-2.5"
      >
        <Row tiles={ROW_ONE} />
        <Row tiles={ROW_TWO} />

        {/* Caption — two columns, mirroring the reference */}
        <motion.div
          variants={row}
          className="mt-7 grid grid-cols-1 gap-x-16 gap-y-4 font-sans text-[16px] font-normal leading-[1.55] text-ink md:grid-cols-2"
        >
          <motion.p variants={textItem}>{LEFT}</motion.p>
          <motion.div variants={textItem}>
            <p>{RIGHT}</p>
            <p className="mt-2">{AVOID}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </Sections>
  );
}
