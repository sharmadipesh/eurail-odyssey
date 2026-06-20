"use client";

import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE } from "./reveal";

type Row = { left: string; mid: string; right: string };
type Phase = { title: string; rows: Row[] };

const PHASES: Phase[] = [
  {
    title: "Phase 1.0",
    rows: [
      { left: "CINEMATIC", mid: "THE INTERRAIL EFFECT", right: "BRAND" },
      {
        left: "CINEMATIC",
        mid: "SEIZE THE WAY",
        right: "TRIP + TRANSFORMATION",
      },
      {
        left: "STILLS + MICRO V",
        mid: "CITY CHAPTERS",
        right: "TRIP + DISCOVERY",
      },
      {
        left: "STILLS + MICRO V",
        mid: "THE BELONGING [UGC]",
        right: "COMMUNITY + TRANSFORMATION",
      },
      {
        left: "STILLS + MICRO V",
        mid: "THE ORIGIN",
        right: "HERITAGE + BRAND",
      },
    ],
  },
  {
    title: "Phase 2.0",
    rows: [
      { left: "CINEMATIC", mid: "CAMPIGN 2.0", right: "DISCOVERY" },
      {
        left: "CINEMATIC + MICRO V",
        mid: "THE INTERRAIL EFFECT [UGC]",
        right: "COMMUNITY",
      },
      {
        left: "CINEMATIC",
        mid: "GO SEE FOR YOURSELF [VOX POX - UGC]",
        right: "DISCOVERY",
      },
      {
        left: "CINEMATIC + MICRO V",
        mid: "GET LOST IN [CITY CREATORS]",
        right: "DISCOVERY",
      },
      {
        left: "CINEMATIC + STILLS",
        mid: "THE ORIGIN STORY",
        right: "HERITAGE",
      },
    ],
  },
];

const LINE = "#8692B7";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } },
};
const cardVar: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE,
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
};
const rowsGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const rowVar: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const titleVar: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const lineVar: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: 0.12 } },
};

function Line() {
  return (
    <motion.span
      variants={lineVar}
      className="h-px flex-1 origin-left"
      style={{ backgroundColor: LINE }}
    />
  );
}

function RowItem({ row }: { row: Row }) {
  return (
    <motion.div
      variants={rowVar}
      className="flex items-center gap-3 whitespace-nowrap font-mono text-[18px] font-normal uppercase leading-none tracking-[0.15em] text-black"
    >
      {/* left label → line */}
      <span className="flex w-[clamp(290px,23vw,312px)] shrink-0 items-center gap-3">
        <span>{row.left}</span>
        <Line />
      </span>
      {/* middle label → line → right label (right-aligned to the edge) */}
      <span className="flex flex-1 items-center gap-3">
        <span className="shrink-0">{row.mid}</span>
        <Line />
        <span className="shrink-0">{row.right}</span>
      </span>
    </motion.div>
  );
}

function PhaseCard({ phase }: { phase: Phase }) {
  return (
    <motion.div
      variants={cardVar}
      className="rounded-[20px] px-5 py-10"
      style={{ backgroundColor: "#F9F7F3" }}
    >
      <div className="flex items-start gap-[clamp(20px,2vw,48px)]">
        <motion.h2
          variants={titleVar}
          className="w-[clamp(210px,17vw,240px)] shrink-0 whitespace-nowrap font-sans text-[40px] font-normal leading-none tracking-[-0.014em] text-[#1B2040]"
        >
          {phase.title}
        </motion.h2>

        <motion.div
          variants={rowsGroup}
          className="min-w-0 flex-1 space-y-[clamp(26px,3.2vh,36px)]"
        >
          {phase.rows.map((row, i) => (
            <RowItem key={i} row={row} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function SectionFive() {
  return (
    <Sections
      style={{ container: "px-8!", children: "flex min-h-[85vh] items-center" }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex w-full flex-col gap-[clamp(20px,3vh,32px)]"
      >
        {PHASES.map((phase) => (
          <PhaseCard key={phase.title} phase={phase} />
        ))}
      </motion.div>
    </Sections>
  );
}
