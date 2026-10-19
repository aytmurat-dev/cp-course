---
summary: "Har bir qism to'plamni bitta butun son bilan ifodalab, barcha qism to'plamlarni oddiy sikl bilan ko'rib chiqish."
prerequisites: [complete-search, binary-numbers, bit-operations]
---

## Kirish

Ko'p masalalarda $n$ ta narsadan ba'zilarini tanlash kerak bo'ladi: qaysi buyumlarni olish, qaysi o'quvchilarni jamoaga qo'shish, qaysi sonlarni yig'ish. Agar $n$ kichik bo'lsa (odatda $n \le 20$), eng ishonchli yo'l — barcha tanlovlarni birma-bir tekshirish. Bu darsda buni bitta `for` sikli bilan qilishni o'rganasiz: har bir qism to'plam oddiy butun son bilan ifodalanadi. Darsdan keyin siz "$n \le 20$" cheklovli masalalarni o'n qatorcha kod bilan yecha olasiz.

## Muammo

Sizga $n$ ta musbat butun son $a_0, a_1, \dots, a_{n-1}$ va $S$ soni berilgan. Yig'indisi aynan $S$ ga teng bo'lgan nechta qism to'plam bor?

- **Kirish:** birinchi qatorda $n$ va $S$, ikkinchi qatorda $n$ ta son.
- **Chiqish:** bitta son — mos qism to'plamlar soni.
- **Cheklovlar:** $1 \le n \le 20$, $1 \le a_i \le 10^9$, $1 \le S \le 2 \cdot 10^{10}$.

```
4 5
3 1 4 2
```

Javob: `2`. Mos qism to'plamlar: $\{1, 4\}$ va $\{3, 2\}$.

E'tibor bering: bu darsda elementlar **0 dan** raqamlanadi. Nega bunday qulay ekanini "G'oya" bo'limida ko'rasiz.

Har bir element uchun ikki tanlov bor: olamiz yoki olmaymiz. Agar $n = 3$ bo'lsa, buni uchta ichma-ich sikl bilan yozish mumkin:

```cpp
// faqat n = 3 uchun ishlaydi
int ans = 0;
for (int t0 = 0; t0 < 2; t0++)
    for (int t1 = 0; t1 < 2; t1++)
        for (int t2 = 0; t2 < 2; t2++) {
            long long sum = 0;
            if (t0) sum += a[0];
            if (t1) sum += a[1];
            if (t2) sum += a[2];
            if (sum == s) ans++;
        }
```

Bu kod to'g'ri, lekin sikllar soni $n$ ga teng. $n$ esa faqat dastur ishlaganda ma'lum bo'ladi. $n = 20$ uchun 20 ta ichma-ich sikl yozib bo'lmaydi.

Muammo tezlikda emas. $n = 20$ da qism to'plamlar soni $2^{20} = 1\,048\,576$ — kompyuter uchun bu juda oz. Muammo shundaki, ularni **qanday qilib birma-bir ko'rib chiqishni** bilmaymiz. Buni rekursiya bilan ham qilish mumkin, lekin bundan ham sodda usul bor.

## G'oya

Keling, $n = 3$ uchun har bir tanlovni uchta raqam bilan yozaylik: element olinsa 1, olinmasa 0. Raqamlarni o'ngdan chapga yozamiz: eng o'ngda $a_0$, keyin $a_1$, keyin $a_2$.

| $a_2$ $a_1$ $a_0$ | O'nlik son | Qism to'plam |
|---|---|---|
| 0 0 0 | 0 | $\{\}$ |
| 0 0 1 | 1 | $\{a_0\}$ |
| 0 1 0 | 2 | $\{a_1\}$ |
| 0 1 1 | 3 | $\{a_0, a_1\}$ |
| 1 0 0 | 4 | $\{a_2\}$ |
| 1 0 1 | 5 | $\{a_0, a_2\}$ |
| 1 1 0 | 6 | $\{a_1, a_2\}$ |
| 1 1 1 | 7 | $\{a_0, a_1, a_2\}$ |

Chap ustunga qarang: bu 0 dan 7 gacha sonlarning ikkilik yozuvi. Demak, sakkizta qism to'plam — bu shunchaki 0, 1, …, 7 sonlari.

**0 dan $2^n - 1$ gacha bo'lgan har bir son aynan bitta qism to'plamni ifodalaydi: sonning $i$-biti 1 bo'lsa, $a_i$ to'plamga kiradi.**

