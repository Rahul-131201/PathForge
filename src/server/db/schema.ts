import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  varchar,
  jsonb,
  boolean,
  integer,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const skillLevelEnum = pgEnum("skill_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "video",
  "article",
  "course",
  "documentation",
  "book",
  "interactive",
]);

export const progressStatusEnum = pgEnum("progress_status", [
  "not_started",
  "in_progress",
  "completed",
  "skipped",
]);

// ─── Jsonb Payload Types ──────────────────────────────────────────────────────

export type UserPreferences = {
  learningStyle?: "visual" | "reading" | "hands-on" | "mixed";
  hoursPerWeek?: number;
  goals?: string[];
  preferredLanguage?: string;
};

export type RoadmapMetadata = {
  quizAnswers?: Record<string, string | string[]>;
  preferences?: UserPreferences;
  generatedAt?: string;
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  image: text("image"),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  passwordHash: text("password_hash"),
  preferences: jsonb("preferences").$type<UserPreferences>(),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── NextAuth Accounts ────────────────────────────────────────────────────────

export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (t) => [index("account_user_id_idx").on(t.userId)]
);

// ─── NextAuth Sessions ────────────────────────────────────────────────────────

export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [index("session_user_id_idx").on(t.userId)]
);

// ─── Roadmaps ─────────────────────────────────────────────────────────────────

export const roadmaps = pgTable(
  "roadmaps",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    goal: varchar("goal", { length: 500 }).notNull(),
    skillLevel: skillLevelEnum("skill_level").notNull(),
    hoursPerWeek: integer("hours_per_week"),
    estimatedTotalHours: integer("estimated_total_hours"),
    isPublic: boolean("is_public").default(false).notNull(),
    isTemplate: boolean("is_template").default(false).notNull(),
    metadata: jsonb("metadata").$type<RoadmapMetadata>(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("roadmap_user_created_idx").on(t.userId, t.createdAt),
    index("roadmap_public_created_idx").on(t.isPublic, t.createdAt),
  ]
);

// ─── Phases ───────────────────────────────────────────────────────────────────

export const phases = pgTable(
  "phases",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    roadmapId: text("roadmap_id")
      .notNull()
      .references(() => roadmaps.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    orderIndex: integer("order_index").notNull(),
    estimatedHours: integer("estimated_hours"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("phase_roadmap_order_idx").on(t.roadmapId, t.orderIndex)]
);

// ─── Topics ───────────────────────────────────────────────────────────────────

export const topics = pgTable(
  "topics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    phaseId: text("phase_id")
      .notNull()
      .references(() => phases.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    orderIndex: integer("order_index").notNull(),
    estimatedHours: integer("estimated_hours"),
    prerequisites: jsonb("prerequisites").$type<string[]>().default([]),
    difficulty: difficultyEnum("difficulty").notNull().default("medium"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("topic_phase_order_idx").on(t.phaseId, t.orderIndex),
    index("topic_difficulty_idx").on(t.difficulty),
  ]
);

// ─── Resources ────────────────────────────────────────────────────────────────

export const resources = pgTable("resources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  topicId: text("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  url: text("url").notNull(),
  type: resourceTypeEnum("type").notNull(),
  isFree: boolean("is_free").default(true).notNull(),
  qualityScore: integer("quality_score"),
  platform: varchar("platform", { length: 100 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── User Progress ────────────────────────────────────────────────────────────

export const userProgress = pgTable(
  "user_progress",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    status: progressStatusEnum("status").notNull().default("not_started"),
    startedAt: timestamp("started_at", { mode: "date" }),
    completedAt: timestamp("completed_at", { mode: "date" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    unique("user_progress_user_topic_unique").on(t.userId, t.topicId),
    index("progress_user_topic_idx").on(t.userId, t.topicId),
    index("progress_user_status_idx").on(t.userId, t.status),
    index("progress_topic_status_idx").on(t.topicId, t.status),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  roadmaps: many(roadmaps),
  progress: many(userProgress),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  user: one(users, { fields: [roadmaps.userId], references: [users.id] }),
  phases: many(phases),
}));

export const phasesRelations = relations(phases, ({ one, many }) => ({
  roadmap: one(roadmaps, { fields: [phases.roadmapId], references: [roadmaps.id] }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  phase: one(phases, { fields: [topics.phaseId], references: [phases.id] }),
  resources: many(resources),
  progress: many(userProgress),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  topic: one(topics, { fields: [resources.topicId], references: [topics.id] }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  topic: one(topics, { fields: [userProgress.topicId], references: [topics.id] }),
}));
