import React, { Suspense } from "react";
import type { Metadata } from "next";
import { KoiAuthPortal } from "@/components/KoiAuthPortal";

export const metadata: Metadata = {
  title: "Client Portal — JXLab",
  description:
    "Sign in or create your JXLab Client Portal account to start an Agentic AI or custom software engineering sprint.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#062834] font-mono text-sm text-[#FBF5E8]">
          Loading JXLab Client Portal...
        </div>
      }
    >
      <KoiAuthPortal />
    </Suspense>
  );
}
