---
summary: "Barcha qism to'plamlar va permutatsiyalarni tartib bilan sanab chiqib, eng yaxshi javobni topish."
prerequisites: [brute-force]
---

## Kirish

**To'liq qidiruv (complete search)** — masalaning barcha mumkin variantlarini birma-bir ko'rib chiqib, eng yaxshisini tanlash. Ko'p masalalarda variantlar ikki xil ko'rinishda bo'ladi. Birinchisi — elementlardan bir qismini tanlash. Berilgan elementlardan istalgan miqdorda (hatto hech birini yoki hammasini) tanlab olingan to'plam **qism to'plam (subset)** deyiladi. Ikkinchisi — elementlarni qandaydir tartibda joylashtirish (permutatsiyalar).

Bu usul $n$ kichik bo'lgan masalalarda uchraydi: $n \le 20$ yoki $n \le 10$. Shu darsdan keyin siz istalgan $n$ uchun barcha qism to'plamlarni va barcha permutatsiyalarni xatosiz sanab chiqa olasiz.

## Muammo

**Olmalarni bo'lish.** Sizda $n$ ta olma bor, $i$-olmaning og'irligi $p_i$. Olmalarni ikki guruhga bo'lish kerak (guruhlardan biri bo'sh bo'lishi ham mumkin). Guruhlar og'irliklari orasidagi farq iloji boricha kichik bo'lsin.

- **Kirish:** birinchi qatorda $n$, ikkinchi qatorda $p_1, p_2, \dots, p_n$.
- **Chiqish:** guruhlar og'irliklari farqining eng kichik qiymati.
- **Cheklovlar:** $1 \le n \le 20$, $1 \le p_i \le 10^9$. Vaqt — 1 soniya.

| Kirish | Chiqish |
|---|---|
| `5`<br>`3 2 7 4 1` | `1` |

Masalan, $\{7, 1\}$ guruhining og'irligi $8$, $\{3, 2, 4\}$ guruhiniki esa $9$. Farq $1$.

Keling, avval $n = 3$ bo'lgan holni yechaylik. Har bir olma birinchi guruhga ($1$) yoki ikkinchi guruhga ($0$) tushadi. Har bir olma uchun bitta sikl yozamiz:

```cpp
long long best = LLONG_MAX;
for (int g0 = 0; g0 <= 1; g0++)
    for (int g1 = 0; g1 <= 1; g1++)
        for (int g2 = 0; g2 <= 1; g2++) {
            long long sum1 = g0 * p[0] + g1 * p[1] + g2 * p[2];
            long long sum2 = total - sum1;
            best = min(best, llabs(sum1 - sum2));
        }
```

Bu kod $2 \cdot 2 \cdot 2 = 8$ ta bo'linishni ko'rib chiqadi va to'g'ri ishlaydi. Lekin $n = 20$ bo'lsa-chi? Unda 20 ta ichma-ich sikl kerak. $n$ esa kirishda beriladi, ya'ni oldindan noma'lum. **Bu yerda muammo tezlikda emas, kodni yozib bo'lmasligida.** Variantlar soni $2^{20} = 1\,048\,576$ — kompyuter uchun bu juda kam. Bizga faqat ichma-ich sikllarsiz, istalgan $n$ uchun ishlaydigan sanash usuli kerak.

## G'oya

**Har bir bo'linishni $n$ ta raqamdan iborat 0/1 satr deb qaraymiz va bu satrni hisoblagich kabi bittalab oshirib boramiz.**

Keling, $n = 3$ uchun barcha 8 ta satrni yozaylik. $i$-raqam $1$ bo'lsa, $i$-olma birinchi guruhda:

| № | Satr | Birinchi guruhdagi olmalar |
|---|---|---|
| 1 | `000` | hech qaysi |
| 2 | `001` | 3-olma |
| 3 | `010` | 2-olma |
| 4 | `011` | 2- va 3-olma |
| 5 | `100` | 1-olma |
| 6 | `101` | 1- va 3-olma |
| 7 | `110` | 1- va 2-olma |
| 8 | `111` | hammasi |

