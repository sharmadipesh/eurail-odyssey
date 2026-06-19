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
      desc: "Every travel brand sells the destination. Interrail sells the going. The Trip is the foundational basket — the journey itself, treated as the product, not the consolation prize. The carriage as a moving room. The window as our most ownable canvas. The platform at 6 a.m. The hours between places are not dead time; they are the time. This is where the brand's most distinctive imagery lives — and where it argues you don't have to skip the in-between to deserve the trip.",
    },
    {
      id: "02",
      title: "Discovery",
      undeline: "3.2.svg",
      desc: "Discovery is what travel reveals when you slow down enough to notice. Not the landmark you've seen on twenty feeds — the lemon seller, the bar the local actually drinks in, the search query you bothered to challenge. Most travel content presents Europe as a checklist. Interrail presents it as a question. The Discovery basket holds the brand's authority: it knows the small-town café and the local layer of the famous city. Algorithms rank monuments. Only people rank what you'd have missed.",
    },
  ],
  right: [
    {
      id: "03",
      title: "Transformation",
      undeline: "3.3.svg",
      desc: "Transformation is the inner shift. The why beneath every other basket. The mission is literal: spark personal transformation through meaningful travel. The basket holds the voices — the 90-year-old, the letter from a past self, the friend who came back different. The Trip is the movement. Discovery is the seeing. Transformation is the becoming.",
    },
    {
      id: "04",
      title: "Community",
      undeline: "3.4.svg",
      desc: "Community is the cohort. The patch on the worn backpack, the Class of 2026 certificate, the voice note about a 4 a.m. arrival in Trieste. Where every other travel brand sells loyalty programs, Interrail offers something earned. The basket holds the symbols of membership — the trinkets, the rite of passage, the realisation that the journey you're taking has been taken by every generation since 1959. Horizontal across countries, vertical across decades. The certificate isn't marketing. It's the proof you became one of us.",
    },
    {
      id: "05",
      title: "Heritage",
      undeline: "3.5.svg",
      desc: "Heritage is the radical idea. 1959, nations recently at war letting their youth cross borders to find each other. Interrail wasn't founded as a product — it was founded as a small act of post-war hope. Most heritage in travel is decoration. Ours is structural. The idea was never about trains. It was about what trains could do.",
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
