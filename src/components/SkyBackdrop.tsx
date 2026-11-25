"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// Cooler product/dev-studio sky: warm dawn → slate indigo → midnight
const SKY_STOPS: [number, number, number][] = [
  [62, 58, 118], // #3e3a76 dawn indigo
  [98, 108, 148], // #626c94 cool slate-lavender
  [168, 142, 132], // #a88e84 muted warm mid
  [196, 118, 78], // #c4764e restrained amber horizon
  [108, 52, 68], // #6c3444 dusk plum
  [48, 32, 62], // #30203e deep studio indigo
  [28, 20, 36], // #1c1424 twilight slate
  [19, 9, 17], // #130911 midnight
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function sampleSkyColor(t: number): string {
  const scaled = clamp01(t) * (SKY_STOPS.length - 1);
  const idx = Math.min(SKY_STOPS.length - 2, Math.floor(scaled));
  const frac = scaled - idx;
  const a = SKY_STOPS[idx];
  const b = SKY_STOPS[idx + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * frac);
  const g = Math.round(a[1] + (b[1] - a[1]) * frac);
  const bl = Math.round(a[2] + (b[2] - a[2]) * frac);
  return `rgb(${r}, ${g}, ${bl})`;
}

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

// Quieter star field — later scroll only (top 0..50%)
const STAR_FIELD = Array.from({ length: 28 }, (_, i) => {
  const x = ((i * 73.13 + 11) % 97) + 1.5;
  const y = ((i * 41.7 + 7) % 48) + 1;
  const size = 1 + ((i * 19) % 12) / 12; // 1.0px .. 2.0px
  const duration = 2.4 + (i % 4) * 0.4;
  const delay = (i % 7) * 0.2;
  return { x, y, size, duration, delay };
});

// Sparse blueprint nodes for mid/late sky (deterministic)
const GRID_NODES = Array.from({ length: 12 }, (_, i) => ({
  x: 8 + ((i * 29) % 84),
  y: 12 + ((i * 17) % 52),
  r: 1.2 + (i % 3) * 0.4,
}));

export function SkyBackdrop() {
  const [scrollP, setScrollP] = useState(0);
  const [teamFade, setTeamFade] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Track global scroll progress p ∈ [0, 1] + Act 5 #team atmosphere clear
  useEffect(() => {
    const update = () => {
      rafRef.current = null;
      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      const p = clamp01(window.scrollY / maxScroll);
      setScrollP(p);

      const teamEl = document.getElementById("team");
      if (teamEl) {
        const ratio =
          teamEl.getBoundingClientRect().top / Math.max(1, window.innerHeight);
        setTeamFade(clamp01((ratio - 0.6) / (1.15 - 0.6)));
      }
    };

    const schedule = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Sliding 8-stop sky window
  const skyGradient = useMemo(() => {
    const windowSize = -0.24 * scrollP + 0.62;
    const windowStart = scrollP * (1 - windowSize);
    const stops: string[] = [];
    const samples = 7;
    for (let i = 0; i <= samples; i++) {
      const f = i / samples;
      stops.push(
        `${sampleSkyColor(windowStart + f * windowSize)} ${Math.round(f * 100)}%`
      );
    }
    return `linear-gradient(to bottom, ${stops.join(", ")})`;
  }, [scrollP]);

  // Soft studio horizon band (amber, restrained)
  const horizonGlowOpacity =
    scrollP < 0.18 || scrollP > 0.52
      ? 0
      : scrollP <= 0.38
        ? ((scrollP - 0.18) / 0.2) * 0.42
        : ((0.52 - scrollP) / 0.14) * 0.42;

  // Studio key light — elliptical, not a cartoon sun disk
  const keyT = clamp01(scrollP / 0.48);
  const keyX = quadBezier(18, 36, 62, keyT);
  const keyY = quadBezier(12, 8, 42, keyT);
  const keyScale = 1 + 0.12 * clamp01(scrollP / 0.32);
  const keyOpacity =
    scrollP <= 0.32 ? 1 : clamp01(1 - (scrollP - 0.32) / 0.18);

  // Cool rim light (secondary) — fades in as key fades
  const rimOpacity =
    scrollP < 0.28
      ? 0
      : scrollP <= 0.48
        ? clamp01((scrollP - 0.28) / 0.2) * 0.55
        : clamp01(1 - (scrollP - 0.88) / 0.1) * 0.45;
  const rimX = quadBezier(72, 84, 78, clamp01((scrollP - 0.28) / 0.5));
  const rimY = quadBezier(38, 52, 72, clamp01((scrollP - 0.28) / 0.5));

  // Stars only in darker scroll
  const starsOpacity = clamp01((scrollP - 0.62) / 0.28) * 0.7;
  const starsTwinkleActive = scrollP >= 0.85 && !reduceMotion;

  // Studio glass haze + blueprint grid — fade toward team
  const hazeOpacity = (0.55 - 0.2 * scrollP) * teamFade;
  const gridOpacity =
    clamp01((scrollP - 0.2) / 0.35) * (0.22 - 0.06 * scrollP) * teamFade;
  const hazeShift = reduceMotion ? 0 : scrollP * 8;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: skyGradient }}
    >
      {/* Studio glass / horizon haze bands */}
      <div
        className="absolute inset-x-0 top-[8%] h-[42vh] transition-opacity duration-500"
        style={{
          opacity: hazeOpacity,
          transform: `translate3d(${hazeShift}vw, 0, 0)`,
          background:
            "linear-gradient(180deg, rgba(251,245,232,0.07) 0%, rgba(124,229,219,0.04) 38%, rgba(251,245,232,0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-[-10%] top-[28%] h-[36vh]"
        style={{
          opacity: hazeOpacity * 0.85,
          filter: "blur(28px)",
          background:
            "radial-gradient(ellipse 80% 50% at 30% 40%, rgba(232,139,46,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 45% at 78% 55%, rgba(112,214,206,0.1) 0%, transparent 68%)",
        }}
      />

      {/* Soft amber horizon glow */}
      <div
        className="absolute inset-x-0 top-[48%] h-[32vh]"
        style={{
          opacity: horizonGlowOpacity,
          filter: "blur(48px)",
          background:
            "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(232,139,46,0.55) 0%, rgba(196,118,78,0.22) 48%, transparent 78%)",
        }}
      />

      {/* Faint blueprint grid (mid → late) */}
      <div
        className="studio-blueprint-grid absolute inset-0 transition-opacity duration-500"
        style={{ opacity: gridOpacity }}
      />
      <svg
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: gridOpacity * 1.4 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {GRID_NODES.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * 0.15}
              fill="#7CE5DB"
              fillOpacity="0.55"
            />
            {i < GRID_NODES.length - 1 && (
              <line
                x1={node.x}
                y1={node.y}
                x2={GRID_NODES[(i + 3) % GRID_NODES.length].x}
                y2={GRID_NODES[(i + 3) % GRID_NODES.length].y}
                stroke="#70D6CE"
                strokeOpacity="0.12"
                strokeWidth="0.08"
              />
            )}
          </g>
        ))}
      </svg>

      {/* Twinkling stars — late scroll only */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{ opacity: starsOpacity }}
      >
        {STAR_FIELD.map((star, idx) => (
          <span
            key={idx}
            className={
              starsTwinkleActive
                ? "animate-star-twinkle absolute rounded-full bg-[#FBF5E8]"
                : "absolute rounded-full bg-[#FBF5E8]"
            }
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.65,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Warm studio key light */}
      {keyOpacity > 0.01 && (
        <div
          className="absolute will-change-transform"
          style={{
            left: `${keyX}vw`,
            top: `${keyY}vh`,
            opacity: keyOpacity,
            transform: `translate(-50%, -50%) scale(${keyScale})`,
          }}
        >
          <div
            className="h-[clamp(14rem,32vw,24rem)] w-[clamp(18rem,42vw,32rem)]"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255,236,200,0.55) 0%, rgba(232,139,46,0.18) 42%, rgba(232,139,46,0) 72%)",
            }}
          />
        </div>
      )}

      {/* Cool secondary rim */}
      {rimOpacity > 0.01 && (
        <div
          className="absolute will-change-transform"
          style={{
            left: `${rimX}vw`,
            top: `${rimY}vh`,
            opacity: rimOpacity,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="h-[clamp(10rem,22vw,18rem)] w-[clamp(10rem,22vw,18rem)]"
            style={{
              background:
                "radial-gradient(circle, rgba(124,229,219,0.28) 0%, rgba(112,214,206,0.1) 40%, transparent 70%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
