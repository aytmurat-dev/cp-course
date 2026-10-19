"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { resetPassword, type AdminState } from "../../actions";
import { Credentials } from "../../create-student-form";

export function ResetPassword({ id }: { id: number }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(resetPassword, {});
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <Button variant="secondary" type="submit" pending={pending}>
        Parolni tiklash
      </Button>
      {state.password && <Credentials password={state.password} />}
    </form>
  );
}
