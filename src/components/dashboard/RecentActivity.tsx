"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ActivityItem = {
  topicTitle: string;
  roadmapTitle: string;
  roadmapId: string;
  completedAt: string;
};

// ── Relative time ─────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  items: ActivityItem[];
}

export default function RecentActivity({ items }: Props) {
  return (
    <section>
      <h2 className="text-base font-semibold mb-4">Recent Activity</h2>

      {items.length === 0 ? (
        <div className="glass rounded-xl border border-border/50 p-6 text-center text-sm text-muted-foreground">
          Complete your first topic to see activity here.
        </div>
      ) : (
        <div className="glass rounded-xl border border-border/50 overflow-hidden">
          {items.map((item, i) => (
            <motion.div
              key={`${item.roadmapId}-${item.topicTitle}-${i}`}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex items-start gap-3 px-4 py-3 border-b border-border/30 last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              {/* Timeline dot */}
              <div className="relative flex flex-col items-center shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                </div>
                {i < items.length - 1 && (
                  <div className="w-px flex-1 bg-border/40 mt-1" style={{ minHeight: 16 }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <p className="text-sm font-medium leading-snug truncate">{item.topicTitle}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {item.roadmapTitle}
                </p>
              </div>

              {/* Time */}
              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                {relativeTime(item.completedAt)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
