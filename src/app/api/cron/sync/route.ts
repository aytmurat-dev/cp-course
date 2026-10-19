import { NextResponse } from "next/server";
import { syncAll } from "@/lib/sync";

export const maxDuration = 300;

/** Vercel Cron: har kuni barcha o'quvchilarni sinxronlaydi (vercel.json). */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await syncAll(Date.now() + (maxDuration - 30) * 1000);
  return NextResponse.json(result);
}
