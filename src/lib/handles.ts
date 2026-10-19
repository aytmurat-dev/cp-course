import "server-only";
import { eq } from "drizzle-orm";
import { db, handles } from "@/db";

export async function getUserHandles(userId: number) {
  return db.select().from(handles).where(eq(handles.userId, userId));
}
