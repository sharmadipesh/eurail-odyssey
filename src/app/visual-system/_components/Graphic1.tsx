"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

import Head from "./Head";
import { BOOKMARKS } from "./bookmarks";
import { EASE, revealUp } from "./reveal";

const BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-26";

// `span` widens the one landscape frame to two columns so the 8×2 grid fills
// exactly (2 + 14 = 16 cells) with no gaps. Tiles crop to their cell, so the
// board height is driven by the available space, never by the images.
type Shot = { n: number; span?: boolean };
const SHOTS: Shot[] = [
  { n: 1, span: true },
  { n: 2 },
  { n: 3 },
  { n: 4 },
  { n: 5 },
  { n: 6 },
  { n: 7 },
  { n: 8 },
  { n: 9 },
  { n: 10 },
  { n: 11 },
  { n: 12 },
  { n: 13 },
  { n: 14 },
  { n: 15 },
];

// Two design-grammar columns from the reference, kept as crisp, on-point copy.
const COPY: string[] = [
  "The brand's design grammar combination of: typography, grids, the yellow accent rule, the underline as a signature. Editorial more than commercial. Confident enough to leave white space. Yellow underlines beneath proper nouns and highlights. Mono for technical labels and metadata. Master type for content and display.",
  "Numbers and breadcrumbs in mono caps. Crisp on point text and no long parahs. Play with paper textures, soft grains, subtle gradients to give the graphic weight, never flat, never digital-cold. White space and negative areas treated as a core brand principle.",
];

const gridContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const gridItem: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};
const textGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

function Tile({ shot }: { shot: Shot }) {
  return (
    <motion.div
      variants={gridItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`group relative overflow-hidden rounded-[6px] shadow-sm ring-1 ring-[#1B2040]/[0.06] transition-[box-shadow,filter] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:shadow-[0_18px_36px_-14px_rgba(20,24,48,0.5)] group-hover/collage:brightness-[0.7] hover:!brightness-100 ${
        shot.span ? "col-span-2" : ""
      }`}
    >
      <Image
        src={`${BASE}/${shot.n}.png`}
        alt=""
        fill
        sizes="(max-width: 640px) 25vw, (max-width: 1024px) 17vw, 13vw"
        className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </motion.div>
  );
}

export default function Graphic1() {
  return (
    <div className="flex h-screen flex-col bg-white px-14 py-10">
      <Head chips={BOOKMARKS.graphics} />

      <div className="mx-auto mt-6 flex min-h-0 w-full max-w-[1640px] flex-1 flex-col gap-[clamp(20px,3vh,36px)]">
        {/* Moodboard — fills the space left over, fixed grid so it never overflows */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="group/collage grid min-h-0 flex-1 grid-cols-4 grid-rows-4 gap-2.5 sm:grid-cols-6 sm:grid-rows-3 lg:grid-cols-8 lg:grid-rows-2"
        >
          {SHOTS.map((shot) => (
            <Tile key={shot.n} shot={shot} />
          ))}
        </motion.div>

        {/* Design grammar — two crisp columns, editorial body copy */}
        <motion.div
          variants={textGroup}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="grid shrink-0 grid-cols-1 gap-x-[clamp(48px,7vw,120px)] gap-y-4 md:grid-cols-2"
        >
          {COPY.map((para, i) => (
            <motion.p
              key={i}
              variants={revealUp}
              className="max-w-[640px] font-sans text-[15px] font-normal leading-[1.5] text-black"
            >
              {para}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
