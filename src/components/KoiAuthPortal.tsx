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

type KoiPattern = "kohaku" | "sanke" | "showa" | "ogon" | "orange";

interface KoiFish {
  pattern: KoiPattern;
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
  baseColor: string;
  patchColor: string;
  accentColor: string;
  finColor: string;
}

const KOI_PALETTES: Record<
  KoiPattern,
  { base: string; patch: string; accent: string; fin: string }
> = {
  kohaku: { base: "#FBF5E8", patch: "#E4572E", accent: "#E4572E", fin: "#FCEAD0" },
  sanke: { base: "#FBF5E8", patch: "#D94E2A", accent: "#222024", fin: "#F4E4CE" },
  showa: { base: "#27232A", patch: "#E4572E", accent: "#FBF5E8", fin: "#CFC7BE" },
  ogon: { base: "#F5B84B", patch: "#FCE19C", accent: "#E49A2B", fin: "#FCE7B3" },
  orange: { base: "#E86A2E", patch: "#F6B96D", accent: "#C9471D", fin: "#F8C38A" },
};

const TIMELINE_OPTIONS = ["2–4 Weeks", "4–8 Weeks", "Embedded Retainer"] as const;

function PixelKoiPondCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cw = 256;
    let ch = 160;
    let fishList: KoiFish[] = [];

    const patterns: KoiPattern[] = ["kohaku", "sanke", "showa", "ogon", "orange"];

    const wrapAngle = (a: number) => {
      while (a > Math.PI) a -= Math.PI * 2;
      while (a < -Math.PI) a += Math.PI * 2;
      return a;
    };

    const simulate = (dt: number, t: number) => {
      const margin = Math.min(cw, ch) * 0.12;

      for (let i = 0; i < fishList.length; i++) {
        const f = fishList[i];
        const head = f.segments[0];

        if (f.glideLeft > 0) {
          f.glideLeft -= dt;
        } else if (Math.random() < 0.04 * dt) {
          f.glideLeft = 2 + Math.random() * 2.5;
        }
        const targetSpeed = f.glideLeft > 0 ? f.baseSpeed * 0.35 : f.baseSpeed;
        f.speed += (targetSpeed - f.speed) * Math.min(1, dt * 2.5);

        let turnRate =
          0.6 * Math.sin(0.37 * t + f.wanderA) +
          0.4 * Math.sin(0.83 * t + f.wanderB);

        if (
          head.x < margin ||
          head.x > cw - margin ||
          head.y < margin ||
          head.y > ch - margin
        ) {
          const toCenter = Math.atan2(ch * 0.5 - head.y, cw * 0.5 - head.x);
          const diff = wrapAngle(toCenter - f.heading);
          turnRate += diff * 1.4;
        }

        for (let j = 0; j < fishList.length; j++) {
          if (i === j) continue;
          const other = fishList[j];
          const oh = other.segments[0];
          const dx = head.x - oh.x;
          const dy = head.y - oh.y;
          const dist = Math.hypot(dx, dy);
          const avoidR = 10 * (f.size + other.size);
          if (dist > 0.01 && dist < avoidR) {
            const away = Math.atan2(dy, dx);
            const diff = wrapAngle(away - f.heading);
            turnRate += diff * (1 - dist / avoidR) * 1.25;
          }
        }

        turnRate = Math.max(-1.2, Math.min(1.2, turnRate));
        f.heading = wrapAngle(f.heading + turnRate * dt);

        head.x += Math.cos(f.heading) * f.speed * dt;
        head.y += Math.sin(f.heading) * f.speed * dt;
        f.phase += (f.speed * 0.42 + 1.8) * dt;

        const n = f.segments.length;
        for (let s = 1; s < n; s++) {
          const prev = f.segments[s - 1];
          const cur = f.segments[s];
          const dx = cur.x - prev.x;
          const dy = cur.y - prev.y;
          const ang = Math.atan2(dy, dx);
          const tailWeight = Math.pow(s / (n - 1), 1.6);
          const wave = Math.sin(f.phase - 0.55 * s) * tailWeight * 0.34;
          cur.x = prev.x + Math.cos(ang + wave) * f.spacing;
          cur.y = prev.y + Math.sin(ang + wave) * f.spacing;
        }
      }
    };

    const initPond = () => {
      cw = Math.max(84, Math.floor(window.innerWidth / 5));
      ch = Math.max(120, Math.floor(window.innerHeight / 5));
      canvas.width = cw;
      canvas.height = ch;
      ctx.imageSmoothingEnabled = false;

      const count = window.innerWidth < 640 ? 5 : 8;
      fishList = Array.from({ length: count }, (_, idx) => {
        const pattern = patterns[idx % patterns.length];
        const pal = KOI_PALETTES[pattern];
        const size = 0.85 + (((idx * 37) % 100) / 100) * 0.7;
        const segCount = 10 + (idx % 4);
        const spacing = 1.25 + 0.45 * size;
        const startX = (0.12 + ((idx * 0.29) % 0.76)) * cw;
        const startY = (0.14 + ((idx * 0.41) % 0.72)) * ch;
        const heading = (idx * 1.37) % (Math.PI * 2);

        const segments = Array.from({ length: segCount }, (__, sIdx) => ({
          x: startX - Math.cos(heading) * sIdx * spacing,
          y: startY - Math.sin(heading) * sIdx * spacing,
        }));

        const baseSpeed = 9 + size * 4.5;
        return {
          pattern,
          size,
          alpha: 0.48 + ((size - 0.85) / 0.7) * 0.52,
          baseSpeed,
          speed: baseSpeed,
          heading,
          wanderA: idx * 2.1,
          wanderB: idx * 3.7,
          phase: idx * 1.9,
          glideLeft: 0,
          segments,
          spacing,
          baseColor: pal.base,
          patchColor: pal.patch,
          accentColor: pal.accent,
          finColor: pal.fin,
        };
      });

      fishList.sort((a, b) => a.size - b.size);

      for (let wStep = 0; wStep < 40; wStep++) {
        simulate(0.05, wStep * 0.05);
      }
    };

    const drawKoi = (f: KoiFish, shadowPass: boolean) => {
      const n = f.segments.length;
      const ox = shadowPass ? 1.5 : 0;
      const oy = shadowPass ? 2.0 : 0;

      ctx.save();
      ctx.globalAlpha = shadowPass ? f.alpha * 0.35 : f.alpha;

      const seg1 = f.segments[1];
      const seg2 = f.segments[2];
      const finAngle = Math.atan2(seg1.y - seg2.y, seg1.x - seg2.x);
      const finLen = 3.4 + f.size * 1.4;
      const finSweep = 0.95 + Math.sin(f.phase * 0.8) * 0.16;

      ctx.strokeStyle = shadowPass ? "#021218" : f.finColor;
      ctx.lineWidth = Math.max(1, Math.round(f.size * 1.2));
      for (const side of [-1, 1]) {
        const a = finAngle + side * (Math.PI * 0.58 + finSweep * 0.2);
        ctx.beginPath();
        ctx.moveTo(seg2.x + ox, seg2.y + oy);
        ctx.lineTo(
          seg2.x + ox + Math.cos(a) * finLen,
          seg2.y + oy + Math.sin(a) * finLen
        );
        ctx.stroke();
      }

      const tailEnd = f.segments[n - 1];
      const tailPrev = f.segments[n - 2];
      const tailDir = Math.atan2(tailEnd.y - tailPrev.y, tailEnd.x - tailPrev.x);
      const tailLen = 3.2 + f.size * 1.6;
      ctx.strokeStyle = shadowPass ? "#021218" : f.finColor;
      ctx.lineWidth = 1;
      for (const spread of [-0.42, 0, 0.42]) {
        ctx.beginPath();
        ctx.moveTo(tailEnd.x + ox, tailEnd.y + oy);
        ctx.lineTo(
          tailEnd.x + ox + Math.cos(tailDir + spread) * tailLen,
          tailEnd.y + oy + Math.sin(tailDir + spread) * tailLen
        );
        ctx.stroke();
      }

      for (let i = n - 1; i >= 0; i--) {
        const seg = f.segments[i];
        const frac = i / (n - 1);
        const radius =
          (i === 0
            ? 2.0
            : Math.sin(Math.pow(1 - frac, 0.72) * Math.PI * 0.85) * 2.5 + 0.55) *
          f.size;

        let color = f.baseColor;
        if (shadowPass) {
          color = "#021218";
        } else if (i === 1 || i === 2 || i === 5 || i === 6) {
          color = f.patchColor;
        } else if (i === 4 && (f.pattern === "sanke" || f.pattern === "showa")) {
          color = f.accentColor;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(seg.x + ox, seg.y + oy, Math.max(0.8, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!shadowPass) {
        const h0 = f.segments[0];
        const perp = f.heading + Math.PI / 2;
        const eyeDist = 1.05 * f.size;
        ctx.fillStyle = "#0C181C";
        ctx.fillRect(
          Math.round(h0.x + Math.cos(perp) * eyeDist),
          Math.round(h0.y + Math.sin(perp) * eyeDist),
          1,
          1
        );
        ctx.fillRect(
          Math.round(h0.x - Math.cos(perp) * eyeDist),
          Math.round(h0.y - Math.sin(perp) * eyeDist),
          1,
          1
        );
      }

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, cw, ch);
      for (const f of fishList) drawKoi(f, true);
      for (const f of fishList) drawKoi(f, false);
    };

    initPond();
    render();

    const onResize = () => {
      initPond();
      render();
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
        render();
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
  const hasScopeContext = Boolean(trackParam || projectParam);
  const initialMode =
    searchParams.get("mode") === "signin" ? "signin" : "signup";
  const nextPath = searchParams.get("next");

  const [portalView, setPortalView] = useState<"account" | "scope">(
    hasScopeContext ? "scope" : "account"
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
    setMode(searchParams.get("mode") === "signin" ? "signin" : "signup");
    if (searchParams.get("track") || searchParams.get("project")) {
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
      {/* Articulated 1/5-Resolution Pixelated Koi Pond Canvas */}
      <PixelKoiPondCanvas />

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

          {/* View Switcher: Client Account vs Project Scoping */}
          <div
            role="tablist"
            aria-label="Portal mode"
            className="mt-3 inline-flex rounded-full border border-[#DECBAE] bg-[#F2E5CC] p-1"
          >
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
                  ? "bg-[#1E1712] text-[#FBF5E8] shadow-xs"
                  : "text-[#5C4B3E] hover:text-[#1E1712]"
              }`}
            >
              Scope a Project
            </button>
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-[#1E1712] sm:text-[26px]">
            {portalView === "scope"
              ? "Scope your JXLab build"
              : mode === "signup"
                ? "Create your JXLab account"
                : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-[#5C4B3E]">
            {portalView === "scope"
              ? "Pick a track and timeline — we reply with a concrete architecture brief within 24 hours."
              : mode === "signup"
                ? "Start scoping your autonomous AI or custom software sprint."
                : "Sign in to access project milestones, traces, and deliverables."}
          </p>
        </div>

        {portalView === "scope" ? (
          <form onSubmit={handleBriefSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="scope-track"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5C4B3E]"
              >
                Solution Track / Demo
              </label>
              <select
                id="scope-track"
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="mt-1.5 block min-h-[46px] w-full rounded-xl border border-[#D8C6A8] bg-white/90 px-3.5 py-2.5 text-sm font-medium text-[#1E1712] focus:border-[#C59560] focus:outline-none focus:ring-2 focus:ring-[#C59560]/35"
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
                          ? "border-[#1E1712] bg-[#1E1712] text-[#FBF5E8]"
                          : "border-[#D8C6A8] bg-white/80 text-[#5C4B3E] hover:border-[#C59560]"
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
                className="mt-1.5 block min-h-[46px] w-full rounded-xl border border-[#D8C6A8] bg-white/90 px-3.5 py-2.5 text-sm text-[#1E1712] placeholder:text-[#9C8977] focus:border-[#C59560] focus:outline-none focus:ring-2 focus:ring-[#C59560]/35"
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
                placeholder="Tell us the workflow, agent, or platform you want JXLab to engineer..."
                className="mt-1.5 block w-full rounded-xl border border-[#D8C6A8] bg-white/90 px-3.5 py-2.5 text-sm text-[#1E1712] placeholder:text-[#9C8977] focus:border-[#C59560] focus:outline-none focus:ring-2 focus:ring-[#C59560]/35"
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
              className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#C59560] px-6 py-3 text-sm font-bold text-[#1B120A] shadow-[0_8px_22px_rgba(116,74,30,0.28)] transition hover:bg-[#B4834D] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
            >
              <Send className="h-4 w-4" />
              {submittingBrief ? "Sending brief..." : "Send Project Brief"}
            </button>
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
                className="mt-2 flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#C59560] px-6 py-3 text-sm font-bold text-[#1B120A] shadow-[0_8px_22px_rgba(116,74,30,0.28)] transition hover:bg-[#B4834D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
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
