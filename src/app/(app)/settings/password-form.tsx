"use client";

import { useActionState } from "react";
import { Button, Field, FormError, FormSuccess } from "@/components/ui";
import { changePassword, type ActionState } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePassword, {});
  return (
    <form action={action} className="card mt-4 grid gap-4 p-5 sm:grid-cols-3">
      <Field label="Joriy parol" name="current" type="password" autoComplete="current-password" required />
      <Field label="Yangi parol" name="next" type="password" autoComplete="new-password" minLength={6} required />
      <Field label="Yangi parol (takror)" name="confirm" type="password" autoComplete="new-password" required />
      <div className="space-y-3 sm:col-span-3">
        <FormError message={state.error} />
        <FormSuccess message={state.success} />
        <Button type="submit" pending={pending}>
          Saqlash
        </Button>
      </div>
    </form>
  );
}
