export type SolvedEntry = { key: string; at: Date };

export type FetchResult = { solved: SolvedEntry[]; cursor: number | null };

export class JudgeError extends Error {}

const UA = "cp-course-sync/1.0 (+https://github.com/aytmurat-dev/cp-course)";

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": UA, Accept: "application/json", ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new JudgeError(`${new URL(url).hostname}: HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchText(url: string): Promise<{ status: number; text: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  return { status: res.status, text: res.status === 200 ? await res.text() : "" };
}
