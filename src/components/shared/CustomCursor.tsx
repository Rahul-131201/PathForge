"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM MATHEMATICAL FUNCTIONS FOR ENTERPRISE-GRADE CURSOR ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Multi-octave Perlin-like noise simulation
 * Creates organic, natural-looking turbulence in the tail
 */
const multiOctaveNoise = (
  t: number,
  x: number,
  y: number,
  octaves: number = 3,
  scale: number = 1
): number => {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    const phase1 = t * frequency * 1.1 + x * 0.02 * frequency;
    const phase2 = t * frequency * 0.8 + y * 0.015 * frequency;
    
    value += amplitude * Math.sin(phase1);
    value += amplitude * Math.cos(phase2);
    maxValue += amplitude * 2;
    
    amplitude *= 0.5;
    frequency *= 2.1;
  }

  return (value / maxValue) * 18 * scale;
};

/**
 * Velocity-adaptive wave function
 * Wave intensity increases with mouse movement speed
 */
const velocityAdaptiveWave = (
  t: number,
  index: number,
  total: number,
  velocity: number,
  amplitude: number = 14
): number => {
  const progress = index / total;
  const velocityInfluence = Math.min(velocity / 20, 1); // Normalize velocity
  
  // Multi-harmonic composition
  const w1 = Math.sin(t * 4.2 + index * 0.35) * amplitude;
  const w2 = Math.sin(t * 2.5 - index * 0.18) * amplitude * 0.65;
  const w3 = Math.cos(t * 1.3 + index * 0.12) * amplitude * 0.35;
  
  const harmonic = w1 + w2 + w3;
  const decay = Math.exp(-progress * 1.3);
  const velocityModifier = 0.5 + velocityInfluence * 0.5;
  
  return harmonic * decay * velocityModifier;
};

/**
 * Hermite cubic interpolation for silky-smooth curves
 */
const hermiteCurve = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number => {
  const t2 = t * t;
  const t3 = t2 * t;

  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  const tangent1 = (p2 - p0) * 0.5;
  const tangent2 = (p3 - p1) * 0.5;

  return h00 * p1 + h10 * tangent1 + h01 * p2 + h11 * tangent2;
};

/**
 * Advanced easing functions for premium feel
 */
