"use client";

import { Children, isValidElement, useRef, useState } from "react";
import {
  motion,
  cubicBezier,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

// Same buttery easing used across the Visual System (see Banner.tsx).
const EASE = [0.22, 1, 0.36, 1] as const;
const easeFn = cubicBezier(EASE[0], EASE[1], EASE[2], EASE[3]);

// Per-buried-layer offset — wrapper-only, never touches the card UI.
// Scale only (centered) so buried cards keep equal margin top and bottom.
const SCALE_STEP = 0.04; // 1 → 0.96 → 0.92 …

// Mount a card's content once it's within AHEAD cards of the active one, so the
// heavy section (videos, collages) is ready before it slides into view. Cards
// stay mounted once shown — reveals never replay, videos never re-fetch.
const AHEAD = 2;
// Only cards near the active index get promoted to their own compositor layer
// (will-change). Buried/idle cards drop the hint so the GPU isn't holding 21
// heavy layers at once.
const PROMOTE_RADIUS = 2;

interface CardStackScrollProps {
  children: React.ReactNode;
}

/**
 * Pins the Visual System sections into a scroll-driven card stack.
 * - The base card lifts + scales down as the stack grows.
 * - Each following card slides in from the right and lands on top.
 * All transforms live on wrappers here; section internals are untouched.
 *
 * Sections are lazy-mounted by scroll proximity: instead of all ~21 cards (and
 * their ~110 videos) living in the DOM from first paint, only the active card
 * and the next few are mounted, which is what keeps the slide smooth.
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

  // Active card index, derived from scroll progress. We only re-render when the
  // rounded index changes (~21 updates across the whole page), never per frame —
  // the x/scale transforms below run on the compositor without React renders.
  const denom = Math.max(total - 1, 1);
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(total - 1, Math.max(0, Math.round(p * denom)));
    setActiveIndex((prev) => (prev === next ? prev : next));
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
            activeIndex={activeIndex}
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
  activeIndex: number;
  children: React.ReactNode;
}

function StackCard({
  index,
  total,
  progress,
  activeIndex,
  children,
}: StackCardProps) {
  const denom = Math.max(total - 1, 1);
  const isBase = index === 0;
  const maxDepth = total - 1 - index; // how many cards eventually land on top

  // One-way latch: mount this card's content once it's within reach of the
  // active card and keep it mounted forever after. Driven by the activeIndex
  // prop change (the parent re-render), so the ref read is always fresh.
  const everMounted = useRef(false);
  if (index <= activeIndex + AHEAD) everMounted.current = true;
  const mounted = everMounted.current;

  // Promote to a compositor layer only while near the active card.
  const promoted = Math.abs(index - activeIndex) <= PROMOTE_RADIUS;

  // Paint only the small window around the active card. Buried cards are
  // scaled-down + centered, so they sit fully inside the active card's footprint
  // (occluded at rest, visible only mid-transition) and cards ahead are off to
  // the right at x:100% — painting any of them is wasted work that, without this,
  // grows linearly with scroll depth. `content-visibility: hidden` skips their
  // layout/paint/composite while leaving them mounted, so `once` reveals never
  // replay and videos never re-fetch. The ±PROMOTE_RADIUS window gives a 2-card
  // pre-paint margin so the incoming slide never flashes blank.
  const painted = Math.abs(index - activeIndex) <= PROMOTE_RADIUS;

  // Slide in from the right during this card's entrance segment.
  // Base card has no entrance — it's already in place at x: 0.
  const enterStart = (index - 1) / denom;
  const enterEnd = index / denom;
  const x = useTransform(
    progress,
    isBase ? [0, 1] : [enterStart, enterEnd],
    isBase ? ["0%", "0%"] : ["100%", "0%"],
    { ease: easeFn },
  );

  // Burial: each transition that brings a new card on top pushes this one back.
  const burial = buildBurial(index, denom, maxDepth);
  const scale = useTransform(progress, burial.input, burial.scale, {
    ease: easeFn,
  });

  return (
    <motion.div
      style={{
        x,
        scale,
        zIndex: index,
        willChange: promoted ? "transform" : "auto",
        // Skip rendering distant cards entirely (see `painted` above). The
        // wrapper is `absolute inset-0`, so it keeps its full-screen box even
        // when hidden; only its subtree is culled. containIntrinsicSize is
        // ignored while visible and preserves the box once hidden.
        contentVisibility: painted ? "visible" : "hidden",
        containIntrinsicSize: "100vw 100vh",
      }}
      className="absolute inset-0"
    >
      {mounted ? children : null}
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
    return { input: [0, 1], scale: [1, 1] };
  }
  const input: number[] = [];
  const scale: number[] = [];
  for (let depth = 0; depth <= maxDepth; depth++) {
    input.push((index + depth) / denom);
    scale.push(1 - SCALE_STEP * depth);
  }
  return { input, scale };
}
