"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import RoadmapNodeCard from "./roadmap-node";
import type { RoadmapData, RoadmapNode } from "@/types";
import { cn } from "@/lib/utils";

interface RoadmapCanvasProps {
  roadmap: RoadmapData;
  completedNodes?: Set<string>;
  onNodeClick?: (node: RoadmapNode) => void;
}

export default function RoadmapCanvas({
  roadmap,
  completedNodes = new Set(),
  onNodeClick,
}: RoadmapCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPan = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 1 && e.button !== 2) return;
    setIsPanning(true);
    lastPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - lastPan.current.x,
      y: e.clientY - lastPan.current.y,
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Build SVG edges
  const getNodeCenter = (nodeId: string) => {
    const node = roadmap.nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return { x: node.position.x + 104, y: node.position.y + 50 };
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-border/50 bg-grid">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {[
          { icon: ZoomIn, label: "Zoom in", action: () => setZoom((z) => Math.min(2, z + 0.1)) },
          { icon: ZoomOut, label: "Zoom out", action: () => setZoom((z) => Math.max(0.3, z - 0.1)) },
          { icon: Maximize, label: "Reset view", action: resetView },
        ].map(({ icon: Icon, action, label }, i) => (
          <button
            key={i}
            onClick={action}
            aria-label={label}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Zoom display */}
      <div className="absolute bottom-4 left-4 z-20 text-xs font-mono text-muted-foreground glass px-2 py-1 rounded">
        {Math.round(zoom * 100)}%
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={cn("relative w-full h-full", isPanning && "cursor-grabbing")}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "50% 50%",
            transition: isPanning ? "none" : "transform 0.1s ease-out",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {/* SVG Edges */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="rgba(99,102,241,0.5)" />
              </marker>
            </defs>
            {roadmap.edges.map((edge) => {
              const from = getNodeCenter(edge.source);
              const to = getNodeCenter(edge.target);
              const midY = (from.y + to.y) / 2;
              return (
                <path
                  key={edge.id}
                  d={`M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`}
                  stroke="rgba(99,102,241,0.35)"
                  strokeWidth={1.5}
                  fill="none"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {roadmap.nodes.map((node) => (
            <RoadmapNodeCard
              key={node.id}
              node={node}
              completed={completedNodes.has(node.id)}
              onClick={() => onNodeClick?.(node)}
              style={{
                left: node.position.x,
                top: node.position.y,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
