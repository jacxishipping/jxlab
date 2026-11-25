import type { Metadata } from "next";
import {
  Space_Grotesk,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jxlab.ai"),
  title: "JXLab — Agentic AI & Software Engineering Studio",
  description:
    "JXLab is an agentic AI and software development startup turning complex workflows into autonomous, production-grade products.",
  keywords: [
    "JXLab",
    "Agentic AI",
    "Software Development",
    "Multi-Agent Pipelines",
    "Custom Software",
    "SaaS Engineering",
    "AI Bridge",
    "JXAI",
    "JXUI React",
  ],
  openGraph: {
    title: "JXLab — Agentic AI & Software Engineering Studio",
    description:
      "Autonomous AI Agents, Native C++ Inference, React 19 Design Systems & Production SaaS Platforms.",
    type: "website",
    siteName: "JXLab",
  },
  twitter: {
    card: "summary_large_image",
    title: "JXLab — Agentic AI & Software Engineering Studio",
    description:
      "Autonomous AI Agents, Native C++ Inference, React 19 Design Systems & Production SaaS Platforms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased selection:bg-[#E88B2E] selection:text-[#1B120A]">
        {children}
      </body>
    </html>
  );
}
