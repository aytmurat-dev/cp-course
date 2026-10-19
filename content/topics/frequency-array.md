---
summary: "Qiymatlar necha marta uchrashini bir marta sanab, har bir so'rovga darhol javob berish usuli."
prerequisites: [brute-force]
---

## Kirish

Ko'p masalalarda bitta savol qayta-qayta beriladi: falon son massivda necha marta uchraydi? Bu darsda shunday savollarga bir zumda javob beradigan usulni o'rganasiz. U takrorlanishlarni sanash, turli qiymatlarni aniqlash va eng ko'p uchraydigan sonni topish masalalarida juda ko'p ishlatiladi. Dars oxirida siz $2 \cdot 10^5$ ta so'rovli masalani bir soniyadan ancha tez yechadigan dastur yoza olasiz.

## Muammo

Sizga $n$ ta butun sondan iborat $a_1, a_2, \dots, a_n$ massiv berilgan. Keyin $q$ ta **so'rov (query)** keladi. So'rov — dasturga beriladigan alohida savol. Bu masalada har bir so'rov bitta son $x$ dan iborat: "$x$ massivda necha marta uchraydi?"

- **Kirish:** birinchi qatorda $n$ va $q$, ikkinchi qatorda $a_1, \dots, a_n$, uchinchi qatorda $q$ ta son $x_1, \dots, x_q$.
- **Chiqish:** har bir so'rov uchun alohida qatorda javob.
- **Cheklovlar:** $1 \le n, q \le 2 \cdot 10^5$, $1 \le a_i, x_j \le 10^6$.

Kichik test:

```text
7 3
3 1 3 5 1 3 2
3 4 1
```

Javob:

```text
3
0
2
```

Son $3$ massivda uch marta uchraydi (1-, 3- va 6-o'rinlarda). Son $4$ umuman yo'q. Son $1$ ikki marta bor.

Eng sodda yechim: har bir so'rovda massivni boshidan oxirigacha ko'rib chiqamiz va $x$ ga teng elementlarni sanaymiz.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    while (q--) {
        int x;
        cin >> x;
        int count = 0;
        for (int i = 0; i < n; i++)
            if (a[i] == x) count++;
        cout << count << '\n';
    }
}
```

Har bir so'rovda $n$ ta tekshiruv bajariladi, jami $O(n \cdot q)$. Eng yomon holatda bu $2 \cdot 10^5 \cdot 2 \cdot 10^5 = 4 \cdot 10^{10}$ amal. "Brute force va Big-O" darsidagi qoidani eslang: 1 soniyada taxminan $10^8$ oddiy amal bajariladi. Demak, dastur 400 soniya ishlaydi — vaqt chegarasidan yuzlab marta ko'p.

Muammoning ildizi oddiy: biz bitta massivni $q$ marta qaytadan sanayapmiz. Massiv o'zgarmaydi, demak sanash natijasi ham o'zgarmaydi.

## G'oya

Tasavvur qiling, o'qituvchi nazorat ishidan keyin baholarni sanayapti. U har safar ro'yxatni boshidan ko'rib chiqmaydi. Buning o'rniga doskaga to'rtta katak chizadi: "2", "3", "4", "5". Har bir ishni ko'rganda tegishli katakka bitta chiziqcha qo'yadi. Oxirida "nechta besh bor?" degan savolga bir qarashda javob beradi.

Keling, kichik misolda ko'raylik. Baholar: $5, 4, 5, 3, 5, 4$. Kataklarni to'ldiramiz:

| Baho | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| Chiziqchalar soni | 0 | 1 | 2 | 3 |

Endi "nechta to'rt bor?" savoliga ro'yxatga qaramasdan javob beramiz: 2 ta.

**Asosiy kuzatish: har bir qiymat necha marta uchrashini massivni bir marta ko'rib chiqib sanab qo'ysak, istalgan so'rovga darhol javob beramiz.**

Endi rasmiy ta'riflar. Qiymatning massivda necha marta uchrashi uning **chastotasi (frequency)** deyiladi. Misolimizda 5 ning chastotasi 3 ga, 2 ning chastotasi 0 ga teng.

**Chastota massivi (frequency array)** — $v$-katagida $v$ qiymatning chastotasi saqlanadigan massiv. Uni odatda `cnt` deb nomlaymiz. Baholar misolida `cnt[5] = 3`, `cnt[4] = 2`.

Usul to'rt qadamdan iborat:

1. Cheklovlardan eng katta qiymatni aniqlang. Uni $V$ deb belgilaymiz, masalamizda $V = 10^6$.
2. $V + 1$ o'lchamli `cnt` massivini nollar bilan yarating: indekslar $0$ dan $V$ gacha.
3. Massiv elementlarini birma-bir ko'rib chiqing va har bir $a_i$ uchun `cnt[a_i]` ni bittaga oshiring.
4. So'rovga javob — `cnt[x]`.

Nega bu doim to'g'ri ishlaydi? Har bir element aynan bitta katakni — o'z qiymatiga mos katakni — bittaga oshiradi. Shuning uchun `cnt[v]` da $v$ ga teng elementlar soni yig'iladi, boshqa elementlar bu katakka tegmaydi. Usulning butun siri shunda: **element qiymati indeks vazifasini bajaradi.**

> [!NOTE] To'xtang va o'ylang
> Agar cheklov $1 \le a_i \le 10^9$ bo'lsa, shu usul ishlaydimi?

Ishlamaydi, sababi — xotira. Bitta `int` 4 bayt egallaydi. $10^9$ katakli massiv taxminan 4 GB xotira talab qiladi. Odatda masalalarda xotira chegarasi 256 MB.

Elementlar qabul qilishi mumkin bo'lgan eng kichik qiymatdan eng kattasigacha bo'lgan oraliq **qiymatlar diapazoni (value range)** deyiladi. Chastota massivining o'lchami $n$ ga emas, aynan diapazonga bog'liq. Quyidagi jadvalga qarang:

| Diapazon | `int` massiv xotirasi | 256 MB ga sig'adimi? |
|---|---|---|
| $10^6$ | 4 MB | bemalol |
| $10^7$ | 40 MB | ha |
| $10^8$ | 400 MB | yo'q |
| $10^9$ | 4 GB | yo'q |

Shuning uchun cheklovlarni o'qiganda avval $a_i$ ning chegarasiga qarang. U $10^7$ gacha bo'lsa, chastota massivi to'g'ri tanlov. Katta qiymatlar bilan nima qilish kerakligini "Variantlar" bo'limida ko'ramiz.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXV = 1000000;   // a_i va x ning eng katta qiymati
int cnt[MAXV + 1];          // global massiv avtomatik 0 bilan to'ladi

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    cin >> n >> q;

    // Har bir qiymat necha marta uchrashini sanaymiz
    for (int i = 1; i <= n; i++) {
        int value;
        cin >> value;
        cnt[value]++;
    }

    // Har bir so'rovga tayyor javobni chiqaramiz
    for (int j = 1; j <= q; j++) {
        int x;
        cin >> x;
        cout << cnt[x] << '\n';
    }
    return 0;
}
```

