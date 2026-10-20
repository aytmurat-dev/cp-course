"use client";

import { useActionState } from "react";
import type { Platform } from "@/db/schema";
import { SubmitButton } from "@/components/submit-button";
import { Button, Field, FormError, FormSuccess, PlatformBadge } from "@/components/ui";
import {
  cancelVerification,
  confirmVerification,
  startVerification,
  unlinkHandle,
  type ActionState,
} from "./actions";

type Props = {
  platform: Platform;
  linked: { handle: string; verifiedAt: string } | null;
  pending: { handle: string; challenge: string; problemUrl: string | null } | null;
};

const PROFILE_URL: Record<Platform, (h: string) => string> = {
  codeforces: (h) => `https://codeforces.com/profile/${h}`,
  atcoder: (h) => `https://atcoder.jp/users/${h}`,
  kep: (h) => `https://kep.uz/users/user/${h}`,
};

export function HandleCard({ platform, linked, pending }: Props) {
  const [startState, start, starting] = useActionState<ActionState, FormData>(startVerification, {});
  const [confirmState, confirm, confirming] = useActionState<ActionState, FormData>(confirmVerification, {});

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PlatformBadge platform={platform} />
        {linked && (
          <span className="text-xs font-bold uppercase tracking-wider text-ok">Ulangan</span>
        )}
      </div>

      {linked ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <a
              href={PROFILE_URL[platform](linked.handle)}
              target="_blank"
              rel="noreferrer"
              className="text-lg font-bold hover:text-accent"
            >
              {linked.handle} ↗
            </a>
            <p className="text-sm text-muted">Tasdiqlangan: {linked.verifiedAt}</p>
          </div>
          <form action={unlinkHandle}>
            <input type="hidden" name="platform" value={platform} />
            <SubmitButton variant="ghost" confirm="Handle uzilsinmi? Qayta ulash uchun yana tasdiqlash kerak bo'ladi.">
              Uzish
            </SubmitButton>
          </form>
          <div className="w-full">
            <FormSuccess message={confirmState.success} />
          </div>
        </div>
      ) : pending ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted">
            Handle: <b className="text-fg">{pending.handle}</b>
          </p>
          <Instructions platform={platform} pending={pending} />
          <FormError message={confirmState.error} />
          <div className="flex flex-wrap gap-2">
            <form action={confirm}>
              <input type="hidden" name="platform" value={platform} />
              <Button type="submit" pending={confirming}>
                Tekshirish
              </Button>
            </form>
            <form action={cancelVerification}>
              <input type="hidden" name="platform" value={platform} />
              <SubmitButton variant="ghost">Bekor qilish</SubmitButton>
            </form>
          </div>
        </div>
      ) : (
        <form action={start} className="mt-4 space-y-3">
          <input type="hidden" name="platform" value={platform} />
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Handle" name="handle" placeholder="handle" required className="min-w-0 flex-1" autoComplete="off" />
            <Button type="submit" pending={starting}>
              Ulash
            </Button>
          </div>
          <FormError message={startState.error} />
        </form>
      )}
    </div>
  );
}

function Instructions({ platform, pending }: { platform: Platform; pending: NonNullable<Props["pending"]> }) {
  const code = (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-fg ring-1 ring-line select-all">
      {pending.challenge}
    </code>
  );
  if (platform === "codeforces") {
    return (
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted">
        <li>
          <a href={pending.problemUrl!} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">
            Shu masalaga ↗
          </a>{" "}
          <b className="text-fg">{pending.handle}</b> akkauntidan <b className="text-fg">Compilation Error</b> beradigan
          kod yuboring (masalan, faqat <code className="font-mono">qwerty</code> deb yozing).
        </li>
        <li>15 daqiqa ichida &quot;Tekshirish&quot; tugmasini bosing.</li>
      </ol>
    );
  }
  if (platform === "kep") {
    return (
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted">
        <li>
          <a href={pending.problemUrl!} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">
            Shu masalaga ↗
          </a>{" "}
          <b className="text-fg">{pending.handle}</b> akkauntidan <b className="text-fg">Sintaktik xatolik</b> beradigan
          kod yuboring (masalan, faqat <code className="font-mono">qwerty</code> deb yozing).
        </li>
        <li>15 daqiqa ichida &quot;Tekshirish&quot; tugmasini bosing.</li>
      </ol>
    );
  }
  return (
    <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted">
      <li>
        <a href="https://atcoder.jp/settings" target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">
          AtCoder sozlamalarida ↗
        </a>{" "}
        <b className="text-fg">Affiliation</b> maydoniga quyidagi kodni yozib saqlang: {code}
      </li>
      <li>&quot;Tekshirish&quot;ni bosing. Tasdiqlangandan keyin kodni o&apos;chirib tashlashingiz mumkin.</li>
    </ol>
  );
}
