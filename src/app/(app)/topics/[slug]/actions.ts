"use server";

import { and, asc, desc, eq, gt, lt, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, DIFFICULTIES, topicProblems, type Difficulty } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { getCourseTopic } from "@/lib/content";
import { JudgeError } from "@/lib/judges";
import { fetchProblemInfo } from "@/lib/judges/problem-info";
import { parseProblemUrl } from "@/lib/problems";

/** url/note — xato bo'lganda formada qayta ko'rsatish uchun. */
export type ProblemFormState = { error?: string; success?: string; url?: string; note?: string };

function readDifficulty(v: FormDataEntryValue | null): Difficulty | null {
  return DIFFICULTIES.includes(v as Difficulty) ? (v as Difficulty) : null;
}

function readRating(v: FormDataEntryValue | null): number | null | "invalid" {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) && n > 0 && n < 5000 ? n : "invalid";
}

function revalidate(slug: string) {
  revalidatePath(`/topics/${slug}`);
  revalidatePath("/topics");
}

export async function addProblem(_: ProblemFormState, form: FormData): Promise<ProblemFormState> {
  const result = await addProblemImpl(form);
  // Xato bo'lsa kiritilgan qiymatlar saqlansin (React forma yuborilgach maydonlarni tozalaydi).
  return result.error ? { ...result, url: String(form.get("url") ?? ""), note: String(form.get("note") ?? "") } : result;
}

async function addProblemImpl(form: FormData): Promise<ProblemFormState> {
  await requireAdmin();
  const slug = String(form.get("slug") ?? "");
  if (!getCourseTopic(slug)) return { error: "Mavzu topilmadi" };

  const url = String(form.get("url") ?? "").trim();
  const parsed = parseProblemUrl(url);
  if (!parsed) {
    return {
      error:
        "Havola tanilmadi. Masalan: https://codeforces.com/problemset/problem/313/B yoki https://atcoder.jp/contests/abc086/tasks/abc086_a",
    };
  }

  const [exists] = await db
    .select({ id: topicProblems.id })
    .from(topicProblems)
    .where(and(eq(topicProblems.topicSlug, slug), eq(topicProblems.problemKey, parsed.key)));
  if (exists) return { error: "Bu masala shu mavzuda allaqachon bor" };

  let info;
  try {
    info = await fetchProblemInfo(parsed.platform, parsed.key, url);
  } catch (e) {
    console.error(e);
    return { error: `Platformaga ulanib bo'lmadi (${e instanceof JudgeError ? e.message : "tarmoq xatosi"}). Qayta urinib ko'ring.` };
  }
  if (!info) return { error: "Bunday masala platformada topilmadi" };

  const [{ last }] = await db
    .select({ last: max(topicProblems.position) })
    .from(topicProblems)
    .where(eq(topicProblems.topicSlug, slug));
  const note = String(form.get("note") ?? "").trim();

  await db.insert(topicProblems).values({
    topicSlug: slug,
    problemKey: parsed.key,
    platform: parsed.platform,
    // Bir xil ko'rinish uchun Codeforces havolasi problemset formatiga keltiriladi.
    url: parsed.platform === "codeforces" && !/\/gym\//.test(url) ? canonicalCfUrl(parsed.key) : url,
    title: info.title,
    difficulty: readDifficulty(form.get("difficulty")) ?? info.difficulty,
    rating: info.rating,
    note: note || null,
    position: (last ?? 0) + 1,
  });
  revalidate(slug);
  return { success: `Qo'shildi: ${info.title}` };
}

function canonicalCfUrl(key: string) {
  const [, contest, index] = key.match(/^cf:(\d+)([A-Z]\d?)$/)!;
  return `https://codeforces.com/problemset/problem/${contest}/${index}`;
}

export async function updateProblem(_: ProblemFormState, form: FormData): Promise<ProblemFormState> {
  await requireAdmin();
  const id = Number(form.get("id"));
  const title = String(form.get("title") ?? "").trim();
  const difficulty = readDifficulty(form.get("difficulty"));
  const rating = readRating(form.get("rating"));
  const note = String(form.get("note") ?? "").trim();
  if (!title) return { error: "Nomini kiriting" };
  if (!difficulty) return { error: "Qiyinlikni tanlang" };
  if (rating === "invalid") return { error: "Reyting musbat butun son bo'lsin" };

  const [row] = await db
    .update(topicProblems)
    .set({ title, difficulty, rating, note: note || null })
    .where(eq(topicProblems.id, id))
    .returning({ slug: topicProblems.topicSlug });
  if (!row) return { error: "Masala topilmadi" };
  revalidate(row.slug);
  return { success: "Saqlandi" };
}

export async function deleteProblem(form: FormData) {
  await requireAdmin();
  const [row] = await db
    .delete(topicProblems)
    .where(eq(topicProblems.id, Number(form.get("id"))))
    .returning({ slug: topicProblems.topicSlug });
  if (row) revalidate(row.slug);
}

/** Masalani ro'yxatda bir pog'ona yuqoriga/pastga suradi (qo'shni bilan o'rin almashadi). */
export async function moveProblem(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const up = form.get("dir") === "up";
  const [cur] = await db.select().from(topicProblems).where(eq(topicProblems.id, id));
  if (!cur) return;
  const [other] = await db
    .select()
    .from(topicProblems)
    .where(
      and(
        eq(topicProblems.topicSlug, cur.topicSlug),
        up ? lt(topicProblems.position, cur.position) : gt(topicProblems.position, cur.position),
      ),
    )
    .orderBy(up ? desc(topicProblems.position) : asc(topicProblems.position))
    .limit(1);
  if (!other) return;
  await db.update(topicProblems).set({ position: other.position }).where(eq(topicProblems.id, cur.id));
  await db.update(topicProblems).set({ position: cur.position }).where(eq(topicProblems.id, other.id));
  revalidate(cur.topicSlug);
}