Bu ro'yxat mashinadagi yo'l hisoblagichiga (odometrga) o'xshaydi. Faqat har bir g'ildirakda ikkita raqam bor: $0$ va $1$. Eng o'ng g'ildirak har qadamda aylanadi. U $1$ dan $0$ ga o'tganda chapdagi qo'shni g'ildirakni ham bir qadam suradi.

Bundan keyingi satrni olish qoidasi kelib chiqadi:

1. O'ngdan chapga qarab birinchi $0$ ni qidiramiz.
2. Yo'lda uchragan barcha $1$ larni $0$ ga aylantiramiz.
3. Topilgan $0$ ni $1$ ga aylantiramiz.
4. Agar $0$ umuman topilmasa, satr `111...1` bo'lgan bo'ladi. Demak, barcha variantlar ko'rib chiqildi.

Qoidani `011` satrida tekshiramiz. O'ngdan ikkita $1$ ni o'tamiz va ularni $0$ qilamiz. Keyin $0$ ni topib, $1$ qilamiz. Natija `100` — jadvaldagi 5-satrning o'zi.

> [!NOTE]
> To'xtang va o'ylang: $n = 4$ bo'lsa, `0111` dan keyin qaysi satr keladi? `1111` dan keyin-chi?

`0111` dan keyin `1000` keladi: o'ngdagi uchta $1$ nolga aylanadi, chapdagi $0$ esa birga. `1111` da esa $0$ yo'q, demak sanash shu yerda tugaydi.

Nega bu usul hech bir variantni o'tkazib yubormaydi? Har bir qadam hisoblagichni aynan bittaga oshiradi. Hisoblagich `00...0` dan boshlanib, `11...1` da tugaydi. Bu ikki satr orasida hech qaysi satr ikki marta uchramaydi va hech biri tushib qolmaydi. Har bir raqamda 2 ta tanlov bor, shuning uchun jami $2^n$ ta satr chiqadi.

Har bir satr uchun birinchi guruh og'irligini $sum_1$ deb hisoblaymiz. Ikkinchi guruh og'irligi $sum_2 = total - sum_1$, bu yerda $total$ — barcha olmalar og'irligi. Javob — barcha satrlar ichida $|sum_1 - sum_2|$ ning eng kichigi.

## Amalga oshirish

