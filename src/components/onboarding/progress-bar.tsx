"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuizProgressBarProps {
  current: number;
  total: number;
  labels?: string[];
}

export default function QuizProgressBar({ current, total, labels }: QuizProgressBarProps) {
  const percentage = (current / (total - 1)) * 100;

  return (
    <div className="w-full space-y-3">
      {/* Gradient fill bar */}
      <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #6366f1, #22d3ee, #a855f7)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between">
        {Array.from({ length: total }).map((_, i) => {
          const isCompleted = i < current;
          const isCurrent = i === current;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={
                  isCompleted
                    ? { scale: [1, 1.4, 1], backgroundColor: "#6366f1" }
                    : isCurrent
                    ? { scale: 1, backgroundColor: "#6366f1" }
                    : { scale: 1, backgroundColor: "rgba(255,255,255,0.1)" }
                }
                transition={
                  isCompleted
                    ? { duration: 0.4, times: [0, 0.5, 1], type: "tween", ease: "easeInOut" }
                    : { duration: 0.3 }
                }
                className={cn(
                  "relative flex items-center justify-center rounded-full",
                  isCurrent ? "w-3 h-3" : "w-2.5 h-2.5"
                )}
              >
                {/* Pulsing ring on current dot */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                {/* Check mark for completed */}
                {isCompleted && (
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="w-1.5 h-1.5 text-white"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <motion.path
                      d="M2 5 L4 7 L8 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </motion.div>
              {labels && (
                <span
                  className={cn(
                    "text-[9px] font-medium hidden sm:block transition-colors",
                    isCurrent ? "text-primary" : isCompleted ? "text-primary/60" : "text-muted-foreground/40"
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

