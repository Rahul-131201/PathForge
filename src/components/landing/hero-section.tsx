"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdaptiveQuality } from "@/components/shared";
import { useState, useEffect, useRef } from "react";

const Hero3DScene = dynamic(() => import("./hero-3d-scene"), {
  ssr: false,
  loading: () => (
    <div className="hidden h-105 w-full animate-pulse rounded-3xl border landing-card lg:block" />
  ),
});

const words = ["Your", "Personalized", "Learning", "Roadmap"];

export default function HeroSection() {
  const { quality } = useAdaptiveQuality();
  const [show3D, setShow3D] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setShow3D(quality === "high");
  }, [quality]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax layers at different speeds
  const meshY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), {
    stiffness: 60, damping: 18,
  });
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 55]), {
    stiffness: 60, damping: 18,
  });
  const sceneY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), {
    stiffness: 60, damping: 18,
  });

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden pt-24">
      {/* Parallax background layers */}
      <motion.div
        style={{ y: meshY }}
        className="absolute inset-0 landing-mesh"
      />
      <motion.div
        style={{ y: meshY }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.24),transparent_42%)]"
      />

      {/* Floating orbs for depth */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 60]) }}
        className="pointer-events-none absolute left-[8%] top-[25%] h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        className="pointer-events-none absolute right-[12%] top-[15%] h-48 w-48 rounded-full bg-cyan-400/10 blur-[60px]"
      />

      <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div style={{ y: textY }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold landing-card"
          >
            <Sparkles className="h-3 w-3 text-cyan-500" />
            <span className="landing-text-muted">AI-Powered Learning Roadmaps</span>
          </motion.div>

          <h1 className="text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, filter: "blur(14px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="mr-3 inline-block text-foreground"
              >
                {i === 2 ? (
                  <span className="gradient-text">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.56 }}
            className="mt-6 max-w-xl text-lg landing-text-body"
          >
            Tell PathForge your goal, available time, and skill level. Get an AI-generated
            plan with clear milestones and curated resources.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.72 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button variant="gradient" size="xl" asChild className="group relative overflow-hidden">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="xl"
              asChild
              className="border landing-card backdrop-blur-sm landing-text-body hover:bg-white/10"
            >
              <Link href="#how-it-works">
                <PlayCircle className="h-4 w-4" />
                See How It Works
              </Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.88 }}
            className="mt-10 flex flex-wrap gap-6"
          >
            {[
              { value: "10k+", label: "Learners" },
              { value: "500+", label: "Roadmaps" },
              { value: "Free", label: "Forever" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-black gradient-text">{value}</span>
                <span className="text-xs font-medium uppercase tracking-widest landing-text-muted">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: sceneY }} className="relative h-105">
          {show3D ? (
            <Hero3DScene />
          ) : (
            <div className="h-full rounded-3xl border landing-card bg-linear-to-br from-indigo-500/20 via-fuchsia-500/15 to-cyan-400/20" />
          )}
          {/* Glow under scene */}
          <div className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-xs uppercase tracking-widest landing-text-muted">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          className="h-6 w-px bg-linear-to-b from-current to-transparent landing-text-muted"
        />
      </motion.div>
    </section>
  );
}
