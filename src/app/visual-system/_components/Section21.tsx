"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

/* A staggered cinematic mosaic. `place` carries the desktop grid position
 * (12-col × 12-row) plus the mobile aspect/span; `play` marks the clips.
 * Tiles fill their grid cell with object-cover, matching the source board. */
type Tile = { n: number; place: string; play?: boolean };

const TILES: Tile[] = [
  // left column — three stacked clips
  { n: 1, place: "aspect-[3/2] lg:aspect-auto lg:[grid-column:1/3] lg:[grid-row:1/5]", play: true },
  { n: 6, place: "aspect-[3/2] lg:aspect-auto lg:[grid-column:1/3] lg:[grid-row:5/9]", play: true },
  { n: 7, place: "aspect-[3/2] lg:aspect-auto lg:[grid-column:1/3] lg:[grid-row:9/13]", play: true },
  // top band
  { n: 2, place: "aspect-[4/3] lg:aspect-auto lg:[grid-column:3/6] lg:[grid-row:1/7]", play: true },
  { n: 3, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:6/9] lg:[grid-row:1/7]", play: true },
  { n: 4, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:9/11] lg:[grid-row:1/7]", play: true },
  { n: 5, place: "aspect-[5/4] lg:aspect-auto lg:[grid-column:11/13] lg:[grid-row:1/7]", play: true },
  // bottom band — middle stills + Tower Bridge clip
  { n: 8, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:3/5] lg:[grid-row:7/13]" },
  { n: 9, place: "aspect-[4/3] lg:aspect-auto lg:[grid-column:5/7] lg:[grid-row:7/13]", play: true },
  { n: 10, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:7/8] lg:[grid-row:7/13]" },
  { n: 11, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:8/9] lg:[grid-row:7/13]" },
  { n: 12, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:9/11] lg:[grid-row:7/13]" },
  // right column — stacked clip pair
  { n: 13, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:11/13] lg:[grid-row:7/10]", play: true },
  { n: 14, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:11/13] lg:[grid-row:10/13]", play: true },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
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

function MosaicTile({ tile }: { tile: Tile }) {
  return (
    <motion.div
      variants={item}
      className={`group relative cursor-pointer overflow-hidden rounded-[8px] ring-1 ring-[#1B2040]/[0.06] ${tile.place}`}
    >
      <Image
        src={`/images/video/section-21/${tile.n}.png`}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      {tile.play && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
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

export default function Section21() {
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
        viewport={{ once: true, amount: 0.12 }}
        className="mx-auto grid w-full max-w-[1720px] grid-cols-2 gap-2.5 lg:h-[clamp(440px,64vh,660px)] lg:grid-cols-12 lg:[grid-template-rows:repeat(12,minmax(0,1fr))]"
      >
        {TILES.map((tile) => (
          <MosaicTile key={tile.n} tile={tile} />
        ))}
      </motion.div>
    </Sections>
  );
}
