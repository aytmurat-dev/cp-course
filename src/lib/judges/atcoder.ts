import { fetchJson, fetchText, type FetchResult, type SolvedEntry } from "./types";

type KenkooooSubmission = { epoch_second: number; problem_id: string; result: string };

/** AtCoder profil sahifasidan handle'ning to'g'ri yozilishini oladi. */
export async function lookupHandle(handle: string) {
  if (!/^[A-Za-z0-9_]{3,16}$/.test(handle)) return null;
  const { status, text } = await fetchText(`https://atcoder.jp/users/${encodeURIComponent(handle)}`);
  if (status !== 200) return null;
  const m = text.match(/<title>\s*([A-Za-z0-9_]+)\s*-\s*AtCoder\s*<\/title>/);
  return m?.[1] ?? handle;
}

/** Profildagi "Affiliation" maydonida tasdiqlash kodi bormi? */
export async function checkVerification(handle: string, token: string) {
  const { status, text } = await fetchText(`https://atcoder.jp/users/${encodeURIComponent(handle)}`);
  if (status !== 200) return false;
  const m = text.match(/Affiliation<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/);
  return (m?.[1] ?? "").includes(token);
}

const PAGE = 500;
const MAX_PAGES = 10;
// Kenkoooo ma'lumotlari biroz kechikib yig'iladi — kursor shuncha orqaga suriladi.
const OVERLAP_SEC = 2 * 24 * 3600;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** AtCoder Problems (kenkoooo) API orqali AC yechimlar. */
export async function fetchSolved(handle: string, cursor: number | null): Promise<FetchResult> {
  let from = cursor ?? 0;
  let maxEpoch = cursor ? cursor + OVERLAP_SEC : 0;
  const solved: SolvedEntry[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${encodeURIComponent(handle)}&from_second=${from}`;
    const subs = await fetchJson<KenkooooSubmission[]>(url);
    for (const s of subs) {
      maxEpoch = Math.max(maxEpoch, s.epoch_second);
      if (s.result === "AC") solved.push({ key: `ac:${s.problem_id}`, at: new Date(s.epoch_second * 1000) });
    }
    if (subs.length < PAGE) break;
    from = subs[subs.length - 1].epoch_second + 1;
    await sleep(1000); // API qoidasi: so'rovlar orasida kamida 1 soniya
  }
  return { solved, cursor: Math.max(0, maxEpoch - OVERLAP_SEC) };
}