Shu tarzda qism to'plamni ifodalovchi son **bitmask (bitmask)** deyiladi. Uning har bir biti bitta elementning to'plamda bor-yo'qligini bildiradi. Masalan, $n = 4$ va mask $= 10 = 1010_2$ bo'lsa, 1-bit va 3-bit yoqilgan, demak qism to'plam $\{a_1, a_3\}$.

Endi 0 dan raqamlashning sababi aniq: $i$-bitning qiymati $2^i$, eng o'ngdagi bit esa 0-bit. Element raqami bit raqamiga to'g'ridan-to'g'ri mos keladi.

> [!NOTE]
> To'xtang va o'ylang: $n$ ta element uchun bitmasklar qaysi oraliqda va ular nechta?

Eng kichik mask — barcha bitlar 0, ya'ni $0$ (bo'sh to'plam). Eng kattasi — $n$ ta bitning hammasi 1, ya'ni $2^n - 1$ (barcha elementlar). Jami $2^n$ ta mask: har bir element ikki holatda bo'lgani uchun aynan shuncha bo'lishi kerak edi. C++ da $2^n$ ni `1 << n` deb yozamiz.

Endi algoritmni qadamma-qadam yozaylik:

1. `mask` ni $0$ dan $2^n - 1$ gacha birma-bir o'zgartiramiz.
2. Har bir `mask` uchun $i = 0, 1, \dots, n-1$ bitlarni tekshiramiz.
3. $i$-bit ifodasi: `(mask >> i) & 1`. Surish $i$-bitni eng o'ngga olib keladi, `& 1` esa faqat shu bitni qoldiradi ("Bit amallari" darsini eslang).
4. Bit 1 bo'lsa, $a_i$ ni yig'indiga qo'shamiz.
5. Yig'indi $S$ ga teng bo'lsa, javobni bittaga oshiramiz.

3-qadamni misolda ko'raylik. $\text{mask} = 6 = 0110_2$, $i = 2$: $6 \gg 2 = 1 = 01_2$, $1 \,\&\, 1 = 1$ — demak $a_2$ to'plamda. $i = 0$ uchun: $6 \gg 0 = 6$, $6 \,\&\, 1 = 0$ — $a_0$ to'plamda yo'q.

