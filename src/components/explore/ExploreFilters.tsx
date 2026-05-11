"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EXPLORE_CATEGORY_OPTIONS, EXPLORE_SORT_OPTIONS, type ExploreCategory, type ExploreSort } from "@/lib/explore";
import { cn } from "@/lib/utils";

interface ExploreFiltersProps {
  initialCategory: ExploreCategory;
  initialSort: ExploreSort;
}

function updateParamUrl(
  current: URLSearchParams,
  pathname: string,
  key: "category" | "sort",
  value: string
): string {
  const next = new URLSearchParams(current.toString());
  next.set(key, value);
  next.delete("cursor");
  next.set("page", "1");

  return `${pathname}?${next.toString()}`;
}

export default function ExploreFilters({ initialCategory, initialSort }: ExploreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = (searchParams.get("category") as ExploreCategory | null) ?? initialCategory;
  const activeSort = (searchParams.get("sort") as ExploreSort | null) ?? initialSort;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Category</p>
        <div className="flex flex-wrap gap-2">
          {EXPLORE_CATEGORY_OPTIONS.map((option) => {
            const active = option.value === activeCategory;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  router.replace(
                    updateParamUrl(searchParams, pathname, "category", option.value),
                    { scroll: false }
                  )
                }
                className={cn(
                  "relative overflow-hidden rounded-full border px-3 py-1.5 text-xs transition",
                  active
                    ? "border-cyan-300/50 text-cyan-100"
                    : "border-white/15 bg-white/5 text-muted-foreground hover:border-cyan-400/35 hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="category-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-cyan-500/20"
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  />
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Sort By</p>
        <div className="inline-flex rounded-xl border border-border/70 bg-card/70 p-1">
          {EXPLORE_SORT_OPTIONS.map((option) => {
            const active = option.value === activeSort;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  router.replace(updateParamUrl(searchParams, pathname, "sort", option.value), {
                    scroll: false,
                  })
                }
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-xs transition",
                  active ? "text-cyan-100" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sort-active-tab"
                    className="absolute inset-0 -z-10 rounded-lg bg-cyan-500/20"
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  />
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
