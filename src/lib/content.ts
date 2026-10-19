import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { flattenCourse, parseCourse, type CourseTopic } from "./course-parser";
import { parseTopic, type TopicContent } from "./topic-parser";

export type { CourseChapter, CoursePart, CourseTopic } from "./course-parser";
export type { Difficulty, Problem, TopicContent } from "./topic-parser";

const CONTENT_DIR = path.join(process.cwd(), "content");
const TOPICS_DIR = path.join(CONTENT_DIR, "topics");

/** Fayli yozilgan mavzu. */
export type Topic = CourseTopic & { content: TopicContent };

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

/** Fayli yozilgan mavzular, kurs tartibida. */
export function getTopics(): Topic[] {
  return getCourseTopics().filter((t): t is Topic => t.content !== null);
}

export function getTopic(slug: string) {
  return getTopics().find((t) => t.slug === slug) ?? null;
}

export function getAllProblemKeys() {
  return [...new Set(getTopics().flatMap((t) => t.content.problems.map((p) => p.key)))];
}
