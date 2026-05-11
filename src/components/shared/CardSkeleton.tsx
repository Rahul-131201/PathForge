import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  /** Number of text lines to show below the header block */
  lines?: number;
}

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5",
        className
      )}
    />
  );
}

export default function CardSkeleton({ className, lines = 2 }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-white/[0.03] p-5 flex flex-col gap-3",
        className
      )}
      aria-hidden="true"
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <ShimmerBlock className="h-9 w-9 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <ShimmerBlock className="h-3.5 w-3/5" />
          <ShimmerBlock className="h-2.5 w-2/5" />
        </div>
      </div>

      {/* Text lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <ShimmerBlock
            key={i}
            className={cn("h-2.5", i === lines - 1 ? "w-3/4" : "w-full")}
          />
        ))}
      </div>

      {/* Footer bar */}
      <div className="mt-auto flex items-center gap-2 pt-2">
        <ShimmerBlock className="h-6 w-16 rounded-full" />
        <ShimmerBlock className="h-6 w-16 rounded-full" />
        <ShimmerBlock className="ml-auto h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}
