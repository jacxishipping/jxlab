"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { jxlabConfig } from "@/data/jxlabConfig";

interface TypedBlock {
  kind: "command" | "response" | "spec" | "closing";
  promptIdx?: number;
  specIdx?: number;
  start: number;
  end: number;
  text: string;
}

interface CliHistoryEntry {
  cmd: string;
  lines: string[];
}

const QUICK_COMMANDS = ["projects", "stack", "bridgeai", "jxai", "contact", "clear"] as const;

function runCliCommand(raw: string): CliHistoryEntry | "CLEAR" {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "clear" || cmd === "cls") return "CLEAR";

  if (cmd === "help" || cmd === "?") {
    return {
      cmd: raw.trim(),
      lines: [
        "available commands: projects | stack | bridgeai | jxai | jxui | bidnix | contact | clear",
      ],
    };
  }

  if (cmd === "projects" || cmd === "ls") {
    return {
      cmd: raw.trim(),
      lines: [
        "01. AI Bridge   — Universal AI-to-computer control plane (Python / .NET 9 / MCP)",
        "02. JXAI        — Native C++20 local inference engine (AVX2/AVX-512 / Tauri)",
        "03. JXUI React  — React 19 spring & glassmorphism design system workbench",
        "04. Bidnix      — Real-time multi-platform vehicle auction & bid ops suite",
      ],
    };
  }

  if (cmd === "stack") {
    return {
      cmd: raw.trim(),
      lines: [
        `core: ${jxlabConfig.techStackMarquee.slice(0, 8).join(" · ")}`,
        `infra: ${jxlabConfig.techStackMarquee.slice(8).join(" · ")}`,
      ],
    };
  }

  if (cmd === "bridgeai" || cmd === "bridgeai3") {
    return {
      cmd: raw.trim(),
      lines: [
        "AI Bridge v0.3.0 · Policy-enforced MCP & OAuth 2.1 computer control plane.",
        "4-tier risk gating, path confinement, secret redaction & hash-chained audit logs.",
        "repo: github.com/jacxishipping/bridgeai3",
      ],
    };
  }

  if (cmd === "jxai") {
    return {
      cmd: raw.trim(),
      lines: [
        "JXAI (moe_engine) · Native C++20 SIMD transformer (AVX2 / AVX-512).",
        "Loads GGUF & SafeTensors directly, serves OpenAI-compatible SSE + React UI.",
        "repo: github.com/jacxishipping/jxai",
      ],
    };
  }

  if (cmd === "jxui" || cmd === "jxui-react") {
    return {
      cmd: raw.trim(),
      lines: [
        "JXUI React · React 19 component library & interactive workbench.",
        "demo: jxui-react.vercel.app · repo: github.com/jacxishipping/jxui-react",
      ],
    };
  }

  if (cmd === "bidnix") {
    return {
      cmd: raw.trim(),
      lines: [
        "Bidnix · Enterprise live auction & bidding engine (Next.js + NestJS + Socket.IO + Redis).",
        "Private repo — click 'Request Private Demo' in Showcase to schedule a walkthrough.",
      ],
    };
  }

  if (cmd === "contact" || cmd === "start") {
    return {
      cmd: raw.trim(),
      lines: [
        `email: ${jxlabConfig.brand.email} · github: github.com/jacxishipping`,
        "portal: click 'Start a project' or visit /register to scope a sprint.",
      ],
    };
  }

  return {
    cmd: raw.trim(),
    lines: [`command not found: "${raw.trim()}". type "help" for available commands.`],
  };
}

