"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { CheckCircle2, Circle, Zap, SkipForward, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Topic Node ────────────────────────────────────────────────────────────────

export type TopicNodeData = {
  label: string;
  status: string;
  difficulty: string;
  estimatedHours: number | null;
  topicId: string;
};

const STATUS_BORDER: Record<string, string> = {
  not_started: "rgba(100,116,139,0.35)",
  in_progress: "#6366f1",
  completed: "#22c55e",
  skipped: "rgba(100,116,139,0.18)",
};

const STATUS_BG: Record<string, string> = {
  not_started: "rgba(255,255,255,0.025)",
  in_progress: "rgba(99,102,241,0.10)",
  completed: "rgba(34,197,94,0.07)",
  skipped: "rgba(100,116,139,0.04)",
};

const STATUS_GLOW: Record<string, string | undefined> = {
  not_started: undefined,
  in_progress: "0 0 16px rgba(99,102,241,0.35)",
  completed: "0 0 16px rgba(34,197,94,0.3)",
  skipped: undefined,
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "#22c55e",
  medium: "#eab308",
  hard: "#ef4444",
  beginner: "#22c55e",
  intermediate: "#eab308",
  advanced: "#ef4444",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "completed")
    return <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />;
  if (status === "in_progress")
    return <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
  if (status === "skipped")
    return <SkipForward className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
  return <Circle className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />;
}

function TopicNodeComponent({ data, selected }: NodeProps) {
  const d = data as TopicNodeData;
  const border = STATUS_BORDER[d.status] ?? STATUS_BORDER.not_started;
  const bg = STATUS_BG[d.status] ?? STATUS_BG.not_started;
  const glow = STATUS_GLOW[d.status];
  const diffColor =
    DIFFICULTY_COLOR[d.difficulty] ?? DIFFICULTY_COLOR.medium;

  return (
    <div
      className="rounded-xl px-3.5 py-2.5 transition-all duration-200 select-none"
      style={{
        width: 200,
        minHeight: 70,
        background: bg,
        border: `1px solid ${selected ? "#6366f1" : border}`,
        backdropFilter: "blur(12px)",
        boxShadow: selected
          ? "0 0 0 2px rgba(99,102,241,0.5), 0 0 24px rgba(99,102,241,0.25)"
          : glow,
        cursor: "pointer",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: "none" }}
      />

      <div className="flex items-start gap-2">
        <StatusIcon status={d.status} />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-[11px] font-medium leading-snug",
              d.status === "completed" && "line-through text-muted-foreground",
              d.status === "skipped" && "text-muted-foreground/40"
            )}
          >
            {d.label}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{
                color: diffColor,
                background: `${diffColor}1a`,
              }}
            >
              {d.difficulty}
            </span>
            {d.estimatedHours != null && (
              <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {d.estimatedHours}h
              </span>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}

export const TopicNode = memo(TopicNodeComponent);

// ── Phase Header Node ─────────────────────────────────────────────────────────

export type PhaseHeaderData = {
  label: string;
  phaseIndex: number;
};

function PhaseHeaderComponent({ data }: NodeProps) {
  const d = data as PhaseHeaderData;
  return (
    <div
      className="px-5 py-2 rounded-full font-semibold text-xs tracking-wide select-none"
      style={{
        background:
          "linear-gradient(90deg, rgba(99,102,241,0.18), rgba(168,85,247,0.18))",
        border: "1px solid rgba(99,102,241,0.4)",
        color: "#a5b4fc",
        backdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      {d.label}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}

export const PhaseHeaderNode = memo(PhaseHeaderComponent);
