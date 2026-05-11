import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-white/5", className)} />
  );
}

function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 flex flex-col gap-3"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <Shimmer className="h-3.5 w-24" />
        <Shimmer className="h-8 w-8 rounded-xl" />
      </div>
      <Shimmer className="h-8 w-16 mt-1" />
      <Shimmer className="h-2.5 w-32" />
    </div>
  );
}

function RoadmapCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 flex flex-col gap-3"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
        </div>
        <Shimmer className="h-6 w-16 rounded-full shrink-0" />
      </div>
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Shimmer className="h-2.5 w-20" />
          <Shimmer className="h-2.5 w-10" />
        </div>
        <div className="h-2 w-full rounded-full bg-white/5">
          <Shimmer className="h-2 w-2/5 rounded-full" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Shimmer className="h-6 w-20 rounded-full" />
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-8"
      aria-label="Loading dashboard…"
      aria-busy="true"
    >
      {/* Welcome header */}
      <div className="space-y-2">
        <Shimmer className="h-7 w-64" />
        <Shimmer className="h-4 w-48" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Roadmaps grid */}
      <div>
        <Shimmer className="h-5 w-36 mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RoadmapCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
