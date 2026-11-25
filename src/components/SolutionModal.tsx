"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  X,
} from "lucide-react";
import type { SolutionItem } from "@/data/jxlabConfig";

export interface ModalOrigin {
  x: number;
  y: number;
}

interface SolutionModalProps {
  solution: SolutionItem | null;
  origin: ModalOrigin | null;
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function SolutionModal({
  solution,
  origin,
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  onClose,
}: SolutionModalProps) {
  useEffect(() => {
    if (!solution) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [solution, onClose, onPrev, onNext]);

  const offsetX =
    origin && typeof window !== "undefined"
      ? origin.x - window.innerWidth / 2
      : 0;
  const offsetY =
    origin && typeof window !== "undefined"
      ? origin.y - window.innerHeight / 2
      : 28;

  return (
    <AnimatePresence>
      {solution && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-[#0F0914]/76 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="solution-modal-title"
        >
          {/* Springs directly from clicked card button center with back.out(1.4) curve */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.55,
              x: offsetX,
              y: offsetY,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.78,
              x: offsetX * 0.35,
              y: offsetY * 0.35,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.4, 0.64, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="cream-card relative max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 sm:p-8"
          >
            {/* Top Controls: Prev / Counter / Next + Close */}
            <div className="flex items-center justify-between gap-2 pb-4">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous solution track"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C5A5] bg-[#F4E9D4] text-[#1E1712] transition hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 font-mono text-xs font-semibold text-[#7A5638]">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(totalCount).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next solution track"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C5A5] bg-[#F4E9D4] text-[#1E1712] transition hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close solution details"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D8C5A5] bg-[#F4E9D4] text-[#1E1712] transition hover:bg-[#E88B2E] hover:text-[#1B120A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category Badge & Title */}
            <div>
              <span className="inline-flex items-center rounded-full bg-[#E88B2E]/20 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-[#9A4E0B]">
                {solution.category}
              </span>

              <h3
                id="solution-modal-title"
                className="mt-3 font-display text-2xl font-bold tracking-tight text-[#1E1712] sm:text-3xl"
              >
                {solution.title}
              </h3>

              <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-[#7A5638]">
                <Layers className="h-4 w-4 text-[#C66C19]" />
                <span>Architecture — {solution.architectureSubtitle}</span>
              </div>
            </div>

            {/* Summary */}
            <p className="mt-5 text-sm leading-relaxed text-[#3E3128] sm:text-base">
              {solution.summary}
            </p>

            {/* Deliverables */}
            <div className="mt-6">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7A5638]">
                Key Deliverables
              </h4>
              <ul className="mt-3 space-y-2.5">
                {solution.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#2A201A]"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C66C19]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="mt-6">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7A5638]">
                Reference Tech Stack
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {solution.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#DAC7A9] bg-[#F3E6CE] px-3 py-1 font-mono text-xs font-medium text-[#2A201A]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Typical Timeline Footer + Pre-filled Scoping Link */}
            <div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-[#E2D2B7] pt-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1E1712] text-[#F6B96D]">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#7A5638]">
                    Typical Timeline
                  </p>
                  <p className="font-display text-base font-bold text-[#1E1712]">
                    {solution.timeline}
                  </p>
                </div>
              </div>

              <Link
                href={`/register?track=${encodeURIComponent(solution.slug)}`}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#E88B2E] px-5 py-2.5 text-sm font-semibold text-[#1B120A] transition hover:bg-[#D4761B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712] sm:w-auto"
              >
                Scope this build
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
