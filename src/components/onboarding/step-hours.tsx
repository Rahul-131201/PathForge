"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HourOption {
  value: string;
  label: string;
  description: string;
  fillPercent: number;
}

const hourOptions: HourOption[] = [
  { value: "2", label: "2 hrs / week", description: "Light commitment — weekends only", fillPercent: 10 },
  { value: "5", label: "5 hrs / week", description: "Casual pace — a bit each day", fillPercent: 25 },
  { value: "10", label: "10 hrs / week", description: "Steady progress — daily practice", fillPercent: 50 },
  { value: "15", label: "15 hrs / week", description: "Intensive — evening deep-dives", fillPercent: 75 },
  { value: "20", label: "20+ hrs / week", description: "Full focus — full-time learning", fillPercent: 100 },
];

interface ClockIconProps {
  fillPercent: number;
  isSelected: boolean;
}

function ClockFillIcon({ fillPercent, isSelected }: ClockIconProps) {
  // Arc fill in the clock — SVG circle-based representation
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (fillPercent / 100) * circumference;

  return (
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-10 h-10 -rotate-90" fill="none">
        {/* Background circle */}
        <circle cx="12" cy="12" r={radius} strokeWidth="2" className="stroke-white/10" fill="none" />
        {/* Animated fill arc */}
        <motion.circle
          cx="12"
          cy="12"
          r={radius}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className={isSelected ? "stroke-primary" : "stroke-primary/40"}
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          initial={{ strokeDashoffset: circumference }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      {/* Clock icon overlay */}
      <Clock
        className={cn(
          "absolute w-4 h-4 rotate-90 transition-colors duration-200",
          isSelected ? "text-primary" : "text-muted-foreground"
        )}
      />
    </div>
  );
}

interface StepHoursProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StepHours({ value, onChange }: StepHoursProps) {
  return (
    <div className="space-y-2.5">
      {hourOptions.map((option, i) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
              isSelected
                ? "border-primary/50 bg-primary/8 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
            )}
          >
            <ClockFillIcon fillPercent={option.fillPercent} isSelected={isSelected} />

            <div className="flex-1">
              <div className="font-semibold text-sm">{option.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{option.description}</div>
            </div>

            {/* Fill bar showing relative commitment */}
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden shrink-0">
              <motion.div
                className={cn("h-full rounded-full", isSelected ? "bg-primary" : "bg-primary/30")}
                animate={{ width: `${option.fillPercent}%` }}
                initial={{ width: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 + 0.2 }}
              />
            </div>

            {/* Selected dot */}
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200",
                isSelected ? "border-primary bg-primary" : "border-white/20"
              )}
            >
              {isSelected && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
