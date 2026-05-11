"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LearningStyleOption } from "@/types";

interface StyleCard {
  value: LearningStyleOption;
  label: string;
  description: string;
  emoji: string;
}

const styleOptions: StyleCard[] = [
  {
    value: "video",
    label: "Video Courses",
    description: "YouTube, Udemy, structured video lectures",
    emoji: "🎬",
  },
  {
    value: "articles",
    label: "Articles & Blogs",
    description: "Blog posts, tutorials, written guides",
    emoji: "📖",
  },
  {
    value: "hands-on",
    label: "Hands-on Projects",
    description: "Build things, coding challenges, practice",
    emoji: "🔨",
  },
  {
    value: "documentation",
    label: "Documentation",
    description: "Official docs, API references, specs",
    emoji: "📚",
  },
  {
    value: "books",
    label: "Books",
    description: "Technical books, in-depth reading",
    emoji: "📕",
  },
  {
    value: "mixed",
    label: "Mixed Approach",
    description: "A bit of everything — variety is key",
    emoji: "🎨",
  },
];

interface StepStyleProps {
  value: LearningStyleOption[];
  onChange: (value: LearningStyleOption[]) => void;
}

const spring = { type: "spring" as const, stiffness: 500, damping: 15 };

export default function StepStyle({ value, onChange }: StepStyleProps) {
  const toggle = (style: LearningStyleOption) => {
    if (value.includes(style)) {
      onChange(value.filter((s) => s !== style));
    } else {
      onChange([...value, style]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground/70 text-center">Select all that apply — we&apos;ll mix resources accordingly</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {styleOptions.map((option, i) => {
          const isSelected = value.includes(option.value);

          return (
            <motion.button
              key={option.value}
              onClick={() => toggle(option.value)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200",
                isSelected
                  ? "border-primary/50 bg-primary/8 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                  : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
              )}
            >
              {/* Spring checkmark */}
              <div
                className={cn(
                  "absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                  isSelected ? "border-primary bg-primary" : "border-white/20"
                )}
              >
                <motion.svg
                  viewBox="0 0 10 10"
                  className="w-2.5 h-2.5"
                  fill="none"
                  initial={false}
                  animate={isSelected ? "checked" : "unchecked"}
                >
                  <motion.path
                    d="M2 5 L4 7 L8 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      unchecked: { pathLength: 0, opacity: 0 },
                      checked: { pathLength: 1, opacity: 1 },
                    }}
                    transition={spring}
                  />
                </motion.svg>
              </div>

              <span className="text-2xl">{option.emoji}</span>
              <div>
                <div className="text-sm font-semibold">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{option.description}</div>
              </div>

              {/* Selection glow */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "radial-gradient(circle at top left, rgba(99,102,241,0.1), transparent 70%)",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
