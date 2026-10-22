import type { Problem } from "@/db/schema";
import { DifficultyLabel, formatDate, PlatformBadge, SolvedIcon } from "./ui";

type Props = {
  problems: Problem[];
  solved: Map<string, Date>;
  /** Kartochka ramkasisiz (boshqa kartochka ichida). */
  bare?: boolean;
  /** Yechilgan sanani alohida ustunda ko'rsatish (admin uchun). */
  showSolvedAt?: boolean;
  /** Filtrlangan ro'yxatda asl tartib raqamlari: problem.id → raqam. */
  numbers?: Map<number, number>;
};

export function ProblemTable({ problems, solved, bare, showSolvedAt, numbers }: Props) {
  if (problems.length === 0) return <p className="card p-5 text-muted">Bu mavzuga hali masala qo&apos;shilmagan.</p>;
  return (
    <div className={`overflow-x-auto ${bare ? "" : "card"}`}>
      <table className="w-full text-left">
        <thead className="border-b border-line text-xs uppercase tracking-wider text-faint">
          <tr>
            <th className="w-12 px-4 py-3 font-bold">
              <span className="sr-only">Holat</span>
            </th>
            <th className="w-10 py-3 font-bold">#</th>
            <th className="py-3 pr-4 font-bold">Masala</th>
            <th className="py-3 pr-4 font-bold">Platforma</th>
            <th className="py-3 pr-4 font-bold">Qiyinlik</th>
            {showSolvedAt && <th className="py-3 pr-4 font-bold">Yechilgan</th>}
          </tr>
        </thead>
        <tbody>
          {problems.map((p, i) => {
            const at = solved.get(p.problemKey);
            return (
              <tr key={p.id} className={`border-b border-line last:border-0 ${at ? "bg-ok/[0.04]" : ""}`}>
                <td className="px-4 py-3" title={at ? `Yechilgan: ${formatDate(at)}` : undefined}>
                  <SolvedIcon solved={!!at} />
                </td>
                <td className="py-3 text-sm text-faint">{numbers?.get(p.id) ?? i + 1}</td>
                <td className="py-3 pr-4">
                  <a href={p.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">
                    {p.title}
                    <span className="ml-1 text-faint" aria-hidden>
                      ↗
                    </span>
                  </a>
                  {p.note && <p className="mt-0.5 text-sm text-muted">{p.note}</p>}
                </td>
                <td className="py-3 pr-4">
                  <PlatformBadge platform={p.platform} />
                </td>
                <td className="whitespace-nowrap py-3 pr-4">
                  <DifficultyLabel difficulty={p.difficulty} rating={p.rating ?? undefined} />
                </td>
                {showSolvedAt && <td className="whitespace-nowrap py-3 pr-4 text-sm text-muted">{at ? formatDate(at) : "—"}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
