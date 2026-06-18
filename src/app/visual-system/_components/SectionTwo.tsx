"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import Sections from "./Sections";
import {
  MaskLine,
  drawCircle,
  popIn,
  revealGroup,
  revealParent,
  revealUp,
} from "./reveal";

const CONTENT = {
  left: {
    one: "Five baskets.<br />Each holds<br />many pillars.<br />One brand.",
    two: "Each piece is our<br />brand<span id='circle'>’s jigsaw.</span>",
    three:
      "Every pillar lives in at least one basket. The baskets are how the deep brand reads when you zoom out. The why beneath the what.",
  },
  right: {
    one: "Use one pillar when you want clarity",
    two: "Combine a few when you need to create something new everytime.",
  },
};

const toLines = (block: string) => block.split(/<br\s*\/?>/i);

// Scattered puzzle pieces (positions are % of the right canvas — tweak freely).
const PIECES = [
  {
    src: "/images/section-2.1.svg",
    w: 152,
    h: 153,
    pos: { top: "2%", left: "12%" },
  },
  {
    src: "/images/section-2.2.svg",
    w: 165,
    h: 129,
    pos: { top: "44%", left: "2%" },
  },
  {
    src: "/images/section-2.3.svg",
    w: 129,
    h: 166,
    pos: { top: "36%", right: "2%" },
  },
];

// Render a heading line; the `id='circle'` word gets the animated brush circle.
function renderLine(line: string) {
  const match = line.match(/^(.*?)<span id=['"]circle['"]>(.*?)<\/span>(.*)$/i);
  if (!match) {
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  }
  const [, prefix, word, rest] = match;
  return (
    <>
      {prefix && <span dangerouslySetInnerHTML={{ __html: prefix }} />}
      <span className="relative inline-block">
        <span dangerouslySetInnerHTML={{ __html: word }} />
        {/* Hand-drawn circle, traced as a stroke from start point around. */}
        <svg
          aria-hidden
          viewBox="0 0 268 79"
          preserveAspectRatio="none"
          fill="none"
          className="pointer-events-none absolute -bottom-[0.26em] -left-[0.22em] -right-[0.1em] -top-[0.12em] -rotate-2 overflow-visible"
        >
          <motion.path
            variants={drawCircle}
            d="M82 68C40 67 12 55 11 37 10 18 66 8 140 8 212 8 258 18 257 37 256 57 206 69 132 69 95 69 58 67 52 60"
            stroke="#EFC23C"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>
      {rest && <span dangerouslySetInnerHTML={{ __html: rest }} />}
    </>
  );
}

export default function SectionTwo() {
  const headingLines = [
    ...toLines(CONTENT.left.one),
    ...toLines(CONTENT.left.two),
  ];
  const blockBreak = toLines(CONTENT.left.one).length; // first line of block two

  return (
    <Sections style={{ children: "flex min-h-[85vh] items-center" }}>
      <motion.div
        variants={revealParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex w-full items-start gap-[clamp(40px,5vw,120px)]"
      >
        {/* Left — headings + body */}
        <motion.div variants={revealGroup} className="w-[46%] shrink-0">
          <motion.div
            variants={revealGroup}
            className="font-sans text-[50px] font-normal leading-none tracking-[-0.015em] text-ink"
          >
            {headingLines.map((line, index) => (
              <MaskLine
                key={index}
                className={index === blockBreak ? "mt-[36px]" : ""}
              >
                {renderLine(line)}
              </MaskLine>
            ))}
          </motion.div>

          <motion.p
            variants={revealUp}
            className="mt-[24px] max-w-[600px] font-sans text-[20px] font-normal leading-[1.5] text-black"
            dangerouslySetInnerHTML={{ __html: CONTENT.left.three }}
          />
        </motion.div>

        {/* Right — scattered puzzle pieces + labels */}
        <motion.div
          variants={revealGroup}
          className="relative h-[480px] flex-1"
        >
          <motion.div
            variants={popIn}
            className="absolute"
            style={PIECES[0].pos}
          >
            <Image
              src={PIECES[0].src}
              alt=""
              width={PIECES[0].w}
              height={PIECES[0].h}
            />
          </motion.div>
          <motion.p
            variants={revealUp}
            className="absolute whitespace-nowrap font-sans text-[16px] font-normal leading-[1.5] text-[#181C38]"
            style={{ top: "13%", left: "30%" }}
          >
            {CONTENT.right.one}
          </motion.p>

          <motion.div
            variants={popIn}
            className="absolute"
            style={PIECES[1].pos}
          >
            <Image
              src={PIECES[1].src}
              alt=""
              width={PIECES[1].w}
              height={PIECES[1].h}
            />
          </motion.div>
          <motion.p
            variants={revealUp}
            className="absolute whitespace-nowrap font-sans text-[16px] font-normal leading-[1.5] text-[#181C38]"
            style={{ top: "52%", left: "20%" }}
          >
            {CONTENT.right.two}
          </motion.p>

          <motion.div
            variants={popIn}
            className="absolute"
            style={PIECES[2].pos}
          >
            <Image
              src={PIECES[2].src}
              alt=""
              width={PIECES[2].w}
              height={PIECES[2].h}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </Sections>
  );
}
