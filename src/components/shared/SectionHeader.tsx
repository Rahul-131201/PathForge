"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mx-auto max-w-3xl text-center", className)}
    >
      <div className="inline-flex rounded-full bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-cyan-400/60 p-px">
        <span className="rounded-full bg-[#070916] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200/90">
          {badge}
        </span>
      </div>

      <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>

      {description ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/60">{description}</p>
      ) : null}
    </motion.div>
  );
}
