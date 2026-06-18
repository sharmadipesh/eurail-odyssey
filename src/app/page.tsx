"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ *
 * Deterministic shape field — a seeded PRNG keeps the "random" layout
 * identical on server and client (no hydration mismatch), while still
 * looking organically scattered.
 * ------------------------------------------------------------------ */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ShapeConfig {
  id: number;
  src: string;
  top: number;
  left: number;
  size: number;
  rotate: number;
  opacity: number;
  driftX: number;
  driftY: number;
  spin: number;
  scaleTo: number;
  duration: number;
  delay: number;
}

function makeShapes(seed: number, count: number): ShapeConfig[] {
  const rand = mulberry32(seed);
  const pick = (min: number, max: number) => min + rand() * (max - min);
  return Array.from({ length: count }, (_, id) => ({
    id,
    src: `/images/shape/${1 + Math.floor(rand() * 8)}.svg`,
    top: pick(-8, 90),
    left: pick(-6, 92),
    size: Math.round(pick(56, 200)),
    rotate: pick(0, 360),
    opacity: pick(0.16, 0.5),
    driftX: pick(-38, 38),
    driftY: pick(-52, 52),
    spin: pick(-24, 24),
    scaleTo: pick(1.04, 1.16),
    duration: pick(9, 20),
    delay: pick(0, 6),
  }));
}

const SHAPES = makeShapes(20260618, 14);

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

function FloatingShape({
  shape,
  dragRef,
}: {
  shape: ShapeConfig;
  dragRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    // Outer layer floats forever; inner layer handles drag independently so
    // the two never fight — released shapes snap home, floating never stops.
    <motion.div
      className="absolute"
      style={{ top: `${shape.top}%`, left: `${shape.left}%`, opacity: shape.opacity }}
      animate={{
        x: [0, shape.driftX, 0],
        y: [0, shape.driftY, 0],
        rotate: [shape.rotate, shape.rotate + shape.spin, shape.rotate],
        scale: [1, shape.scaleTo, 1],
      }}
      transition={{
        duration: shape.duration,
        delay: shape.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        drag
        dragConstraints={dragRef}
        dragElastic={0.18}
        dragSnapToOrigin
        whileHover={{ scale: 1.16 }}
        whileTap={{ scale: 0.95 }}
        whileDrag={{ scale: 1.08, zIndex: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Image
          src={shape.src}
          alt=""
          width={shape.size}
          height={shape.size}
          draggable={false}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);

  // Pointer parallax for the whole shape field — spring-smoothed.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 20 });
  const sy = useSpring(my, { stiffness: 45, damping: 20 });
  const layerX = useTransform(sx, [-0.5, 0.5], [24, -24]);
  const layerY = useTransform(sy, [-0.5, 0.5], [24, -24]);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMove}
      className="relative isolate flex min-h-screen w-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#FBFAF7] px-6"
    >
      {/* Soft gradient glows for depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[15vw] -top-[20vh] -z-10 h-[65vh] w-[65vh] rounded-full bg-brand-yellow opacity-40 blur-[130px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-[20vh] -right-[12vw] -z-10 h-[60vh] w-[60vh] rounded-full bg-indigo-bright opacity-20 blur-[140px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.16, 0.28, 0.16] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Draggable, floating shape field with parallax */}
      <motion.div
        style={{ x: layerX, y: layerY }}
        className="absolute inset-0 z-0"
      >
        {SHAPES.map((shape) => (
          <FloatingShape key={shape.id} shape={shape} dragRef={containerRef} />
        ))}
      </motion.div>

      {/* Legibility veil so the headline reads above the shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(251,250,247,0.85),rgba(251,250,247,0))]"
      />

      {/* Hero — text passes pointer events through to the shapes behind it */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="show"
        className="pointer-events-none relative z-10 flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span
          variants={heroItem}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70 backdrop-blur"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-yellow" />
          Interrail · Visual System
        </motion.span>

        <motion.h1
          variants={heroItem}
          className="bg-gradient-to-br from-ink to-indigo-bright bg-clip-text pb-[0.12em] font-sans text-[clamp(48px,8.5vw,108px)] font-semibold leading-[1.05] tracking-[-0.035em] text-transparent"
        >
          Eurail Design
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-6 max-w-xl font-sans text-lg font-normal leading-relaxed text-ink/55"
        >
          Sixteen territories. One unmistakable feeling. A living system of
          visual &amp; video pillars — consistency without sameness.
        </motion.p>

        <motion.div variants={heroItem} className="pointer-events-auto mt-10">
          <Link href="/visual-system" aria-label="Explore the Visual System">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 font-sans text-base font-medium text-white shadow-[0_14px_40px_-12px_rgba(27,32,64,0.55)]"
            >
              {/* glow that blooms on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-brand-yellow opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
              />
              {/* sheen sweep */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Explore the Visual System</span>
              <svg
                className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Author credit — fixed, minimal, low-opacity, lifts on hover */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 0.45, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8, ease: EASE }}
        whileHover={{ opacity: 1, y: -2 }}
        className="pointer-events-auto fixed bottom-6 right-6 z-30 flex select-none items-center gap-3"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
          By Pounomi Roy
        </span>
        <span className="flex h-7 items-center rounded-full border border-ink/15 bg-white/60 px-2.5 font-mono text-[12px] text-ink backdrop-blur">
          P :|
        </span>
      </motion.div>
    </main>
  );
}
