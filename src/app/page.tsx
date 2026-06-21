"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ *
 * Eurail network — real cities, real corridors, gold theme.
 *
 * Major Interrail hubs sit at their true geographic positions (lon/lat,
 * projected) joined by their actual rail corridors. Each connection
 * carries a CONTINUOUS stream of gold dots (a seamless strokeDashoffset
 * loop). Fading route stubs extend the network off-screen and drifting
 * accents fill the margins. Hover/tap a city to light its lines and
 * neighbours. Amsterdam is the focal stop.
 * ------------------------------------------------------------------ */

// ---- gold palette (tuned for contrast on the cream background) ----
const TRACK = "#C18A1E"; // base rail line
const GLOW = "#E8A700"; // soft under-glow
const FLOW_CORE = "#F5B301"; // bright moving dot
const FLOW_SOFT = "#FFD24A"; // its halo
const INK = "#1B2040";

type RawCity = {
  id: string;
  name: string;
  lon: number;
  lat: number;
  focal?: boolean;
};

const RAW: RawCity[] = [
  { id: "lisbon", name: "Lisbon", lon: -9.14, lat: 38.72 },
  { id: "madrid", name: "Madrid", lon: -3.7, lat: 40.42 },
  { id: "barcelona", name: "Barcelona", lon: 2.17, lat: 41.39 },
  { id: "paris", name: "Paris", lon: 2.35, lat: 48.86 },
  { id: "lyon", name: "Lyon", lon: 4.83, lat: 45.76 },
  { id: "marseille", name: "Marseille", lon: 5.37, lat: 43.3 },
  { id: "london", name: "London", lon: -0.13, lat: 51.51 },
  { id: "brussels", name: "Brussels", lon: 4.35, lat: 50.85 },
  { id: "amsterdam", name: "Amsterdam", lon: 4.9, lat: 52.37, focal: true },
  { id: "cologne", name: "Cologne", lon: 6.96, lat: 50.94 },
  { id: "frankfurt", name: "Frankfurt", lon: 8.68, lat: 50.11 },
  { id: "hamburg", name: "Hamburg", lon: 9.99, lat: 53.55 },
  { id: "berlin", name: "Berlin", lon: 13.4, lat: 52.52 },
  { id: "munich", name: "Munich", lon: 11.58, lat: 48.14 },
  { id: "zurich", name: "Zurich", lon: 8.54, lat: 47.37 },
  { id: "geneva", name: "Geneva", lon: 6.14, lat: 46.2 },
  { id: "milan", name: "Milan", lon: 9.19, lat: 45.46 },
  { id: "venice", name: "Venice", lon: 12.33, lat: 45.44 },
  { id: "rome", name: "Rome", lon: 12.5, lat: 41.9 },
  { id: "vienna", name: "Vienna", lon: 16.37, lat: 48.21 },
  { id: "prague", name: "Prague", lon: 14.42, lat: 50.08 },
  { id: "budapest", name: "Budapest", lon: 19.04, lat: 47.5 },
  { id: "warsaw", name: "Warsaw", lon: 21.01, lat: 52.23 },
  { id: "copenhagen", name: "Copenhagen", lon: 12.57, lat: 55.68 },
  { id: "stockholm", name: "Stockholm", lon: 18.07, lat: 59.33 },
  { id: "oslo", name: "Oslo", lon: 10.75, lat: 59.91 },
  { id: "zagreb", name: "Zagreb", lon: 15.98, lat: 45.81 },
];

const LINKS: [string, string][] = [
  ["lisbon", "madrid"],
  ["madrid", "barcelona"],
  ["barcelona", "marseille"],
  ["barcelona", "lyon"],
  ["marseille", "lyon"],
  ["marseille", "milan"],
  ["lyon", "paris"],
  ["lyon", "geneva"],
  ["geneva", "zurich"],
  ["geneva", "milan"],
  ["paris", "london"],
  ["paris", "brussels"],
  ["paris", "frankfurt"],
  ["paris", "zurich"],
  ["brussels", "amsterdam"],
  ["brussels", "cologne"],
  ["amsterdam", "cologne"],
  ["amsterdam", "berlin"],
  ["cologne", "frankfurt"],
  ["cologne", "hamburg"],
  ["frankfurt", "munich"],
  ["frankfurt", "berlin"],
  ["hamburg", "berlin"],
  ["hamburg", "copenhagen"],
  ["berlin", "warsaw"],
  ["berlin", "prague"],
  ["copenhagen", "oslo"],
  ["copenhagen", "stockholm"],
  ["oslo", "stockholm"],
  ["prague", "vienna"],
  ["prague", "munich"],
  ["munich", "vienna"],
  ["munich", "zurich"],
  ["zurich", "milan"],
  ["milan", "venice"],
  ["milan", "rome"],
  ["venice", "rome"],
  ["venice", "vienna"],
  ["vienna", "budapest"],
  ["vienna", "zagreb"],
  ["budapest", "zagreb"],
  ["zagreb", "venice"],
];

