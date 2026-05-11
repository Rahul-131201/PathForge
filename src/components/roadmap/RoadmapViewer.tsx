"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { LayoutGrid, List, Target, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

import ProgressBar from "./ProgressBar";
import RoadmapList from "./RoadmapList";
import TopicDetailPanel from "./TopicDetailPanel";
import type { RoadmapViewData, TopicData } from "./roadmap-viewer-client";

// Lazily load the React Flow graph (it's heavyweight)
const RoadmapGraph = dynamic(() => import("./RoadmapGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
      Loading graph…
    </div>
  ),
});

// ── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "graph" | "list";

interface Props {
  roadmap: RoadmapViewData;
  progressMap: Record<string, string>;
  onUpdateStatus: (topicId: string, status: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RoadmapViewer({ roadmap, progressMap, onUpdateStatus }: Props) {
  const [view, setView] = useState<ViewMode>("graph");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Compute progress stats
  const allTopics = useMemo(() => roadmap.phases.flatMap((p) => p.topics), [roadmap]);
  const completedCount = useMemo(
    () => allTopics.filter((t) => progressMap[t.id] === "completed").length,
    [allTopics, progressMap]
  );
  const progressPct = allTopics.length > 0 ? Math.round((completedCount / allTopics.length) * 100) : 0;

  // Find selected topic object
  const selectedTopic: TopicData | null = useMemo(() => {
    if (!selectedTopicId) return null;
    for (const phase of roadmap.phases) {
      const found = phase.topics.find((t) => t.id === selectedTopicId);
      if (found) return found;
    }
    return null;
  }, [selectedTopicId, roadmap]);

  const selectedStatus = selectedTopicId ? (progressMap[selectedTopicId] ?? "not_started") : "";

  const handleSelectTopic = useCallback((id: string | null) => {
    setSelectedTopicId(id);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Top header ───────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 space-y-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{roadmap.title}</h1>
            {roadmap.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {roadmap.description}
              </p>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] shrink-0">
            <button
              onClick={() => setView("graph")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                view === "graph"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Graph
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                view === "list"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 flex-wrap">
          {roadmap.goal && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Target className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate max-w-[200px]">{roadmap.goal}</span>
            </span>
          )}
          {roadmap.estimatedTotalHours != null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {roadmap.estimatedTotalHours}h total
            </span>
          )}
          {roadmap.hoursPerWeek != null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-accent" />
              {roadmap.hoursPerWeek}h/week
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {allTopics.length} topics
          </span>
        </div>

        {/* Progress bar */}
        <ProgressBar
          value={progressPct}
          completed={completedCount}
          total={allTopics.length}
        />
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Graph view */}
        {view === "graph" && (
          <RoadmapGraph
            roadmap={roadmap}
            progressMap={progressMap}
            selectedTopicId={selectedTopicId}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {/* List view */}
        {view === "list" && (
          <RoadmapList
            roadmap={roadmap}
            progressMap={progressMap}
            selectedTopicId={selectedTopicId}
            onSelectTopic={handleSelectTopic}
            onUpdateStatus={onUpdateStatus}
          />
        )}

        {/* Detail panel (slides in from right, on top of content) */}
        <TopicDetailPanel
          topic={selectedTopic}
          status={selectedStatus}
          onClose={() => setSelectedTopicId(null)}
          onUpdateStatus={onUpdateStatus}
        />
      </div>
    </div>
  );
}
