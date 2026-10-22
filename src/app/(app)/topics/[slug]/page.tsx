import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { ProblemList } from "@/components/problem-list";
import { SyncStatus } from "@/components/sync-status";
import { formatDate, ProgressBar } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getCourseTopic, getCourseTopics, getProblemsBySlug, isAvailable } from "@/lib/content";
import { getUserHandles } from "@/lib/handles";
import { getCourseSolves } from "@/lib/progress";
import { isStale } from "@/lib/sync";
import { AdminProblems } from "./admin-problems";

export async function generateMetadata({ params }: PageProps<"/topics/[slug]">): Promise<Metadata> {
  const topic = getCourseTopic((await params).slug);
  return { title: topic ? `${topic.number}. ${topic.title}` : "Mavzu topilmadi" };
}

type Tab = "theory" | "problems";

export default async function TopicPage({ params, searchParams }: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const topic = getCourseTopic(slug);
  if (!topic) notFound();

  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const problemsBySlug = await getProblemsBySlug();
  // Matni ham, masalasi ham yo'q mavzu o'quvchiga ko'rinmaydi; admin esa uni to'ldirishi uchun ochadi.
  if (!isAdmin && !isAvailable(topic, problemsBySlug)) notFound();

  const problems = problemsBySlug.get(slug) ?? [];
  const [solved, linked] = await Promise.all([getCourseSolves(user.id), getUserHandles(user.id)]);
  const done = problems.filter((p) => solved.has(p.problemKey)).length;
  const content = topic.content;
  // Matni yozilmagan mavzu darhol masalalar bilan ochiladi.
  const tab: Tab = !content || (await searchParams).tab === "masalalar" ? "problems" : "theory";

  // Oldingi/keyingi — o'quvchiga ochiq mavzular orasida.
  const all = getCourseTopics();
  const open = all.filter((t) => t.slug === slug || isAvailable(t, problemsBySlug));
  const idx = open.findIndex((t) => t.slug === slug);
  const prev = open[idx - 1];
  const next = open[idx + 1];
  const prereq = (content?.prerequisites ?? []).map((s) => all.find((t) => t.slug === s)).filter((t) => !!t);

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/topics" className="text-sm font-semibold text-muted hover:text-fg">
        ← Mavzular
      </Link>

      <header className="mt-6">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">
          {topic.partTitle} · {topic.chapterTitle}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
          <span className="text-faint">{topic.number}. </span>
          <span className="text-gradient">{topic.title}</span>
        </h1>
        {content && <p className="mt-3 text-lg text-muted">{content.summary}</p>}
        {prereq.length > 0 && (
          <p className="mt-3 text-sm text-muted">
            Avval o&apos;qing:{" "}
            {prereq.map((t, i) => (
              <span key={t.slug}>
                {i > 0 && ", "}
                {isAvailable(t, problemsBySlug) ? (
                  <Link href={`/topics/${t.slug}`} className="font-semibold text-accent hover:underline">
                    {t.number}. {t.title}
                  </Link>
                ) : (
                  <span className="font-semibold">
                    {t.number}. {t.title}
                  </span>
                )}
              </span>
            ))}
          </p>
        )}
      </header>

      <Tabs slug={slug} tab={tab} hasContent={!!content} done={done} total={problems.length} showProgress={!isAdmin} />

      {tab === "theory" ? (
        <div className="mt-8">
          <Markdown>{content!.body}</Markdown>
          {problems.length > 0 && (
            <Link
              href={`/topics/${slug}?tab=masalalar`}
              className="card mt-14 flex items-center justify-between gap-4 p-5 transition hover:border-line-strong"
            >
              <div>
                <p className="font-extrabold">Nazariyani o&apos;qib bo&apos;ldingizmi?</p>
                <p className="mt-0.5 text-sm text-muted">Endi masalalarni yeching — {problems.length} ta masala sizni kutmoqda.</p>
              </div>
              <span className="shrink-0 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-bold text-[#0b0b12]">
                Masalalarga o&apos;tish →
              </span>
            </Link>
          )}
        </div>
      ) : (
        <section className="mt-8">
          {!content && (
            <p className="card mb-6 p-5 text-muted">
              Mavzu matni hali yozilmagan.
              {isAdmin && (
                <>
                  {" "}
                  Uni <code className="font-mono text-fg">content/topics/{slug}.md</code> fayliga qo&apos;shing.
                </>
              )}
            </p>
          )}
          {user.role === "student" && problems.length > 0 && (
            <div className="mb-4 flex justify-end">
              <SyncStatus stale={isStale(user.lastSyncedAt)} hasHandles={linked.length > 0} lastSynced={formatDate(user.lastSyncedAt)} />
            </div>
          )}
          {isAdmin ? (
            <AdminProblems slug={slug} problems={problems} />
          ) : (
            <ProblemList problems={problems} solved={solved} showUnsolved />
          )}
        </section>
      )}

      <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/topics/${prev.slug}`} className="card p-4 hover:border-line-strong">
            <span className="text-xs text-faint">← Oldingi</span>
            <span className="mt-1 block font-bold">
              {prev.number}. {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/topics/${next.slug}`} className="card p-4 text-right hover:border-line-strong">
            <span className="text-xs text-faint">Keyingi →</span>
            <span className="mt-1 block font-bold">
              {next.number}. {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}

function Tabs(props: { slug: string; tab: Tab; hasContent: boolean; done: number; total: number; showProgress: boolean }) {
  const { slug, tab, hasContent, done, total, showProgress } = props;
  const cls = (active: boolean) =>
    `-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 pt-4 text-sm font-bold transition sm:text-base ${
      active ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"
    }`;
  return (
    // Sahifa sarlavhasi (h-14) ostida yopishib turadi — uzun matn o'rtasidan ham masalalarga bir bosishda o'tiladi.
    <nav className="sticky top-14 z-10 -mx-4 mt-8 border-b border-line bg-bg/85 px-4 backdrop-blur" aria-label="Mavzu bo'limlari">
      <div className="flex items-center gap-6">
        {hasContent && (
          <Link href={`/topics/${slug}`} className={cls(tab === "theory")} aria-current={tab === "theory" ? "page" : undefined}>
            Nazariya
          </Link>
        )}
        <Link
          href={`/topics/${slug}?tab=masalalar`}
          className={cls(tab === "problems")}
          aria-current={tab === "problems" ? "page" : undefined}
        >
          Masalalar
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold text-muted ring-1 ring-line">
            {showProgress && total > 0 ? `${done} / ${total}` : total}
          </span>
        </Link>
        {showProgress && total > 0 && (
          <ProgressBar value={done} total={total} className="ml-auto hidden w-32 sm:block" />
        )}
      </div>
    </nav>
  );
}
