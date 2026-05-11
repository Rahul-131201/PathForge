import type { OnboardingAnswers } from "@/types";

// ─── System Prompt ────────────────────────────────────────────────────────────

export const SYSTEM_PROMPT = `You are an expert learning path architect with 15+ years of experience designing curriculum for online education platforms.

Your task is to generate structured, personalized learning roadmaps in JSON format. These roadmaps are used by learners to progressively master new skills.

Key principles:
1. REALISM: Time estimates must be achievable and account for review/practice
2. PROGRESSION: Topics naturally build on each other with clear prerequisites
3. QUALITY: Resources are high-quality, mostly free, and specifically curated
4. CLARITY: Each topic has a clear outcome - learners know exactly what they'll be able to do
5. STRUCTURE: Organize into 3-5 phases representing major milestones

For resource URLs:
- Prefer official documentation and reputable platforms (MDN, FreeCodeCamp, official docs)
- Always include specific, valid URLs (never placeholder URLs)
- Use HTTPS URLs when available (prefer https:// over http:// for security)
- Mix content types: videos for visual learning, articles for reading, interactive exercises for hands-on
- Verify resources exist and are actively maintained

For time estimates:
- Be conservative; it's better to underestimate than overestimate
- Account for practice and reinforcement
- If a learner has only 5 hours/week, ensure phases can fit that timeline

For difficulty progression:
- Always start with "easy" foundations
- Progress logically to "medium" intermediate concepts
- Reserve "hard" for advanced topics or integration projects
- Ensure difficulty within topics matches their prerequisites`;

// ─── Prompt Builder ───────────────────────────────────────────────────────────

export interface PromptBuilderInput {
  goal: string;
  currentLevel: string;
  targetLevel: string;
  hoursPerWeek: number;
  learningStyle: string;
  additionalContext?: string;
}

export function buildGenerationPrompt(input: PromptBuilderInput): string {
  const { goal, currentLevel, targetLevel, hoursPerWeek, learningStyle, additionalContext } = input;

  return `Generate a detailed learning roadmap for the following:

LEARNER PROFILE:
- Learning Goal: ${goal}
- Current Level: ${currentLevel}
- Target Level: ${targetLevel}
- Time Commitment: ${hoursPerWeek} hours per week
- Learning Style: ${learningStyle}${additionalContext ? `\n- Additional Context: ${additionalContext}` : ""}

ROADMAP STRUCTURE:
Create 3-5 phases, each with 3-6 focused topics. Each phase should represent a clear milestone.

REQUIREMENTS FOR EACH TOPIC:
1. Title: Specific and actionable
2. Description: Clear outcome - what will the learner be able to do after completing this topic?
3. estimatedHours: Realistic time at ${hoursPerWeek} hours/week (1-15 hours per topic)
4. difficulty: "easy", "medium", or "hard" - must progress logically
5. prerequisites: Array of exact topic titles that should be completed first (empty if none)
6. resources: 2-5 high-quality resources with:
   - title: Resource name
   - url: Valid, specific URL (must be HTTPS and real)
   - type: "video", "article", "course", "documentation", "book", or "interactive"
   - isFree: boolean
   - platform: e.g. "YouTube", "MDN", "FreeCodeCamp", "Official Docs", etc.

CRITICAL REQUIREMENTS:
1. All resource URLs must be real, specific, and currently accessible
2. Resources must match the difficulty level and topic
3. Prerequisites must reference exact topic titles from your roadmap
4. estimatedTotalHours should be realistic at ${hoursPerWeek} hours/week commitment
5. Do NOT include generic or placeholder URLs
6. Do NOT reference resources that don't actually exist
7. Prefer free resources, but quality over free
8. Each phase should have 15-50 total hours of content

OUTPUT:
Generate the roadmap as valid JSON matching this exact schema:
{
  "title": "string - Concise roadmap title",
  "description": "string - Brief overview of what the learner will achieve",
  "goal": "string - Specific, measurable learning goal",
  "estimatedTotalHours": number - Total hours at ${hoursPerWeek} hours/week,
  "phases": [
    {
      "title": "string - Phase milestone name",
      "description": "string - What this phase covers",
      "estimatedHours": number - Total hours for this phase,
      "topics": [
        {
          "title": "string - Topic name",
          "description": "string - Learning outcome/what student will be able to do",
          "estimatedHours": number,
          "difficulty": "easy|medium|hard",
          "prerequisites": ["array", "of", "topic", "titles"],
          "resources": [
            {
              "title": "string",
              "url": "string - Must be valid HTTPS URL",
              "type": "video|article|course|documentation|book|interactive",
              "isFree": boolean,
              "platform": "string - Platform name"
            }
          ]
        }
      ]
    }
  ]
}

Generate the complete, valid JSON roadmap now.`;
}

// ─── Quick Generation Prompt (for streaming) ───────────────────────────────────

export function buildStreamingPrompt(input: PromptBuilderInput): string {
  // Same as above but optimized for streaming
  return buildGenerationPrompt(input);
}
