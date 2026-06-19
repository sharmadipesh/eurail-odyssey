"use client";

import { Fragment, useEffect, useState } from "react";
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

type Piece = {
  src: string;
  w: number;
  h: number;
  pos: React.CSSProperties;
  label?: { text: string; pos: React.CSSProperties };
};

// Scattered puzzle pieces (positions are % of the right canvas — tweak freely).
const PIECES: Piece[] = [
  {
    src: "/images/section-2.1.svg",
    w: 152,
    h: 153,
    pos: { top: "1%", left: "12%" },
    label: { text: CONTENT.right.one, pos: { top: "11%", left: "31%" } },
  },
  {
    src: "/images/section-2.2.svg",
    w: 165,
    h: 129,
    pos: { top: "44%", left: "2%" },
    label: { text: CONTENT.right.two, pos: { top: "55%", left: "7%" } },
  },
  {
    src: "/images/section-2.3.svg",
    w: 129,
    h: 166,
    pos: { top: "36%", right: "2%" },
  },
];

// Spin timing for the secondary loop.
const SPIN_HOLD = 900; // how long a piece spins before resetting
const SPIN_PERIOD = 1400; // ms between hand-offs (spin + brief settle)

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
        {/* Text sits above the circle so the loop reads as drawn behind it */}
        <span
          className="relative z-[1]"
          dangerouslySetInnerHTML={{ __html: word }}
        />
        {/* Hand-drawn circle, traced as a stroke from start point around. */}
        <svg
          aria-hidden
          viewBox="0 0 268 79"
          preserveAspectRatio="none"
          fill="none"
          className="pointer-events-none absolute z-0 -bottom-[0.26em] -left-[0.22em] -right-[0.1em] -top-[0.12em] -rotate-2 overflow-visible"
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

  // Secondary loop: spin one piece at a time, starting only after the
  // pop-in viewport animation has finished (flagged via onAnimationComplete).
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [activePieceIndex, setActivePieceIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isIntroDone) return;

    let index = 0;
    let resetId: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      setActivePieceIndex(index);
      resetId = setTimeout(() => setActivePieceIndex(null), SPIN_HOLD);
      index = (index + 1) % PIECES.length;
    }, SPIN_PERIOD);

    return () => {
      clearInterval(interval);
      clearTimeout(resetId);
    };
  }, [isIntroDone]);

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
          {PIECES.map((piece, index) => {
            const spinning = isIntroDone && activePieceIndex === index;
            return (
              <Fragment key={piece.src}>
                <motion.div
                  variants={popIn}
                  // First completion of the inherited pop-in arms the loop.
                  onAnimationComplete={() => setIsIntroDone(true)}
                  // Inherit the pop-in until it finishes, then drive the spin.
                  animate={
                    isIntroDone
                      ? spinning
                        ? { rotate: [0, 360], scale: [1, 1.08, 1] }
                        : { scale: 1 }
                      : undefined
                  }
                  transition={
                    isIntroDone
                      ? spinning
                        ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                        : { duration: 0.25 }
                      : undefined
                  }
                  className="absolute"
                  style={piece.pos}
                >
                  <Image
                    src={piece.src}
                    alt=""
                    width={piece.w}
                    height={piece.h}
                  />
                </motion.div>

                {piece.label && (
                  <motion.p
                    variants={revealUp}
                    className="absolute whitespace-nowrap font-sans text-base font-normal leading-[1.5] text-ink-dark"
                    style={piece.label.pos}
                  >
                    {piece.label.text}
                  </motion.p>
                )}
              </Fragment>
            );
          })}
        </motion.div>
      </motion.div>
    </Sections>
  );
}
