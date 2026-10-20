import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db, users } from "@/db";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { ProblemTable } from "@/components/problem-table";
import { SubmitButton } from "@/components/submit-button";
import { formatDate, PlatformBadge, ProgressBar } from "@/components/ui";
import { buildActivity } from "@/lib/activity";
import { requireAdmin } from "@/lib/auth";
import { PLATFORM_LABEL, platformOfKey } from "@/lib/problems";
import { getCourse, getProblemsBySlug, type CourseChapter, type CourseTopic, type Difficulty, type Problem } from "@/lib/content";
import { getUserHandles } from "@/lib/handles";
import { getUserSolves } from "@/lib/progress";
import { adminSyncStudent, adminUnlinkHandle, deleteStudent } from "../../actions";
import { ResetPassword } from "./reset-password";

export const metadata: Metadata = { title: "O'quvchi" };

type Ctx = { problems: Map<string, Problem[]>; solved: Map<string, Date> };

const topicProblems = (t: CourseTopic, ctx: Ctx) => ctx.problems.get(t.slug) ?? [];
const countDone = (ps: Problem[], ctx: Ctx) => ps.filter((p) => ctx.solved.has(p.problemKey)).length;

/** problemKey → yechilgan vaqt xaritasini faollik xaritasi uchun platformali ro'yxatga aylantiradi. */
const toActivitySolves = (solves: Map<string, Date>) =>
  [...solves].flatMap(([key, at]) => {
    const platform = platformOfKey(key);
    return platform ? [{ at, platform }] : [];
  });

const DIFFICULTY: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: "Oson", cls: "text-ok" },
  medium: { label: "O'rta", cls: "text-warn" },
  hard: { label: "Qiyin", cls: "text-bad" },
};

