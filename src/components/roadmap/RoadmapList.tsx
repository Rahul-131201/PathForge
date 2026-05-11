"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  Zap,
  SkipForward,
  Clock,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapViewData, PhaseData, TopicData } from "./roadmap-viewer-client";

interface Props {
  roadmap: RoadmapViewData;
  progressMap: Record<string, string>;
  selectedTopicId: string | null;
  onSelectTopic: (id: string | null) => void;
  onUpdateStatus: (topicId: string, status: string) => void;
}

// ── Status icon ───────────────────────────────────────────────────────────────

function StatusIcon({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  if (status === "completed") return <CheckCircle2 className={cn(cls, "text-green-400")} />;
  if (status === "in_progress") return <Zap className={cn(cls, "text-indigo-400")} />;
  if (status === "skipped") return <SkipForward className={cn(cls, "text-slate-500")} />;
  return <Circle className={cn(cls, "text-muted-foreground/60")} />;
}

// ── Difficulty color ──────────────────────────────────────────────────────────

const DIFF_COLOR: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

// ── Phase section ─────────────────────────────────────────────────────────────

function PhaseSection({
  phase,
  progressMap,
  selectedTopicId,
  onSelectTopic,
  onUpdateStatus,
}: {
  phase: PhaseData;
  progressMap: Record<string, string>;
  selectedTopicId: string | null;
  onSelectTopic: (id: string | null) => void;
  onUpdateStatus: (topicId: string, status: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const completedCount = phase.topics.filter(
    (t) => progressMap[t.id] === "completed"
  ).length;
  const pct =
    phase.topics.length > 0
      ? Math.round((completedCount / phase.topics.length) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-border/40 overflow-hidden">
      {/* Phase header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.025] transition-colors"
      >
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0",
            !open && "-rotate-90"
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-sm">{phase.title}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {completedCount}/{phase.topics.length}
            </span>
          </div>
          {/* Phase progress bar */}
          <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #6366f1, #22d3ee)" }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </button>

      {/* Topic rows */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-border/20">
              {phase.topics.map((topic) => {
                const status = progressMap[topic.id] ?? "not_started";
                const isSelected = selectedTopicId === topic.id;

                return (
                  <div
                    key={topic.id}
                    onClick={() =>
                      onSelectTopic(isSelected ? null : topic.id)
                    }
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all",
                      isSelected
                        ? "bg-primary/[0.08] border-l-2 border-l-primary pl-[14px]"
                        : "hover:bg-white/[0.025] border-l-2 border-l-transparent"
                    )}
                  >
                    {/* Status toggle button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const next =
                          status === "completed" ? "not_started" : "completed";
                        onUpdateStatus(topic.id, next);
                      }}
                      className="shrink-0 hover:scale-110 transition-transform"
                    >
                      <StatusIcon status={status} />
                    </button>

                    {/* Title */}
                    <span
                      className={cn(
                        "flex-1 text-sm min-w-0",
                        status === "completed" &&
                          "line-through text-muted-foreground",
                        status === "skipped" && "text-muted-foreground/40"
                      )}
                    >
                      {topic.title}
                    </span>

                    {/* Difficulty */}
                    <span
                      className={cn(
                        "text-[10px] font-medium shrink-0",
                        DIFF_COLOR[topic.difficulty] ?? DIFF_COLOR.medium
                      )}
                    >
                      {topic.difficulty}
                    </span>

                    {/* Hours */}
                    {topic.estimatedHours != null && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {topic.estimatedHours}h
                      </span>
                    )}

                    {/* Resource count */}
                    {topic.resources.length > 0 && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 shrink-0">
                        <BookOpen className="w-2.5 h-2.5" />
                        {topic.resources.length}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────

export default function RoadmapList({
  roadmap,
  progressMap,
  selectedTopicId,
  onSelectTopic,
  onUpdateStatus,
}: Props) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-4 space-y-3 max-w-3xl mx-auto">
        {roadmap.phases.map((phase) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            progressMap={progressMap}
            selectedTopicId={selectedTopicId}
            onSelectTopic={onSelectTopic}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}
