import "server-only";
import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import { db, handles, solves, users } from "@/db";
import { fetchSolved } from "./judges";
import type { SolvedEntry } from "./judges/types";

/** Shundan eski bo'lsa, sahifaga kirganda avtomatik sinxronlanadi. */
export const STALE_AFTER_MS = 10 * 60 * 1000;
/** Ketma-ket qayta sinxronlashdan himoya. */
const MIN_INTERVAL_MS = 60 * 1000;

export function isStale(lastSyncedAt: Date | null) {
  return !lastSyncedAt || Date.now() - lastSyncedAt.getTime() > STALE_AFTER_MS;
}

async function saveSolves(userId: number, entries: SolvedEntry[]) {
  // Har bir masala uchun eng erta AC vaqtini olamiz.
  const earliest = new Map<string, Date>();
  for (const e of entries) {
    const prev = earliest.get(e.key);
    if (!prev || e.at < prev) earliest.set(e.key, e.at);
  }
  const rows = [...earliest].map(([problemKey, solvedAt]) => ({ userId, problemKey, solvedAt }));
  for (let i = 0; i < rows.length; i += 500) {
    await db
      .insert(solves)
      .values(rows.slice(i, i + 500))
      .onConflictDoUpdate({
        target: [solves.userId, solves.problemKey],
        set: { solvedAt: sql`least(${solves.solvedAt}, excluded.solved_at)` },
      });
  }
  return rows.length;
}

export type SyncReport = { skipped?: boolean; platforms: { platform: string; ok: boolean; count?: number; error?: string }[] };

/**
 * O'quvchining barcha ulangan handle'laridan yechimlarni yuklaydi.
 * force=false bo'lsa, oxirgi daqiqa ichida sinxronlangan foydalanuvchi o'tkazib yuboriladi.
 */
export async function syncUser(userId: number, { force = false } = {}): Promise<SyncReport> {
  // lastSyncedAt'ni darhol yangilab, parallel so'rovlarni "qulflaymiz".
  const threshold = new Date(Date.now() - MIN_INTERVAL_MS);
  const claimed = await db
    .update(users)
    .set({ lastSyncedAt: new Date() })
    .where(
      force
        ? eq(users.id, userId)
        : and(eq(users.id, userId), or(isNull(users.lastSyncedAt), lt(users.lastSyncedAt, threshold))),
    )
    .returning({ id: users.id });
  if (claimed.length === 0) return { skipped: true, platforms: [] };

  const linked = await db.select().from(handles).where(eq(handles.userId, userId));
  const results = await Promise.all(
    linked.map(async (h) => {
      try {
        const { solved, cursor } = await fetchSolved(h.platform, h.handle, h.cursor);
        const count = await saveSolves(userId, solved);
        if (cursor !== h.cursor) {
          await db
            .update(handles)
            .set({ cursor })
            .where(and(eq(handles.userId, userId), eq(handles.platform, h.platform)));
        }
        return { platform: h.platform, ok: true, count };
      } catch (e) {
        console.error(`sync ${h.platform}/${h.handle}:`, e);
        return { platform: h.platform, ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    }),
  );
  return { platforms: results };
}

/** Cron uchun: handle'i bor barcha o'quvchilarni ketma-ket sinxronlaydi. */
export async function syncAll(deadline: number) {
  const rows = await db
    .selectDistinct({ id: handles.userId, last: users.lastSyncedAt })
    .from(handles)
    .innerJoin(users, eq(users.id, handles.userId))
    .orderBy(sql`${users.lastSyncedAt} asc nulls first`);
  let done = 0;
  for (const r of rows) {
    if (Date.now() > deadline) break;
    await syncUser(r.id, { force: true });
    done++;
  }
  return { total: rows.length, done };
}