export default async function StudentPage({ params, searchParams }: PageProps<"/admin/students/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const allActivity = (await searchParams).faollik === "barchasi";
  const [student] = await db.select().from(users).where(and(eq(users.id, id), eq(users.role, "student")));
  if (!student) notFound();

  const [linked, allSolves, problemsBySlug] = await Promise.all([getUserHandles(id), getUserSolves(id), getProblemsBySlug()]);
  const parts = getCourse();

  // Kursdagi har bir masala (bir nechta mavzuda bo'lsa, birinchisi) va u turgan mavzu.
  const courseProblems = new Map<string, { problem: Problem; topic: CourseTopic }>();
  for (const part of parts)
    for (const ch of part.chapters)
      for (const topic of ch.topics)
        for (const problem of problemsBySlug.get(topic.slug) ?? [])
          if (!courseProblems.has(problem.problemKey)) courseProblems.set(problem.problemKey, { problem, topic });

  const solved = new Map([...allSolves].filter(([key]) => courseProblems.has(key)));
  const ctx: Ctx = { problems: problemsBySlug, solved };
  const total = courseProblems.size;

  const byDifficulty = (["easy", "medium", "hard"] as const).map((d) => {
    const keys = [...courseProblems.values()].filter((c) => c.problem.difficulty === d).map((c) => c.problem.problemKey);
    return { difficulty: d, total: keys.length, done: keys.filter((k) => solved.has(k)).length };
  });

  const activity = buildActivity(toActivitySolves(allActivity ? allSolves : solved));
  // Ulangan platformalar va (handle uzilgan bo'lsa ham) oxirgi yilda yechimi bor platformalar.
  const activityPlatforms = [
    ...new Set([...linked.map((h) => h.platform), ...(Object.keys(activity.byPlatform) as (keyof typeof PLATFORM_LABEL)[])]),
  ];
  const recent = [...solved]
    .sort((a, b) => b[1].getTime() - a[1].getTime())
    .slice(0, 10)
    .map(([key, at]) => ({ ...courseProblems.get(key)!, at }));

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
          {linked.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {linked.map((h) => (
                <span key={h.platform} className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <PlatformBadge platform={h.platform} /> {h.handle}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold">
            {solved.size} <span className="text-base font-normal text-faint">/ {total}</span>
          </div>
          <ProgressBar value={solved.size} total={total} className="mt-1 w-40" />
          <p className="mt-1 text-xs text-faint">kurs masalalari</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {byDifficulty.map((d) => (
          <Stat key={d.difficulty} label={DIFFICULTY[d.difficulty].label} labelClass={DIFFICULTY[d.difficulty].cls}>
            <span className="text-2xl font-extrabold">
              {d.done} <span className="text-base font-normal text-faint">/ {d.total}</span>
            </span>
          </Stat>
        ))}
        <Stat label="Oxirgi yechim">
          <span className="text-lg font-extrabold">{recent[0] ? formatDate(recent[0].at) : "—"}</span>
          <span className="text-xs text-muted">Barcha platformalarda: {allSolves.size} ta masala</span>
        </Stat>
      </div>

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Faollik</h2>
            <p className="mt-0.5 max-w-2xl text-sm text-muted">
              {allActivity
                ? linked.length > 0
                  ? `Ulangan akkauntlardagi barcha yechilgan masalalar (kursdagilari ham, boshqalari ham): ${linked
                      .map((h) => `${PLATFORM_LABEL[h.platform]} — ${h.handle}`)
                      .join(", ")}.`
                  : "Hali handle ulanmagan."
                : "Faqat saytdagi mavzularga qo'shilgan masalalar. Masalalar saytda emas, Codeforces, AtCoder va Kep.uz'da yechiladi — katak masala o'sha platformada birinchi marta qabul qilingan kunni ko'rsatadi."}
            </p>
            <p className="mt-2 text-sm text-muted">
              Oxirgi yil: <b className="text-fg">{activity.total}</b> ta masala · <b className="text-fg">{activity.activeDays}</b> faol kun ·
              joriy seriya <b className="text-fg">{activity.currentStreak}</b> kun · eng uzun seriya{" "}
              <b className="text-fg">{activity.longestStreak}</b> kun
            </p>
            {activityPlatforms.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                {activityPlatforms.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5">
                    <PlatformBadge platform={p} />
                    <b>{activity.byPlatform[p] ?? 0}</b>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex rounded-lg bg-bg p-0.5 text-sm font-bold ring-1 ring-line">
            <ScopeLink href={`/admin/students/${id}`} active={!allActivity}>
              Kurs masalalari
            </ScopeLink>
            <ScopeLink href={`/admin/students/${id}?faollik=barchasi`} active={allActivity}>
              Barcha yechimlar
            </ScopeLink>
          </div>
        </div>
        <div className="mt-5">
          <ActivityHeatmap activity={activity} />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-extrabold">Mavzular bo&apos;yicha</h2>
        {total === 0 && <p className="card p-5 text-muted">Hali birorta mavzuga masala qo&apos;shilmagan.</p>}
        {parts.map((part) => {
          const chapters = part.chapters.filter((ch) => ch.topics.some((t) => topicProblems(t, ctx).length > 0));
          if (chapters.length === 0) return null;
          return (
            <div key={part.title} className="space-y-3">
              <h3 className="font-extrabold text-gradient">{part.title}</h3>
              {chapters.map((ch) => (
                <Chapter key={ch.number} chapter={ch} ctx={ctx} />
              ))}
            </div>
          );
        })}
      </section>

      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <section className="card p-5">
          <h2 className="font-extrabold">Oxirgi yechimlar</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Kurs masalalaridan hali hech narsa yechilmagan.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {recent.map(({ problem, topic, at }) => (
                <li key={problem.problemKey} className="flex items-center gap-3 py-2.5 text-sm">
                  <PlatformBadge platform={problem.platform} />
                  <div className="min-w-0 flex-1">
                    <a href={problem.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">
                      {problem.title}
                    </a>
                    <Link href={`/topics/${topic.slug}`} className="block truncate text-xs text-faint hover:text-muted">
                      {topic.number} {topic.title}
                    </Link>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{formatDate(at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <section className="card p-5">
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
            <form action={adminSyncStudent} className="mt-4 flex flex-wrap items-center gap-3">
              <input type="hidden" name="id" value={id} />
              <SubmitButton variant="secondary">Hozir sinxronlash</SubmitButton>
              <span className="text-xs text-muted">Oxirgi: {formatDate(student.lastSyncedAt)}</span>
            </form>
          </section>

          <section className="card space-y-4 p-5">
            <h2 className="font-extrabold">Akkaunt</h2>
            <ResetPassword id={id} />
            <form action={deleteStudent}>
              <input type="hidden" name="id" value={id} />
              <SubmitButton variant="danger" confirm={`${student.name} va uning barcha natijalari o'chirilsinmi?`}>
                O&apos;quvchini o&apos;chirish
              </SubmitButton>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, labelClass = "text-muted", children }: { label: string; labelClass?: string; children: React.ReactNode }) {
  return (
    <div className="card flex flex-col gap-1 p-4">
      <span className={`text-sm font-semibold ${labelClass}`}>{label}</span>
      {children}
    </div>
  );
}

function ScopeLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      replace
      className={`rounded-md px-3 py-1.5 transition ${active ? "bg-surface-2 text-fg ring-1 ring-line-strong" : "text-muted hover:text-fg"}`}
    >
      {children}
    </Link>
  );
}

function Chapter({ chapter, ctx }: { chapter: CourseChapter; ctx: Ctx }) {
  const topics = chapter.topics.filter((t) => topicProblems(t, ctx).length > 0);
  const all = topics.flatMap((t) => topicProblems(t, ctx));
  return (
    <div className="card overflow-hidden">
      {!chapter.single && (
        <div className="flex items-center gap-4 border-b border-line bg-surface-2/50 px-4 py-3">
          <span className="w-10 shrink-0 font-extrabold text-faint">{chapter.number}.</span>
          <h4 className="min-w-0 flex-1 font-extrabold">{chapter.title}</h4>
          <Count done={countDone(all, ctx)} total={all.length} />
        </div>
      )}
      <div className="divide-y divide-line">
        {topics.map((t) => (
          <TopicRow key={t.slug} topic={t} ctx={ctx} heading={chapter.single} />
        ))}
      </div>
    </div>
  );
}

function TopicRow({ topic, ctx, heading }: { topic: CourseTopic; ctx: Ctx; heading: boolean }) {
  const problems = topicProblems(topic, ctx);
  const done = countDone(problems, ctx);
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-3 hover:bg-surface-2">
        <span className={`w-10 shrink-0 font-extrabold text-faint ${heading ? "" : "text-sm"}`}>
          {topic.number}
          {heading && "."}
        </span>
        <span className={`min-w-0 flex-1 ${heading ? "font-extrabold" : "font-bold"}`}>
          {topic.title}
          {done === problems.length && <span className="ml-2 text-xs font-bold text-ok">✓ tugatilgan</span>}
        </span>
        <div className="w-24 shrink-0 sm:w-32">
          <Count done={done} total={problems.length} />
          <ProgressBar value={done} total={problems.length} className="mt-1.5" />
        </div>
        <span className="text-faint transition group-open:rotate-90" aria-hidden>
          ▸
        </span>
      </summary>
      <div className="border-t border-line bg-bg/40">
        <ProblemTable problems={problems} solved={ctx.solved} bare showSolvedAt />
      </div>
    </details>
  );
}

function Count({ done, total }: { done: number; total: number }) {
  return (
    <div className="text-right text-sm font-bold">
      {done}
      <span className="font-normal text-faint"> / {total}</span>
    </div>
  );
}
