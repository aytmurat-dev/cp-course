# Kurs mavzulari uchun yozish qoidalari

Bu hujjat — barcha mavzular **bir xil uslub va tuzilmada** bo'lishi uchun yagona standart.
Yangi mavzuni AI bilan generatsiya qilganda shu faylni to'liq prompt'ga qo'shing (pastda tayyor prompt bor).

Namuna sifatida [content/topics/prefix-sums.md](../content/topics/prefix-sums.md) faylini oching — u barcha qoidalarga mos yozilgan.

---

## 1. Fayl

- Joylashuvi: `content/topics/<slug>.md`
- `slug` — fayl nomi, **kebab-case**, inglizcha, qisqa: `prefix-sums.md`, `binary-search.md`, `dsu.md`.
  U URL bo'ladi: `/topics/prefix-sums`. Keyin o'zgartirmang.
- `_` bilan boshlanadigan fayllar (masalan `_template.md`) saytda ko'rinmaydi.
- Kodirovka UTF-8. O'zbek tilidagi apostrof uchun oddiy `'` belgisi ishlatiladi (`o'`, `g'`, `ma'lumot`).

## 2. Frontmatter (fayl boshidagi YAML)

```yaml
---
title: "Prefiks yig'indilar"          # Mavzu nomi (o'zbekcha, bosh harf faqat birinchi so'zda)
section: "Asoslar"                     # Bo'lim nomi — mavjud bo'limlardan biri (pastga qarang)
order: 2                               # Global tartib raqami (butun kurs bo'yicha yagona)
summary: "Massiv qismlari yig'indisini O(1) da hisoblash usuli."   # 1 jumla, 120 belgigacha
prerequisites: [complexity]            # Avval o'qilishi kerak bo'lgan mavzular slug'lari (ixtiyoriy)
problems:
  - title: "Ilya and Queries"          # Masalaning ASL nomi (platformadagidek)
    url: "https://codeforces.com/problemset/problem/313/B"
    difficulty: easy                   # easy | medium | hard  (kurs ichidagi nisbiy qiyinlik)
    rating: 1100                       # ixtiyoriy: Codeforces reytingi
    note: "Klassik 1D prefiks"         # ixtiyoriy: 2–6 so'zli maslahat, yechimni oshkor qilmasin
---
```

### Bo'limlar (section) va tartib (order)

| order oralig'i | section |
|---|---|
| 1–19 | `Asoslar` |
| 20–39 | `Saralash va qidiruv` |
| 40–59 | `Ma'lumotlar tuzilmalari` |
| 60–79 | `Graflar` |
| 80–99 | `Dinamik dasturlash` |
| 100–119 | `Matematika` |
| 120–139 | `Satrlar` |
| 140+ | `Murakkab mavzular` |

Oraliqda bo'sh raqam qoldiring (1, 2, 3… emas, balki 1, 3, 5…) — keyin o'rtaga mavzu qo'shish oson bo'ladi.

### Qo'llab-quvvatlanadigan masala URL'lari

| Platforma | URL formati |
|---|---|
| Codeforces | `https://codeforces.com/problemset/problem/{contest}/{index}` yoki `/contest/{contest}/problem/{index}` yoki `/gym/{id}/problem/{index}` |
| AtCoder | `https://atcoder.jp/contests/{contest}/tasks/{task_id}` |
| LeetCode | `https://leetcode.com/problems/{slug}/` |

Boshqa saytlar (CSES, SPOJ…) avtomatik sinxronlanmaydi, shuning uchun ishlatilmaydi.

### Masalalarni tanlash qoidalari

- Har mavzuda **6–12 masala**, oson → qiyin tartibda.
- Taqsimot: ~40% `easy`, ~40% `medium`, ~20% `hard`.
- Birinchi 1–2 masala — mavzuni "toza" qo'llash (klassik).
- Imkon qadar uch platformadan aralash, lekin Codeforces asosiy.
- `difficulty` — **shu kurs o'quvchisi uchun** nisbiy: taxminan CF 800–1200 → `easy`, 1300–1700 → `medium`, 1800+ → `hard`. LeetCode uchun platformadagi Easy/Medium/Hard ga mos qo'ying.
- Bitta masala ikki mavzuda takrorlanmasin.
- Faqat **haqiqatan mavjud** masalalar. Tekshirish: `npm run check-content`.

