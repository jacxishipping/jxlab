"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Cpu } from "lucide-react";
import { jxlabConfig, type SolutionItem } from "@/data/jxlabConfig";
import { SolutionModal, type ModalOrigin } from "./SolutionModal";

// Sparse data-packet dots (studio, not leaf confetti)
const DATA_PACKETS = [
  { top: "18%", delay: "0s", duration: "14s", color: "#7CE5DB" },
  { top: "42%", delay: "4s", duration: "16s", color: "#F6B96D" },
  { top: "68%", delay: "7.5s", duration: "15s", color: "#70D6CE" },
];

export function DepotSolutions() {
  const { solutionsSection } = jxlabConfig;
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin | null>(null);

  // Scroll-linked Multi-Agent Pipeline Convoy & Policy Gate choreography
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Agent pipeline convoy glides smoothly across the fiber bus; gear wheels rotate physically
  const convoyX = useTransform(scrollYProgress, [0.08, 0.86], ["-45%", "105%"]);
  const gearAngle = useTransform(scrollYProgress, [0.08, 0.86], [0, 1080]);
  // Policy & Eval gates swing down as convoy passes and rise after dispatch
  const leftGateRotate = useTransform(
    scrollYProgress,
    [0.05, 0.18, 0.76, 0.9],
    [-82, -2, -2, -82]
  );
  const rightGateRotate = useTransform(
    scrollYProgress,
    [0.05, 0.18, 0.76, 0.9],
    [82, 2, 2, 82]
  );
  // Server rack & IDE code windows illuminate progressively on scroll
  const clusterGlowOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0.25, 0.95]);
  // Rising glowing token packets from orchestrator emitter
  const packetRise1 = useTransform(scrollYProgress, [0.08, 0.86], [0, -28]);
  const packetRise2 = useTransform(scrollYProgress, [0.08, 0.86], [-8, -42]);

  const solutionMap = useMemo(() => {
    const map = new Map<string, SolutionItem>();
    for (const item of solutionsSection.items) {
      map.set(item.slug, item);
    }
    return map;
  }, [solutionsSection.items]);

  const syncFromHash = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#solution-")) {
      const slug = hash.replace("#solution-", "");
      if (solutionMap.has(slug)) {
        setSelectedSlug(slug);
        return;
      }
    }
    setSelectedSlug(null);
  }, [solutionMap]);

  useEffect(() => {
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [syncFromHash]);

  const openSolution = (
    slug: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedSlug(slug);
    const nextHash = `#solution-${slug}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  };

  const closeSolution = useCallback(() => {
    setSelectedSlug(null);
    if (window.location.hash.startsWith("#solution-")) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const activeIndex = selectedSlug
    ? solutionsSection.items.findIndex((item) => item.slug === selectedSlug)
    : -1;
  const activeSolution =
    activeIndex >= 0 ? solutionsSection.items[activeIndex] : null;

  const navigateSolution = useCallback(
    (delta: number) => {
      const items = solutionsSection.items;
      if (!items.length || activeIndex < 0) return;
      const nextIdx = (activeIndex + delta + items.length) % items.length;
      const nextSlug = items[nextIdx].slug;
      setSelectedSlug(nextSlug);
      setModalOrigin(null);
      window.history.replaceState(null, "", `#solution-${nextSlug}`);
    },
    [activeIndex, solutionsSection.items]
  );

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-transparent px-4 py-24 sm:px-6 sm:py-32"
    >
      {/* Sparse drifting data packets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {DATA_PACKETS.map((pkt, idx) => (
          <span
            key={idx}
            className="animate-leaf-skitter absolute -left-6 h-1.5 w-1.5 rounded-full opacity-70"
            style={{
              top: pkt.top,
              backgroundColor: pkt.color,
              boxShadow: `0 0 8px ${pkt.color}`,
              animationDelay: pkt.delay,
              animationDuration: pkt.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FBF5E8]/25 bg-[#141820]/55 px-3.5 py-1 font-mono text-xs font-semibold tracking-widest text-[#F6B96D] backdrop-blur-sm">
            <Cpu className="h-3.5 w-3.5" />
            {solutionsSection.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#FBF5E8] drop-shadow-[0_6px_18px_rgba(12,10,20,0.4)] sm:text-5xl">
            {solutionsSection.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#FBF5E8]/90 sm:text-lg">
            {solutionsSection.description}
          </p>
        </motion.div>

        {/* Clean CI / agent pipeline diagram */}
        <div
          aria-hidden="true"
          className="relative mt-12 overflow-hidden rounded-2xl border border-[#70D6CE]/18 bg-[#0E161C]/72 px-4 pb-5 pt-10 shadow-[0_20px_50px_rgba(6,10,16,0.5)] backdrop-blur-sm sm:px-8"
        >
          {/* Status beacons */}
          <div className="pointer-events-none absolute left-8 top-4 flex flex-col items-center">
            <div className="animate-lamp-breathe h-5 w-5 rounded-full bg-[#7CE5DB]/25 blur-sm" />
            <div className="-mt-3.5 h-2 w-2 rounded-full bg-[#7CE5DB] shadow-[0_0_10px_#7CE5DB]" />
            <div className="h-12 w-px bg-[#2A3E48]" />
          </div>
          <div className="pointer-events-none absolute right-8 top-4 flex flex-col items-center">
            <div
              className="animate-lamp-breathe h-5 w-5 rounded-full bg-[#F6B96D]/25 blur-sm"
              style={{ animationDelay: "2.4s" }}
            />
            <div className="-mt-3.5 h-2 w-2 rounded-full bg-[#F6B96D] shadow-[0_0_10px_#F6B96D]" />
            <div className="h-12 w-px bg-[#2A3E48]" />
          </div>

          {/* IDE / rack panes (hero language) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-7 flex items-end justify-between px-8 opacity-85 sm:px-12">
            <div className="flex items-end gap-2">
              <div className="h-14 w-20 rounded-md border border-[#70D6CE]/22 bg-[#0A1418] p-2">
                <motion.div style={{ opacity: clusterGlowOpacity }} className="space-y-1.5">
                  <span className="block h-1.5 w-10 rounded-full bg-[#7CE5DB]" />
                  <span className="block h-1.5 w-14 rounded-full bg-[#F6B96D]" />
                  <span className="block h-1.5 w-8 rounded-full bg-[#E88B2E]/75" />
                </motion.div>
              </div>
              <div className="hidden h-11 w-12 rounded-md border border-[#F6B96D]/2 bg-[#0C161A] p-1.5 sm:block">
                <motion.div style={{ opacity: clusterGlowOpacity }} className="space-y-1">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5BBF99]" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#F6B96D]/7" />
                  </div>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7CE5DB]" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#70D6CE]/6" />
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <div className="hidden h-11 w-14 rounded-md border border-[#70D6CE]/2 bg-[#0C161A] p-1.5 sm:block">
                <motion.div style={{ opacity: clusterGlowOpacity }} className="space-y-1">
                  <span className="block h-1.5 w-9 rounded-full bg-[#7CE5DB]" />
                  <span className="block h-1.5 w-7 rounded-full bg-[#F6B96D]" />
                </motion.div>
              </div>
              <div className="h-14 w-24 rounded-md border border-[#F6B96D]/25 bg-[#0A1418] p-2">
                <motion.div style={{ opacity: clusterGlowOpacity }} className="space-y-1.5">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-2 rounded-full bg-[#5BBF99]" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#F6B96D]/8" />
                  </div>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-2 rounded-full bg-[#7CE5DB]" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#70D6CE]/7" />
                  </div>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-2 rounded-full bg-[#E88B2E]" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#FBF5E8]/5" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Slim policy / eval barriers */}
          <div className="pointer-events-none relative z-20 flex h-16 items-end justify-between">
            <div className="relative ml-2 sm:ml-6">
              <div className="h-10 w-1 rounded-t bg-[#2E4450]" />
              <motion.div
                style={{ rotate: leftGateRotate, transformOrigin: "2px 2px" }}
                className="absolute left-0 top-1.5 h-1 w-16 rounded-sm bg-gradient-to-r from-[#7CE5DB] to-[#E88B2E] sm:w-24"
              />
              <span className="absolute -bottom-4 left-0 font-mono text-[8px] tracking-wider text-[#70D6CE]/7">
                POLICY
              </span>
            </div>
            <div className="relative mr-2 sm:mr-6">
              <div className="h-10 w-1 rounded-t bg-[#2E4450]" />
              <motion.div
                style={{
                  rotate: rightGateRotate,
                  transformOrigin: "calc(100% - 2px) 2px",
                }}
                className="absolute right-0 top-1.5 h-1 w-16 rounded-sm bg-gradient-to-l from-[#7CE5DB] to-[#E88B2E] sm:w-24"
              />
              <span className="absolute -bottom-4 right-0 font-mono text-[8px] tracking-wider text-[#F6B96D]/7">
                EVAL
              </span>
            </div>
          </div>

          {/* Scroll-scrubbed stage pods */}
          <motion.div
            style={{ x: convoyX }}
            className="pointer-events-none relative z-10 -mt-10 flex items-end gap-2 will-change-transform"
          >
            {["PLANNER", "CODER", "VERIFIER"].map((label) => (
              <div
                key={label}
                className="relative flex h-11 w-24 shrink-0 flex-col justify-between rounded-md border border-[#70D6CE]/35 bg-[#0C171D] px-2 py-1.5 sm:w-28"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5BBF99]" />
                  <span className="font-mono text-[8px] font-bold tracking-wider text-[#FBF5E8]/9">
                    {label}
                  </span>
                  <span className="font-mono text-[8px] text-[#70D6CE]">&lt;/&gt;</span>
                </div>
                <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-[#7CE5DB]/65 to-[#E88B2E]/7" />
                <div className="absolute -bottom-1.5 inset-x-4 flex justify-between">
                  {[0, 1].map((w) => (
                    <motion.span
                      key={w}
                      style={{ rotate: gearAngle }}
                      className="h-2.5 w-2.5 rounded-sm border border-[#70D6CE]/6 bg-[#0A1216]"
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="relative h-12 w-36 shrink-0 rounded-md border border-[#E88B2E]/5 bg-[#12100E] px-2.5 py-1.5">
              <div className="absolute -top-2 right-4 flex gap-1">
                <motion.span
                  style={{ y: packetRise1 }}
                  className="h-1.5 w-1.5 rounded-full bg-[#7CE5DB]"
                />
                <motion.span
                  style={{ y: packetRise2 }}
                  className="h-1.5 w-1.5 rounded-full bg-[#F6B96D]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-[#E88B2E]/2 px-1.5 py-0.5 font-mono text-[8px] font-bold text-[#FFCF7A]">
                  ORCH
                </span>
                <span className="font-mono text-[9px] font-bold text-[#7CE5DB]">JX-01</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#E88B2E] to-[#7CE5DB]" />
              </div>
              <div className="absolute -right-10 top-3 h-5 w-10 bg-gradient-to-r from-[#7CE5DB]/35 to-transparent" />
            </div>
          </motion.div>

          <div className="relative z-20 mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#1A2E36] via-[#70D6CE] to-[#E88B2E]" />
          <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#FBF5E8]/6">
            <span>JXLab Agent Pipeline</span>
            <span>Scroll to run · Click any track to inspect</span>
          </div>
        </div>

        {/* Grouped Capability Tracks */}
        <div className="mt-14 space-y-16">
          {solutionsSection.groups.map((group) => {
            const items = solutionsSection.items.filter(
              (item) => item.group === group.id
            );

            return (
              <div key={group.id}>
                <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FDE0B5]">
                      {group.subtitle}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#FBF5E8] sm:text-3xl">
                      {group.title}
                    </h3>
                  </div>
                  <div
                    aria-hidden="true"
                    className="hidden h-px flex-1 bg-gradient-to-r from-[#FBF5E8]/35 via-[#F6B96D]/45 to-transparent sm:mx-6 sm:mb-2 sm:block"
                  />
                  <span className="font-mono text-xs text-[#FBF5E8]/75">
                    {items.length} tracks available
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, index) => (
                    <motion.article
                      key={item.slug}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.55,
                        delay: (index % 3) * 0.07,
                        ease: "easeOut",
                      }}
                      className="cream-card group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_42px_-12px_rgba(232,139,46,0.38)]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#E88B2E]/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#9A4E0B]">
                            #{item.slug}
                          </span>
                          <span className="font-mono text-[11px] text-[#7A5638]">
                            {item.timeline}
                          </span>
                        </div>

                        <h4 className="mt-3.5 font-display text-xl font-bold tracking-tight text-[#1E1712]">
                          {item.title}
                        </h4>

                        <p className="mt-2.5 text-sm leading-relaxed text-[#504035]">
                          {item.shortDesc}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-[#E6D8BE] pt-4">
                        <span className="font-mono text-xs text-[#7A5638]">
                          {item.techStack.slice(0, 2).join(" · ")}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => openSolution(item.slug, e)}
                          aria-label={`Explore ${item.title}`}
                          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#1E1712] px-4 py-2 text-xs font-semibold text-[#FBF5E8] transition hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                        >
                          See outcomes
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hash-Synced Origin-Sprung Solution Modal */}
      <SolutionModal
        solution={activeSolution}
        origin={modalOrigin}
        currentIndex={Math.max(0, activeIndex)}
        totalCount={solutionsSection.items.length}
        onPrev={() => navigateSolution(-1)}
        onNext={() => navigateSolution(1)}
        onClose={closeSolution}
      />
    </section>
  );
}
