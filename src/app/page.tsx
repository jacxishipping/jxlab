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
      {/* Continuous Scroll-Driven Sky Backdrop (8-stop gradient, Bézier sun & moon, 50 stars, FBM clouds) */}
      <SkyBackdrop />

      <Navbar />
      <StatusRibbon />
      <SectionRail />

      <main className="relative z-10">
        {/* Act 1: Dawn Sky Hero */}
        <Hero />

        {/* Act 2: Canopy Vignette & 85 chars/s Typewriter CRT Terminal */}
        <TerminalAbout />

        {/* Act 3: Sunset Studio Rail Choreography & Origin-Sprung Solutions */}
        <DepotSolutions />

        {/* Act 4: Twilight Eagle Flyover, Feather-Drop Showcase, 70px/s Marquee & FAQ */}
        <BuildsMarquee />
        <FaqAccordion />

        {/* Act 5: Interactive Wind Grass, Lissajous Fireflies, Tripod-Gait Ant Trail & Underground Burrow */}
        <AntTrailTeam />
        <UndergroundFooter />
      </main>
    </div>
  );
}