const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
const easeInOutQuint = (x: number): number =>
  x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CURSOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [tailSegments, setTailSegments] = useState<
    Array<{ x: number; y: number; opacity: number; width: number }>
  >([]);
  const [dynamicGlow, setDynamicGlow] = useState(0);

  // Position tracking
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Premium spring physics
  const cursorX = useSpring(mouseX, {
    damping: 24,
    stiffness: 950,
    mass: 1.3,
    bounce: 0.15,
  });
  const cursorY = useSpring(mouseY, {
    damping: 24,
    stiffness: 950,
    mass: 1.3,
    bounce: 0.15,
  });

  const haloX = useSpring(mouseX, { damping: 42, stiffness: 140, mass: 1 });
  const haloY = useSpring(mouseY, { damping: 42, stiffness: 140, mass: 1 });

  // Scale animation based on state
  const cursorScale = useTransform([cursorX, cursorY], () => {
    if (clicking) return 0.85;
    if (hovering) return 1.18;
    return 1;
  });

  // Refs for tracking
  const posHistoryRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const velRef = useRef({ x: 0, y: 0, mag: 0 });
  const rafRef = useRef<number | null>(null);
  const lastPosRef = useRef({ x: -200, y: -200 });
  const timeRef = useRef(0);
  const lastVelUpdateRef = useRef(0);

  // Particle system state
  const [particles, setParticles] = useState<Array<{ x: number; y: number; opacity: number }>>([]);

  // Particle animation
  useEffect(() => {
    const updateParticles = () => {
      const newParticles = posHistoryRef.current.map((pos, index) => ({
        x: pos.x + Math.random() * 4 - 2,
        y: pos.y + Math.random() * 4 - 2,
        opacity: Math.max(1 - index / 40, 0),
      }));
      setParticles(newParticles);
    };

    const interval = setInterval(updateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const now = Date.now();

      // Calculate velocity with smoothing
      const dx = clientX - lastPosRef.current.x;
      const dy = clientY - lastPosRef.current.y;
      const magnitude = Math.sqrt(dx * dx + dy * dy);

      if (now - lastVelUpdateRef.current > 16) {
        velRef.current = {
          x: dx,
          y: dy,
          mag: Math.min(magnitude, 60), // Cap for stability
        };
        lastVelUpdateRef.current = now;
        setDynamicGlow(Math.min(magnitude * 0.18, 1));
      }

      mouseX.set(clientX);
      mouseY.set(clientY);
      setVisible(true);

      // Store history
      posHistoryRef.current.push({ x: clientX, y: clientY, time: now });
      if (posHistoryRef.current.length > 40) {
        posHistoryRef.current.shift();
      }

      lastPosRef.current = { x: clientX, y: clientY };
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleHoverElement = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a, button, [role='button'], input, select, textarea, label, [data-cursor-hover]"
        )
      ) {
        setHovering(true);
      }
    };

    const handleOutElement = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a, button, [role='button'], input, select, textarea, label, [data-cursor-hover]"
        )
      ) {
        setHovering(false);
      }
    };

    const handle3DHover = (e: Event) => {
      setHovering((e as CustomEvent<boolean>).detail);
    };

    const animateTail = () => {
      const history = posHistoryRef.current;
      const segments: Array<{ x: number; y: number; opacity: number; width: number }> = [];

      if (history.length > 2) {
        for (let i = 0; i < Math.min(history.length, 10); i++) { // Shorten tail to 10 segments
          const point = history[i];
          segments.push({
            x: point.x,
            y: point.y,
            opacity: 0, // Remove tail visibility
            width: 0, // Remove tail width
          });
        }
      }

      setTailSegments(segments);
      timeRef.current += 0.017;
      rafRef.current = requestAnimationFrame(animateTail);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleHoverElement);
    document.addEventListener("mouseout", handleOutElement);
    document.addEventListener("mousedown", () => setClicking(true));
    document.addEventListener("mouseup", () => setClicking(false));
    window.addEventListener("cursor-3d-hover", handle3DHover);

    rafRef.current = requestAnimationFrame(animateTail);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleHoverElement);
      document.removeEventListener("mouseout", handleOutElement);
      document.removeEventListener("mousedown", () => setClicking(true));
      document.removeEventListener("mouseup", () => setClicking(false));
      window.removeEventListener("cursor-3d-hover", handle3DHover);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  // Build optimized SVG path
  const buildTailPath = (): string => {
    if (tailSegments.length < 2) return "";

    let path = `M ${tailSegments[0].x} ${tailSegments[0].y}`;

    for (let i = 1; i < tailSegments.length; i++) {
      const curr = tailSegments[i];
      const next = tailSegments[Math.min(i + 1, tailSegments.length - 1)];
      const prev = tailSegments[Math.max(i - 1, 0)];

      // Hermite curve for silky smoothness
      const cpX1 = curr.x + (next.x - prev.x) * 0.18;
      const cpY1 = curr.y + (next.y - prev.y) * 0.18;
      const cpX2 = next.x - (next.x - curr.x) * 0.18;
      const cpY2 = next.y - (next.y - curr.y) * 0.18;

      path += ` C ${cpX1} ${cpY1} ${cpX2} ${cpY2} ${next.x} ${next.y}`;
    }

    return path;
  };

  const tailPath = buildTailPath();

  return (
    <>
      {/* TAIL REMOVED - No tail rendering */}

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* MODERN PREMIUM CURSOR DESIGN - Contemporary & Elegant */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <motion.svg
        className="pointer-events-none fixed left-0 top-0 z-9999"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-12px",
          translateY: "-12px",
          scale: cursorScale,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.08, ease: "easeOut" }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <defs>
          {/* Primary gradient - sleek modern colors */}
          <radialGradient id="cursorGrad">
            <stop offset="0%" stopColor="rgb(220, 230, 255)" stopOpacity="1" />
            <stop offset="70%" stopColor="rgb(139, 150, 255)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.8" />
          </radialGradient>

          {/* Soft shadow */}
          <filter id="cursorShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" floodColor="rgb(59, 62, 241)" />
          </filter>

          {/* Glow effect for hover */}
          <filter id="cursorGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer subtle ring */}
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="none"
          stroke="rgb(179, 190, 255)"
          strokeWidth="0.8"
          opacity={0.4}
        />

        {/* Main cursor circle - premium gradient */}
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="url(#cursorGrad)"
          filter={hovering ? "url(#cursorGlow)" : "url(#cursorShadow)"}
          style={{ transition: "filter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />

        {/* Center dot for precision - animated on hover */}
        <motion.circle
          cx="12"
          cy="12"
          r="2.5"
          fill="rgb(240, 245, 255)"
          animate={{
            opacity: hovering ? 0.6 : 1,
            r: hovering ? 3.2 : 2.5,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Animated accent ring on hover */}
        {hovering && (
          <motion.circle
            cx="12"
            cy="12"
            r="9.5"
            fill="none"
            stroke="rgb(220, 230, 255)"
            strokeWidth="1"
            initial={{ opacity: 0, r: 8 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              r: [8, 11, 8],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.svg>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* MODERN HOVER ENHANCEMENT - Elegant Expansion Ring */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {hovering && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-9998 rounded-full"
          style={{
            x: haloX,
            y: haloY,
            translateX: "-50%",
            translateY: "-50%",
            width: "28px",
            height: "28px",
            border: "1.5px solid rgba(139, 150, 255, 0.6)",
            boxShadow: "0 0 12px rgba(139, 150, 255, 0.25)",
          }}
          animate={{
            scale: [1, 1.3, 1.5],
            opacity: [0.8, 0.3, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </>
  );
}
