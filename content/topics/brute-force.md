---
summary: "Barcha variantlarni tekshirib yechish va yechim vaqtga sig'ishini cheklovlardan oldindan baholash."
prerequisites: []
problems: []
---

## Kirish

Har qanday masalani yechishning eng sodda yo'li bor: barcha mumkin bo'lgan variantlarni birma-bir tekshirib chiqish. Bu usul **to'liq tanlash (brute force)** deyiladi. Olimpiadada u ko'pincha birinchi qadam bo'ladi: ba'zan to'liq yechim, ba'zan qisman ball, ba'zan esa tezroq yechimni tekshirish vositasi.

Lekin doim bitta savol qoladi: bu yechim vaqtga sig'adimi? Shu darsdan keyin siz kod yozishdan oldin u qancha amal bajarishini hisoblay olasiz. Cheklovlarga qarab, to'liq tanlash o'tadimi yoki boshqa usul kerakmi, aniq ayta olasiz.

## Muammo

Keling, aniq masaladan boshlaylik.

**Masala.** $n$ ta butun son $a_1, a_2, \dots, a_n$ va $k$ soni berilgan. $i < j$ va $a_i + a_j = k$ shartni bajaradigan $(i, j)$ juftliklar sonini toping.

- **Kirish:** birinchi qatorda $n$ va $k$, ikkinchi qatorda $n$ ta son.
- **Chiqish:** bitta son — juftliklar soni.
- **Cheklovlar:** $1 \le n \le 2000$, $|a_i| \le 2 \cdot 10^9$, $|k| \le 2 \cdot 10^9$.

Test:

```
5 6
1 5 3 3 5
```

Javob: `3`. Bular $(1, 2)$: $1 + 5$, $(1, 5)$: $1 + 5$ va $(3, 4)$: $3 + 3$.

Eng sodda fikr: barcha juftliklarni ko'rib chiqamiz va har birining yig'indisini tekshiramiz.

```cpp
long long pairCount = 0;
for (int i = 1; i <= n; i++)
    for (int j = i + 1; j <= n; j++)
        if (a[i] + a[j] == k) pairCount++;
```

Bu kod to'g'ri. Lekin u tezmi? "Tez" so'zi o'rniga hisoblaylik. Tekshiruv har bir juftlik uchun bir marta bajariladi, juftliklar soni esa $\frac{n(n-1)}{2}$. $n = 2000$ da bu taxminan $2 \cdot 10^6$ amal — kompyuter uni bir zumda bajaradi.

Endi cheklov $n \le 2 \cdot 10^5$ bo'ldi deylik. Unda juftliklar taxminan $2 \cdot 10^{10}$ ta. Kompyuter 1 soniyada taxminan $10^8$ oddiy amal bajaradi, demak kod 200 soniya ishlaydi. Vaqt cheklovi esa odatda 1–2 soniya. **Bitta kod bir cheklovda o'tadi, boshqasida o'tmaydi** — buni kod yozishdan oldin bilish kerak.

## G'oya

**To'liq tanlash barcha nomzodlarni sanab chiqib, har birini tekshiradi; uning tezligini esa amallar soni $n$ ga qarab qanday o'sishi bilan baholaymiz.**

### 1-qadam: nomzodlar va tekshiruv

Har bir to'liq tanlash yechimi ikki qismdan iborat. Birinchisi — nomzodlar: nimani sanab chiqamiz? Bizda bu barcha $(i, j)$ juftliklar. Ikkinchisi — tekshiruv: nomzod mos keladimi? Bizda bu $a_i + a_j = k$ sharti.

Nega bu yechim doim to'g'ri? Chunki biz birorta ham nomzodni o'tkazib yubormaymiz. Agar mos juftlik bor bo'lsa, sikl unga albatta yetib keladi.

### 2-qadam: amallarni sanash

Kichik misolda sanaylik. $n = 5$ bo'lsin. Har bir $i$ uchun ichki sikl necha marta ishlaydi?

| $i$ | $j$ qiymatlari | Tekshiruvlar soni |
|---|---|---|
| 1 | 2, 3, 4, 5 | 4 |
| 2 | 3, 4, 5 | 3 |
| 3 | 4, 5 | 2 |
| 4 | 5 | 1 |
| 5 | — | 0 |
| | **Jami** | **10** |

