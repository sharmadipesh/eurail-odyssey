"use client";

import Image from "next/image";
import classNames from "classnames";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const collage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const tileVar: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function PlayButton() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.span
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/40 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40"
      >
        <svg width="13" height="15" viewBox="0 0 15 17" fill="none" className="ml-[2px]" aria-hidden>
          <path d="M0 0L15 8.5L0 17V0Z" fill="white" fillOpacity="0.95" />
        </svg>
      </motion.span>
    </div>
  );
}

function Tile({
  n,
  play,
  title,
  titlePos = "bottom",
  className,
}: {
  n: string;
  play?: boolean;
  title?: string;
  titlePos?: "center" | "bottom";
  className?: string;
}) {
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
        src={`/images/video/section-7/${n}.png`}
        alt=""
        fill
        sizes="(max-width: 1024px) 45vw, 20vw"
        className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
      />
      {/* soft vignette for legibility of play button / titles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
      />

      {title && titlePos === "center" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center">
          <motion.span
            variants={tileVar}
            className="font-serif text-[clamp(15px,1.5vw,23px)] italic text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
          >
            {title}
          </motion.span>
        </div>
      )}
      {title && titlePos === "bottom" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3 text-center">
          <motion.span
            variants={tileVar}
            className="font-serif text-[clamp(10px,0.95vw,14px)] italic text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
          >
            {title}
          </motion.span>
        </div>
      )}

      {play && <PlayButton />}
    </motion.div>
  );
}

export default function SectionSeven() {
  return (
    <Sections
      style={{ container: "px-8!", children: "flex min-h-[88vh] items-center justify-center" }}
    >
      <motion.div
        variants={collage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="group/collage mx-auto grid h-[clamp(360px,56vh,480px)] w-full max-w-[1320px] grid-cols-[2.4fr_2.4fr_3.3fr_2fr_2.85fr] gap-[10px]"
      >
        {/* tall portrait */}
        <Tile n="1" play />
        {/* tall portrait */}
        <Tile n="2" play />

        {/* centre — wide title frame over a two-up row */}
        <motion.div variants={group} className="flex min-w-0 flex-col gap-[10px]">
          <Tile n="3" play title="The art of still frames" titlePos="center" className="flex-[1.55]" />
          <motion.div variants={group} className="flex min-h-0 flex-1 gap-[10px]">
            <Tile n="4" className="flex-[2.6]" />
            <Tile n="5" className="flex-1" />
          </motion.div>
        </motion.div>

        {/* tall portrait */}
        <Tile n="6" play />

        {/* right — wide title frame over a two-up row */}
        <motion.div variants={group} className="flex min-w-0 flex-col gap-[10px]">
          <Tile
            n="7"
            play
            title="September 20, 7:40 PM on the Empire Builder"
            titlePos="bottom"
            className="flex-[1.4]"
          />
          <motion.div variants={group} className="flex min-h-0 flex-1 gap-[10px]">
            <Tile n="8" className="flex-1" />
            <Tile n="9" className="flex-[1.45]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </Sections>
  );
}
