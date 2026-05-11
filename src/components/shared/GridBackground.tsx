import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
}

export default function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 40%, black 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 40%, black 25%, transparent 78%)",
        }}
      />

      <div className="absolute left-[8%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-indigo-500/35 blur-[128px] animate-pulse" />
      <div
        className="absolute right-[10%] top-[52%] h-[18rem] w-[18rem] rounded-full bg-cyan-400/30 blur-[128px] animate-pulse"
        style={{ animationDelay: "900ms" }}
      />
    </div>
  );
}
