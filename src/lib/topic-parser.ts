import matter from "gray-matter";
import { z } from "zod";
import type { Platform } from "@/db/schema";
import { parseProblemUrl } from "./problems";

/* Mavzu fayllarini tahlil qilish (Next.js'dan tashqarida — skriptlarda ham ishlatiladi). */

const problemSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  rating: z.number().int().optional(),
  note: z.string().optional(),
});

const frontmatterSchema = z.object({
  title: z.string().min(1),
  section: z.string().min(1),
  order: z.number(),
  summary: z.string().min(1),
  prerequisites: z.array(z.string()).default([]),
  problems: z.array(problemSchema).default([]),
});

export type Difficulty = z.infer<typeof problemSchema>["difficulty"];

export type Problem = z.infer<typeof problemSchema> & { platform: Platform; key: string };

export type Topic = Omit<z.infer<typeof frontmatterSchema>, "problems"> & {
  slug: string;
  body: string;
  problems: Problem[];
};

export type Section = { name: string; topics: Topic[] };

export function parseTopic(file: string, raw: string): Topic {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`content/topics/${file}: frontmatter xato — ${parsed.error.message}`);
  }
  const problems = parsed.data.problems.map((p) => {
    const info = parseProblemUrl(p.url);
    if (!info) throw new Error(`content/topics/${file}: qo'llab-quvvatlanmaydigan URL — ${p.url}`);
    return { ...p, ...info };
  });
  return { ...parsed.data, slug, body: content, problems };
}