/* ---- project lon/lat → viewBox, preserving aspect ratio ---- */
const VW = 1440;
const VH = 900;
const PAD_X = 150;
const PAD_Y = 96;
const COSLAT = Math.cos((48 * Math.PI) / 180);

type City = {
  id: string;
  name: string;
  x: number;
  y: number;
  focal?: boolean;
  lx: number;
  anchor: "start" | "end";
};

const CITIES: City[] = (() => {
  const pr = RAW.map((c) => ({ ...c, rx: c.lon * COSLAT, ry: -c.lat }));
  const xs = pr.map((p) => p.rx);
  const ys = pr.map((p) => p.ry);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min(
    (VW - 2 * PAD_X) / (maxX - minX),
    (VH - 2 * PAD_Y) / (maxY - minY),
  );
  const offX = (VW - (maxX - minX) * scale) / 2;
  const offY = (VH - (maxY - minY) * scale) / 2;
  const cx = VW / 2;
  return pr.map((p) => {
    const x = offX + (p.rx - minX) * scale;
    const y = offY + (p.ry - minY) * scale;
    const right = x >= cx;
    return {
      id: p.id,
      name: p.name,
      x,
      y,
      focal: p.focal,
      lx: right ? 10 : -10,
      anchor: (right ? "start" : "end") as "start" | "end",
    };
  });
})();

const BY_ID = Object.fromEntries(CITIES.map((c) => [c.id, c])) as Record<
  string,
  City
>;

const NEIGHBORS: Record<string, Set<string>> = {};
for (const [a, b] of LINKS) {
  (NEIGHBORS[a] ||= new Set<string>()).add(b);
  (NEIGHBORS[b] ||= new Set<string>()).add(a);
}

const ORDER = Object.fromEntries(CITIES.map((c, i) => [c.id, i]));

// ---- continuous gold-dot flow: one seamless dash period ----
const DOT = 2.4;
const GAP = 15.6;
const PERIOD = DOT + GAP;
const FLOW_SPEED = 22; // viewBox units / sec
const FLOW_DUR = PERIOD / FLOW_SPEED;
const FLOW_DUR_FAST = PERIOD / 52;

const EDGES = LINKS.map(([a, b], i) => {
  const A = BY_ID[a];
  const B = BY_ID[b];
  return {
    id: `${a}-${b}`,
    a,
    b,
    d: `M ${A.x.toFixed(1)} ${A.y.toFixed(1)} L ${B.x.toFixed(1)} ${B.y.toFixed(1)}`,
    drawDelay: 0.3 + i * 0.045,
    flowDelay: 0.8 + i * 0.06,
    phase: (i % 8) * (PERIOD / 8), // spatial desync so dots don't line up
  };
});

// ---- route stubs: extend the network off-screen to fill the margins ----
type Stub = {
  id: string;
  gid: string;
  d: string;
  cx: number;
  cy: number;
  ex: number;
  ey: number;
  phase: number;
  delay: number;
};
const STUB_SPEC: [string, number, number][] = [
  // [cityId, angle°, length]   (0°=east, 90°=down, 180°=west, 270°=up)
  ["london", 171, 400],
  ["lisbon", 206, 300],
  ["barcelona", 224, 250],
  ["madrid", 196, 250],
  ["oslo", 284, 230],
  ["stockholm", 26, 300],
  ["warsaw", 8, 340],
  ["budapest", 30, 280],
  ["rome", 102, 300],
];
const STUBS: Stub[] = STUB_SPEC.map(([id, ang, len], i) => {
  const c = BY_ID[id];
  const r = (ang * Math.PI) / 180;
  const ex = c.x + Math.cos(r) * len;
  const ey = c.y + Math.sin(r) * len;
  return {
    id,
    gid: `stub-${id}`,
    d: `M ${c.x.toFixed(1)} ${c.y.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`,
    cx: c.x,
    cy: c.y,
    ex,
    ey,
    phase: (i % 8) * (PERIOD / 8),
    delay: 1.4 + i * 0.12,
  };
});

