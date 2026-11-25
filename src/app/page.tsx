import React from "react";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { IntroOverlay } from "@/components/IntroOverlay";
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
      <IntroOverlay />
      {/* Scroll-driven dusk sky — clouds, sun/moon arc, stars (HTN atmosphere) */}
      <SkyBackdrop />

      <Navbar />
      <StatusRibbon />
      <SectionRail />

      <main className="relative z-10">
        {/* Act 1: Full-viewport dawn hero */}
        <Hero />

        {/* Act 2: Full-viewport canopy CRT scene */}
        <TerminalAbout />

        {/* Act 3: Full-viewport pipeline scene + cream tracks below */}
        <DepotSolutions />

        {/* Act 4: Full-viewport eagle/builds scene + marquee */}
        <BuildsMarquee />

        {/* Act 5: Full-viewport FAQ scene */}
        <FaqAccordion />

        {/* Act 6: Full-viewport crew meadow + deploy vault scene */}
        <AntTrailTeam />
        <UndergroundFooter />
      </main>
    </div>
  );
}
