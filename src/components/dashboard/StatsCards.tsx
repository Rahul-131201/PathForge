"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Map, CheckCircle2, Flame, Clock } from "lucide-react";

// ── Count-up hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const timer = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return value;
}

// ── Single stat card ──────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  delay?: number;
}

function StatCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  iconColor,
  iconBg,
  delay = 0,
}: StatCardProps) {
  const displayed = useCountUp(value, 1200, delay * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          <div className="text-3xl font-bold tabular-nums">
            {displayed}
            {suffix && (
              <span className="text-xl ml-0.5 text-muted-foreground">{suffix}</span>
            )}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
          style={{ background: iconBg }}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Stats grid ────────────────────────────────────────────────────────────────

interface Props {
  roadmapCount?: number;
  completedTopics?: number;
  streak?: number;
  totalHours?: number;
}

export default function StatsCards({
  roadmapCount: initialRoadmaps = 0,
  completedTopics: initialTopics = 0,
  streak: initialStreak = 0,
  totalHours: initialHours = 0,
}: Props) {
  const [stats, setStats] = useState({
    roadmapCount: initialRoadmaps,
    completedTopics: initialTopics,
    streak: initialStreak,
    totalHours: initialHours,
  });
  const [loading, setLoading] = useState(false);

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats({
          roadmapCount: data.completedRoadmaps,
          completedTopics: data.totalCompleted,
          streak: data.streak,
          totalHours: data.totalHours,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on mount and set up polling
  useEffect(() => {
    fetchStats();
    
    // Refresh every 3 seconds to show real-time updates
    const interval = setInterval(fetchStats, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Roadmaps"
        value={stats.roadmapCount}
        icon={Map}
        iconColor="text-primary"
        iconBg="rgba(99,102,241,0.12)"
        delay={0}
      />
      <StatCard
        label="Topics Completed"
        value={stats.completedTopics}
        icon={CheckCircle2}
        iconColor="text-green-400"
        iconBg="rgba(34,197,94,0.12)"
        delay={0.1}
      />
      <StatCard
        label="Day Streak"
        value={stats.streak}
        suffix="🔥"
        icon={Flame}
        iconColor="text-orange-400"
        iconBg="rgba(249,115,22,0.12)"
        delay={0.2}
      />
      <StatCard
        label="Hours Learned"
        value={stats.totalHours}
        suffix="h"
        icon={Clock}
        iconColor="text-cyan-400"
        iconBg="rgba(34,211,238,0.12)"
        delay={0.3}
      />
    </div>
  );
}
