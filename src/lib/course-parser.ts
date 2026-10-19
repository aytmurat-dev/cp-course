import { parse as parseYaml } from "yaml";
import { z } from "zod";
import type { TopicContent } from "./topic-parser";

/* content/course.yaml — kurs tuzilmasi: qism → bo'lim → mavzu. */

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug kebab-case bo'lsin (masalan prefix-sums)");
const topicRefSchema = z.object({ slug: slugSchema, title: z.string().min(1) });

const chapterSchema = z.union([
  z.object({ title: z.string().min(1), topics: z.array(topicRefSchema).min(1) }),
  z.object({ title: z.string().min(1), slug: slugSchema }),
]);

const courseSchema = z.object({
  parts: z.array(z.object({ title: z.string().min(1), chapters: z.array(chapterSchema).min(1) })).min(1),
});

/** Kursdagi bitta mavzu o'rni. content — fayli yozilgan bo'lsa, aks holda null ("Tez orada"). */
export type CourseTopic = {
  slug: string;
  title: string;
  /** "1.2" yoki bo'lim yagona mavzudan iborat bo'lsa "8". */
  number: string;
  partTitle: string;
  chapterTitle: string;
  content: TopicContent | null;
};

export type CourseChapter = { number: number; title: string; topics: CourseTopic[]; single: boolean };
export type CoursePart = { title: string; chapters: CourseChapter[] };

export function parseCourse(yamlText: string, contents: Map<string, TopicContent>): CoursePart[] {
  const parsed = courseSchema.safeParse(parseYaml(yamlText));
  if (!parsed.success) throw new Error(`content/course.yaml xato — ${parsed.error.message}`);

  const seen = new Set<string>();
  const ref = (slug: string, title: string, number: string, partTitle: string, chapterTitle: string): CourseTopic => {
    if (seen.has(slug)) throw new Error(`content/course.yaml: "${slug}" slug'i ikki marta ishlatilgan`);
    seen.add(slug);
    return { slug, title, number, partTitle, chapterTitle, content: contents.get(slug) ?? null };
  };

  return parsed.data.parts.map((part) => ({
    title: part.title,
    chapters: part.chapters.map((ch, i) => {
      const n = i + 1;
      if ("slug" in ch) {
        return { number: n, title: ch.title, single: true, topics: [ref(ch.slug, ch.title, `${n}`, part.title, ch.title)] };
      }
      return {
        number: n,
        title: ch.title,
        single: false,
        topics: ch.topics.map((t, j) => ref(t.slug, t.title, `${n}.${j + 1}`, part.title, ch.title)),
      };
    }),
  }));
}

export function flattenCourse(parts: CoursePart[]): CourseTopic[] {
  return parts.flatMap((p) => p.chapters.flatMap((c) => c.topics));
}
