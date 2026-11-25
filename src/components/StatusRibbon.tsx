import React from "react";
import { jxlabConfig } from "@/data/jxlabConfig";

export function StatusRibbon() {
  return (
    <div
      aria-label="Studio status"
      className="pointer-events-none fixed right-5 top-20 z-40 hidden items-center gap-2 rounded-full border border-[#FBF5E8]/20 bg-[#1B1310]/70 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-wider text-[#FBF5E8]/90 shadow-lg backdrop-blur-md xl:inline-flex"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E88B2E] opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E88B2E]" />
      </span>
      <span>{jxlabConfig.brand.statusRibbon}</span>
    </div>
  );
}
