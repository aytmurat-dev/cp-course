import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db, solves } from "@/db";
import { getAllProblemKeys } from "./content";

/** Kursdagi masalalardan o'quvchi yechganlari: problemKey → solvedAt. */
export async function getCourseSolves(userId: number) {
  const keys = getAllProblemKeys();
  if (keys.length === 0) return new Map<string, Date>();
  const rows = await db
    .select({ key: solves.problemKey, at: solves.solvedAt })
    .from(solves)
    .where(and(eq(solves.userId, userId), inArray(solves.problemKey, keys)));
  return new Map(rows.map((r) => [r.key, r.at]));
}

/** Bir nechta o'quvchi uchun kursdagi yechimlar soni. */
export async function getCourseSolveCounts() {
  const keys = getAllProblemKeys();
  const counts = new Map<number, number>();
  if (keys.length === 0) return counts;
  const rows = await db
    .select({ userId: solves.userId, key: solves.problemKey })
    .from(solves)
    .where(inArray(solves.problemKey, keys));
  for (const r of rows) counts.set(r.userId, (counts.get(r.userId) ?? 0) + 1);
  return counts;
}
