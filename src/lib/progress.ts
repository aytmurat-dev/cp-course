import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db, solves, topicProblems } from "@/db";

const courseKeys = () => db.selectDistinct({ key: topicProblems.problemKey }).from(topicProblems);

/** Kursdagi masalalardan o'quvchi yechganlari: problemKey → solvedAt. */
export async function getCourseSolves(userId: number) {
  const rows = await db
    .select({ key: solves.problemKey, at: solves.solvedAt })
    .from(solves)
    .where(and(eq(solves.userId, userId), inArray(solves.problemKey, courseKeys())));
  return new Map(rows.map((r) => [r.key, r.at]));
}

/** O'quvchining barcha yechimlari (kursdan tashqaridagilari ham): problemKey → solvedAt. */
export async function getUserSolves(userId: number) {
  const rows = await db.select({ key: solves.problemKey, at: solves.solvedAt }).from(solves).where(eq(solves.userId, userId));
  return new Map(rows.map((r) => [r.key, r.at]));
}

/** Har bir o'quvchi uchun kursdagi yechimlar soni. */
export async function getCourseSolveCounts() {
  const rows = await db
    .select({ userId: solves.userId })
    .from(solves)
    .where(inArray(solves.problemKey, courseKeys()));
  const counts = new Map<number, number>();
  for (const r of rows) counts.set(r.userId, (counts.get(r.userId) ?? 0) + 1);
  return counts;
}
