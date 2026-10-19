import type { Platform } from "@/db/schema";

export const PLATFORM_LABEL: Record<Platform, string> = {
  codeforces: "Codeforces",
  atcoder: "AtCoder",
};

export const PLATFORM_PREFIX: Record<Platform, string> = {
  codeforces: "cf",
  atcoder: "ac",
};

export type ParsedProblem = { platform: Platform; key: string };

/**
 * Masala URL'idan platforma va yagona kalitni ajratadi.
 *  - https://codeforces.com/problemset/problem/1234/A    → cf:1234A
 *  - https://codeforces.com/contest/1234/problem/A       → cf:1234A
 *  - https://codeforces.com/gym/100001/problem/B         → cf:100001B
 *  - https://atcoder.jp/contests/abc300/tasks/abc300_a   → ac:abc300_a
 */
export function parseProblemUrl(raw: string): ParsedProblem | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "").replace(/^m\d?\./, "");
  const path = url.pathname.replace(/\/+$/, "");

  if (host === "codeforces.com" || host === "codeforces.ml") {
    const m =
      path.match(/^\/problemset\/problem\/(\d+)\/([A-Za-z]\d?)$/) ??
      path.match(/^\/(?:contest|gym)\/(\d+)\/problem\/([A-Za-z]\d?)$/);
    return m ? { platform: "codeforces", key: `cf:${m[1]}${m[2].toUpperCase()}` } : null;
  }
  if (host === "atcoder.jp") {
    const m = path.match(/^\/contests\/[^/]+\/tasks\/([^/]+)$/);
    return m ? { platform: "atcoder", key: `ac:${m[1]}` } : null;
  }
  return null;
}
