"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { jxlabConfig } from "@/data/jxlabConfig";
import { JxEmblem } from "./JxEmblem";

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

    const timer = window.setTimeout(() => setVisible(false), 1100);
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
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-gradient-to-b from-[#231533] via-[#3A213F] to-[#1D1318] px-6 text-center"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-4"
          >
            <JxEmblem className="h-12 w-12" />
            <p className="font-mono text-xs tracking-[0.28em] text-[#F6B96D] sm:text-sm">
              {jxlabConfig.brand.introLabel}
            </p>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-[#FBF5E8]/15">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.95, ease: "easeInOut" }}
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