Nega bu usul hech narsani tashlab ketmaydi va ikki marta sanamaydi? Ikki xil son kamida bitta bitda farq qiladi, demak ular ikki xil qism to'plamni beradi. Aksincha, istalgan qism to'plamning bitlarini yozsak, $0$ dan $2^n - 1$ gacha bo'lgan qandaydir son hosil bo'ladi. Shunday qilib, sonlar va qism to'plamlar o'rtasida birga-bir moslik bor.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // ma'lumotlarni o'qiymiz, elementlar 0 dan raqamlangan
    int n;
    long long s;
    cin >> n >> s;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    int ans = 0;
    // har bir mask — bitta qism to'plam
    for (int mask = 0; mask < (1 << n); mask++) {
        // mask ichidagi elementlar yig'indisi
        long long sum = 0;
        for (int i = 0; i < n; i++) {
            if ((mask >> i) & 1) sum += a[i];
        }
        if (sum == s) ans++;
    }

    cout << ans << '\n';
    return 0;
}
```

Kodning muhim joylari:

- Tashqi sikl shartida `<` turibdi, `<=` emas: oxirgi mask $2^n - 1$.
- `sum` va `a` — `long long`. 20 ta $10^9$ ning yig'indisi $2 \cdot 10^{10}$ ga yetadi, bu `int` ga sig'maydi.
- Bitni tekshirish `(mask >> i) & 1` — natija doim 0 yoki 1.
- Har bir mask uchun yig'indi noldan qayta hisoblanadi, shuning uchun `sum` sikl ichida e'lon qilingan.

## Misol

Testni olaylik: $n = 4$, $S = 5$, $a = [3, 1, 4, 2]$. Bitlar $a_3\,a_2\,a_1\,a_0$ tartibida yozilgan.

| mask | Bitlar | Elementlar | Yig'indi | $= 5$? |
|---|---|---|---|---|
| 0 | 0000 | — | 0 | |
| 1 | 0001 | 3 | 3 | |
| 2 | 0010 | 1 | 1 | |
| 3 | 0011 | 3, 1 | 4 | |
| 4 | 0100 | 4 | 4 | |
| 5 | 0101 | 3, 4 | 7 | |
| 6 | 0110 | 1, 4 | 5 | ✓ |
| 7 | 0111 | 3, 1, 4 | 8 | |
| 8 | 1000 | 2 | 2 | |
| 9 | 1001 | 3, 2 | 5 | ✓ |
| 10 | 1010 | 1, 2 | 3 | |
| 11 | 1011 | 3, 1, 2 | 6 | |
| 12 | 1100 | 4, 2 | 6 | |
| 13 | 1101 | 3, 4, 2 | 9 | |
| 14 | 1110 | 1, 4, 2 | 7 | |
| 15 | 1111 | 3, 1, 4, 2 | 10 | |

$\text{mask} = 6$ uchun ichki sikl qanday ishlashini batafsil ko'raylik:

| $i$ | `(6 >> i) & 1` | Amal | `sum` |
|---|---|---|---|
| 0 | 0 | — | 0 |
| 1 | 1 | $+ a_1 = 1$ | 1 |
| 2 | 1 | $+ a_2 = 4$ | 5 |
| 3 | 0 | — | 5 |

Faqat 6 va 9 masklarda yig'indi 5 ga teng. Dastur `2` chiqaradi — bu kutilgan javob.

## Murakkablik

**Vaqt:** $O(2^n \cdot n)$. Tashqi sikl $2^n$ marta, ichki sikl har safar $n$ marta aylanadi. $n = 20$ da bu $2^{20} \cdot 20 \approx 2 \cdot 10^7$ amal — 1 soniyaga bemalol sig'adi.

Lekin $2^n$ juda tez o'sadi. $n = 25$ da $3.3 \cdot 10^7 \cdot 25 \approx 8 \cdot 10^8$ amal — chegarada. $n = 30$ da esa $10^9 \cdot 30 = 3 \cdot 10^{10}$ — bir necha soniya emas, bir necha daqiqa.

**Xotira:** $O(n)$ — faqat massivning o'zi. Qism to'plamlar xotirada saqlanmaydi, har biri bitta `int` soni sifatida "o'tib ketadi".

> [!IMPORTANT]
> Cheklovda $n \le 20$ (ba'zan $n \le 22$) ko'rsangiz, birinchi navbatda bitmask bilan to'liq tanlashni o'ylang.

## Variantlar

### Ikki guruhga bo'lish

*Qachon kerak:* elementlarni ikki guruhga ajratish so'ralganda, masalan, yig'indilar farqi eng kichik bo'lsin.

Mask birinchi guruhni bildirsa, qolgan elementlar ikkinchi guruhga tushadi. Mask'da 0 bo'lgan elementlar to'plami **to'ldiruvchi (complement)** deyiladi. Son ko'rinishida u `((1 << n) - 1) ^ mask`. Lekin ko'pincha uni alohida hisoblash shart emas: ikkinchi guruh yig'indisi $\text{total} - \text{sum}$.

```cpp
long long best = LLONG_MAX;
for (int mask = 0; mask < (1 << n); mask++) {
    long long sum = 0;
    for (int i = 0; i < n; i++)
        if ((mask >> i) & 1) sum += a[i];
    best = min(best, llabs(total - 2 * sum));  // |sum - (total - sum)|
}
```

### Aniq $k$ ta elementli qism to'plamlar

*Qachon kerak:* "aynan $k$ ta element tanlang" degan shartda.

Sondagi 1 bitlar soni **popcount (popcount)** deyiladi. C++ da uni `__builtin_popcount(mask)` hisoblaydi. Masalan, `__builtin_popcount(13)` $= 3$, chunki $13 = 1101_2$.

```cpp
for (int mask = 0; mask < (1 << n); mask++) {
    if (__builtin_popcount(mask) != k) continue;
    // faqat k elementli qism to'plamlar shu yerga yetib keladi
}
```

### Maskning qism masklari

*Qachon kerak:* berilgan to'plamning ichidagi barcha qism to'plamlarni ko'rish kerak bo'lganda.

**Qism mask (submask)** — faqat berilgan mask'dagi 1 bitlar ichidan tanlangan bitlardan iborat mask. Ularni quyidagi sikl kamayish tartibida chiqaradi:

```cpp
for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
    // sub — mask'ning bo'sh bo'lmagan qism maski
}
```

$\text{mask} = 11 = 1011_2$ uchun `sub` ketma-ket $11, 10, 9, 8, 3, 2, 1$ qiymatlarni oladi. Bo'sh qism mask ($0$) sikl ichiga kirmaydi — kerak bo'lsa, uni alohida qarang.

## Ko'p uchraydigan xatolar

### Amallar tartibi

> [!WARNING]
> ```cpp
> if (mask & 1 << i == 1)  // XATO
> ```
> C++ da `==` amali `&` dan oldin bajariladi. Bu yozuv aslida `mask & ((1 << i) == 1)` degani va $i > 0$ da doim 0 beradi. Qavs qo'ysangiz ham `(mask & (1 << i)) == 1` faqat $i = 0$ da ishlaydi: natija 1 emas, $2^i$ bo'ladi.
>
> To'g'ri: `if ((mask >> i) & 1)` yoki `if (mask & (1 << i))`.

### Bitta ortiqcha mask

> [!WARNING]
> ```cpp
> for (int mask = 0; mask <= (1 << n); mask++)  // XATO
> ```
> $2^n$ soni $n$-bitni yoqadi, lekin $a_n$ element yo'q. Ichki sikl uni bo'sh to'plam deb qabul qiladi va bo'sh to'plam ikki marta sanaladi.
>
> To'g'ri: `mask < (1 << n)`.

### Yig'indining to'lib ketishi

> [!WARNING]
> ```cpp
> int sum = 0;  // XATO
> ```
> $20 \cdot 10^9 = 2 \cdot 10^{10}$, `int` esa taxminan $2.1 \cdot 10^9$ gacha sig'adi. Natijada to'lib ketish (overflow) bo'ladi va javob noto'g'ri chiqadi.
>
> To'g'ri: `long long sum = 0;`

### Bo'sh to'plamni unutish

> [!WARNING]
> "Eng kichik yig'indili bo'sh bo'lmagan qism to'plam" kabi masalada `mask = 0` dan boshlasangiz, javob doim 0 chiqadi — bu bo'sh to'plam.
>
> To'g'ri: shartni o'qing. Bo'sh to'plam mumkin bo'lmasa, siklni `mask = 1` dan boshlang.

## Xulosa

- $n$ ta elementning har bir qism to'plami $0$ dan $2^n - 1$ gacha bo'lgan bitta son — bitmask.
- $a_i$ to'plamda ekanini `(mask >> i) & 1` tekshiradi; elementlar 0 dan raqamlanadi.
- Barcha qism to'plamlarni ko'rish — bitta `for` sikli, vaqt $O(2^n \cdot n)$.
- Yig'indilar uchun `long long`, sikl shartida `<` ishlating.

**Masalada qanday tanib olish mumkin:**

- cheklovda $n \le 20$ (ba'zan 15, 18, 22);
- shartda "tanlang", "ikki guruhga bo'ling", "bir nechtasini oling" kabi so'zlar;
- har bir element faqat ikki holatda bo'ladi: olinadi yoki olinmaydi.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| bitmask | bitmask | Har bir biti bitta elementning to'plamda bor-yo'qligini bildiradigan butun son. |
| to'ldiruvchi | complement | Mask'ka kirmagan elementlardan iborat to'plam. |
| popcount | popcount | Sonning ikkilik yozuvidagi 1 lar soni. |
| qism mask | submask | Faqat berilgan mask'dagi 1 bitlardan tanlab olingan bitlarga ega mask. |

> [!TIP] O'zingizni tekshiring
> 1. $n = 5$ va $\text{mask} = 13$ bo'lsa, qaysi elementlar tanlangan?
>
> <details>
> <summary>Javob</summary>
>
> $13 = 01101_2$, ya'ni 0-, 2- va 3-bitlar yoqilgan: $\{a_0, a_2, a_3\}$.
>
> </details>
>
> 2. $n = 22$ bo'lsa, dastur taxminan nechta amal bajaradi va 1 soniyaga sig'adimi?
>
> <details>
> <summary>Javob</summary>
>
> $2^{22} \cdot 22 \approx 4.2 \cdot 10^6 \cdot 22 \approx 9.2 \cdot 10^7$ amal. Chegarada, lekin oddiy amallar bo'lgani uchun odatda sig'adi.
>
> </details>
>
> 3. Nega `(mask & (1 << i)) == 1` sharti faqat $i = 0$ da to'g'ri ishlaydi?
>
> <details>
> <summary>Javob</summary>
>
> Bit yoqilgan bo'lsa, `mask & (1 << i)` ning qiymati 1 emas, $2^i$ bo'ladi. Faqat $i = 0$ da $2^0 = 1$.
>
> </details>
