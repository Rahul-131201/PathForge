"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOP_GOALS } from "@/server/ai/constants";

const POPULAR_GOALS = TOP_GOALS.slice(0, 12);

interface StepGoalProps {
  value: string;
  onChange: (value: string) => void;
}

const pillVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
  }),
};

export default function StepGoal({ value, onChange }: StepGoalProps) {
  const [query, setQuery] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 1
    ? TOP_GOALS.filter((g) => g.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    onChange(val);
    setShowDropdown(val.length > 1);
  };

  const handleSelect = (goal: string) => {
    setQuery(goal);
    onChange(goal);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query.length > 1 && setShowDropdown(true)}
            placeholder="e.g. Learn React, Master Python, Data Science..."
            className={cn(
              "w-full h-14 pl-12 pr-12 rounded-2xl border text-base transition-all duration-200",
              "bg-white/[0.04] backdrop-blur-sm text-foreground placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60",
              query
                ? "border-primary/40 bg-primary/[0.04]"
                : "border-white/10 hover:border-white/20"
            )}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        <AnimatePresence>
          {showDropdown && filtered.length > 0 && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#0c0c20]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {filtered.map((goal, i) => (
                <motion.button
                  key={goal}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleSelect(goal)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                >
                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>{goal}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-muted-foreground/60 px-1">or choose a popular goal</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Popular goal pills */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial="hidden"
        animate="visible"
      >
        {POPULAR_GOALS.map((goal, i) => {
          const isActive = value === goal;
          return (
            <motion.button
              key={goal}
              custom={i}
              variants={pillVariants}
              onClick={() => handleSelect(goal)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                isActive
                  ? "border-primary bg-primary/15 text-primary shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                  : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-white/7"
              )}
            >
              {goal}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
