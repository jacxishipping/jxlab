import React from "react";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SkyBackdrop } from "@/components/SkyBackdrop";
import { Navbar } from "@/components/Navbar";
import { SectionRail } from "@/components/SectionRail";
import { StatusRibbon } from "@/components/StatusRibbon";
import { Hero } from "@/components/Hero";
import { TerminalAbout } from "@/components/TerminalAbout";
import { DepotSolutions } from "@/components/DepotSolutions";
import { BuildsMarquee } from "@/components/BuildsMarquee";
import { FaqAccordion } from "@/components/FaqAccordion";
import { AntTrailTeam } from "@/components/AntTrailTeam";
import { UndergroundFooter } from "@/components/UndergroundFooter";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      <SmoothScrollProvider />
      {/* Scroll-driven studio sky (haze, key light, blueprint grid) */}
      <SkyBackdrop />

      <Navbar />
      <StatusRibbon />
      <SectionRail />

      <main className="relative z-10">
        {/* Act 1: Studio sky hero + architecture horizon */}
        <Hero />

        {/* Act 2: Studio console typewriter + interactive CLI */}
        <TerminalAbout />

        {/* Act 3: Scroll-scrubbed agent/CI pipeline + solution tracks */}
        <DepotSolutions />

        {/* Act 4: Deploy packet flyover, flagship builds, tech marquee + FAQ */}
        <BuildsMarquee />
        <FaqAccordion />

        {/* Act 5: Neural field, agent crew bus, deploy-core vault */}
        <AntTrailTeam />
        <UndergroundFooter />
      </main>
    </div>
  );
}
