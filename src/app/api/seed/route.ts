import { db } from "@/server/db";
import { users, roadmaps, phases, topics, resources } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const PUBLIC_ROADMAPS = [
  {
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development with HTML, CSS, and JavaScript",
    goal: "Master the foundations of modern web development",
    skillLevel: "beginner" as const,
    hoursPerWeek: 10,
    estimatedTotalHours: 80,
    phases: [
      {
        title: "HTML Basics",
        description: "Learn semantic HTML5 and document structure",
        estimatedHours: 15,
        topics: [
          { title: "HTML Structure", description: "Semantic markup and elements", estimatedHours: 5, difficulty: "easy" as const },
          { title: "Forms & Input", description: "Working with forms and validation", estimatedHours: 5, difficulty: "easy" as const },
          { title: "Accessibility", description: "Making websites accessible", estimatedHours: 5, difficulty: "medium" as const },
        ],
      },
      {
        title: "CSS Styling",
        description: "Master CSS for styling and layout",
        estimatedHours: 20,
        topics: [
          { title: "CSS Fundamentals", description: "Selectors, properties, and values", estimatedHours: 5, difficulty: "easy" as const },
          { title: "Flexbox & Grid", description: "Modern layout techniques", estimatedHours: 10, difficulty: "medium" as const },
          { title: "Responsive Design", description: "Mobile-first responsive design", estimatedHours: 5, difficulty: "medium" as const },
        ],
      },
    ],
  },
  {
    title: "React.js Mastery",
    description: "Complete guide to React.js and modern component-based development",
    goal: "Build production-ready React applications",
    skillLevel: "intermediate" as const,
    hoursPerWeek: 15,
    estimatedTotalHours: 120,
    phases: [
      {
        title: "React Fundamentals",
        description: "Components, JSX, and state management basics",
        estimatedHours: 30,
        topics: [
          { title: "Components & JSX", description: "Functional components and JSX syntax", estimatedHours: 10, difficulty: "easy" as const },
          { title: "Props & State", description: "Managing component data", estimatedHours: 10, difficulty: "medium" as const },
          { title: "Hooks", description: "useState, useEffect, and custom hooks", estimatedHours: 10, difficulty: "medium" as const },
        ],
      },
      {
        title: "Advanced Patterns",
        description: "Context API, error boundaries, and performance optimization",
        estimatedHours: 25,
        topics: [
          { title: "Context API", description: "Global state management", estimatedHours: 8, difficulty: "medium" as const },
          { title: "Performance", description: "Optimization techniques and memoization", estimatedHours: 9, difficulty: "hard" as const },
          { title: "Testing", description: "Unit and integration testing with React", estimatedHours: 8, difficulty: "medium" as const },
        ],
      },
    ],
  },
  {
    title: "Python for Data Science",
    description: "Learn Python programming with focus on data manipulation and analysis",
    goal: "Become proficient in Python for data science projects",
    skillLevel: "beginner" as const,
    hoursPerWeek: 12,
    estimatedTotalHours: 100,
    phases: [
      {
        title: "Python Basics",
        description: "Core Python programming concepts",
        estimatedHours: 25,
        topics: [
          { title: "Syntax & Types", description: "Variables, data types, and operations", estimatedHours: 8, difficulty: "easy" as const },
          { title: "Control Flow", description: "Loops, conditionals, and functions", estimatedHours: 9, difficulty: "easy" as const },
          { title: "Object-Oriented Programming", description: "Classes and inheritance", estimatedHours: 8, difficulty: "medium" as const },
        ],
      },
      {
        title: "Data Analysis",
        description: "NumPy, Pandas, and data visualization",
        estimatedHours: 25,
        topics: [
          { title: "NumPy", description: "Numerical computing with NumPy", estimatedHours: 8, difficulty: "medium" as const },
          { title: "Pandas", description: "Data manipulation and analysis", estimatedHours: 10, difficulty: "medium" as const },
          { title: "Matplotlib & Seaborn", description: "Data visualization", estimatedHours: 7, difficulty: "medium" as const },
        ],
      },
    ],
  },
  {
    title: "TypeScript Advanced",
    description: "Master TypeScript for building scalable applications",
    goal: "Write type-safe and maintainable code",
    skillLevel: "advanced" as const,
    hoursPerWeek: 10,
    estimatedTotalHours: 90,
    phases: [
      {
        title: "Type System Mastery",
        description: "Advanced TypeScript types and generics",
        estimatedHours: 30,
        topics: [
          { title: "Advanced Types", description: "Union, intersection, and conditional types", estimatedHours: 10, difficulty: "hard" as const },
          { title: "Generics", description: "Generic functions, classes, and constraints", estimatedHours: 10, difficulty: "hard" as const },
          { title: "Decorators", description: "Using and creating decorators", estimatedHours: 10, difficulty: "hard" as const },
        ],
      },
    ],
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning concepts and algorithms",
    goal: "Understand ML algorithms and build your first models",
    skillLevel: "intermediate" as const,
    hoursPerWeek: 15,
    estimatedTotalHours: 110,
    phases: [
      {
        title: "ML Basics",
        description: "Core machine learning concepts",
        estimatedHours: 30,
        topics: [
          { title: "Supervised Learning", description: "Regression and classification", estimatedHours: 12, difficulty: "medium" as const },
          { title: "Unsupervised Learning", description: "Clustering and dimensionality reduction", estimatedHours: 10, difficulty: "medium" as const },
          { title: "Evaluation Metrics", description: "Measuring model performance", estimatedHours: 8, difficulty: "medium" as const },
        ],
      },
    ],
  },
  {
    title: "Docker & Kubernetes",
    description: "Containerization and orchestration for modern applications",
    goal: "Master containerized deployments",
    skillLevel: "advanced" as const,
    hoursPerWeek: 12,
    estimatedTotalHours: 95,
    phases: [
      {
        title: "Docker Essentials",
        description: "Building and managing Docker containers",
        estimatedHours: 25,
        topics: [
          { title: "Docker Basics", description: "Images, containers, and Dockerfile", estimatedHours: 10, difficulty: "medium" as const },
          { title: "Docker Networking", description: "Container communication", estimatedHours: 8, difficulty: "medium" as const },
          { title: "Docker Compose", description: "Multi-container applications", estimatedHours: 7, difficulty: "medium" as const },
        ],
      },
    ],
  },
  {
    title: "Vue.js Complete Guide",
    description: "Learn Vue.js for building interactive web applications",
    goal: "Build full-featured Vue.js applications",
    skillLevel: "intermediate" as const,
    hoursPerWeek: 10,
    estimatedTotalHours: 85,
    phases: [
      {
        title: "Vue Fundamentals",
        description: "Components and reactive data",
        estimatedHours: 25,
        topics: [
          { title: "Templates & Directives", description: "Vue template syntax", estimatedHours: 8, difficulty: "easy" as const },
          { title: "Component Composition", description: "Building reusable components", estimatedHours: 10, difficulty: "medium" as const },
          { title: "State Management", description: "Vuex and Pinia", estimatedHours: 7, difficulty: "medium" as const },
        ],
      },
    ],
  },
  {
    title: "AWS Cloud Computing",
    description: "Complete guide to Amazon Web Services and cloud architecture",
    goal: "Deploy and manage applications on AWS",
    skillLevel: "intermediate" as const,
    hoursPerWeek: 12,
    estimatedTotalHours: 100,
    phases: [
      {
        title: "AWS Core Services",
        description: "EC2, S3, RDS, and more",
        estimatedHours: 35,
        topics: [
          { title: "EC2 & Instances", description: "Compute resources", estimatedHours: 12, difficulty: "medium" as const },
          { title: "Storage Solutions", description: "S3 and database services", estimatedHours: 12, difficulty: "medium" as const },
          { title: "Networking", description: "VPC and security groups", estimatedHours: 11, difficulty: "medium" as const },
        ],
      },
    ],
  },
  {
    title: "GraphQL API Development",
    description: "Build modern GraphQL APIs with Apollo and other frameworks",
    goal: "Master GraphQL for API development",
    skillLevel: "intermediate" as const,
    hoursPerWeek: 10,
    estimatedTotalHours: 75,
    phases: [
      {
        title: "GraphQL Fundamentals",
        description: "Queries, mutations, and subscriptions",
        estimatedHours: 25,
        topics: [
          { title: "GraphQL Basics", description: "Schema and queries", estimatedHours: 8, difficulty: "medium" as const },
          { title: "Apollo Server", description: "Building GraphQL servers", estimatedHours: 10, difficulty: "medium" as const },
          { title: "Advanced Concepts", description: "Subscriptions and real-time data", estimatedHours: 7, difficulty: "hard" as const },
        ],
      },
    ],
  },
  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications with React Native",
    goal: "Create iOS and Android apps with JavaScript",
    skillLevel: "advanced" as const,
    hoursPerWeek: 15,
    estimatedTotalHours: 130,
    phases: [
      {
        title: "React Native Essentials",
        description: "Navigation, components, and state management",
        estimatedHours: 35,
        topics: [
          { title: "Core Components", description: "Views, text, and styling", estimatedHours: 12, difficulty: "medium" as const },
          { title: "Navigation", description: "React Navigation library", estimatedHours: 12, difficulty: "medium" as const },
          { title: "Native APIs", description: "Camera, location, and sensors", estimatedHours: 11, difficulty: "hard" as const },
        ],
      },
    ],
  },
] as const;

