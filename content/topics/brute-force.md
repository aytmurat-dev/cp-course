---
summary: "Barcha variantlarni sinab chiqish usuli va dastur vaqtga sig'ishini kod yozishdan oldin hisoblash."
prerequisites: []
---

## Kirish

Har qanday masalani yechishning eng oddiy yo'li — barcha mumkin bo'lgan variantlarni birma-bir tekshirib chiqish. Bu usul **brute force** deyiladi. U olimpiada masalalarining katta qismida birinchi qadam bo'ladi, ba'zan esa yagona kerakli yechim.

Bu darsdan keyin siz brute force yechim yoza olasiz va kod yozishdan oldin u 1 soniyaga sig'ish-sig'masligini hisoblay olasiz.

## Muammo

**Masala.** $n$ ta butun sondan iborat $a_1, a_2, \dots, a_n$ massiv berilgan. Massivning ketma-ket turgan elementlaridan iborat bo'sh bo'lmagan bo'lagi **qism massiv (subarray)** deyiladi. Yig'indisi eng katta bo'lgan qism massivni topib, uning yig'indisini chiqaring.

- **Kirish:** birinchi qatorda $n$, ikkinchi qatorda $a_1, \dots, a_n$.
- **Chiqish:** bitta son — eng katta yig'indi.
- **Cheklovlar (constraints):** $1 \le n \le 5000$, $-10^9 \le a_i \le 10^9$. Vaqt — 1 soniya.

| Kirish | Chiqish |
|---|---|
| `6`<br>`2 -5 3 4 -1 2` | `8` |

Javob $8$ ga teng: bu $[3, 4, -1, 2]$ qism massivning yig'indisi.

