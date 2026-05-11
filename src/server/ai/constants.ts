// ─── Common Learning Goals ────────────────────────────────────────────────────

/**
 * Top 50 common learning goals for template caching.
 * When a user's goal matches one of these (fuzzy), we save the generated
 * roadmap as a template for faster future generation.
 */
export const TOP_GOALS = [
  // Web Development
  "Learn React",
  "Learn Vue.js",
  "Learn Angular",
  "Learn Node.js",
  "Learn Next.js",
  "Learn Web Development",
  "Learn Frontend Development",
  "Learn Backend Development",
  "Learn Full Stack Development",
  "Learn HTML and CSS",

  // Programming Languages
  "Learn Python",
  "Learn JavaScript",
  "Learn TypeScript",
  "Learn Java",
  "Learn C++",
  "Learn Go",
  "Learn Rust",
  "Learn PHP",
  "Learn C#",
  "Learn Ruby",

  // Data & AI
  "Learn Machine Learning",
  "Learn Data Science",
  "Learn Deep Learning",
  "Learn TensorFlow",
  "Learn PyTorch",
  "Learn Data Analysis",
  "Learn SQL",
  "Learn Big Data",
  "Learn Natural Language Processing",
  "Learn Computer Vision",

  // DevOps & Cloud
  "Learn Docker",
  "Learn Kubernetes",
  "Learn AWS",
  "Learn Google Cloud Platform",
  "Learn Azure",
  "Learn CI/CD",
  "Learn DevOps",
  "Learn Infrastructure as Code",
  "Learn System Design",

  // Mobile Development
  "Learn React Native",
  "Learn Flutter",
  "Learn iOS Development",
  "Learn Android Development",
  "Learn Mobile Development",
  "Learn GraphQL",
  "Learn REST APIs",
  "Learn Databases",
  "Learn Cybersecurity",
  "Learn Blockchain",
];

/**
 * Fuzzy match a goal against common goals.
 * Returns true if the goal likely matches a common learning path.
 */
export function isCommonGoal(goal: string): boolean {
  const normalized = goal.toLowerCase();
  return TOP_GOALS.some((commonGoal) =>
    normalized.includes(commonGoal.toLowerCase()) ||
    commonGoal.toLowerCase().includes(normalized)
  );
}

/**
 * Find the closest common goal match for a given goal string.
 * Used for template lookup.
 */
export function findClosestCommonGoal(goal: string): string | null {
  const normalized = goal.toLowerCase().trim();

  // Exact match
  const exact = TOP_GOALS.find((g) => g.toLowerCase() === normalized);
  if (exact) return exact;

  // Substring match
  const substring = TOP_GOALS.find(
    (g) =>
      normalized.includes(g.toLowerCase()) || g.toLowerCase().includes(normalized)
  );
  if (substring) return substring;

  return null;
}
