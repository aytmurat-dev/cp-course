import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { syncUser } from "@/lib/sync";

export const maxDuration = 60;

/** Joriy foydalanuvchining yechimlarini sinxronlaydi. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { force?: boolean };
  // "force" ham kamida 60 soniyalik himoyadan o'tadi — faqat admin cheklovsiz.
  const report = await syncUser(user.id, { force: user.role === "admin" && !!body.force });
  return NextResponse.json(report);
}
