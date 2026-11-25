"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { jxlabConfig, type TeamMember } from "@/data/jxlabConfig";

// Articulated AI Agent Bot with distance-locked stride legs (--gait), bobbing chassis, glowing visor & signal antennae
function ArticulatedAgentBot({ highlighted }: { highlighted: boolean }) {
  const accent = highlighted ? "#FFCF7A" : "#7CE5DB";
  const shell = highlighted ? "#E88B2E" : "#182830";
  const border = highlighted ? "#FBF5E8" : "#70D6CE";

  return (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="h-6 w-10 shrink-0 overflow-visible"
      aria-hidden="true"
    >
      <g className="ant-body-bob">
        {/* Articulated Robotic Stride Legs Set A */}
        <path
          className="ant-leg-a"
          d="M14 19L10 26M26 19L30 26"
          stroke={accent}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Articulated Robotic Stride Legs Set B */}
        <path
          className="ant-leg-b"
          d="M18 19L16 26M23 19L25 26"
          stroke={accent}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Dual Telemetry Signal Antennae */}
        <path
          className="ant-antenna-l"
          d="M16 7L12 1"
          stroke={accent}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="12" cy="1.5" r="1.4" fill="#F6B96D" />
        <path
          className="ant-antenna-r"
          d="M28 7L32 1"
          stroke={accent}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="32" cy="1.5" r="1.4" fill="#7CE5DB" />

        {/* Agent Chassis Body */}
        <rect
          x="10"
          y="7"
          width="24"
          height="13"
          rx="4"
          fill={shell}
          stroke={border}
          strokeWidth="1.4"
        />
        {/* Glowing Optical Visor & Eyes */}
        <rect x="14" y="10.5" width="16" height="6" rx="2.5" fill="#0A1419" />
        <circle cx="18.5" cy="13.5" r="1.6" fill={highlighted ? "#FBF5E8" : "#7CE5DB"} />
        <circle cx="25.5" cy="13.5" r="1.6" fill="#F6B96D" />
      </g>
    </svg>
  );
}

