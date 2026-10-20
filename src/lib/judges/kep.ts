import type { Difficulty } from "@/db/schema";
import { fetchJson, JudgeError, type FetchResult, type SolvedEntry } from "./types";

const API = "https://kep.uz/api";

type KepAttempt = { id: number; problemId: number; verdict: number; created: string };
type KepPage<T> = { page: number; pagesCount: number; data: T[] };
type KepProblem = { id: number; title: string; difficulty: number; problemRating: number };

const ACCEPTED = 1;
const COMPILATION_ERROR = 11; // "Sintaktik xatolik"

export function problemUrl(id: string | number) {
  return `https://kep.uz/practice/problems/problem/${id}`;
}

// Kep nomlarni Accept-Language bo'yicha tarjima qiladi; masalalar o'zbekcha nomi bilan olinsin.
const UZ = { headers: { "Accept-Language": "uz" } };

async function getOrNull<T>(url: string): Promise<T | null> {
  try {
    return await fetchJson<T>(url, UZ);
  } catch (e) {
    if (e instanceof JudgeError && e.message.endsWith("HTTP 404")) return null;
    throw e;
  }
}

export async function lookupHandle(handle: string) {
  if (!/^[\w.@+-]{1,150}$/.test(handle)) return null;
  const user = await getOrNull<{ username: string }>(`${API}/users/${encodeURIComponent(handle)}/`);
  return user?.username ?? null;
}

/** Tasdiqlash uchun "Sintaktik xatolik" yuboriladigan oson masalalar. */
const VERIFY_PROBLEMS = ["1", "2", "4", "5"];

export function pickVerifyProblem() {
  return VERIFY_PROBLEMS[Math.floor(Math.random() * VERIFY_PROBLEMS.length)];
}

/** Tasdiqlash boshlangandan keyin shu masalaga "Sintaktik xatolik" yuborilganmi? */
export async function checkVerification(handle: string, challenge: string, since: Date) {
  const qs = new URLSearchParams({ username: handle, problemId: challenge, verdict: String(COMPILATION_ERROR), pageSize: "20" });
  const res = await fetchJson<KepPage<KepAttempt>>(`${API}/attempts/?${qs}`);
  const sinceMs = since.getTime() - 60_000;
  return res.data.some(
    (a) => a.verdict === COMPILATION_ERROR && String(a.problemId) === challenge && new Date(a.created).getTime() >= sinceMs,
  );
}

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

/**
 * "Qabul qilindi" urinishlar (API ularni yangisidan eskisiga qaytaradi).
 * cursor — oxirgi ko'rilgan urinish id'si: keyingi safar faqat yangilari yuklanadi.
 */
export async function fetchSolved(handle: string, cursor: number | null): Promise<FetchResult> {
  const solved: SolvedEntry[] = [];
  let maxId = cursor ?? 0;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const qs = new URLSearchParams({ username: handle, verdict: String(ACCEPTED), pageSize: String(PAGE_SIZE), page: String(page) });
    const res = await fetchJson<KepPage<KepAttempt>>(`${API}/attempts/?${qs}`);
    let reachedSeen = false;
    for (const a of res.data) {
      if (cursor && a.id <= cursor) {
        reachedSeen = true;
        break;
      }
      maxId = Math.max(maxId, a.id);
      if (a.verdict === ACCEPTED) solved.push({ key: `kep:${a.problemId}`, at: new Date(a.created) });
    }
    if (reachedSeen || page >= res.pagesCount) break;
  }
  return { solved, cursor: maxId || null };
}

/** Kep qiyinligi 1–7: 1–3 oson, 4–5 o'rta, 6–7 qiyin. */
function toDifficulty(level: number): Difficulty {
  return level <= 3 ? "easy" : level <= 5 ? "medium" : "hard";
}

export async function fetchProblemInfo(id: string) {
  const p = await getOrNull<KepProblem>(`${API}/problems/${id}/`);
  if (!p) return null;
  return { title: p.title, rating: p.problemRating > 0 ? p.problemRating : null, difficulty: toDifficulty(p.difficulty) };
}
