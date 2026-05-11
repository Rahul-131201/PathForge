"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-32 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_50%,rgba(168,85,247,0.08),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-4xl mx-auto text-center relative"
      >
        {/* Decorative ring */}
        <div className="absolute -inset-px rounded-3xl border border-white/5" />
        <div className="relative p-12 rounded-3xl glass-strong">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 text-xs font-medium text-primary mb-6">
            <Sparkles className="w-3 h-3" />
            Free to start — no credit card required
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to forge
            <br />
            <span className="gradient-text">your path?</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join thousands of learners who have already mapped their journey to
            mastery with PathForge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="xl" asChild className="group min-w-[200px]">
              <Link href="/signup">
                Create My Roadmap
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild className="min-w-[160px]">
              <Link href="/explore">Browse Examples</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
