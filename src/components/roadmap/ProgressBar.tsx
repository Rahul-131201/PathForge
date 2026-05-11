"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0–100
  completed: number;
  total: number;
}

const MILESTONES = [25, 50, 75, 100];

export default function ProgressBar({ value, completed, total }: Props) {
  const [displayValue, setDisplayValue] = useState(value);
  const rafRef = useRef<number | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    prevValueRef.current = value;

    if (start === end) return;

    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {completed} / {total} topics completed
        </span>
        <span className="font-semibold tabular-nums">{displayValue}%</span>
      </div>

      <div className="relative h-2 rounded-full bg-muted/50 overflow-visible">
        {/* Bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)",
            backgroundSize: "200% 100%",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Milestone markers */}
        {MILESTONES.map((m) => (
          <div
            key={m}
            className={cn(
              "absolute top-1/2 w-1.5 h-1.5 rounded-full border border-background transition-colors duration-500",
              value >= m ? "bg-white" : "bg-muted-foreground/30"
            )}
            style={{
              left: `${m}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Milestone labels */}
      <div className="relative h-3">
        {MILESTONES.map((m) => (
          <span
            key={m}
            className={cn(
              "absolute text-[9px] font-medium transition-colors duration-500",
              value >= m ? "text-muted-foreground" : "text-muted-foreground/30"
            )}
            style={{
              left: `${m}%`,
              transform: "translateX(-50%)",
            }}
          >
            {m === 100 ? "🎉" : `${m}%`}
          </span>
        ))}
      </div>
    </div>
  );
}
