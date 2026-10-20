import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const PLATFORMS = ["codeforces", "atcoder", "kep"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "student"] }).notNull().default("student"),
  // Parol almashtirilganda oshiriladi — eski sessiyalar bekor bo'ladi.
  sessionVersion: integer("session_version").notNull().default(0),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Tasdiqlangan (egaligi isbotlangan) handle'lar. */
export const handles = pgTable(
  "handles",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    platform: text("platform", { enum: PLATFORMS }).notNull(),
    handle: text("handle").notNull(),
    // Platformaga xos sinxronizatsiya kursori (AtCoder: from_second, Codeforces: 1 = to'liq yuklangan).
    cursor: bigint("cursor", { mode: "number" }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.platform] }),
    uniqueIndex("handles_platform_handle_uq").on(t.platform, sql`lower(${t.handle})`),
  ],
);

/** Davom etayotgan handle tasdiqlash jarayonlari. */
export const verifications = pgTable(
  "verifications",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    platform: text("platform", { enum: PLATFORMS }).notNull(),
    handle: text("handle").notNull(),
    // Codeforces: masala ("4/A"), AtCoder: profilga yoziladigan kod.
    challenge: text("challenge").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.platform] })],
);

/** O'quvchi yechgan masalalar. problemKey: "cf:1234A", "ac:abc300_a". */
export const solves = pgTable(
  "solves",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    problemKey: text("problem_key").notNull(),
    solvedAt: timestamp("solved_at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.problemKey] }), index("solves_key_idx").on(t.problemKey)],
);

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Mavzu oxiridagi masalalar — admin paneldan qo'shiladi. topicSlug: content/course.yaml dagi slug. */
export const topicProblems = pgTable(
  "topic_problems",
  {
    id: serial("id").primaryKey(),
    topicSlug: text("topic_slug").notNull(),
    problemKey: text("problem_key").notNull(),
    platform: text("platform", { enum: PLATFORMS }).notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    difficulty: text("difficulty", { enum: DIFFICULTIES }).notNull(),
    rating: integer("rating"),
    note: text("note"),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("topic_problems_topic_key_uq").on(t.topicSlug, t.problemKey),
    index("topic_problems_topic_pos_idx").on(t.topicSlug, t.position),
  ],
);

export type User = typeof users.$inferSelect;
export type Problem = typeof topicProblems.$inferSelect;
export type Handle = typeof handles.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
