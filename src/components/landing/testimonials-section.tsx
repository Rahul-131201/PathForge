"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import TiltCard from "./tilt-card";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Junior Frontend Developer",
    company: "Shopify",
    avatar: "SC",
    color: "from-violet-500 to-indigo-500",
    rating: 5,
    quote:
      "PathForge gave me the exact roadmap I needed to land my first dev job. I spent 3 months following the React path and got hired. The AI didn't just dump a list — it sequenced everything perfectly.",
  },
  {
    name: "Marcus Rivera",
    role: "ML Engineer",
    company: "Anthropic",
    avatar: "MR",
    color: "from-cyan-500 to-blue-500",
    rating: 5,
    quote:
      "I tried 4 other platforms before PathForge. None of them understood that I only had 10 hours a week. PathForge's pacing system is the real killer feature — everything fits my schedule.",
  },
  {
    name: "Priya Nair",
    role: "Backend Engineer",
    company: "Stripe",
    avatar: "PN",
    color: "from-pink-500 to-fuchsia-500",
    rating: 5,
    quote:
      "The free resource curation is unreal. Every topic had the best YouTube tutorial, docs link, and project idea. It saved me hours of research every single week.",
  },
  {
    name: "James Okafor",
    role: "DevOps Lead",
    company: "HashiCorp",
    avatar: "JO",
    color: "from-emerald-500 to-teal-500",
    rating: 5,
    quote:
      "I used PathForge to upskill my entire team in Kubernetes. We created a shared roadmap and tracked progress together. The community paths feature is a hidden gem.",
  },
  {
    name: "Lena Schmidt",
    role: "Product Designer → Engineer",
    company: "Linear",
    avatar: "LS",
    color: "from-orange-500 to-amber-500",
    rating: 5,
    quote:
      "Switching from design to engineering felt impossible until PathForge broke it into 12-week milestones. I finished in 14 weeks and I'm now shipping code at my dream company.",
  },
  {
    name: "Alex Torres",
    role: "Freelance Full-Stack Dev",
    company: "Self-employed",
    avatar: "AT",
    color: "from-rose-500 to-pink-500",
    rating: 5,
    quote:
      "The progress dashboard keeps me honest. Seeing the streak counter and milestone completions every day is genuinely motivating. I've shipped 3 client projects using paths I built here.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({
  t,
  index,
}: {
  t: (typeof testimonials)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <TiltCard className="relative h-full rounded-2xl border p-6 backdrop-blur-xl landing-card-sm">
        {/* Quote icon */}
        <div className="mb-4 flex items-start justify-between">
          <StarRating count={t.rating} />
          <Quote className="h-6 w-6 opacity-20 text-foreground" />
        </div>

        {/* Quote text */}
        <p className="mb-6 text-sm leading-relaxed landing-text-body">
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${t.color} text-sm font-bold text-white shadow-lg`}
          >
            {t.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="truncate text-xs landing-text-muted">
              {t.role} · {t.company}
            </p>
          </div>
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/4 via-transparent to-cyan-500/4 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </TiltCard>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.6 });

  return (
    <section id="testimonials" className="relative py-32 scroll-mt-20">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/6 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-100 w-125 rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-500">
            Real results
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl text-foreground">
            Learners who{" "}
            <span className="gradient-text">forged their path</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base landing-text-muted">
            Join thousands who went from confused to career-ready using PathForge.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex flex-wrap justify-center gap-8 rounded-2xl border px-8 py-6 landing-card"
        >
          {[
            { stat: "4.9/5", label: "Average rating" },
            { stat: "10,000+", label: "Active learners" },
            { stat: "92%", label: "Completion rate" },
            { stat: "6 months", label: "Avg. time to hire" },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black gradient-text">{stat}</div>
              <div className="mt-0.5 text-xs uppercase tracking-wider landing-text-muted">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
