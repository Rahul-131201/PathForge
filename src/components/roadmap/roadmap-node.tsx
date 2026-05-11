"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RoadmapNode } from "@/types";

const typeColors: Record<string, { bg: string; border: string; dot: string }> = {
  concept: {
    bg: "bg-brand-primary/10",
    border: "border-brand-primary/30",
    dot: "bg-brand-primary",
  },
  project: {
    bg: "bg-brand-accent/10",
    border: "border-brand-accent/30",
    dot: "bg-brand-accent",
  },
  resource: {
    bg: "bg-brand-secondary/10",
    border: "border-brand-secondary/30",
    dot: "bg-brand-secondary",
  },
  milestone: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    dot: "bg-yellow-500",
  },
};

const levelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

interface RoadmapNodeCardProps {
  node: RoadmapNode;
  completed?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function RoadmapNodeCard({
  node,
  completed = false,
  onClick,
  style,
}: RoadmapNodeCardProps) {
  const colors = typeColors[node.type] || typeColors.concept;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "absolute w-52 p-3 rounded-xl border cursor-pointer transition-shadow duration-200",
        colors.bg,
        colors.border,
        completed && "opacity-60 ring-2 ring-green-500/40",
        onClick && "hover:shadow-xl hover:shadow-black/40"
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className={cn("mt-1 w-2 h-2 rounded-full shrink-0", colors.dot)} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
            {node.type}
          </p>
          <h4 className="text-sm font-semibold leading-snug text-foreground truncate">
            {node.title}
          </h4>
        </div>
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="shrink-0 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
          >
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {node.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{levelLabels[node.level]}</span>
        <span>{node.estimatedHours}h</span>
      </div>
    </motion.div>
  );
}
