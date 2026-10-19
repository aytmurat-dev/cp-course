"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, users } from "@/db";
import { createSession, deleteSession } from "@/lib/session";

const DUMMY_HASH = bcrypt.hashSync("timing-safe-dummy", 10);

export type LoginState = { error?: string; username?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!username || !password) return { error: "Login va parolni kiriting", username };

  const [user] = await db.select().from(users).where(eq(users.username, username));
  // Foydalanuvchi topilmasa ham hash solishtiramiz — javob vaqti bir xil bo'lsin.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "Login yoki parol noto'g'ri", username };

  await createSession(user.id, user.sessionVersion);
  redirect(user.role === "admin" ? "/admin" : "/topics");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
