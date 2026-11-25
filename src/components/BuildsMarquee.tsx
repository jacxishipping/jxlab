"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Lock, Sparkles, TrendingUp } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";

// Linear deploy/ship packet flyover (studio language)
function DeployPacketSilhouette() {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="none"
      className="h-10 w-28 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:h-12 sm:w-36"
      aria-hidden="true"
    >
      <path
        d="M8 24H118"
        stroke="#70D6CE"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeDasharray="4 5"
      />
      <rect
        x="48"
        y="12"
        width="64"
        height="24"
        rx="4"
        fill="#0E181E"
        stroke="#E88B2E"
        strokeWidth="1.5"
      />
      <rect x="56" y="18" width="28" height="3" rx="1" fill="#7CE5DB" fillOpacity="0.7" />
      <rect x="56" y="25" width="40" height="3" rx="1" fill="#F6B96D" fillOpacity="0.55" />
      <path
        d="M112 16L132 24L112 32Z"
        fill="#E88B2E"
        fillOpacity="0.9"
      />
      <circle cx="20" cy="24" r="3" fill="#7CE5DB" fillOpacity="0.8" />
      <circle cx="32" cy="24" r="2" fill="#F6B96D" fillOpacity="0.7" />
    </svg>
  );
}

// Compact build chip that settles onto showcase cards
function BuildChipGlyph({ label = "build" }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-md border border-[#70D6CE]/55 bg-[#0E181E]/95 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#F6B96D] shadow-[0_0_12px_rgba(112,214,206,0.35)]"
    >
      {label}
    </div>
  );
}

