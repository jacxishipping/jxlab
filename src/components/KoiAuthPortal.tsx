"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Send } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";
import { JxEmblem } from "./JxEmblem";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.15 3.57-8.64Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.3A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.58.38-2.3V6.6H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.4l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.29 6.6l4 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}

type AgentPaletteKey = "cyan" | "amber" | "emerald" | "gold" | "violet";

interface PixelAgentPacket {
  palette: AgentPaletteKey;
  size: number;
  alpha: number;
  baseSpeed: number;
  speed: number;
  heading: number;
  wanderA: number;
  wanderB: number;
  phase: number;
  glideLeft: number;
  segments: { x: number; y: number }[];
  spacing: number;
  headColor: string;
  trailColor: string;
  coreColor: string;
  wingColor: string;
}

const AGENT_PALETTES: Record<
  AgentPaletteKey,
  { head: string; trail: string; core: string; wing: string }
> = {
  cyan: { head: "#FBF5E8", trail: "#7CE5DB", core: "#38B2AC", wing: "#B2F5EA" },
  amber: { head: "#FBF5E8", trail: "#E88B2E", core: "#F6B96D", wing: "#FDE0B5" },
  emerald: { head: "#E6FFFA", trail: "#5BBF99", core: "#2F855A", wing: "#9AE6B4" },
  gold: { head: "#FFF6DF", trail: "#F5B84B", core: "#D4761B", wing: "#FCE7B3" },
  violet: { head: "#FBF5E8", trail: "#A78BFA", core: "#6D28D9", wing: "#DDD6FE" },
};

const TIMELINE_OPTIONS = ["2–4 Weeks", "4–8 Weeks", "Embedded Retainer"] as const;

