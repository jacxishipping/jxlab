"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail, Youtube } from "lucide-react";
import { jxlabConfig, type SocialLink } from "@/data/jxlabConfig";

function XBrandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  switch (icon) {
    case "github":
      return <Github className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "x":
      return <XBrandIcon />;
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    case "email":
      return <Mail className="h-4 w-4" />;
  }
}

// Bidirectional SVG path-tangent fiber conduit patrolled by Nano-Agent Bots
function FiberConduitBay({ mirror = false }: { mirror?: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const bot1Ref = useRef<HTMLDivElement>(null);
  const bot2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalLen = pathEl.getTotalLength();
    if (totalLen <= 10) return;

    const bots = [
      { el: bot1Ref.current, u: totalLen * 0.25, dir: 1, speed: 26, gait: 0 },
      { el: bot2Ref.current, u: totalLen * 0.72, dir: -1, speed: 21, gait: 0.4 },
    ];

    let rafId = 0;
    let lastTime = performance.now();

    const step = (dt: number) => {
      for (const b of bots) {
        if (!b.el) continue;
        const delta = b.speed * dt;
        b.u += delta * b.dir;

        if (b.u >= totalLen) {
          b.u = totalLen;
          b.dir = -1;
        } else if (b.u <= 0) {
          b.u = 0;
          b.dir = 1;
        }

        const p = pathEl.getPointAtLength(b.u);
        const lookAhead = Math.max(0, Math.min(totalLen, b.u + b.dir * 2.5));
        const p2 = pathEl.getPointAtLength(lookAhead);
        const angle = Math.atan2(p2.y - p.y, p2.x - p.x);
        const flipY = Math.cos(angle) < 0 ? -1 : 1;

        const edgeDist = Math.min(b.u, totalLen - b.u);
        const opacity = Math.max(0, Math.min(1, edgeDist / 26));

        b.gait = (b.gait + delta / 14) % 1;

        b.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(
          1
        )}px, 0) translate(-50%, -50%) rotate(${((angle * 180) / Math.PI).toFixed(
          1
        )}deg) scaleY(${flipY})`;
        b.el.style.opacity = opacity.toFixed(3);
        b.el.style.setProperty("--gait", b.gait.toFixed(4));
      }
    };

    step(0);
    if (prefersReduced) return;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      step(dt);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Stepped PCB fiber conduit geometry
  const conduitD =
    "M 176 104 H 122 L 94 64 H 44 L 22 86 V 118 L 44 138 H 104 L 128 144 H 176";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative hidden h-[210px] w-[180px] shrink-0 lg:block ${
        mirror ? "-scale-x-100" : ""
      }`}
    >
      <svg viewBox="0 0 180 210" fill="none" className="h-full w-full">
        {/* Dual-stroke subsurface fiber conduit */}
        <path
          d={conduitD}
          stroke="#1D3840"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          ref={pathRef}
          d={conduitD}
          stroke="#0D1920"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stored Compute / Weight Nodes inside Vault */}
        <rect x="44" y="90" width="12" height="12" rx="3" fill="#F6B96D" />
        <rect x="62" y="98" width="10" height="10" rx="2.5" fill="#7CE5DB" />
        <rect x="52" y="76" width="8" height="8" rx="2" fill="#E88B2E" />
      </svg>

      {/* Path-tangent nano agent consoles */}
      {[bot1Ref, bot2Ref].map((ref, idx) => (
        <div
          key={idx}
          ref={ref}
          className="absolute left-0 top-0 will-change-transform"
        >
          <svg viewBox="0 0 26 16" fill="none" className="h-3.5 w-6 overflow-visible">
            <g className="ant-body-bob">
              <path
                className="ant-leg-a"
                d="M7 11L5 15M17 11L19 15"
                stroke="#70D6CE"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                className="ant-leg-b"
                d="M10 11L9 15M14 11L15 15"
                stroke="#70D6CE"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <rect
                x="5"
                y="4"
                width="15"
                height="8"
                rx="1.5"
                fill="#0E1A20"
                stroke="#70D6CE"
                strokeWidth="1"
              />
              <rect x="8" y="6.5" width="5" height="2" rx="0.4" fill="#7CE5DB" />
              <rect x="14" y="6.5" width="4" height="2" rx="0.4" fill="#F6B96D" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}

export function UndergroundFooter() {
  const { undergroundCta, socialLinks, brand } = jxlabConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const [awake, setAwake] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setAwake(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-awake={awake ? "true" : "false"}
      className="soil-grain relative overflow-hidden"
      style={{
        backgroundColor: "#141315",
        backgroundImage:
          "radial-gradient(rgba(124, 229, 219, 0.12) 1px, transparent 1px), radial-gradient(rgba(246, 185, 109, 0.06) 1px, transparent 1px), linear-gradient(180deg, #161314 0%, #121011 65%, #0C0B0C 100%)",
        backgroundSize: "24px 24px, 40px 40px, 100% 100%",
      }}
    >
      {/* Closing Subsurface Compute Core CTA Vault */}
      <section
        id="cta"
        className="relative flex min-h-[100svh] scroll-mt-20 flex-col justify-center px-4 py-24 sm:px-6 sm:py-28"
      >
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center">
          <FiberConduitBay />

          {/* Central Rounded Compute Core Vault CTA */}
          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-[#70D6CE]/35 bg-gradient-to-b from-[#121C22] to-[#0C1216] px-6 py-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(124,229,219,0.18)] sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#70D6CE]/55 to-transparent"
            />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#70D6CE]">
              Deploy Core // Launchpad
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#FBF5E8] sm:text-5xl">
              {undergroundCta.headline}
            </h2>
            <p className="mt-4 font-mono text-xs tracking-wide text-[#CFE0E2] sm:text-sm">
              {undergroundCta.subline}
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href={undergroundCta.ctaHref}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#E88B2E] px-8 py-3 text-base font-semibold text-[#1B120A] shadow-[0_12px_30px_rgba(232,139,46,0.35)] transition hover:-translate-y-0.5 hover:bg-[#F29A42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBF5E8]"
              >
                {undergroundCta.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <FiberConduitBay mirror />
        </div>

        {/* Fiber Social Bus */}
        <div className="relative mx-auto mt-16 max-w-xl">
          <div
            aria-hidden="true"
            className="absolute inset-x-4 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#1A2D34] via-[#7CE5DB]/40 to-[#1A2D34]"
          />
          <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                aria-label={social.name}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7CE5DB]/35 bg-[#10191F] text-[#FBF5E8] shadow-lg transition hover:-translate-y-0.5 hover:border-[#E88B2E] hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E]"
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Legal Footer Bar */}
      <footer className="border-t border-[#7CE5DB]/15 bg-[#0A0D10] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs text-[#C7D3D8]">{brand.copyright}</p>
            <p className="mt-1 text-xs text-[#7D8C92]">
              Engineered by JXLab · {brand.email}
            </p>
          </div>

          <div className="flex flex-col items-start gap-1.5 text-xs sm:items-end">
            <Link
              href="/privacy"
              className="inline-flex min-h-[32px] items-center text-[#C8D8DD] underline-offset-4 transition hover:text-[#F6B96D] hover:underline"
            >
              Privacy Notice
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-[32px] items-center text-[#C8D8DD] underline-offset-4 transition hover:text-[#F6B96D] hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
