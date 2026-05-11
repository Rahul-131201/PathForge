import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export const metadata: Metadata = { title: "Profile - PathForge" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;
  if (!userId) redirect("/login");

  const [user] = await db
    .select({
      name: users.name,
      email: users.email,
      image: users.image,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const name = user?.name ?? session.user.name ?? "User";
  const email = user?.email ?? session.user.email ?? "-";
  const image = user?.image ?? session.user.image ?? null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your account identity details.
          </p>
        </div>

        <section className="glass rounded-xl border border-border/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
              {image ? (
                <Image 
                  src={image} 
                  alt={name} 
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  priority
                />
              ) : (
                <span className="text-lg font-bold text-white">{name[0]?.toUpperCase() ?? "U"}</span>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-lg truncate">{name}</h2>
              <p className="text-sm text-muted-foreground break-all">{email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {user?.createdAt ? user.createdAt.toLocaleDateString() : "-"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
