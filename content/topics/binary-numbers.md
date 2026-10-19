---
summary: "Sonlarni ikkilik sanoq sistemasida yozish, o'nlikdan ikkilikka va aksincha tez o'tkazish."
prerequisites: [brute-force]
---

## Kirish

Kompyuter barcha sonlarni faqat ikki xil raqam — 0 va 1 yordamida saqlaydi. Shuning uchun ko'p masalalarda sonning "ichini", ya'ni uning ikkilik yozuvini ko'rish kerak bo'ladi. Bu darsda sonni ikkilik ko'rinishga va qaytadan o'nlik ko'rinishga o'tkazishni o'rganamiz. Shuningdek, `int` va `long long` nega aynan shunday chegaralarga ega ekanini tushunasiz. Bu bilim keyingi darslardagi bit amallari va bitmask usuli uchun poydevor bo'ladi.

## Muammo

Butun son $n$ berilgan. Uning ikkilik yozuvini va bu yozuvdagi birlar sonini chiqaring.

- **Kirish:** bitta butun son $n$ ($0 \le n \le 10^{18}$).
- **Chiqish:** birinchi qatorda $n$ ning ikkilik yozuvi (boshida ortiqcha nollarsiz), ikkinchi qatorda undagi birlar soni.

| Kirish | Chiqish |
|---|---|
| `13` | `1101`<br>`3` |

Eng sodda fikr: ikkilik sanoqda 0 dan boshlab $n$ gacha birma-bir sanab chiqamiz. Har safar oxirgi xonaga 1 qo'shamiz. Agar u yerda 1 tursa, uni 0 ga aylantirib, "bir"ni chapga o'tkazamiz — xuddi o'nlikda 9 dan 10 ga o'tgandek.

```cpp
string s = "0";
for (long long i = 0; i < n; i++) {
    int j = s.size() - 1;
    // oxiridagi birlarni nolga aylantiramiz
    while (j >= 0 && s[j] == '1') { s[j] = '0'; j--; }
    if (j >= 0) s[j] = '1';
    else s = "1" + s;   // xonalar yetmadi — chapga yangi xona
}
cout << s << "\n" << count(s.begin(), s.end(), '1') << "\n";
```

Bu kod to'g'ri ishlaydi, lekin sikl $n$ marta aylanadi. $n = 10^{18}$ bo'lsa, bu $10^{18}$ amal demak. 1 soniyada taxminan $10^8$ amal bajariladi, ya'ni dastur $10^{10}$ soniya — 300 yildan ortiq ishlaydi. Bizga ancha tezroq usul kerak.

## G'oya

Avval o'zimizga tanish o'nlik sonni ko'raylik. $345$ soni aslida $3 \cdot 100 + 4 \cdot 10 + 5 \cdot 1$ degani. Har bir xona o'ngdagisidan 10 marta "og'irroq". Raqamlarni yozish qoidasi **sanoq sistemasi (number system)** deyiladi, har bir xona necha marta og'irlashishini ko'rsatuvchi son esa uning **asosi (base)** deyiladi. Biz kundalik hayotda asosi 10 bo'lgan sistemadan foydalanamiz.

**Ikkilik sanoq sistemasi (binary number system)** — asosi 2 bo'lgan sistema. Unda faqat 0 va 1 raqamlari bor, xonalar esa o'ngdan chapga $1, 2, 4, 8, 16, \dots$ qiymatga ega. Ikkilik yozuvning bitta raqami **bit** deyiladi. Masalan, $1010_2$ yozuvini ko'raylik (pastdagi 2 — asos):

| Xona qiymati | 8 | 4 | 2 | 1 |
|---|---|---|---|---|
| Bit | 1 | 0 | 1 | 0 |
| Hissasi | 8 | 0 | 2 | 0 |

$8 + 2 = 10$, demak $1010_2 = 10$. Eng o'ngdagi bit **eng kichik bit (least significant bit, LSB)**, eng chapdagisi **eng katta bit (most significant bit, MSB)** deyiladi.

### O'nlikdan ikkilikka

