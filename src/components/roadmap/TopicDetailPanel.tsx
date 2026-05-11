"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import type { TopicData } from "./roadmap-viewer-client";

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skip" },
] as const;

const RESOURCE_ICON: Record<string, string> = {
  video: "ðŸŽ¬",
  article: "ðŸ“„",
  course: "ðŸŽ“",
  documentation: "ðŸ“š",
  book: "ðŸ“–",
  interactive: "âš¡",
  practice: "ðŸ› ï¸",
  tool: "ðŸ”§",
};

// â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Props {
  topic: TopicData | null;
  status: string;
  onClose: () => void;
  onUpdateStatus: (topicId: string, status: string) => void;
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function TopicDetailPanel({
  topic,
  status,
  onClose,
  onUpdateStatus,
}: Props) {
  const [notes, setNotes] = useState("");

  // Reset notes when topic changes
  useEffect(() => {
    // Clear notes when switching topics
    setNotes("");
  }, [topic?.id]);

  const handleMarkComplete = () => {
    if (!topic || status === "completed") return;
    onUpdateStatus(topic.id, "completed");

    // Canvas confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.85, y: 0.5 },
      colors: ["#6366f1", "#a855f7", "#22d3ee", "#ffffff"],
      scalar: 0.9,
    });
  };

  return (
    <AnimatePresence>
      {topic && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 lg:hidden z-10"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key={`panel-${topic.id}`}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute top-0 right-0 h-full w-[340px] flex flex-col z-20"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderLeft: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="flex items-start gap-3 px-5 py-4 border-b border-white/[0.07]">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-snug">{topic.title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {topic.estimatedHours != null && (
                    <span className="text-[10px] text-muted-foreground">
                      ~{topic.estimatedHours}h
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                      topic.difficulty === "easy" || topic.difficulty === "beginner"
                        ? "bg-green-500/10 text-green-400"
                        : topic.difficulty === "hard" || topic.difficulty === "advanced"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    )}
                  >
                    {topic.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5 p-1 rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* â”€â”€ Scrollable body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Description */}
              {topic.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {topic.description}
                </p>
              )}

              {/* Status selector */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Status
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onUpdateStatus(topic.id, opt.value)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                        status === opt.value
                          ? "border-primary/60 bg-primary/12 text-primary"
                          : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.12] hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              {topic.prerequisites && topic.prerequisites.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Prerequisites
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-2 py-1 rounded-full border border-white/[0.08] text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {topic.resources.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Resources ({topic.resources.length})
                  </p>
                  <div className="space-y-1.5">
                    {topic.resources.map((r) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/[0.06] hover:border-primary/40 hover:bg-primary/[0.05] transition-all group"
                      >
                        <span className="text-base leading-none shrink-0">
                          {RESOURCE_ICON[r.type] ?? "ðŸ”—"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                            {r.title}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {r.platform && (
                              <span className="text-[9px] text-muted-foreground">
                                {r.platform}
                              </span>
                            )}
                            {r.isFree && (
                              <span className="text-[8px] px-1 py-0.5 rounded-sm bg-green-500/10 text-green-400 font-medium">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Notes
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jot down personal notesâ€¦"
                  rows={3}
                  className="w-full text-xs resize-none rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:bg-primary/[0.04] transition-all"
                />
              </div>
            </div>

            {/* â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="px-5 py-4 border-t border-white/[0.07]">
              <button
                onClick={handleMarkComplete}
                disabled={status === "completed"}
                className={cn(
                  "w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                  status === "completed"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                    : "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]"
                )}
              >
                {status === "completed" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Completed!
                  </>
                ) : (
                  "Mark as Complete ðŸŽ‰"
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

