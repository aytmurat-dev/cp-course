import type { Difficulty, Platform } from "@/db/schema";
import * as kep from "./kep";
import { fetchJson, fetchText } from "./types";

export type ProblemInfo = { title: string; rating: number | null; difficulty: Difficulty };

type CfProblem = { contestId?: number; index: string; name: string; rating?: number };

// Codeforces masalalar ro'yxati (~2 MB) — issiq funksiya ichida 1 soat saqlanadi.
let cfCache: { at: number; byKey: Map<string, CfProblem> } | null = null;

async function cfProblems() {
  if (cfCache && Date.now() - cfCache.at < 3600_000) return cfCache.byKey;
  const data = await fetchJson<{ status: string; result: { problems: CfProblem[] } }>(
    "https://codeforces.com/api/problemset.problems",
  );
  const byKey = new Map(data.result.problems.map((p) => [`cf:${p.contestId}${p.index}`, p]));
  cfCache = { at: Date.now(), byKey };
  return byKey;
}

function difficultyFromRating(rating: number | null): Difficulty {
  if (rating === null) return "medium";
  return rating <= 1200 ? "easy" : rating <= 1700 ? "medium" : "hard";
}

/** AtCoder: ABC'da A–B oson, C–D o'rta, E+ qiyin; ARC/AGC — o'rta/qiyin. */
function difficultyFromAtcoderTask(taskId: string): Difficulty {
  const m = taskId.match(/^([a-z]+)\d+_([a-z])/);
  if (!m) return "medium";
  const [, kind, letter] = m;
  if (kind === "abc") return letter <= "b" ? "easy" : letter <= "d" ? "medium" : "hard";
  if (kind === "arc") return letter === "a" ? "medium" : "hard";
  return "hard";
}

/**
 * Masala nomi va qiyinligini platformadan oladi. Masala topilmasa null.
 * Codeforces gym masalalari API'da yo'q — nomi vaqtincha qo'yiladi, keyin tahrirlanadi.
 */
export async function fetchProblemInfo(platform: Platform, key: string, url: string): Promise<ProblemInfo | null> {
  if (platform === "codeforces") {
    const contest = Number(key.slice(3).match(/^\d+/)?.[0]);
    if (contest >= 100000) return { title: `Gym ${key.slice(3)}`, rating: null, difficulty: "medium" };
    const p = (await cfProblems()).get(key);
    if (!p) return null;
    const rating = p.rating ?? null;
    return { title: p.name, rating, difficulty: difficultyFromRating(rating) };
  }
  if (platform === "kep") return kep.fetchProblemInfo(key.slice(4));
  const page = new URL(url);
  page.search = "lang=en";
  const { status, text } = await fetchText(page.toString());
  if (status !== 200) return null;
  const raw = text.match(/<title>\s*([^<]+?)\s*<\/title>/)?.[1];
  if (!raw) return null;
  const title = raw.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/^[A-Za-z0-9]+ - /, "");
  return { title, rating: null, difficulty: difficultyFromAtcoderTask(key.slice(3)) };
}
