import type { Metadata } from "next";
import Link from "next/link";
import { SyncStatus } from "@/components/sync-status";
import { formatDate, ProgressBar } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getCourse, getProblemCount, getProblemsBySlug, isAvailable, type CourseChapter, type CourseTopic, type Problem } from "@/lib/content";
import { getUserHandles } from "@/lib/handles";
import { getCourseSolves } from "@/lib/progress";
import { isStale } from "@/lib/sync";

export const metadata: Metadata = { title: "Mavzular" };

type Ctx = { solved: Map<string, Date>; problems: Map<string, Problem[]>; isAdmin: boolean };

const topicProblems = (t: CourseTopic, ctx: Ctx) => ctx.problems.get(t.slug) ?? [];
const countDone = (t: CourseTopic, ctx: Ctx) => topicProblems(t, ctx).filter((p) => ctx.solved.has(p.problemKey)).length;

export default async function TopicsPage() {
  const user = await requireUser();
  const [solved, linked, problems, total] = await Promise.all([
    getCourseSolves(user.id),
    getUserHandles(user.id),
    getProblemsBySlug(),
    getProblemCount(),
  ]);
  const ctx: Ctx = { solved, problems, isAdmin: user.role === "admin" };
  const parts = getCourse();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            <span className="text-gradient">Mavzular</span>
          </h1>
          <p className="mt-1 text-muted">
            Salom, {user.name}!{" "}
            {ctx.isAdmin ? `Kursda jami ${total} ta masala.` : `Jami ${solved.size} / ${total} masala yechilgan.`}
          </p>
        </div>
        {user.role === "student" && (
          <SyncStatus stale={isStale(user.lastSyncedAt)} hasHandles={linked.length > 0} lastSynced={formatDate(user.lastSyncedAt)} />
        )}
      </div>

      <div className="mt-10 space-y-14">
        {parts.map((part) => (
          <section key={part.title}>
            <h2 className="mb-5 text-2xl font-extrabold">
              <span className="text-gradient">{part.title}</span>
            </h2>
            <div className="space-y-3">
              {part.chapters.map((ch) => (
                <Chapter key={ch.number} chapter={ch} ctx={ctx} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Chapter({ chapter, ctx }: { chapter: CourseChapter; ctx: Ctx }) {
  if (chapter.single) {
    return (
      <div className="card overflow-hidden">
        <TopicRow topic={chapter.topics[0]} ctx={ctx} heading />
      </div>
    );
  }
  const done = chapter.topics.reduce((n, t) => n + countDone(t, ctx), 0);
  const total = chapter.topics.reduce((n, t) => n + topicProblems(t, ctx).length, 0);
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-4 border-b border-line bg-surface-2/50 px-4 py-3.5 sm:px-5">
        <span className="w-10 shrink-0 text-lg font-extrabold text-faint">{chapter.number}.</span>
        <h3 className="min-w-0 flex-1 text-lg font-extrabold">{chapter.title}</h3>
        {total > 0 && (
          <span className="shrink-0 text-sm font-bold text-muted">
            {ctx.isAdmin ? (
              <ProblemCount total={total} />
            ) : (
              <>
                {done} <span className="font-normal text-faint">/ {total}</span>
              </>
            )}
          </span>
        )}
      </div>
      <ul className="divide-y divide-line">
        {chapter.topics.map((t) => (
          <li key={t.slug}>
            <TopicRow topic={t} ctx={ctx} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopicRow({ topic, ctx, heading }: { topic: CourseTopic; ctx: Ctx; heading?: boolean }) {
  const available = isAvailable(topic, ctx.problems);
  // Admin "Tez orada" mavzularni ham ochadi — masala qo'shish uchun.
  const clickable = available || ctx.isAdmin;
  const total = topicProblems(topic, ctx).length;
  const done = countDone(topic, ctx);

  const inner = (
    <>
      <span className={`w-10 shrink-0 font-extrabold text-faint ${heading ? "text-lg" : "text-sm"}`}>
        {topic.number}
        {heading && "."}
      </span>
      <div className="min-w-0 flex-1">
        <span className={`${heading ? "text-lg font-extrabold" : "font-bold"} ${clickable ? "group-hover:text-accent" : ""}`}>
          {topic.title}
        </span>
        {topic.content && <p className="mt-0.5 truncate text-sm text-muted">{topic.content.summary}</p>}
      </div>
      {total > 0 && ctx.isAdmin ? (
        <span className="shrink-0 text-sm font-bold text-muted">
          <ProblemCount total={total} />
        </span>
      ) : total > 0 ? (
        <div className="w-24 shrink-0 text-right sm:w-32">
          <div className="text-sm font-bold">
            {done}
            <span className="text-faint"> / {total}</span>
          </div>
          <ProgressBar value={done} total={total} className="mt-1.5" />
        </div>
      ) : (
        !available && (
          <span className="shrink-0 rounded-md px-2 py-0.5 text-xs font-bold text-faint ring-1 ring-line">Tez orada</span>
        )
      )}
    </>
  );
  const cls = `flex items-center gap-4 px-4 sm:px-5 ${heading ? "py-4" : "py-3"}`;
  if (!clickable) return <div className={`${cls} opacity-60`}>{inner}</div>;
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className={`${cls} group transition hover:bg-surface-2 ${available ? "" : "opacity-60 hover:opacity-100"}`}
    >
      {inner}
    </Link>
  );
}

// Admin masala yechmaydi — unga progress emas, masalalar soni ko'rsatiladi.
function ProblemCount({ total }: { total: number }) {
  return (
    <>
      {total} <span className="font-normal text-faint">ta masala</span>
    </>
  );
}
