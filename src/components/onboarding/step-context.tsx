"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAR_LIMIT = 500;
const WARN_AT = 400;

interface StepContextProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  isLoading: boolean;
}

export default function StepContext({
  value,
  onChange,
  onSubmit,
  onSkip,
  isLoading,
}: StepContextProps) {
  const remaining = CHAR_LIMIT - value.length;
  const isOverWarning = value.length >= WARN_AT;
  const isAtLimit = value.length >= CHAR_LIMIT;

  return (
    <div className="space-y-5">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, CHAR_LIMIT))}
          placeholder="e.g. I want to learn React to build a SaaS product. I already know HTML/CSS and some JavaScript..."
          rows={5}
          className={cn(
            "w-full resize-none rounded-2xl border px-4 py-3.5 text-sm transition-all duration-200",
            "bg-white/[0.04] backdrop-blur-sm text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60",
            "border-white/10 hover:border-white/20 leading-relaxed"
          )}
          disabled={isLoading}
        />
        {/* Char counter */}
        <div
          className={cn(
            "absolute bottom-3 right-4 text-[10px] tabular-nums transition-colors duration-200",
            isAtLimit
              ? "text-red-400"
              : isOverWarning
              ? "text-amber-400"
              : "text-muted-foreground/40"
          )}
        >
          {remaining}
        </div>
      </div>

      {/* Hint text */}
      <p className="text-xs text-center text-muted-foreground/60">
        Share your background, specific goals, or anything that helps us personalise your roadmap.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {/* Skip */}
        <motion.button
          onClick={onSkip}
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "flex-1 h-12 rounded-xl border border-white/10 text-sm text-muted-foreground",
            "hover:border-white/20 hover:text-foreground transition-all duration-200 disabled:opacity-50"
          )}
        >
          Skip for now
        </motion.button>

        {/* Generate — shimmer gradient button */}
        <motion.button
          onClick={onSubmit}
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : undefined}
          whileTap={!isLoading ? { scale: 0.98 } : undefined}
          className={cn(
            "flex-[2] h-12 rounded-xl text-sm font-semibold text-white relative overflow-hidden",
            "transition-all duration-200 disabled:cursor-not-allowed",
            isLoading ? "opacity-80" : "hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          )}
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)",
          }}
        >
          {/* Shimmer overlay */}
          {!isLoading && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            />
          )}

          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate My Roadmap
              </>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