// Bespoke architectural visual preview header per flagship project
function ProjectPreviewBanner({ id }: { id: string }) {
  if (id === "bridgeai3") {
    return (
      <div
        aria-hidden="true"
        className="mb-5 overflow-hidden rounded-xl border border-[#2C2420]/20 bg-gradient-to-br from-[#0F2429] via-[#122D33] to-[#1A1D2B] p-3.5 font-mono text-[10px] text-[#D7F0EC]"
      >
        <div className="flex items-center justify-between text-[9px] text-[#8CDAD2]/75">
          <span>MCP // OAUTH 2.1 CONTROL PLANE</span>
          <span className="rounded bg-[#5BBF99]/20 px-1.5 py-0.5 text-[#7EE6BE]">
            HASH-CHAINED AUDIT
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-1.5 text-center">
          <span className="flex-1 rounded-lg border border-[#70D6CE]/30 bg-[#081A1E] px-2 py-1.5 text-[#FBF5E8]">
            Claude / Codex
          </span>
          <span className="text-[#E88B2E]">→</span>
          <span className="flex-1 rounded-lg border border-[#E88B2E]/50 bg-[#2C1A0E] px-2 py-1.5 font-semibold text-[#FFCF7A]">
            4-Tier Policy
          </span>
          <span className="text-[#E88B2E]">→</span>
          <span className="flex-1 rounded-lg border border-[#70D6CE]/30 bg-[#081A1E] px-2 py-1.5 text-[#FBF5E8]">
            Win · Mac · Linux
          </span>
        </div>
      </div>
    );
  }

  if (id === "jxai") {
    return (
      <div
        aria-hidden="true"
        className="mb-5 overflow-hidden rounded-xl border border-[#2C2420]/20 bg-gradient-to-br from-[#191224] via-[#24162F] to-[#131722] p-3.5 font-mono text-[10px] text-[#F5E6D3]"
      >
        <div className="flex items-center justify-between text-[9px] text-[#F6B96D]/80">
          <span>MOE_ENGINE // C++20 SIMD</span>
          <span>127.0.0.1:8001/v1</span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#C8B9D6]">GGUF + SafeTensors</span>
            <span className="text-[#7EE6BE]">AVX2 / AVX-512</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#E88B2E] via-[#F6B96D] to-[#7CE5DB]" />
          </div>
          <div className="flex justify-between text-[9px] text-[#A99BB8]">
            <span>Zero Ollama Dependency</span>
            <span>SSE Stream + Tauri Shell</span>
          </div>
        </div>
      </div>
    );
  }

  if (id === "jxui-react") {
    return (
      <div
        aria-hidden="true"
        className="mb-5 overflow-hidden rounded-xl border border-[#2C2420]/20 bg-gradient-to-br from-[#1E1A36] via-[#2C234B] to-[#1C2A3A] p-3.5 text-[#FBF5E8]"
      >
        <div className="flex items-center justify-between font-mono text-[9px] text-[#C8C3EA]">
          <span>@jacxishippingorg/jx-ui-react</span>
          <span className="rounded bg-[#7EE6BE]/20 px-1.5 py-0.5 text-[#7EE6BE]">
            22/22 PASSING
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 backdrop-blur-md">
            <div className="h-1.5 w-14 rounded-full bg-[#F6B96D]" />
            <div className="mt-1.5 h-1.5 w-20 rounded-full bg-white/35" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 font-mono text-[10px]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E88B2E] shadow-[0_0_8px_#E88B2E]" />
            Spring UI
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="mb-5 overflow-hidden rounded-xl border border-[#2C2420]/20 bg-gradient-to-br from-[#1B1410] via-[#281B14] to-[#171B26] p-3.5 font-mono text-[10px] text-[#FBF5E8]"
    >
      <div className="flex items-center justify-between text-[9px]">
        <span className="inline-flex items-center gap-1.5 text-[#FFCF7A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5BBF99]" />
          LIVE AUCTION HEARTBEAT
        </span>
        <span className="text-[#C7B299]">SOCKET.IO · REDIS</span>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
          <p className="text-[8px] text-[#B8A58D]">QUEUE</p>
          <p className="font-semibold text-[#F6B96D]">BullMQ</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
          <p className="text-[8px] text-[#B8A58D]">CLIENTS</p>
          <p className="font-semibold text-[#7EE6BE]">3 Platforms</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
          <p className="text-[8px] text-[#B8A58D]">DEPLOY</p>
          <p className="font-semibold text-[#FBF5E8]">K8s / AWS</p>
        </div>
      </div>
    </div>
  );
}

export function BuildsMarquee() {
  const { buildsSection, techStackMarquee } = jxlabConfig;
  const stageRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const stageInView = useInView(stageRef, { once: true, amount: 0.25 });
  const [marqueeDurationSec, setMarqueeDurationSec] = useState(24);

  // Constant 70px/s marquee speed matching hackthenest.tech
  useEffect(() => {
    const el = marqueeTrackRef.current;
    if (!el) return;

    const recalc = () => {
      const halfWidth = el.scrollWidth / 2;
      if (halfWidth > 0) {
        setMarqueeDurationSec(Math.max(8, halfWidth / 70));
      }
    };

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const triggerFlyover = stageInView && !prefersReduced;

  return (
    <section
      id="builds"
      className="relative scroll-mt-20 overflow-hidden bg-transparent px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FBF5E8]/20 bg-[#121820]/55 px-3.5 py-1 font-mono text-xs font-semibold tracking-widest text-[#F6B96D] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {buildsSection.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#FBF5E8] sm:text-5xl">
            {buildsSection.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#E2E4F5]/85 sm:text-lg">
            {buildsSection.description}
          </p>
        </motion.div>

        {/* Deploy packet flyover + build-chip settle */}
        <div ref={stageRef} className="relative mt-14">
          {triggerFlyover && (
            <motion.div
              aria-hidden="true"
              initial={{ x: "-24vw", y: "0vh", rotate: 0, opacity: 0.95 }}
              animate={{
                x: "124vw",
                y: ["0vh", "-2vh", "0vh"],
                rotate: [0, -2, 0],
                opacity: [0.95, 1, 0],
              }}
              transition={{
                x: { duration: 2, ease: "linear" },
                y: { duration: 2, ease: "easeInOut" },
                rotate: { duration: 2, ease: "easeInOut" },
                opacity: { duration: 2, times: [0, 0.9, 1] },
              }}
              className="pointer-events-none fixed left-0 top-[22vh] z-40"
            >
              <DeployPacketSilhouette />
            </motion.div>
          )}

          {/* 2x2 Showcase Grid for the 4 Real JXLab Projects */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {buildsSection.builds.map((build, idx) => {
              const isSecondRow = idx >= 2;
              const colIdx = idx % 2;
              const eaglePassDelay = 0.28 + colIdx * 0.34 + (isSecondRow ? 0.12 : 0);
              const featherDuration = isSecondRow ? 1.15 : 0.95;
              const tileRevealDelay = eaglePassDelay + 0.74 * featherDuration;
              const dir = idx % 2 === 0 ? 1 : -1;

              return (
                <div key={build.id} className="relative">
                  {triggerFlyover && (
                    <motion.div
                      aria-hidden="true"
                      initial={{
                        y: -92,
                        x: dir * -18,
                        rotate: dir * 34,
                        scale: 0.55,
                        opacity: 0,
                      }}
                      animate={{
                        y: [-92, -44, -6, 10],
                        x: [dir * -18, dir * 16, dir * -6, 0],
                        rotate: [dir * 34, dir * -12, dir * 4, 0],
                        scale: [0.55, 0.85, 1, 1],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        delay: eaglePassDelay,
                        duration: featherDuration,
                        times: [0, 0.4, 0.76, 1],
                        ease: ["easeIn", "linear", "easeOut"],
                      }}
                      className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
                    >
                      <BuildChipGlyph
                        label={
                          build.id === "bidnix"
                            ? "deploy"
                            : build.id === "jxui-react"
                              ? "ui"
                              : "build"
                        }
                      />
                    </motion.div>
                  )}

                  <motion.article
                    initial={
                      prefersReduced
                        ? { opacity: 1, scale: 1, y: 0 }
                        : { opacity: 0, scale: 0.96, y: 10 }
                    }
                    animate={
                      stageInView || prefersReduced
                        ? { opacity: 1, scale: 1, y: 0 }
                        : { opacity: 0, scale: 0.96, y: 10 }
                    }
                    transition={{
                      delay: prefersReduced ? 0 : tileRevealDelay,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="cream-card flex h-full flex-col justify-between rounded-2xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(246,185,109,0.34)] sm:p-7"
                  >
                    <div>
                      <ProjectPreviewBanner id={build.id} />

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-[#1E1712] px-2.5 py-1 font-mono text-[11px] font-medium text-[#FBF5E8]">
                          {build.category}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#9A4E0B]">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {build.metric}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-[#1E1712]">
                        {build.name}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#4F4035] sm:text-[15px]">
                        {build.outcome}
                      </p>
                    </div>

                    <div className="mt-6 space-y-4 border-t border-[#E6D8BE] pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {build.stack.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[#DECBAE] bg-[#F4E7CF] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#3A2D23]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {build.isPrivate ? (
                          <>
                            <Link
                              href={`/register?project=${encodeURIComponent(build.id)}`}
                              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E88B2E] px-4 py-2 text-xs font-semibold text-[#1B120A] transition hover:bg-[#D4761B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              Request Private Demo
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#D4BFA0] bg-[#F3E6CE] px-3 py-1.5 font-mono text-[11px] font-medium text-[#6B5038]">
                              Enterprise Private Repo
                            </span>
                          </>
                        ) : (
                          <>
                            <a
                              href={build.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#1E1712] px-4 py-2 text-xs font-semibold text-[#FBF5E8] transition hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                            >
                              <Github className="h-3.5 w-3.5" />
                              View Repository
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>

                            {build.demoUrl && (
                              <a
                                href={build.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#D4BFA0] bg-[#F3E6CE] px-4 py-2 text-xs font-semibold text-[#1E1712] transition hover:border-[#E88B2E] hover:bg-[#FDE5BE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                              >
                                Live Demo
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>

        {/* Constant 70px/s Tech Stack & Ecosystem Marquee */}
        <div className="mt-20">
          <p className="mb-5 text-center font-mono text-xs uppercase tracking-[0.24em] text-[#C8CCE8]/85">
            Production Stack &amp; Ecosystem
          </p>
          <div
            className="marquee-wrapper marquee-mask relative overflow-hidden py-2"
            aria-label="Technologies used by JXLab"
          >
            <div
              ref={marqueeTrackRef}
              className="marquee-track gap-3.5"
              style={{ animationDuration: `${marqueeDurationSec}s` }}
            >
              {[0, 1].map((dupIdx) => (
                <div
                  key={dupIdx}
                  aria-hidden={dupIdx === 1}
                  className="flex shrink-0 items-center gap-3.5 pr-3.5"
                >
                  {techStackMarquee.map((tech) => (
                    <span
                      key={`${dupIdx}-${tech}`}
                      className="cream-pill inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 font-mono text-xs font-semibold tracking-wide text-[#1E1712] sm:text-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E88B2E]" />
                      {tech}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
