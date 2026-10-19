import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { db, PLATFORMS, verifications } from "@/db";
import { formatDate } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getUserHandles } from "@/lib/handles";
import { verifyProblemUrl } from "@/lib/judges";
import { HandleCard } from "./handle-card";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Sozlamalar" };

export default async function SettingsPage() {
  const user = await requireUser();
  const [linked, pending] = await Promise.all([
    getUserHandles(user.id),
    db.select().from(verifications).where(eq(verifications.userId, user.id)),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold">
          <span className="text-gradient">Sozlamalar</span>
        </h1>
        <dl className="card mt-6 divide-y divide-line">
          <Row label="Ism" value={user.name} />
          <Row label="Login" value={user.username} />
          <Row label="Oxirgi sinxronlash" value={formatDate(user.lastSyncedAt)} />
        </dl>
      </div>

      <section>
        <h2 className="text-xl font-extrabold">Platformalar</h2>
        <p className="mt-1 text-sm text-muted">
          Handle&apos;ingiz sizniki ekanini bir marta tasdiqlang — shundan keyin yechgan masalalaringiz kursda
          avtomatik belgilanadi.
        </p>
        <div className="mt-5 space-y-4">
          {PLATFORMS.map((platform) => {
            const h = linked.find((x) => x.platform === platform);
            const v = pending.find((x) => x.platform === platform);
            return (
              <HandleCard
                key={platform}
                platform={platform}
                linked={h ? { handle: h.handle, verifiedAt: formatDate(h.verifiedAt) } : null}
                pending={
                  v
                    ? {
                        handle: v.handle,
                        challenge: v.challenge,
                        problemUrl: platform === "codeforces" ? verifyProblemUrl(v.challenge) : null,
                      }
                    : null
                }
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-extrabold">Parolni o&apos;zgartirish</h2>
        <PasswordForm />
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-4">
      <dt className="w-44 font-bold">{label}</dt>
      <dd className="text-muted">{value}</dd>
    </div>
  );
}
