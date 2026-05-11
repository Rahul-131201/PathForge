"use client";

import { useState, useCallback } from "react";
import RoadmapViewer from "./RoadmapViewer";

export type ResourceData = {
  id: string;
  title: string;
  url: string;
  type: string;
  isFree: boolean;
  platform: string | null;
};

export type TopicData = {
  id: string;
  title: string;
  description: string | null;
  estimatedHours: number | null;
  difficulty: string;
  prerequisites: string[] | null;
  resources: ResourceData[];
  progressStatus: string;
};

export type PhaseData = {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  estimatedHours: number | null;
  topics: TopicData[];
};

export type RoadmapViewData = {
  id: string;
  title: string;
  description: string | null;
  goal: string;
  skillLevel: string;
  hoursPerWeek: number | null;
  estimatedTotalHours: number | null;
  phases: PhaseData[];
};

interface Props {
  roadmap: RoadmapViewData;
}

export default function RoadmapViewerClient({ roadmap }: Props) {
  const [progressMap, setProgressMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const phase of roadmap.phases) {
      for (const topic of phase.topics) {
        map[topic.id] = topic.progressStatus;
      }
    }
    return map;
  });

  const handleUpdateStatus = useCallback(
    async (topicId: string, status: string) => {
      const prev = progressMap[topicId] ?? "not_started";

      // Optimistic update
      setProgressMap((m) => ({ ...m, [topicId]: status }));

      try {
        await fetch("/api/roadmap/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId, status }),
        });
      } catch {
        // Revert on failure
        setProgressMap((m) => ({ ...m, [topicId]: prev }));
      }
    },
    [progressMap]
  );

  // Legacy toggle helper (simple not_started ↔ completed cycle)
  const handleToggleTopic = useCallback(
    async (topicId: string) => {
      const current = progressMap[topicId] ?? "not_started";
      const next = current === "completed" ? "not_started" : "completed";
      await handleUpdateStatus(topicId, next);
    },
    [progressMap, handleUpdateStatus]
  );

  return (
    <RoadmapViewer
      roadmap={roadmap}
      progressMap={progressMap}
      onUpdateStatus={handleUpdateStatus}
    />
  );
}