Jami $4 + 3 + 2 + 1 = 10 = \frac{5 \cdot 4}{2}$. Umumiy holda tekshiruvlar soni $\frac{n(n-1)}{2} = \frac{n^2}{2} - \frac{n}{2}$ ga teng.

### 3-qadam: Big-O — faqat o'sish tezligi

Aniq formula bilan ishlash noqulay. Bizni bitta narsa qiziqtiradi: $n$ o'sganda amallar soni qanday o'sadi? Raqamlarga qaraylik.

| $n$ | $\frac{n^2}{2}$ | $\frac{n}{2}$ |
|---|---|---|
| 10 | 50 | 5 |
| 1000 | 500 000 | 500 |
| $10^5$ | $5 \cdot 10^9$ | $5 \cdot 10^4$ |

Katta $n$ da $\frac{n}{2}$ hadi deyarli ta'sir qilmaydi. $\frac{1}{2}$ ko'paytuvchi ham xulosani o'zgartirmaydi: $5 \cdot 10^9$ ham, $10^{10}$ ham 1 soniyaga sig'maydi.

Shuning uchun ikkita qoida qo'llaymiz. Eng tez o'suvchi haddan boshqasini tashlaymiz. O'zgarmas ko'paytuvchini ham tashlaymiz. Natijada $n^2$ qoladi. Buni **vaqt murakkabligi (time complexity)** deymiz va $O(n^2)$ deb yozamiz. $O$ belgisi "shu tartibda o'sadi" degan ma'noni bildiradi.

> [!NOTE]
> To'xtang va o'ylang: $3n^2 + 100n + 7$ ifodaning murakkabligi qanday? Har biri $1$ dan $n$ gacha bo'lgan uchta ichma-ich sikl-chi?

Birinchisi $O(n^2)$: $100n$ va $7$ ni, so'ng $3$ ni tashlaymiz. Ikkinchisida ichki qism $n \cdot n \cdot n$ marta bajariladi, demak $O(n^3)$. Qoida oddiy: ichma-ich sikllarning takrorlanishlari ko'paytiriladi, ketma-ket sikllarniki esa qo'shiladi.

### 4-qadam: cheklovdan murakkablikni o'qish

Asosiy hisob qoidasi: **1 soniyada taxminan $10^8$ oddiy amal**. Murakkablikka $n$ ning eng katta qiymatini qo'yamiz va natijani $10^8$ bilan solishtiramiz.

Jadvalda $\log n$ uchraydi. Bu $n$ ni necha marta ikkiga bo'lsak, 1 qolishini bildiradi: $\log 1000 \approx 10$, $\log 10^6 \approx 20$.

| Murakkablik | $n = 10$ | $n = 20$ | $n = 2000$ | $n = 2 \cdot 10^5$ |
|---|---|---|---|---|
| $O(n)$ | 10 | 20 | $2 \cdot 10^3$ | $2 \cdot 10^5$ |
| $O(n \log n)$ | 33 | 86 | $2.2 \cdot 10^4$ | $3.5 \cdot 10^6$ |
| $O(n^2)$ | 100 | 400 | $4 \cdot 10^6$ | $4 \cdot 10^{10}$ ✗ |
| $O(n^3)$ | 1000 | 8000 | $8 \cdot 10^9$ ✗ | ✗ |
| $O(2^n)$ | 1024 | $\approx 10^6$ | ✗ | ✗ |
| $O(n!)$ | $3.6 \cdot 10^6$ | $2.4 \cdot 10^{18}$ ✗ | ✗ | ✗ |

Bu jadvalni teskari yo'nalishda o'qish ham juda foydali. Cheklovni ko'rib, qanday murakkablik kutilayotganini bilib olasiz.

| $n$ ning chegarasi | Qaysi murakkablik o'tadi |
|---|---|
| $n \le 10$ | $O(n!)$ |
| $n \le 20$ | $O(2^n)$, $O(n \cdot 2^n)$ |
| $n \le 500$ | $O(n^3)$ |
| $n \le 5000$ | $O(n^2)$ |
| $n \le 10^6$ | $O(n \log n)$ |
| $n \le 10^8$ | $O(n)$ |

Bizning masalada $n \le 2000$, demak $O(n^2)$ yechim bemalol o'tadi.

