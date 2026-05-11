"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export type RoadmapCard = {
  id: string;
  title: string;
  goal: string;
  skillLevel: string;
  estimatedTotalHours: number | null;
  updatedAt: string;
  totalTopics: number;
  completedTopics: number;
  lastActivityAt: string | null;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

function relativeTime(iso: string | null): string {
  if (!iso) return "No activity yet";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Circular SVG progress indicator ──────────────────────────────────────────

function CircularProgress({ pct, id }: { pct: number; id: string }) {
  const SIZE = 72;
  const STROKE = 5;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const gradId = `cpg-${id}`;

  return (
    <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - pct / 100) }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold tabular-nums">{pct}%</span>
      </div>
    </div>
  );
}

// ── TiltCard wrapper ──────────────────────────────────────────────────────────

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    setTilt({ x: -dy * 6, y: dx * 6, scale: 1.02 });
  };

  const onMouseLeave = () => setTilt({ x: 0, y: 0, scale: 1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: tilt.scale }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Roadmap card ──────────────────────────────────────────────────────────────

function RoadmapCardItem({ roadmap, index }: { roadmap: RoadmapCard; index: number }) {
  const pct =
    roadmap.totalTopics > 0
      ? Math.round((roadmap.completedTopics / roadmap.totalTopics) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <TiltCard className="h-full">
        <div className="glass h-full rounded-xl border border-border/50 hover:border-primary/30 p-4 flex flex-col gap-4 transition-colors">
          {/* Top row */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide",
                    roadmap.skillLevel === "beginner" && "bg-green-500/10 text-green-400",
                    roadmap.skillLevel === "intermediate" && "bg-yellow-500/10 text-yellow-400",
                    roadmap.skillLevel === "advanced" && "bg-red-500/10 text-red-400"
                  )}
                >
                  {roadmap.skillLevel}
                </span>
                {roadmap.estimatedTotalHours != null && (
                  <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {roadmap.estimatedTotalHours}h
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                {roadmap.title}
              </h3>
              {roadmap.goal && (
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {roadmap.goal}
                </p>
              )}
            </div>

            <CircularProgress pct={pct} id={roadmap.id} />
          </div>

          {/* Progress text */}
          <div className="text-xs text-muted-foreground">
            {roadmap.completedTopics} of {roadmap.totalTopics} topics completed
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {relativeTime(roadmap.lastActivityAt)}
            </span>
            <Link
              href={`/roadmap/${roadmap.id}`}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              Continue
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  roadmaps: RoadmapCard[];
}

export default function ActiveRoadmaps({ roadmaps }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">My Roadmaps</h2>
        <Link
          href="/dashboard/roadmaps"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          View all
        </Link>
      </div>

      {roadmaps.length === 0 ? (
        <div className="glass rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center mb-4">
            <Plus className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No roadmaps yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Create your first AI-generated learning roadmap in just 2 minutes.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 0 20px rgba(99,102,241,0.3)",
            }}
          >
            <Plus className="w-4 h-4" />
            Create My First Roadmap
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmaps.map((r, i) => (
            <RoadmapCardItem key={r.id} roadmap={r} index={i} />
          ))}

          {/* New card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: roadmaps.length * 0.1 }}
          >
            <Link
              href="/onboarding"
              className="glass h-full rounded-xl border border-dashed border-border/50 hover:border-primary/30 transition-colors flex flex-col items-center justify-center gap-3 text-center p-6 min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">New Roadmap</span>
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
}
