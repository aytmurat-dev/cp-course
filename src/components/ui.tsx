import type { Difficulty, Platform } from "@/db/schema";
import { PLATFORM_LABEL } from "@/lib/problems";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  pending?: boolean;
};

const VARIANTS = {
  primary: "bg-gradient-to-r from-accent to-accent-2 text-[#0b0b12] hover:brightness-110",
  secondary: "bg-surface-2 text-fg ring-1 ring-line hover:ring-line-strong",
  danger: "bg-bad/10 text-bad ring-1 ring-bad/30 hover:bg-bad/20",
  ghost: "text-muted hover:bg-surface-2 hover:text-fg",
};

export function Button({ variant = "primary", pending, className = "", children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {pending && <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string };

export function Field({ label, hint, className = "", ...rest }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-muted">{label}</span>
      <input
        {...rest}
        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-fg placeholder:text-faint focus:border-accent focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-faint">{hint}</span>}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded-lg bg-bad/10 px-3 py-2 text-sm text-bad ring-1 ring-bad/25">{message}</p>;
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded-lg bg-ok/10 px-3 py-2 text-sm text-ok ring-1 ring-ok/25">{message}</p>;
}

export function ProgressBar({ value, total, className = "" }: { value: number; total: number; className?: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-line ${className}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`h-full rounded-full ${pct === 100 ? "bg-ok" : "bg-gradient-to-r from-accent to-accent-2"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const PLATFORM_STYLE: Record<Platform, string> = {
  codeforces: "text-sky-300 bg-sky-400/10 ring-sky-400/25",
  atcoder: "text-zinc-200 bg-zinc-400/10 ring-zinc-400/25",
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ring-1 ${PLATFORM_STYLE[platform]}`}>
      {PLATFORM_LABEL[platform]}
    </span>
  );
}

const DIFFICULTY: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: "Oson", cls: "text-ok" },
  medium: { label: "O'rta", cls: "text-warn" },
  hard: { label: "Qiyin", cls: "text-bad" },
};

export function DifficultyLabel({ difficulty, rating }: { difficulty: Difficulty; rating?: number }) {
  const d = DIFFICULTY[difficulty];
  return (
    <span className={`text-sm font-semibold ${d.cls}`}>
      {d.label}
      {rating ? <span className="ml-1 font-normal text-faint">· {rating}</span> : null}
    </span>
  );
}

export function SolvedIcon({ solved }: { solved: boolean }) {
  return solved ? (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-ok/15 text-ok ring-1 ring-ok/30" title="Yechilgan">
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5" aria-hidden>
        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
      </svg>
      <span className="sr-only">Yechilgan</span>
    </span>
  ) : (
    <span className="inline-block size-6 rounded-full ring-1 ring-line-strong" title="Yechilmagan">
      <span className="sr-only">Yechilmagan</span>
    </span>
  );
}

export function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(d);
}
