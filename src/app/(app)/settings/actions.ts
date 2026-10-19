"use server";

import bcrypt from "bcryptjs";
import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db, handles, PLATFORMS, users, verifications, type Platform } from "@/db";
import { requireUser } from "@/lib/auth";
import { checkVerification, JudgeError, lookupHandle, newChallenge } from "@/lib/judges";
import { PLATFORM_LABEL } from "@/lib/problems";
import { createSession } from "@/lib/session";
import { syncUser } from "@/lib/sync";

export type ActionState = { error?: string; success?: string };

/** Tasdiqlash topshirig'i qancha vaqt amal qiladi. */
const VERIFY_TTL_MIN: Record<Platform, number> = { codeforces: 15, atcoder: 60 };

function readPlatform(form: FormData): Platform {
  const p = String(form.get("platform"));
  if (!(PLATFORMS as readonly string[]).includes(p)) throw new Error("Noto'g'ri platforma");
  return p as Platform;
}

function judgeError(e: unknown): ActionState {
  console.error(e);
  const msg = e instanceof JudgeError ? e.message : "kutilmagan xato";
  return { error: `Platformaga ulanib bo'lmadi (${msg}). Birozdan so'ng qayta urinib ko'ring.` };
}

export async function changePassword(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await requireUser();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (next.length < 6) return { error: "Yangi parol kamida 6 belgidan iborat bo'lsin" };
  if (next !== confirm) return { error: "Yangi parollar mos kelmadi" };

  const [row] = await db.select().from(users).where(eq(users.id, user.id));
  if (!(await bcrypt.compare(current, row.passwordHash))) return { error: "Joriy parol noto'g'ri" };

  const [updated] = await db
    .update(users)
    .set({ passwordHash: await bcrypt.hash(next, 10), sessionVersion: sql`${users.sessionVersion} + 1` })
    .where(eq(users.id, user.id))
    .returning({ v: users.sessionVersion });
  await createSession(user.id, updated.v);
  return { success: "Parol o'zgartirildi" };
}

export async function startVerification(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await requireUser();
  const platform = readPlatform(form);
  const input = String(form.get("handle") ?? "").trim();
  if (!input) return { error: "Handle kiriting" };

  let handle: string | null;
  try {
    handle = await lookupHandle(platform, input);
  } catch (e) {
    return judgeError(e);
  }
  if (!handle) return { error: `${PLATFORM_LABEL[platform]}da "${input}" foydalanuvchisi topilmadi` };

  const [taken] = await db
    .select({ userId: handles.userId })
    .from(handles)
    .where(and(eq(handles.platform, platform), sql`lower(${handles.handle}) = lower(${handle})`, ne(handles.userId, user.id)));
  if (taken) return { error: "Bu handle boshqa o'quvchiga ulangan. Xato bo'lsa, adminga murojaat qiling." };

  const row = { userId: user.id, platform, handle, challenge: newChallenge(platform), createdAt: new Date() };
  await db
    .insert(verifications)
    .values(row)
    .onConflictDoUpdate({ target: [verifications.userId, verifications.platform], set: row });
  revalidatePath("/settings");
  return {};
}

export async function confirmVerification(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await requireUser();
  const platform = readPlatform(form);
  const where = and(eq(verifications.userId, user.id), eq(verifications.platform, platform));
  const [v] = await db.select().from(verifications).where(where);
  if (!v) return { error: "Tasdiqlash jarayoni topilmadi. Qaytadan boshlang." };

  if (Date.now() - v.createdAt.getTime() > VERIFY_TTL_MIN[platform] * 60_000) {
    await db.delete(verifications).where(where);
    revalidatePath("/settings");
    return { error: "Tasdiqlash muddati tugadi. Qaytadan boshlang." };
  }

  let ok: boolean;
  try {
    ok = await checkVerification(platform, v.handle, v.challenge, v.createdAt);
  } catch (e) {
    return judgeError(e);
  }
  if (!ok) {
    return {
      error:
        platform === "codeforces"
          ? "Compilation Error topilmadi. Yuborganingizdan keyin 10–20 soniya kutib, qayta tekshiring."
          : "Profilingizda kod topilmadi. Saqlaganingizga ishonch hosil qilib, qayta tekshiring.",
    };
  }

  try {
    await db
      .insert(handles)
      .values({ userId: user.id, platform, handle: v.handle, cursor: null, verifiedAt: new Date() })
      .onConflictDoUpdate({
        target: [handles.userId, handles.platform],
        set: { handle: v.handle, cursor: null, verifiedAt: new Date() },
      });
  } catch {
    return { error: "Bu handle boshqa o'quvchiga ulangan." };
  }
  await db.delete(verifications).where(where);

  // Yangi handle'dan yechimlarni darhol (javobdan keyin) yuklaymiz.
  after(() => syncUser(user.id, { force: true }));
  revalidatePath("/settings");
  return { success: `${PLATFORM_LABEL[platform]} handle ulandi: ${v.handle}` };
}

export async function cancelVerification(form: FormData) {
  const user = await requireUser();
  const platform = readPlatform(form);
  await db.delete(verifications).where(and(eq(verifications.userId, user.id), eq(verifications.platform, platform)));
  revalidatePath("/settings");
}

export async function unlinkHandle(form: FormData) {
  const user = await requireUser();
  const platform = readPlatform(form);
  await db.delete(handles).where(and(eq(handles.userId, user.id), eq(handles.platform, platform)));
  revalidatePath("/settings");
}