Eng birinchi xayolga keladigan yechim: barcha $(l, r)$ juftliklarni olamiz va har biri uchun $a_l + \dots + a_r$ ni alohida hisoblaymiz.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    long long best = LLONG_MIN;
    for (int l = 1; l <= n; l++)
        for (int r = l; r <= n; r++) {
            long long sum = 0;
            for (int i = l; i <= r; i++) sum += a[i];
            best = max(best, sum);
        }
    cout << best << "\n";
}
```

Kod to'g'ri ishlaydi. Lekin u qancha vaqt ishlaydi? Keling, sanab ko'raylik. $n = 6$ da $(l, r)$ juftliklar soni $6 + 5 + 4 + 3 + 2 + 1 = 21$ ta. Umuman olganda ular $\frac{n(n+1)}{2}$ ta, $n = 5000$ da esa taxminan $1{,}25 \cdot 10^7$ ta.

Har bir juftlik uchun ichki sikl o'rtacha $n/3$ marta aylanadi. Jami taxminan $\frac{n^3}{6} \approx 2 \cdot 10^{10}$ amal. Kompyuter 1 soniyada taxminan $10^8$ ta oddiy amal bajaradi. Demak, bu dastur **200 soniya** ishlaydi. Dastur berilgan vaqtga sig'magandagi tekshiruv natijasi **vaqt chegarasidan oshish (Time Limit Exceeded, TLE)** deyiladi — bu yechim shunday natija oladi.

## G'oya

Bu bo'limda ikki narsani o'rganamiz: dastur tezligini oldindan qanday baholash va yuqoridagi yechimni qanday tezlashtirish.

### 1-qadam. Amallarni sanash

Yuqorida biz aniq formula chiqardik: taxminan $\frac{n^3}{6}$ amal. Amalda bunday aniqlik kerak emas. $n$ katta bo'lganda $\frac{1}{6}$ kabi ko'paytuvchi yoki qo'shimcha $+n$ natijani deyarli o'zgartirmaydi. Hal qiluvchi narsa — $n$ ning **qaysi darajasi** qatnashgani.

Shuning uchun **Big-O belgilash (Big-O notation)** ishlatiladi. Qoidasi oddiy: eng tez o'sadigan hadni qoldiramiz, o'zgarmas ko'paytuvchilarni tashlaymiz.

| Aniq hisob | Big-O |
|---|---|
| $\frac{n^3}{6} + \frac{n^2}{2}$ | $O(n^3)$ |
| $\frac{n(n+1)}{2}$ | $O(n^2)$ |
| $3n + 5$ | $O(n)$ |
| $20$ | $O(1)$ |

Dastur bajaradigan amallar soni uning **vaqt murakkabligi (time complexity)** deyiladi. Bizning birinchi yechimimiz — $O(n^3)$.

### 2-qadam. Turli murakkabliklar qanchalik farq qiladi

Raqamlarga qarang:

| $n$ | $\log_2 n$ | $n$ | $n \log_2 n$ | $n^2$ | $n^3$ | $2^n$ |
|---|---|---|---|---|---|---|
| $10$ | $3$ | $10$ | $33$ | $100$ | $1000$ | $1024$ |
| $1000$ | $10$ | $10^3$ | $10^4$ | $10^6$ | $10^9$ | $\approx 10^{301}$ |
| $10^5$ | $17$ | $10^5$ | $1{,}7 \cdot 10^6$ | $10^{10}$ | $10^{15}$ | — |

$n = 10$ da hamma yechim bir zumda ishlaydi. $n = 10^5$ da esa $O(n^2)$ yechim 100 soniya oladi, $O(n \log n)$ esa sezilmaydi.

### 3-qadam. Cheklovlarni o'qish

Shu jadvaldan olimpiadachining eng muhim qurollaridan biri kelib chiqadi. Murakkablikka $n$ ning chegarasini qo'yamiz va natija $10^8$ dan oshmasligini talab qilamiz.

| $n$ ning chegarasi | Sig'adigan murakkablik |
|---|---|
| $n \le 10$ | $O(n!)$ |
| $n \le 20$ | $O(2^n \cdot n)$ |
| $n \le 500$ | $O(n^3)$ |
| $n \le 5000$ | $O(n^2)$ |
| $n \le 2 \cdot 10^5$ | $O(n \log n)$ |
| $n \le 10^7$ | $O(n)$ |
| $n \le 10^{18}$ | $O(\log n)$ yoki $O(1)$ |

**Masalani o'qiganda avval cheklovlarga qarang: ular kerakli yechim murakkabligini aytib turadi.** Bizda $n \le 5000$, demak $O(n^2)$ yechim kutilmoqda.

> [!NOTE]
> To'xtang va o'ylang: $O(n^3)$ yechimdagi qaysi ish ortiqcha? Bitta $l$ uchun $r = 4$ va $r = 5$ dagi yig'indilarni solishtiring.

### 4-qadam. Ortiqcha ishni olib tashlash

$l = 3$ ni olaylik. $r = 4$ da $a_3 + a_4$ ni hisobladik. $r = 5$ da esa $a_3 + a_4 + a_5$ ni **noldan** qayta hisoblayapmiz. Vaholanki, u oldingi yig'indiga bitta $a_5$ qo'shilganiga teng.

**Asosiy kuzatish: $l$ o'zgarmasa, $\text{sum}(l, r) = \text{sum}(l, r-1) + a_r$, ya'ni yangi yig'indi bitta qo'shish bilan topiladi.**

Demak, ichki $i$ sikli kerak emas. $l$ ni tanlaymiz, `sum = 0` qilamiz, $r$ ni $l$ dan $n$ gacha oshirib, har safar `sum += a[r]` qilamiz. Juftliklar soni o'zgarmadi — $\frac{n(n+1)}{2}$, lekin har biri endi $O(1)$ vaqt oladi. Jami $O(n^2)$.

Nega bu doim to'g'ri? Biz baribir **barcha** $(l, r)$ juftliklarni ko'rib chiqyapmiz, hech birini tashlab ketmayapmiz. Faqat har bir yig'indini qayta hisoblash o'rniga oldingisidan foydalanyapmiz. Bu hamon brute force — shunchaki aqlliroq brute force.

## Amalga oshirish

Massiv 1-indeksli: $a_1, \dots, a_n$.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Ma'lumotlarni o'qiymiz (1-indeksli)
    int n;
    cin >> n;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    // Javobni eng kichik qiymat bilan boshlaymiz
    long long best = LLONG_MIN;

    // Har bir chap chegara l uchun
    for (int l = 1; l <= n; l++) {
        // Har bir yangi l da yig'indi noldan boshlanadi
        long long sum = 0;
        // O'ng chegarani surib, yig'indiga bitta element qo'shamiz
        for (int r = l; r <= n; r++) {
            sum += a[r];
            best = max(best, sum);
        }
    }

    // Javobni chiqaramiz
    cout << best << "\n";
    return 0;
}
```

Kodning muhim joylari:

- `long long` — yig'indi $5000 \cdot 10^9 = 5 \cdot 10^{12}$ gacha yetadi, `int` esa faqat $\approx 2{,}1 \cdot 10^9$ gacha sig'adi.
- `best = LLONG_MIN` — barcha sonlar manfiy bo'lsa ham javob to'g'ri chiqadi.
- `sum = 0` aynan $l$ siklining **ichida** turibdi: har bir yangi chap chegara uchun yig'indi qaytadan boshlanadi.