Massiv bu yerda 0-indeksli: olmalar $p_0, \dots, p_{n-1}$.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Kirishni o'qiymiz va umumiy og'irlikni hisoblaymiz
    int n;
    cin >> n;
    vector<long long> p(n);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        cin >> p[i];
        total += p[i];
    }

    // group[i] == 1 bo'lsa, i-olma birinchi guruhda
    vector<int> group(n, 0);
    long long best = total;

    while (true) {
        // Joriy bo'linishda guruhlar og'irligini hisoblaymiz
        long long sum1 = 0;
        for (int i = 0; i < n; i++) {
            if (group[i] == 1) sum1 += p[i];
        }
        long long sum2 = total - sum1;
        best = min(best, llabs(sum1 - sum2));

        // Hisoblagichni bittaga oshiramiz: o'ngdagi 1 larni 0 qilamiz
        int pos = n - 1;
        while (pos >= 0 && group[pos] == 1) {
            group[pos] = 0;
            pos--;
        }

        // 0 topilmadi: barcha variantlar ko'rib chiqildi
        if (pos < 0) break;
        group[pos] = 1;
    }

    cout << best << "\n";
    return 0;
}
```

Kodning muhim joylari:

- `best` boshida `total` ga teng. Bu barcha olmalar bitta guruhda bo'lgan holat, undan katta farq bo'lmaydi.
- Og'irliklar `long long` da saqlanadi: $20 \cdot 10^9 = 2 \cdot 10^{10}$ soni `int` ga sig'maydi.
- Ichki `while` — hisoblagichning o'zi. Undagi `pos >= 0` sharti birinchi turadi, aks holda `group[-1]` ga murojaat bo'ladi.
- Tashqi sikl roppa-rosa $2^n$ marta aylanadi va `11...1` satrdan keyin to'xtaydi.

## Misol

Testni olaylik: $p = [3, 2, 7, 4, 1]$, $total = 17$. Hisoblagichning birinchi 8 qadami:

| Qadam | `group` | Birinchi guruhdagi og'irliklar | $sum_1$ | $sum_2$ | $\lvert sum_1 - sum_2 \rvert$ | `best` |
|---|---|---|---|---|---|---|
| 1 | `00000` | — | 0 | 17 | 17 | 17 |
| 2 | `00001` | 1 | 1 | 16 | 15 | 15 |
| 3 | `00010` | 4 | 4 | 13 | 9 | 9 |
| 4 | `00011` | 4, 1 | 5 | 12 | 7 | 7 |
| 5 | `00100` | 7 | 7 | 10 | 3 | 3 |
| 6 | `00101` | 7, 1 | 8 | 9 | **1** | **1** |
| 7 | `00110` | 7, 4 | 11 | 6 | 5 | 1 |
| 8 | `00111` | 7, 4, 1 | 12 | 5 | 7 | 1 |

6-qadamda `best = 1` bo'ldi. Qolgan 24 qadamda u kamaymaydi. Sababi oddiy: $total = 17$ toq son, shuning uchun ikki guruh hech qachon teng bo'lolmaydi va farq kamida $1$. Dastur `1` chiqaradi — bu kutilgan javob.

## Murakkablik

Hisoblagich $2^n$ ta satrni ko'rib chiqadi. Har bir satr uchun $sum_1$ ni $O(n)$ da hisoblaymiz. Jami vaqt murakkabligi $O(n \cdot 2^n)$.

$n = 20$ da bu $20 \cdot 1\,048\,576 \approx 2 \cdot 10^7$ amal. 1 soniyada $\approx 10^8$ amal bajarilishini eslasak, bemalol ulguramiz. $n = 30$ da esa $30 \cdot 2^{30} \approx 3 \cdot 10^{10}$ amal — bu 1 soniyaga sig'maydi. Shuning uchun **qism to'plamlar bo'yicha qidiruvning chegarasi taxminan $n \le 20$**.

Xotira $O(n)$: faqat `p` va `group` massivlari saqlanadi.

## Variantlar

### Permutatsiyalar: tartib muhim bo'lganda

Ba'zi masalalarda elementlarni tanlash emas, ularni tartiblash kerak: navbat, yo'nalish, joylashtirish. Elementlarning mumkin bo'lgan har bir tartibi **permutatsiya (permutation)** deyiladi. Bunday masalalarda barcha permutatsiyalarni ko'rib chiqamiz.

$1, 2, 3$ sonlarining permutatsiyalari 6 ta. Ularni lug'aviy tartibda yozamiz. **Lug'aviy tartib (lexicographic order)** — ketma-ketliklarni lug'atdagi so'zlar kabi solishtirish: birinchi farq qiladigan o'rindagi kichik element qaysi ketma-ketlikda bo'lsa, o'sha oldin turadi.

| № | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Permutatsiya | `1 2 3` | `1 3 2` | `2 1 3` | `2 3 1` | `3 1 2` | `3 2 1` |

STL'dagi `next_permutation` massivni shu ro'yxatdagi keyingi permutatsiyaga aylantiradi. Agar massiv oxirgi permutatsiya bo'lsa (`3 2 1`), u `false` qaytaradi. Shuning uchun **sanash saralangan massivdan boshlanishi shart**.

Permutatsiyalar soni $n!$ ga teng va juda tez o'sadi:

| $n$ | 5 | 8 | 10 | 11 | 12 |
|---|---|---|---|---|---|
| $n!$ | 120 | 40 320 | 3 628 800 | 39 916 800 | 479 001 600 |

Har bir permutatsiyani $O(n)$ da tekshirsak, $n = 10$ da $\approx 3{,}6 \cdot 10^7$ amal bo'ladi — ulguramiz. $n = 12$ da esa $\approx 5{,}7 \cdot 10^9$ — ulgurmaymiz. Demak, permutatsiyalar bo'yicha qidiruvning chegarasi taxminan $n \le 10$.

Misol masala: $n \le 9$ ta shahar va ular orasidagi masofalar `d[i][j]` berilgan. Barcha shaharlarni bir martadan aylanib, boshlang'ich shaharga qaytadigan eng qisqa yo'lni toping. Bu mashhur **kommivoyajer masalasi (Travelling Salesman Problem, TSP)** — katta $n$ uchun uning tez yechimi ma'lum emas, kichik $n$ uchun esa to'liq qidiruv yetarli.

```cpp
vector<int> order(n);
for (int i = 0; i < n; i++) order[i] = i;  // saralangan holatdan boshlaymiz

