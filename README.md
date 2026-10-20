# CP Kurs

Competitive programming kursi uchun sayt: mavzular, saralangan masalalar va Codeforces, AtCoder, Kep.uz bilan avtomatik sinxronizatsiya.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Drizzle ORM · Neon Postgres · Vercel

## Imkoniyatlar

- **Bosh sahifa** — kurs haqida qisqacha, kurs dasturi, "Kirish" tugmasi.
- **Rollar:** bitta admin (siz) va o'quvchilar. O'quvchini faqat admin qo'shadi (login + parol).
- **Mavzular** — bo'limlarga ajratilgan ro'yxat, har birida progress. Mavzu sahifasida matn (Markdown + formulalar + C++ kod) va pastida masalalar jadvali.
- **Masalalar** saytda yechilmaydi — tashqi havola. O'quvchi yechgan masala kursda avtomatik belgilanadi.
- **Handle ulash (egalik tasdiqlanadi):**
  - Codeforces — ko'rsatilgan masalaga 15 daqiqa ichida *Compilation Error* yuborish;
  - AtCoder — profildagi *Affiliation* maydoniga kod yozish;
  - Kep.uz — ko'rsatilgan masalaga 15 daqiqa ichida *Sintaktik xatolik* beradigan kod yuborish.
- **Sinxronizatsiya:** sahifa ochilganda (ma'lumot 10 daqiqadan eski bo'lsa), "Yangilash" tugmasi orqali va har kuni Vercel Cron bilan.
- **Admin panel** — o'quvchilar ro'yxati va progressi, har bir o'quvchining mavzular bo'yicha yechgan masalalari, parolni tiklash, handle uzish, o'chirish.

## Mahalliy ishga tushirish

```bash
npm install
cp .env.example .env.local      # DATABASE_URL, SESSION_SECRET, CRON_SECRET ni to'ldiring
npm run db:push                 # jadvallarni yaratadi
npm run admin -- <login> <parol> "Ism Familiya"
npm run dev
```

## Deploy (Vercel + Neon)

1. [vercel.com/new](https://vercel.com/new) → GitHub'dagi `cp-course` repo'sini import qiling → **Deploy**.
2. Loyihada **Storage → Create Database → Neon** (bepul) → loyihaga ulang. `DATABASE_URL` avtomatik qo'shiladi.
3. **Settings → Environment Variables** ga qo'shing:
   - `SESSION_SECRET` — `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
   - `CRON_SECRET` — xuddi shunday tasodifiy satr
4. Kompyuteringizda Neon'dagi `DATABASE_URL` ni `.env.local` ga yozib:

   ```bash
   npm run db:push
   npm run admin -- <login> <parol> "Ism Familiya"
   ```

5. Vercel'da **Redeploy** qiling.

Cron (`vercel.json`) har kuni 01:00 UTC da barcha o'quvchilarni sinxronlaydi (Hobby tarifida kuniga 1 marta ruxsat etiladi).

## Mavzu qo'shish

Kurs tuzilmasi (qism → bo'lim → mavzu, nomlar va tartib) — [content/course.yaml](content/course.yaml). Har bir mavzu matni — `content/topics/<slug>.md`; matni ham, masalasi ham yo'q mavzular saytda "Tez orada" deb turadi.

**Masalalar** admin paneldan qo'shiladi: admin sifatida mavzu sahifasini oching va pastdagi formaga Codeforces/AtCoder/Kep.uz havolasini qo'ying — nomi, reytingi va qiyinligi avtomatik olinadi. Masalani tahrirlash, o'chirish va tartibini o'zgartirish ham shu yerda. Yozish qoidalari va AI uchun tayyor prompt: **[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)**. Shablon: [content/topics/_template.md](content/topics/_template.md).

```bash
npm run check-content     # course.yaml va mavzu fayllari formatini tekshiradi
git add content && git commit -m "Yangi mavzu" && git push   # Vercel o'zi yangilaydi
```

## Cheklovlar

- **AtCoder** ma'lumotlari [AtCoder Problems](https://kenkoooo.com/atcoder/) orqali olinadi — yangi yechim bir necha daqiqa kechikib ko'rinishi mumkin.

## Tuzilma

```text
content/topics/      Mavzular (Markdown)
docs/                Kontent qo'llanmasi
scripts/             create-admin, check-content
src/app/             Sahifalar: /, /login, /topics, /topics/[slug], /settings, /admin
src/app/api/         /api/sync (o'quvchi), /api/cron/sync (Vercel Cron)
src/db/              Drizzle sxemasi
src/lib/judges/      Codeforces, AtCoder, Kep.uz integratsiyalari
src/lib/sync.ts      Sinxronizatsiya mantig'i
```
