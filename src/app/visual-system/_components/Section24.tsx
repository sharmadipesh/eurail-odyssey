"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

const TWENTYFOUR_BASE =
  "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev/section-24";

type Block = {
  heading: string[];
  desc?: string;
  lines?: string[];
  bullets?: string[];
};

const ENCOUNTER: Block = {
  heading: ["THE ENCOUNTER"],
  desc: "Archive footage and material. Vintage carriages still in service. The original 1972 pass. The same window framed in 1975 and 2026. Imagery that uses decades as a creative resource. Proving the feeling hasn't changed even when everything else has. And the heritage of the brand.",
};
const IN_FRAME: Block = {
  heading: ["IN THE FRAME"],
  bullets: [
    "The analog textures the brand was born from.",
    "Faded archive shots of young people on platforms in the 60s and 70s.",
    "The original printed Interrail ticket, creased and stamped.",
    "Vintage station clocks and split-flap boards. Portraits or videos of travellers.",
    "Old fold-out route maps. Hand-written travel calendars.",
    "Old archival pictures and videos.",
  ],
};
const TREATMENT: Block = {
  heading: ["TREATMENT"],
  desc: "Genuine archive where possible. Real faded colour, grain, patina of age. Deliberate contrast to the contemporary pillars.",
};
const REGISTER: Block = {
  heading: ["REGISTER"],
  desc: "Reverence. Roots. The radical idea and the transformation of travellers that still holds.",
};
const AVOID: Block = {
  heading: ["AVOID"],
  desc: "Sepia-filtered fakery. Nostalgia as decoration. Anything that makes the past feel dusty rather than alive and relevant now.",
};

const IMAGES = ["1", "2", "3"];

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

      {/* body — paragraph / bullets */}
      {block.desc && (
        <p className="mt-3.5 font-sans text-[14px] font-normal leading-[1.52] text-black">
          {block.desc}
        </p>
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

// Archive stills — no clips in this pillar, so plain images that share the
// lift + shadow + neighbour-dim hover used across the system.
function ArchiveThumb({ n }: { n: string }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-[526/348] w-full overflow-hidden rounded-xl ring-1 ring-[#1B2040]/[0.06] shadow-sm transition-[box-shadow,filter] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:shadow-[0_24px_48px_-18px_rgba(20,24,48,0.4)] group-hover/vids:brightness-[0.62] group-hover/vids:grayscale-[0.35] hover:!brightness-100 hover:!grayscale-0 lg:aspect-auto lg:min-h-0 lg:flex-1"
    >
      <Image
        src={`${TWENTYFOUR_BASE}/${n}.png`}
        alt=""
        fill
        sizes="(max-width: 1024px) 90vw, 290px"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
      />
    </motion.div>
  );
}

export default function Section24() {
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
        {/* Left — stacked archive stills (fill the card section's height) */}
        <motion.div
          variants={group}
          className="group/vids flex flex-col gap-[14px] lg:h-full"
        >
          {IMAGES.map((n) => (
            <ArchiveThumb key={n} n={n} />
          ))}
        </motion.div>

        {/* Right — a grid of separate cards, one per topic */}
        <motion.div
          variants={group}
          className="grid gap-[14px] sm:grid-cols-[repeat(2,minmax(0,360px))] sm:items-stretch"
        >
          <motion.div variants={group} className="flex flex-col gap-[14px] lg:[&>*:last-child]:flex-1">
            <Card block={ENCOUNTER} />
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
