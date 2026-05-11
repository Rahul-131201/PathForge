import { z } from "zod";

// ─── Environment Validation Schema ────────────────────────────────────────────

const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1),

  // NextAuth
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),

  // OAuth Providers
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // AI APIs (at least one required)
  GROQ_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),

  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("PathForge"),

  // Sentry (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

// ─── Runtime Validation ───────────────────────────────────────────────────────

function validateEnvironment() {
  try {
    // Parse and validate environment variables
    const env = EnvSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      AUTH_SECRET: process.env.AUTH_SECRET,
      AUTH_URL: process.env.AUTH_URL,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      NODE_ENV: process.env.NODE_ENV,
    });

    // Validate AI API configuration
    if (!env.GROQ_API_KEY && !env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error(
        "At least one AI API key must be configured: GROQ_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY"
      );
    }

    // Validate OAuth providers if in production
    if (env.NODE_ENV === "production") {
      const hasGitHub = env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET;
      const hasGoogle = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET;

      if (!hasGitHub && !hasGoogle) {
        console.warn(
          "[Config] No OAuth providers configured. Users will only be able to use credentials authentication."
        );
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Config] Environment validation passed ✓");
    }

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingEnvs = error.issues.map((err) => err.path.join(".")).join(", ");
      throw new Error(`Invalid or missing environment variables: ${missingEnvs}`);
    }
    throw error;
  }
}

// ─── Singleton Instance ───────────────────────────────────────────────────────

let validatedEnv: z.infer<typeof EnvSchema> | null = null;

export function getEnv() {
  if (!validatedEnv) {
    validatedEnv = validateEnvironment();
  }
  return validatedEnv;
}

// ─── Type Export ──────────────────────────────────────────────────────────────

export type Env = z.infer<typeof EnvSchema>;

// Validate on module load
if (typeof window === "undefined") {
  getEnv();
}
