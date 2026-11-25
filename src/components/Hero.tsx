"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Terminal } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const skylineY = useTransform(scrollYProgress, [0, 1], [0, -24]);

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
          <Terminal className="h-3.5 w-3.5 text-[#F6B96D]" />
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

      {/* Act 1 -> Act 2 Server Rack, Dev Studio Skyline & Circuit Horizon Silhouette */}
      <motion.div
        style={{ y: skylineY }}
        aria-hidden="true"
        className="relative z-10 -mb-2 w-full leading-none"
      >
        <svg
          viewBox="0 0 1440 210"
          fill="none"
          preserveAspectRatio="none"
          className="block h-28 w-full sm:h-40 md:h-48"
        >
          {/* Back misty data-center & studio skyline */}
          <path
            d="M0 145H68V108H126V132H184V86H252V124H310V76H376V118H446V94H516V136H590V80H668V114H742V68H814V122H888V92H964V134H1038V78H1116V116H1192V88H1268V128H1340V98H1402V130H1440V210H0V145Z"
            fill="#1A3234"
            fillOpacity="0.65"
          />
          {/* Glowing code-editor / server rack LED accents on skyline */}
          <g fill="#F6B96D" fillOpacity="0.7">
            <rect x="198" y="100" width="16" height="4" rx="2" />
            <rect x="220" y="100" width="18" height="4" rx="2" />
            <rect x="326" y="92" width="22" height="4" rx="2" />
            <rect x="326" y="102" width="14" height="4" rx="2" />
            <rect x="606" y="96" width="24" height="4" rx="2" />
            <rect x="758" y="84" width="20" height="4" rx="2" />
            <rect x="784" y="84" width="14" height="4" rx="2" />
            <rect x="1054" y="94" width="24" height="4" rx="2" />
            <rect x="1208" y="104" width="18" height="4" rx="2" />
          </g>
          {/* Mid-layer stepped circuit bus ridge */}
          <path
            d="M0 162H140L164 138H340L366 162H540L566 134H786L812 158H1020L1046 136H1260L1286 162H1440V210H0V162Z"
            fill="#102529"
          />
          {/* Glowing cyan/amber PCB circuit trace along ridge */}
          <path
            d="M0 164H142L166 140H338L364 164H542L568 136H784L810 160H1022L1048 138H1258L1284 164H1440"
            stroke="#70D6CE"
            strokeOpacity="0.4"
            strokeWidth="2"
          />
          <g fill="#7CE5DB">
            <circle cx="166" cy="140" r="3.5" />
            <circle cx="338" cy="140" r="3.5" />
            <circle cx="568" cy="136" r="3.5" />
            <circle cx="784" cy="136" r="3.5" />
            <circle cx="1048" cy="138" r="3.5" />
            <circle cx="1258" cy="138" r="3.5" />
          </g>
          {/* Foreground deep terminal base entering Act 2 */}
          <path
            d="M0 182H220L242 168H480L502 182H910L934 166H1180L1204 182H1440V210H0V182Z"
            fill="#0B1E21"
          />
        </svg>
      </motion.div>
    </section>
  );
}
