"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

type Block = {
  heading: string[];
  desc?: string;
  lines?: string[];
  bullets?: string[];
};

const WINDOW: Block = {
  heading: ["THE WINDOW", "FRAME-WITHIN-THE-FRAME"],
  desc: "Everything seen through, framed by, or reflected in glass. The most ownable Interrail territory. No other travel brand lives here.",
};
const IN_FRAME: Block = {
  heading: ["IN THE FRAME"],
  bullets: [
    "The window frame as a frame-within-the-frame.",
    "Passing landscape blurred by speed.",
    "Condensation and rain on the pane.",
    "A face reflected over the moving world outside.",
    "Hands and objects against the sill.",
    "Tunnels turning the glass into a mirror.",
  ],
};
const TREATMENT: Block = {
  heading: ["TREATMENT"],
  lines: [
    "Shot from inside, looking out or catching the reflection.",
    "Motion blur is welcome. Slight grain.",
    "Let the glass do the work: smudges, light glares.",
    "Double-exposure of inside and outside at once.",
  ],
};
const REGISTER: Block = {
  heading: ["REGISTER"],
  lines: [
    "The feeling of being between places.",
    "The romance of movement.",
    "Contemplative.",
  ],
};
const AVOID: Block = {
  heading: ["AVOID"],
  lines: [
    "Crisp, posed window shots.",
    "A model gazing wistfully on cue.",
    "Drone shots of trains.",
    "Anything that looks lit.",
  ],
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

      {/* body — paragraph / distinct lines / bullets */}
      {block.desc && (
        <p className="mt-3.5 font-sans text-[14px] font-normal leading-[1.52] text-black">
          {block.desc}
        </p>
      )}
      {block.lines && (
        <div className="mt-3.5 font-sans text-[14px] font-normal leading-[1.52] text-black">
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

function VideoThumb({ src }: { src: string }) {
  return (
    <motion.div
      variants={item}
      className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-[#1B2040]/[0.06] lg:aspect-auto lg:min-h-0 lg:flex-1"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 1024px) 90vw, 290px"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/35 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40">
          <svg
            width="13"
            height="15"
            viewBox="0 0 15 17"
            fill="none"
            className="ml-[2px]"
            aria-hidden
          >
            <path d="M0 0L15 8.5L0 17V0Z" fill="white" fillOpacity="0.95" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
}

export default function SectionSix() {
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
        viewport={{ once: true, amount: 0.15 }}
        className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[clamp(260px,25%,360px)_auto] lg:items-stretch lg:justify-center lg:gap-[clamp(48px,5vw,80px)]"
      >
        {/* Left — stacked video thumbnails (fill the card section's height) */}
        <motion.div
          variants={group}
          className="flex flex-col gap-[14px] lg:h-full"
        >
          {VIDEOS.map((n) => (
            <VideoThumb key={n} src={`/images/video/window/${n}.png`} />
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
            <Card block={WINDOW} />
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
