import type { Metadata } from "next";
import Link from "next/link";
import { SyncStatus } from "@/components/sync-status";
import { formatDate, ProgressBar } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getSections } from "@/lib/content";
import { getUserHandles } from "@/lib/handles";
import { getCourseSolves } from "@/lib/progress";
import { isStale } from "@/lib/sync";

export const metadata: Metadata = { title: "Mavzular" };

export default async function TopicsPage() {
  const user = await requireUser();
  const [solved, linked] = await Promise.all([getCourseSolves(user.id), getUserHandles(user.id)]);
  const sections = getSections();
  const total = sections.reduce((n, s) => n + s.topics.reduce((m, t) => m + t.problems.length, 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            <span className="text-gradient">Mavzular</span>
          </h1>
          <p className="mt-1 text-muted">
            Salom, {user.name}! Jami {solved.size} / {total} masala yechilgan.
          </p>
        </div>
        {user.role === "student" && (
          <SyncStatus stale={isStale(user.lastSyncedAt)} hasHandles={linked.length > 0} lastSynced={formatDate(user.lastSyncedAt)} />
        )}
      </div>

      {sections.length === 0 && <p className="card mt-8 p-6 text-muted">Hozircha mavzular yo&apos;q.</p>}

      <div className="mt-8 space-y-10">
        {sections.map((sec) => (
          <section key={sec.name}>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-muted">{sec.name}</h2>
            <div className="space-y-2.5">
              {sec.topics.map((t) => {
                const done = t.problems.filter((p) => solved.has(p.key)).length;
                return (
                  <Link
                    key={t.slug}
                    href={`/topics/${t.slug}`}
                    className="card group flex items-center gap-4 p-4 transition hover:border-line-strong hover:bg-surface-2 sm:p-5"
                  >
                    <span className="hidden w-8 shrink-0 text-center text-lg font-extrabold text-faint sm:block">
                      {t.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold group-hover:text-accent">{t.title}</h3>
                      <p className="mt-0.5 truncate text-sm text-muted">{t.summary}</p>
                    </div>
                    <div className="w-24 shrink-0 text-right sm:w-32">
                      <div className="text-sm font-bold">
                        {done}
                        <span className="text-faint"> / {t.problems.length}</span>
                      </div>
                      <ProgressBar value={done} total={t.problems.length} className="mt-1.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