// 1/5-resolution pixelated AI Agent Swarm & Neural Data-Stream Canvas (same articulated motion physics)
function PixelAgentSwarmCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cw = 256;
    let ch = 160;
    let agents: PixelAgentPacket[] = [];
    let gridNodes: { x: number; y: number; phase: number }[] = [];

    const paletteKeys: AgentPaletteKey[] = ["cyan", "amber", "emerald", "gold", "violet"];

    const wrapAngle = (a: number) => {
      while (a > Math.PI) a -= Math.PI * 2;
      while (a < -Math.PI) a += Math.PI * 2;
      return a;
    };

    const simulate = (dt: number, t: number) => {
      const margin = Math.min(cw, ch) * 0.12;

      for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        const head = a.segments[0];

        if (a.glideLeft > 0) {
          a.glideLeft -= dt;
        } else if (Math.random() < 0.04 * dt) {
          a.glideLeft = 2 + Math.random() * 2.5;
        }
        const targetSpeed = a.glideLeft > 0 ? a.baseSpeed * 0.35 : a.baseSpeed;
        a.speed += (targetSpeed - a.speed) * Math.min(1, dt * 2.5);

        let turnRate =
          0.6 * Math.sin(0.37 * t + a.wanderA) +
          0.4 * Math.sin(0.83 * t + a.wanderB);

        if (
          head.x < margin ||
          head.x > cw - margin ||
          head.y < margin ||
          head.y > ch - margin
        ) {
          const toCenter = Math.atan2(ch * 0.5 - head.y, cw * 0.5 - head.x);
          const diff = wrapAngle(toCenter - a.heading);
          turnRate += diff * 1.4;
        }

        for (let j = 0; j < agents.length; j++) {
          if (i === j) continue;
          const other = agents[j];
          const oh = other.segments[0];
          const dx = head.x - oh.x;
          const dy = head.y - oh.y;
          const dist = Math.hypot(dx, dy);
          const avoidR = 10 * (a.size + other.size);
          if (dist > 0.01 && dist < avoidR) {
            const away = Math.atan2(dy, dx);
            const diff = wrapAngle(away - a.heading);
            turnRate += diff * (1 - dist / avoidR) * 1.25;
          }
        }

        turnRate = Math.max(-1.2, Math.min(1.2, turnRate));
        a.heading = wrapAngle(a.heading + turnRate * dt);

        head.x += Math.cos(a.heading) * a.speed * dt;
        head.y += Math.sin(a.heading) * a.speed * dt;
        a.phase += (a.speed * 0.42 + 1.8) * dt;

        const n = a.segments.length;
        for (let s = 1; s < n; s++) {
          const prev = a.segments[s - 1];
          const cur = a.segments[s];
          const dx = cur.x - prev.x;
          const dy = cur.y - prev.y;
          const ang = Math.atan2(dy, dx);
          const tailWeight = Math.pow(s / (n - 1), 1.6);
          const wave = Math.sin(a.phase - 0.55 * s) * tailWeight * 0.3;
          cur.x = prev.x + Math.cos(ang + wave) * a.spacing;
          cur.y = prev.y + Math.sin(ang + wave) * a.spacing;
        }
      }
    };

    const initSwarm = () => {
      cw = Math.max(84, Math.floor(window.innerWidth / 5));
      ch = Math.max(120, Math.floor(window.innerHeight / 5));
      canvas.width = cw;
      canvas.height = ch;
      ctx.imageSmoothingEnabled = false;

      // Subtle background circuit grid nodes
      gridNodes = [];
      for (let gx = 16; gx < cw; gx += 26) {
        for (let gy = 16; gy < ch; gy += 26) {
          gridNodes.push({ x: gx, y: gy, phase: (gx * 0.17 + gy * 0.23) % 6.28 });
        }
      }

      const count = window.innerWidth < 640 ? 6 : 9;
      agents = Array.from({ length: count }, (_, idx) => {
        const key = paletteKeys[idx % paletteKeys.length];
        const pal = AGENT_PALETTES[key];
        const size = 0.85 + (((idx * 37) % 100) / 100) * 0.65;
        const segCount = 10 + (idx % 4);
        const spacing = 1.3 + 0.42 * size;
        const startX = (0.12 + ((idx * 0.29) % 0.76)) * cw;
        const startY = (0.14 + ((idx * 0.41) % 0.72)) * ch;
        const heading = (idx * 1.37) % (Math.PI * 2);

        const segments = Array.from({ length: segCount }, (__, sIdx) => ({
          x: startX - Math.cos(heading) * sIdx * spacing,
          y: startY - Math.sin(heading) * sIdx * spacing,
        }));

        const baseSpeed = 9.5 + size * 4.5;
        return {
          palette: key,
          size,
          alpha: 0.48 + ((size - 0.85) / 0.65) * 0.52,
          baseSpeed,
          speed: baseSpeed,
          heading,
          wanderA: idx * 2.1,
          wanderB: idx * 3.7,
          phase: idx * 1.9,
          glideLeft: 0,
          segments,
          spacing,
          headColor: pal.head,
          trailColor: pal.trail,
          coreColor: pal.core,
          wingColor: pal.wing,
        };
      });

      agents.sort((a, b) => a.size - b.size);

      for (let wStep = 0; wStep < 40; wStep++) {
        simulate(0.05, wStep * 0.05);
      }
    };

    const drawAgent = (a: PixelAgentPacket, shadowPass: boolean) => {
      const n = a.segments.length;
      const ox = shadowPass ? 1.5 : 0;
      const oy = shadowPass ? 2.0 : 0;

      ctx.save();
      ctx.globalAlpha = shadowPass ? a.alpha * 0.35 : a.alpha;

      // Pixelated stabilizer wings on agent chassis (segment 1)
      const seg0 = a.segments[0];
      const seg1 = a.segments[1];
      const dirAngle = Math.atan2(seg0.y - seg1.y, seg0.x - seg1.x);
      const wingLen = 3.2 + a.size * 1.5;

      ctx.strokeStyle = shadowPass ? "#021218" : a.wingColor;
      ctx.lineWidth = Math.max(1, Math.round(a.size));
      for (const side of [-1, 1]) {
        const wa = dirAngle + side * (Math.PI * 0.65);
        ctx.beginPath();
        ctx.moveTo(seg1.x + ox, seg1.y + oy);
        ctx.lineTo(
          seg1.x + ox + Math.cos(wa) * wingLen,
          seg1.y + oy + Math.sin(wa) * wingLen
        );
        ctx.stroke();
      }

      // Articulated glowing pixel data-packet trail segments (square pixels for cyber/code aesthetic)
      for (let i = n - 1; i >= 0; i--) {
        const seg = a.segments[i];
        const frac = i / (n - 1);
        const side = Math.max(
          1,
          Math.round((i === 0 ? 3.2 : (1 - frac * 0.72) * 3.0) * a.size)
        );
        const half = side / 2;

        if (shadowPass) {
          ctx.fillStyle = "#021218";
        } else if (i === 0) {
          ctx.fillStyle = a.headColor;
        } else if (i % 2 === 0) {
          ctx.fillStyle = a.trailColor;
        } else {
          ctx.fillStyle = a.coreColor;
        }

        ctx.fillRect(
          Math.round(seg.x + ox - half),
          Math.round(seg.y + oy - half),
          side,
          side
        );
      }

      // Glowing optical sensor dot on agent nose
      if (!shadowPass) {
        ctx.fillStyle = "#071E26";
        ctx.fillRect(Math.round(seg0.x), Math.round(seg0.y), 1, 1);
      }

      ctx.restore();
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, cw, ch);

      // Subtle pulsing circuit matrix dots
      for (const node of gridNodes) {
        const p = 0.08 + 0.1 * (0.5 + 0.5 * Math.sin(t * 1.4 + node.phase));
        ctx.fillStyle = `rgba(124, 229, 219, ${p.toFixed(3)})`;
        ctx.fillRect(node.x, node.y, 1, 1);
      }

      for (const a of agents) drawAgent(a, true);
      for (const a of agents) drawAgent(a, false);
    };

    initSwarm();
    render(0);

    const onResize = () => {
      initSwarm();
      render(0);
    };
    window.addEventListener("resize", onResize);

    if (prefersReduced) {
      return () => window.removeEventListener("resize", onResize);
    }

    let rafId = 0;
    let lastDraw = performance.now();
    const targetFrameMs = 1000 / 28;

    const loop = (now: number) => {
      const elapsed = now - lastDraw;
      if (elapsed >= targetFrameMs) {
        const dt = Math.min(0.06, elapsed / 1000);
        lastDraw = now;
        simulate(dt, now / 1000);
        render(now / 1000);
      }
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full [image-rendering:pixelated]"
    />
  );
}

