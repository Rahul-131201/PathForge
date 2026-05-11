"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UpNextTopic = {
  topicId: string;
  topicTitle: string;
  roadmapId: string;
  roadmapTitle: string;
  difficulty: string;
  estimatedHours: number | null;
};

// ── Difficulty styling ─────────────────────────────────────────────────────────

const DIFF_STYLE: Record<string, string> = {
  easy: "bg-green-500/10 text-green-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  hard: "bg-red-500/10 text-red-400",
  beginner: "bg-green-500/10 text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-400",
  advanced: "bg-red-500/10 text-red-400",
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  topics: UpNextTopic[];
}

export default function UpNextWidget({ topics: initialTopics }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [starting, setStarting] = useState<Set<string>>(new Set());

  const visible = initialTopics.filter((t) => !dismissed.has(t.topicId));

  const handleStart = async (topicId: string) => {
    // Optimistic: mark as starting
    setStarting((s) => new Set([...s, topicId]));

    try {
      await fetch("/api/roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, status: "in_progress" }),
      });
    } catch {
      // Silently handle — optimistic update is already applied
    }

    // Remove from list after brief delay
    setTimeout(() => {
      setDismissed((d) => new Set([...d, topicId]));
    }, 300);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-accent" />
        <h2 className="text-base font-semibold">Up Next</h2>
      </div>

      {visible.length === 0 ? (
        <div className="glass rounded-xl border border-border/50 p-6 text-center text-sm text-muted-foreground">
          {initialTopics.length === 0
            ? "All caught up! Keep going to unlock more topics."
            : "Nice work — you've started everything! Keep it up."}
        </div>
      ) : (
        <div className="glass rounded-xl border border-border/50 overflow-hidden divide-y divide-border/30">
          <AnimatePresence initial={false}>
            {visible.map((topic, i) => {
              const isStarting = starting.has(topic.topicId);

              return (
                <motion.div
                  key={topic.topicId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isStarting ? 0.4 : 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  {/* Index badge */}
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #a855f7)",
                      color: "white",
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug truncate">{topic.topicTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                          DIFF_STYLE[topic.difficulty] ?? DIFF_STYLE.medium
                        )}
                      >
                        {topic.difficulty}
                      </span>
                      {topic.estimatedHours != null && (
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {topic.estimatedHours}h
                        </span>
                      )}
                      <span className="text-[9px] text-muted-foreground truncate">
                        {topic.roadmapTitle}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/roadmap/${topic.roadmapId}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Open roadmap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleStart(topic.topicId)}
                      disabled={isStarting}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                      }}
                    >
                      Start
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
