import matter from "gray-matter";
import { z } from "zod";

/* Mavzu fayllarini tahlil qilish (Next.js'dan tashqarida — skriptlarda ham ishlatiladi). */

const frontmatterSchema = z.object({
  summary: z.string().min(1),
  prerequisites: z.array(z.string()).default([]),
});

/** Mavzu faylining mazmuni. Nomi va o'rni content/course.yaml dan, masalalar — bazadan (admin panel). */
export type TopicContent = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
  /** Frontmatter'dagi e'tiborga olinmaydigan maydonlar (masalan eski title/section/order/problems). */
  ignoredKeys: string[];
};

export function parseTopic(file: string, raw: string): TopicContent {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`content/topics/${file}: frontmatter xato — ${parsed.error.message}`);
  }
  const ignoredKeys = Object.keys(data).filter((k) => !(k in frontmatterSchema.shape));
  return { ...parsed.data, slug, body: content, ignoredKeys };
}