export function KoiAuthPortal() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const trackParam = searchParams.get("track");
  const projectParam = searchParams.get("project");
  const viewParam = searchParams.get("view");
  const nextPath = searchParams.get("next");
  const wantsScope =
    viewParam === "scope" ||
    nextPath === "/register" ||
    Boolean(trackParam || projectParam);
  const initialMode =
    searchParams.get("mode") === "signin" ? "signin" : "signup";

  const [portalView, setPortalView] = useState<"account" | "scope">(
    wantsScope && initialMode !== "signin" ? "scope" : "account"
  );
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Account fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    brief?: string;
  }>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resetRequested, setResetRequested] = useState(false);

  // Project scoping brief fields
  const trackOptions = useMemo(() => {
    const base = jxlabConfig.solutionsSection.items.map((s) => ({
      value: s.slug,
      label: s.title,
    }));
    return [
      ...base,
      { value: "bidnix-demo", label: "Bidnix — Private Enterprise Demo" },
      { value: "custom", label: "Custom AI / Software Engagement" },
    ];
  }, []);

  const resolvedDefaultTrack = useMemo(() => {
    if (projectParam === "bidnix") return "bidnix-demo";
    if (trackParam && trackOptions.some((o) => o.value === trackParam)) {
      return trackParam;
    }
    return "ai-agents";
  }, [projectParam, trackParam, trackOptions]);

  const [selectedTrack, setSelectedTrack] = useState(resolvedDefaultTrack);
  const [selectedTimeline, setSelectedTimeline] = useState<string>(
    TIMELINE_OPTIONS[0]
  );
  const [brief, setBrief] = useState(
    projectParam === "bidnix"
      ? "Interested in scheduling a private walkthrough and architecture demo of Bidnix."
      : ""
  );
  const [submittingBrief, setSubmittingBrief] = useState(false);

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
    setMode(nextMode);
    const openScope =
      searchParams.get("view") === "scope" ||
      searchParams.get("next") === "/register" ||
      Boolean(searchParams.get("track") || searchParams.get("project"));
    if (openScope && nextMode !== "signin") {
      setPortalView("scope");
    }
  }, [searchParams]);

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setPortalView("account");
    setErrors({});
    setStatusMessage(null);
    setResetRequested(false);

    const params = new URLSearchParams(searchParams.toString());
    if (nextMode === "signin") {
      params.set("mode", "signin");
    } else {
      params.delete("mode");
    }
    const qs = params.toString();
    router.replace(qs ? `/login?${qs}` : "/login", { scroll: false });
  };

  const validateAccount = () => {
    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Please enter your work or personal email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter a password.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setResetRequested(false);
    if (!validateAccount()) return;

    if (mode === "signup") {
      setStatusMessage(
        nextPath === "/register"
          ? `Account initialized for ${email.trim()}. Switch to "Scope a Project" anytime to attach your sprint brief.`
          : `Welcome aboard, ${email.trim()}! Check your inbox to verify your JXLab Client Portal access.`
      );
    } else {
      setStatusMessage(
        `Signed in as ${email.trim()}. Connecting to your JXLab Client Portal session...`
      );
    }
  };

  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setResetRequested(false);

    const nextErrors: { email?: string; brief?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (brief.trim().length < 10) {
      nextErrors.brief = "Share at least one sentence about what you want to build.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmittingBrief(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          track: selectedTrack,
          timeline: selectedTimeline,
          brief: brief.trim(),
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setErrors({ brief: data.error || "Unable to submit brief right now." });
      } else {
        setStatusMessage(
          data.message || "Project brief received. We will reply within 24 hours."
        );
      }
    } catch {
      setErrors({
        brief: `Network error — email us directly at ${jxlabConfig.brand.email}.`,
      });
    } finally {
      setSubmittingBrief(false);
    }
  };

  const handleGoogleAuth = () => {
    setErrors({});
    setResetRequested(false);
    setStatusMessage(
      "Google OAuth handshake initiated for JXLab Client Portal. Redirecting when provider is configured."
    );
  };

  const handleForgotPassword = () => {
    setErrors({});
    setResetRequested(true);
    setStatusMessage(
      email.trim()
        ? `Password reset instructions queued for ${email.trim()}.`
        : "Enter your email address above, then click again to receive a reset link."
    );
  };

  return (
    <div
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6"
      style={{
        background:
          "radial-gradient(circle at 18% 22%, rgba(28, 122, 134, 0.52) 0%, transparent 48%), radial-gradient(circle at 82% 76%, rgba(232, 139, 46, 0.14) 0%, transparent 45%), radial-gradient(circle at 50% 45%, #0D4B59 0%, #072E3A 56%, #041D27 100%)",
      }}
    >
      {/* Articulated 1/5-Resolution Pixelated AI Agent Swarm Canvas */}
      <PixelAgentSwarmCanvas />

      {/* Back to Home Link */}
      <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#FBF5E8]/20 bg-[#05202A]/70 px-4 py-2 text-xs font-semibold text-[#FBF5E8] backdrop-blur-md transition hover:bg-[#0B3B4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6B96D] sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to JXLab
        </Link>
      </div>

      {/* Centered Cream Client Portal Card */}
      <motion.main
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="cream-card relative z-20 w-full max-w-md rounded-2xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <JxEmblem className="h-11 w-11" />
          <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8E653E]">
            JXLab Client Portal
          </p>

          {/* Scope-first switcher — primary path is project intake */}
          <div
            role="tablist"
            aria-label="Portal mode"
            className="mt-3 inline-flex rounded-full border border-[#DECBAE] bg-[#F2E5CC] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={portalView === "scope"}
              onClick={() => {
                setPortalView("scope");
                setErrors({});
                setStatusMessage(null);
              }}
              className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition ${
                portalView === "scope"
                  ? "bg-[#E88B2E] text-[#1B120A] shadow-xs"
                  : "text-[#5C4B3E] hover:text-[#1E1712]"
              }`}
            >
              Scope a Project
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={portalView === "account"}
              onClick={() => {
                setPortalView("account");
                setErrors({});
                setStatusMessage(null);
              }}
              className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition ${
                portalView === "account"
                  ? "bg-[#1E1712] text-[#FBF5E8] shadow-xs"
                  : "text-[#5C4B3E] hover:text-[#1E1712]"
              }`}
            >
              Client Account
            </button>
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-[#1E1712] sm:text-[26px]">
            {portalView === "scope"
              ? "Tell us what to build"
              : mode === "signup"
                ? "Create your JXLab account"
                : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-[#5C4B3E]">
            {portalView === "scope"
              ? "Agent, SaaS product, or internal tool — get a concrete architecture brief within 24 hours."
              : mode === "signup"
                ? "Create an account to track milestones, or skip ahead and scope a project first."
                : "Sign in for project milestones, agent traces, and deliverables."}
          </p>
        </div>

        {portalView === "scope" ? (
          <form onSubmit={handleBriefSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="scope-track"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5C4B3E]"
              >
                What do you need?
              </label>
              <select
                id="scope-track"
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="mt-1.5 block min-h-[46px] w-full rounded-xl border border-[#D8C6A8] bg-white/90 px-3.5 py-2.5 text-sm font-medium text-[#1E1712] focus:border-[#E88B2E] focus:outline-none focus:ring-2 focus:ring-[#E88B2E]/35"
              >
                {trackOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#5C4B3E]">
                Target Timeline
              </span>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {TIMELINE_OPTIONS.map((t) => {
                  const active = selectedTimeline === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTimeline(t)}
                      className={`min-h-[40px] rounded-xl border px-2 py-1.5 text-[11px] font-semibold transition ${
                        active
                          ? "border-[#E88B2E] bg-[#E88B2E] text-[#1B120A]"
                          : "border-[#D8C6A8] bg-white/80 text-[#5C4B3E] hover:border-[#E88B2E]"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="scope-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5C4B3E]"
              >
                Work Email
              </label>
              <input
                id="scope-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="you@company.com"
                className="mt-1.5 block min-h-[46px] w-full rounded-xl border border-[#D8C6A8] bg-white/90 px-3.5 py-2.5 text-sm text-[#1E1712] placeholder:text-[#9C8977] focus:border-[#E88B2E] focus:outline-none focus:ring-2 focus:ring-[#E88B2E]/35"
              />
              {errors.email && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B83927]">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="scope-brief"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5C4B3E]"
              >
                Project Goals
              </label>
              <textarea
                id="scope-brief"
                rows={3}
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  if (errors.brief) setErrors((p) => ({ ...p, brief: undefined }));
                }}
                placeholder="Describe the workflow to automate, the product to ship, or the internal tool your team needs…"
                className="mt-1.5 block w-full rounded-xl border border-[#D8C6A8] bg-white/90 px-3.5 py-2.5 text-sm text-[#1E1712] placeholder:text-[#9C8977] focus:border-[#E88B2E] focus:outline-none focus:ring-2 focus:ring-[#E88B2E]/35"
              />
              {errors.brief && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B83927]">
                  {errors.brief}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submittingBrief}
              className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#E88B2E] px-6 py-3 text-sm font-bold text-[#1B120A] shadow-[0_8px_22px_rgba(232,139,46,0.35)] transition hover:bg-[#F29A42] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
            >
              <Send className="h-4 w-4" />
              {submittingBrief ? "Sending brief..." : "Get architecture brief"}
            </button>

            <p className="text-center font-mono text-[11px] leading-relaxed text-[#7A5638]">
              100% client IP · Senior engineering pod · Reply within 24h
            </p>
          </form>
        ) : (
          <>
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="mt-6 flex min-h-[46px] w-full items-center justify-center gap-3 rounded-xl border border-[#D8C6A8] bg-white px-4 py-2.5 text-sm font-semibold text-[#1E1712] shadow-xs transition hover:bg-[#FAF6EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59560]"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Horizontal Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#DFCEB2]" />
              <span className="font-mono text-xs text-[#7D6854]">or</span>
              <span className="h-px flex-1 bg-[#DFCEB2]" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleAccountSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="portal-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#5C4B3E]"
                >
                  Email
                </label>
                <input
                  id="portal-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="you@company.com"
                  aria-invalid={Boolean(errors.email)}
                  className={`mt-1.5 block min-h-[46px] w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm text-[#1E1712] placeholder:text-[#9C8977] focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-[#C54330] focus:ring-[#C54330]/35"
                      : "border-[#D8C6A8] focus:border-[#C59560] focus:ring-[#C59560]/35"
                  }`}
                />
                {errors.email && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B83927]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="portal-password"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#5C4B3E]"
                  >
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-semibold text-[#8E5924] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#C59560]"
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>

                <div className="relative mt-1.5">
                  <input
                    id="portal-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder={
                      mode === "signup"
                        ? "At least 8 characters"
                        : "Enter your password"
                    }
                    aria-invalid={Boolean(errors.password)}
                    className={`block min-h-[46px] w-full rounded-xl border bg-white/90 py-2.5 pl-3.5 pr-11 text-sm text-[#1E1712] placeholder:text-[#9C8977] focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-[#C54330] focus:ring-[#C54330]/35"
                        : "border-[#D8C6A8] focus:border-[#C59560] focus:ring-[#C59560]/35"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#6E5B4B] hover:text-[#1E1712]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B83927]">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#E88B2E] px-6 py-3 text-sm font-bold text-[#1B120A] shadow-[0_8px_22px_rgba(232,139,46,0.35)] transition hover:bg-[#F29A42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
              >
                {mode === "signup" ? "Create account" : "Sign in"}
              </button>
            </form>

            {/* Mode Toggle Footer */}
            <p className="mt-6 text-center text-sm text-[#5C4B3E]">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-[#8E541B] underline-offset-4 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-[#8E541B] underline-offset-4 hover:underline"
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>

            {mode === "signup" && (
              <button
                type="button"
                onClick={() => {
                  setPortalView("scope");
                  setErrors({});
                  setStatusMessage(null);
                }}
                className="mt-3 w-full text-center text-xs font-semibold text-[#8E541B] underline-offset-4 hover:underline"
              >
                Prefer to scope a project without an account? →
              </button>
            )}
          </>
        )}

        {/* Feedback Banner */}
        {statusMessage && (
          <div
            role="status"
            className={`mt-4 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
              resetRequested
                ? "border-[#D8B98B] bg-[#F6EBDA] text-[#5B4021]"
                : "border-[#9EC4AE] bg-[#EAF5EE] text-[#1D4B31]"
            }`}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </motion.main>
    </div>
  );
}