// ---- drifting ambient accents in the empty margins ----
const AMBIENT: [number, number][] = [
  [92, 286],
  [168, 470],
  [70, 612],
  [238, 742],
  [300, 360],
  [128, 168],
  [110, 832],
  [1322, 300],
  [1366, 520],
  [1300, 690],
  [1388, 168],
  [1342, 786],
  [560, 70],
  [880, 64],
];

function Rail({
  edge,
  active,
}: {
  edge: (typeof EDGES)[number];
  active: string | null;
}) {
  const incident = active !== null && (edge.a === active || edge.b === active);
  const dimmed = active !== null && !incident;
  const flowDur = incident ? FLOW_DUR_FAST : FLOW_DUR;
  const flowTrans = {
    strokeDashoffset: {
      duration: flowDur,
      ease: "linear" as const,
      repeat: Infinity,
      delay: edge.flowDelay,
    },
    opacity: { duration: 0.4 },
  };
  const flowAnim = { strokeDashoffset: [edge.phase, edge.phase - PERIOD] };

  return (
    <g>
      {/* soft under-glow */}
      <motion.path
        d={edge.d}
        fill="none"
        stroke={GLOW}
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: dimmed ? 0.02 : incident ? 0.14 : 0.06,
        }}
        transition={{
          pathLength: { duration: 1.1, ease: EASE, delay: edge.drawDelay },
          opacity: { duration: 0.4 },
        }}
      />
      {/* base track */}
      <motion.path
        d={edge.d}
        fill="none"
        stroke={TRACK}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0, strokeWidth: 1.3 }}
        animate={{
          pathLength: 1,
          opacity: dimmed ? 0.1 : incident ? 0.6 : 0.34,
          strokeWidth: incident ? 1.7 : 1.3,
        }}
        transition={{
          pathLength: { duration: 1.1, ease: EASE, delay: edge.drawDelay },
          opacity: { duration: 0.4 },
          strokeWidth: { duration: 0.3 },
        }}
      />
      {/* continuous flowing dots — soft halo + bright core */}
      <motion.path
        d={edge.d}
        fill="none"
        stroke={FLOW_SOFT}
        strokeWidth={incident ? 8 : 6}
        strokeLinecap="round"
        strokeDasharray={`${DOT} ${GAP}`}
        initial={{ strokeDashoffset: edge.phase, opacity: 0 }}
        animate={{ ...flowAnim, opacity: dimmed ? 0 : 0.3 }}
        transition={flowTrans}
      />
      <motion.path
        d={edge.d}
        fill="none"
        stroke={FLOW_CORE}
        strokeWidth={incident ? 3.4 : 2.6}
        strokeLinecap="round"
        strokeDasharray={`${DOT} ${GAP}`}
        initial={{ strokeDashoffset: edge.phase, opacity: 0 }}
        animate={{ ...flowAnim, opacity: dimmed ? 0.06 : incident ? 1 : 0.92 }}
        transition={flowTrans}
      />
    </g>
  );
}

function StubLine({ stub }: { stub: Stub }) {
  const stroke = `url(#${stub.gid})`;
  return (
    <g>
      <motion.path
        d={stub.d}
        fill="none"
        stroke={stroke}
        strokeWidth={1.3}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{
          pathLength: { duration: 1.3, ease: EASE, delay: stub.delay },
          opacity: { duration: 0.5, delay: stub.delay },
        }}
      />
      <motion.path
        d={stub.d}
        fill="none"
        stroke={stroke}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeDasharray={`${DOT} ${GAP}`}
        initial={{ strokeDashoffset: stub.phase, opacity: 0 }}
        animate={{
          strokeDashoffset: [stub.phase, stub.phase - PERIOD],
          opacity: 0.9,
        }}
        transition={{
          strokeDashoffset: {
            duration: FLOW_DUR,
            ease: "linear",
            repeat: Infinity,
            delay: stub.delay + 0.4,
          },
          opacity: { duration: 0.5, delay: stub.delay + 0.4 },
        }}
      />
      {/* tiny terminal node where the line leaves the frame */}
      <motion.circle
        cx={stub.ex}
        cy={stub.ey}
        r={2}
        fill={FLOW_CORE}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.5, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: stub.delay,
        }}
      />
    </g>
  );
}