// Interactive Fiber-Optic Neural Signal Field & Lissajous Data Sparks Canvas (pointer + touch interactive)
function NeuralSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    sx: number;
    sy: number;
  }>({
    x: -999,
    y: -999,
    active: false,
    sx: -999,
    sy: -999,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface FiberStrand {
      x: number;
      baseY: number;
      height: number;
      width: number;
      phase: number;
      lean: number;
      hue: string;
    }
    interface LogicNode {
      x: number;
      baseY: number;
      height: number;
      phase: number;
      color: string;
    }
    interface DataSpark {
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      speed: number;
      phase: number;
      radius: number;
      cyan: boolean;
    }

    let strands: FiberStrand[] = [];
    let nodes: LogicNode[] = [];
    let sparks: DataSpark[] = [];

    const buildScene = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(320, Math.round(rect.width));
      h = Math.max(150, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const strandCount = Math.min(420, Math.max(160, Math.round(w * 0.32)));
      strands = Array.from({ length: strandCount }, (_, i) => {
        const frac = i / strandCount;
        const jitter = ((i * 37) % 100) / 100;
        const depth = (i % 3) / 2;
        return {
          x: frac * w + (jitter - 0.5) * 10,
          baseY: h - 4 + depth * 6,
          height: 34 + jitter * 48 + depth * 14,
          width: 1.4 + depth * 0.9,
          phase: frac * 11 + jitter * 4,
          lean: (jitter - 0.5) * 6,
          hue:
            depth > 0.6
              ? "rgba(112, 214, 206, 0.58)"
              : depth > 0.2
                ? "rgba(64, 152, 154, 0.45)"
                : "rgba(38, 96, 108, 0.38)",
        };
      });

      const nodeCount = Math.min(44, Math.max(18, Math.round(w / 30)));
      nodes = Array.from({ length: nodeCount }, (_, i) => ({
        x: (((i * 97 + 23) % 1000) / 1000) * w,
        baseY: h - 2,
        height: 28 + ((i * 29) % 38),
        phase: i * 1.1,
        color: i % 3 === 0 ? "#FFCF7A" : i % 3 === 1 ? "#7CE5DB" : "#F6B96D",
      }));

      const sparkCount = Math.min(42, Math.max(20, Math.round(w / 30)));
      sparks = Array.from({ length: sparkCount }, (_, i) => ({
        cx: (((i * 137.5) % 100) / 100) * w,
        cy: 18 + (((i * 53) % 72) / 100) * (h - 46),
        rx: 22 + (i % 5) * 12,
        ry: 10 + (i % 4) * 7,
        speed: 0.45 + (i % 5) * 0.14,
        phase: i * 1.7,
        radius: 1.4 + (i % 3) * 0.5,
        cyan: i % 2 === 0,
      }));
    };

    let rafId = 0;
    let lastTime = performance.now();

    const drawFrame = (now: number, scheduleNext: boolean) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      const t = prefersReduced ? 0 : now / 1000;

      const m = mouseRef.current;
      const alpha = 1 - Math.pow(0.0004, dt);
      if (m.active) {
        if (m.sx < -500) {
          m.sx = m.x;
          m.sy = m.y;
        } else {
          m.sx += (m.x - m.sx) * alpha;
          m.sy += (m.y - m.sy) * alpha;
        }
      } else {
        m.sx = -999;
        m.sy = -999;
      }

      ctx.clearRect(0, 0, w, h);

      // Subtle glowing subsurface circuit horizon
      const horizonGrad = ctx.createLinearGradient(0, h - 55, 0, h);
      horizonGrad.addColorStop(0, "rgba(18, 42, 48, 0)");
      horizonGrad.addColorStop(0.68, "rgba(16, 44, 52, 0.72)");
      horizonGrad.addColorStop(1, "#121D24");
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, h - 55, w, 55);

      // Orbiting Lissajous Data Sparks
      for (const sp of sparks) {
        const a = t * sp.speed + sp.phase;
        const fx = sp.cx + Math.sin(a) * sp.rx;
        const fy = sp.cy + 0.6 * Math.sin(1.7 * a + 1) * sp.ry;
        const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2.2 + sp.phase));

        const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, sp.radius * 5.5);
        if (sp.cyan) {
          glow.addColorStop(0, `rgba(124, 229, 219, ${0.85 * pulse})`);
          glow.addColorStop(0.4, `rgba(56, 178, 172, ${0.3 * pulse})`);
          glow.addColorStop(1, "rgba(56, 178, 172, 0)");
        } else {
          glow.addColorStop(0, `rgba(255, 222, 138, ${0.85 * pulse})`);
          glow.addColorStop(0.4, `rgba(232, 139, 46, ${0.32 * pulse})`);
          glow.addColorStop(1, "rgba(232, 139, 46, 0)");
        }
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(fx, fy, sp.radius * 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = sp.cyan
          ? `rgba(218, 255, 251, ${0.9 * pulse})`
          : `rgba(255, 246, 214, ${0.9 * pulse})`;
        ctx.fillRect(fx - sp.radius * 0.8, fy - sp.radius * 0.8, sp.radius * 1.6, sp.radius * 1.6);
      }

      // Interactive Swaying Fiber-Optic Signal Strands (part radially around pointer/touch)
      const mouseRadius = 85;
      for (const b of strands) {
        const swell =
          Math.sin(t * 0.7 + b.phase) + 0.5 * Math.sin(t * 1.31 + b.phase * 2.1);
        const shiver = 0.28 * Math.sin(t * 2.6 + b.phase * 3.1);
        let tipDx = b.lean + (swell * 7.5 + shiver * 2.8);
        let pressY = 0;

        if (m.sx > -500) {
          const dx = b.x - m.sx;
          const dy = b.baseY - b.height * 0.5 - m.sy;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRadius) {
            const strength = Math.pow(1 - dist / mouseRadius, 1.5);
            const pushSign = dx >= 0 ? 1 : -1;
            tipDx += pushSign * strength * 36;
            pressY += strength * 18;
          }
        }

        const ctrlX = b.x + tipDx * 0.35;
        const ctrlY = b.baseY - b.height * 0.55 + pressY * 0.3;
        const tipX = b.x + tipDx;
        const tipY = b.baseY - b.height + pressY;

        ctx.strokeStyle = b.hue;
        ctx.lineWidth = b.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.x, b.baseY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        ctx.stroke();
      }

      // Pulsing Glowing Logic-Node Tips along the Signal Field
      for (const nd of nodes) {
        const nod = Math.sin(t * 0.9 + nd.phase) * 5;
        const pulse = 0.55 + 0.45 * Math.sin(t * 1.8 + nd.phase);
        const fx = nd.x + nod;
        const fy = nd.baseY - nd.height;

        ctx.strokeStyle = "rgba(112, 214, 206, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(nd.x, nd.baseY);
        ctx.quadraticCurveTo(nd.x + nod * 0.4, nd.baseY - nd.height * 0.5, fx, fy);
        ctx.stroke();

        ctx.globalAlpha = pulse;
        ctx.fillStyle = nd.color;
        ctx.beginPath();
        ctx.arc(fx, fy, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (scheduleNext && !prefersReduced) {
        rafId = window.requestAnimationFrame((nextNow) => drawFrame(nextNow, true));
      }
    };

    const handleResize = () => {
      buildScene();
      drawFrame(performance.now(), false);
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);

    if (!prefersReduced) {
      rafId = window.requestAnimationFrame((now) => drawFrame(now, true));
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
      }}
      onMouseLeave={() => {
        mouseRef.current.active = false;
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = touch.clientY - rect.top;
        mouseRef.current.active = true;
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = touch.clientY - rect.top;
        mouseRef.current.active = true;
      }}
      onTouchEnd={() => {
        mouseRef.current.active = false;
      }}
      aria-hidden="true"
      className="block h-44 w-full touch-pan-y sm:h-52"
    />
  );
}

