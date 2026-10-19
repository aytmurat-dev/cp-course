import { fetchJson, JudgeError, type FetchResult } from "./types";

type CfResponse<T> = { status: "OK"; result: T } | { status: "FAILED"; comment: string };

type CfSubmission = {
  id: number;
  creationTimeSeconds: number;
  problem: { contestId?: number; index: string };
  verdict?: string;
};

async function cf<T>(method: string, params: Record<string, string | number>) {
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const url = `https://codeforces.com/api/${method}?${qs}`;
  let data: CfResponse<T>;
  try {
    data = await fetchJson<CfResponse<T>>(url);
  } catch (e) {
    // Codeforces mavjud bo'lmagan handle uchun HTTP 400 + FAILED qaytaradi.
    if (e instanceof JudgeError && e.message.includes("400")) return null;
    throw e;
  }
  if (data.status !== "OK") return null;
  return data.result;
}

/** Handle mavjud bo'lsa, uning to'g'ri yozilishini qaytaradi. */
export async function lookupHandle(handle: string) {
  if (!/^[A-Za-z0-9_.-]{3,24}$/.test(handle)) return null;
  const res = await cf<{ handle: string }[]>("user.info", { handles: handle });
  return res?.[0]?.handle ?? null;
}

/** Tasdiqlash uchun Compilation Error yuboriladigan masalalar. */
const VERIFY_PROBLEMS = ["4/A", "71/A", "158/A", "231/A", "282/A", "50/A", "263/A", "339/A"];

export function pickVerifyProblem() {
  return VERIFY_PROBLEMS[Math.floor(Math.random() * VERIFY_PROBLEMS.length)];
}

export function verifyProblemUrl(challenge: string) {
  const [contest, index] = challenge.split("/");
  return `https://codeforces.com/problemset/problem/${contest}/${index}`;
}

/** Tasdiqlash boshlangandan keyin shu masalaga Compilation Error yuborilganmi? */
export async function checkVerification(handle: string, challenge: string, since: Date) {
  const subs = await cf<CfSubmission[]>("user.status", { handle, from: 1, count: 20 });
  if (!subs) return false;
  const [contest, index] = challenge.split("/");
  const sinceSec = Math.floor(since.getTime() / 1000) - 60;
  return subs.some(
    (s) =>
      s.verdict === "COMPILATION_ERROR" &&
      String(s.problem.contestId) === contest &&
      s.problem.index === index &&
      s.creationTimeSeconds >= sinceSec,
  );
}

/** Accepted yechimlar. Birinchi marta hammasi, keyin oxirgi 1000 ta urinish yuklanadi. */
export async function fetchSolved(handle: string, cursor: number | null): Promise<FetchResult> {
  const params: Record<string, number | string> = { handle };
  if (cursor) Object.assign(params, { from: 1, count: 1000 });
  const subs = await cf<CfSubmission[]>("user.status", params);
  if (!subs) throw new JudgeError(`Codeforces: "${handle}" topilmadi`);
  const solved = subs
    .filter((s) => s.verdict === "OK" && s.problem.contestId)
    .map((s) => ({
      key: `cf:${s.problem.contestId}${s.problem.index.toUpperCase()}`,
      at: new Date(s.creationTimeSeconds * 1000),
    }));
  return { solved, cursor: 1 };
}
