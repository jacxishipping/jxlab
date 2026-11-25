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
        {/* Act 1: Brand-first dawn hero + misty studio skyline */}
        <Hero />

        {/* Act 2: Canopy CRT typewriter + interactive CLI */}
        <TerminalAbout />

        {/* Act 3: Agent/CI pipeline with dusk lamps, leaves, cream tracks */}
        <DepotSolutions />

        {/* Act 4: Eagle/feather showcase, flagship builds, marquee + FAQ */}
        <BuildsMarquee />
        <FaqAccordion />

        {/* Act 5: Ant trail crew + underground deploy vault */}
        <AntTrailTeam />
        <UndergroundFooter />
      </main>
    </div>
  );
}
