"use client";

import type { ReactNode } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends HTMLMotionProps<"button"> {
  className?: string;
  children?: ReactNode;
}

export default function ShimmerButton({ className, children, ...props }: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={cn(
        "shared-shimmer-btn relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 font-semibold text-white",
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_12px_30px_rgba(99,102,241,0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70",
        className
      )}
      {...props}
    >
      <span className="relative z-[1]">{children}</span>
    </motion.button>
  );
}
