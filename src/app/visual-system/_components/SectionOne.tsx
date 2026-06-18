"use client";

import { motion } from "framer-motion";
import Sections from "./Sections";
import {
  MaskLine,
  drawHighlight,
  revealGroup,
  revealParent,
  revealUp,
} from "./reveal";

const CONTENT = {
  left: [
    "<span id='underline'>16 ways</span> to feel<br />unmistakly the<br />interrail effect.",
    "And nothing like<br />a tourisim board.",
  ],
  right: [
    "Interrail has always had <span class='font-bold'>a feeling</span>. The visual and video language that should carry it has been doing too many jobs at once. Pretty pictures of Europe,<span class='font-bold'>collected without a system, end up looking like everyone else's pictures</span> of Europe. This section reframes that.",
    "Across stills and moving image, we've mapped <span class='font-bold'>sixteen distinct territories</span>: 8 Key Visual pillars for the still frame, 8 Video pillars for the moving one. Each is its own world, its own subjects, its own treatment, its own register, its own list of things to avoid. Together they cover <span class='font-bold'>the full emotional range of the brand</span>, from the most ownable thing we have (a face reflected in a moving window) to the most foundational (1959, and the radical idea that started it all).",
    "These aren't styles to pick from. They're <span class='font-bold'>territories to live in</span>. Any campaign, any social post, any film should fit cleanly into one and, over time, into all of them. The point is <span class='font-bold'>consistency</span> without sameness: sixteen ways to look unmistakably like Interrail, and nothing like a tourism board.",
  ],
};

// Split a heading block on its <br /> markers into individual lines.
const toLines = (block: string) => block.split(/<br\s*\/?>/i);

// Render a heading line. If it carries the `id='underline'` marker, that word
// gets the animated brush underline; everything else stays plain rich text.
function renderLine(line: string) {
  const match = line.match(
    /^(.*?)<span id=['"]underline['"]>(.*?)<\/span>(.*)$/i,
  );
  if (!match) {
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  }
  const [, prefix, word, rest] = match;
  return (
    <>
      {prefix && <span dangerouslySetInnerHTML={{ __html: prefix }} />}
      <span className="relative inline-block">
        <span dangerouslySetInnerHTML={{ __html: word }} />
        <motion.span
          aria-hidden
          variants={drawHighlight}
          style={{
            backgroundImage: "url('/images/underline/section-one.svg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.16em]"
        />
      </span>
      {rest && <span dangerouslySetInnerHTML={{ __html: rest }} />}
    </>
  );
}

export default function SectionOne() {
  return (
    // min-h-[85vh]
    <Sections style={{ children: "flex min-h-[85vh] items-center" }}>
      <motion.div
        variants={revealParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex w-full items-start gap-[clamp(48px,8vw,160px)]"
      >
        {/* Left — display heading, revealed line by line */}
        <motion.div
          variants={revealGroup}
          className="w-[490px] shrink-0 font-sans text-[50px] font-normal leading-none tracking-[-0.015em] text-indigo-deep"
        >
          {CONTENT.left.map((block, blockIndex) =>
            toLines(block).map((line, lineIndex) => (
              <MaskLine
                key={`${blockIndex}-${lineIndex}`}
                className={
                  blockIndex > 0 && lineIndex === 0 ? "mt-[1.4em]" : ""
                }
              >
                {renderLine(line)}
              </MaskLine>
            )),
          )}
        </motion.div>

        {/* Right — body copy, blur-rising paragraph by paragraph */}
        <motion.div
          variants={revealGroup}
          className="min-w-0 max-w-[1080px] flex-1 space-y-8 font-sans text-xl font-normal leading-[1.33] text-ink-black"
        >
          {CONTENT.right.map((paragraph, index) => (
            <motion.p
              key={index}
              variants={revealUp}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </motion.div>
      </motion.div>
    </Sections>
  );
}