long long best = LLONG_MAX;
do {
    // Shaharlarni order tartibida aylanamiz
    long long len = 0;
    for (int i = 0; i + 1 < n; i++) len += d[order[i]][order[i + 1]];
    len += d[order[n - 1]][order[0]];  // boshlang'ich shaharga qaytamiz
    best = min(best, len);
} while (next_permutation(order.begin(), order.end()));
```

Bu yerda `do-while` ishlatilgan: birinchi permutatsiya `next_permutation` chaqirilishidan oldin tekshiriladi.

### Har bir element uchun $k$ ta tanlov

Ba'zan har bir element uchun ikkita emas, ko'proq tanlov bo'ladi. Masalan, olmalarni uchta guruhga bo'lish kerak. Unda hisoblagichning har bir g'ildiragida $0, 1, \dots, k-1$ raqamlari bo'ladi. Kodda faqat ikki joy o'zgaradi:

```cpp
while (pos >= 0 && group[pos] == k - 1) {  // eng katta raqamni 0 qilamiz
    group[pos] = 0;
    pos--;
}
if (pos < 0) break;
group[pos]++;  // keyingi raqamga o'tamiz
```

Variantlar soni $k^n$. Masalan, $k = 3$, $n = 12$ da $3^{12} = 531\,441$ ta variant.

Keyingi mavzularda qism to'plamlarni sanashning yana ikki usulini ko'ramiz: rekursiya bilan ("Backtracking" darsida) va bitlar bilan ("Bitmask bilan qism to'plamlarni sanash" darsida). G'oya o'sha-o'sha: har bir element uchun "olamiz yoki olmaymiz".

## Ko'p uchraydigan xatolar

### Saralanmagan massivdan boshlash

> [!WARNING]
> ```cpp
> vector<int> a = {3, 1, 2};
> do { /* ... */ } while (next_permutation(a.begin(), a.end()));
> ```
> `next_permutation` joriy tartibdan keyingilarini beradi. `3 1 2` dan oldingi permutatsiyalar (`1 2 3`, `1 3 2`, `2 1 3`, `2 3 1`) umuman ko'rilmaydi. To'g'risi — avval saralash: `sort(a.begin(), a.end());`

### `do-while` o'rniga `while`

> [!WARNING]
> ```cpp
> while (next_permutation(a.begin(), a.end())) { /* ... */ }
> ```
> Bu holda birinchi permutatsiya (saralangan massiv) tekshirilmay qoladi. Ko'pincha javob aynan o'sha permutatsiyada bo'ladi. To'g'risi — `do { ... } while (next_permutation(...));`

### Hisoblagich shartida tartib

> [!WARNING]
> ```cpp
> while (group[pos] == 1 && pos >= 0) { ... }
> ```
> `pos = -1` bo'lganda avval `group[-1]` o'qiladi. Massivda mavjud bo'lmagan indeksga murojaat qilish **massiv chegarasidan chiqish (out of bounds)** deyiladi: dastur noto'g'ri ishlashi yoki qulashi mumkin. To'g'risi — chegarani birinchi tekshirish: `while (pos >= 0 && group[pos] == 1)`.

### `int` da to'lib ketish

> [!WARNING]
> ```cpp
> int sum1 = 0;  // p_i <= 1e9, n = 20
> ```
> 20 ta olma og'irligi $2 \cdot 10^{10}$ gacha yetadi, `int` esa taxminan $2{,}1 \cdot 10^9$ gacha sig'adi. Natijada to'lib ketish bo'ladi va javob noto'g'ri chiqadi. To'g'risi — `long long sum1 = 0;`

## Xulosa

- To'liq qidiruv barcha variantlarni ko'rib chiqadi, shuning uchun u doim to'g'ri javob beradi. Faqat variantlar soni vaqtga sig'ishi kerak.
- Qism to'plamlar soni $2^n$: bunday qidiruv $n \le 20$ gacha ishlaydi.
- Permutatsiyalar soni $n!$: bunday qidiruv $n \le 10$ gacha ishlaydi. `next_permutation` saralangan massivdan va `do-while` bilan ishlatiladi.
- Qism to'plamlarni 0/1 hisoblagich bilan ichma-ich sikllarsiz, istalgan $n$ uchun sanash mumkin.

**Masalada bu texnikani qanday tanib olish mumkin:** $n$ juda kichik ($n \le 20$ yoki $n \le 10$), shartda "bir nechtasini tanlang", "ikki guruhga bo'ling", "qaysi tartibda", "barcha usullar orasida eng yaxshisi" kabi so'zlar bor.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| To'liq qidiruv | Complete search | Masalaning barcha mumkin variantlarini ko'rib chiqib, eng yaxshisini tanlash. |
| Qism to'plam | Subset | Berilgan elementlardan istalgan miqdorda (bo'sh yoki to'liq ham) tanlab olingan to'plam. $n$ ta elementning $2^n$ ta qism to'plami bor. |
| Permutatsiya | Permutation | Elementlarning mumkin bo'lgan bitta tartibi. $n$ ta turli elementning $n!$ ta permutatsiyasi bor. |
| Faktorial | Factorial | $n! = 1 \cdot 2 \cdot \ldots \cdot n$ — $n$ ta elementni tartiblash usullari soni. |
| Lug'aviy tartib | Lexicographic order | Ketma-ketliklarni lug'atdagi so'zlar kabi, birinchi farq qiladigan element bo'yicha solishtirish. |
| Kommivoyajer masalasi | Travelling Salesman Problem (TSP) | Barcha shaharlarni bir martadan aylanib, boshiga qaytadigan eng qisqa yo'lni topish masalasi. |
| Massiv chegarasidan chiqish | Out of bounds | Massivda mavjud bo'lmagan indeksdagi elementga murojaat qilish. |

> [!TIP]
> **O'zingizni tekshiring**
> 1. $n = 15$ bo'lsa, qism to'plamlar bo'yicha qidiruv nechta variantni ko'rib chiqadi?
> 2. $n = 13$ bo'lsa, permutatsiyalar bo'yicha qidiruv 1 soniyaga sig'adimi?
> 3. `group = 10111` bo'lsa, hisoblagichdan keyin qanday satr chiqadi?

<details>
<summary>Javoblar</summary>

1. $2^{15} = 32\,768$ ta variant.
2. Yo'q: $13! \approx 6{,}2 \cdot 10^9$, bu $10^8$ dan ancha ko'p.
3. `11000`: o'ngdagi uchta $1$ nolga aylanadi, ulardan chapdagi $0$ esa $1$ ga.

</details>
