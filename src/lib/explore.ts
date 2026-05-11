export const EXPLORE_CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "programming", label: "Programming" },
  { value: "data-science", label: "Data Science" },
  { value: "design", label: "Design" },
  { value: "devops", label: "Devops" },
  { value: "ai-ml", label: "AI/ML" },
  { value: "mobile-dev", label: "Mobile Dev" },
  { value: "career-skills", label: "Career Skills" },
] as const;

export type ExploreCategory = (typeof EXPLORE_CATEGORY_OPTIONS)[number]["value"];

export const EXPLORE_SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "complete", label: "Most Complete" },
] as const;

export type ExploreSort = (typeof EXPLORE_SORT_OPTIONS)[number]["value"];

export type ExploreRoadmapItem = {
  id: string;
  title: string;
  description: string | null;
  goal: string;
  creatorName: string | null;
  creatorImage: string | null;
  topicsCount: number;
  estimatedTotalHours: number | null;
  timesCloned: number;
  skillLevel: "beginner" | "intermediate" | "advanced";
  category: ExploreCategory;
  createdAtIso: string;
};

export type ExploreSearchParamsInput = {
  q?: string | string[];
  category?: string | string[];
  sort?: string | string[];
  page?: string | string[];
  cursor?: string | string[];
};

export type ExploreSearchParams = {
  q: string;
  category: ExploreCategory;
  sort: ExploreSort;
  page: number;
  cursor?: string;
};

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function normalizeCategory(raw: string | undefined): ExploreCategory {
  const value = (raw ?? "all").toLowerCase().trim();
  const found = EXPLORE_CATEGORY_OPTIONS.find((option) => option.value === value);
  return found?.value ?? "all";
}

export function normalizeSort(raw: string | undefined): ExploreSort {
  const value = (raw ?? "popular").toLowerCase().trim();
  const found = EXPLORE_SORT_OPTIONS.find((option) => option.value === value);
  return found?.value ?? "popular";
}

export function normalizeSearchParams(input: ExploreSearchParamsInput): ExploreSearchParams {
  const rawQ = getSingleParam(input.q) ?? "";
  const q = rawQ.trim().slice(0, 120);

  const rawCategory = getSingleParam(input.category);
  const category = normalizeCategory(rawCategory);

  const rawSort = getSingleParam(input.sort);
  const sort = normalizeSort(rawSort);

  const rawPage = getSingleParam(input.page);
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const rawCursor = getSingleParam(input.cursor);
  const cursor = rawCursor?.trim() ? rawCursor.trim() : undefined;

  return { q, category, sort, page, cursor };
}
