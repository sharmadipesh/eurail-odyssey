"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const TWENTYTHREE_BASE =
  "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-23";
// Tiles backed by an .mp4; the rest stay .png stills.
const VIDEO_IDS = new Set([3, 4, 7]);

// `ar` = true source aspect ratio (w/h) so each tile shows uncropped.
// Columns mirror the reference board: a staggered, six-column collage with
// the two tall clips anchoring the centre and the wide clip lower-left.
type TileDef = { n: number; ar: number };
const COLUMNS: { flex: number; tiles: TileDef[] }[] = [
  { flex: 2.5, tiles: [{ n: 1, ar: 374 / 468 }, { n: 7, ar: 496 / 372 }] },
  { flex: 2.4, tiles: [{ n: 2, ar: 424 / 530 }, { n: 5, ar: 406 / 540 }] },
  { flex: 2.8, tiles: [{ n: 3, ar: 454 / 808 }] },
  { flex: 2.9, tiles: [{ n: 4, ar: 454 / 808 }] },
  { flex: 2.2, tiles: [{ n: 8, ar: 326 / 326 }, { n: 6, ar: 360 / 540 }] },
  { flex: 2.0, tiles: [{ n: 9, ar: 342 / 514 }, { n: 10, ar: 400 / 310 }] },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

function Tile({ n, ar }: TileDef) {
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
  const downloadHref = `/api/moodboard-download?dir=section-23&file=${fileName}`;

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      onMouseEnter={isVideo ? previewOnEnter : undefined}
      onMouseLeave={isVideo ? resetOnLeave : undefined}
      style={{ aspectRatio: ar }}
      className="group relative w-full cursor-pointer overflow-hidden rounded-[8px] ring-1 ring-[#1B2040]/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[filter,box-shadow] duration-500 hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.5)] group-hover/collage:brightness-[0.6] group-hover/collage:grayscale-[0.2] hover:!brightness-100 hover:!grayscale-0"
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={`${TWENTYTHREE_BASE}/${n}.mp4`}
          poster={`${TWENTYTHREE_BASE}/${n}.png`}
          loop
          muted
          playsInline
          preload="metadata"
          onClick={enableSound}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <Image
          src={`${TWENTYTHREE_BASE}/${n}.png`}
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
          className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
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

export default function Section23() {
  return (
    <Sections group="art"
      style={{
        container: "px-8!",
        children: "flex min-h-[90vh] items-center justify-center",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="group/collage mx-auto flex w-full max-w-[1680px] flex-wrap items-start justify-center gap-3 lg:flex-nowrap"
      >
        {COLUMNS.map((col, ci) => (
          <motion.div
            key={ci}
            variants={group}
            className="flex min-w-[120px] flex-col gap-3"
            style={{ flexGrow: col.flex, flexBasis: col.flex * 60 }}
          >
            {col.tiles.map((t) => (
              <Tile key={t.n} {...t} />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </Sections>
  );
}
