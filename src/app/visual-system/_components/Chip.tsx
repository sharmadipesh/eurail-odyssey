"use client";

import { motion } from "framer-motion";

interface ChipProps {
  text: string;
  /** Pill background — supplied by Head as a dark→light shade. */
  bg: string;
  /** Label color, paired to the background for legibility. */
  color: string;
  onClick?: () => void;
}

export default function Chip({ text, bg, color, onClick }: ChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ backgroundColor: bg, color }}
      className="inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-10 font-normal tracking-[0.06em]"
    >
      {text}
    </motion.button>
  );
}
