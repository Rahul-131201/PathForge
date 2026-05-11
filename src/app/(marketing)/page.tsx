import LandingNavbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import SocialProofSection from "@/components/landing/social-proof-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import FeaturesGridSection from "@/components/landing/features-grid-section";
import InteractiveDemoSection from "@/components/landing/interactive-demo-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import FinalCTASection from "@/components/landing/final-cta-section";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PathForge — Forge Your Learning Path",
  description:
    "AI-powered personalized learning roadmaps. Tell PathForge your goals and get a custom step-by-step path to mastery — free.",
};

export default function LandingPage() {
  return (
    <main className="relative overflow-clip bg-background">
      <LandingNavbar />
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <FeaturesGridSection />
      <InteractiveDemoSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
