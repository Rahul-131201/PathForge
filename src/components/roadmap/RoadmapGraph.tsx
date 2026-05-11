"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

import { TopicNode, PhaseHeaderNode } from "./TopicNode";
import type { RoadmapViewData } from "./roadmap-viewer-client";

// ── Constants ────────────────────────────────────────────────────────────────

const TOPIC_W = 200;
const TOPIC_H = 72;
const PHASE_W = 220;
const PHASE_H = 44;

// ── Custom node types (stable reference) ─────────────────────────────────────

const nodeTypes = {
  topicNode: TopicNode,
  phaseHeader: PhaseHeaderNode,
};

// ── Dagre layout helper ───────────────────────────────────────────────────────

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 50, marginx: 40, marginy: 40 });

  nodes.forEach((n) => {
    const w = n.id.startsWith("phase-") ? PHASE_W : TOPIC_W;
    const h = n.id.startsWith("phase-") ? PHASE_H : TOPIC_H;
    g.setNode(n.id, { width: w, height: h });
  });

  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    const w = n.id.startsWith("phase-") ? PHASE_W : TOPIC_W;
    const h = n.id.startsWith("phase-") ? PHASE_H : TOPIC_H;
    return {
      ...n,
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
      width: w,
      height: h,
    };
  });
}

// ── Edge style helper ─────────────────────────────────────────────────────────

function edgeStyle(status: "completed" | "in_progress" | "not_started" | "skipped" | "phase") {
  switch (status) {
    case "completed":
      return {
        style: { stroke: "#6366f1", strokeWidth: 2 },
        animated: false,
      };
    case "in_progress":
      return {
        style: { stroke: "#6366f1", strokeWidth: 1.5, strokeDasharray: "5 4" },
        animated: true,
      };
    case "phase":
      return {
        style: { stroke: "rgba(99,102,241,0.35)", strokeWidth: 1 },
        animated: false,
      };
    default:
      return {
        style: { stroke: "rgba(100,116,139,0.25)", strokeWidth: 1, strokeDasharray: "4 4" },
        animated: false,
      };
  }
}

// ── Graph builder ─────────────────────────────────────────────────────────────

function buildGraph(
  roadmap: RoadmapViewData,
  progressMap: Record<string, string>
): { nodes: Node[]; edges: Edge[] } {
  const rawNodes: Node[] = [];
  const edges: Edge[] = [];

  for (const phase of roadmap.phases) {
    const phaseId = `phase-${phase.id}`;

    rawNodes.push({
      id: phaseId,
      type: "phaseHeader",
      data: { label: phase.title, phaseIndex: phase.orderIndex },
      position: { x: 0, y: 0 },
    });

    for (const topic of phase.topics) {
      rawNodes.push({
        id: topic.id,
        type: "topicNode",
        data: {
          label: topic.title,
          status: progressMap[topic.id] ?? "not_started",
          difficulty: topic.difficulty,
          estimatedHours: topic.estimatedHours,
          topicId: topic.id,
        },
        position: { x: 0, y: 0 },
        width: TOPIC_W,
        height: TOPIC_H,
      });
    }

    // Phase header → first topic
    if (phase.topics.length > 0) {
      edges.push({
        id: `e-${phaseId}-${phase.topics[0].id}`,
        source: phaseId,
        target: phase.topics[0].id,
        ...edgeStyle("phase"),
      });
    }

    // Topic → next topic within phase
    for (let i = 0; i < phase.topics.length - 1; i++) {
      const from = phase.topics[i];
      const to = phase.topics[i + 1];
      const status = (progressMap[from.id] ?? "not_started") as
        | "completed"
        | "in_progress"
        | "not_started"
        | "skipped";
      edges.push({
        id: `e-${from.id}-${to.id}`,
        source: from.id,
        target: to.id,
        ...edgeStyle(status),
      });
    }
  }

  // Last topic of phase[i] → phase header of phase[i+1]
  for (let i = 0; i < roadmap.phases.length - 1; i++) {
    const cur = roadmap.phases[i];
    const next = roadmap.phases[i + 1];
    const nextPhaseId = `phase-${next.id}`;

    if (cur.topics.length > 0) {
      const last = cur.topics[cur.topics.length - 1];
      const status = (progressMap[last.id] ?? "not_started") as
        | "completed"
        | "in_progress"
        | "not_started"
        | "skipped";
      edges.push({
        id: `e-${last.id}-${nextPhaseId}`,
        source: last.id,
        target: nextPhaseId,
        ...edgeStyle(status),
      });
    } else {
      const curPhaseId = `phase-${cur.id}`;
      edges.push({
        id: `e-${curPhaseId}-${nextPhaseId}`,
        source: curPhaseId,
        target: nextPhaseId,
        ...edgeStyle("phase"),
      });
    }
  }

  const nodes = applyDagreLayout(rawNodes, edges);
  return { nodes, edges };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  roadmap: RoadmapViewData;
  progressMap: Record<string, string>;
  selectedTopicId: string | null;
  onSelectTopic: (id: string | null) => void;
}

export default function RoadmapGraph({
  roadmap,
  progressMap,
  selectedTopicId,
  onSelectTopic,
}: Props) {
  // Build initial graph
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildGraph(roadmap, progressMap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // only on mount — we update imperatively below
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  // Sync progressMap → node data (without re-running layout)
  const prevProgressMapRef = useRef(progressMap);
  useEffect(() => {
    if (prevProgressMapRef.current === progressMap) return;
    prevProgressMapRef.current = progressMap;

    setNodes((prev) =>
      prev.map((n) => {
        if (n.type !== "topicNode") return n;
        const topicId = (n.data as { topicId: string }).topicId;
        return {
          ...n,
          data: {
            ...n.data,
            status: progressMap[topicId] ?? "not_started",
          },
        };
      })
    );

    // Also update edge styles
    const { edges: newEdges } = buildGraph(roadmap, progressMap);
    setEdges(
      newEdges.map((ne) => {
        return ne;
      })
    );
  }, [progressMap, roadmap, setEdges, setNodes]);

  // Sync selected state
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        selected: n.type === "topicNode" && n.id === selectedTopicId,
      }))
    );
  }, [selectedTopicId, setNodes]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (node.type !== "topicNode") return;
      const topicId = (node.data as { topicId: string }).topicId;
      onSelectTopic(selectedTopicId === topicId ? null : topicId);
    },
    [onSelectTopic, selectedTopicId]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={() => onSelectTopic(null)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        style={{ background: "transparent" }}
      >
        <Background
          color="rgba(99,102,241,0.12)"
          gap={36}
          variant={BackgroundVariant.Dots}
        />

        <Controls
          showInteractive={false}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            backdropFilter: "blur(16px)",
          }}
        />

        <MiniMap
          nodeColor={(n) => {
            const status = (n.data as { status?: string })?.status ?? "not_started";
            const colors: Record<string, string> = {
              completed: "#22c55e",
              in_progress: "#6366f1",
              not_started: "#334155",
              skipped: "#1e293b",
            };
            return colors[status] ?? "#334155";
          }}
          maskColor="rgba(5,5,16,0.65)"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            backdropFilter: "blur(16px)",
          }}
        />
      </ReactFlow>
    </div>
  );
}
