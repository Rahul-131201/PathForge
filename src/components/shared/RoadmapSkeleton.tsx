import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-white/5", className)} />
  );
}

/** Skeleton for a single phase accordion row */
function PhaseRowSkeleton({ topicCount = 3 }: { topicCount?: number }) {
  return (
    <div
      className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden"
      aria-hidden="true"
    >
      {/* Phase header */}
      <div className="flex items-center gap-4 p-4">
        <Shimmer className="h-8 w-8 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Shimmer className="h-4 w-48" />
          <Shimmer className="h-3 w-32" />
        </div>
        <Shimmer className="h-5 w-20 rounded-full shrink-0" />
        <Shimmer className="h-4 w-4 rounded-sm shrink-0" />
      </div>

      {/* Topic rows */}
      <div className="border-t border-white/5 divide-y divide-white/5">
        {Array.from({ length: topicCount }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Shimmer className="h-5 w-5 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <Shimmer className="h-3.5 w-40" />
              <Shimmer className="h-2.5 w-28" />
            </div>
            <Shimmer className="h-6 w-16 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface RoadmapSkeletonProps {
  phases?: number;
}

export default function RoadmapSkeleton({ phases = 4 }: RoadmapSkeletonProps) {
  // Vary topic counts so skeleton looks realistic
  const topicCounts = [4, 3, 5, 3, 4, 3];

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl mx-auto w-full"
      aria-label="Loading roadmap…"
      aria-busy="true"
    >
      {/* Title block */}
      <div className="space-y-3 mb-6">
        <Shimmer className="h-8 w-64" />
        <Shimmer className="h-4 w-96 max-w-full" />
        <div className="flex gap-2 pt-1">
          <Shimmer className="h-6 w-24 rounded-full" />
          <Shimmer className="h-6 w-24 rounded-full" />
          <Shimmer className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 space-y-2">
        <div className="flex justify-between">
          <Shimmer className="h-3 w-28" />
          <Shimmer className="h-3 w-12" />
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/5">
          <Shimmer className="h-2.5 w-1/3 rounded-full" />
        </div>
      </div>

      {/* Phase list */}
      <div className="space-y-3">
        {Array.from({ length: phases }).map((_, i) => (
          <PhaseRowSkeleton key={i} topicCount={topicCounts[i % topicCounts.length]} />
        ))}
      </div>
    </div>
  );
}
