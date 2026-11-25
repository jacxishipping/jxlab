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
          className="inline-flex items-center gap-2 rounded-full border border-[#FBF5E8]/35 bg-[#14101C]/55 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FBF5E8] shadow-[0_8px_24px_rgba(12,8,20,0.35)] backdrop-blur-md sm:text-sm"
        >
          <Terminal className="h-3.5 w-3.5 text-[#F6B96D]" />
          {jxlabConfig.hero.eyebrow}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          className="mt-5 font-display text-[clamp(4.4rem,16vw,10.5rem)] font-bold leading-[0.88] tracking-[-0.045em] text-[#FBF5E8] drop-shadow-[0_16px_40px_rgba(12,8,24,0.55)]"
        >
          {jxlabConfig.hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
          className="mt-5 max-w-2xl text-base font-medium text-[#1E1712] sm:text-xl"
        >
          <span className="inline-block rounded-2xl border border-[#E2D2B7]/55 bg-[#FBF5E8]/92 px-4 py-1.5 shadow-[0_10px_28px_rgba(20,12,8,0.22)] backdrop-blur-sm sm:rounded-full">
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
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-[#FBF5E8]/45 bg-[#14101C]/40 px-7 py-3 text-base font-semibold text-[#FBF5E8] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#14101C]/62 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBF5E8] sm:w-auto"
          >
            {jxlabConfig.hero.secondaryCta.label}
            <ChevronDown className="h-4 w-4" />
          </a>
        </motion.div>
      </motion.div>

      {/* Dev-studio architecture horizon — IDE panes, rack bays, data bus */}
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
          {/* Far studio massing */}
          <path
            d="M0 154H96V118H168V138H248V102H320V128H400V96H488V130H580V108H668V88H760V122H852V100H944V134H1036V110H1128V126H1220V104H1312V130H1440V210H0V154Z"
            fill="#15262E"
            fillOpacity="0.72"
          />

          {/* Mid IDE / rack blocks */}
          <rect x="120" y="118" width="72" height="52" rx="3" fill="#0E1C22" />
          <rect x="128" y="126" width="56" height="6" rx="1.5" fill="#1A3238" />
          <rect x="128" y="136" width="40" height="3" rx="1" fill="#70D6CE" fillOpacity="0.35" />
          <rect x="128" y="143" width="48" height="3" rx="1" fill="#F6B96D" fillOpacity="0.4" />
          <rect x="128" y="150" width="32" height="3" rx="1" fill="#70D6CE" fillOpacity="0.28" />

          <rect x="340" y="108" width="88" height="62" rx="3" fill="#0C181D" />
          <rect x="348" y="116" width="28" height="4" rx="1" fill="#E88B2E" fillOpacity="0.7" />
          <rect x="380" y="116" width="40" height="4" rx="1" fill="#2A3F46" />
          <rect x="348" y="126" width="72" height="36" rx="2" fill="#122428" />
          <rect x="356" y="134" width="36" height="2.5" rx="1" fill="#7CE5DB" fillOpacity="0.45" />
          <rect x="356" y="141" width="52" height="2.5" rx="1" fill="#F6B96D" fillOpacity="0.35" />
          <rect x="356" y="148" width="24" height="2.5" rx="1" fill="#7CE5DB" fillOpacity="0.3" />

          <rect x="620" y="98" width="100" height="72" rx="3" fill="#0B171C" />
          <rect x="628" y="106" width="18" height="4" rx="1" fill="#5BBF99" fillOpacity="0.8" />
          <rect x="650" y="106" width="60" height="4" rx="1" fill="#243840" />
          <rect x="628" y="116" width="84" height="44" rx="2" fill="#101F24" />
          <g fill="#F6B96D" fillOpacity="0.65">
            <rect x="636" y="124" width="14" height="3" rx="1" />
            <rect x="654" y="124" width="22" height="3" rx="1" />
            <rect x="636" y="132" width="28" height="3" rx="1" />
            <rect x="636" y="140" width="18" height="3" rx="1" />
            <rect x="658" y="140" width="12" height="3" rx="1" />
          </g>

          <rect x="920" y="112" width="80" height="58" rx="3" fill="#0E1C22" />
          <rect x="928" y="120" width="64" height="8" rx="1.5" fill="#1A2E34" />
          <rect x="928" y="134" width="20" height="3" rx="1" fill="#70D6CE" fillOpacity="0.4" />
          <rect x="952" y="134" width="28" height="3" rx="1" fill="#F6B96D" fillOpacity="0.4" />
          <rect x="928" y="142" width="40" height="3" rx="1" fill="#70D6CE" fillOpacity="0.28" />
          <rect x="928" y="150" width="16" height="3" rx="1" fill="#E88B2E" fillOpacity="0.55" />

          <rect x="1180" y="120" width="96" height="50" rx="3" fill="#0C181D" />
          <rect x="1188" y="128" width="12" height="12" rx="2" fill="#15262C" />
          <rect x="1204" y="128" width="12" height="12" rx="2" fill="#15262C" />
          <rect x="1220" y="128" width="12" height="12" rx="2" fill="#15262C" />
          <circle cx="1194" cy="134" r="2" fill="#5BBF99" />
          <circle cx="1210" cy="134" r="2" fill="#F6B96D" />
          <circle cx="1226" cy="134" r="2" fill="#7CE5DB" />
          <rect x="1188" y="146" width="80" height="3" rx="1" fill="#70D6CE" fillOpacity="0.3" />
          <rect x="1188" y="154" width="56" height="3" rx="1" fill="#F6B96D" fillOpacity="0.28" />

          {/* Status LED row on far massing */}
          <g fill="#F6B96D" fillOpacity="0.75">
            <rect x="200" y="112" width="10" height="3" rx="1" />
            <rect x="214" y="112" width="14" height="3" rx="1" />
            <rect x="500" y="104" width="12" height="3" rx="1" />
            <rect x="780" y="96" width="16" height="3" rx="1" />
            <rect x="1060" y="108" width="14" height="3" rx="1" />
          </g>

          {/* Data-bus ridge */}
          <path
            d="M0 168H160L184 152H360L384 168H560L584 148H780L804 164H1000L1024 150H1200L1224 168H1440V210H0V168Z"
            fill="#0A1519"
          />
          <path
            d="M0 170H162L186 154H358L382 170H562L586 150H778L802 166H1002L1026 152H1198L1222 170H1440"
            stroke="#70D6CE"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
          <g fill="#7CE5DB">
            <circle cx="186" cy="154" r="3" />
            <circle cx="358" cy="154" r="3" />
            <circle cx="586" cy="150" r="3" />
            <circle cx="778" cy="150" r="3" />
            <circle cx="1026" cy="152" r="3" />
            <circle cx="1198" cy="152" r="3" />
          </g>

          {/* Foreground terminal base into About */}
          <path
            d="M0 186H240L260 176H520L540 186H920L940 174H1200L1220 186H1440V210H0V186Z"
            fill="#0B1E21"
          />
        </svg>
      </motion.div>
    </section>
  );
}
