"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, TrainTrack } from "lucide-react";
import { jxlabConfig, type SolutionItem } from "@/data/jxlabConfig";
import { SolutionModal, type ModalOrigin } from "./SolutionModal";

const AUTUMN_LEAVES = [
  { top: "18%", delay: "0s", duration: "10.5s", color: "#E88B2E" },
  { top: "52%", delay: "3.2s", duration: "12.5s", color: "#D65A38" },
  { top: "74%", delay: "6.4s", duration: "9.8s", color: "#F6B96D" },
  { top: "36%", delay: "8.1s", duration: "13.2s", color: "#C84E32" },
];

export function DepotSolutions() {
  const { solutionsSection } = jxlabConfig;
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin | null>(null);

  // Scroll-linked Sunset Depot Train & Crossing Gate choreography
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Train rolls smoothly across track; wheels rotate proportionally to travel distance
  const trainX = useTransform(scrollYProgress, [0.08, 0.86], ["-45%", "105%"]);
  const wheelAngle = useTransform(scrollYProgress, [0.08, 0.86], [0, 1080]);
  // Crossing gates rotate down (±86 deg) as train nears and rise after passing
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
  // Dusk window illumination ramps up as user scrolls deeper through Act 3
  const windowGlowOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0.25, 0.95]);
  // Steam puffs rise and expand dynamically with scroll
  const steamRise1 = useTransform(scrollYProgress, [0.08, 0.86], [0, -28]);
  const steamRise2 = useTransform(scrollYProgress, [0.08, 0.86], [-8, -42]);

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
      {/* Skittering Autumn Leaves across the Sunset Depot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {AUTUMN_LEAVES.map((leaf, idx) => (
          <svg
            key={idx}
            viewBox="0 0 18 12"
            fill="none"
            className="animate-leaf-skitter absolute -left-8 h-3 w-4.5 opacity-80"
            style={{
              top: leaf.top,
              animationDelay: leaf.delay,
              animationDuration: leaf.duration,
            }}
          >
            <path
              d="M1 8C5 1 12 0 17 4C13 9 6 11 1 8Z"
              fill={leaf.color}
            />
          </svg>
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
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FBF5E8]/25 bg-[#2A1734]/50 px-3.5 py-1 font-mono text-xs font-semibold tracking-widest text-[#F6B96D] backdrop-blur-sm">
            <TrainTrack className="h-3.5 w-3.5" />
            {solutionsSection.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#FBF5E8] drop-shadow-[0_6px_18px_rgba(20,8,24,0.38)] sm:text-5xl">
            {solutionsSection.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#FBF5E8]/90 sm:text-lg">
            {solutionsSection.description}
          </p>
        </motion.div>

        {/* Scroll-Driven Sunset Rail Crossing & JXLab Express Locomotive */}
        <div
          aria-hidden="true"
          className="relative mt-12 overflow-hidden rounded-2xl border border-[#FBF5E8]/18 bg-[#221226]/55 px-4 pb-5 pt-10 shadow-[0_20px_50px_rgba(12,6,18,0.45)] backdrop-blur-sm sm:px-8"
        >
          {/* Breathing Warm Streetlamp Halos */}
          <div className="pointer-events-none absolute left-8 top-4 flex flex-col items-center">
            <div className="animate-lamp-breathe h-10 w-10 rounded-full bg-[#F6B96D]/45 blur-md" />
            <div className="-mt-7 h-2.5 w-2.5 rounded-full bg-[#FFF0CE] shadow-[0_0_16px_#F6B96D]" />
            <div className="h-16 w-0.5 bg-[#3D2632]" />
          </div>
          <div className="pointer-events-none absolute right-8 top-4 flex flex-col items-center">
            <div
              className="animate-lamp-breathe h-10 w-10 rounded-full bg-[#F6B96D]/45 blur-md"
              style={{ animationDelay: "2.4s" }}
            />
            <div className="-mt-7 h-2.5 w-2.5 rounded-full bg-[#FFF0CE] shadow-[0_0_16px_#F6B96D]" />
            <div className="h-16 w-0.5 bg-[#3D2632]" />
          </div>

          {/* Silhouette Depot Rooflines with Dusk-Illuminated Windows */}
          <div className="pointer-events-none absolute inset-x-0 bottom-7 flex items-end justify-between px-10 opacity-75">
            <div className="flex items-end gap-2">
              <div className="h-14 w-16 rounded-t-sm bg-[#1A0E1E] p-2">
                <motion.div
                  style={{ opacity: windowGlowOpacity }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  <span className="h-2.5 rounded-[1px] bg-[#F6B96D] shadow-[0_0_8px_#E88B2E]" />
                  <span className="h-2.5 rounded-[1px] bg-[#F6B96D] shadow-[0_0_8px_#E88B2E]" />
                  <span className="h-2.5 rounded-[1px] bg-[#E88B2E]/75" />
                  <span className="h-2.5 rounded-[1px] bg-[#F6B96D]" />
                </motion.div>
              </div>
              <div className="hidden h-10 w-12 rounded-t-sm bg-[#211126] p-1.5 sm:block">
                <motion.div
                  style={{ opacity: windowGlowOpacity }}
                  className="grid grid-cols-2 gap-1"
                >
                  <span className="h-2 rounded-[1px] bg-[#F6B96D]" />
                  <span className="h-2 rounded-[1px] bg-[#F6B96D]/80" />
                </motion.div>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <div className="hidden h-11 w-14 rounded-t-sm bg-[#211126] p-1.5 sm:block">
                <motion.div
                  style={{ opacity: windowGlowOpacity }}
                  className="grid grid-cols-3 gap-1"
                >
                  <span className="h-2 rounded-[1px] bg-[#F6B96D]" />
                  <span className="h-2 rounded-[1px] bg-[#E88B2E]/70" />
                  <span className="h-2 rounded-[1px] bg-[#F6B96D]" />
                </motion.div>
              </div>
              <div className="h-16 w-20 rounded-t-sm bg-[#1A0E1E] p-2">
                <motion.div
                  style={{ opacity: windowGlowOpacity }}
                  className="grid grid-cols-3 gap-1.5"
                >
                  <span className="h-2.5 rounded-[1px] bg-[#F6B96D] shadow-[0_0_8px_#E88B2E]" />
                  <span className="h-2.5 rounded-[1px] bg-[#F6B96D]" />
                  <span className="h-2.5 rounded-[1px] bg-[#E88B2E]/80" />
                  <span className="h-2.5 rounded-[1px] bg-[#E88B2E]/70" />
                  <span className="h-2.5 rounded-[1px] bg-[#F6B96D]" />
                  <span className="h-2.5 rounded-[1px] bg-[#F6B96D]" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Animated Crossing Gates */}
          <div className="pointer-events-none relative z-20 flex h-20 items-end justify-between">
            <div className="relative ml-2 sm:ml-6">
              <div className="h-12 w-1.5 rounded-t bg-[#563D49]" />
              <motion.div
                style={{ rotate: leftGateRotate, transformOrigin: "3px 3px" }}
                className="absolute left-0 top-2 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#E0533C] via-[#FBF5E8] to-[#E0533C] sm:w-28"
              />
            </div>

            <div className="relative mr-2 sm:mr-6">
              <div className="h-12 w-1.5 rounded-t bg-[#563D49]" />
              <motion.div
                style={{ rotate: rightGateRotate, transformOrigin: "calc(100% - 3px) 3px" }}
                className="absolute right-0 top-2 h-1.5 w-20 rounded-full bg-gradient-to-l from-[#E0533C] via-[#FBF5E8] to-[#E0533C] sm:w-28"
              />
            </div>
          </div>

          {/* Scroll-Scrubbed Rolling Locomotive & Studio Cars */}
          <motion.div
            style={{ x: trainX }}
            className="pointer-events-none relative z-10 -mt-14 flex items-end gap-1.5 will-change-transform"
          >
            {/* 3 Connected Studio Cars */}
            {["AGENTS", "SAAS", "EVALS"].map((label) => (
              <div
                key={label}
                className="relative flex h-11 w-24 shrink-0 flex-col justify-between rounded-t-md border border-[#F6B96D]/35 bg-[#2D1A2B] px-2 py-1.5 shadow-md sm:w-28"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="h-2.5 w-4 rounded-[2px] bg-[#F6B96D]/85 shadow-[0_0_8px_rgba(246,185,109,0.7)]" />
                  <span className="font-mono text-[8px] font-bold tracking-wider text-[#FBF5E8]/80">
                    {label}
                  </span>
                  <span className="h-2.5 w-4 rounded-[2px] bg-[#F6B96D]/85 shadow-[0_0_8px_rgba(246,185,109,0.7)]" />
                </div>
                <div className="h-1 w-full rounded-full bg-[#E88B2E]/65" />
                {/* Rotating Car Wheels */}
                <div className="absolute -bottom-2 inset-x-3 flex justify-between">
                  {[0, 1].map((w) => (
                    <motion.span
                      key={w}
                      style={{ rotate: wheelAngle }}
                      className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#C59560] bg-[#140B14]"
                    >
                      <span className="h-2.5 w-0.5 bg-[#F6B96D]" />
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}

            {/* Lead Locomotive Engine with Rising Steam Puffs */}
            <div className="relative h-14 w-32 shrink-0 rounded-t-lg border border-[#F6B96D]/50 bg-[#1B101D] px-2.5 py-2 shadow-lg">
              {/* Smokestack & Dynamic Steam Puffs */}
              <div className="absolute -top-3 right-5 h-3.5 w-2.5 rounded-t-sm bg-[#3A2535]">
                <motion.span
                  style={{ y: steamRise1 }}
                  className="absolute -top-4 -left-2 h-4 w-4 rounded-full bg-[#FBF5E8]/45 blur-[2px]"
                />
                <motion.span
                  style={{ y: steamRise2 }}
                  className="absolute -top-7 -left-5 h-5 w-6 rounded-full bg-[#FBF5E8]/30 blur-[3px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="h-4 w-6 rounded-[2px] bg-[#F6B96D] shadow-[0_0_12px_#F6B96D]" />
                <span className="font-mono text-[9px] font-bold text-[#F6B96D]">
                  JX-01
                </span>
              </div>
              {/* Headlamp Beam */}
              <div className="absolute -right-12 top-3 h-6 w-12 bg-gradient-to-r from-[#FFF0C2]/55 to-transparent [clip-path:polygon(0_35%,100%_0,100%_100%,0_65%)]" />
              {/* Rotating Drive Wheels */}
              <div className="absolute -bottom-2.5 inset-x-3 flex justify-between">
                {[0, 1, 2].map((w) => (
                  <motion.span
                    key={w}
                    style={{ rotate: wheelAngle }}
                    className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#E88B2E] bg-[#140B14]"
                  >
                    <span className="h-3 w-0.5 bg-[#FBF5E8]" />
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Steel Rail Line & Sleepers */}
          <div className="relative z-20 mt-2 h-1.5 w-full rounded-full bg-gradient-to-r from-[#5B3D4C] via-[#C59560] to-[#5B3D4C]" />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#FBF5E8]/60">
            <span>JXLab Sunset Depot</span>
            <span>Scroll to dispatch · Click any track to inspect</span>
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
                          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#1E1712] px-4 py-2 text-xs font-semibold text-[#FBF5E8] transition hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                        >
                          Explore solution
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
