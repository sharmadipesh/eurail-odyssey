"use client";

import { motion, type Variants } from "framer-motion";
import Sections from "./Sections";
import { EASE, MaskLine, revealGroup, revealParent, revealUp } from "./reveal";

type Row = { num: string; label: string; active?: boolean };
type Block = { title: string; active?: boolean; rows: Row[] };

// Two index columns mirroring the reference. `active` greys out chapters that
// aren't part of the visual system yet (and the section headings they sit under).
const COLUMNS: Block[][] = [
  [
    {
      title: "Visual Pillars",
      active: true,
      rows: [
        { num: "01", label: "Introduction", active: true },
        { num: "02", label: "Core Visual Pillars", active: true },
        { num: "03", label: "Core Combinations", active: true },
        { num: "04", label: "Phased Planning", active: true },
      ],
    },
    {
      title: "Art Direction",
      active: true,
      rows: [
        { num: "05", label: "The Window", active: true },
        { num: "06", label: "The In-Between", active: true },
        { num: "07", label: "Trains", active: true },
        { num: "08", label: "City Chapters", active: true },
        { num: "09", label: "The Local Effect", active: true },
        { num: "10", label: "Unguarded", active: true },
        { num: "11", label: "Encounter", active: true },
        { num: "12", label: "Light", active: true },
        { num: "13", label: "Fragments" },
        { num: "14", label: "The Belonging", active: true },
        { num: "15", label: "The Origin", active: true },
      ],
    },
  ],
  [
    {
      title: "Graphics & Motions",
      active: true,
      rows: [
        { num: "16", label: "Moodboard", active: true },
        { num: "17", label: "Molecular Route", active: true },
        { num: "18", label: "Motion Graphics" },
      ],
    },
    {
      title: "Typography",
      rows: [
        { num: "19", label: "Introduction" },
        { num: "20", label: "Main Font" },
        { num: "21", label: "Secondary Font" },
        { num: "22", label: "Stacked" },
        { num: "23", label: "Scaling Principles" },
        { num: "24", label: "Text Style" },
        { num: "25", label: "Mockups" },
      ],
    },
    {
      title: "Color Palette",
      active: true,
      rows: [
        { num: "26", label: "Color Values" },
        { num: "27", label: "Combinations" },
        { num: "28", label: "UX Digital Palette" },
      ],
    },
  ],
];

// Connector line draws itself in left → right once the block reveals.
const lineDraw: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: EASE, delay: 0.1 } },
};

function IndexBlock({ block }: { block: Block }) {
  return (
    <motion.div
      variants={revealGroup}
      className="flex items-start gap-[clamp(16px,2vw,28px)]"
    >
      {/* Heading + connector — top-aligned with the first chapter row */}
      <div className="flex w-[clamp(150px,15vw,215px)] shrink-0 items-center gap-4 pt-[3px]">
        <motion.h3
          variants={revealUp}
          className={`whitespace-nowrap font-sans text-[20px] font-semibold leading-[1.33] ${
            block.active ? "text-ink-black" : "text-[#C2C6D0]"
          }`}
        >
          {block.title}
        </motion.h3>
        <motion.span
          variants={lineDraw}
          className={`h-px flex-1 origin-left ${
            block.active ? "bg-[#8692B7]" : "bg-[#DCDEE6]"
          }`}
        />
      </div>

      {/* Chapter list — number + label */}
      <motion.ul variants={revealGroup} className="min-w-0">
        {block.rows.map((row) => (
          <motion.li
            key={row.num}
            variants={revealUp}
            className="flex gap-4 font-sans text-[15px] font-normal leading-[1.5]"
          >
            <span
              className={`w-[22px] shrink-0 tabular-nums ${
                row.active ? "text-[#9097AD]" : "text-[#C2C6D0]"
              }`}
            >
              {row.num}
            </span>
            <span className={row.active ? "text-ink-black" : "text-[#C2C6D0]"}>
              {row.label}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

export default function Index() {
  return (
    <Sections hideHead style={{ children: "flex min-h-[85vh] items-center" }}>
      <motion.div
        variants={revealParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:gap-[clamp(40px,5vw,96px)]"
      >
        {/* Left — Index wordmark */}
        <motion.h1
          variants={revealGroup}
          className="shrink-0 font-sans text-[clamp(96px,12vw,150px)] font-extrabold leading-[0.9] tracking-[-0.04em] text-ink"
        >
          <MaskLine>Index</MaskLine>
        </motion.h1>

        {/* Right — chapter index, two columns */}
        <motion.div
          variants={revealGroup}
          className="grid flex-1 grid-cols-1 gap-x-[clamp(32px,4vw,72px)] gap-y-[clamp(40px,6vh,72px)] md:grid-cols-2"
        >
          {COLUMNS.map((column, ci) => (
            <motion.div
              key={ci}
              variants={revealGroup}
              className="flex flex-col gap-y-[clamp(40px,6vh,72px)]"
            >
              {column.map((block) => (
                <IndexBlock key={block.title} block={block} />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Sections>
  );
}
