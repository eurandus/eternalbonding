import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { OrnamentBack } from './OrnamentBack';
import { OrnamentFront } from './OrnamentFront';

type Face = 'front' | 'back';

/** Number of thin discs stacked to give the ornament a real edge when it turns. */
const EDGE_LAYERS = 9;
const HALF_THICKNESS = 5; // px; faces sit just outside the edge stack

const snapToFace = (deg: number) => Math.round(deg / 180) * 180;
const faceOf = (deg: number): Face => {
  const n = ((deg % 360) + 360) % 360;
  return n < 90 || n > 270 ? 'front' : 'back';
};

/**
 * All motion runs in one requestAnimationFrame loop that writes transforms
 * straight to the DOM. React only re-renders when the visible face changes.
 */
export function HangingOrnament() {
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const rootRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sheenFrontRef = useRef<HTMLDivElement>(null);
  const sheenBackRef = useRef<HTMLDivElement>(null);

  const [face, setFace] = useState<Face>('front');
  const [touched, setTouched] = useState(false);
  const faceRef = useRef<Face>('front');

  const sim = useRef({
    angle: 0,
    vel: 0, // degrees per 60fps frame
    target: 0,
    mode: 'rest' as 'rest' | 'drag' | 'coast' | 'settle',
    pointerId: -1,
    lastX: 0,
    lastT: 0,
    startX: 0,
    startT: 0,
    travel: 0,
    idle: 0, // 0..1, how much idle sway is applied
    lastInteraction: 0,
    born: 0,
  });

  const markInteraction = useCallback(() => {
    sim.current.lastInteraction = performance.now();
    setTouched(true);
  }, []);

  /** Turn to the next face in a direction (+1 / -1). */
  const turn = useCallback(
    (dir: 1 | -1) => {
      const s = sim.current;
      s.target = snapToFace(s.mode === 'settle' ? s.target : s.angle) + 180 * dir;
      s.mode = 'settle';
      markInteraction();
    },
    [markInteraction],
  );

  const reset = useCallback(() => {
    const s = sim.current;
    s.target = Math.round(s.angle / 360) * 360; // back to the front without a long spin
    s.mode = 'settle';
    markInteraction();
  }, [markInteraction]);

  // ---------- animation loop ----------
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let visible = true;
    sim.current.born = last;

    const frame = (now: number) => {
      const s = sim.current;
      const dt = Math.min(now - last, 48) / 16.667; // in 60fps frames
      last = now;
      const still = reducedRef.current;

      if (s.mode === 'coast') {
        if (still) {
          s.target = snapToFace(s.angle);
          s.mode = 'settle';
        } else {
          s.angle += s.vel * dt;
          s.vel *= Math.pow(0.955, dt);
          if (Math.abs(s.vel) < 0.6) {
            // land on whichever face is nearest in the direction of travel
            s.target = s.vel >= 0 ? Math.ceil(s.angle / 180 - 0.35) * 180 : Math.floor(s.angle / 180 + 0.35) * 180;
            s.mode = 'settle';
          }
        }
      }

      if (s.mode === 'settle') {
        if (still) {
          s.angle = s.target;
          s.vel = 0;
          s.mode = 'rest';
        } else {
          // gentle spring with a hint of overshoot, like a weighted ceramic disc
          const acc = (s.target - s.angle) * 0.06 - s.vel * 0.34;
          s.vel += acc * dt;
          s.angle += s.vel * dt;
          if (Math.abs(s.target - s.angle) < 0.05 && Math.abs(s.vel) < 0.05) {
            s.angle = s.target;
            s.vel = 0;
            s.mode = 'rest';
          }
        }
      }

      // idle sway fades in a moment after the guest lets go
      const isIdle = s.mode === 'rest' && now - s.lastInteraction > 1400 && !still;
      s.idle += ((isIdle ? 1 : 0) - s.idle) * Math.min(1, 0.025 * dt);

      const t = now / 1000;
      let swing = Math.sin(t * 0.85) * 1.1 * s.idle;
      if (!still) {
        // one orchestrated moment: the ornament settles on its cord after loading
        const age = (now - s.born) / 1000;
        if (age < 6) swing += 6 * Math.exp(-age / 1.3) * Math.cos(age * 2.7);
      }
      const wobble = Math.sin(t * 0.5 + 1.2) * 3 * s.idle;
      const shown = s.angle + wobble;

      const rad = (shown * Math.PI) / 180;
      if (discRef.current) discRef.current.style.transform = `rotateY(${shown.toFixed(2)}deg)`;
      if (rigRef.current) rigRef.current.style.transform = `rotate(${swing.toFixed(3)}deg)`;
      if (shadowRef.current) {
        const facing = Math.abs(Math.cos(rad));
        shadowRef.current.style.transform = `translateX(${(-swing * 6).toFixed(1)}px) scaleX(${(0.3 + 0.7 * facing).toFixed(3)})`;
      }
      // the highlight slides across the glaze as it turns
      // at rest it sits near the upper-left rim; turning sweeps it across the face
      const glint = Math.sin(rad) * 38;
      const glow = (0.3 + 0.7 * Math.abs(Math.sin(rad))).toFixed(3); // faint at rest, brighter mid-turn
      if (sheenFrontRef.current) {
        sheenFrontRef.current.style.transform = `translateX(${(-24 - glint).toFixed(1)}%)`;
        sheenFrontRef.current.style.opacity = glow;
      }
      if (sheenBackRef.current) {
        sheenBackRef.current.style.transform = `translateX(${(-24 + glint).toFixed(1)}%)`;
        sheenBackRef.current.style.opacity = glow;
      }

      const f = faceOf(shown);
      if (f !== faceRef.current) {
        faceRef.current = f;
        setFace(f);
      }

      if (visible) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    // pause the loop entirely while the ornament is off screen
    const io = new IntersectionObserver(([entry]) => {
      const nowVisible = entry.isIntersecting;
      if (nowVisible && !visible) {
        visible = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!nowVisible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    if (rootRef.current) io.observe(rootRef.current);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // ---------- pointer (mouse, pen, touch) ----------
  const degPerPx = () => 200 / Math.max(200, sceneRef.current?.clientWidth ?? 360);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const s = sim.current;
    s.mode = 'drag';
    s.pointerId = e.pointerId;
    s.lastX = s.startX = e.clientX;
    s.lastT = s.startT = performance.now();
    s.travel = 0;
    s.vel = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    markInteraction();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (s.mode !== 'drag' || e.pointerId !== s.pointerId) return;
    const now = performance.now();
    const dx = e.clientX - s.lastX;
    const d = dx * degPerPx();
    s.angle += d;
    s.travel += Math.abs(dx);
    const ms = Math.max(1, now - s.lastT);
    const inst = (d / ms) * 16.667;
    s.vel = s.vel * 0.55 + inst * 0.45;
    s.lastX = e.clientX;
    s.lastT = now;
    s.lastInteraction = now;
  };

  const release = (e: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const s = sim.current;
    if (s.mode !== 'drag' || e.pointerId !== s.pointerId) return;
    const now = performance.now();
    s.pointerId = -1;
    s.lastInteraction = now;

    const isTap = !cancelled && s.travel < 6 && now - s.startT < 350;
    if (isTap) {
      s.mode = 'rest';
      turn(1);
      return;
    }
    if (cancelled || now - s.lastT > 90) s.vel = 0; // finger paused before lifting: no fling
    s.vel = Math.max(-38, Math.min(38, s.vel));
    if (Math.abs(s.vel) > 0.6) {
      s.mode = 'coast';
    } else {
      s.target = snapToFace(s.angle);
      s.mode = 'settle';
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight':
        turn(1);
        break;
      case 'ArrowLeft':
        turn(-1);
        break;
      case 'Enter':
      case ' ':
        turn(1);
        break;
      case 'Home':
      case 'Escape':
        reset();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const showingBack = face === 'back';

  return (
    <div className={`ornament${reduced ? ' is-still' : ''}`} ref={rootRef}>
      <div className="ornament-rig" ref={rigRef}>
        <svg className="ornament-cord" viewBox="0 0 40 120" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="cord-gold" x1="0" x2="1">
              <stop offset="0" stopColor="#A3803F" />
              <stop offset="0.5" stopColor="#E2C68A" />
              <stop offset="1" stopColor="#A3803F" />
            </linearGradient>
          </defs>
          {/* two twisted strands from the pin down into the hole */}
          <path d="M20 4 C 17 30, 21 60, 18.6 118" stroke="url(#cord-gold)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M20 4 C 23 34, 19 64, 21.4 118" stroke="url(#cord-gold)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M20 4 C 17 30, 21 60, 18.6 118" stroke="#8C6A2E" strokeWidth="2.4" fill="none" strokeDasharray="1.2 2.6" opacity="0.55" />
          <path d="M20 4 C 23 34, 19 64, 21.4 118" stroke="#8C6A2E" strokeWidth="2.4" fill="none" strokeDasharray="1.2 2.6" strokeDashoffset="1.8" opacity="0.55" />
          {/* knot */}
          <ellipse cx="20" cy="22" rx="4.2" ry="3.4" fill="url(#cord-gold)" />
          <path d="M16.4 21 Q 20 25 23.6 21" stroke="#8C6A2E" strokeWidth="0.8" fill="none" opacity="0.7" />
        </svg>
        <span className="ornament-pin" aria-hidden="true" />

        <div
          className="ornament-scene"
          ref={sceneRef}
          tabIndex={0}
          role="group"
          aria-roledescription="rotating ornament"
          aria-label={`Wedding ornament, showing the ${showingBack ? 'invitation on the back' : 'front'}. Drag, swipe or use the arrow keys to turn it.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => release(e, false)}
          onPointerCancel={(e) => release(e, true)}
          onLostPointerCapture={(e) => release(e, true)}
          onKeyDown={onKeyDown}
        >
          <div className="ornament-disc" ref={discRef}>
            {Array.from({ length: EDGE_LAYERS }, (_, i) => {
              const z = -HALF_THICKNESS + ((2 * HALF_THICKNESS) / (EDGE_LAYERS - 1)) * i;
              return <div key={i} className="ornament-edge" style={{ transform: `translateZ(${z.toFixed(2)}px)` }} />;
            })}
            <div
              className="ornament-face ornament-face--front"
              style={{ transform: `translateZ(${HALF_THICKNESS + 0.6}px)` }}
              inert={showingBack}
              aria-hidden={showingBack}
            >
              <OrnamentFront />
              <span className="ornament-hole" aria-hidden="true" />
              <div className="ornament-sheen" ref={sheenFrontRef} aria-hidden="true" />
            </div>
            <div
              className="ornament-face ornament-face--back"
              style={{ transform: `rotateY(180deg) translateZ(${HALF_THICKNESS + 0.6}px)` }}
              inert={!showingBack}
              aria-hidden={!showingBack}
            >
              <OrnamentBack />
              <span className="ornament-hole" aria-hidden="true" />
              <div className="ornament-sheen" ref={sheenBackRef} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="ornament-shadow" ref={shadowRef} aria-hidden="true" />
      </div>

      <p className={`ornament-hint${touched ? ' is-quiet' : ''}`}>
        <svg viewBox="0 0 120 16" aria-hidden="true" className="ornament-hint-arrows">
          <path d="M14 8 H 42 M 78 8 H 106" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M20 3 L 13 8 L 20 13 M 100 3 L 107 8 L 100 13" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="60" cy="8" r="2.2" fill="currentColor" />
        </svg>
        Drag to discover our story ✧
      </p>

      <div className="ornament-controls">
        <button type="button" className="soft-button" onClick={() => turn(1)}>
          Flip Ornament
        </button>
        <button type="button" className="soft-button soft-button--quiet" onClick={reset}>
          Reset
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {touched ? (showingBack ? 'Showing the invitation on the back of the ornament.' : 'Showing the front of the ornament.') : ''}
      </p>
    </div>
  );
}
