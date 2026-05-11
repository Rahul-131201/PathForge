"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Zap } from "lucide-react";
import { useRef, useState } from "react";

const demoNodes = [
  { id: "1", label: "JS Basics", x: 8, y: 44, done: true },
  { id: "2", label: "React Core", x: 34, y: 20, done: true },
  { id: "3", label: "State Mgmt", x: 54, y: 48, done: false },
  { id: "4", label: "Routing", x: 74, y: 26, done: false },
  { id: "5", label: "Projects", x: 88, y: 56, done: false },
];

function RoadmapNode({
  node,
  index,
  activeId,
  onHover,
}: {
  node: (typeof demoNodes)[number];
  index: number;
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = activeId === node.id;
  const isPast = index < demoNodes.findIndex((n) => n.id === activeId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4, type: "spring" }}
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        animate={{
          scale: isActive ? 1.15 : 1,
          boxShadow: isActive
            ? node.done
              ? "0 0 20px 4px rgba(16,185,129,0.5)"
              : "0 0 20px 4px rgba(99,102,241,0.5)"
            : "none",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold backdrop-blur-sm transition-colors ${
          node.done
            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
            : isActive
            ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-200"
            : "border-border bg-muted/50 text-muted-foreground"
        }`}
      >
        {node.done ? (
          <CheckCircle2 className="h-3 w-3 shrink-0" />
        ) : (
          <Circle className="h-3 w-3 shrink-0 opacity-50" />
        )}
        {node.label}
      </motion.div>
    </motion.div>
  );
}

export default function InteractiveDemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="demo" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Live preview
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl text-foreground">
            Interactive roadmap <span className="gradient-text">demo</span>
          </h2>
          <p className="mt-3 landing-text-muted">Sample path: Learn React — hover the nodes</p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border p-4 backdrop-blur-xl landing-card sm:p-8"
        >
          {/* Progress bar */}
          <div className="mb-5 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>React Mastery Path</span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs landing-text-muted">
              <span>2/5 complete</span>
            </div>
            <div className="w-24 rounded-full bg-white/10 h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: "40%" } : { width: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-cyan-400"
              />
            </div>
          </div>

          {/* Graph */}
          <div className="relative h-70 overflow-hidden rounded-2xl border landing-demo-bg" style={{ borderColor: "var(--landing-border)" }}>
            {/* Grid lines */}
            <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground/20" />
            </svg>

            {/* Connection lines */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="demoGradientDone" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#10b981" />
                  <stop offset="1" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="demoGradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#818cf8" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              {demoNodes.slice(0, -1).map((node, i) => {
                const next = demoNodes[i + 1];
                const bothDone = node.done && next.done;
                return (
                  <motion.line
                    key={`${node.id}-${next.id}`}
                    x1={node.x} y1={node.y} x2={next.x} y2={next.y}
                    stroke={`url(#${bothDone ? "demoGradientDone" : "demoGradient"})`}
                    strokeWidth="0.6"
                    strokeOpacity={bothDone ? "0.9" : "0.5"}
                    strokeDasharray="2 1.5"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {demoNodes.map((node, i) => (
              <RoadmapNode
                key={node.id}
                node={node}
                index={i}
                activeId={activeId}
                onHover={setActiveId}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="gradient" size="xl" asChild className="landing-shimmer">
              <Link href="/signup">Create your own roadmap in 30 seconds</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
