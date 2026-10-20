import { ACTIVITY_WEEKS, type Activity } from "@/lib/activity";

const DAY_LABELS = ["Du", "", "Ch", "", "Ju", "", "Ya"];
const LEVELS = ["bg-line", "bg-ok/25", "bg-ok/50", "bg-ok/75", "bg-ok"];
// Birinchi ustun — hafta kunlari; kataklar kartochka kengligiga cho'ziladi (telefonda gorizontal aylantiriladi).
const COLUMNS = { gridTemplateColumns: `20px repeat(${ACTIVITY_WEEKS}, minmax(9px, 1fr))` };

function level(count: number) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

const formatDay = (date: string) => date.split("-").reverse().join(".");

/** Yillik faollik xaritasi: har bir katak — bir kun, rangi — o'sha kuni yechilgan masalalar soni. */
export function ActivityHeatmap({ activity }: { activity: Activity }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="min-w-[640px]">
        <div className="mb-1.5 grid gap-[3px] text-[10px] leading-none text-faint" style={COLUMNS}>
          {activity.months.map((m) => (
            <span key={m.col} className="whitespace-nowrap" style={{ gridColumnStart: m.col + 2 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={COLUMNS}>
          {DAY_LABELS.map((d, i) => (
            <span key={`day-${i}`} className="flex items-center text-[10px] leading-none text-faint">
              {d}
            </span>
          ))}
          {activity.weeks.flat().map((day, i) =>
            day ? (
              <span
                key={day.date}
                title={`${day.count ? `${day.count} ta masala` : "Yechim yo'q"} · ${formatDay(day.date)}`}
                className={`aspect-square rounded-[3px] ${LEVELS[level(day.count)]}`}
              />
            ) : (
              <span key={`empty-${i}`} />
            ),
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-faint">
        Kam
        {LEVELS.map((cls) => (
          <span key={cls} className={`size-3 rounded-[3px] ${cls}`} />
        ))}
        Ko&apos;p
      </div>
    </div>
  );
}