export function TerminalAbout() {
  const { terminal } = jxlabConfig;
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(terminalRef, { once: true, amount: 0.35 });

  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState<CliHistoryEntry[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const foliageY = useTransform(scrollYProgress, [0, 0.5, 1], [36, 0, -90]);
  const foliageOpacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.25, 1, 1, 0.15]);
  const terminalLiftY = useTransform(scrollYProgress, [0.7, 1], [0, -56]);

  const { blocks, totalChars, asciiLines } = useMemo(() => {
    const out: TypedBlock[] = [];
    let cursor = 0;

    terminal.prompts.forEach((p, promptIdx) => {
      out.push({
        kind: "command",
        promptIdx,
        start: cursor,
        end: cursor + p.command.length,
        text: p.command,
      });
      cursor += p.command.length + 6;

      const fullResp = p.responseParts.map((part) => part.text).join("");
      out.push({
        kind: "response",
        promptIdx,
        start: cursor,
        end: cursor + fullResp.length,
        text: fullResp,
      });
      cursor += fullResp.length + 8;
    });

    terminal.specs.forEach((s, specIdx) => {
      const combined = `${s.key} ${s.value}`;
      out.push({
        kind: "spec",
        specIdx,
        start: cursor,
        end: cursor + combined.length,
        text: combined,
      });
      cursor += combined.length + 5;
    });

    out.push({
      kind: "closing",
      start: cursor,
      end: cursor + terminal.closingPrompt.length,
      text: terminal.closingPrompt,
    });
    cursor += terminal.closingPrompt.length;

    const lines = terminal.asciiArt.replace(/^\n/, "").split("\n");
    return { blocks: out, totalChars: cursor, asciiLines: lines };
  }, [terminal]);

  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setTypedChars(totalChars);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();
    const CHARS_PER_SEC = 85;

    const tick = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;
      const next = Math.min(totalChars, Math.floor(elapsedSec * CHARS_PER_SEC));
      setTypedChars(next);
      if (next < totalChars) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isInView, totalChars]);

  const executeCommand = (cmdStr: string) => {
    if (!cmdStr.trim()) return;
    const result = runCliCommand(cmdStr);
    if (result === "CLEAR") {
      setCliHistory([]);
    } else {
      setCliHistory((prev) => [...prev.slice(-3), result]);
    }
    setCliInput("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(cliInput);
  };

  const charProgress = totalChars > 0 ? typedChars / totalChars : 1;
  const visibleAsciiCount = Math.ceil(asciiLines.length * charProgress);
  const visibleAsciiText = asciiLines.slice(0, visibleAsciiCount).join("\n");

  const getSlice = (block: TypedBlock) => {
    if (typedChars <= block.start) return "";
    const count = Math.min(block.text.length, typedChars - block.start);
    return block.text.slice(0, count);
  };

  const renderHighlightedResponse = (promptIdx: number, visibleCount: number) => {
    if (visibleCount <= 0) return null;
    const parts = terminal.prompts[promptIdx].responseParts;
    let remaining = visibleCount;

    return parts.map((part, idx) => {
      if (remaining <= 0) return null;
      const shown = part.text.slice(0, remaining);
      remaining -= shown.length;

      return part.highlight ? (
        <span key={idx} className="crt-phosphor-amber font-semibold text-[#F6B96D]">
          {shown}
        </span>
      ) : (
        <React.Fragment key={idx}>{shown}</React.Fragment>
      );
    });
  };

  const closingBlock = blocks[blocks.length - 1];
  const closingText = getSlice(closingBlock);
  const isTypingFinished = typedChars >= totalChars;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden px-4 pb-28 pt-14 sm:px-6 sm:pb-36 sm:pt-20"
      style={{
        background:
          "linear-gradient(180deg, #0B1E21 0%, rgba(11, 33, 38, 0.96) 62%, rgba(20, 17, 36, 0.45) 90%, rgba(20, 17, 36, 0) 100%)",
      }}
    >
      {/* Overhead leafy canopy framing (HTN atmosphere + agent lab) */}
      <motion.div
        style={{ y: foliageY, opacity: foliageOpacity }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-between"
      >
        <svg viewBox="0 0 320 200" className="h-40 w-56 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:h-56 sm:w-96" fill="none">
          <path
            d="M0 0H280C226 36 172 64 118 102C76 132 36 156 0 184V0Z"
            fill="#0A221F"
          />
          <ellipse cx="165" cy="48" rx="42" ry="16" transform="rotate(-18 165 48)" fill="#1F4F3C" />
          <ellipse cx="118" cy="70" rx="36" ry="14" transform="rotate(-12 118 70)" fill="#2A6350" />
          <ellipse cx="96" cy="96" rx="34" ry="13" transform="rotate(-24 96 96)" fill="#245A48" />
          <ellipse cx="48" cy="140" rx="28" ry="12" transform="rotate(-28 48 140)" fill="#1A4036" />
          <ellipse cx="188" cy="28" rx="22" ry="9" transform="rotate(-8 188 28)" fill="#357A5E" fillOpacity="0.85" />
          <circle cx="118" cy="72" r="2.5" fill="#F6B96D" fillOpacity="0.7" />
          <circle cx="72" cy="118" r="2" fill="#7CE5DB" fillOpacity="0.55" />
        </svg>
        <svg
          viewBox="0 0 320 200"
          className="h-40 w-56 -scale-x-100 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:h-56 sm:w-96"
          fill="none"
        >
          <path
            d="M0 0H280C226 36 172 64 118 102C76 132 36 156 0 184V0Z"
            fill="#0A221F"
          />
          <ellipse cx="165" cy="48" rx="42" ry="16" transform="rotate(-18 165 48)" fill="#1F4F3C" />
          <ellipse cx="118" cy="70" rx="36" ry="14" transform="rotate(-12 118 70)" fill="#2A6350" />
          <ellipse cx="96" cy="96" rx="34" ry="13" transform="rotate(-24 96 96)" fill="#245A48" />
          <ellipse cx="48" cy="140" rx="28" ry="12" transform="rotate(-28 48 140)" fill="#1A4036" />
          <ellipse cx="188" cy="28" rx="22" ry="9" transform="rotate(-8 188 28)" fill="#357A5E" fillOpacity="0.85" />
          <circle cx="118" cy="72" r="2.5" fill="#F6B96D" fillOpacity="0.7" />
          <circle cx="72" cy="118" r="2" fill="#7CE5DB" fillOpacity="0.55" />
        </svg>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          ref={terminalRef}
          style={{ y: terminalLiftY }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          data-testid="crt-tv"
          className="crt-shell relative overflow-hidden rounded-[1.5rem] backdrop-blur-md"
        >
          {/* CRT scanlines, roll bar & curved glass vignette */}
          <div
            aria-hidden="true"
            className="crt-scanlines pointer-events-none absolute inset-0 z-10 opacity-75"
          />
          <div
            aria-hidden="true"
            className="crt-roll-bar pointer-events-none absolute inset-x-0 top-0 z-10 h-28"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-[1.5rem]"
            style={{
              background:
                "radial-gradient(ellipse at 30% 15%, rgba(255,255,255,0.065) 0%, transparent 45%), radial-gradient(ellipse at center, transparent 58%, rgba(2,10,12,0.52) 100%)",
            }}
          />

          {/* Terminal chrome */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-b border-[#70D6CE]/20 bg-[#06181C]/90 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#E06C5A]" />
              <span className="h-3 w-3 rounded-full bg-[#E8A948]" />
              <span className="h-3 w-3 rounded-full bg-[#5BBF99]" />
            </div>
            <div className="font-mono text-[11px] tracking-wider text-[#9BE2DC] sm:text-xs">
              <span className="font-semibold text-[#F6B96D]">{terminal.version}</span>
              <span className="mx-2 text-[#70D6CE]/50">·</span>
              <span>{terminal.subtitle}</span>
            </div>
            <div className="hidden font-mono text-[11px] text-[#70D6CE]/65 sm:block">
              {isTypingFinished ? "tty0 // interactive" : "tty0 // streaming 85c/s"}
            </div>
          </div>

          {/* Two-Column CRT Body */}
          <div className="relative z-20 grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-[1.25fr_0.95fr] lg:items-center lg:gap-10 lg:p-10">
            {/* Left Monospace Typewriter + Interactive CLI Column */}
            <div className="crt-phosphor min-h-[290px] space-y-5 font-mono text-sm leading-relaxed text-[#D9F2EF] sm:min-h-[330px] sm:text-[15px]">
              {terminal.prompts.map((item, promptIdx) => {
                const cmdBlock = blocks.find(
                  (b) => b.kind === "command" && b.promptIdx === promptIdx
                )!;
                const respBlock = blocks.find(
                  (b) => b.kind === "response" && b.promptIdx === promptIdx
                )!;
                const cmdText = getSlice(cmdBlock);
                const respVisibleCount = Math.max(
                  0,
                  Math.min(respBlock.text.length, typedChars - respBlock.start)
                );

                return (
                  <div key={item.command} className="space-y-2">
                    <p className="min-h-[1.5em] font-semibold text-[#7CE5DB]">
                      {cmdText}
                      {typedChars > cmdBlock.start && typedChars <= cmdBlock.end && (
                        <span className="ml-0.5 inline-block h-4 w-2 bg-[#E88B2E] align-middle" />
                      )}
                    </p>
                    <p className="min-h-[3em] pl-3 text-[#E9F6F4]/92 sm:pl-4">
                      {renderHighlightedResponse(promptIdx, respVisibleCount)}
                      {typedChars > respBlock.start && typedChars <= respBlock.end && (
                        <span className="ml-0.5 inline-block h-4 w-2 bg-[#E88B2E] align-middle" />
                      )}
                    </p>
                  </div>
                );
              })}

              {/* Dotted Spec Rows */}
              <div className="space-y-2.5 border-y border-[#70D6CE]/20 py-4 text-xs sm:text-sm">
                {terminal.specs.map((spec, specIdx) => {
                  const specBlock = blocks.find(
                    (b) => b.kind === "spec" && b.specIdx === specIdx
                  )!;
                  const visible = Math.max(0, typedChars - specBlock.start);
                  const shownKey = spec.key.slice(0, visible);
                  const valOffset = Math.max(0, visible - spec.key.length - 1);
                  const shownVal = spec.value.slice(0, valOffset);
                  const showDots = visible > spec.key.length;

                  return (
                    <div
                      key={spec.key}
                      className="flex min-h-[1.4em] items-baseline gap-2"
                    >
                      <span className="shrink-0 text-[#7CE5DB]">{shownKey}</span>
                      <span
                        aria-hidden="true"
                        className={`min-w-[20px] flex-1 border-b border-dotted border-[#70D6CE]/40 transition-opacity duration-200 ${
                          showDots ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span className="shrink-0 text-right font-semibold text-[#FBF5E8]">
                        {shownVal}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive CLI Output History */}
              {cliHistory.length > 0 && (
                <div
                  aria-live="polite"
                  className="space-y-3 rounded-xl border border-[#70D6CE]/20 bg-[#051417]/75 p-3.5 text-xs leading-relaxed"
                >
                  {cliHistory.map((entry, idx) => (
                    <div key={`${entry.cmd}-${idx}`} className="space-y-1">
                      <p className="font-semibold text-[#7CE5DB]">
                        &gt; {entry.cmd}
                      </p>
                      {entry.lines.map((line, lIdx) => (
                        <p key={lIdx} className="pl-3 text-[#E8F6F4]/90">
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Prompt & Quick-Command Chips */}
              <div className="space-y-3 pt-1">
                {!isTypingFinished ? (
                  <div className="flex min-h-[1.6em] items-center gap-2 text-sm font-semibold text-[#7CE5DB] sm:text-base">
                    <span>{closingText}</span>
                    {typedChars >= closingBlock.start && (
                      <span
                        aria-hidden="true"
                        className="animate-cursor-420 inline-block h-4 w-2.5 bg-[#E88B2E] shadow-[0_0_10px_rgba(232,139,46,0.8)]"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <form
                      onSubmit={handleFormSubmit}
                      className="flex items-center gap-2 rounded-lg border border-[#70D6CE]/25 bg-[#051417]/75 px-3 py-2 focus-within:border-[#F6B96D]/60"
                    >
                      <span className="shrink-0 font-semibold text-[#7CE5DB]">
                        {terminal.closingPrompt}
                      </span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={cliInput}
                        onChange={(e) => setCliInput(e.target.value)}
                        aria-label="JXLab interactive terminal command"
                        placeholder='type "projects", "stack", or "help"...'
                        className="w-full bg-transparent text-xs text-[#FBF5E8] placeholder:text-[#70D6CE]/45 focus:outline-none sm:text-sm"
                      />
                      <span
                        aria-hidden="true"
                        className="animate-cursor-420 h-4 w-2 shrink-0 bg-[#E88B2E]"
                      />
                    </form>

                    <div
                      aria-label="Quick terminal commands"
                      className="flex flex-wrap items-center gap-1.5"
                    >
                      {QUICK_COMMANDS.map((cmd) => (
                        <button
                          key={cmd}
                          type="button"
                          onClick={() => {
                            executeCommand(cmd);
                            inputRef.current?.focus();
                          }}
                          className="inline-flex min-h-[34px] items-center rounded-md border border-[#70D6CE]/25 bg-[#082126]/80 px-2.5 py-1 font-mono text-[11px] text-[#9BE2DC] transition hover:border-[#F6B96D]/65 hover:bg-[#0D2E34] hover:text-[#F6B96D] focus-visible:outline-2 focus-visible:outline-[#E88B2E]"
                        >
                          $ {cmd}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Agent core schematic panel */}
            <div className="relative flex min-h-[250px] flex-col justify-center rounded-xl border border-[#70D6CE]/22 bg-[#071418]/85 px-3 py-5 sm:min-h-[280px] sm:p-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-wider text-[#70D6CE]/75">
                <span>AGENT CORE // SCHEMATIC</span>
                <span className="text-[#F6B96D]/80">v1.0</span>
              </div>
              <pre
                aria-label="JXLab ASCII emblem"
                className="crt-phosphor-amber select-none overflow-hidden whitespace-pre font-mono text-[9.5px] leading-[1.2] text-[#F6B96D] sm:text-xs md:text-[13px]"
              >
                {visibleAsciiText || " "}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
