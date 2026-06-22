"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

/* An explicit 12-col × 6-row mosaic (desktop) that mirrors the design board:
 * two tall portraits anchor the left, a top band, a staggered middle band,
 * and a bottom band. `place` carries the desktop grid cell plus the mobile
 * aspect/span; `play` overlays a play button on the clips. */
type Tile = { n: number; place: string; play?: boolean };

const TILES: Tile[] = [
  // left — two tall portraits, each spanning into the middle band (staggered)
  { n: 1, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:1/3] lg:[grid-row:1/4]" },
  { n: 2, place: "aspect-[3/4] lg:aspect-auto lg:[grid-column:3/5] lg:[grid-row:1/4]", play: true },
  // top band
  { n: 3, place: "aspect-[3/4] lg:aspect-auto lg:[grid-column:5/6] lg:[grid-row:1/3]", play: true },
  { n: 4, place: "col-span-2 aspect-[4/3] lg:aspect-auto lg:[grid-column:6/8] lg:[grid-row:1/3]" },
  { n: 5, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:8/10] lg:[grid-row:1/3]" },
  { n: 6, place: "aspect-[4/3] lg:aspect-auto lg:[grid-column:10/11] lg:[grid-row:1/3]", play: true },
  { n: 7, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:11/13] lg:[grid-row:1/3]", play: true },
  // middle band
  { n: 10, place: "col-span-2 aspect-[4/3] lg:aspect-auto lg:[grid-column:5/7] lg:[grid-row:3/5]", play: true },
  { n: 11, place: "aspect-square lg:aspect-auto lg:[grid-column:7/8] lg:[grid-row:3/5]", play: true },
  { n: 12, place: "aspect-[3/4] lg:aspect-auto lg:[grid-column:8/9] lg:[grid-row:3/5]", play: true },
  { n: 13, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:9/11] lg:[grid-row:3/5]" },
  { n: 14, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:11/13] lg:[grid-row:3/5]", play: true },
  // bottom-left — two portraits under the anchors
  { n: 8, place: "aspect-[3/4] lg:aspect-auto lg:[grid-column:1/3] lg:[grid-row:4/7]" },
  { n: 9, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:3/5] lg:[grid-row:4/7]", play: true },
  // bottom band
  { n: 15, place: "col-span-2 aspect-[4/3] lg:aspect-auto lg:[grid-column:5/7] lg:[grid-row:5/7]", play: true },
  { n: 16, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:7/8] lg:[grid-row:5/7]" },
  { n: 17, place: "col-span-2 aspect-video lg:aspect-auto lg:[grid-column:8/10] lg:[grid-row:5/7]", play: true },
  { n: 18, place: "aspect-[4/5] lg:aspect-auto lg:[grid-column:10/11] lg:[grid-row:5/7]" },
  { n: 19, place: "col-span-2 aspect-[4/3] lg:aspect-auto lg:[grid-column:11/13] lg:[grid-row:5/7]", play: true },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

function PlayBadge() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/35 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40">
        <svg width="13" height="15" viewBox="0 0 15 17" fill="none" className="ml-[2px]" aria-hidden>
          <path d="M0 0L15 8.5L0 17V0Z" fill="white" fillOpacity="0.95" />
        </svg>
      </span>
    </div>
  );
}

function MosaicTile({ tile }: { tile: Tile }) {
  return (
    <motion.div
      variants={item}
      className={`group relative cursor-pointer overflow-hidden rounded-[6px] ring-1 ring-[#1B2040]/[0.06] ${tile.place}`}
    >
      <Image
        src={`/images/video/section-15/${tile.n}.png`}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      {tile.play && <PlayBadge />}
    </motion.div>
  );
}

export default function Section15() {
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
        className="mx-auto grid w-full max-w-[1640px] grid-cols-2 gap-2.5 sm:grid-cols-4 lg:h-[clamp(440px,64vh,580px)] lg:grid-cols-12 lg:[grid-template-rows:repeat(6,minmax(0,1fr))]"
      >
        {TILES.map((tile) => (
          <MosaicTile key={tile.n} tile={tile} />
        ))}
      </motion.div>
    </Sections>
  );
}
