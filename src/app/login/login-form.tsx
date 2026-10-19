"use client";

import { useActionState } from "react";
import { Button, Field, FormError } from "@/components/ui";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="card mt-8 space-y-4 p-6">
      <Field label="Login" name="username" autoComplete="username" defaultValue={state.username} required autoFocus />
      <Field label="Parol" name="password" type="password" autoComplete="current-password" required />
      <FormError message={state.error} />
      <Button type="submit" pending={pending} className="w-full">
        Kirish
      </Button>
    </form>
  );
}
