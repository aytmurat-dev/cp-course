"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui";

/** Oddiy server-action formalari uchun: yuborilayotganda spinner, ixtiyoriy tasdiqlash oynasi. */
export function SubmitButton({
  confirm,
  ...props
}: React.ComponentProps<typeof Button> & { confirm?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      pending={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      {...props}
    />
  );
}
