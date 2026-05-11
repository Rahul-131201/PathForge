"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Brain, Route, SlidersHorizontal, Trophy } from "lucide-react";

/* ─── data ─────────────────────────────────────────────────────────── */

type Accent = "indigo" | "fuchsia" | "cyan" | "emerald";
type MockupType = "quiz" | "ai" | "graph" | "progress";

const steps: {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  mockup: MockupType;
  accent: Accent;
}[] = [
  {
    number: "01",
    title: "Tell us your goal",
    description:
      "Choose your target skill, timeline, and current level in a simple guided quiz.",
    icon: SlidersHorizontal,
    mockup: "quiz",
    accent: "indigo",
  },
  {
    number: "02",
    title: "AI builds your path",
    description:
      "Our model assembles phases, topics, and practical resources tailored to your constraints.",
    icon: Brain,
    mockup: "ai",
    accent: "fuchsia",
  },
  {
    number: "03",
    title: "Follow your roadmap",
    description:
      "Navigate an interactive graph that keeps every topic connected to your end-goal.",
    icon: Route,
    mockup: "graph",
    accent: "cyan",
  },
  {
    number: "04",
    title: "Track your progress",
    description:
      "See milestones, streaks, and completion in a dashboard designed to keep momentum high.",
    icon: Trophy,
    mockup: "progress",
    accent: "emerald",
  },
];

const accentMap: Record<
  Accent,
  { text: string; iconBg: string; ring: string; glow: string; dot: string }
> = {
  indigo: {
    text: "text-indigo-400",
    iconBg: "bg-indigo-500/15",
    ring: "ring-indigo-500/30",
    glow: "rgba(99,102,241,0.10)",
    dot: "bg-indigo-400",
  },
  fuchsia: {
    text: "text-fuchsia-400",
    iconBg: "bg-fuchsia-500/15",
    ring: "ring-fuchsia-500/30",
    glow: "rgba(217,70,239,0.10)",
    dot: "bg-fuchsia-400",
  },
  cyan: {
    text: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
    ring: "ring-cyan-500/30",
    glow: "rgba(34,211,238,0.10)",
    dot: "bg-cyan-400",
  },
  emerald: {
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    ring: "ring-emerald-500/30",
    glow: "rgba(16,185,129,0.10)",
    dot: "bg-emerald-400",
  },
};

/* ─── mockup ────────────────────────────────────────────────────────── */

function Mockup({ type }: { type: MockupType }) {
  if (type === "quiz") {
    return (
      <div className="rounded-xl border p-4 landing-card">
        <div className="mb-3 h-2.5 w-20 rounded-full bg-indigo-400/40" />
        <div className="space-y-2">
          <div className="h-8 rounded-lg" style={{ background: "var(--landing-surface-sm)" }} />
          <div className="h-8 rounded-lg" style={{ background: "var(--landing-surface-sm)" }} />
          <div className="h-8 rounded-lg bg-cyan-400/20 ring-1 ring-cyan-400/40" />
        </div>
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/[0.07] p-4">
        <div className="absolute inset-0 animate-pulse bg-fuchsia-400/4" />
        <div className="relative space-y-3">
          {[
            { w: "w-3/4", c: "bg-fuchsia-400/40" },
            { w: "w-1/2", c: "bg-purple-400/40" },
          ].map((row, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-fuchsia-400/20" />
              <div className="flex-1 space-y-1.5 pt-0.5">
                <div className={`h-2.5 rounded-full ${row.c} ${row.w}`} />
                <div className="h-2.5 w-2/5 rounded-full" style={{ background: "var(--landing-surface-md)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "graph") {
    return (
      <div className="rounded-xl border p-4 landing-card">
        <div className="relative h-24">
          <span className="absolute left-3 top-12 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]" />
          <span className="absolute left-18 top-4 h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_8px_2px_rgba(99,102,241,0.5)]" />
          <span className="absolute left-35 top-16 h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_8px_2px_rgba(217,70,239,0.5)]" />
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="16" y1="63" x2="74" y2="19" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" className="text-foreground" />
            <line x1="74" y1="19" x2="143" y2="67" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" className="text-foreground" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4 landing-card">
      <div className="grid grid-cols-3 gap-2">
        <div className="h-12 rounded-lg bg-indigo-400/20" />
        <div className="h-12 rounded-lg bg-cyan-400/20" />
        <div className="h-12 rounded-lg bg-fuchsia-400/20" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 rounded-full" style={{ background: "var(--landing-border)" }} />
        <div className="h-1.5 w-2/3 rounded-full bg-emerald-400/50" />
      </div>
    </div>
  );
}

/* ─── step card ─────────────────────────────────────────────────────── */

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const ac = accentMap[step.accent];
  const Icon = step.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: (index % 2) * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl hover-lift landing-card"
    >
      {/* Radial hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 40% 0%, ${ac.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Watermark step number */}
      <span className="pointer-events-none absolute -right-1 -top-3 select-none text-[96px] font-black leading-none landing-watermark">
        {step.number}
      </span>

      <div className="relative">
        {/* Icon + label row */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ac.iconBg} ring-1 ${ac.ring}`}
          >
            <Icon className={`h-5 w-5 ${ac.text}`} />
          </div>
          <span
            className={`font-mono text-[11px] font-semibold uppercase tracking-[0.22em] ${ac.text}`}
          >
            Step {step.number}
          </span>
        </div>

        <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {step.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed landing-text-muted">
          {step.description}
        </p>

        <Mockup type={step.mockup} />
      </div>
    </motion.article>
  );
}

/* ─── section ───────────────────────────────────────────────────────── */

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.6 });

  /* Scroll-driven progress line — scoped to this section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.4"],
  });
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-40 scroll-mt-28"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-125 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-100 w-125 translate-x-1/2 translate-y-1/2 rounded-full bg-fuchsia-500/4 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            The process
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl text-foreground">
            How PathForge{" "}
            <span className="gradient-text">works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base landing-text-muted">
            From ambition to action — in four intelligent steps.
          </p>
        </motion.div>

        {/* Scroll-driven progress bar */}
        <div className="mx-auto mb-12 h-px max-w-3xl overflow-hidden rounded-full" style={{ background: 'var(--landing-border)' }}>
          <motion.div
            className="h-full origin-left rounded-full bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-400"
            style={{ scaleX: lineScaleX }}
          />
        </div>

        {/* 2 × 2 card grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
