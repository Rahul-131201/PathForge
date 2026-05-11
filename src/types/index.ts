// ─── Re-export DB / Roadmap types ────────────────────────────────────────────
export type {
  User,
  NewUser,
  Account,
  Session,
  Roadmap,
  NewRoadmap,
  Phase,
  NewPhase,
  Topic,
  NewTopic,
  Resource,
  NewResource,
  UserProgress,
  NewUserProgress,
  SkillLevel,
  Difficulty,
  ResourceType,
  ProgressStatus,
  UserPreferences,
  RoadmapMetadata,
  TopicWithResources,
  TopicWithResourcesAndProgress,
  PhaseWithTopics,
  PhaseWithTopicsAndProgress,
  RoadmapWithPhases,
  RoadmapWithPhasesAndProgress,
  RoadmapCard,
  GenerateRoadmapInput,
  UpdateProgressInput,
} from "./roadmap";

// ─── Onboarding Types ─────────────────────────────────────────────────────────

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type LearningStyleOption =
  | "video"
  | "articles"
  | "hands-on"
  | "documentation"
  | "books"
  | "mixed";

export interface OnboardingAnswers {
  topic: string;
  currentLevel: DifficultyLevel;
  weeklyHours: string; // "2" | "5" | "10" | "15" | "20"
  learningStyles: LearningStyleOption[]; // multi-select
  additionalContext: string; // optional, from step 5
  targetLevel?: DifficultyLevel; // derived from currentLevel
  learningStyle?: "visual" | "reading" | "hands-on" | "mixed"; // derived from learningStyles
  goals?: string[]; // derived from additionalContext
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: "single" | "multi" | "text";
  options?: { label: string; value: string; icon?: string }[];
  field: keyof OnboardingAnswers;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Canvas / Visualization Types ─────────────────────────────────────────────

export interface RoadmapNode {
  id: string;
  type: "concept" | "project" | "resource" | "milestone";
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  position: { x: number; y: number };
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
}

export interface RoadmapData {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

