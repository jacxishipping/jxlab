import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { jxlabConfig } from "@/data/jxlabConfig";
import { JxEmblem } from "@/components/JxEmblem";

export const metadata: Metadata = {
  title: "Privacy Notice — JXLab",
  description: "How JXLab collects, processes, and protects your data.",
};

export default function PrivacyPage() {
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
            Legal · Last Updated {jxlabConfig.legal.privacyUpdated}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1E1712] sm:text-4xl">
            Privacy Notice
          </h1>

          <div className="mt-6 space-y-6 text-sm leading-relaxed text-[#3E3128] sm:text-[15px]">
            <section>
              <h2 className="font-display text-lg font-bold text-[#1E1712]">
                1. Information We Collect
              </h2>
              <p className="mt-2">
                When you create a JXLab Client Portal account, submit a project
                brief, or contact our studio, we collect only the contact and
                scoping details you provide (such as your name, work email,
                company details, and project requirements).
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-[#1E1712]">
                2. Zero Training on Client Data
              </h2>
              <p className="mt-2">
                JXLab never uses client proprietary repositories, architecture
                documents, or production payloads to train foundation AI models.
                All agentic AI builds default to zero-data-retention API
                configurations or private VPC inference endpoints.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-[#1E1712]">
                3. Security &amp; Retention
              </h2>
              <p className="mt-2">
                We protect account and project records using encryption in
                transit and at rest, role-based access controls, and strict
                audit logging. You may request export or deletion of your
                account data at any time by emailing{" "}
                <a
                  href={`mailto:${jxlabConfig.brand.email}`}
                  className="font-semibold text-[#9A4E0B] underline"
                >
                  {jxlabConfig.brand.email}
                </a>
                .
              </p>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2D2B7] pt-6 text-xs text-[#6E5B4B]">
              <span>{jxlabConfig.brand.copyright}</span>
              <Link
                href="/terms"
                className="font-semibold text-[#9A4E0B] underline-offset-4 hover:underline"
              >
                Read Terms of Service →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
