"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { RoadmapViewData, TopicData } from "./roadmap-viewer-client";

interface Props {
  roadmap: RoadmapViewData;
  progressMap: Record<string, string>;
  onToggleTopic: (topicId: string) => void;
}

const difficultyColor: Record<string, string> = {
  easy: "text-green-400 border-green-500/30 bg-green-500/10",
  medium: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  hard: "text-red-400 border-red-500/30 bg-red-500/10",
};

const resourceTypeIcon: Record<string, string> = {
  video: "🎬",
  article: "📄",
  course: "🎓",
  documentation: "📚",
  book: "📖",
  interactive: "⚡",
};

function TopicCard({
  topic,
  status,
  onToggle,
}: {
  topic: TopicData;
  status: string;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const completed = status === "completed";

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        completed
          ? "border-green-500/30 bg-green-500/5"
          : "border-border/50 bg-white/[0.02] hover:border-border"
      )}
    >
      {/* Topic header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "font-medium text-sm",
                completed && "line-through text-muted-foreground"
              )}
            >
              {topic.title}
            </span>
            <Badge
              className={cn(
                "text-[10px] px-1.5 py-0 border",
                difficultyColor[topic.difficulty] ?? difficultyColor.medium
              )}
            >
              {topic.difficulty}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {topic.estimatedHours && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {topic.estimatedHours}h
            </span>
          )}
          {topic.resources.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {topic.resources.length}
            </span>
          )}
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-border/30 space-y-4">
              {topic.description && (
                <p className="text-sm text-muted-foreground mt-3">
                  {topic.description}
                </p>
              )}

              {/* Prerequisites */}
              {topic.prerequisites && topic.prerequisites.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Prerequisites
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.prerequisites.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {topic.resources.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Resources
                  </p>
                  <div className="space-y-1.5">
                    {topic.resources.map((r) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        <span className="text-base leading-none">
                          {resourceTypeIcon[r.type] ?? "🔗"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {r.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {r.platform && (
                              <span className="text-xs text-muted-foreground">
                                {r.platform}
                              </span>
                            )}
                            {r.isFree && (
                              <Badge className="text-[9px] px-1 py-0 bg-green-500/10 text-green-400 border-green-500/20">
                                Free
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Mark complete button */}
              <Button
                variant={completed ? "outline" : "gradient"}
                size="sm"
                onClick={onToggle}
                className="w-full"
              >
                {completed ? "Mark as Incomplete" : "Mark as Complete"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapViewer({ roadmap, progressMap, onToggleTopic }: Props) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    new Set(roadmap.phases.map((p) => p.id))
  );

  const allTopics = roadmap.phases.flatMap((p) => p.topics);
  const completedCount = allTopics.filter(
    (t) => progressMap[t.id] === "completed"
  ).length;
  const progressPct =
    allTopics.length > 0
      ? Math.round((completedCount / allTopics.length) * 100)
      : 0;

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{roadmap.title}</h1>
            {roadmap.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {roadmap.description}
              </p>
            )}
          </div>
          <Badge
            variant={progressPct === 100 ? "default" : "glass"}
            className={cn(
              progressPct === 100 &&
                "bg-green-500/15 text-green-400 border-green-500/30"
            )}
          >
            {progressPct === 100 ? "✓ Complete" : `${progressPct}%`}
          </Badge>
        </div>

        {/* Goal */}
        {roadmap.goal && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground glass rounded-lg px-3 py-2 border border-border/50">
            <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{roadmap.goal}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          {roadmap.estimatedTotalHours && (
            <Badge variant="glass">
              <Clock className="w-3 h-3" />
              ~{roadmap.estimatedTotalHours}h total
            </Badge>
          )}
          {roadmap.hoursPerWeek && (
            <Badge variant="glass">
              <Zap className="w-3 h-3" />
              {roadmap.hoursPerWeek}h/week
            </Badge>
          )}
          <Badge variant="glass">
            <BookOpen className="w-3 h-3" />
            {allTopics.length} topics
          </Badge>
        </div>

        {/* Overall progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Overall progress</span>
            <span>
              {completedCount} / {allTopics.length} topics
            </span>
          </div>
          <Progress value={progressPct} gradient className="h-2" />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {roadmap.phases.map((phase, phaseIndex) => {
          const phaseTopics = phase.topics;
          const phaseCompleted = phaseTopics.filter(
            (t) => progressMap[t.id] === "completed"
          ).length;
          const isOpen = expandedPhases.has(phase.id);

          return (
            <div
              key={phase.id}
              className="glass rounded-2xl border border-border/50 overflow-hidden"
            >
              {/* Phase header */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => togglePhase(phase.id)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                  {phaseIndex + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{phase.title}</div>
                  {phase.description && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {phase.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {phaseCompleted}/{phaseTopics.length}
                  </span>
                  {phase.estimatedHours && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {phase.estimatedHours}h
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Topics */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2 border-t border-border/30 pt-3">
                      {phaseTopics.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          topic={topic}
                          status={progressMap[topic.id] ?? "not_started"}
                          onToggle={() => onToggleTopic(topic.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
