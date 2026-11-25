"use client";

import React, { useEffect, useState } from "react";
import { jxlabConfig } from "@/data/jxlabConfig";

export function SectionRail() {
  const [activeId, setActiveId] = useState<string>(jxlabConfig.sectionRail[0].id);

  useEffect(() => {
    const ids = jxlabConfig.sectionRail.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -35% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Page section progress"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 rounded-full border border-[#FBF5E8]/15 bg-[#19120E]/55 px-2.5 py-4 backdrop-blur-md lg:flex"
    >
      {jxlabConfig.sectionRail.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            aria-label={`Jump to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex h-6 w-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E88B2E]"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-6 w-2 bg-[#E88B2E] shadow-[0_0_12px_rgba(232,139,46,0.75)]"
                  : "h-2 w-2 bg-[#FBF5E8]/45 group-hover:scale-125 group-hover:bg-[#FBF5E8]"
              }`}
            />
            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-full border border-[#E2D2B7] bg-[#FBF5E8] px-2.5 py-1 text-[11px] font-semibold text-[#1E1712] opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
