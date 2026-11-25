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

// Bidirectional SVG path-tangent tunnel ant (getPointAtLength + tangent rotation + scaleY flip + 26px end fade + gait scrub)
function TunnelChamber({ mirror = false }: { mirror?: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const ant1Ref = useRef<HTMLDivElement>(null);
  const ant2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalLen = pathEl.getTotalLength();
    if (totalLen <= 10) return;

    const ants = [
      { el: ant1Ref.current, u: totalLen * 0.25, dir: 1, speed: 24, gait: 0 },
      { el: ant2Ref.current, u: totalLen * 0.72, dir: -1, speed: 19, gait: 0.4 },
    ];

    let rafId = 0;
    let lastTime = performance.now();

    const step = (dt: number) => {
      for (const a of ants) {
        if (!a.el) continue;
        const delta = a.speed * dt;
        a.u += delta * a.dir;

        if (a.u >= totalLen) {
          a.u = totalLen;
          a.dir = -1;
        } else if (a.u <= 0) {
          a.u = 0;
          a.dir = 1;
        }

        const p = pathEl.getPointAtLength(a.u);
        const lookAhead = Math.max(0, Math.min(totalLen, a.u + a.dir * 2.5));
        const p2 = pathEl.getPointAtLength(lookAhead);
        const angle = Math.atan2(p2.y - p.y, p2.x - p.x);
        const flipY = Math.cos(angle) < 0 ? -1 : 1;

        // Fade smoothly over outer 26px of each tunnel end
        const edgeDist = Math.min(a.u, totalLen - a.u);
        const opacity = Math.max(0, Math.min(1, edgeDist / 26));

        a.gait = (a.gait + delta / 14) % 1;

        a.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(
          1
        )}px, 0) translate(-50%, -50%) rotate(${((angle * 180) / Math.PI).toFixed(
          1
        )}deg) scaleY(${flipY})`;
        a.el.style.opacity = opacity.toFixed(3);
        a.el.style.setProperty("--gait", a.gait.toFixed(4));
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

  const tunnelD =
    "M 176 105 C 128 105 108 68 72 62 C 40 56 18 76 20 98 C 22 122 48 136 78 132 C 110 126 128 144 176 144";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative hidden h-[210px] w-[180px] shrink-0 lg:block ${
        mirror ? "-scale-x-100" : ""
      }`}
    >
      <svg viewBox="0 0 180 210" fill="none" className="h-full w-full">
        {/* Dual-stroke SVG underground tunnel */}
        <path
          d={tunnelD}
          stroke="#432B1D"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          ref={pathRef}
          d={tunnelD}
          stroke="#1D120B"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Stored golden seeds / nodes */}
        <circle cx="48" cy="96" r="5" fill="#F6B96D" />
        <circle cx="64" cy="105" r="4" fill="#E88B2E" />
        <circle cx="56" cy="84" r="3.5" fill="#FDE0B5" />
      </svg>

      {/* Two bidirectional path-tangent ambient ants */}
      {[ant1Ref, ant2Ref].map((ref, idx) => (
        <div
          key={idx}
          ref={ref}
          className="absolute left-0 top-0 will-change-transform"
        >
          <svg viewBox="0 0 26 16" fill="none" className="h-3.5 w-6 overflow-visible">
            <g className="ant-body-bob">
              <path
                className="ant-leg-a"
                d="M7 9L5 14M13 7L12 2M17 9L20 14"
                stroke="#C59560"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                className="ant-leg-b"
                d="M8 7L6 2M13 9L12 14M17 7L20 2"
                stroke="#C59560"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                className="ant-antenna-l"
                d="M21 7L25 4"
                stroke="#C59560"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                className="ant-antenna-r"
                d="M21 9L25 12"
                stroke="#C59560"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <ellipse cx="6.5" cy="8" rx="3.2" ry="2.2" fill="#E88B2E" />
              <ellipse cx="12.5" cy="8" rx="2.3" ry="1.8" fill="#C59560" />
              <circle cx="18.2" cy="8" r="2.1" fill="#E88B2E" />
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

  // Pause offscreen ambient antennae via data-awake="false" (matching hackthenest.tech)
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
        backgroundColor: "#1A110B",
        backgroundImage:
          "radial-gradient(rgba(197, 149, 96, 0.14) 1px, transparent 1px), radial-gradient(rgba(251, 245, 232, 0.05) 1px, transparent 1px), linear-gradient(180deg, #1F140D 0%, #170F0A 65%, #110B07 100%)",
        backgroundSize: "22px 22px, 37px 37px, 100% 100%",
      }}
    >
      {/* Closing Underground CTA Chamber */}
      <section
        id="cta"
        className="relative scroll-mt-20 px-4 pb-20 pt-8 sm:px-6 sm:pb-24"
      >
        <div className="relative mx-auto flex max-w-6xl items-center justify-center">
          <TunnelChamber />

          {/* Central Rounded Underground Ant-Chamber CTA */}
          <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border-2 border-[#C59560]/60 bg-gradient-to-b from-[#2B1B12] to-[#1D120C] px-6 py-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(246,185,109,0.22)] sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#F6B96D]/60 to-transparent"
            />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C59560]">
              Colony Chamber // Launchpad
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#FBF5E8] sm:text-5xl">
              {undergroundCta.headline}
            </h2>
            <p className="mt-4 font-mono text-xs tracking-wide text-[#DFC8AA] sm:text-sm">
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

          <TunnelChamber mirror />
        </div>

        {/* Social Tunnel */}
        <div className="relative mx-auto mt-16 max-w-xl">
          <div
            aria-hidden="true"
            className="absolute inset-x-4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#2E1E14]"
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C59560]/40 bg-[#1B120C] text-[#FBF5E8] shadow-lg transition hover:-translate-y-0.5 hover:border-[#E88B2E] hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E]"
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Legal Footer Bar */}
      <footer className="border-t border-[#C59560]/20 bg-[#0E0906] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs text-[#C7B299]">{brand.copyright}</p>
            <p className="mt-1 text-xs text-[#8D7862]">
              Crafted with precision by JXLab · {brand.email}
            </p>
          </div>

          <div className="flex flex-col items-start gap-1.5 text-xs sm:items-end">
            <Link
              href="/privacy"
              className="inline-flex min-h-[32px] items-center text-[#D8C4AA] underline-offset-4 transition hover:text-[#F6B96D] hover:underline"
            >
              Privacy Notice
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-[32px] items-center text-[#D8C4AA] underline-offset-4 transition hover:text-[#F6B96D] hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
