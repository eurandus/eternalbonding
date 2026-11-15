/**
 * Small hand-drawn-style SVG pieces (flowers, leaves, sprigs, sparkles)
 * shared by both faces of the ornament and the invitation card.
 * Everything is vector, so it stays crisp at any size and needs no image files.
 */

export const palette = {
  cream: '#FFF8EF',
  creamShade: '#F1E3D2',
  blush: '#F6D9D9',
  blushShade: '#E8B9BE',
  beige: '#E9D3B8',
  beigeShade: '#D6B693',
  rose: '#D99AA9',
  centre: '#D9A766',
  centreDark: '#B98446',
  sage: '#BFC39C',
  sageDark: '#9DA27B',
  sprig: '#DDBBA7',
  sprigDark: '#C79D86',
  gold: '#C8A76B',
};

/** Champagne-gold gradient. Give each SVG its own id prefix so ids never clash. */
export function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#EBD9AE" />
        <stop offset="0.35" stopColor="#C8A76B" />
        <stop offset="0.6" stopColor="#A9884C" />
        <stop offset="1" stopColor="#E3CB93" />
      </linearGradient>
      <radialGradient id={`${id}-petal`} cx="0.5" cy="0.85" r="0.9">
        <stop offset="0" stopColor="#000" stopOpacity="0.10" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

const petalPath = (r: number, w = 0.62) =>
  `M0 0 C ${-r * w} ${-r * 0.28}, ${-r * w * 0.82} ${-r * 0.98}, 0 ${-r} C ${r * w * 0.82} ${-r * 0.98}, ${r * w} ${-r * 0.28}, 0 0 Z`;

type FlowerProps = {
  x: number;
  y: number;
  r: number;
  petal?: string;
  shade?: string;
  centre?: string;
  rotate?: number;
  petals?: number;
};

/** A soft, layered open bloom (peony / anemone feel). */
export function Flower({
  x,
  y,
  r,
  petal = palette.cream,
  shade = palette.creamShade,
  centre = palette.centre,
  rotate = 0,
  petals = 6,
}: FlowerProps) {
  const outer = Array.from({ length: petals }, (_, i) => (360 / petals) * i);
  const inner = Array.from({ length: petals }, (_, i) => (360 / petals) * i + 180 / petals);
  const dots = Array.from({ length: 9 }, (_, i) => (360 / 9) * i);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {outer.map((a) => (
        <path key={`o${a}`} d={petalPath(r)} transform={`rotate(${a})`} fill={shade} />
      ))}
      {outer.map((a) => (
        <path key={`p${a}`} d={petalPath(r * 0.94, 0.56)} transform={`rotate(${a})`} fill={petal} opacity="0.95" />
      ))}
      {inner.map((a) => (
        <path key={`i${a}`} d={petalPath(r * 0.66, 0.6)} transform={`rotate(${a})`} fill={petal} stroke={shade} strokeWidth={r * 0.02} />
      ))}
      <circle r={r * 0.24} fill={centre} />
      {dots.map((a) => (
        <circle
          key={`d${a}`}
          r={r * 0.035}
          cx={Math.cos((a * Math.PI) / 180) * r * 0.31}
          cy={Math.sin((a * Math.PI) / 180) * r * 0.31}
          fill={palette.centreDark}
          opacity="0.8"
        />
      ))}
    </g>
  );
}

/** A closed, cupped rose seen from the side-top. */
export function Rose({
  x,
  y,
  r,
  petal = palette.beige,
  shade = palette.beigeShade,
  rotate = 0,
}: Omit<FlowerProps, 'centre' | 'petals'>) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <ellipse rx={r} ry={r * 0.9} fill={shade} />
      <path d={`M${-r * 0.95} ${r * 0.1} Q 0 ${r * 1.15} ${r * 0.95} ${r * 0.1} Q ${r * 0.5} ${-r * 0.2} 0 ${-r * 0.05} Q ${-r * 0.5} ${-r * 0.2} ${-r * 0.95} ${r * 0.1} Z`} fill={petal} />
      <path d={`M${-r * 0.7} ${-r * 0.25} Q 0 ${r * 0.55} ${r * 0.7} ${-r * 0.25} Q ${r * 0.35} ${-r * 0.75} 0 ${-r * 0.55} Q ${-r * 0.35} ${-r * 0.75} ${-r * 0.7} ${-r * 0.25} Z`} fill={petal} stroke={shade} strokeWidth={r * 0.04} />
      <path d={`M${-r * 0.32} ${-r * 0.35} Q 0 ${-r * 0.05} ${r * 0.32} ${-r * 0.35} Q ${r * 0.1} ${-r * 0.62} ${-r * 0.32} ${-r * 0.35} Z`} fill={shade} opacity="0.8" />
    </g>
  );
}

export function Leaf({
  x,
  y,
  len,
  rotate,
  fill = palette.sage,
  vein = palette.sageDark,
}: {
  x: number;
  y: number;
  len: number;
  rotate: number;
  fill?: string;
  vein?: string;
}) {
  const w = len * 0.36;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d={`M0 0 Q ${w} ${-len * 0.45} 0 ${-len} Q ${-w} ${-len * 0.45} 0 0 Z`} fill={fill} />
      <path d={`M0 0 Q ${w * 0.12} ${-len * 0.5} 0 ${-len * 0.92}`} stroke={vein} strokeWidth={len * 0.025} fill="none" />
    </g>
  );
}

/** A thin curved stem with small leaves along it, like dried eucalyptus. */
export function Sprig({
  x,
  y,
  len,
  rotate,
  bend = 0.25,
  leaves = 6,
  fill = palette.sprig,
  stem = palette.sprigDark,
}: {
  x: number;
  y: number;
  len: number;
  rotate: number;
  bend?: number;
  leaves?: number;
  fill?: string;
  stem?: string;
}) {
  const items = Array.from({ length: leaves }, (_, i) => {
    const t = (i + 1) / (leaves + 1);
    const px = Math.sin(t * Math.PI) * len * bend * 0.5;
    const py = -t * len;
    const side = i % 2 === 0 ? 1 : -1;
    const size = len * (0.2 - t * 0.08);
    return { px, py, side, size, key: i };
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d={`M0 0 Q ${len * bend} ${-len * 0.5} 0 ${-len}`} stroke={stem} strokeWidth={len * 0.012 + 0.5} fill="none" strokeLinecap="round" />
      {items.map((l) => (
        <Leaf key={l.key} x={l.px} y={l.py} len={l.size} rotate={l.side * 52} fill={fill} vein={stem} />
      ))}
      <Leaf x={0} y={-len} len={len * 0.12} rotate={0} fill={fill} vein={stem} />
    </g>
  );
}

export function Berries({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#C9877F">
      <path d="M0 0 Q 6 -8 14 -10 M0 0 Q 2 -10 -2 -16" stroke="#B38877" strokeWidth="0.8" fill="none" />
      <circle cx="14" cy="-10" r="2.2" />
      <circle cx="-2" cy="-16" r="2" />
      <circle cx="8" cy="-14" r="1.8" />
    </g>
  );
}

/** Four-point twinkle star. */
export function Sparkle({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  const k = r * 0.22;
  return (
    <path
      d={`M${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z`}
      fill={fill}
    />
  );
}
