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

const LIGHT: Block = {
  heading: ["THE LIGHT"],
  desc: "Pure atmosphere. More about feeling. Golden hour through a carriage, the melancholy of overcast, the neon of a night train. The mood pillar that grades the whole system.",
};
const IN_FRAME: Block = {
  heading: ["IN THE FRAME"],
  bullets: [
    "Sun raking across carriage seats.",
    "The blue hour on a platform.",
    "Overcast flatness that feels like a Tuesday.",
    "Neon and sodium light at a night station.",
    "Light as the protagonist; people as silhouettes.",
  ],
};
const TREATMENT: Block = {
  heading: ["TREATMENT"],
  desc: "Embrace 'wrong' exposure. Overexposed flare, underexposed shadow. Heavy atmosphere. Grain. The frame that captures the feeling beats the sharp one that misses it. This pillar sets the colour grade for everything else.",
};
const REGISTER: Block = {
  heading: ["REGISTER"],
  desc: "The emotional weather of a journey.",
};
const AVOID: Block = {
  heading: ["AVOID"],
  desc: "Flat, evenly-lit, 'correct' photography. HDR. Anything that looks like a camera test rather than a memory.",
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
  return (
    <motion.div
      variants={item}
      className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-[#1B2040]/[0.06] lg:aspect-auto lg:h-full lg:min-h-0"
    >
      <Image
        src="/images/video/section-20.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 90vw, 290px"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      <div className="absolute bottom-5 left-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/35 backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40">
          <svg width="13" height="15" viewBox="0 0 15 17" fill="none" className="ml-[2px]" aria-hidden>
            <path d="M0 0L15 8.5L0 17V0Z" fill="white" fillOpacity="0.95" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
}

export default function Section20() {
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
            <Card block={LIGHT} />
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
