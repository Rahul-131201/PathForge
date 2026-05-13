"use client";

import { useEffect, useRef } from "react";

// ── Connected-Node Roadmap Graph ───────────────────────────────────────────
// Nodes represent "skills/milestones"; edges represent "learning paths".
// Inspired by knowledge graphs and AI neural maps.
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Node colours — cyan / blue / indigo / violet palette
    const palette = [
      "rgba(56, 189, 248,",   // sky-400
      "rgba(99, 179, 237,",   // blue-300
      "rgba(129, 140, 248,",  // indigo-400
      "rgba(167, 139, 250,",  // violet-400
      "rgba(34, 211, 238,",   // cyan-400
    ];

    const NODE_COUNT = 70;
    const CONNECT_DIST = 160;
    const MOUSE_REPEL = 120;
    const MAX_LINKS = 3; // max edges per node (keeps it sparse & elegant)

    type Node = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      color: string;
      alpha: number;
      pulse: number;     // phase offset for pulsing hubs
      isHub: boolean;
    };

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => {
      const isHub = Math.random() < 0.18;
      const colorBase = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: isHub ? Math.random() * 2.5 + 2.5 : Math.random() * 1.5 + 0.8,
        color: colorBase,
        alpha: isHub ? 0.92 : Math.random() * 0.45 + 0.35,
        pulse: Math.random() * Math.PI * 2,
        isHub,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      // Update positions
      for (const n of nodes) {
        // Gentle mouse repulsion
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL && dist > 0) {
          const force = (MOUSE_REPEL - dist) / MOUSE_REPEL * 0.6;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }

        // Damping
        n.vx *= 0.99;
        n.vy *= 0.99;

        n.x += n.vx;
        n.y += n.vy;

        // Wrap edges
        if (n.x < -20) n.x = canvas.width + 20;
        if (n.x > canvas.width + 20) n.x = -20;
        if (n.y < -20) n.y = canvas.height + 20;
        if (n.y > canvas.height + 20) n.y = -20;
      }

      // Center-fade: particles near the horizontal center (text column) are faint,
      // particles near the edges are fully visible.
      const cw = canvas.width;
      const centerFade = (x: number) => {
        const t = Math.abs(x - cw / 2) / (cw / 2); // 0 = center, 1 = edge
        return 0.12 + 0.88 * Math.pow(t, 0.65);
      };

      // Draw edges — only MAX_LINKS closest neighbours per node
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // Find nearest neighbours
        const neighbours: { j: number; dist: number }[] = [];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) neighbours.push({ j, dist: d });
        }
        neighbours.sort((x, y) => x.dist - y.dist);
        const links = neighbours.slice(0, MAX_LINKS);

        for (const { j, dist } of links) {
          const b = nodes[j];
          const midX = (a.x + b.x) / 2;
          const fade = centerFade(midX);
          const opacity = (1 - dist / CONNECT_DIST) * 0.55 * fade;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `${a.color}${opacity})`);
          grad.addColorStop(1, `${b.color}${opacity})`);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const n of nodes) {
        let r = n.r;
        let alpha = n.alpha;
        const fade = centerFade(n.x);

        if (n.isHub) {
          // Pulsing glow ring on hub nodes
          const pulse = 1 + Math.sin(t * 1.8 + n.pulse) * 0.35;
          r = n.r * pulse;
          alpha = n.alpha * (0.8 + Math.sin(t * 1.8 + n.pulse) * 0.2) * fade;

          // Outer glow
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.5);
          glow.addColorStop(0, `${n.color}${alpha * 0.45})`);
          glow.addColorStop(1, `${n.color}0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}${alpha * (n.isHub ? 1 : fade)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ pointerEvents: "none", zIndex: 0, width: "100vw", height: "100vh" }}
    />
  );
}

export default function LandingBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900">
      {/* Particle layer — fixed so it covers the full page on scroll */}
      <ParticleCanvas />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: 1 }}>
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/25 blur-[140px]" />
        <div className="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/2 h-80 w-80 rounded-full bg-blue-500/15 blur-[120px]" />
      </div>

      {/* Glass frost overlay */}
      <div
        className="pointer-events-none fixed inset-0 bg-white/[0.015] backdrop-blur-[1px]"
        style={{ zIndex: 2 }}
      />

      {/* Page content */}
      <div className="relative" style={{ zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
}
