"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Clock3, Compass, BookOpenCheck, ChartColumnBig, Users } from "lucide-react";
import TiltCard from "./tilt-card";

const features = [
  {
    title: "AI-Powered",
    description: "Generate structured roadmaps in seconds with intelligent sequencing and smart dependencies.",
    icon: BrainCircuit,
    accent: "from-indigo-500/30 to-violet-400/30",
    iconColor: "text-indigo-400",
    glow: "rgba(99,102,241,0.12)",
  },
  {
    title: "Personalized Pace",
    description: "Set available hours and intensity, then follow a sustainable schedule built around your life.",
    icon: Clock3,
    accent: "from-cyan-500/30 to-blue-400/30",
    iconColor: "text-cyan-400",
    glow: "rgba(34,211,238,0.12)",
  },
  {
    title: "Free Resources",
    description: "Every topic links to curated videos, docs, and practical projects — all free.",
    icon: BookOpenCheck,
    accent: "from-emerald-500/30 to-teal-400/30",
    iconColor: "text-emerald-400",
    glow: "rgba(16,185,129,0.12)",
  },
  {
    title: "Progress Tracking",
    description: "Measure completed topics, streaks, and momentum over time with a visual dashboard.",
    icon: ChartColumnBig,
    accent: "from-fuchsia-500/30 to-pink-400/30",
    iconColor: "text-fuchsia-400",
    glow: "rgba(217,70,239,0.12)",
  },
  {
    title: "Community Roadmaps",
    description: "Explore and fork public paths shared by learners, developers, and domain experts.",
    icon: Users,
    accent: "from-amber-500/30 to-orange-400/30",
    iconColor: "text-amber-400",
    glow: "rgba(245,158,11,0.12)",
  },
  {
    title: "Multiple Learning Styles",
    description: "Adapt each plan for visual, hands-on, and concept-first learners with one toggle.",
    icon: Compass,
    accent: "from-rose-500/30 to-red-400/30",
    iconColor: "text-rose-400",
    glow: "rgba(244,63,94,0.12)",
  },
];

export default function FeaturesGridSection() {
  return (
    <section id="features" className="relative py-32">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/4 top-1/4 h-125 w-150 rounded-full bg-indigo-500/6 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Feature set
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl text-foreground">
            Why learners choose <span className="gradient-text">PathForge</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base landing-text-muted">
            Everything you need to go from zero to hired — in one place.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group"
              >
                <TiltCard className="relative h-full rounded-2xl border p-6 backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl landing-card-sm">
                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 40% 0%, ${feature.glow} 0%, transparent 70%)`,
                    }}
                  />

                  <div className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${feature.accent} ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="relative mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="relative text-sm leading-relaxed landing-text-muted">{feature.description}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