Endi teskari yo'nalish: $10$ sonining bitlarini qanday topamiz? Asosiy kuzatish:

**Sonning eng kichik biti $n \bmod 2$ ga teng, $n / 2$ (butun bo'lish) esa shu bitni "kesib tashlaydi".**

Nega? Eng kichik bitdan boshqa barcha xonalar ($2, 4, 8, \dots$) juft. Demak son juft yoki toqligini faqat eng kichik bit hal qiladi. $2$ ga butun bo'lganda esa har bir xona bir pog'ona o'ngga suriladi, eng kichik bit esa yo'qoladi. Bu o'nlikdagi holatga o'xshaydi: $345 \bmod 10 = 5$ (oxirgi raqam), $345 / 10 = 34$ (oxirgi raqamsiz).

Shuning uchun algoritm juda sodda:

1. $n \bmod 2$ ni yozib olamiz — bu navbatdagi bit.
2. $n$ ni $2$ ga butun bo'lamiz.
3. $n$ nolga teng bo'lguncha takrorlaymiz.
4. Yig'ilgan bitlarni teskari tartibda o'qiymiz.

$n = 10$ uchun:

| $n$ | $n \bmod 2$ | $n / 2$ |
|---|---|---|
| 10 | 0 | 5 |
| 5 | 1 | 2 |
| 2 | 0 | 1 |
| 1 | 1 | 0 |

Yig'ilgan bitlar: `0101`. Teskari o'qisak, `1010` chiqadi — kutganimizdek.

> [!NOTE]
> To'xtang va o'ylang: nega bitlarni teskari tartibda o'qishimiz kerak?

Javob: birinchi qadamda biz eng kichik bitni, ya'ni eng o'ngdagi xonani oldik. Keyingi qadamlarda chaproqdagi xonalar chiqdi. Demak bitlar o'ngdan chapga tartibda yig'ilgan, ularni chapdan o'ngga o'qish uchun teskarisiga aylantirish kerak.

### Ikkilikdan o'nlikka

Teskari o'tish ham oddiy. Bitlarni chapdan o'ngga o'qiymiz va har safar joriy qiymatni 2 ga ko'paytirib, yangi bitni qo'shamiz. `1010` uchun: $0 \to 0 \cdot 2 + 1 = 1 \to 1 \cdot 2 + 0 = 2 \to 2 \cdot 2 + 1 = 5 \to 5 \cdot 2 + 0 = 10$. Har bir ko'paytirish oldingi bitlarni bir xona chapga suradi.

### Son nechta bitdan iborat?

$n$ ni har qadamda 2 ga bo'lamiz, demak qadamlar soni — $n$ ni necha marta 2 ga bo'lib 1 ga yetish mumkinligi. Bu son **ikkilik logarifm (binary logarithm)** deyiladi va $\log_2 n$ deb yoziladi: masalan, $\log_2 8 = 3$, chunki $2 \cdot 2 \cdot 2 = 8$. $n \ge 1$ sonidagi bitlar soni $\lfloor \log_2 n \rfloor + 1$ ga teng.

Taxminiy hisob uchun qulay qoida: $2^{10} = 1024 \approx 10^3$. Demak $2^{20} \approx 10^6$, $2^{30} \approx 10^9$, $2^{60} \approx 10^{18}$. Shuning uchun $10^{18}$ gacha bo'lgan son ko'pi bilan 60 bitdan iborat.

### `int` va `long long` chegaralari

Endi tiplar chegarasini tushunish oson. `int` 32 bitdan iborat, ulardan bittasi ishora (musbat yoki manfiy) uchun ketadi. Shuning uchun eng katta `int` $2^{31} - 1 = 2\,147\,483\,647 \approx 2{,}1 \cdot 10^9$. `long long` 64 bitli, uning eng katta qiymati $2^{63} - 1 \approx 9{,}2 \cdot 10^{18}$.

Agar hisob natijasi tipga sig'masa, son "aylanib" noto'g'ri qiymatga aylanadi. Bu **to'lib ketish (overflow)** deyiladi. Masalan, `int x = 2000000000; x = x * 2;` bo'lganda manfiy son chiqadi.

> [!IMPORTANT]
> Chegara $10^9$ dan katta bo'lsa yoki ko'paytmalar $10^9$ dan oshishi mumkin bo'lsa, `long long` ishlating.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

// n ni ikkilik yozuvga o'tkazadi
string toBinary(long long n) {
    if (n == 0) return "0";          // nol uchun alohida holat
    string s;
    // eng kichik bitdan boshlab bitlarni yig'amiz
    while (n > 0) {
        s += char('0' + n % 2);
        n /= 2;
    }
    // bitlar teskari tartibda yig'ilgan
    reverse(s.begin(), s.end());
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    cin >> n;

    string bin = toBinary(n);
    // yozuvdagi birlarni sanaymiz
    int ones = count(bin.begin(), bin.end(), '1');

    cout << bin << "\n" << ones << "\n";
    return 0;
}
```

Kodning muhim joylari:

- `n` — `long long`, chunki $10^{18}$ `int` ga sig'maydi.
- `char('0' + n % 2)` — `0` yoki `1` sonini `'0'` yoki `'1'` belgisiga aylantiradi.
- `n == 0` alohida tekshiriladi: aks holda sikl bir marta ham aylanmaydi va bo'sh satr chiqadi.
- `reverse` bitlarni to'g'ri tartibga keltiradi.

## Misol

Muammodagi test: $n = 13$.

| Qadam | $n$ | $n \bmod 2$ | $n / 2$ | `s` (teskari tartibda) |
|---|---|---|---|---|
| 1 | 13 | 1 | 6 | `1` |
| 2 | 6 | 0 | 3 | `10` |
| 3 | 3 | 1 | 1 | `101` |
| 4 | 1 | 1 | 0 | `1011` |

$n = 0$ bo'ldi, sikl to'xtaydi. `reverse` dan keyin `s = "1101"`. Undagi birlar soni — 3.

Tekshiramiz: $1101_2 = 8 + 4 + 0 + 1 = 13$. Dastur `1101` va `3` ni chiqaradi — javob to'g'ri.

## Murakkablik

Har qadamda $n$ ikki baravar kamayadi, shuning uchun qadamlar soni bitlar soniga, ya'ni $\lfloor \log_2 n \rfloor + 1$ ga teng. Vaqt murakkabligi — $O(\log n)$. $n = 10^{18}$ da bu atigi 60 ta qadam: sodda usuldagi $10^{18}$ ta qadam bilan solishtiring.

Xotira ham $O(\log n)$ — faqat bitlar satri saqlanadi.

## Variantlar

### Ikkilikdan o'nlikka o'tkazish

Qachon kerak: kirishda ikkilik satr berilganda. "G'oya" bo'limidagi usulning kodi:

```cpp
long long toDecimal(const string& s) {
    long long val = 0;
    for (char c : s) val = val * 2 + (c - '0');
    return val;
}
```

### Ixtiyoriy asosga o'tkazish

Qachon kerak: masalada uchlik, sakkizlik yoki boshqa sanoq sistemasi so'ralganda. G'oya o'zgarmaydi: 2 o'rniga $k$ ga bo'lamiz.

```cpp
string toBase(long long n, int k) {   // 2 <= k <= 10
    if (n == 0) return "0";
    string s;
    while (n > 0) { s += char('0' + n % k); n /= k; }
    reverse(s.begin(), s.end());
    return s;
}
```

Masalan, `toBase(13, 3)` natijasi `111`, chunki $9 + 3 + 1 = 13$.

### `bitset` bilan tez chiqarish

Qachon kerak: sonning aniq uzunlikdagi ikkilik yozuvini tez ko'rish yoki tekshirish uchun. `bitset<8>(13).to_string()` natijasi `"00001101"` — boshidagi nollar ham chiqadi.

## Ko'p uchraydigan xatolar

### Nolni unutish

> [!WARNING]
> ```cpp
> string s;
> while (n > 0) { s += char('0' + n % 2); n /= 2; }
> ```
> $n = 0$ bo'lsa, sikl bir marta ham aylanmaydi va bo'sh satr chiqadi. To'g'risi: boshida `if (n == 0) return "0";` deb tekshiring.

### Teskari aylantirishni unutish

> [!WARNING]
> `reverse` siz $13$ uchun `1011` chiqadi, bu esa $11$ soni. Bitlar eng kichigidan boshlab yig'iladi, shuning uchun oxirida `reverse(s.begin(), s.end());` shart.

### `int` ga katta sonni o'qish

> [!WARNING]
> ```cpp
> int n; cin >> n;   // n = 10^18
> ```
> $10^{18}$ `int` chegarasidan ($\approx 2{,}1 \cdot 10^9$) ancha katta — to'lib ketish yuz beradi. To'g'risi: `long long n;`.

### `pow` bilan ikkining darajasini hisoblash

> [!WARNING]
> ```cpp
> val += pow(2, k);
> ```
> `pow` haqiqiy son (`double`) qaytaradi. Katta $k$ larda u aniqlikni yo'qotadi va javob bir-ikki birlikka xato chiqishi mumkin. To'g'risi: `val = val * 2 + bit` usulidan foydalaning yoki darajani butun sonlarda sikl bilan hisoblang.

## Xulosa

- Ikkilik sistemada xonalar qiymati $1, 2, 4, 8, \dots$; son — birli xonalar qiymatlarining yig'indisi.
- O'nlikdan ikkilikka: $n \bmod 2$ ni yozib, $n$ ni 2 ga bo'lamiz, oxirida teskari o'qiymiz.
- Ikkilikdan o'nlikka: `val = val * 2 + bit`.
- $n$ da $\lfloor \log_2 n \rfloor + 1$ ta bit bor; $2^{10} \approx 10^3$ qoidasi bilan tez baholang.
- `int` $\approx 2{,}1 \cdot 10^9$ gacha, `long long` $\approx 9{,}2 \cdot 10^{18}$ gacha sig'adi.

**Masalada qanday tanib olish mumkin:** shartda "ikkilik yozuv", "binary", "bitlar soni", "birlar soni", "ikkining darajalari" so'zlari bo'lsa yoki $n$ juda katta ($10^{18}$ gacha), lekin javob son raqamlariga bog'liq bo'lsa.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Sanoq sistemasi | number system | Sonlarni raqamlar bilan yozish qoidasi. |
| Asos | base | Har bir xona o'ngdagisidan necha marta katta ekanini ko'rsatuvchi son. |
| Ikkilik sanoq sistemasi | binary number system | Faqat 0 va 1 ishlatiladigan, asosi 2 bo'lgan sistema. |
| Bit | bit | Ikkilik yozuvdagi bitta raqam (0 yoki 1). |
| Eng kichik bit | least significant bit (LSB) | Ikkilik yozuvning eng o'ngdagi, qiymati 1 bo'lgan biti. |
| Eng katta bit | most significant bit (MSB) | Ikkilik yozuvning eng chapdagi biti. |
| Ikkilik logarifm | binary logarithm | Sonni necha marta 2 ga bo'lib 1 ga yetish mumkinligi. |
| To'lib ketish | overflow | Natija tipga sig'magani uchun noto'g'ri qiymat hosil bo'lishi. |

> [!TIP] O'zingizni tekshiring
> 1. $100110_2$ o'nlikda nechaga teng?
> 2. $25$ sonining ikkilik yozuvi qanday va unda nechta bit bor?
> 3. $n \le 10^{9}$ bo'lsa, `toBinary` sikli ko'pi bilan necha marta aylanadi?
>
> <details>
> <summary>Javoblar</summary>
>
> 1. $32 + 4 + 2 = 38$.
> 2. $25 = 16 + 8 + 1 = 11001_2$, 5 ta bit.
> 3. $2^{30} \approx 1{,}07 \cdot 10^9 > 10^9$, demak ko'pi bilan 30 marta.
>
> </details>
