"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { playSingle } from "./playSingle";
import { EASE } from "./reveal";

const SIXTEEN_BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-16";
// Tiles backed by an .mp4. 2.mp4 isn't uploaded yet (R2 404), so tile 2 stays a
// still — add 2 here once the clip exists and it becomes a video automatically.
const VIDEO_IDS = new Set([1, 3]);

type Block = {
  heading: string[];
  desc?: string;
  lines?: string[];
  bullets?: string[];
};

const UNGUARDED: Block = {
  heading: ["THE UNGUARDED"],
  lines: [
    "This pillar is about the people of that city going about their actual lives. Oblivious to the camera, unselfconscious, caught in the ordinary. A nonna at a stall. A commuter reading. A child running. The city as populated by real people who didn't sign up to be photographed.",
    "The traveller's role here is witness. They are the eye behind the camera, not the protagonist.",
  ],
};
const IN_FRAME: Block = {
  heading: ["IN THE FRAME"],
  bullets: [
    "The threshold moments captured in motion.",
    "A fishmonger arguing with a regular.",
    "A grandmother on a balcony.",
    "A Roman at his forno who knows the order.",
    "A group of friends at a bar who don't know you're there.",
  ],
};
const TREATMENT: Block = {
  heading: ["TREATMENT"],
  desc: "Candid documentary portraiture · the strangers-into-friends arc. Often two people in frame, sometimes one feeling the encounter from the inside. Warm natural light. Faces allowed but not required.",
};
const REGISTER: Block = {
  heading: ["REGISTER"],
  desc: "Quiet, observed, intimate. Warmth. Recognition. The quiet pull of becoming known. Quiet observation. Respectful distance. The feeling of being let into something private.",
};
const AVOID: Block = {
  heading: ["AVOID"],
  desc: 'Posed. Eye contact with camera. The "kind local" who is performing for you. Any shot that requires their permission to set up.',
};

const VIDEOS = ["1", "2", "3"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const accent: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: EASE, delay: 0.12 } },
};

const CARD_BG = "linear-gradient(180deg, #F9F7F3 0%, #EDEBE0 100%)";

function Card({ block }: { block: Block }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group rounded-[16px] px-6 py-6 ring-1 ring-[#1B2040]/[0.06] shadow-[0_1px_2px_rgba(27,32,64,0.04)] transition-shadow duration-500 hover:shadow-[0_22px_46px_-20px_rgba(27,32,64,0.32)]"
      style={{ background: CARD_BG }}
    >
      {/* gold accent — draws in on reveal, grows on hover */}
      <motion.span
        variants={accent}
        className="mb-3 block h-[3px] w-6 origin-left rounded-full transition-[width] duration-500 group-hover:w-9"
        style={{ background: "#F5C518" }}
      />

      {/* heading */}
      <div className="flex flex-col gap-[6px] font-sans text-[16px] font-normal uppercase leading-none tracking-[0.15em] text-[#1B2040]">
        {block.heading.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>

      {/* body — paragraph / stacked paragraphs / bullets */}
      {block.desc && (
        <p className="mt-3.5 font-sans text-[14px] font-normal leading-[1.52] text-black">
          {block.desc}
        </p>
      )}
      {block.lines && (
        <div className="mt-3.5 space-y-3 font-sans text-[14px] font-normal leading-[1.52] text-black">
          {block.lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      )}
      {block.bullets && (
        <ul className="mt-3.5 list-disc space-y-1 pl-[18px] font-sans text-[14px] font-normal leading-[1.52] text-black marker:text-black/55">
          {block.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function VideoThumb({ n }: { n: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = VIDEO_IDS.has(Number(n));

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
  const downloadHref = `/api/moodboard-download?dir=section-16&file=${fileName}`;

  return (
    <motion.div
      variants={item}
      // Pure upward lift (no scale) + layered downward shadow — identical to
      // the moodboard tiles so the hover feels consistent across sections.
      whileHover={{ y: -24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={isVideo ? previewOnEnter : undefined}
      onMouseLeave={isVideo ? resetOnLeave : undefined}
      className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-[#1B2040]/[0.06] shadow-sm transition-[box-shadow,filter] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:shadow-[0_30px_55px_-12px_rgba(20,24,48,0.55),0_14px_26px_-10px_rgba(20,24,48,0.4)] group-hover/vids:brightness-[0.58] group-hover/vids:grayscale-[0.4] hover:!brightness-100 hover:!grayscale-0 lg:aspect-auto lg:min-h-0 lg:flex-1"
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={`${SIXTEEN_BASE}/${n}.mp4`}
          poster={`${SIXTEEN_BASE}/${n}.png`}
          loop
          muted
          playsInline
          preload="none"
          onClick={enableSound}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={`${SIXTEEN_BASE}/${n}.png`}
          alt=""
          fill
          sizes="(max-width: 1024px) 90vw, 290px"
          className="object-cover"
        />
      )}

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

export default function Section16() {
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
        className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[clamp(260px,25%,360px)_auto] lg:items-stretch lg:justify-center lg:gap-[clamp(48px,5vw,80px)]"
      >
        {/* Left — stacked video thumbnails (fill the card section's height) */}
        <motion.div
          variants={group}
          className="group/vids flex flex-col gap-[14px] lg:h-full"
        >
          {VIDEOS.map((n) => (
            <VideoThumb key={n} n={n} />
          ))}
        </motion.div>

        {/* Right — a grid of separate cards, one per topic */}
        <motion.div
          variants={group}
          className="grid gap-[14px] sm:grid-cols-[repeat(2,minmax(0,360px))] sm:items-stretch"
        >
          <motion.div
            variants={group}
            className="flex flex-col gap-[14px] lg:[&>*:last-child]:flex-1"
          >
            <Card block={UNGUARDED} />
            <Card block={IN_FRAME} />
          </motion.div>
          <motion.div
            variants={group}
            className="flex flex-col gap-[14px] lg:[&>*:last-child]:flex-1"
          >
            <Card block={TREATMENT} />
            <Card block={REGISTER} />
            <Card block={AVOID} />
          </motion.div>
        </motion.div>
      </motion.div>
    </Sections>
  );
}
