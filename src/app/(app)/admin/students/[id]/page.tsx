import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db, users } from "@/db";
import { ProblemTable } from "@/components/problem-table";
import { SubmitButton } from "@/components/submit-button";
import { formatDate, PlatformBadge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getSections } from "@/lib/content";
import { getUserHandles } from "@/lib/handles";
import { getCourseSolves } from "@/lib/progress";
import { adminSyncStudent, adminUnlinkHandle, deleteStudent } from "../../actions";
import { ResetPassword } from "./reset-password";

export const metadata: Metadata = { title: "O'quvchi" };

export default async function StudentPage({ params }: PageProps<"/admin/students/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [student] = await db.select().from(users).where(and(eq(users.id, id), eq(users.role, "student")));
  if (!student) notFound();

  const [linked, solved] = await Promise.all([getUserHandles(id), getCourseSolves(id)]);
  const sections = getSections();
  const total = sections.reduce((n, s) => n + s.topics.reduce((m, t) => m + t.problems.length, 0), 0);

  return (
    <div className="space-y-8">
      <Link href="/admin" className="text-sm font-semibold text-muted hover:text-fg">
        ← Admin panel
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            <span className="text-gradient">{student.name}</span>
          </h1>
          <p className="mt-1 text-muted">
            @{student.username} · qo&apos;shilgan: {formatDate(student.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold">
            {solved.size} <span className="text-base font-normal text-faint">/ {total}</span>
          </div>
          <ProgressBar value={solved.size} total={total} className="mt-1 w-40" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-extrabold">Platformalar</h2>
          <ul className="mt-3 space-y-2">
            {linked.length === 0 && <li className="text-sm text-muted">Hali handle ulanmagan</li>}
            {linked.map((h) => (
              <li key={h.platform} className="flex items-center gap-3">
                <PlatformBadge platform={h.platform} />
                <span className="font-semibold">{h.handle}</span>
                <form action={adminUnlinkHandle} className="ml-auto">
                  <input type="hidden" name="id" value={id} />
                  <input type="hidden" name="platform" value={h.platform} />
                  <button className="text-xs font-semibold text-muted hover:text-bad">Uzish</button>
                </form>
              </li>
            ))}
          </ul>
          <form action={adminSyncStudent} className="mt-4 flex items-center gap-3">
            <input type="hidden" name="id" value={id} />
            <SubmitButton variant="secondary">Hozir sinxronlash</SubmitButton>
            <span className="text-xs text-muted">Oxirgi: {formatDate(student.lastSyncedAt)}</span>
          </form>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="font-extrabold">Akkaunt</h2>
          <ResetPassword id={id} />
          <form action={deleteStudent}>
            <input type="hidden" name="id" value={id} />
            <SubmitButton variant="danger" confirm={`${student.name} va uning barcha natijalari o'chirilsinmi?`}>
              O&apos;quvchini o&apos;chirish
            </SubmitButton>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-extrabold">Mavzular bo&apos;yicha</h2>
        {sections.flatMap((sec) =>
          sec.topics.map((t) => {
            const done = t.problems.filter((p) => solved.has(p.key)).length;
            return (
              <details key={t.slug} className="card group overflow-hidden">
                <summary className="flex cursor-pointer list-none items-center gap-4 p-4 hover:bg-surface-2">
                  <span className="text-faint transition group-open:rotate-90">▸</span>
                  <span className="flex-1 font-bold">
                    {t.title} <span className="ml-2 text-xs font-normal text-faint">{sec.name}</span>
                  </span>
                  <span className="text-sm font-bold">
                    {done} <span className="text-faint">/ {t.problems.length}</span>
                  </span>
                  <ProgressBar value={done} total={t.problems.length} className="w-24" />
                </summary>
                <div className="border-t border-line p-3">
                  <ProblemTable problems={t.problems} solved={solved} />
                </div>
              </details>
            );
          }),
        )}
      </div>
    </div>
  );
}
