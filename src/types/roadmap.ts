import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  users,
  accounts,
  sessions,
  roadmaps,
  phases,
  topics,
  resources,
  userProgress,
  UserPreferences,
  RoadmapMetadata,
} from "@/server/db/schema";

// ─── Base Inferred Types ──────────────────────────────────────────────────────

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type Roadmap = InferSelectModel<typeof roadmaps>;
export type NewRoadmap = InferInsertModel<typeof roadmaps>;

export type Phase = InferSelectModel<typeof phases>;
export type NewPhase = InferInsertModel<typeof phases>;

export type Topic = InferSelectModel<typeof topics>;
export type NewTopic = InferInsertModel<typeof topics>;

export type Resource = InferSelectModel<typeof resources>;
export type NewResource = InferInsertModel<typeof resources>;

export type UserProgress = InferSelectModel<typeof userProgress>;
export type NewUserProgress = InferInsertModel<typeof userProgress>;

// ─── Enum Value Types ─────────────────────────────────────────────────────────

export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type Difficulty = "easy" | "medium" | "hard";
export type ResourceType =
  | "video"
  | "article"
  | "course"
  | "documentation"
  | "book"
  | "interactive";
export type ProgressStatus = "not_started" | "in_progress" | "completed" | "skipped";

// ─── Re-export Jsonb Payload Types ────────────────────────────────────────────

export type { UserPreferences, RoadmapMetadata };

// ─── Composite / Nested Types ─────────────────────────────────────────────────

export type TopicWithResources = Topic & {
  resources: Resource[];
};

export type TopicWithResourcesAndProgress = TopicWithResources & {
  progress?: UserProgress | null;
};

export type PhaseWithTopics = Phase & {
  topics: TopicWithResources[];
};

export type PhaseWithTopicsAndProgress = Phase & {
  topics: TopicWithResourcesAndProgress[];
};

export type RoadmapWithPhases = Roadmap & {
  phases: PhaseWithTopics[];
};

export type RoadmapWithPhasesAndProgress = Roadmap & {
  phases: PhaseWithTopicsAndProgress[];
};

// ─── Summary / Card Types ─────────────────────────────────────────────────────

export type RoadmapCard = Pick<
  Roadmap,
  | "id"
  | "title"
  | "description"
  | "goal"
  | "skillLevel"
  | "isPublic"
  | "isTemplate"
  | "estimatedTotalHours"
  | "createdAt"
> & {
  totalTopics: number;
  completedTopics: number;
};

// ─── API Payload Types ────────────────────────────────────────────────────────

export interface GenerateRoadmapInput {
  topic: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  weeklyHours: string;
  learningStyle: "visual" | "reading" | "hands-on" | "mixed";
  goals: string[];
}

export interface UpdateProgressInput {
  topicId: string;
  status: ProgressStatus;
  notes?: string;
}
