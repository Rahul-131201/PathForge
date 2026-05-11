"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  name: string;
  image?: string | null;
}

export default function DashboardHeader({ name, image }: Props) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(168,85,247,0.06) 50%, rgba(5,5,16,0) 100%)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Avatar with glow ring */}
          <div className="relative shrink-0">
            <div
              className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 0 3px rgba(99,102,241,0.25), 0 0 24px rgba(99,102,241,0.2)",
              }}
            >
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  priority
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {firstName[0]?.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{greeting} 👋</p>
            <h1 className="text-xl font-bold">
              Welcome back,{" "}
              <span className="gradient-text">{firstName}</span>
            </h1>
          </div>
        </div>

        {/* New Roadmap button with shimmer */}
        <Button variant="gradient" size="sm" asChild className="group relative overflow-hidden shrink-0">
          <Link href="/onboarding">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <Plus className="w-4 h-4" />
            New Roadmap
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
