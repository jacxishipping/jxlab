"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// 8-stop sunset-to-midnight palette matching hackthenest.tech's atmospheric sky progression
const SKY_STOPS: [number, number, number][] = [
  [79, 63, 124], // #4f3f7c dawn violet
  [164, 122, 156], // #a47a9c dusty lavender-rose
  [242, 162, 122], // #f2a27a warm peach
  [228, 118, 70], // #e47646 sunset orange
  [139, 57, 60], // #8b393c crimson horizon
  [65, 23, 53], // #411735 deep plum
  [35, 14, 28], // #230e1c twilight violet
  [19, 9, 17], // #130911 midnight sky
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

// Deterministic 50 twinkling stars (top 0..60%, size 1..2.5px)
const STAR_FIELD = Array.from({ length: 50 }, (_, i) => {
  const x = ((i * 73.13 + 11) % 97) + 1.5;
  const y = ((i * 41.7 + 7) % 58) + 1;
  const size = 1 + ((i * 19) % 16) / 10; // 1.0px .. 2.5px
  const duration = 2.2 + (i % 4) * 0.35;
  const delay = (i % 7) * 0.18;
  return { x, y, size, duration, delay };
});

// 7 cloud slots tiled smoothly across each 100vw strip
const CLOUD_SLOTS = [
  { left: 4, top: 8, width: 320, opacity: 0.72, spriteIdx: 0 },
  { left: 22, top: 26, width: 390, opacity: 0.62, spriteIdx: 1 },
  { left: 41, top: 12, width: 340, opacity: 0.68, spriteIdx: 2 },
  { left: 58, top: 32, width: 410, opacity: 0.56, spriteIdx: 3 },
  { left: 74, top: 15, width: 350, opacity: 0.7, spriteIdx: 4 },
  { left: 86, top: 42, width: 300, opacity: 0.52, spriteIdx: 1 },
  { left: 12, top: 48, width: 290, opacity: 0.48, spriteIdx: 3 },
];

// Generate soft procedural canvas cloud sprites with directional warm/cool lighting
function generateCloudSprite(seed: number, nightMode: boolean): string {
  const w = 384;
  const h = 192;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  // Layered overlapping soft puffs with directional top-lit / bottom-shaded absorption
  const puffCount = 15;
  for (let i = 0; i < puffCount; i++) {
    const t = i / (puffCount - 1);
    const cx = w * (0.2 + 0.6 * t + (rand() - 0.5) * 0.08);
    const arch = Math.sin(t * Math.PI);
    const cy = h * (0.64 - arch * 0.24 + (rand() - 0.5) * 0.08);
    const rx = (34 + arch * 38 + rand() * 18) * 1.15;
    const ry = rx * (0.58 + rand() * 0.16);

    const grad = ctx.createRadialGradient(
      cx - rx * 0.15,
      cy - ry * 0.35,
      rx * 0.08,
      cx,
      cy,
      rx
    );

    if (nightMode) {
      grad.addColorStop(0, "rgba(116, 98, 154, 0.52)");
      grad.addColorStop(0.55, "rgba(62, 46, 92, 0.34)");
      grad.addColorStop(1, "rgba(32, 18, 48, 0)");
    } else {
      grad.addColorStop(0, "rgba(255, 236, 214, 0.68)");
      grad.addColorStop(0.5, "rgba(248, 186, 146, 0.42)");
      grad.addColorStop(1, "rgba(218, 126, 114, 0)");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL("image/png");
}

export function SkyBackdrop() {
  const [scrollP, setScrollP] = useState(0);
  const [teamFade, setTeamFade] = useState(1);
  const [daySprites, setDaySprites] = useState<string[]>([]);
  const [nightSprites, setNightSprites] = useState<string[]>([]);
  const [cloudsReady, setCloudsReady] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Generate 5 procedural day & night cloud sprites once on mount
  useEffect(() => {
    const day: string[] = [];
    const night: string[] = [];
    for (let i = 0; i < 5; i++) {
      day.push(generateCloudSprite(i + 1, false));
      night.push(generateCloudSprite(i + 1, true));
    }
    setDaySprites(day);
    setNightSprites(night);
    const id = window.requestAnimationFrame(() => setCloudsReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Track global scroll progress p ∈ [0, 1] + Act 5 #team cloud clearing
  useEffect(() => {
    const update = () => {
      rafRef.current = null;
      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      const p = clamp01(window.scrollY / maxScroll);
      setScrollP(p);

      const teamEl = document.getElementById("team");
      if (teamEl) {
        const ratio = teamEl.getBoundingClientRect().top / Math.max(1, window.innerHeight);
        // Clears clouds 1 -> 0 as #team approaches (rect.top/vh: 1.15 -> 0.6)
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

  // Sliding 8-stop Sky Gradient window: windowSize(p) = -0.24*p + 0.62
  const skyGradient = useMemo(() => {
    const windowSize = -0.24 * scrollP + 0.62;
    const windowStart = scrollP * (1 - windowSize);
    const stops: string[] = [];
    const samples = 7;
    for (let i = 0; i <= samples; i++) {
      const f = i / samples;
      stops.push(`${sampleSkyColor(windowStart + f * windowSize)} ${Math.round(f * 100)}%`);
    }
    return `linear-gradient(to bottom, ${stops.join(", ")})`;
  }, [scrollP]);

  // Horizon Glow peaks at p = 0.4 ([0.2, 0.4, 0.5] -> [0, 0.6, 0])
  const horizonGlowOpacity =
    scrollP < 0.2 || scrollP > 0.5
      ? 0
      : scrollP <= 0.4
        ? ((scrollP - 0.2) / 0.2) * 0.6
        : ((0.5 - scrollP) / 0.1) * 0.6;

  // Sun Bézier Arc: (20vw, 10vh) -> (40vw, 4vh) -> (68vw, 47vh) over p ∈ [0, 0.5]
  const sunT = clamp01(scrollP / 0.5);
  const sunX = quadBezier(20, 40, 68, sunT);
  const sunY = quadBezier(10, 4, 47, sunT);
  const sunScale = 1 + 0.15 * clamp01(scrollP / 0.35);
  const sunOpacity = scrollP <= 0.35 ? 1 : clamp01(1 - (scrollP - 0.35) / 0.15);

  // Moon Bézier Arc: (68vw, 47vh) -> (88vw, 60vh) -> (82vw, 84vh) over p ∈ [0.5, 0.85]
  const moonT = clamp01((scrollP - 0.5) / 0.35);
  const moonX = quadBezier(68, 88, 82, moonT);
  const moonYBase = quadBezier(47, 60, 84, moonT);
  const moonExitDrop = scrollP > 0.85 ? ((scrollP - 0.85) / 0.15) * 60 : 0;
  const moonY = moonYBase + moonExitDrop;
  const moonScale = 0.85 + 0.15 * moonT;
  const moonOpacity =
    scrollP < 0.35
      ? 0
      : scrollP <= 0.5
        ? clamp01((scrollP - 0.35) / 0.15)
        : clamp01(1 - (scrollP - 0.92) / 0.08);

  // Stars fade in over p ∈ [0.55, 0.85], twinkle when p >= 0.85
  const starsOpacity = clamp01((scrollP - 0.55) / 0.3);
  const starsTwinkleActive = scrollP >= 0.82;

  // Clouds scroll parallax (0 -> 36vw) + day/night tint crossfade
  const cloudScrollX = scrollP * 36;
  const dayCloudAlpha = clamp01(1 - (scrollP - 0.16) / (0.5 - 0.16));
  const nightCloudAlpha = clamp01((scrollP - 0.22) / (0.55 - 0.22));
  const cloudOverallOpacity = (0.9 - 0.18 * scrollP) * teamFade;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: skyGradient }}
    >
      {/* Horizon Sunset Glow Band */}
      <div
        className="absolute inset-x-0 top-[46%] h-[40vh]"
        style={{
          opacity: horizonGlowOpacity,
          filter: "blur(40px)",
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 166, 102, 0.92) 0%, rgba(228, 118, 70, 0.45) 48%, rgba(228, 118, 70, 0) 80%)",
        }}
      />

      {/* Twinkling Star Field */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
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
              opacity: 0.85,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Sun Following Quadratic Bézier Arc */}
      {sunOpacity > 0.01 && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            left: `${sunX}vw`,
            top: `${sunY}vh`,
            opacity: sunOpacity,
            transform: `translate(-50%, -50%) scale(${sunScale})`,
          }}
        >
          {/* Outer atmospheric halo */}
          <div
            className="absolute left-1/2 top-1/2 h-[clamp(18rem,40vw,28rem)] w-[clamp(18rem,40vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,220,148,0.48) 0%, rgba(244,154,94,0.18) 42%, rgba(244,154,94,0) 72%)",
            }}
          />
          {/* Inner bloom */}
          <div
            className="absolute left-1/2 top-1/2 h-[clamp(8.5rem,18vw,13rem)] w-[clamp(8.5rem,18vw,13rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,247,224,0.85) 0%, rgba(255,204,128,0.35) 55%, rgba(255,204,128,0) 78%)",
            }}
          />
          {/* Solar core */}
          <div className="relative h-[clamp(4rem,10vw,7rem)] w-[clamp(4rem,10vw,7rem)] rounded-full bg-[#FFF6DF] shadow-[0_0_45px_rgba(255,226,162,0.9)]" />
        </div>
      )}

      {/* Moon Following Quadratic Bézier Arc */}
      {moonOpacity > 0.01 && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            left: `${moonX}vw`,
            top: `${moonY}vh`,
            opacity: moonOpacity,
            transform: `translate(-50%, -50%) scale(${moonScale})`,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[clamp(12rem,24vw,19rem)] w-[clamp(12rem,24vw,19rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(251,245,232,0.38) 0%, rgba(162,175,236,0.14) 45%, rgba(162,175,236,0) 74%)",
            }}
          />
          <div className="relative h-[clamp(3.2rem,7vw,5.2rem)] w-[clamp(3.2rem,7vw,5.2rem)] rounded-full bg-[#FDF6E7] shadow-[0_0_38px_rgba(253,246,231,0.75)]">
            <span className="absolute left-[24%] top-[28%] h-2.5 w-2.5 rounded-full bg-[#E8DEC8]/65" />
            <span className="absolute bottom-[26%] right-[24%] h-3.5 w-3.5 rounded-full bg-[#E8DEC8]/50" />
          </div>
        </div>
      )}

      {/* Procedural FBM-Style Clouds: Continuous 120s Tiled Drift + Scroll Parallax + Day/Night Crossfade */}
      {daySprites.length > 0 && cloudOverallOpacity > 0.01 && (
        <div
          className="absolute inset-x-0 top-0 h-[66vh] transition-opacity duration-1000 ease-out"
          style={{
            opacity: cloudsReady ? cloudOverallOpacity : 0,
            transform: `translate3d(${cloudScrollX}vw, 0, 0)`,
          }}
        >
          <div className="animate-cloud-strip relative h-full w-[100vw]">
            {[-200, -100, 0].map((offsetVw) => (
              <div
                key={offsetVw}
                className="absolute top-0 h-full w-[100vw]"
                style={{ left: `${offsetVw}vw` }}
              >
                {CLOUD_SLOTS.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="absolute"
                    style={{
                      left: `${slot.left}%`,
                      top: `${slot.top}%`,
                      width: `${slot.width}px`,
                      opacity: slot.opacity,
                    }}
                  >
                    {/* Day tint layer */}
                    {dayCloudAlpha > 0.01 && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={daySprites[slot.spriteIdx]}
                        alt=""
                        className="block h-auto w-full select-none"
                        style={{ opacity: dayCloudAlpha }}
                      />
                    )}
                    {/* Night tint layer */}
                    {nightCloudAlpha > 0.01 && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={nightSprites[slot.spriteIdx]}
                        alt=""
                        className="absolute inset-0 block h-auto w-full select-none"
                        style={{ opacity: nightCloudAlpha }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
