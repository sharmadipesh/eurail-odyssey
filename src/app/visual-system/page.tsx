"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

// Buttery easing — easeOutExpo-ish. Used for every reveal so motion feels unified.
const EASE = [0.22, 1, 0.36, 1] as const;

const HEADING_LINES = ["Visual &", "Video", "Pillars"];

const headingContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.55 },
  },
};

const lineReveal: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function VisualSystemPage() {
  // Pointer parallax — smoothed with springs so it glides instead of snapping.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 55, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 55, damping: 18, mass: 0.6 });

  const bgX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const bgY = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const fgX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const fgY = useTransform(sy, [-0.5, 0.5], [-8, 8]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-[clamp(16px,4vw,64px)]">
      {/* Soft glow so the yellow banner feels lit from within */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-yellow opacity-30 blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.985, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="relative w-full max-w-[1400px]"
      >
        <div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ containerType: "inline-size" }}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[0.8cqw] shadow-2xl shadow-black/50 ring-1 ring-white/10"
        >
          {/* Background image with ken-burns reveal + parallax drift */}
          <motion.div
            style={{ x: bgX, y: bgY }}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.08, opacity: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src="/images/banner.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-[6cqw]">
            <motion.div style={{ x: fgX, y: fgY }}>
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              >
                <Image
                  src="/images/eu-rail-white.svg"
                  alt="interrail"
                  width={305}
                  height={65}
                  priority
                  className="h-auto w-[15.2cqw]"
                />
              </motion.div>

              {/* Heading — per-line mask reveal */}
              <motion.h1
                variants={headingContainer}
                initial="hidden"
                animate="show"
                className="mt-[2.6cqw] font-sans font-extrabold leading-[0.9] tracking-[-0.04em] text-ink text-[7.24cqw]"
              >
                {HEADING_LINES.map((line) => (
                  <span
                    key={line}
                    className="block overflow-hidden pb-[0.05em]"
                  >
                    <motion.span variants={lineReveal} className="block">
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>
            </motion.div>

            {/* Footer */}
            <div className="flex items-end justify-between text-[1.05cqw] font-medium uppercase tracking-[0.18em]">
              <motion.span
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 1.5 }}
                className="text-ink"
              >
                Draft 1.0&nbsp;&nbsp;19 June 2026
              </motion.span>
              <motion.span
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 1.65 }}
                className="text-white/85"
              >
                Drafted by Pounomi for Ozlem
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
