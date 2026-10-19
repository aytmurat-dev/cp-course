import { fetchJson, JudgeError, type FetchResult } from "./types";

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

async function gql<T>(query: string, variables: Record<string, unknown>) {
  const res = await fetchJson<GqlResponse<T>>("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.data) throw new JudgeError(`LeetCode: ${res.errors?.[0]?.message ?? "noma'lum xato"}`);
  return res.data;
}

type UserData = { matchedUser: { username: string; profile: { aboutMe: string | null } } | null };

async function getUser(handle: string) {
  const data = await gql<UserData>(
    `query($u: String!) { matchedUser(username: $u) { username profile { aboutMe } } }`,
    { u: handle },
  );
  return data.matchedUser;
}

export async function lookupHandle(handle: string) {
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(handle)) return null;
  return (await getUser(handle))?.username ?? null;
}

/** Profil "Summary" (aboutMe) qismida tasdiqlash kodi bormi? */
export async function checkVerification(handle: string, token: string) {
  const user = await getUser(handle);
  return (user?.profile.aboutMe ?? "").includes(token);
}

/**
 * LeetCode ochiq API'si faqat oxirgi ~20 ta Accepted yechimni beradi.
 * Shuning uchun sinxronizatsiya muntazam (sahifaga kirganda + har kuni) ishlaydi.
 */
export async function fetchSolved(handle: string): Promise<FetchResult> {
  const data = await gql<{ recentAcSubmissionList: { titleSlug: string; timestamp: string }[] | null }>(
    `query($u: String!) { recentAcSubmissionList(username: $u, limit: 20) { titleSlug timestamp } }`,
    { u: handle },
  );
  const solved = (data.recentAcSubmissionList ?? []).map((s) => ({
    key: `lc:${s.titleSlug}`,
    at: new Date(Number(s.timestamp) * 1000),
  }));
  return { solved, cursor: null };
}
