"use client";

import { useActionState } from "react";
import { Button, Field, FormError } from "@/components/ui";
import { createStudent, type AdminState } from "./actions";

export function CreateStudentForm() {
  const [state, action, pending] = useActionState<AdminState, FormData>(createStudent, {});
  return (
    <form action={action} className="card p-5">
      <h2 className="font-extrabold">Yangi o&apos;quvchi</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Login" name="username" placeholder="ali_valiyev" required autoComplete="off" />
        <Field label="Ism familiya" name="name" placeholder="Ali Valiyev" required autoComplete="off" />
        <Field label="Parol" name="password" placeholder="bo'sh qolsa — avtomatik" autoComplete="new-password" />
      </div>
      <div className="mt-4 space-y-3">
        <FormError message={state.error} />
        {state.password && <Credentials username={state.username!} password={state.password} />}
        <Button type="submit" pending={pending}>
          Qo&apos;shish
        </Button>
      </div>
    </form>
  );
}

export function Credentials({ username, password }: { username?: string; password: string }) {
  const text = username ? `Login: ${username}\nParol: ${password}` : `Parol: ${password}`;
  return (
    <div className="rounded-lg bg-ok/10 p-3 text-sm ring-1 ring-ok/25">
      <p className="font-bold text-ok">O&apos;quvchiga yuboring (parol qayta ko&apos;rsatilmaydi):</p>
      <pre className="mt-2 select-all font-mono text-fg">{text}</pre>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(text)}
        className="mt-2 text-xs font-semibold text-accent hover:underline"
      >
        Nusxalash
      </button>
    </div>
  );
}
