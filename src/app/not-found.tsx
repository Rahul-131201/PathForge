import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { GridBackground } from "@/components/shared";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <GridBackground />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md">
        {/* Large number */}
        <div className="select-none">
          <span className="text-[9rem] font-black leading-none gradient-text opacity-20">
            404
          </span>
        </div>

        {/* Icon */}
        <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
          <Compass className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Lost in the roadmap?</h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get
            you back on track.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="gradient" asChild>
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild className="gap-2 border border-white/10">
            <Link href="/explore">
              <ArrowLeft className="h-4 w-4" />
              Browse Roadmaps
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
