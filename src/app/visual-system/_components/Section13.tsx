"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import classNames from "classnames";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const THIRTEEN_BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-13";
// Tiles backed by an .mp4; the rest stay .png stills.
const VIDEO_IDS = new Set([
  1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15, 16, 22, 23, 24, 25,
]);

type T = { n: number; a: number; label?: string };

// Three justified rows. `a` = aspect ratio (w/h) → used as the flex weight so
// every image keeps its shape while each row fills the width at one height.
const ROW1: T[] = [
  { n: 1, a: 1.333 },
  { n: 2, a: 1.333 },
  { n: 3, a: 1.333 },
  { n: 4, a: 1.333 },
  { n: 5, a: 0.802 },
  { n: 6, a: 0.802 },
  { n: 7, a: 0.746 },
  { n: 8, a: 0.746 },
  { n: 9, a: 0.683 },
  { n: 10, a: 0.675 },
];
const ROW2: T[] = [
  { n: 11, a: 1.333 },
  { n: 12, a: 1.333, label: "AMSTERDAM" },
  { n: 13, a: 1.508 },
  { n: 14, a: 1.333 },
  { n: 15, a: 1.5 },
  { n: 16, a: 1.333, label: "MILANO" },
  { n: 17, a: 0.746 },
  { n: 18, a: 0.746 },
];
const ROW3: T[] = [
  { n: 19, a: 0.75 },
  { n: 20, a: 0.798 },
  { n: 21, a: 0.75 },
  { n: 22, a: 0.75 },
  { n: 23, a: 1.331 },
  { n: 24, a: 1.331 },
  { n: 25, a: 0.798 },
  { n: 26, a: 0.798 },
  { n: 27, a: 0.75 },
  { n: 28, a: 0.752 },
  { n: 29, a: 0.798 },
];

const TOP_LABELS = [
  { t: "LONDON", w: 1.333 },
  { t: "COPENHAGEN", w: 1.333 },
  { t: "PARIS", w: 2.666 },
  { t: "BRUSSELS", w: 4.454 },
];
const BOTTOM_LABELS = [
  { t: "BARCELONA", w: 3.048, center: false },
  { t: "ROME", w: 2.662, center: true },
  { t: "BERLIN", w: 3.896, center: true },
];

const collage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};
const tileVar: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function Tile({ n, a, label }: T) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = VIDEO_IDS.has(n);

  // Pin muted via the ref so the hover preview can autoplay (autoplay policy).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  // Hover = silent preview; click = unmute + play with audio.
  const previewOnEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    void v.play().catch(() => {});
  };
  const resetOnLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    v.muted = true;
  };
  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    void v.play().catch(() => {});
  };

  const fileName = `${n}.mp4`;
  const downloadHref = `/api/moodboard-download?dir=section-13&file=${fileName}`;

  return (
    <motion.div
      variants={tileVar}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      style={{ flexGrow: a, flexBasis: 0 }}
      onMouseEnter={isVideo ? previewOnEnter : undefined}
      onMouseLeave={isVideo ? resetOnLeave : undefined}
      className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[4px] ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-[filter,box-shadow] duration-500 hover:shadow-[0_14px_36px_-14px_rgba(0,0,0,0.5)] group-hover/collage:brightness-[0.62] group-hover/collage:grayscale-[0.2] hover:!brightness-100 hover:!grayscale-0"
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={`${THIRTEEN_BASE}/${n}.mp4`}
          poster={`${THIRTEEN_BASE}/${n}.png`}
          loop
          muted
          playsInline
          preload="metadata"
          onClick={enableSound}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
        />
      ) : (
        <Image
          src={`${THIRTEEN_BASE}/${n}.png`}
          alt=""
          fill
          sizes="(max-width: 1024px) 30vw, 14vw"
          className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5"
      />

      {/* download button — video tiles only, fades in on hover (matches moodboard) */}
      {isVideo && (
        <motion.a
          href={downloadHref}
          download={fileName}
          onClick={(e) => e.stopPropagation()}
          aria-label="Download video"
          initial={false}
          whileHover={{ scale: 1.28 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 420, damping: 18, mass: 0.7 }}
          className="absolute right-1.5 top-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.55)] ring-1 ring-white/25 backdrop-blur-md transition-[opacity,background-color] duration-300 ease-out hover:bg-black/90 group-hover:opacity-100"
        >
          <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 2.5v7m0 0 2.75-2.75M8 9.5 5.25 6.75M3 12.5h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      )}

      {label && (
        <div className="pointer-events-none absolute bottom-1.5 left-2 z-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#F5C518] drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
            {label}
          </span>
        </div>
      )}

      {/* play badge — video tiles only, visible at rest, recedes on hover */}
      {isVideo && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/45 backdrop-blur-md transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-90">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 translate-x-[1.5px] fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}
    </motion.div>
  );
}

function Row({ tiles }: { tiles: T[] }) {
  return (
    <motion.div variants={group} className="flex h-[clamp(132px,16.5vh,186px)] gap-2">
      {tiles.map((t) => (
        <Tile key={t.n} {...t} />
      ))}
    </motion.div>
  );
}

function Label({ t, w, center }: { t: string; w: number; center?: boolean }) {
  return (
    <motion.span
      variants={tileVar}
      style={{ flexGrow: w, flexBasis: 0 }}
      className={classNames(
        "min-w-0 font-mono text-[12px] uppercase tracking-[0.14em] text-[#1B2040]/80",
        center && "text-center",
      )}
    >
      {t}
    </motion.span>
  );
}

export default function Section13() {
  return (
    <Sections
      style={{ container: "px-8!", children: "flex min-h-[90vh] items-center justify-center" }}
    >
      <motion.div
        variants={collage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="group/collage mx-auto flex w-full max-w-[1700px] flex-col gap-[10px]"
      >
        {/* top city labels */}
        <motion.div variants={group} className="flex gap-2 px-1">
          {TOP_LABELS.map((l) => (
            <Label key={l.t} {...l} />
          ))}
        </motion.div>

        <Row tiles={ROW1} />
        <Row tiles={ROW2} />
        <Row tiles={ROW3} />

        {/* bottom city labels */}
        <motion.div variants={group} className="flex gap-2 px-1">
          {BOTTOM_LABELS.map((l) => (
            <Label key={l.t} {...l} />
          ))}
        </motion.div>
      </motion.div>
    </Sections>
  );
}