## Amalga oshirish

Massivni 1-indeksli saqlaymiz: $a_1$ dan $a_n$ gacha, `a[0]` ishlatilmaydi.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Kirishni o'qiymiz: n, k va 1-indeksli massiv
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    // Barcha i < j juftliklarni ko'rib chiqamiz
    long long pairCount = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            // Tekshiruv: juftlik yig'indisi k ga tengmi?
            if (a[i] + a[j] == k) pairCount++;
        }
    }

    // Javobni chiqaramiz
    cout << pairCount << "\n";
    return 0;
}
```

Kodning muhim joylari:

- `j` sikli `i + 1` dan boshlanadi. Shunda har bir juftlik bir marta sanaladi va $i = j$ holati tushib qoladi.
- `a` va `k` turi `long long`. Ikki son yig'indisi $4 \cdot 10^9$ gacha yetadi, bu `int` ga sig'maydi.
- `pairCount` ham `long long`. Bu masalada `int` yetadi, lekin javob $n^2$ tartibida bo'lsa, odat sizni qutqaradi.

## Misol

Testni qo'lda bajaraylik: $n = 5$, $k = 6$, $a = [1, 5, 3, 3, 5]$.

| $i$ | $j$ | $a_i$ | $a_j$ | $a_i + a_j$ | $= 6$? | `pairCount` |
|---|---|---|---|---|---|---|
| 1 | 2 | 1 | 5 | 6 | ✓ | 1 |
| 1 | 3 | 1 | 3 | 4 | ✗ | 1 |
| 1 | 4 | 1 | 3 | 4 | ✗ | 1 |
| 1 | 5 | 1 | 5 | 6 | ✓ | 2 |
| 2 | 3 | 5 | 3 | 8 | ✗ | 2 |
| 2 | 4 | 5 | 3 | 8 | ✗ | 2 |
| 2 | 5 | 5 | 5 | 10 | ✗ | 2 |
| 3 | 4 | 3 | 3 | 6 | ✓ | 3 |
| 3 | 5 | 3 | 5 | 8 | ✗ | 3 |
| 4 | 5 | 3 | 5 | 8 | ✗ | 3 |

Jami 10 ta tekshiruv bo'ldi — bu $\frac{5 \cdot 4}{2}$ formulaga mos. Javob `3`, kutilgan natija bilan bir xil.

## Murakkablik

**Vaqt:** $O(n^2)$, chunki tekshiruv $\frac{n(n-1)}{2}$ marta bajariladi. $n = 2000$ da bu taxminan $2 \cdot 10^6$ amal — $10^8$ chegaradan 50 marta kam.

**Xotira:** $O(n)$, faqat massivni saqlaymiz. Xotira ham cheklangan, odatda 256 MB. Bitta `long long` 8 bayt egallaydi, shuning uchun 256 MB ga taxminan $3 \cdot 10^7$ ta son sig'adi. Bizning 2000 ta son esa atigi 16 KB.

## Variantlar

### Uchliklarni tanlash

**Qachon kerak:** shart uchta element haqida bo'lsa va $n \le 500$ atrofida bo'lsa. Uchta ichma-ich sikl yozamiz. Uchliklar soni taxminan $\frac{n^3}{6}$, ya'ni $n = 500$ da $2 \cdot 10^7$ — o'tadi.

```cpp
for (int i = 1; i <= n; i++)
    for (int j = i + 1; j <= n; j++)
        for (int t = j + 1; t <= n; t++)
            if (a[i] + a[j] + a[t] == k) tripleCount++;
```

### Javob qiymatlarini tanlash

**Qachon kerak:** javob kichik oraliqda yotsa. Masalan, $1 \le x \le 1000$ oralig'ida $x^3 + x = s$ tenglamani yeching. Elementlar o'rniga javobning o'zini sanab chiqamiz: atigi 1000 ta nomzod.

```cpp
for (long long x = 1; x <= 1000; x++)
    if (x * x * x + x == s) cout << x << "\n";
