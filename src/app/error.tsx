"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { GridBackground } from "@/components/shared";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your observability platform here
    console.error("[PathForge error]", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <GridBackground />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/15 text-destructive"
        >
          <AlertTriangle className="h-10 w-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. You can try reloading this page or go back to the
            dashboard.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-muted-foreground/60">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Button
            onClick={reset}
            variant="default"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="ghost" asChild className="gap-2 border border-white/10">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
