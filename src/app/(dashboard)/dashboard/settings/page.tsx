import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = { title: "Settings - PathForge" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;
  if (!userId) redirect("/login");

  const [user] = await db
    .select({
      email: users.email,
      hasCompletedOnboarding: users.hasCompletedOnboarding,
      preferences: users.preferences,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const pref = user?.preferences;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Account and learning preference details.
          </p>
        </div>

        <section className="glass rounded-xl border border-border/50 p-5 space-y-3">
          <h2 className="font-semibold">Account</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium break-all">{user?.email ?? session.user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Onboarding</p>
              <p className="font-medium">
                {user?.hasCompletedOnboarding ? "Completed" : "Not completed"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Member since</p>
              <p className="font-medium">
                {user?.createdAt ? user.createdAt.toLocaleDateString() : "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="glass rounded-xl border border-border/50 p-5 space-y-3">
          <h2 className="font-semibold">Learning Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Learning style</p>
              <p className="font-medium capitalize">{pref?.learningStyle ?? "Not set"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hours per week</p>
              <p className="font-medium">
                {typeof pref?.hoursPerWeek === "number" ? pref.hoursPerWeek : "Not set"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Goals</p>
              <p className="font-medium">
                {pref?.goals && pref.goals.length > 0 ? pref.goals.join(", ") : "Not set"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
