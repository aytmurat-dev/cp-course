"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ma'lumot eskirgan bo'lsa, sahifa ochilganda fon rejimida sinxronlaydi.
 * "Yangilash" tugmasi bilan qo'lda ham ishga tushirish mumkin.
 */
export function SyncStatus({ stale, hasHandles, lastSynced }: { stale: boolean; hasHandles: boolean; lastSynced: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "syncing" | "error">("idle");
  const started = useRef(false);

  const run = useCallback(
    async (force: boolean) => {
      setState("syncing");
      try {
        const res = await fetch("/api/sync", { method: "POST", body: JSON.stringify({ force }) });
        if (!res.ok) throw new Error();
        setState("idle");
        router.refresh();
      } catch {
        setState("error");
      }
    },
    [router],
  );

  useEffect(() => {
    if (stale && hasHandles && !started.current) {
      started.current = true;
      void run(false);
    }
  }, [stale, hasHandles, run]);

  if (!hasHandles) {
    return (
      <a href="/settings" className="text-sm font-semibold text-warn hover:underline">
        Natijalar avtomatik belgilanishi uchun handle&apos;laringizni ulang →
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm text-muted">
      <span>
        {state === "syncing" ? "Sinxronlanmoqda…" : state === "error" ? "Sinxronlashda xato" : `Oxirgi yangilanish: ${lastSynced}`}
      </span>
      <button
        type="button"
        onClick={() => run(true)}
        disabled={state === "syncing"}
        className="rounded-md px-2 py-1 font-semibold text-accent ring-1 ring-line hover:ring-line-strong disabled:opacity-50"
      >
        Yangilash
      </button>
    </div>
  );
}
