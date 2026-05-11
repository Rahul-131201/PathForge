"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock3, Copy, Tag } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared";
import { cn } from "@/lib/utils";
import type { ExploreRoadmapItem } from "@/lib/explore";

const DIFFICULTY_STYLES: Record<ExploreRoadmapItem["skillLevel"], string> = {
  beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  advanced: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

function getInitials(name: string | null): string {
  if (!name) return "PF";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatCategory(category: string): string {
  return category
    .replace("-", " ")
    .replace("ai ml", "ai/ml")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

interface ExploreCardProps {
  roadmap: ExploreRoadmapItem;
}

export default function ExploreCard({ roadmap }: ExploreCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Link href={`/explore/${roadmap.id}`} className="group block h-full">
        <GlassCard
          tilt
          className="h-full border-white/10 p-5 transition-all duration-300 group-hover:border-cyan-400/35 group-hover:shadow-[0_0_40px_-16px_rgba(34,211,238,0.55)]"
        >
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan-200">
                {roadmap.title}
              </h3>
              <Badge
                className={cn(
                  "shrink-0 border px-2 py-1 text-[10px] uppercase tracking-wide",
                  DIFFICULTY_STYLES[roadmap.skillLevel]
                )}
              >
                {roadmap.skillLevel}
              </Badge>
            </div>

            <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
              {roadmap.description ?? roadmap.goal}
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2">
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarImage src={roadmap.creatorImage ?? undefined} alt={roadmap.creatorName ?? "Creator"} />
                <AvatarFallback className="bg-white/10 text-[11px]">
                  {getInitials(roadmap.creatorName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground/90">
                  {roadmap.creatorName ?? "PathForge Community"}
                </p>
                <p className="text-[11px] text-muted-foreground">Creator</p>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center">
                <div className="mb-1 flex items-center justify-center gap-1 text-[11px]">
                  <BookOpen className="h-3 w-3" />
                  Topics
                </div>
                <div className="font-semibold text-foreground/90">{roadmap.topicsCount}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center">
                <div className="mb-1 flex items-center justify-center gap-1 text-[11px]">
                  <Clock3 className="h-3 w-3" />
                  Hours
                </div>
                <div className="font-semibold text-foreground/90">{roadmap.estimatedTotalHours ?? "-"}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center">
                <div className="mb-1 flex items-center justify-center gap-1 text-[11px]">
                  <Copy className="h-3 w-3" />
                  Cloned
                </div>
                <div className="font-semibold text-foreground/90">{roadmap.timesCloned}</div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Badge variant="outline" className="border-cyan-400/25 bg-cyan-500/10 text-[10px] text-cyan-200">
                <Tag className="mr-1 h-3 w-3" />
                {formatCategory(roadmap.category)}
              </Badge>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
