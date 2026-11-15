/**
 * A few slow-drifting petals and twinkles. Pure CSS animation on transform and
 * opacity only, so it stays smooth on older phones. Hidden for reduced motion.
 */

// Fixed values (not random) so the layout is identical on every visit.
const PETALS = [
  { left: 6, delay: -2, dur: 26, size: 12, sway: 34, hue: 'a' },
  { left: 17, delay: -14, dur: 31, size: 9, sway: 26, hue: 'b' },
  { left: 29, delay: -7, dur: 24, size: 14, sway: 40, hue: 'c' },
  { left: 43, delay: -21, dur: 33, size: 10, sway: 30, hue: 'a' },
  { left: 58, delay: -4, dur: 28, size: 13, sway: 36, hue: 'b' },
  { left: 69, delay: -18, dur: 25, size: 9, sway: 24, hue: 'c' },
  { left: 81, delay: -10, dur: 30, size: 12, sway: 32, hue: 'a' },
  { left: 92, delay: -25, dur: 27, size: 10, sway: 28, hue: 'b' },
];

export function FloatingPetals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal-fall"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <span
            className={`petal petal--${p.hue}`}
            style={{
              width: `${p.size}px`,
              height: `${p.size * 0.78}px`,
              ['--sway' as string]: `${p.sway}px`,
              animationDelay: `${p.delay / 3}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}

const TWINKLES = [
  { x: 12, y: 18, s: 9, d: 0 },
  { x: 86, y: 14, s: 7, d: 1.4 },
  { x: 22, y: 52, s: 6, d: 2.6 },
  { x: 79, y: 46, s: 10, d: 0.8 },
  { x: 9, y: 78, s: 7, d: 3.2 },
  { x: 91, y: 74, s: 6, d: 2 },
];

export function Twinkles() {
  return (
    <div className="twinkles" aria-hidden="true">
      {TWINKLES.map((t, i) => (
        <svg
          key={i}
          className="twinkle"
          viewBox="-10 -10 20 20"
          style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.s * 2, height: t.s * 2, animationDelay: `${t.d}s` }}
        >
          <path d="M0 -10 Q 2.2 -2.2 10 0 Q 2.2 2.2 0 10 Q -2.2 2.2 -10 0 Q -2.2 -2.2 0 -10 Z" fill="#C8A76B" />
        </svg>
      ))}
    </div>
  );
}
