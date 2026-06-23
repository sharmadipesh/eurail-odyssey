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

type Item = {
  id: string;
  title: string;
  undeline: string;
  desc: string;
};

const CONTENT: { left: Item[]; right: Item[] } = {
  left: [
    {
      id: "01",
      title: "The Trip",
      undeline: "3.1.svg",
      desc: "The journey is central to the Interrail experience. The visual system should capture movement, transition and the moments between destinations. Focus on travel as an experience in itself, rather than a means to an end. Imagery should prioritise the train journey, changing landscapes, station moments and the feeling of being in motion.",
    },
    {
      id: "02",
      title: "Discovery",
      undeline: "3.2.svg",
      desc: "Discovery is about exploration beyond the expected. Visuals should feel observational rather than touristic. We will prioritise authenticity over landmarks and moments of curiosity over moments of arrival. The emphasis should be on finding, wandering and uncovering.",
    },
  ],
  right: [
    {
      id: "03",
      title: "Transformation",
      undeline: "3.3.svg",
      desc: "Travel has the ability to shift perspective. This territory focuses on personal growth, confidence and independence developed through experience. Visuals should capture reflection, self-discovery and moments that suggest change rather than explicitly showing it. Also, the transformation happens after you go back from your trip.",
    },
    {
      id: "04",
      title: "Community",
      undeline: "3.4.svg",
      desc: "Interrail connects generations of travellers through shared experiences. Visuals should celebrate connection, companionship and collective exploration while maintaining a sense of individuality. Focus on genuine interactions, shared moments and the social dimension of travel.",
    },
    {
      id: "05",
      title: "Heritage",
      undeline: "3.5.svg",
      desc: "Interrail has been part of European travel culture since 1972. This territory draws on the brand's history and enduring relevance. Visuals should balance legacy with modernity, archival materials, pictures and stories turning into stories users can read. Showing how the original idea continues to with new generations of travellers and the brand.",
    },
  ],
};

function Basket({ item }: { item: Item }) {
  return (
    <motion.div variants={revealGroup} className="flex gap-4">
      <motion.span
        variants={revealUp}
        className="mt-[7px] shrink-0 font-mono text-[12px] tracking-[0.18em] text-[#F5C518]"
      >
        {item.id}
      </motion.span>

      <motion.div variants={revealGroup} className="min-w-0">
        <h3 className="font-sans text-[28px] font-normal leading-none tracking-[-0.014em] text-ink">
          <MaskLine>
            <span className="relative inline-block">
              {item.title}
              <motion.span
                aria-hidden
                variants={drawHighlight}
                style={{
                  backgroundImage: `url('/images/underline/${item.undeline}')`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.18em]"
              />
            </span>
          </MaskLine>
        </h3>

        <motion.p
          variants={revealUp}
          className="mt-[12px] max-w-[560px] font-sans text-[16px] font-normal leading-[1.5] text-black"
        >
          {item.desc}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function SectionThree() {
  return (
    <Sections style={{ children: "flex min-h-[85vh] items-center" }}>
      <motion.div
        variants={revealParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid w-full grid-cols-2 gap-x-[clamp(40px,5vw,90px)]"
      >
        <motion.div
          variants={revealGroup}
          className="space-y-[clamp(28px,4vh,52px)]"
        >
          {CONTENT.left.map((item) => (
            <Basket key={item.id} item={item} />
          ))}
        </motion.div>

        <motion.div
          variants={revealGroup}
          className="space-y-[clamp(28px,4vh,52px)]"
        >
          {CONTENT.right.map((item) => (
            <Basket key={item.id} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </Sections>
  );
}
