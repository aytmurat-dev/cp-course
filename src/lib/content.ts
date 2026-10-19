import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parseTopic, type Topic } from "./topic-parser";

export type { Difficulty, Problem, Section, Topic } from "./topic-parser";

const TOPICS_DIR = path.join(process.cwd(), "content", "topics");

function loadTopic(file: string): Topic {
  return parseTopic(file, fs.readFileSync(path.join(TOPICS_DIR, file), "utf8"));
}

export const getTopics = cache((): Topic[] => {
  if (!fs.existsSync(TOPICS_DIR)) return [];
  return fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(loadTopic)
    .sort((a, b) => a.order - b.order);
});

export function getTopic(slug: string) {
  return getTopics().find((t) => t.slug === slug) ?? null;
}

/** Mavzularni bo'limlarga guruhlaydi (bo'limlar birinchi uchragan tartibda). */
export function getSections() {
  const map = new Map<string, Topic[]>();
  for (const t of getTopics()) {
    if (!map.has(t.section)) map.set(t.section, []);
    map.get(t.section)!.push(t);
  }
  return [...map].map(([name, topics]) => ({ name, topics }));
}

export function getAllProblemKeys() {
  return [...new Set(getTopics().flatMap((t) => t.problems.map((p) => p.key)))];
}
