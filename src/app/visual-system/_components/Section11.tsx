"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import classNames from "classnames";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { playSingle } from "./playSingle";
import { EASE } from "./reveal";

const ELEVEN_BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-11";

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

function Tile({ n, play, className }: { n: string; play?: boolean; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const fileName = `${n}.mp4`;
  const downloadHref = `/api/moodboard-download?dir=section-11&file=${fileName}`;

  return (
    <motion.div
      variants={tileVar}
      whileHover={{ scale: 1.015, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      onMouseEnter={play ? previewOnEnter : undefined}
      onMouseLeave={play ? resetOnLeave : undefined}
      className={classNames(
        "group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[10px] ring-1 ring-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[filter,box-shadow] duration-500 hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.5)] group-hover/collage:brightness-[0.6] group-hover/collage:grayscale-[0.25] hover:!brightness-100 hover:!grayscale-0",
        className,
      )}
    >
      {play ? (
        <video
          ref={videoRef}
          src={`${ELEVEN_BASE}/${n}.mp4`}
          poster={`${ELEVEN_BASE}/${n}.png`}
          loop
          muted
          playsInline
          preload="none"
          onClick={enableSound}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
        />
      ) : (
        <Image
          src={`${ELEVEN_BASE}/${n}.png`}
          alt=""
          fill
          sizes="(max-width: 1024px) 45vw, 18vw"
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10"
      />

      {/* download button — video tiles only, fades in on hover (matches moodboard) */}
      {play && (
        <motion.a
          href={downloadHref}
          download={fileName}
          onClick={(e) => e.stopPropagation()}
          aria-label="Download video"
          initial={false}
          whileHover={{ scale: 1.28 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 420, damping: 18, mass: 0.7 }}
          className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.55)] ring-1 ring-white/25 group-hover:backdrop-blur-md transition-[opacity,background-color] duration-300 ease-out hover:bg-black/90 group-hover:opacity-100"
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

      {/* play badge — identical to the moodboard: visible at rest, recedes on hover */}
      {play && (
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
    </motion.div>
  );
}

export default function Section11() {
  return (
    <Sections group="art"
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
