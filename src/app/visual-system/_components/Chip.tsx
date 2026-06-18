"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ChipProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function Chip({ text, isActive = false, onClick }: ChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative inline-flex items-center overflow-hidden rounded-full bg-grey px-4 py-1.5 font-mono text-10 font-normal tracking-12"
    >
      {/* Active gradient layer — cross-fades in over the grey base */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.97 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute inset-0 bg-indigo-gradient"
      />

      {/* Label — color tweens between resting ink and active white */}
      <motion.span
        initial={false}
        animate={{ color: isActive ? "#FFFFFF" : "#1C1B40" }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative z-10 block"
      >
        {text}
      </motion.span>
    </motion.button>
  );
}
