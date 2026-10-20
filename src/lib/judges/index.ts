import type { Platform } from "@/db/schema";
import * as atcoder from "./atcoder";
import * as codeforces from "./codeforces";
import * as kep from "./kep";
import type { FetchResult } from "./types";

export { JudgeError } from "./types";

export function lookupHandle(platform: Platform, handle: string): Promise<string | null> {
  return { codeforces, atcoder, kep }[platform].lookupHandle(handle);
}

export function fetchSolved(platform: Platform, handle: string, cursor: number | null): Promise<FetchResult> {
  switch (platform) {
    case "codeforces":
      return codeforces.fetchSolved(handle, cursor);
    case "atcoder":
      return atcoder.fetchSolved(handle, cursor);
    case "kep":
      return kep.fetchSolved(handle, cursor);
  }
}

/** Tasdiqlash topshirig'ini bajarganmi? challenge: CF va Kep uchun masala, AtCoder uchun kod. */
export function checkVerification(platform: Platform, handle: string, challenge: string, since: Date) {
  switch (platform) {
    case "codeforces":
      return codeforces.checkVerification(handle, challenge, since);
    case "atcoder":
      return atcoder.checkVerification(handle, challenge);
    case "kep":
      return kep.checkVerification(handle, challenge, since);
  }
}

export function newChallenge(platform: Platform) {
  if (platform === "codeforces") return codeforces.pickVerifyProblem();
  if (platform === "kep") return kep.pickVerifyProblem();
  const rand = crypto.getRandomValues(new Uint8Array(4));
  return "cpkurs-" + [...rand].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Xato yechim yuborib tasdiqlanadigan platformalarda — yuboriladigan masala havolasi. */
export function verifyProblemUrl(platform: Platform, challenge: string) {
  if (platform === "codeforces") return codeforces.verifyProblemUrl(challenge);
  if (platform === "kep") return kep.problemUrl(challenge);
  return null;
}