export function AntTrailTeam() {
  const { teamSection } = jxlabConfig;
  const stageRef = useRef<HTMLDivElement>(null);
  const botButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [stageWidth, setStageWidth] = useState<number>(960);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pausedRef = useRef(false);
  const [isPausedState, setIsPausedState] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      setStageWidth(Math.max(300, Math.round(el.clientWidth)));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    pausedRef.current = isPausedState || Boolean(selectedId);
  }, [isPausedState, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const evalBusY = useMemo(() => {
    return (x: number, w: number) => {
      const nx = x / Math.max(300, w);
      return (
        134 +
        30 * Math.sin(nx * Math.PI * 2.15 + 0.35) +
        14 * Math.sin(nx * Math.PI * 4.5 + 1.3)
      );
    };
  }, []);

  const busPathSvg = useMemo(() => {
    const pts: string[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * stageWidth;
      const y = evalBusY(x, stageWidth);
      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [stageWidth, evalBusY]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = teamSection.members.length;
    const margin = 90;
    const span = stageWidth + margin * 2;
    const baseSpeed = Math.max(34, stageWidth * 0.045);

    const positions = teamSection.members.map((_, idx) => {
      return (idx / count) * span - margin + 60;
    });
    const gaits = teamSection.members.map((_, idx) => (idx * 0.23) % 1);
    let velocityFactor = prefersReduced ? 0 : 1;
    let rafId = 0;
    let lastTime = performance.now();

    const applyPositions = (tSec: number, dt: number) => {
      const targetVel = prefersReduced || pausedRef.current ? 0 : 1;
      velocityFactor += (targetVel - velocityFactor) * (1 - Math.exp(-7 * dt));

      for (let i = 0; i < count; i++) {
        const btn = botButtonRefs.current[i];
        if (!btn) continue;

        const pace = prefersReduced
          ? 0
          : 0.14 * Math.sin(0.33 * tSec * (1 + i * 0.08) + i * 1.4);
        const dx = baseSpeed * (1 + pace) * velocityFactor * dt;

        positions[i] += dx;
        if (positions[i] > stageWidth + margin) {
          positions[i] -= span;
        }

        const x = prefersReduced
          ? ((i + 0.65) / (count + 0.3)) * stageWidth
          : positions[i];

        const baseY = evalBusY(x, stageWidth);
        const weaveY = prefersReduced
          ? 0
          : 4.5 * Math.sin(0.025 * x + i * 1.7);
        const y = baseY + weaveY;

        const yNext = evalBusY(x + 4, stageWidth);
        const slopeRad = Math.atan2(yNext - baseY, 4);
        const tiltDeg = ((slopeRad * 180) / Math.PI) * 0.7;

        const stridePx = 22;
        gaits[i] = (gaits[i] + Math.abs(dx) / stridePx) % 1;

        btn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(
          1
        )}px, 0) translate(-50%, -50%)`;
        btn.style.setProperty("--gait", gaits[i].toFixed(4));
        btn.style.setProperty("--ant-tilt", `${tiltDeg.toFixed(2)}deg`);
      }
    };

    applyPositions(0, 0);
    if (prefersReduced) return;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      applyPositions(now / 1000, dt);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [stageWidth, evalBusY, teamSection.members]);

  const selectedMember: TeamMember | null = useMemo(
    () => teamSection.members.find((m) => m.id === selectedId) ?? null,
    [selectedId, teamSection.members]
  );

  return (
    <section
      id="team"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-[#0D0A16] via-[#0E1320] to-[#111B23]"
    >
      {/* Heading over Interactive Neural Signal Horizon */}
      <div className="relative pt-14 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <span className="inline-flex items-center rounded-full border border-[#7CE5DB]/30 bg-[#0E2028]/80 px-3.5 py-1 font-mono text-xs font-semibold tracking-widest text-[#7CE5DB]">
            {teamSection.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#FBF5E8] sm:text-5xl">
            {teamSection.headline}
          </h2>
          <p className="mt-3 font-mono text-xs text-[#C7D6E4]/85 sm:text-sm">
            {teamSection.hint} · Sweep cursor across the signal field to ripple the fibers
          </p>
        </motion.div>

        {/* Interactive Swaying Fiber-Optic Signal Field & Data Sparks */}
        <div className="relative mt-2 -mb-1 w-full">
          <NeuralSignalCanvas />
        </div>
      </div>

      {/* Subsurface Circuit Conduits & Marching Articulated AI Agent Bots */}
      <div
        className="soil-grain relative px-4 pb-20 pt-8 sm:px-6 sm:pb-24"
        style={{
          backgroundColor: "#121D24",
          backgroundImage:
            "radial-gradient(rgba(124, 229, 219, 0.14) 1px, transparent 1px), radial-gradient(rgba(246, 185, 109, 0.08) 1px, transparent 1px), linear-gradient(180deg, #121D24 0%, #151A20 55%, #161314 100%)",
          backgroundSize: "24px 24px, 40px 40px, 100% 100%",
        }}
      >
        {/* Decorative Subsurface PCB Circuit Conduits */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 260"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 h-52 w-full opacity-40"
        >
          <path
            d="M140 0V68L92 116V165M140 42L198 100H268"
            stroke="#70D6CE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="92" cy="165" r="5" fill="#7CE5DB" />
          <circle cx="268" cy="100" r="5" fill="#F6B96D" />
          <path
            d="M1280 0V74L1330 124V170M1280 46L1216 110H1142"
            stroke="#70D6CE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="1330" cy="170" r="5" fill="#7CE5DB" />
          <circle cx="1142" cy="110" r="5" fill="#F6B96D" />
          <path
            d="M720 0V52L682 90M720 34L764 78"
            stroke="#F6B96D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Interactive Multi-Agent Fiber Bus Stage */}
          <div
            ref={stageRef}
            onMouseEnter={() => setIsPausedState(true)}
            onMouseLeave={() => setIsPausedState(false)}
            onFocusCapture={() => setIsPausedState(true)}
            onBlurCapture={() => setIsPausedState(false)}
            className="relative mx-auto h-[250px] w-full overflow-hidden rounded-3xl border border-[#7CE5DB]/22 bg-[#0C141A]/75 shadow-inner"
          >
            {/* Dual-Stroke Glowing Fiber-Optic Bus Track SVG */}
            <svg
              width={stageWidth}
              height={250}
              viewBox={`0 0 ${stageWidth} 250`}
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <path
                d={busPathSvg}
                stroke="#18323B"
                strokeWidth="42"
                strokeLinecap="round"
              />
              <path
                d={busPathSvg}
                stroke="#0D1C22"
                strokeWidth="26"
                strokeLinecap="round"
              />
              <path
                d={busPathSvg}
                stroke="#7CE5DB"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeDasharray="7 9"
                strokeLinecap="round"
              />
            </svg>

            {/* Physics-Gait Marching Articulated AI Agent Bots */}
            {teamSection.members.map((member, idx) => {
              const isSelected = selectedId === member.id;
              const isDimmed = Boolean(selectedId) && !isSelected;
              const tagLift = idx % 2 === 0 ? "-translate-y-0.5" : "-translate-y-4";

              return (
                <button
                  key={member.id}
                  ref={(el) => {
                    botButtonRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() =>
                    setSelectedId((prev) =>
                      prev === member.id ? null : member.id
                    )
                  }
                  aria-pressed={isSelected}
                  aria-label={`Inspect ${member.name} (${member.handle}), ${member.role}`}
                  className={`group absolute left-0 top-0 flex min-h-[44px] flex-col items-center gap-1 rounded-full px-1 py-1 transition-opacity duration-300 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E] ${
                    isDimmed ? "opacity-35 hover:opacity-85" : "opacity-100"
                  } ${isSelected ? "z-30" : "z-20 hover:z-30"}`}
                >
                  <span
                    className={`whitespace-nowrap rounded-full border px-3 py-1 font-mono text-xs font-semibold shadow-md transition-all duration-200 group-hover:-translate-y-1 sm:px-3.5 sm:text-[13px] ${tagLift} ${
                      isSelected
                        ? "scale-105 border-[#FBF5E8] bg-[#FFCF7A] text-[#1B120A] shadow-[0_0_22px_rgba(255,207,122,0.75)]"
                        : "border-[#E2D2B7] bg-[#FBF5E8] text-[#1E1712] group-hover:border-[#E88B2E] group-hover:bg-[#FDE5BE]"
                    }`}
                  >
                    {member.handle}
                  </span>
                  <span
                    style={{ transform: "rotate(var(--ant-tilt, 0deg))" }}
                    className="inline-flex"
                  >
                    <ArticulatedAgentBot highlighted={isSelected} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Accessible Quick-Select Roster Pills */}
          <div
            aria-label="Team roster quick select"
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            {teamSection.members.map((member) => {
              const isSelected = selectedId === member.id;
              return (
                <button
                  key={`pill-${member.id}`}
                  type="button"
                  onClick={() =>
                    setSelectedId((prev) =>
                      prev === member.id ? null : member.id
                    )
                  }
                  aria-pressed={isSelected}
                  className={`inline-flex min-h-[44px] items-center rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E] ${
                    isSelected
                      ? "border-[#FBF5E8] bg-[#FFCF7A] text-[#1B120A]"
                      : "border-[#7CE5DB]/30 bg-[#0D1A21]/80 text-[#D7EAE8] hover:border-[#E88B2E]/65 hover:text-[#FBF5E8]"
                  }`}
                >
                  {member.handle}
                </button>
              );
            })}
          </div>

          {/* Centered Cream Bio Card */}
          <div className="mt-7 flex min-h-[16px] justify-center">
            <AnimatePresence mode="wait">
              {selectedMember && (
                <motion.div
                  key={selectedMember.id}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  role="region"
                  aria-label={`${selectedMember.name} profile`}
                  className="cream-card relative w-full max-w-lg rounded-2xl p-6 text-center sm:p-7"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Close team member bio"
                    className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D8C5A5] bg-[#F3E6CE] text-[#1E1712] transition hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <p className="font-mono text-sm italic text-[#9A4E0B]">
                    {selectedMember.handle}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold text-[#1E1712]">
                    {selectedMember.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#7A5638]">
                    {selectedMember.role}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-[#42342B]">
                    {selectedMember.bio}
                  </p>

                  <div className="mt-4 inline-flex rounded-full border border-[#DECBAE] bg-[#F4E7CF] px-3.5 py-1 font-mono text-[11px] font-medium text-[#5A422E]">
                    {selectedMember.focus}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
