"use client";

import { Children, isValidElement, useRef } from "react";
import {
  motion,
  cubicBezier,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

// Same buttery easing used across the Visual System (see Banner.tsx).
const EASE = [0.22, 1, 0.36, 1] as const;
const easeFn = cubicBezier(EASE[0], EASE[1], EASE[2], EASE[3]);

// Per-buried-layer offsets — wrapper-only, never touches the card UI.
const SCALE_STEP = 0.04; // 1 → 0.96 → 0.92 …
const Y_STEP = -12; // px lifted per buried layer
const ROTATE_STEP = -1; // deg per buried layer
const ROTATE_MAX = -2; // clamp the subtle tilt

interface CardStackScrollProps {
  children: React.ReactNode;
}

/**
 * Pins the Visual System sections into a scroll-driven card stack.
 * - The base card lifts + scales down as the stack grows.
 * - Each following card slides in from the right and lands on top.
 * All transforms live on wrappers here; section internals are untouched.
 */
export default function CardStackScroll({ children }: CardStackScrollProps) {
  const items = Children.toArray(children).filter(isValidElement);
  const total = items.length;

  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Reduced motion: render the sections in normal vertical flow, no transforms.
  if (reduceMotion) {
    return <>{items}</>;
  }

  return (
    <div ref={ref} style={{ height: `${total * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {items.map((child, index) => (
          <StackCard
            key={index}
            index={index}
            total={total}
            progress={scrollYProgress}
          >
            {child}
          </StackCard>
        ))}
      </div>
    </div>
  );
}

interface StackCardProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}

function StackCard({ index, total, progress, children }: StackCardProps) {
  const denom = Math.max(total - 1, 1);
  const isBase = index === 0;
  const maxDepth = total - 1 - index; // how many cards eventually land on top

  // Slide in from the right during this card's entrance segment.
  // Base card has no entrance — it's already in place at x: 0.
  const enterStart = (index - 1) / denom;
  const enterEnd = index / denom;
  const x = useTransform(
    progress,
    isBase ? [0, 1] : [enterStart, enterEnd],
    isBase ? ["0%", "0%"] : ["100%", "0%"],
    { ease: easeFn }
  );

  // Burial: each transition that brings a new card on top pushes this one back.
  const burial = buildBurial(index, denom, maxDepth);
  const scale = useTransform(progress, burial.input, burial.scale, {
    ease: easeFn,
  });
  const y = useTransform(progress, burial.input, burial.y, { ease: easeFn });
  const rotate = useTransform(progress, burial.input, burial.rotate, {
    ease: easeFn,
  });

  return (
    <motion.div
      style={{ x, y, scale, rotate, zIndex: index }}
      className={[
        "absolute inset-0 will-change-transform",
        // Subtle depth: incoming cards cast a soft shadow to the left as they
        // slide over the card below. Wrapper-only — the card UI is unchanged.
        isBase ? "" : "shadow-[-24px_0_48px_-12px_rgba(0,0,0,0.25)]",
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}

/**
 * Builds the scroll breakpoints + outputs for a card's burial.
 * A card at `index` is buried once per transition t = index … total-2.
 * Returns length-2 constant ranges for the top card (no burial) so
 * useTransform always receives a valid, strictly-increasing input range.
 */
function buildBurial(index: number, denom: number, maxDepth: number) {
  if (maxDepth <= 0) {
    return { input: [0, 1], scale: [1, 1], y: [0, 0], rotate: [0, 0] };
  }
  const input: number[] = [];
  const scale: number[] = [];
  const y: number[] = [];
  const rotate: number[] = [];
  for (let depth = 0; depth <= maxDepth; depth++) {
    input.push((index + depth) / denom);
    scale.push(1 - SCALE_STEP * depth);
    y.push(Y_STEP * depth);
    rotate.push(Math.max(ROTATE_MAX, ROTATE_STEP * depth));
  }
  return { input, scale, y, rotate };
}
