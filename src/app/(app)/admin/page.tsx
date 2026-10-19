import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { db, handles, users } from "@/db";
import { formatDate, PlatformBadge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getProblemCount } from "@/lib/content";
import { getCourseSolveCounts } from "@/lib/progress";
import { CreateStudentForm } from "./create-student-form";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  await requireAdmin();
  const [students, allHandles, counts, total] = await Promise.all([
    db.select().from(users).where(eq(users.role, "student")).orderBy(asc(users.name)),
    db.select().from(handles),
    getCourseSolveCounts(),
    getProblemCount(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">
          <span className="text-gradient">Admin panel</span>
        </h1>
        <p className="mt-1 text-muted">
          {students.length} o&apos;quvchi · kursda {total} masala
        </p>
      </div>

      <CreateStudentForm />

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-faint">
            <tr>
              <th className="px-4 py-3 font-bold">O&apos;quvchi</th>
              <th className="px-4 py-3 font-bold">Platformalar</th>
              <th className="px-4 py-3 font-bold">Progress</th>
              <th className="px-4 py-3 font-bold">Oxirgi sinxronlash</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  Hali o&apos;quvchi yo&apos;q
                </td>
              </tr>
            )}
            {students
              .map((s) => ({ ...s, solved: counts.get(s.id) ?? 0 }))
              .sort((a, b) => b.solved - a.solved)
              .map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${s.id}`} className="font-bold hover:text-accent">
                      {s.name}
                    </Link>
                    <div className="text-faint">@{s.username}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {allHandles
                        .filter((h) => h.userId === s.id)
                        .map((h) => (
                          <span key={h.platform} title={h.handle}>
                            <PlatformBadge platform={h.platform} />
                          </span>
                        ))}
                      {!allHandles.some((h) => h.userId === s.id) && <span className="text-faint">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold">
                      {s.solved} <span className="font-normal text-faint">/ {total}</span>
                    </div>
                    <ProgressBar value={s.solved} total={total} className="mt-1 w-28" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(s.lastSyncedAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
