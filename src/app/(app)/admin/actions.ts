"use server";

import bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, handles, PLATFORMS, users, type Platform } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { syncUser } from "@/lib/sync";

export type AdminState = { error?: string; success?: string; password?: string; username?: string };

const USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;

function generatePassword() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

export async function createStudent(_: AdminState, form: FormData): Promise<AdminState> {
  await requireAdmin();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  const password = String(form.get("password") ?? "").trim() || generatePassword();

  if (!USERNAME_RE.test(username)) {
    return { error: "Login 3–32 belgi: kichik lotin harflari, raqamlar, _ . -" };
  }
  if (!name) return { error: "Ismni kiriting" };
  if (password.length < 6) return { error: "Parol kamida 6 belgi bo'lsin" };

  const inserted = await db
    .insert(users)
    .values({ username, name, passwordHash: await bcrypt.hash(password, 10), role: "student" })
    .onConflictDoNothing({ target: users.username })
    .returning({ id: users.id });
  if (inserted.length === 0) return { error: `"${username}" logini band` };

  revalidatePath("/admin");
  return { success: "O'quvchi qo'shildi", username, password };
}

export async function resetPassword(_: AdminState, form: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = Number(form.get("id"));
  const password = generatePassword();
  await db
    .update(users)
    .set({ passwordHash: await bcrypt.hash(password, 10), sessionVersion: sql`${users.sessionVersion} + 1` })
    .where(and(eq(users.id, id), eq(users.role, "student")));
  return { success: "Yangi parol yaratildi", password };
}

export async function deleteStudent(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  await db.delete(users).where(and(eq(users.id, id), eq(users.role, "student")));
  revalidatePath("/admin");
  redirect("/admin");
}

export async function adminUnlinkHandle(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const platform = String(form.get("platform")) as Platform;
  if (!PLATFORMS.includes(platform)) return;
  await db.delete(handles).where(and(eq(handles.userId, id), eq(handles.platform, platform)));
  revalidatePath(`/admin/students/${id}`);
}

export async function adminSyncStudent(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  await syncUser(id, { force: true });
  revalidatePath(`/admin/students/${id}`);
  revalidatePath("/admin");
}
