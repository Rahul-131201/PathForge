"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Neural3DHero() {
  const sectionRef = useRef<HTMLSection>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
    >

      <div className="relative h-screen">
        <div className="flex h-full items-center justify-center">
          {/* Content - Centered */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex flex-col justify-center px-6 py-20 sm:px-8 lg:px-12"
          >
            {/* Badge */}
            <motion.div variants={item}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-300">
                  AI-Powered Intelligence
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="mb-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="block text-white">Navigate</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Your Future
              </span>
              <span className="block text-white">with AI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="mb-8 max-w-lg text-lg text-slate-400 leading-relaxed"
            >
              Generate personalized learning and career roadmaps powered by
              intelligent AI systems. Visualize your growth journey in a
              dynamic, interactive 3D universe.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              variants={item}
              className="mb-10 flex flex-wrap gap-3"
            >
              {[
                "AI-Powered",
                "Personalized",
                "Interactive",
                "Real-time",
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm"
                >
                  ✨ {feature}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row">
              <Link href="/onboarding" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-base h-14 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] group"
                >
                  Generate My Roadmap
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/explore" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-cyan-500/50 bg-slate-900/50 text-cyan-300 hover:bg-slate-800 hover:text-cyan-200 font-bold text-base h-14 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  Explore Paths
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="mt-12 flex gap-8 border-t border-slate-800 pt-8"
            >
              {[
                { value: "500K+", label: "Paths Generated" },
                { value: "98%", label: "Success Rate" },
                { value: "24/7", label: "AI Support" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-sm">Scroll to explore</span>
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