```

### Tekshiruvchi sifatida

**Qachon kerak:** siz tezroq yechim yozdingiz, lekin uning to'g'riligiga ishonchingiz komil emas. Kichik tasodifiy testlar yaratasiz va ikkala yechim javobini solishtirasiz. To'liq tanlash xato qilmaydi, shuning uchun farq chiqsa, xato tez yechimda bo'ladi.

## Ko'p uchraydigan xatolar

### Yig'indining to'lib ketishi

> [!WARNING]
> ```cpp
> vector<int> a(n + 1);
> if (a[i] + a[j] == k) pairCount++;
> ```
> $a_i = a_j = 2 \cdot 10^9$ har biri `int` ga sig'adi, lekin yig'indi $4 \cdot 10^9$ — `int` chegarasi esa taxminan $2.1 \cdot 10^9$. Natija **to'lib ketish (overflow)** bilan buziladi. To'g'ri variant: `vector<long long> a(n + 1);` yoki `1LL * a[i] + a[j]`.

### Juftlikni ikki marta sanash

> [!WARNING]
> ```cpp
> for (int i = 1; i <= n; i++)
>     for (int j = 1; j <= n; j++)
>         if (a[i] + a[j] == k) pairCount++;
> ```
> Bu kod $(1, 2)$ ni ham, $(2, 1)$ ni ham sanaydi. Yana $i = j$ holatini ham oladi. Bizning testda u `3` o'rniga `8` chiqaradi. To'g'ri variant: `for (int j = i + 1; j <= n; j++)`.

### Indekslar chegarasini chalkashtirish

> [!WARNING]
> ```cpp
> vector<long long> a(n);          // 0 dan n-1 gacha
> for (int i = 1; i <= n; i++) cin >> a[i];
> ```
> Bu yerda ko'pchilik 1-indeksli siklni 0-indeksli massivga qo'llaydi. `a[n]` massivdan tashqarida, dastur xato ishlaydi yoki yiqiladi. Yo `vector<long long> a(n + 1)` oling, yo siklni `for (int i = 0; i < n; i++)` qiling.

### Yashirin sikl

> [!WARNING]
> ```cpp
> for (int i = 1; i <= n; i++)
>     pairCount += count(a.begin() + i + 1, a.end(), k - a[i]);
> ```
> Bitta sikl ko'rinadi, lekin `count` o'zi massivni boshidan oxirigacha ko'radi. Haqiqiy murakkablik $O(n^2)$, $O(n)$ emas. Murakkablikni baholayotganda har bir STL funksiyasining narxini hisobga oling: `count`, `find`, vektor nusxasi — barchasi $O(n)$.

## Xulosa

- To'liq tanlash ikki qismdan iborat: nomzodlarni sanab chiqish va har birini tekshirish. U doim to'g'ri javob beradi.
- Big-O faqat eng tez o'suvchi hadni qoldiradi, o'zgarmas ko'paytuvchilarni tashlaydi. Ichma-ich sikllar ko'paytiriladi, ketma-ketlari qo'shiladi.
- **1 soniyada taxminan $10^8$ amal.** Kod yozishdan oldin murakkablikka $n$ ning eng katta qiymatini qo'yib hisoblang.
- Ikki katta son yig'indisi yoki ko'paytmasi uchun `long long` ishlating.

**Masalada qanday tanib olish mumkin:** $n$ kichik ($n \le 20$, $n \le 500$, $n \le 5000$); javob kichik oraliqda yotadi; shartda "barcha juftliklar", "nechta usul bilan", "mumkin bo'lgan barcha" so'zlari bor. $n$ katta bo'lsa ham, to'liq tanlash qisman ball yoki tekshiruv uchun yaraydi.

> [!TIP] O'zingizni tekshiring
> 1. $n \le 10^5$ bo'lsa, $O(n^2)$ yechim 1 soniyaga sig'adimi?
> 2. Tashqi sikl $i = 1..n$, ichkisi $j = 1..i$. Murakkablik qanday?
> 3. Avval $1..n$ sikl, keyin alohida $1..m$ sikl bor. Murakkablik qanday?
>
> <details><summary>Javoblar</summary>
>
> 1. Yo'q: $10^{10}$ amal, taxminan 100 soniya.
> 2. $1 + 2 + \dots + n = \frac{n(n+1)}{2}$ tekshiruv, ya'ni $O(n^2)$.
> 3. Sikllar ketma-ket, shuning uchun qo'shiladi: $O(n + m)$.
>
> </details>