Kodning muhim joylari:

- `cnt` global e'lon qilingan. Global massiv avtomatik nollar bilan to'ladi va katta o'lchamda ham dasturni buzmaydi.
- Massiv o'lchami `MAXV + 1`, chunki $10^6$ indeksi ham kerak.
- Massivning o'zini saqlashga hojat yo'q: har bir sonni o'qishimiz bilan sanaymiz.
- Chastota $n \le 2 \cdot 10^5$ dan oshmaydi, shuning uchun `int` yetarli.

## Misol

Muammodagi testni qo'lda bajaramiz: $a = [3, 1, 3, 5, 1, 3, 2]$. `cnt` massivi katta, lekin faqat 1–5 kataklar o'zgaradi. Har bir qadamdan keyingi holatni ko'raylik:

| Qadam | $a_i$ | `cnt[1]` | `cnt[2]` | `cnt[3]` | `cnt[4]` | `cnt[5]` |
|---|---|---|---|---|---|---|
| boshlanish | — | 0 | 0 | 0 | 0 | 0 |
| 1 | 3 | 0 | 0 | **1** | 0 | 0 |
| 2 | 1 | **1** | 0 | 1 | 0 | 0 |
| 3 | 3 | 1 | 0 | **2** | 0 | 0 |
| 4 | 5 | 1 | 0 | 2 | 0 | **1** |
| 5 | 1 | **2** | 0 | 2 | 0 | 1 |
| 6 | 3 | 2 | 0 | **3** | 0 | 1 |
| 7 | 2 | 2 | **1** | 3 | 0 | 1 |

Har qadamda faqat bitta katak o'zgaradi — u qalin bilan belgilangan. Endi so'rovlarga javob beramiz:

