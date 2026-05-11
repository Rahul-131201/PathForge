"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DifficultyLevel } from "@/types";

interface LevelOption {
  value: DifficultyLevel;
  label: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
  glow: string;
}

const levels: LevelOption[] = [
  {
    value: "beginner",
    label: "Beginner",
    subtitle: "Starting fresh",
    description: "Little to no prior experience. I want to build solid foundations from scratch.",
    emoji: "🌱",
    color: "border-emerald-500/60 bg-emerald-500/8",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.25)]",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    subtitle: "Some experience",
    description: "I know the basics and can build simple things, but I want to level up significantly.",
    emoji: "🚀",
    color: "border-indigo-500/60 bg-indigo-500/8",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.25)]",
  },
  {
    value: "advanced",
    label: "Advanced",
    subtitle: "Already proficient",
    description: "I use this in production. I want to master edge cases, architecture, and best practices.",
    emoji: "⚡",
    color: "border-amber-500/60 bg-amber-500/8",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.25)]",
  },
];

interface TiltCardProps {
  option: LevelOption;
  isSelected: boolean;
  onSelect: () => void;
}

function TiltCard({ option, isSelected, onSelect }: TiltCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ rotateX: -dy * 8, rotateY: dx * 8, scale: 1.02 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <motion.button
      ref={cardRef}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: isSelected ? 1.03 : tilt.scale,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={cn(
        "relative w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer",
        isSelected
          ? `${option.color} ${option.glow}`
          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      )}
    >
      {/* Selection glow ring */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "radial-gradient(ellipse at top left, rgba(99,102,241,0.12), transparent 70%)",
          }}
        />
      )}

      <div className="relative flex items-start gap-4">
        {/* Emoji */}
        <motion.div
          animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
          className="text-3xl leading-none mt-0.5 shrink-0"
        >
          {option.emoji}
        </motion.div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-base">{option.label}</span>
            <span className="text-xs text-muted-foreground">· {option.subtitle}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {option.description}
          </p>
        </div>

        {/* Selected indicator */}
        <div
          className={cn(
            "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200",
            isSelected ? "border-primary bg-primary" : "border-white/20"
          )}
        >
          {isSelected && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              viewBox="0 0 10 10"
              className="w-3 h-3 text-white"
              fill="none"
            >
              <path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          )}
        </div>
      </div>
    </motion.button>
  );
}

interface StepLevelProps {
  value: DifficultyLevel | "";
  onChange: (value: DifficultyLevel) => void;
}

export default function StepLevel({ value, onChange }: StepLevelProps) {
  return (
    <div className="space-y-3">
      {levels.map((option, i) => (
        <motion.div
          key={option.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TiltCard
            option={option}
            isSelected={value === option.value}
            onSelect={() => onChange(option.value)}
          />
        </motion.div>
      ))}
    </div>
  );
}
