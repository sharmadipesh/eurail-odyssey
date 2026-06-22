"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

/* Each tile is a still or a short film. The `play` flag overlays a play
 * button on the clips; everything else is a plain photograph. Aspect ratios
 * are taken from the source assets so nothing is cropped or distorted. */
type Tile = { n: number; ratio: number; play?: boolean };

const TILES: Tile[] = [
  { n: 1, ratio: 306 / 382 },
  { n: 2, ratio: 284 / 380, play: true },
  { n: 3, ratio: 204 / 272, play: true },
  { n: 4, ratio: 312 / 234 },
  { n: 5, ratio: 418 / 234 },
  { n: 6, ratio: 310 / 232, play: true },
  { n: 7, ratio: 474 / 266, play: true },
  { n: 8, ratio: 296 / 394 },
  { n: 9, ratio: 316 / 394 },
  { n: 10, ratio: 312 / 236, play: true },
  { n: 11, ratio: 246 / 236, play: true },
  { n: 12, ratio: 176 / 236 },
  { n: 13, ratio: 420 / 236 },
  { n: 14, ratio: 488 / 274, play: true },
  { n: 15, ratio: 392 / 294, play: true },
  { n: 16, ratio: 234 / 294 },
  { n: 17, ratio: 522 / 294, play: true },
  { n: 18, ratio: 182 / 226 },
  { n: 19, ratio: 302 / 226, play: true },
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
      className="group relative mb-2.5 block w-full cursor-pointer overflow-hidden rounded-[6px] ring-1 ring-[#1B2040]/[0.06] break-inside-avoid"
      style={{ aspectRatio: tile.ratio }}
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
        className="mx-auto w-full max-w-[1640px] columns-2 gap-2.5 sm:columns-3 lg:columns-7"
      >
        {TILES.map((tile) => (
          <MosaicTile key={tile.n} tile={tile} />
        ))}
      </motion.div>
    </Sections>
  );
}