export async function POST(req: Request) {
  try {
    const defaultEmail = "demo@example.com";
    const defaultPassword = "Password123";

    // Check if default user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, defaultEmail))
      .limit(1);

    let userId: string;

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      const [newUser] = await db
        .insert(users)
        .values({
          email: defaultEmail,
          name: "Demo User",
          passwordHash,
          hasCompletedOnboarding: false,
        })
        .returning();
      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    // Seed public roadmaps
    let createdCount = 0;

    for (const roadmapData of PUBLIC_ROADMAPS) {
      try {
        // Create roadmap
        const [roadmap] = await db
          .insert(roadmaps)
          .values({
            userId: null,
            title: roadmapData.title,
            description: roadmapData.description,
            goal: roadmapData.goal,
            skillLevel: roadmapData.skillLevel,
            hoursPerWeek: roadmapData.hoursPerWeek,
            estimatedTotalHours: roadmapData.estimatedTotalHours,
            isPublic: true,
            isTemplate: true,
          })
          .returning();

        // Create phases
        for (const phaseData of roadmapData.phases) {
          const [phase] = await db
            .insert(phases)
            .values({
              roadmapId: roadmap.id,
              title: phaseData.title,
              description: phaseData.description,
              orderIndex: roadmapData.phases.indexOf(phaseData as any),
              estimatedHours: phaseData.estimatedHours,
            })
            .returning();

          // Create topics
          for (const topicData of phaseData.topics) {
            await db
              .insert(topics)
              .values({
                phaseId: phase.id,
                title: topicData.title,
                description: topicData.description,
                orderIndex: (phaseData.topics as any).indexOf(topicData),
                estimatedHours: topicData.estimatedHours,
                difficulty: topicData.difficulty as any,
              })
              .returning();
          }
        }

        createdCount++;
      } catch (error) {
        console.error(`Error creating roadmap "${roadmapData.title}":`, error);
      }
    }

    return Response.json({
      message: `Seeding completed`,
      user: {
        id: userId,
        email: defaultEmail,
        name: "Demo User",
      },
      roadmapsCreated: createdCount,
      totalRoadmaps: PUBLIC_ROADMAPS.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
