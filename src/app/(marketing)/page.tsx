import LandingNavbar from "@/components/landing/navbar";
import Neural3DHero from "@/components/landing/3d-neural-hero";
import SocialProofSection from "@/components/landing/social-proof-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import FeaturesGridSection from "@/components/landing/features-grid-section";
import InteractiveDemoSection from "@/components/landing/interactive-demo-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import FinalCTASection from "@/components/landing/final-cta-section";
import Footer from "@/components/landing/footer";
import LandingBackground from "@/components/landing/landing-background";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PathForge — Forge Your Learning Path",
  description:
    "AI-powered personalized learning roadmaps. Tell PathForge your goals and get a custom step-by-step path to mastery — free.",
};

export default function LandingPage() {
  return (
    <LandingBackground>
      <main className="relative overflow-clip">
        <LandingNavbar />
        <Neural3DHero />
        <SocialProofSection />
        <HowItWorksSection />
        <FeaturesGridSection />
        <InteractiveDemoSection />
        <TestimonialsSection />
        <FinalCTASection />
        <Footer />
      </main>
    </LandingBackground>
  );
}