| So'rov $x$ | `cnt[x]` | Javob |
|---|---|---|
| 3 | 3 | 3 |
| 4 | 0 | 0 |
| 1 | 2 | 2 |

Natija $3, 0, 2$ — kutilgan javob bilan bir xil.

## Murakkablik

**Vaqt:** sanash $O(n)$, har bir so'rov $O(1)$, jami $O(n + q)$. Eng yomon holatda bu $2 \cdot 10^5 + 2 \cdot 10^5 = 4 \cdot 10^5$ amal. Sodda yechimdagi $4 \cdot 10^{10}$ amaldan 100 000 marta kam. Global massivni nollash ham taxminan $10^6$ amal — bu ham sezilmaydi.

**Xotira:** $O(V)$, bu yerda $V$ — eng katta qiymat. Bizda $10^6 + 1$ ta `int`, ya'ni taxminan 4 MB.

## Variantlar

### Turli qiymatlar soni va moda

Qachon kerak: "massivda nechta turli son bor?" yoki "qaysi son eng ko'p uchraydi?" degan savollarda. Eng ko'p uchraydigan qiymat **moda (mode)** deyiladi. Masalan, $[3, 1, 3, 5, 1, 3, 2]$ da moda — 3.

Chastota massivini to'ldirgandan keyin uni bir marta ko'rib chiqamiz. Noldan katta har bir katak — bitta turli qiymat. Chastotasi eng katta katak — moda.

```cpp
int distinctCount = 0, mode = 0;   // cnt[0] = 0, shuning uchun mode = 0 dan boshlash xavfsiz
for (int v = 1; v <= MAXV; v++) {
    if (cnt[v] > 0) distinctCount++;
    if (cnt[v] > cnt[mode]) mode = v;
}
```

Taqqoslash qat'iy (`>`), shuning uchun chastotalar teng bo'lsa, eng kichik qiymat qoladi. Vaqt — $O(V)$.

### Sanab saralash

**Sanab saralash (counting sort)** — har bir qiymatni chastotasicha marta, o'sish tartibida chiqarib, massivni saralash usuli. Qachon kerak: qiymatlar diapazoni kichik, elementlar esa juda ko'p bo'lganda.

```cpp
for (int v = 1; v <= MAXV; v++)
    for (int k = 0; k < cnt[v]; k++)
        cout << v << ' ';
```

$[3, 1, 3, 5, 1, 3, 2]$ uchun natija: `1 1 2 3 3 3 5`. Vaqt $O(n + V)$. Diapazon kichik bo'lsa, bu `sort` dan ($O(n \log n)$) tezroq.

### Manfiy yoki juda katta qiymatlar

Agar $-10^5 \le a_i \le 10^5$ bo'lsa, `cnt[-5]` kabi manfiy indeks paydo bo'ladi. Bu xato. Yechim: har bir qiymatga bir xil son qo'shib, diapazonni noldan boshlanadigan qilamiz. Bu qo'shiladigan son **siljitish (offset)** deyiladi. $10^5$ ga siljitsak: $-10^5 \to 0$, $0 \to 10^5$, $10^5 \to 2 \cdot 10^5$.

```cpp
const int OFFSET = 100000;
int cnt[2 * OFFSET + 1];

cnt[value + OFFSET]++;           // sanash
cout << cnt[x + OFFSET] << '\n'; // so'rov
```

Agar $a_i \le 10^9$ bo'lsa, massiv xotiraga sig'maydi. Bunda `map<int, int>` ishlatamiz: u faqat haqiqatan uchragan qiymatlarni saqlaydi. Har bir amal $O(\log n)$, jami $O((n + q) \log n)$.

```cpp
map<int, int> cnt;
cnt[value]++;                  // sanash
cout << cnt[x] << '\n';        // so'rov (yo'q qiymat uchun 0)
```

## Ko'p uchraydigan xatolar

### 1. Massiv o'lchami bitta kam

> [!WARNING]
> ```cpp
> int cnt[1000000];   // a_i <= 10^6
> cnt[value]++;       // value = 10^6 bo'lsa — xato
> ```
> Bunday massivda indekslar $0$ dan $999\,999$ gacha. $a_i = 10^6$ kelganda massivdan tashqariga chiqamiz, dastur noto'g'ri ishlaydi yoki yiqiladi. To'g'risi — eng katta qiymatdan bitta ko'p:
> ```cpp
> int cnt[1000001];
> ```

### 2. Katta massivni `main` ichida e'lon qilish