## Misol

Testni qo'lda bajaraylik: $a = [2, -5, 3, 4, -1, 2]$. Har bir katakda — $r$ qadamidagi `sum` qiymati.

| $l$ \ $r$ | 1 | 2 | 3 | 4 | 5 | 6 | Qatordagi eng katta |
|---|---|---|---|---|---|---|---|
| 1 | 2 | −3 | 0 | 4 | 3 | 5 | 5 |
| 2 | | −5 | −2 | 2 | 1 | 3 | 3 |
| 3 | | | 3 | 7 | 6 | **8** | 8 |
| 4 | | | | 4 | 3 | 5 | 5 |
| 5 | | | | | −1 | 1 | 1 |
| 6 | | | | | | 2 | 2 |

Har bir qatorda keyingi son oldingisiga bitta $a_r$ qo'shilishidan hosil bo'ladi. Masalan, 3-qatorda: $3 \to 3 + 4 = 7 \to 7 - 1 = 6 \to 6 + 2 = 8$. Eng katta qiymat $8$, u $l = 3$, $r = 6$ da. Javob $8$ — kutilgan natija bilan mos keldi.

## Murakkablik

- **Vaqt:** $O(n^2)$. Ichki sikl jami $\frac{n(n+1)}{2} \approx 1{,}25 \cdot 10^7$ marta ishlaydi — bu $10^8$ dan ancha kam, taxminan 0,1 soniya.
- **Xotira:** $O(n)$ — faqat massivning o'zi. Dastur egallaydigan xotira hajmining $n$ ga bog'liqligi **xotira murakkabligi (space complexity)** deyiladi. $5000$ ta `long long` atigi 40 KB egallaydi.

Xotirani ham baholash foydali: odatda chegara 256 MB. $10^6$ ta `int` — 4 MB, $10^6$ ta `long long` — 8 MB. $10^4 \times 10^4$ o'lchamli `int` jadval esa 400 MB — u sig'maydi.

## Variantlar

### Juftliklarni tekshirish

**Qachon kerak:** "shunday $i < j$ juftliklar sonini toping…" turidagi masalalarda, $n \le 5000$ bo'lsa. Ikkita ichma-ich sikl yetarli:

```cpp
long long cnt = 0;
for (int i = 1; i <= n; i++)
    for (int j = i + 1; j <= n; j++)
        if (a[i] + a[j] == k) cnt++;
```

### Javobning o'zini tanlash

**Qachon kerak:** javob kichik oraliqda yotganda, masalan $1 \le x \le 10^6$. Har bir $x$ ni sinab, uni $O(1)$ yoki $O(\log n)$ vaqtda tekshiramiz. Bu yerda massiv elementlari emas, **mumkin bo'lgan javoblar** tanlanadi.

### Qism to'plamlar va permutatsiyalar

