import "server-only";
import fs from "node:fs";
import path from "node:path";
import { asc } from "drizzle-orm";
import { cache } from "react";
import { db, topicProblems, type Problem } from "@/db";
import { flattenCourse, parseCourse, type CourseTopic } from "./course-parser";
import { parseTopic, type TopicContent } from "./topic-parser";

export type { CourseChapter, CoursePart, CourseTopic } from "./course-parser";
export type { TopicContent } from "./topic-parser";
export type { Difficulty, Problem } from "@/db";

const CONTENT_DIR = path.join(process.cwd(), "content");
const TOPICS_DIR = path.join(CONTENT_DIR, "topics");

/** Kurs tuzilmasi (content/course.yaml) + yozilgan mavzu fayllari. */
export const getCourse = cache(() => {
  const contents = new Map<string, TopicContent>();
  if (fs.existsSync(TOPICS_DIR)) {
    for (const f of fs.readdirSync(TOPICS_DIR)) {
      if (!f.endsWith(".md") || f.startsWith("_")) continue;
      const t = parseTopic(f, fs.readFileSync(path.join(TOPICS_DIR, f), "utf8"));
      contents.set(t.slug, t);
    }
  }
  return parseCourse(fs.readFileSync(path.join(CONTENT_DIR, "course.yaml"), "utf8"), contents);
});

/** Kurs tartibidagi barcha mavzular (yozilmaganlari ham). */
export function getCourseTopics() {
  return flattenCourse(getCourse());
}

export function getCourseTopic(slug: string) {
  return getCourseTopics().find((t) => t.slug === slug) ?? null;
}

/** Barcha mavzular masalalari: slug → tartiblangan ro'yxat (bitta so'rov ichida keshlanadi). */
export const getProblemsBySlug = cache(async () => {
  const rows = await db.select().from(topicProblems).orderBy(asc(topicProblems.topicSlug), asc(topicProblems.position));
  const map = new Map<string, Problem[]>();
  for (const r of rows) {
    if (!map.has(r.topicSlug)) map.set(r.topicSlug, []);
    map.get(r.topicSlug)!.push(r);
  }
  return map;
});

/** Matni yoki masalasi bor mavzu o'quvchiga ochiq; qolganlari "Tez orada". */
export function isAvailable(t: CourseTopic, problems: Map<string, Problem[]>) {
  return t.content !== null || (problems.get(t.slug)?.length ?? 0) > 0;
}

/** Kursdagi takrorlanmas masalalar soni. */
export async function getProblemCount() {
  const problems = await getProblemsBySlug();
  return new Set([...problems.values()].flat().map((p) => p.problemKey)).size;
}
