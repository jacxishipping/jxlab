"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";
import { JxEmblem } from "./JxEmblem";

export function Navbar() {
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("");
  const lastYRef = useRef(0);

  // Track active nav anchor via IntersectionObserver (mirrors SectionRail)
  useEffect(() => {
    const sections = jxlabConfig.nav
      .map((item) => ({
        href: item.href,
        el: document.querySelector(item.href) as HTMLElement | null,
      }))
      .filter((s): s is { href: string; el: HTMLElement } => Boolean(s.el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: [0.1, 0.3, 0.5] }
    );

    sections.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 800;
      const delta = y - lastYRef.current;

      setCompact(y > vh * 0.45);
      if (y < vh * 0.35) {
        setActiveHref("");
      }

      if (y <= vh * 0.5 || mobileOpen) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastYRef.current = y;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      animate={{ y: hidden ? "-115%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onFocusCapture={() => setHidden(false)}
      className="fixed inset-x-0 top-0 z-[120] px-4 pt-3 sm:px-6 sm:pt-4"
    >
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between transition-all duration-300 ease-out ${
          compact
            ? "rounded-full border border-[#FBF5E8]/15 bg-[#1B1310]/88 px-4 py-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.48)] backdrop-blur-md sm:px-5"
            : "rounded-full border border-transparent bg-transparent px-2 py-2.5 sm:px-3"
        }`}
      >
        {/* Brand */}
        <Link
          href="#hero"
          onClick={(e) => handleAnchorClick(e, "#hero")}
          className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E]"
        >
          <JxEmblem className="h-8 w-8 shrink-0" />
          <span className="font-display text-lg font-bold tracking-tight text-[#FBF5E8]">
            {jxlabConfig.brand.name}
          </span>
        </Link>

        {/* Desktop Nav Links with Active Section Highlight */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {jxlabConfig.nav.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                aria-current={isActive ? "location" : undefined}
                className={`relative inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E] ${
                  isActive
                    ? "bg-[#E88B2E]/20 text-[#FFCF7A] ring-1 ring-[#E88B2E]/45"
                    : "text-[#FBF5E8]/85 hover:bg-[#FBF5E8]/10 hover:text-[#FBF5E8]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/login?mode=signin"
            className="hidden min-h-[44px] items-center justify-center rounded-full bg-[#E88B2E] px-5 py-2 text-sm font-semibold text-[#1B120A] shadow-[0_6px_20px_rgba(232,139,46,0.35)] transition hover:bg-[#F29A42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBF5E8] md:inline-flex"
          >
            Client Portal
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#FBF5E8]/20 bg-[#1B1310]/65 text-[#FBF5E8] backdrop-blur-sm transition hover:bg-[#FBF5E8]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E] md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-[#FBF5E8]/15 bg-[#1B1310]/95 p-4 shadow-2xl backdrop-blur-lg md:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {jxlabConfig.nav.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className={`flex min-h-[46px] items-center rounded-xl px-4 text-base font-medium transition ${
                      isActive
                        ? "bg-[#E88B2E]/20 text-[#FFCF7A]"
                        : "text-[#FBF5E8] hover:bg-[#FBF5E8]/10"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="mt-2 border-t border-[#FBF5E8]/10 pt-3">
                <Link
                  href="/login?mode=signin"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[46px] w-full items-center justify-center rounded-full bg-[#E88B2E] px-5 text-sm font-semibold text-[#1B120A] transition hover:bg-[#F29A42]"
                >
                  Client Portal
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