## 3. Matn tuzilmasi

Matnda `#` (H1) **ishlatilmaydi** — sarlavha frontmatter'dagi `title` dan chiqadi.
"Masalalar" bo'limini ham **yozmang** — u frontmatter'dan avtomatik jadval bo'lib chiqadi.

Bo'limlar quyidagi tartibda, aynan shu nomlar bilan (`##`):

| # | Sarlavha | Majburiy | Mazmuni |
|---|---|---|---|
| 0 | *(sarlavhasiz kirish)* | ha | 2–4 jumla: mavzu qanday muammoni hal qiladi, nega kerak. |
| 1 | `## Muammo` | ha | Aniq masala qo'yilishi + sodda (brute force) yechim va uning murakkabligi. Nega u sekin ekanini ko'rsating. |
| 2 | `## G'oya` | ha | Asosiy fikr. Formula, jadval yoki qadamlar bilan. Intuitsiyadan rasmiy ta'rifga. |
| 3 | `## Amalga oshirish` | ha | To'liq, ishlaydigan C++ kod + qisqa izoh. |
| 4 | `## Misol` | ha | Kichik kirish ma'lumotida qadam-baqadam ishlash (jadval bilan). |
| 5 | `## Murakkablik` | ha | Vaqt va xotira, qisqa asoslash bilan. |
| 6 | `## Variantlar` | yo'q | Kengaytmalar, o'xshash usullar (`###` bilan kichik bo'limlar). |
| 7 | `## Ko'p uchraydigan xatolar` | ha | 3–6 band ro'yxat. |
| 8 | `## Xulosa` | ha | 3–5 band: eng muhim fikrlar. |

Kichik bo'limlar uchun `###`, undan chuqur sarlavha ishlatmang.

## 4. Uslub

- **Til:** adabiy o'zbek tili, lotin yozuvi. "Siz" shaklida murojaat ("Tasavvur qiling…", "E'tibor bering…").
- **Ohang:** do'stona, aniq, ortiqcha so'zsiz. Bitta paragraf — bitta fikr, 2–5 jumla.
- **Hajm:** 900–2000 so'z (kod hisobga olinmaganda).
- **Atamalar:** birinchi uchraganda inglizchasi qavsda: *prefiks yig'indi (prefix sum)*. Keyin faqat o'zbekchasi.
- Har bir yangi tushunchadan keyin kichik misol keltiring.
- Masala nomlari, funksiyalar, o'zgaruvchilar — `inline code`.
- Muhim atama birinchi marta **qalin** yoziladi.

### Atamalar lug'ati (hamma joyda bir xil ishlatilsin)

| Inglizcha | O'zbekcha |
|---|---|
| array | massiv |
| index | indeks |
| query | so'rov |
| time complexity | vaqt murakkabligi |
| memory | xotira |
| constraints | cheklovlar |
| input / output | kirish / chiqish |
| brute force | to'liq tanlash (brute force) |
| prefix sum | prefiks yig'indi |
| binary search | binar qidiruv |
| sorting | saralash |
| greedy | ochko'z algoritm (greedy) |
| graph / vertex / edge | graf / uch / qirra |
| tree | daraxt |
| dynamic programming | dinamik dasturlash (DP) |
| state / transition | holat / o'tish |
| segment tree | segmentlar daraxti |
| overflow | to'lib ketish (overflow) |
| edge case | chegaraviy holat |
| subarray / subsequence | qism massiv / qism ketma-ketlik |

## 5. Formulalar

KaTeX ishlaydi:

- Qator ichida: `$O(n \log n)$`, `$p_i = a_1 + \dots + a_i$`
- Alohida qatorda:

```markdown
$$
\text{sum}(l, r) = p_r - p_{l-1}
$$
```

Murakkablik har doim formula bilan yoziladi: `$O(n)$`, `$O(n + q)$`, `$O(n \log n)$`.

## 6. Kod

- Til: **C++17**, blok har doim ` ```cpp ` bilan boshlanadi.
- `#include <bits/stdc++.h>` va `using namespace std;` mumkin.
- Katta yig'indilar uchun `long long`. Massivlar odatda **1-indeksli** (prefiks usullarida qulay) — matnda buni aniq ayting.
- Tez kiritish: `ios::sync_with_stdio(false); cin.tie(nullptr);`
- O'zgaruvchi nomlari qisqa, lekin tushunarli: `n`, `q`, `a`, `pref`, `lo`, `hi`, `ans`.
- Izohlar o'zbekcha, faqat noaniq joylarda.
- Kod to'liq va kompilyatsiya bo'ladigan bo'lsin (`main` bilan) — "Amalga oshirish" bo'limida.
- Keyingi bo'limlarda faqat kerakli qism (funksiya) ko'rsatilishi mumkin.

## 7. Maxsus bloklar (callout)

```markdown
> [!NOTE]
> Qo'shimcha ma'lumot, bilib qo'yish foydali.

> [!TIP] Ixtiyoriy sarlavha
> Amaliy maslahat, qisqa yo'l.

> [!WARNING]
> Ko'p uchraydigan tuzoq, xato.

> [!IMPORTANT]
> Asosiy qoida — esdan chiqmasligi kerak.

> [!EXAMPLE]
> Kichik misol.
```

Har bir mavzuda 2–5 ta callout, ketma-ket ikkitadan ko'p emas.

## 8. Jadvallar va misollar

Qadam-baqadam jarayonni jadval bilan ko'rsating:

```markdown
| $i$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $a_i$ | 3 | 1 | 4 | 1 | 5 |
| $p_i$ | 3 | 4 | 8 | 9 | 14 |
```

Rasm kerak bo'lsa: `public/topics/<slug>/rasm.png` ga qo'ying va `![izoh](/topics/<slug>/rasm.png)` deb ulang.

## 9. Tekshirish ro'yxati (commit qilishdan oldin)

- [ ] Fayl nomi kebab-case, `order` boshqa mavzu bilan takrorlanmaydi
- [ ] Barcha majburiy bo'limlar bor, H1 va "Masalalar" bo'limi yo'q
- [ ] Kod kompilyatsiya bo'ladi va misoldagi javobni beradi
- [ ] `npm run check-content` — 0 xato
- [ ] `npm run dev` da sahifa to'g'ri ko'rinadi

---

## 10. AI uchun tayyor prompt

Quyidagi matnni nusxalang, `<...>` joylarini to'ldiring va **shu faylning to'liq matnini** hamda namunani (`prefix-sums.md`) qo'shib yuboring:

```text
Sen tajribali competitive programming murabbiyisan. O'zbek tilida (lotin) kurs mavzusi yozib ber.

Mavzu: <masalan: Ikki ko'rsatkich (two pointers)>
slug: <two-pointers>
section: <Saralash va qidiruv>
order: <25>
prerequisites: <[sorting, prefix-sums]>
O'quvchi darajasi: <Codeforces 800–1400>

Qat'iy talablar:
1. Ilova qilingan CONTENT_GUIDE.md dagi BARCHA qoidalarga amal qil: frontmatter formati,
   bo'limlar tartibi va nomlari, atamalar lug'ati, callout'lar, KaTeX, C++17 kod uslubi.
2. Uslub va hajm bo'yicha ilova qilingan prefix-sums.md namunasiga o'xshasin.
3. 6–12 ta masala tanla: faqat Codeforces, AtCoder, LeetCode. Faqat HAQIQATAN MAVJUD
   masalalar, aniq URL va asl nomi bilan. Ishonching komil bo'lmagan masalani qo'shma.
4. Javob — faqat bitta tayyor .md fayl mazmuni, boshqa izohsiz.
```

AI javobini `content/topics/<slug>.md` ga saqlang, `npm run check-content` bilan tekshiring va xatolarni tuzating.