function Station({
  city,
  active,
  onEnter,
  onLeave,
  onSelect,
}: {
  city: City;
  active: string | null;
  onEnter: (id: string) => void;
  onLeave: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const isActive = active === city.id;
  const isNeighbor =
    active !== null && (NEIGHBORS[city.id]?.has(active) ?? false);
  const dimmed = active !== null && !isActive && !isNeighbor;
  const r = city.focal ? 5 : 3;
  const appear = 0.5 + (ORDER[city.id] ?? 0) * 0.05;
  const origin = { transformOrigin: `${city.x}px ${city.y}px` } as const;
  const central = Math.hypot(city.x - VW / 2, city.y - VH / 2) < 245;
  const labelBase = city.focal ? 0.9 : central ? 0 : 0.5;

  return (
    <g>
      <motion.g
        animate={{ opacity: dimmed ? 0.3 : 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* gold halo */}
        <motion.circle
          cx={city.x}
          cy={city.y}
          r={city.focal ? 24 : 13}
          fill={`url(#${city.focal ? "haloFocal" : "halo"})`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: isActive
              ? 1
              : city.focal
                ? [0.6, 0.9, 0.6]
                : [0.45, 0.7, 0.45],
            scale: isActive ? 1.5 : 1,
          }}
          transition={
            isActive
              ? { duration: 0.4 }
              : {
                  opacity: {
                    duration: 5,
                    delay: appear,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                  scale: { duration: 0.4 },
                }
          }
          style={origin}
        />

        {/* focal: breathing ring + slow broadcast pulse */}
        {city.focal && (
          <>
            <motion.circle
              cx={city.x}
              cy={city.y}
              r={13}
              fill="none"
              stroke={TRACK}
              strokeWidth={1.2}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 0.6, 0.25, 0.6],
                scale: [0.6, 1, 1.16, 1],
              }}
              transition={{
                duration: 5,
                delay: appear + 0.2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              style={origin}
            />
            <motion.circle
              cx={city.x}
              cy={city.y}
              r={7}
              fill="none"
              stroke={FLOW_CORE}
              strokeWidth={1.4}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0.55, 0], scale: [1, 6] }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: 2,
              }}
              style={origin}
            />
          </>
        )}

        {/* dot — dark ink anchor with a gold rim for contrast on cream */}
        <motion.circle
          cx={city.x}
          cy={city.y}
          r={r}
          fill={INK}
          stroke={FLOW_CORE}
          strokeWidth={city.focal ? 1.4 : 1}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: isActive ? 1.9 : isNeighbor ? 1.35 : 1,
          }}
          transition={{
            opacity: { duration: 0.4, delay: appear },
            scale:
              isActive || isNeighbor
                ? { type: "spring", stiffness: 300, damping: 16 }
                : {
                    type: "spring",
                    stiffness: 220,
                    damping: 16,
                    delay: appear,
                  },
          }}
          style={origin}
        />
        {city.focal && (
          <motion.circle
            cx={city.x}
            cy={city.y}
            r={2}
            fill="#FFD400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: appear + 0.2, duration: 0.4 }}
          />
        )}

        {/* small label */}
        <motion.text
          x={city.x + city.lx}
          y={city.y + (city.focal ? 4 : 3.5)}
          textAnchor={city.anchor}
          dominantBaseline="middle"
          className="font-mono"
          fill={isActive ? "#8A6100" : INK}
          stroke="#FBFAF7"
          strokeWidth={3}
          strokeLinejoin="round"
          style={{
            fontSize: city.focal ? 13 : 10,
            fontWeight: city.focal ? 600 : 500,
            letterSpacing: city.focal ? "0.14em" : "0.18em",
            paintOrder: "stroke",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : isNeighbor ? 0.82 : labelBase }}
          transition={{
            duration: 0.35,
            delay: isActive || isNeighbor ? 0 : appear,
          }}
        >
          {city.name.toUpperCase()}
        </motion.text>
      </motion.g>

      {/* sonar ping while selected */}
      {isActive && (
        <motion.circle
          cx={city.x}
          cy={city.y}
          r={r}
          fill="none"
          stroke={FLOW_CORE}
          strokeWidth={1.3}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 5 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          style={origin}
        />
      )}

      {/* invisible hit-area */}
      <circle
        cx={city.x}
        cy={city.y}
        r={city.focal ? 30 : 22}
        fill="transparent"
        style={{ pointerEvents: "all", cursor: "pointer" }}
        onPointerEnter={() => onEnter(city.id)}
        onPointerLeave={() => onLeave(city.id)}
        onClick={() => onSelect(city.id)}
      />
    </g>
  );
}

