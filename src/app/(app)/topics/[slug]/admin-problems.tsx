"use client";

import { useActionState, useEffect, useState } from "react";
import type { Problem } from "@/db/schema";
import { SubmitButton } from "@/components/submit-button";
import { Button, DifficultyLabel, Field, FormError, FormSuccess, PlatformBadge } from "@/components/ui";
import { addProblem, deleteProblem, moveProblem, updateProblem, type ProblemFormState } from "./actions";

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Oson" },
  { value: "medium", label: "O'rta" },
  { value: "hard", label: "Qiyin" },
];

const selectCls =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-fg focus:border-accent focus:outline-none";

/** Admin uchun: mavzu masalalarini qo'shish, tahrirlash, o'chirish va tartiblash. */
export function AdminProblems({ slug, problems }: { slug: string; problems: Problem[] }) {
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {problems.length > 0 && (
        <ul className="card divide-y divide-line">
          {problems.map((p, i) => (
            <li key={p.id} className="p-3 sm:px-4">
              {editing === p.id ? (
                <EditForm problem={p} onDone={() => setEditing(null)} />
              ) : (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="w-6 text-sm text-faint">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <a href={p.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">
                      {p.title} <span className="text-faint">↗</span>
                    </a>
                    {p.note && <p className="text-sm text-muted">{p.note}</p>}
                  </div>
                  <PlatformBadge platform={p.platform} />
                  <span className="w-24">
                    <DifficultyLabel difficulty={p.difficulty} rating={p.rating ?? undefined} />
                  </span>
                  <div className="flex items-center gap-1">
                    <MoveButton id={p.id} dir="up" disabled={i === 0} />
                    <MoveButton id={p.id} dir="down" disabled={i === problems.length - 1} />
                    <Button type="button" variant="ghost" className="px-2.5 py-1.5" onClick={() => setEditing(p.id)}>
                      Tahrirlash
                    </Button>
                    <form action={deleteProblem}>
                      <input type="hidden" name="id" value={p.id} />
                      <SubmitButton variant="ghost" className="px-2.5 py-1.5 hover:text-bad" confirm={`"${p.title}" o'chirilsinmi?`}>
                        O&apos;chirish
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <AddForm slug={slug} />
    </div>
  );
}

function MoveButton({ id, dir, disabled }: { id: number; dir: "up" | "down"; disabled: boolean }) {
  return (
    <form action={moveProblem}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <SubmitButton
        variant="ghost"
        className="px-2 py-1.5"
        disabled={disabled}
        aria-label={dir === "up" ? "Yuqoriga" : "Pastga"}
      >
        {dir === "up" ? "↑" : "↓"}
      </SubmitButton>
    </form>
  );
}

function AddForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState<ProblemFormState, FormData>(addProblem, {});

  return (
    <form action={action} className="card space-y-3 border-dashed p-4">
      <input type="hidden" name="slug" value={slug} />
      <p className="text-sm font-extrabold">Masala qo&apos;shish</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
        <Field
          label="Havola (Codeforces, AtCoder yoki Kep.uz)"
          name="url"
          type="url"
          placeholder="https://codeforces.com/problemset/problem/313/B"
          defaultValue={state.url}
          required
          autoComplete="off"
        />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-muted">Qiyinlik</span>
          <select name="difficulty" defaultValue="" className={selectCls}>
            <option value="">Avtomatik</option>
            {DIFFICULTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Field
        label="Izoh (ixtiyoriy)"
        name="note"
        placeholder="Qisqa maslahat, yechimni oshkor qilmasin"
        defaultValue={state.note}
        autoComplete="off"
      />
      <FormError message={state.error} />
      <FormSuccess message={state.success} />
      <Button type="submit" pending={pending}>
        Qo&apos;shish
      </Button>
      <p className="text-xs text-faint">
        Nomi va reytingi platformadan avtomatik olinadi. Qiyinlik: Codeforces reytingi bo&apos;yicha (≤1200 oson,
        ≤1700 o&apos;rta), AtCoder harfi bo&apos;yicha (ABC A–B oson, C–D o&apos;rta), Kep.uz darajasi bo&apos;yicha (1–3 oson,
        4–5 o&apos;rta).
      </p>
    </form>
  );
}

function EditForm({ problem, onDone }: { problem: Problem; onDone: () => void }) {
  const [state, action, pending] = useActionState<ProblemFormState, FormData>(updateProblem, {});
  useEffect(() => {
    if (state.success) onDone();
  }, [state, onDone]);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={problem.id} />
      <div className="grid gap-3 sm:grid-cols-[1fr_9rem_7rem]">
        <Field label="Nomi" name="title" defaultValue={problem.title} required />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-muted">Qiyinlik</span>
          <select name="difficulty" defaultValue={problem.difficulty} className={selectCls}>
            {DIFFICULTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="Reyting" name="rating" inputMode="numeric" defaultValue={problem.rating ?? ""} />
      </div>
      <Field label="Izoh" name="note" defaultValue={problem.note ?? ""} />
      <p className="truncate text-xs text-faint">{problem.url}</p>
      <FormError message={state.error} />
      <div className="flex gap-2">
        <Button type="submit" pending={pending}>
          Saqlash
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}
