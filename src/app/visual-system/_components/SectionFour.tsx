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
import { playSingle } from "./playSingle";
import { loadPoster } from "./posterQueue";
import { EASE } from "./reveal";

type Row = { id: string; name: string; desc: string };
type Shot = { src: string; w: number; h: number; video?: boolean };

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

// Public R2 bucket base for the moodboard shots.
const MOODBOARD_BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/moodboard";

// These numbers are .mp4 clips rather than .png stills.
const VIDEO_IDS = new Set([2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

// Real pixel dimensions so each shot keeps its natural aspect ratio.
const RAW: { n: number; w: number; h: number }[] = [
  { n: 1, w: 400, h: 266 },
  { n: 2, w: 150, h: 268 },
  { n: 3, w: 358, h: 268 },
  { n: 4, w: 306, h: 384 },
  { n: 5, w: 452, h: 254 },
  { n: 6, w: 340, h: 254 },
  { n: 7, w: 338, h: 254 },
  { n: 8, w: 322, h: 182 },
  { n: 9, w: 324, h: 182 },
  { n: 10, w: 282, h: 378 },
  { n: 11, w: 504, h: 378 },
  { n: 12, w: 384, h: 288 },
  { n: 13, w: 382, h: 288 },
  { n: 14, w: 114, h: 288 },
  { n: 15, w: 228, h: 288 },
  { n: 16, w: 230, h: 290 },
  { n: 17, w: 224, h: 290 },
  { n: 18, w: 200, h: 268 },
  { n: 19, w: 216, h: 288 },
];

const SHOTS: Shot[] = RAW.map(({ n, w, h }) => {
  const video = VIDEO_IDS.has(n);
  return {
    src: `${MOODBOARD_BASE}/${n}.${video ? "mp4" : "png"}`,
    w,
    h,
    video,
  };
});

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

function Tile({ shot, index }: { shot: Shot; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // React doesn't reliably set the `muted` DOM property from the JSX attribute,
  // so pin it via the ref. Muted-by-default lets the hover preview autoplay.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  // The very first frame is often black or motion-blurred and reads as a blurry
  // photo rather than a video — seek a little in for a clean resting poster.
  const posterTime = (v: HTMLVideoElement) =>
    Math.min(0.8, (Number.isFinite(v.duration) ? v.duration : 2) / 2);
  const seekToPoster = () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = posterTime(v);
    } catch {}
  };

  // The grid phase mounts all video tiles at once. Rather than each fetching
  // metadata + seek-decoding its poster simultaneously (a main-thread spike),
  // route them through a queue that loads at most a few at a time. The video
  // stays preload="none" until the queue pulls it (see posterQueue.ts).
  useEffect(() => {
    const v = videoRef.current;
    if (v && shot.video) loadPoster(v, seekToPoster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    v.currentTime = posterTime(v);
    v.muted = true;
  };
  // A click is a real user gesture, so we can unmute and play with audio.
  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    void playSingle(v).catch(() => {});
  };

  // The R2 host sends no CORS headers and `download` is ignored cross-origin,
  // so route the download through our same-origin proxy (forces attachment).
  const fileName = shot.src.split("/").pop() || "moodboard.mp4";
  const downloadHref = `/api/moodboard-download?file=${encodeURIComponent(fileName)}`;

  return (
    <motion.div
      variants={gridItem}
      // Pure upward translate (no scale) so the bottom edge clearly rises and
      // leaves a real gap — a layered, downward-cast shadow sells the lift.
      whileHover={{ y: -24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={shot.video ? previewOnEnter : undefined}
      onMouseLeave={shot.video ? resetOnLeave : undefined}
      className="group relative block break-inside-avoid overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5 transition-[box-shadow,filter] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:shadow-[0_30px_55px_-12px_rgba(20,24,48,0.55),0_14px_26px_-10px_rgba(20,24,48,0.4)] group-hover/grid:brightness-[0.58] group-hover/grid:grayscale-[0.4] hover:!brightness-100 hover:!grayscale-0"
    >
      {shot.video ? (
        <video
          ref={videoRef}
          src={`${shot.src}#t=0.8`}
          width={shot.w}
          height={shot.h}
          loop
          playsInline
          // This tile has no poster image — its resting frame is seeked from the
          // video itself. Loading + seeking is deferred to the posterQueue (see
          // the loadPoster effect above) so the ~11 tiles don't all fetch
          // metadata and seek-decode at once when the grid phase appears.
          preload="none"
          onClick={enableSound}
          style={{ aspectRatio: `${shot.w} / ${shot.h}` }}
          className="h-auto w-full cursor-pointer object-cover"
        />
      ) : (
        <Image
          src={shot.src}
          alt=""
          width={shot.w}
          height={shot.h}
          sizes="(max-width: 1024px) 33vw, 18vw"
          className="h-auto w-full"
        />
      )}

      {/* play badge — only in the resting state; fades out as the card lifts */}
      {shot.video && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/45 backdrop-blur-md transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-90">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] translate-x-[1.5px] fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}

      {/* download button — videos only, fades in on hover, pops on its own hover */}
      {shot.video && (
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

      {/* gradient + label fade in on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2.5 left-3 flex translate-y-2 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/95 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {String(index + 1).padStart(2, "0")}
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
  );
}

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
                    <Tile key={shot.src} shot={shot} index={i} />
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
