import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 landing-aurora" />
      <div className="absolute inset-0 landing-particles" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-500">
          Ready to begin?
        </p>
        <h2 className="text-4xl font-bold leading-tight sm:text-6xl text-foreground">
          Start Your Learning Journey <span className="gradient-text">Today</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg landing-text-body">
          Build a personalized path and begin learning with clarity in less than 30 seconds.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="gradient" size="xl" asChild className="landing-shimmer px-10 py-7 text-base">
            <Link href="/signup">
              Get Started — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="mt-5 text-xs landing-text-muted">No credit card · No account required to browse</p>
      </div>
    </section>
  );
}
