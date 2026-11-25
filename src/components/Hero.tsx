"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const canopyY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  const handleAboutScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-transparent pt-28 sm:pt-36"
    >
      {/* Main Hero Content (transparent over live fixed SkyBackdrop) */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-20 pt-8 text-center sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-[#FBF5E8]/30 bg-[#2C1A36]/45 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FBF5E8] shadow-sm backdrop-blur-sm sm:text-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#F6B96D]" />
          {jxlabConfig.hero.eyebrow}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          className="mt-5 font-display text-[clamp(4.4rem,16vw,10.5rem)] font-bold leading-[0.88] tracking-[-0.045em] text-[#FBF5E8] drop-shadow-[0_14px_34px_rgba(44,21,36,0.45)]"
        >
          {jxlabConfig.hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
          className="mt-5 max-w-2xl text-base font-medium text-[#2A1812] sm:text-xl"
        >
          <span className="inline-block rounded-2xl bg-[#FBF5E8]/80 px-4 py-1.5 shadow-sm backdrop-blur-xs sm:rounded-full">
            {jxlabConfig.hero.subline}
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
          className="mt-9 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row"
        >
          <Link
            href={jxlabConfig.hero.primaryCta.href}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#E88B2E] px-7 py-3 text-base font-semibold text-[#1B120A] shadow-[0_12px_30px_rgba(61,27,10,0.34)] transition hover:-translate-y-0.5 hover:bg-[#F29A42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712] sm:w-auto"
          >
            {jxlabConfig.hero.primaryCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href={jxlabConfig.hero.secondaryCta.href}
            onClick={handleAboutScroll}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-[#1E1712]/40 bg-[#FBF5E8]/45 px-7 py-3 text-base font-semibold text-[#1E1712] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[#FBF5E8]/78 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1712] sm:w-auto"
          >
            {jxlabConfig.hero.secondaryCta.label}
            <ChevronDown className="h-4 w-4" />
          </a>
        </motion.div>
      </motion.div>

      {/* Act 1 -> Act 2 Dark Leafy Canopy Silhouette Transition */}
      <motion.div
        style={{ y: canopyY }}
        aria-hidden="true"
        className="relative z-10 -mb-2 w-full leading-none"
      >
        <svg
          viewBox="0 0 1440 210"
          fill="none"
          preserveAspectRatio="none"
          className="block h-28 w-full sm:h-40 md:h-48"
        >
          <path
            d="M0 132C78 96 142 98 206 122C264 78 352 72 424 108C494 64 584 68 656 106C730 70 818 76 892 114C960 68 1062 64 1138 104C1212 72 1304 78 1372 110C1404 98 1425 96 1440 100V210H0V132Z"
            fill="#1D3633"
            fillOpacity="0.7"
          />
          <path
            d="M0 154C64 118 134 116 196 142C248 102 326 104 388 138C458 96 544 104 610 140C684 104 764 106 836 142C912 96 1002 102 1072 140C1146 102 1236 104 1304 142C1362 116 1408 118 1440 132V210H0V154Z"
            fill="#122829"
          />
          <path
            d="M0 176C92 148 178 156 262 178C344 144 438 146 522 174C610 146 704 150 790 176C876 142 978 144 1064 176C1152 146 1248 148 1334 176C1382 162 1416 160 1440 166V210H0V176Z"
            fill="#0B1E21"
          />
        </svg>
      </motion.div>
    </section>
  );
}
