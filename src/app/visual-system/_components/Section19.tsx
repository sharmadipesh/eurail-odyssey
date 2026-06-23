"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { playSingle } from "./playSingle";
import { EASE } from "./reveal";

const NINETEEN_BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-19";

/* Two justified rows of stills and short films. `play` marks the clips;
 * `ratio` (from the source asset) drives both the flex weight and the box
 * aspect, so each row fills the width at a uniform height without cropping. */
type Tile = { n: number; ratio: number; play?: boolean };

const ROW_ONE: Tile[] = [
  { n: 1, ratio: 290 / 386 },
  { n: 2, ratio: 582 / 386 },
  { n: 3, ratio: 308 / 386, play: true },
  { n: 4, ratio: 686 / 386, play: true },
  { n: 5, ratio: 288 / 386, play: true },
  { n: 6, ratio: 256 / 384 },
];
const ROW_TWO: Tile[] = [
  { n: 7, ratio: 284 / 378 },
  { n: 8, ratio: 502 / 378, play: true },
  { n: 9, ratio: 302 / 378 },
  { n: 10, ratio: 566 / 378 },
  { n: 11, ratio: 350 / 378 },
  { n: 12, ratio: 302 / 378 },
];

/* Flex-basis seed; nudges wrapping on narrow screens while the proportional
 * grow keeps natural aspect ratios on a single justified row. */
const BASIS = 120;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

function Tile({ tile }: { tile: Tile }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = !!tile.play;

  // Pin muted via the ref so the hover preview can autoplay (autoplay policy).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  const previewOnEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    // Hover = play WITH audio. Browsers block unmuted autoplay until the page
    // has a user gesture, so fall back to a muted preview if sound is denied.
    v.muted = false;
    v.volume = 1;
    playSingle(v).catch(() => {
      v.muted = true;
      void playSingle(v).catch(() => {});
    });
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
    void playSingle(v).catch(() => {});
  };

  const fileName = `${tile.n}.mp4`;
  const downloadHref = `/api/moodboard-download?dir=section-19&file=${fileName}`;

  return (
    <motion.div
      variants={item}
      onMouseEnter={isVideo ? previewOnEnter : undefined}
      onMouseLeave={isVideo ? resetOnLeave : undefined}
      className="group relative cursor-pointer overflow-hidden rounded-[8px] ring-1 ring-[#1B2040]/[0.06]"
      style={{ flexGrow: tile.ratio, flexBasis: tile.ratio * BASIS, aspectRatio: tile.ratio }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={`${NINETEEN_BASE}/${tile.n}.mp4`}
          poster={`${NINETEEN_BASE}/${tile.n}.png`}
          loop
          muted
          playsInline
          preload="none"
          onClick={enableSound}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <Image
          src={`${NINETEEN_BASE}/${tile.n}.png`}
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
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

      {/* play badge — video tiles only, bottom-left, recedes on hover */}
      {isVideo && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-3 opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
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
        </div>
      )}
    </motion.div>
  );
}

function Row({ tiles }: { tiles: Tile[] }) {
  return (
    <motion.div variants={row} className="flex flex-wrap justify-center gap-2.5 lg:flex-nowrap">
      {tiles.map((t) => (
        <Tile key={t.n} tile={t} />
      ))}
    </motion.div>
  );
}

export default function Section19() {
  return (
    <Sections group="art"
      style={{
        container: "px-8!",
        children: "flex min-h-[90vh] items-center",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto flex w-full max-w-[1720px] flex-col gap-2.5"
      >
        <Row tiles={ROW_ONE} />
        <Row tiles={ROW_TWO} />
      </motion.div>
    </Sections>
  );
}