> [!WARNING]
> ```cpp
> int main() {
>     int cnt[10000001];   // lokal massiv
> }
> ```
> Lokal massivlar uchun joy kam, $10^7$ katakli massiv dasturni darhol yiqitadi. Bundan tashqari, lokal massiv nollar bilan to'ldirilmaydi — unda tasodifiy sonlar bo'ladi. To'g'risi — massivni `main` dan tashqarida, global e'lon qilish yoki `vector<int> cnt(MAXV + 1, 0);` ishlatish.

### 3. Manfiy qiymatni indeks qilish

> [!WARNING]
> ```cpp
> // -100 <= a_i <= 100
> cnt[value]++;   // value = -7 bo'lsa — cnt[-7]
> ```
> Manfiy indeks massivdan tashqaridagi xotirani buzadi. Kompilyator bu haqda ogohlantirmaydi. To'g'risi — siljitish:
> ```cpp
> cnt[value + 100]++;   // massiv o'lchami 201
> ```

### 4. Ko'p testli masalada butun massivni tozalash

> [!WARNING]
> ```cpp
> while (t--) {                       // t <= 10^4
>     memset(cnt, 0, sizeof(cnt));    // har safar 10^6 katak
>     ...
> }
> ```
> $10^4 \cdot 10^6 = 10^{10}$ amal — vaqt chegarasidan oshadi. Faqat shu testda o'zgargan kataklarni nolga qaytaring:
> ```cpp
> for (int i = 1; i <= n; i++) cnt[a[i]] = 0;
> ```
> Buning uchun shu testdagi elementlarni `a` massivida saqlab qo'ying.

## Xulosa

- Chastota massivi har bir qiymat necha marta uchrashini saqlaydi: `cnt[v]` — $v$ ning chastotasi.
- Sanash $O(n)$ vaqt oladi, so'ng har bir so'rovga $O(1)$ da javob beriladi.
- Massiv o'lchami qiymatlar diapazoniga bog'liq: $V \le 10^7$ bo'lsa, bemalol ishlatiladi.
- Manfiy qiymatlar uchun siljitish, juda katta qiymatlar uchun `map` ishlatiladi.
- Shu massivdan turli qiymatlar sonini, modani topish va sanab saralash mumkin.

**Masalada qanday tanib olish mumkin:** shartda "necha marta uchraydi", "takrorlanadi", "turli sonlar soni", "eng ko'p uchraydigan" so'zlari bor; qiymatlar kichik ($a_i \le 10^6$ yoki undan kam); bitta massiv bo'yicha ko'p so'rov beriladi.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| So'rov | query | Dasturga beriladigan alohida savol, unga javob chiqarish kerak. |
| Chastota | frequency | Qiymatning massivda necha marta uchrashi. |
| Chastota massivi | frequency array | $v$-katagida $v$ qiymatning chastotasi saqlanadigan massiv. |
| Qiymatlar diapazoni | value range | Elementlar qabul qilishi mumkin bo'lgan eng kichik va eng katta qiymat orasidagi oraliq. |
| Moda | mode | Massivda eng ko'p uchraydigan qiymat. |
| Sanab saralash | counting sort | Har bir qiymatni chastotasicha marta o'sish tartibida chiqarib saralash. |
| Siljitish | offset | Manfiy qiymatlarni manfiy bo'lmagan indeksga aylantirish uchun qo'shiladigan son. |

> [!TIP] O'zingizni tekshiring
> 1. $n \le 10^6$, $1 \le a_i \le 10^5$. `cnt` massivi qanday o'lchamda va qaysi turda bo'lishi kerak?
> 2. $-50 \le a_i \le 50$. Siljitishdan keyin $-50$ va $50$ qaysi kataklarga tushadi? Massiv o'lchami qancha?
> 3. Nega $t = 10^4$ ta testli masalada har testda butun `cnt` massivini tozalash xavfli?
>
> <details><summary>Javoblar</summary>
>
> 1. O'lchami $10^5 + 1$. Chastota $n \le 10^6$ dan oshmaydi, shuning uchun `int` yetarli.
> 2. Siljitish 50: $-50 \to 0$, $50 \to 100$. Massiv o'lchami 101.
> 3. Massiv o'lchami $10^6$ bo'lsa, $10^4 \cdot 10^6 = 10^{10}$ amal bajariladi. Faqat ishlatilgan kataklarni nolga qaytarish kerak.
>
> </details>
