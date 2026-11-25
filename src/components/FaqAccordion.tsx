"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";

const FAQ_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FaqAccordion() {
  const { faqSection } = jxlabConfig;
  const [openId, setOpenId] = useState<string | null>(faqSection.items[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 overflow-hidden bg-transparent px-4 pb-28 pt-14 sm:px-6 sm:pb-36 sm:pt-20"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#FBF5E8]/20 bg-[#181228]/65 px-3.5 py-1 font-mono text-xs font-semibold tracking-widest text-[#F6B96D] backdrop-blur-sm">
            {faqSection.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#FBF5E8] sm:text-5xl">
            {faqSection.headline}
          </h2>
        </motion.div>

        <div className="mt-10 space-y-3.5">
          {faqSection.items.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;

            return (
              <div
                key={item.id}
                className="cream-card overflow-hidden rounded-2xl transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_18px_38px_-12px_rgba(246,185,109,0.28)]"
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E88B2E] sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-bold text-[#1E1712] sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen
                        ? "rotate-45 border-[#E88B2E] bg-[#E88B2E] text-[#1B120A]"
                        : "rotate-0 border-[#D8C5A5] bg-[#F2E5CC] text-[#1E1712]"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: { duration: 0.45, ease: FAQ_EASE },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.32, ease: FAQ_EASE },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#E6D8BE] px-5 pb-5 pt-4 text-sm leading-relaxed text-[#4E3E33] sm:px-6 sm:text-[15px]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle bottom fade into Act 5 meadow groundline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#0D0A16]"
      />
    </section>
  );
}
