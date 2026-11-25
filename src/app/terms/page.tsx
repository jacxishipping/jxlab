import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";
import { JxEmblem } from "@/components/JxEmblem";

export const metadata: Metadata = {
  title: "Terms of Service — JXLab",
  description: "Terms governing access to JXLab services and client portal.",
};

export default function TermsPage() {
  return (
    <div
      className="min-h-screen px-4 py-12 sm:px-6 sm:py-16"
      style={{
        background:
          "linear-gradient(180deg, #1E1733 0%, #161428 45%, #160F0B 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#FBF5E8]/20 bg-[#1B1310]/65 px-4 py-2 text-sm font-semibold text-[#FBF5E8] transition hover:bg-[#FBF5E8]/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to JXLab
          </Link>
          <div className="flex items-center gap-2">
            <JxEmblem className="h-7 w-7" />
            <span className="font-display font-bold text-[#FBF5E8]">
              {jxlabConfig.brand.name}
            </span>
          </div>
        </div>

        <article className="cream-card rounded-2xl p-6 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9A4E0B]">
            Legal · Last Updated {jxlabConfig.legal.termsUpdated}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1E1712] sm:text-4xl">
            Terms of Service
          </h1>

          <div className="mt-6 space-y-6 text-sm leading-relaxed text-[#3E3128] sm:text-[15px]">
            <section>
              <h2 className="font-display text-lg font-bold text-[#1E1712]">
                1. Studio Engagements
              </h2>
              <p className="mt-2">
                All custom software engineering, multi-agent AI architecture,
                and advisory services provided by JXLab are governed by an
                executed Master Services Agreement (MSA) and Statement of Work
                (SOW) outlining deliverables, sprint timelines, and fees.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-[#1E1712]">
                2. Intellectual Property Ownership
              </h2>
              <p className="mt-2">
                Upon full payment of applicable invoices, 100% of custom
                application code, agent workflows, prompts, evaluation suites,
                and documentation authored specifically for a client engagement
                transfers cleanly to the client.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-[#1E1712]">
                3. Client Portal Access &amp; Acceptable Use
              </h2>
              <p className="mt-2">
                You are responsible for safeguarding your JXLab Client Portal
                credentials and notifying us promptly at{" "}
                <a
                  href={`mailto:${jxlabConfig.brand.email}`}
                  className="font-semibold text-[#9A4E0B] underline"
                >
                  {jxlabConfig.brand.email}
                </a>{" "}
                if you suspect unauthorized access.
              </p>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2D2B7] pt-6 text-xs text-[#6E5B4B]">
              <span>{jxlabConfig.brand.copyright}</span>
              <Link
                href="/privacy"
                className="font-semibold text-[#9A4E0B] underline-offset-4 hover:underline"
              >
                Read Privacy Notice →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
