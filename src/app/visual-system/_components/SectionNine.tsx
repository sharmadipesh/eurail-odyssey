"use client";

import Image from "next/image";
import classNames from "classnames";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const collage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
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

type TitlePos = "stationCenter" | "bottomLeft";

function Tile({
  n,
  play,
  title,
  titlePos,
  className,
}: {
  n: string;
  play?: boolean;
  title?: string;
  titlePos?: TitlePos;
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
        src={`/images/video/section-9/${n}.png`}
        alt=""
        fill
        sizes="(max-width: 1024px) 40vw, 16vw"
        className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
      />

      {title && titlePos === "stationCenter" && (
        <div className="pointer-events-none absolute inset-x-0 top-[16%] flex flex-col items-center gap-2 text-center">
          <span className="h-px w-8 bg-white/55" />
          <span className="font-serif text-[clamp(12px,1.25vw,19px)] uppercase tracking-[0.26em] text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {title}
          </span>
        </div>
      )}
      {title && titlePos === "bottomLeft" && (
        <div className="pointer-events-none absolute bottom-0 left-0 max-w-[80%] p-3">
          <span className="font-serif text-[clamp(12px,1.05vw,17px)] italic leading-tight text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
            {title}
          </span>
        </div>
      )}

      {play && <PlayButton />}
    </motion.div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={tileVar}
      className="flex items-center gap-2 font-sans text-[13px] font-normal text-[#1B2040]/85"
    >
      <span className="inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-[#1B2040]/60" />
      <span>{children}</span>
    </motion.div>
  );
}

const COL = "flex min-w-0 flex-col gap-[10px]";

export default function SectionNine() {
  return (
    <Sections
      style={{ container: "px-8!", children: "flex min-h-[88vh] items-center justify-center" }}
    >
      <motion.div
        variants={collage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-[1640px]"
      >
        {/* the collage */}
        <motion.div
          variants={group}
          className="group/collage flex h-[clamp(420px,58vh,560px)] gap-[10px]"
        >
          {/* GROUP 1 — the missed connection */}
          <motion.div variants={group} className="flex min-w-0 flex-[1.55] gap-[10px]">
            <motion.div variants={group} className={classNames(COL, "flex-[2]")}>
              <Tile n="1" play className="flex-1" />
              <Tile n="2" play className="flex-1" />
              <Tile n="3" play className="flex-1" />
            </motion.div>
            <motion.div variants={group} className={classNames(COL, "flex-1")}>
              <Tile n="4" play className="flex-1" />
              <Tile n="5" play className="flex-1" />
            </motion.div>
            <motion.div variants={group} className={classNames(COL, "flex-1")}>
              <Tile n="6" play className="flex-1" />
              <Tile n="7" play title="Munich subway" titlePos="bottomLeft" className="flex-1" />
            </motion.div>
          </motion.div>

          {/* GROUP 2 — in anticipation */}
          <motion.div variants={group} className="flex min-w-0 flex-[2.65] flex-col gap-[10px]">
            <motion.div variants={group} className="flex min-h-0 flex-1 gap-[10px]">
              <Tile n="8" play title="TRAIN STATION" titlePos="stationCenter" className="flex-[2.6]" />
              <Tile n="9" className="flex-1" />
              <Tile n="10" className="flex-1" />
              <Tile n="11" className="flex-1" />
            </motion.div>
            <motion.div variants={group} className="flex min-h-0 flex-1 gap-[10px]">
              <Tile n="12" className="flex-1" />
              <Tile n="13" className="flex-1" />
              <Tile n="14" className="flex-1" />
              <Tile n="15" className="flex-[2.4]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* captions */}
        <motion.div variants={group} className="mt-3.5 flex gap-[10px]">
          <div className="min-w-0 flex-[1.55]">
            <Caption>The missed connection [scene]</Caption>
          </div>
          <div className="min-w-0 flex-[2.65]">
            <Caption>In anticipation early [morning vs night]</Caption>
          </div>
        </motion.div>
      </motion.div>
    </Sections>
  );
}
