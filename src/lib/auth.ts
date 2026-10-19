import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, users, type User } from "@/db";
import { readSession } from "./session";

export type SessionUser = Pick<User, "id" | "username" | "name" | "role" | "lastSyncedAt">;

/** Joriy foydalanuvchi (bitta so'rov ichida keshlanadi). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await readSession();
  if (!session) return null;
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      role: users.role,
      lastSyncedAt: users.lastSyncedAt,
      sessionVersion: users.sessionVersion,
    })
    .from(users)
    .where(eq(users.id, session.uid));
  if (!user || user.sessionVersion !== session.v) return null;
  return { id: user.id, username: user.username, name: user.name, role: user.role, lastSyncedAt: user.lastSyncedAt };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/topics");
  return user;
}
