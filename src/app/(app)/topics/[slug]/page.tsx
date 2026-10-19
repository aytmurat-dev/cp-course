import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { ProblemTable } from "@/components/problem-table";
import { SyncStatus } from "@/components/sync-status";
import { formatDate, ProgressBar } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getTopic, getTopics } from "@/lib/content";
import { getUserHandles } from "@/lib/handles";
import { getCourseSolves } from "@/lib/progress";
import { isStale } from "@/lib/sync";

export async function generateMetadata({ params }: PageProps<"/topics/[slug]">): Promise<Metadata> {
  const topic = getTopic((await params).slug);
  return { title: topic?.title ?? "Mavzu topilmadi" };
}

export default async function TopicPage({ params }: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const user = await requireUser();
  const [solved, linked] = await Promise.all([getCourseSolves(user.id), getUserHandles(user.id)]);
  const done = topic.problems.filter((p) => solved.has(p.key)).length;

  const all = getTopics();
  const idx = all.findIndex((t) => t.slug === slug);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const prereq = topic.prerequisites.map((s) => all.find((t) => t.slug === s)).filter((t) => !!t);

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/topics" className="text-sm font-semibold text-muted hover:text-fg">
        ← Mavzular
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">
          {topic.section} · {topic.order}-mavzu
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
          <span className="text-gradient">{topic.title}</span>
        </h1>
        <p className="mt-3 text-lg text-muted">{topic.summary}</p>
        {prereq.length > 0 && (
          <p className="mt-3 text-sm text-muted">
            Avval o&apos;qing:{" "}
            {prereq.map((t, i) => (
              <span key={t.slug}>
                {i > 0 && ", "}
                <Link href={`/topics/${t.slug}`} className="font-semibold text-accent hover:underline">
                  {t.title}
                </Link>
              </span>
            ))}
          </p>
        )}
      </header>

      <div className="mt-10">
        <Markdown>{topic.body}</Markdown>
      </div>

      <section id="masalalar" className="mt-16 scroll-mt-20">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold">Masalalar</h2>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted">
              <ProgressBar value={done} total={topic.problems.length} className="w-32" />
              {done} / {topic.problems.length} yechilgan
            </div>
          </div>
          {user.role === "student" && (
            <SyncStatus stale={isStale(user.lastSyncedAt)} hasHandles={linked.length > 0} lastSynced={formatDate(user.lastSyncedAt)} />
          )}
        </div>
        <ProblemTable problems={topic.problems} solved={solved} />
      </section>

      <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/topics/${prev.slug}`} className="card p-4 hover:border-line-strong">
            <span className="text-xs text-faint">← Oldingi</span>
            <span className="mt-1 block font-bold">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/topics/${next.slug}`} className="card p-4 text-right hover:border-line-strong">
            <span className="text-xs text-faint">Keyingi →</span>
            <span className="mt-1 block font-bold">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
