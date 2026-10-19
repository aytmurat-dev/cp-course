import Link from "next/link";
import { Header } from "@/components/header";
import { site } from "@/config";
import { getCurrentUser } from "@/lib/auth";
import { getSections, getTopics } from "@/lib/content";

const STEPS = [
  {
    title: "Mavzuni o'qing",
    text: "Har bir mavzuda qisqa nazariya, misollar va C++ dagi tayyor kod bor.",
  },
  {
    title: "Masalalarni yeching",
    text: "Masalalar Codeforces va AtCoder'dan saralangan — o'sha saytlarda yechasiz.",
  },
  {
    title: "Natija o'zi yoziladi",
    text: "Handle'laringizni ulasangiz, yechgan masalalaringiz kursda avtomatik belgilanadi.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();
  const sections = getSections();
  const topics = getTopics();
  const problemCount = topics.reduce((n, t) => n + t.problems.length, 0);

  return (
    <>
      <Header user={user} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4">
        <section className="py-20 text-center sm:py-28">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted">Competitive Programming</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            <span className="text-gradient">{site.name}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Algoritmlar va ma&apos;lumotlar tuzilmalarini noldan o&apos;rganing: tartibli mavzular, tushunarli
            tushuntirishlar va har bir mavzu bo&apos;yicha saralangan masalalar.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href={user ? "/topics" : "/login"}
              className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-6 py-3 font-bold text-[#0b0b12] hover:brightness-110"
            >
              {user ? "Kursga o'tish" : "Kirish"}
            </Link>
          </div>
          <dl className="mx-auto mt-14 grid max-w-md grid-cols-3 gap-4">
            <Stat label="bo'lim" value={sections.length} />
            <Stat label="mavzu" value={topics.length} />
            <Stat label="masala" value={problemCount} />
          </dl>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-5">
              <div className="text-sm font-extrabold text-accent">0{i + 1}</div>
              <h2 className="mt-2 text-lg font-bold">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </section>

        {sections.length > 0 && (
          <section className="pb-20">
            <h2 className="text-2xl font-extrabold">Kurs dasturi</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {sections.map((sec) => (
                <div key={sec.name} className="card p-5">
                  <h3 className="font-bold text-gradient">{sec.name}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted">
                    {sec.topics.map((t) => (
                      <li key={t.slug} className="flex gap-2">
                        <span className="text-faint">•</span>
                        {t.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="border-t border-line py-8 text-center text-sm text-faint">
          Ro&apos;yxatdan o&apos;tish faqat administrator orqali. © {new Date().getFullYear()} {site.author}
        </p>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-3xl font-extrabold">{value}</dd>
    </div>
  );
}
