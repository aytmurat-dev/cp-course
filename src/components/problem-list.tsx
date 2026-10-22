"use client";

import { useState } from "react";
import type { Difficulty, Problem } from "@/db/schema";
import { ProblemTable } from "./problem-table";

type Filter = "all" | Difficulty | "unsolved";

const FILTERS: { value: Filter; label: string; dot?: string }[] = [
  { value: "all", label: "Hammasi" },
  { value: "easy", label: "Oson", dot: "bg-ok" },
  { value: "medium", label: "O'rta", dot: "bg-warn" },
  { value: "hard", label: "Qiyin", dot: "bg-bad" },
  { value: "unsolved", label: "Yechilmagan" },
];

/** Masalalar jadvali + qiyinlik / yechilmagan bo'yicha filtr. Raqamlar asl tartibda qoladi. */
export function ProblemList({ problems, solved, showUnsolved }: { problems: Problem[]; solved: Map<string, Date>; showUnsolved: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  if (problems.length === 0) return <ProblemTable problems={problems} solved={solved} />;

  const matches = (p: Problem, f: Filter) =>
    f === "all" || (f === "unsolved" ? !solved.has(p.problemKey) : p.difficulty === f);
  const numbers = new Map(problems.map((p, i) => [p.id, i + 1]));
  const shown = problems.filter((p) => matches(p, filter));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Masalalarni saralash">
        {FILTERS.filter((f) => f.value !== "unsolved" || showUnsolved).map((f) => {
          const count = problems.filter((p) => matches(p, f.value)).length;
          if (count === 0 && f.value !== "all" && f.value !== "unsolved") return null;
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.value)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ring-1 transition ${
                active ? "bg-surface-2 text-fg ring-line-strong" : "text-muted ring-line hover:text-fg"
              }`}
            >
              {f.dot && <span className={`size-2 rounded-full ${f.dot}`} aria-hidden />}
              {f.label}
              <span className="font-normal text-faint">{count}</span>
            </button>
          );
        })}
      </div>
      {shown.length === 0 ? (
        <p className="card p-5 text-muted">
          {filter === "unsolved" ? "Barcha masalalar yechilgan — ajoyib!" : "Bu toifada masala yo'q."}
        </p>
      ) : (
        <ProblemTable problems={shown} solved={solved} numbers={numbers} />
      )}
    </div>
  );
}
