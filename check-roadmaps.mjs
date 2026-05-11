import { db } from "./src/server/db/index.js";
import { roadmaps } from "./src/server/db/schema.js";
import { count, eq } from "drizzle-orm";

async function checkRoadmaps() {
  try {
    // Count all roadmaps
    const allCount = await db.select({ value: count() }).from(roadmaps);
    console.log("Total roadmaps:", allCount[0]?.value ?? 0);

    // Count public roadmaps
    const publicCount = await db
      .select({ value: count() })
      .from(roadmaps)
      .where(eq(roadmaps.isPublic, true));
    console.log("Public roadmaps:", publicCount[0]?.value ?? 0);

    // Get sample public roadmaps
    const samples = await db
      .select({
        id: roadmaps.id,
        title: roadmaps.title,
        isPublic: roadmaps.isPublic,
      })
      .from(roadmaps)
      .where(eq(roadmaps.isPublic, true))
      .limit(5);

    console.log("\nSample public roadmaps:");
    samples.forEach((r) => {
      console.log(`- ${r.id}: ${r.title} (public: ${r.isPublic})`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkRoadmaps();
