"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const TWENTYTWO_BASE = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev";

type Block = {
  heading: string[];
  desc?: string;
  lines?: string[];
  bullets?: string[];
};

const BELONGING: Block = {
  heading: ["THE BELONGING"],
  lines: [
    "Shot on phones, by the community, as they actually wander. Raw, first-person, spontaneous. Videos & stills.",
    "Convert reviews and letters into interesting layout formats unique to the brand.",
  ],
};
const IN_FRAME: Block = {
  heading: ["IN THE FRAME"],
  bullets: [
    "One take instead of ten.",
    "The slightly blurry frame that captures the feeling.",
    "Handheld, unplanned, alive. Never a clean product shot.",
    "Real ambient with crowds, laughter, stations.",
    "Upbeat but never forced.",
    "Real, lived-in, in-context — on actual bags, walls, jackets. Weathered & personalised.",
    "Layered community voices.",
  ],
};
const TREATMENT: Block = {
  heading: ["TREATMENT"],
  desc: "Social + activation films 15-60s. Carousels. Collective and celebratory. Gatherings, trinket drops, the certificate moment.",
};
const REGISTER: Block = {
  heading: ["REGISTER"],
  desc: "Warm, on the go, a little chaotic in the best way. Many people, one shared identity. UGC-heavy.",
};
const AVOID: Block = {
  heading: ["AVOID"],
  desc: "Forced 'community' that's secretly a cast. Corporate event-recap. Losing the grassroots feel.",
};

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

function VideoThumb() {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const downloadHref = "/api/moodboard-download?file=section-22.mp4";

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={previewOnEnter}
      onMouseLeave={resetOnLeave}
      className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-[#1B2040]/[0.06] shadow-sm transition-[box-shadow,filter] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:shadow-[0_30px_55px_-12px_rgba(20,24,48,0.55),0_14px_26px_-10px_rgba(20,24,48,0.4)] lg:aspect-auto lg:h-full lg:min-h-0"
    >
      <video
        ref={videoRef}
        src={`${TWENTYTWO_BASE}/section-22.mp4`}
        poster={`${TWENTYTWO_BASE}/section-22.png`}
        loop
        muted
        playsInline
        preload="metadata"
        onClick={enableSound}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* download button — fades in on hover, pops on its own hover (matches moodboard) */}
      <motion.a
        href={downloadHref}
        download="section-22.mp4"
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

      {/* play badge — bottom-left, visible at rest, recedes on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-5 opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
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
      </div>
    </motion.div>
  );
}

export default function Section22() {
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
        {/* Left — single tall video thumbnail (fills the card section's height) */}
        <motion.div variants={group} className="flex flex-col lg:h-full">
          <VideoThumb />
        </motion.div>

        {/* Right — a grid of separate cards, one per topic */}
        <motion.div
          variants={group}
          className="grid gap-[14px] sm:grid-cols-[repeat(2,minmax(0,360px))] sm:items-stretch"
        >
          <motion.div variants={group} className="flex flex-col gap-[14px] lg:[&>*:last-child]:flex-1">
            <Card block={BELONGING} />
            <Card block={IN_FRAME} />
          </motion.div>
          <motion.div variants={group} className="flex flex-col gap-[14px] lg:[&>*:last-child]:flex-1">
            <Card block={TREATMENT} />
            <Card block={REGISTER} />
            <Card block={AVOID} />
          </motion.div>
        </motion.div>
      </motion.div>
    </Sections>
  );
}
