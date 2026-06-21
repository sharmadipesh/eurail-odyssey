"use client";

import Image from "next/image";
import classNames from "classnames";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const collage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const tileVar: Variants = {
  hidden: { opacity: 0, scale: 0.93, y: 18 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

function PlayButton() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.span
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/40 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40"
      >
        <svg width="12" height="14" viewBox="0 0 15 17" fill="none" className="ml-[2px]" aria-hidden>
          <path d="M0 0L15 8.5L0 17V0Z" fill="white" fillOpacity="0.95" />
        </svg>
      </motion.span>
    </div>
  );
}

function Tile({ n, play, className }: { n: string; play?: boolean; className?: string }) {
  return (
    <motion.div
      variants={tileVar}
      whileHover={{ scale: 1.015, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={classNames(
        "group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[10px] ring-1 ring-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[filter,box-shadow] duration-500 hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.5)] group-hover/collage:brightness-[0.6] group-hover/collage:grayscale-[0.25] hover:!brightness-100 hover:!grayscale-0",
        className,
      )}
    >
      <Image
        src={`/images/video/section-11/${n}.png`}
        alt=""
        fill
        sizes="(max-width: 1024px) 45vw, 18vw"
        className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10"
      />
      {play && <PlayButton />}
    </motion.div>
  );
}

export default function Section11() {
  return (
    <Sections
      style={{ container: "px-8!", children: "flex min-h-[88vh] items-center justify-center" }}
    >
      <motion.div
        variants={collage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="group/collage mx-auto grid h-[clamp(420px,58vh,560px)] w-full max-w-[1640px] grid-cols-[1.45fr_1.45fr_1fr_1.55fr_1fr_1fr] gap-[10px]"
      >
        {/* tall portrait */}
        <Tile n="1" play />
        {/* tall portrait */}
        <Tile n="2" play />

        {/* column — tall over short */}
        <motion.div variants={group} className="flex min-w-0 flex-col gap-[10px]">
          <Tile n="3" play className="flex-[2.4]" />
          <Tile n="4" play className="flex-1" />
        </motion.div>

        {/* tall portrait */}
        <Tile n="5" play />

        {/* column — even pair */}
        <motion.div variants={group} className="flex min-w-0 flex-col gap-[10px]">
          <Tile n="6" className="flex-1" />
          <Tile n="7" className="flex-1" />
        </motion.div>

        {/* column — even pair */}
        <motion.div variants={group} className="flex min-w-0 flex-col gap-[10px]">
          <Tile n="8" className="flex-1" />
          <Tile n="9" className="flex-1" />
        </motion.div>
      </motion.div>
    </Sections>
  );
}
