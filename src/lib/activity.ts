/* Yechimlar faolligi: Codeforces/GitHub uslubidagi yillik xarita uchun kunlik hisob. */

const TZ_OFFSET_MS = 5 * 3600_000; // Asia/Tashkent (UTC+5, yozgi vaqt yo'q)
const DAY_MS = 86_400_000;
export const ACTIVITY_WEEKS = 53;

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

/** Toshkent vaqti bo'yicha kun: "2026-10-20". */
export const dayKey = (d: Date) => new Date(d.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 10);

export type ActivityDay = { date: string; count: number };

export type Activity = {
  /** Ustunlar — haftalar (Dushanbadan Yakshanbagacha); bugundan keyingi kunlar null. */
  weeks: (ActivityDay | null)[][];
  months: { col: number; label: string }[];
  total: number;
  activeDays: number;
  maxPerDay: number;
  currentStreak: number;
  longestStreak: number;
};

export function buildActivity(dates: Date[], now = new Date()): Activity {
  const counts = new Map<string, number>();
  for (const d of dates) {
    const k = dayKey(d);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  const today = Date.parse(dayKey(now)); // mahalliy sananing UTC yarim tuni
  const weekday = (new Date(today).getUTCDay() + 6) % 7; // 0 = Dushanba
  const start = today - ((ACTIVITY_WEEKS - 1) * 7 + weekday) * DAY_MS;

  const weeks: (ActivityDay | null)[][] = [];
  const months: Activity["months"] = [];
  let total = 0, activeDays = 0, maxPerDay = 0, longestStreak = 0, run = 0;

  for (let w = 0; w < ACTIVITY_WEEKS; w++) {
    const week: (ActivityDay | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const t = start + (w * 7 + d) * DAY_MS;
      if (t > today) {
        week.push(null);
        continue;
      }
      const date = new Date(t).toISOString().slice(0, 10);
      const count = counts.get(date) ?? 0;
      week.push({ date, count });
      total += count;
      if (count > 0) {
        activeDays++;
        maxPerDay = Math.max(maxPerDay, count);
        longestStreak = Math.max(longestStreak, ++run);
      } else run = 0;
    }
    weeks.push(week);

    // Oy nomi — shu hafta ichida oyning 1-kuni bo'lsa (birinchi ustunda joy tor bo'lgani uchun yozilmaydi).
    const firstOfMonth = week.find((day) => day?.date.endsWith("-01"));
    if (firstOfMonth && w > 0) months.push({ col: w, label: MONTHS[Number(firstOfMonth.date.slice(5, 7)) - 1] });
  }

  // Joriy seriya: bugun hali yechilmagan bo'lsa, kechadan boshlab sanaladi.
  let currentStreak = 0;
  let t = counts.has(dayKey(now)) ? today : today - DAY_MS;
  while (counts.has(new Date(t).toISOString().slice(0, 10))) {
    currentStreak++;
    t -= DAY_MS;
  }

  return { weeks, months, total, activeDays, maxPerDay, currentStreak, longestStreak };
}
