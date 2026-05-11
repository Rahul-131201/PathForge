"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Map,
  Zap,
  Target,
  BarChart3,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "AI Roadmap Generation",
    description:
      "Gemini AI analyzes your goals and creates a structured, step-by-step learning path tailored specifically to you.",
    color: "from-brand-primary to-brand-accent",
    glow: "rgba(99,102,241,0.3)",
  },
  {
    icon: Target,
    title: "Goal-Oriented Structure",
    description:
      "Every roadmap is built backwards from your end goal, ensuring each step directly contributes to your success.",
    color: "from-brand-accent to-brand-secondary",
    glow: "rgba(168,85,247,0.3)",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Check off nodes as you complete them and watch your progress visualized in real time with beautiful charts.",
    color: "from-brand-secondary to-brand-primary",
    glow: "rgba(34,211,238,0.3)",
  },
  {
    icon: Zap,
    title: "Curated Resources",
    description:
      "Each step comes with hand-picked articles, videos, and projects — no more endless Googling.",
    color: "from-brand-primary to-brand-secondary",
    glow: "rgba(99,102,241,0.3)",
  },
  {
    icon: Map,
    title: "Visual Explorer",
    description:
      "Navigate your roadmap with an interactive canvas. Zoom, pan, and click nodes to reveal details.",
    color: "from-brand-accent to-brand-primary",
    glow: "rgba(168,85,247,0.3)",
  },
  {
    icon: Users,
    title: "Community Roadmaps",
    description:
      "Explore and fork roadmaps shared by the community. Learn from what others have already validated.",
    color: "from-brand-secondary to-brand-accent",
    glow: "rgba(34,211,238,0.3)",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "#050510" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,102,241,0.06),transparent)]" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 text-xs font-medium text-primary mb-4">
            <Zap className="w-3 h-3" /> Everything You Need
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for{" "}
            <span className="gradient-text">Serious Learners</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            PathForge combines AI intelligence with beautiful visualization to
            make your learning journey clear, organized, and motivating.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <div
                className={cn(
                  "relative group p-6 rounded-2xl glass border border-white/6 hover:border-white/12",
                  "transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden"
                )}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className={cn(
                    "relative w-11 h-11 rounded-xl bg-linear-to-br mb-4 flex items-center justify-center",
                    feature.color
                  )}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="font-semibold text-lg mb-2 relative">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
