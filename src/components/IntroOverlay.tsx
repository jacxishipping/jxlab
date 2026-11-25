"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { jxlabConfig } from "@/data/jxlabConfig";
import { JxEmblem } from "./JxEmblem";

const INTRO_STARS = Array.from({ length: 18 }, (_, i) => ({
  x: ((i * 47.3 + 9) % 92) + 4,
  y: ((i * 31.1 + 5) % 78) + 6,
  size: 1 + (i % 3) * 0.6,
  delay: (i % 6) * 0.12,
}));

export function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setVisible(false), 1600);
    const dismiss = () => setVisible(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", dismiss, { passive: true, once: true });
    window.addEventListener("wheel", dismiss, { passive: true, once: true });
    window.addEventListener("touchstart", dismiss, { passive: true, once: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeOut" } }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden px-6 text-center"
          style={{
            background:
              "linear-gradient(180deg, #2a1840 0%, #4a2a4e 38%, #c4785a 72%, #1d1318 100%)",
          }}
          role="status"
          aria-live="polite"
        >
          {/* Soft dusk haze */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 45% at 50% 28%, rgba(255,220,180,0.22) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(100,70,140,0.35) 0%, transparent 70%)",
            }}
          />

          {/* Tiny intro stars */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {INTRO_STARS.map((star, idx) => (
              <span
                key={idx}
                className="absolute rounded-full bg-[#FBF5E8]"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: 0.55,
                  animation: `starTwinkle 2.4s ease-in-out ${star.delay}s infinite alternate`,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <JxEmblem className="h-14 w-14 drop-shadow-[0_8px_24px_rgba(20,10,30,0.45)]" />
            <p className="font-mono text-xs tracking-[0.28em] text-[#F6B96D] sm:text-sm">
              {jxlabConfig.brand.introLabel}
            </p>
            <p className="max-w-xs font-display text-lg font-semibold tracking-tight text-[#FBF5E8]/90 sm:text-xl">
              {jxlabConfig.brand.name}
            </p>
            <div className="h-1 w-44 overflow-hidden rounded-full bg-[#FBF5E8]/15">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.35, ease: "easeInOut" }}
                className="h-full w-full rounded-full bg-gradient-to-r from-[#E88B2E] to-[#F6B96D]"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
              }}
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#FBF5E8]/25 bg-[#FBF5E8]/10 px-4 py-2 font-mono text-xs text-[#FBF5E8] transition hover:bg-[#FBF5E8]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E]"
            >
              Skip intro ↗
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