function RailNetwork() {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = pinned ?? hover;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC83D" stopOpacity={0.55} />
          <stop offset="50%" stopColor="#E0A800" stopOpacity={0.16} />
          <stop offset="100%" stopColor="#E0A800" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="haloFocal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD400" stopOpacity={0.5} />
          <stop offset="42%" stopColor="#F5B301" stopOpacity={0.24} />
          <stop offset="100%" stopColor="#F5B301" stopOpacity={0} />
        </radialGradient>
        {STUBS.map((s) => (
          <linearGradient
            key={s.gid}
            id={s.gid}
            gradientUnits="userSpaceOnUse"
            x1={s.cx}
            y1={s.cy}
            x2={s.ex}
            y2={s.ey}
          >
            <stop offset="0%" stopColor={FLOW_CORE} stopOpacity={0.95} />
            <stop offset="60%" stopColor={FLOW_CORE} stopOpacity={0.45} />
            <stop offset="100%" stopColor={FLOW_CORE} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>

      {/* ambient drifting accents in the empty margins */}
      {AMBIENT.map(([x, y], i) => (
        <motion.circle
          key={`amb-${i}`}
          cx={x}
          cy={y}
          r={1.5 + (i % 3) * 0.6}
          fill="#E8B53A"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.12, 0.4, 0.12], y: [0, i % 2 ? 7 : -7, 0] }}
          transition={{
            duration: 6 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 + (i % 5) * 0.6,
          }}
        />
      ))}

      {STUBS.map((stub) => (
        <StubLine key={stub.id} stub={stub} />
      ))}

      {EDGES.map((edge) => (
        <Rail key={edge.id} edge={edge} active={active} />
      ))}

      {CITIES.map((city) => (
        <Station
          key={city.id}
          city={city}
          active={active}
          onEnter={setHover}
          onLeave={(id) => setHover((h) => (h === id ? null : h))}
          onSelect={(id) => setPinned((p) => (p === id ? null : id))}
        />
      ))}
    </svg>
  );
}

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

export default function Home() {
  // Cursor parallax for the whole network — spring-smoothed, subtle depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const px = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const py = useTransform(sy, [-0.5, 0.5], [12, -12]);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <main
      onMouseMove={handleMove}
      className="relative isolate flex min-h-screen w-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#FBFAF7] px-6"
    >
      {/* Atmospheric depth — warm gold glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[12vw] -top-[18vh] -z-10 h-[60vh] w-[60vh] rounded-full bg-brand-yellow opacity-30 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[20vh] -right-[12vw] -z-10 h-[58vh] w-[58vh] rounded-full bg-brand-amber opacity-20 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[8vh] -z-10 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-brand-yellow opacity-[0.1] blur-[150px]"
      />

      {/* The real Eurail network (drifts with the cursor) */}
      <motion.div style={{ x: px, y: py }} className="absolute -inset-10 z-0">
        <RailNetwork />
      </motion.div>

      {/* Legibility veil so the headline reads above the network */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[85vh] w-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(251,250,247,0.8),rgba(251,250,247,0))]"
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
          className="bg-gradient-to-br from-ink to-indigo-bright bg-clip-text pb-[0.12em] font-sans text-[clamp(42px,7.2vw,92px)] font-semibold leading-[1.05] tracking-[-0.035em] text-transparent"
        >
          Interrail Odyssey
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-6 max-w-xl font-sans text-lg font-normal leading-relaxed text-ink/55"
        >
          Sixteen territories. One unmistakable feeling. A living system of
          visual &amp; video pillars. consistency without sameness.
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
