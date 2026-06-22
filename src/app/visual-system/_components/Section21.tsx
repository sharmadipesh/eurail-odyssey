"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const TWENTYONE_BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-21";
// Tiles backed by an .mp4; the rest stay .png stills.
const VIDEO_IDS = new Set([2, 3, 4, 5, 6, 7, 9, 13, 14]);

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = VIDEO_IDS.has(tile.n);

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

  const fileName = `${tile.n}.mp4`;
  const downloadHref = `/api/moodboard-download?dir=section-21&file=${fileName}`;

  return (
    <motion.div
      variants={item}
      onMouseEnter={isVideo ? previewOnEnter : undefined}
      onMouseLeave={isVideo ? resetOnLeave : undefined}
      className={`group relative cursor-pointer overflow-hidden rounded-[8px] ring-1 ring-[#1B2040]/[0.06] ${tile.place}`}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={`${TWENTYONE_BASE}/${tile.n}.mp4`}
          poster={`${TWENTYONE_BASE}/${tile.n}.png`}
          loop
          muted
          playsInline
          preload="metadata"
          onClick={enableSound}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <Image
          src={`${TWENTYONE_BASE}/${tile.n}.png`}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

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
          className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.55)] ring-1 ring-white/25 backdrop-blur-md transition-[opacity,background-color] duration-300 ease-out hover:bg-black/90 group-hover:opacity-100"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
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

      {/* play badge — video tiles only, visible at rest, recedes on hover */}
      {isVideo && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/25 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/45 backdrop-blur-md transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-90">
            <svg
              viewBox="0 0 24 24"
              className="h-[17px] w-[17px] translate-x-[1.5px] fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
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
