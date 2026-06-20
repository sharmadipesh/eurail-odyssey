"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
} from "framer-motion";

import Sections from "./Sections";
import { EASE } from "./reveal";

type Row = { id: string; name: string; desc: string };
type Shot = { src: string; w: number; h: number };

const CONTENT: Row[] = [
  { id: "1", name: "THE TRIP", desc: "THE WINDOW" },
  { id: "2", name: "THE TRIP", desc: "THE IN-BETWEEN" },
  { id: "3", name: "THE TRIP", desc: "TRAIN" },
  { id: "4", name: "THE TRIP", desc: "THE LIGHT" },
  { id: "5", name: "THE TRIP", desc: "CITY CHAPTERS" },
  { id: "6", name: "DISCOVERY", desc: "THE LOCAL EFFECT" },
  { id: "7", name: "DISCOVERY", desc: "THE UNGUARDED" },
  { id: "8", name: "TRANSFORMATION", desc: "THE ENCOUNTER" },
  { id: "9", name: "TRANSFORMATION", desc: "FRAGMENTS" },
  { id: "10", name: "COMMUNITY", desc: "THE BELONGING" },
  { id: "11", name: "HERITAGE", desc: "THE ORIGIN" },
];

// Real pixel dimensions so next/image keeps each shot's natural aspect ratio.
const SHOTS: Shot[] = [
  { src: "/images/moodboard/1.png", w: 400, h: 266 },
  { src: "/images/moodboard/2.png", w: 150, h: 268 },
  { src: "/images/moodboard/3.png", w: 358, h: 268 },
  { src: "/images/moodboard/4.png", w: 306, h: 384 },
  { src: "/images/moodboard/5.png", w: 452, h: 254 },
  { src: "/images/moodboard/6.png", w: 340, h: 254 },
  { src: "/images/moodboard/7.png", w: 338, h: 254 },
  { src: "/images/moodboard/8.png", w: 322, h: 182 },
  { src: "/images/moodboard/9.png", w: 324, h: 182 },
  { src: "/images/moodboard/10.png", w: 282, h: 378 },
  { src: "/images/moodboard/11.png", w: 504, h: 378 },
  { src: "/images/moodboard/12.png", w: 384, h: 288 },
  { src: "/images/moodboard/13.png", w: 382, h: 288 },
  { src: "/images/moodboard/14.png", w: 114, h: 288 },
  { src: "/images/moodboard/15.png", w: 228, h: 288 },
  { src: "/images/moodboard/16.png", w: 230, h: 290 },
  { src: "/images/moodboard/17.png", w: 224, h: 290 },
  { src: "/images/moodboard/18.png", w: 200, h: 268 },
  { src: "/images/moodboard/19.png", w: 216, h: 288 },
];

// Fisher–Yates — re-arranges the moodboard so it lands differently each load.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sequence timing (ms): left reveal → wordmark → grid.
const T_WORDMARK = 1500;
const T_GRID = 3100;

const leftContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const rowVar: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const lineVar: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: 0.12 } },
};
const gridContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const gridItem: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

export default function SectionFour() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [phase, setPhase] = useState<"intro" | "wordmark" | "grid">("intro");
  // Shuffle the moodboard on mount so it lands in a fresh arrangement each load.
  const [shots, setShots] = useState<Shot[]>(SHOTS);
  useEffect(() => setShots(shuffle(SHOTS)), []);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase("wordmark"), T_WORDMARK);
    const t2 = setTimeout(() => setPhase("grid"), T_GRID);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView]);

  return (
    <Sections style={{ children: "flex min-h-[85vh] items-center" }}>
      <div
        ref={ref}
        className="flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:gap-[clamp(32px,4vw,72px)]"
      >
        {/* Left — connected name → line → desc rows */}
        <motion.div
          variants={leftContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="w-full shrink-0 space-y-[32px] lg:w-[46%]"
        >
          {CONTENT.map((row) => (
            <motion.div
              key={row.id}
              variants={rowVar}
              className="flex items-center gap-4 whitespace-nowrap font-mono text-[18px] font-normal uppercase leading-none tracking-[0.15em] text-black"
            >
              <span className="flex w-[290px] shrink-0 items-center gap-3">
                <span>{row.name}</span>
                <motion.span
                  variants={lineVar}
                  className="h-px flex-1 origin-left bg-[#8692B7]"
                />
              </span>
              <span>{row.desc}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Right — wordmark, then image grid */}
        <div className="relative min-h-[58vh] flex-1">
          <AnimatePresence mode="wait">
            {phase === "wordmark" && (
              <motion.div
                key="wordmark"
                initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
                transition={{ duration: 0.85, ease: EASE }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <h2 className="text-center font-sans text-[clamp(32px,6vw,72px)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-ink">
                  MoodBoard
                </h2>
              </motion.div>
            )}

            {phase === "grid" && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div className="mb-3 flex justify-end">
                  <span className="font-mono text-[13px] uppercase tracking-[0.22em] text-ink">
                    Moodboard
                  </span>
                </div>
                <motion.div
                  variants={gridContainer}
                  initial="hidden"
                  animate="show"
                  className="group/grid columns-3 gap-2 lg:columns-4 xl:columns-5 [&>*]:mb-2"
                >
                  {shots.map((shot, i) => (
                    <motion.div
                      key={shot.src}
                      variants={gridItem}
                      whileHover={{ y: -8, scale: 1.035 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      className="group relative block break-inside-avoid overflow-hidden rounded-md shadow-sm ring-1 ring-black/5 transition-[filter,box-shadow] duration-500 hover:z-10 hover:shadow-[0_18px_44px_-14px_rgba(27,32,64,0.5)] group-hover/grid:brightness-[0.62] group-hover/grid:grayscale-[0.35] hover:!brightness-100 hover:!grayscale-0"
                    >
                      <Image
                        src={shot.src}
                        alt=""
                        width={shot.w}
                        height={shot.h}
                        sizes="(max-width: 1024px) 33vw, 18vw"
                        className="h-auto w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.12]"
                      />
                      {/* gradient + label fade in on hover */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-2.5 left-3 flex translate-y-2 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/95 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        {String(i + 1).padStart(2, "0")}
                        <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Sections>
  );
}