**Qachon kerak:** $n \le 20$ (qism to'plamlar, $2^n$ ta) yoki $n \le 10$ (permutatsiyalar, $n!$ ta). Bu brute force'ning eng kuchli ko'rinishi, uni keyingi darsda batafsil ko'ramiz.

## Ko'p uchraydigan xatolar

### Yig'indi uchun `int`

> [!WARNING]
> ```cpp
> int sum = 0;
> ```
> $5 \cdot 10^{12}$ `int` ga sig'maydi va **to'lib ketish (overflow)** yuz beradi: yig'indi manfiy yoki tasodifiy songa aylanadi. To'g'risi: `long long sum = 0;`. Qoida: yig'indi yoki ko'paytma $2 \cdot 10^9$ dan oshishi mumkin bo'lsa — `long long`.

### Javobni noldan boshlash

> [!WARNING]
> ```cpp
> long long best = 0;
> ```
> $a = [-3, -1, -2]$ uchun bu kod $0$ chiqaradi. Lekin qism massiv bo'sh bo'lmasligi kerak, to'g'ri javob $-1$. To'g'risi: `long long best = LLONG_MIN;` yoki `best = a[1];`.

### `sum = 0` noto'g'ri joyda

> [!WARNING]
> ```cpp
> long long sum = 0;
> for (int l = 1; l <= n; l++)
>     for (int r = l; r <= n; r++) { sum += a[r]; ... }
> ```
> Yig'indi bir $l$ dan keyingisiga o'tib qoladi va mutlaqo noto'g'ri qiymatlar chiqadi. `sum = 0` har bir yangi $l$ da, ya'ni tashqi sikl ichida yozilishi shart.

### Chegaralarni aralashtirish

> [!WARNING]
> ```cpp
> for (int r = l; r < n; r++)
> ```
> Massiv 1-indeksli bo'lsa, bu sikl $a_n$ ni hech qachon qo'shmaydi. Ko'pchilik 0-indeksli odat bilan `r < n` deb yozadi. To'g'risi: 1-indeksda `r <= n`, 0-indeksda `r < n`. Bitta kodda faqat bitta indekslashni ishlating.

### Hisoblamasdan yozish

> [!WARNING]
> $n \le 2 \cdot 10^5$ bo'lganda $O(n^2)$ yechim yozish: $4 \cdot 10^{10}$ amal, 400 soniya. Kod yozishdan oldin murakkablikni chegaraga qo'yib, $10^8$ bilan solishtiring.

## Xulosa

- Brute force — barcha variantlarni tekshirish. U doim to'g'ri, savol faqat vaqtga sig'ishida.
- Big-O amallar soni $n$ ga qarab qanday o'sishini ko'rsatadi. O'zgarmas ko'paytuvchilar tashlanadi.
- 1 soniyada $\approx 10^8$ oddiy amal. Murakkablikka $n$ ni qo'ying va shu son bilan solishtiring.
- Oldingi natijadan foydalanib, ortiqcha qayta hisoblashni olib tashlang: $O(n^3) \to O(n^2)$.
- Katta yig'indilar uchun `long long` ishlating, javobni esa to'g'ri boshlang'ich qiymat bilan boshlang.

**Masalada brute force'ni qanday tanib olish mumkin:** $n$ kichik ($n \le 20$, $n \le 500$, $n \le 5000$); shartda "barcha juftliklar", "barcha qism massivlar", "har bir variant uchun" kabi so'zlar bor; javob kichik oraliqda yotadi. Har qanday masalada esa brute force — sekinroq, lekin ishonchli yechim. U tezroq yechimni tekshirish uchun juda foydali.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Brute force | Brute force | Barcha mumkin bo'lgan variantlarni birma-bir tekshirib, to'g'risini topish usuli. |
| Qism massiv | Subarray | Massivning ketma-ket turgan elementlaridan iborat bo'sh bo'lmagan bo'lagi. |
| Cheklovlar | Constraints | Masala shartida berilgan kiruvchi qiymatlar chegaralari va vaqt/xotira limiti. |
| Vaqt chegarasidan oshish | Time Limit Exceeded (TLE) | Dastur berilgan vaqt ichida ishini tugata olmaganda chiqadigan natija. |
| Vaqt murakkabligi | Time complexity | Dastur bajaradigan amallar sonining $n$ ga qarab o'sishi. |
| Big-O belgilash | Big-O notation | Murakkablikni faqat eng tez o'suvchi had orqali, o'zgarmas ko'paytuvchilarsiz yozish usuli. |
| Xotira murakkabligi | Space complexity | Dastur egallaydigan xotira hajmining $n$ ga qarab o'sishi. |
| To'lib ketish | Overflow | Natija o'zgaruvchi turi sig'dira oladigan eng katta qiymatdan oshib, noto'g'ri songa aylanishi. |
| 1-indekslash | 1-based indexing | Massiv elementlarini $0$ dan emas, $1$ dan boshlab raqamlash. |

> [!TIP]
> **O'zingizni tekshiring**
> 1. $n \le 300$ berilgan. $O(n^3)$ yechim 1 soniyaga sig'adimi?
> 2. Ikki sikl: tashqisi $i = 1..n$, ichkisi $j = 1..100$. Murakkablik qanday?
> 3. $n \le 10^5$ da barcha qism massivlarni ko'rib chiqish mumkinmi?

<details>
<summary>Javoblar</summary>

1. Ha: $300^3 = 2{,}7 \cdot 10^7 < 10^8$.
2. $O(n)$: ichki sikl $n$ ga bog'liq emas, u o'zgarmas $100$ ko'paytuvchi. Lekin $n = 10^7$ da bu $10^9$ amal bo'ladi — o'zgarmas son ham ba'zan muhim.
3. Yo'q: qism massivlar $\approx 5 \cdot 10^9$ ta, ularni hatto $O(1)$ dan tekshirish ham sig'maydi. Bu masalaning $O(n)$ yechimini prefiks yig'indi mavzusida ko'ramiz.

</details>
