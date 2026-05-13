import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checks = {
      database: !!process.env.DATABASE_URL,
      authSecret: !!process.env.AUTH_SECRET,
      authUrl: !!process.env.AUTH_URL,
      groqApiKey: !!process.env.GROQ_API_KEY,
      googleApiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      nextPublicAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    };

    const hasAiKey = checks.groqApiKey || checks.googleApiKey;
    const isHealthy = Object.values(checks).every(Boolean) && hasAiKey;

    return NextResponse.json(
      {
        status: isHealthy ? "healthy" : "degraded",
        checks,
        message: !hasAiKey ? "Warning: No AI API key is configured" : "All checks passed",
      },
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
