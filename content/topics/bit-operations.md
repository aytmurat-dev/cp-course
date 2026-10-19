---
summary: "AND, OR, XOR, siljitish amallari va ular yordamida sonning alohida bitlari bilan tez ishlash."
prerequisites: [binary-numbers]
---

## Kirish

Kompyuter har bir sonni bitlar ketma-ketligi sifatida saqlaydi. Bit amallari shu bitlar bilan to'g'ridan-to'g'ri ishlashga imkon beradi: sonning istalgan bitini tekshirish, yoqish yoki o'chirish bitta amalda bajariladi. Bu amallar juftlikni tekshirish, birlar sonini sanash va "juftsiz qolgan sonni topish" kabi masalalarda uchraydi. Darsdan keyin siz har bir bit amalini qo'lda hisoblay olasiz va XOR yordamida klassik masalani $O(n)$ da yechasiz.

## Muammo

Sizga $n$ ta son berilgan. Ulardan bittasi faqat **bir marta** uchraydi, qolgan har bir son aynan **ikki marta** uchraydi. Shu yagona sonni toping.

**Kirish:** birinchi qatorda toq son $n$ ($1 \le n \le 10^6$). Ikkinchi qatorda $n$ ta son $a_i$ ($1 \le a_i \le 10^9$).

**Chiqish:** bir marta uchragan son.

**Test:**

```
7
4 7 2 7 4 9 2
```

Javob: `9`. Haqiqatan, 4, 7 va 2 ikki martadan uchraydi, 9 esa bir marta.

Eng sodda yo'l — har bir son necha marta uchrashini sanash:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < n; i++) {
        int cnt = 0;
        for (int j = 0; j < n; j++)
            if (a[j] == a[i]) cnt++;
        if (cnt == 1) { cout << a[i] << "\n"; return 0; }
    }
}
```

Ichma-ich ikki sikl $n^2$ ta amal bajaradi. $n = 10^6$ da bu $10^{12}$ amal. 1 soniyada taxminan $10^8$ amal bajariladi, demak dastur 10 000 soniyadan ko'proq ishlaydi. Bizga butunlay boshqa yondashuv kerak.

## G'oya

Yechimga bitta maxsus amal olib keladi. Lekin avval barcha bit amallari bilan tanishib chiqamiz.

### To'rtta asosiy amal

**Bit amali (bitwise operation)** — ikki sonning har bir bitini alohida, ustun bo'yicha qayta ishlaydigan amal. Ikkilik sonlar darsidagi kabi sonlarni bir-birining ostiga yozamiz va har bir ustunga qaraymiz.

$12 = 1100_2$ va $10 = 1010_2$ ni olaylik:

| Amal | C++ | Qoida (bitta ustun uchun) | $1100$ va $1010$ | Natija |
|---|---|---|---|---|
| AND | `a & b` | ikkalasi ham 1 bo'lsa, 1 | $1000$ | 8 |
| OR | `a \| b` | kamida bittasi 1 bo'lsa, 1 | $1110$ | 14 |
| XOR | `a ^ b` | bitlar har xil bo'lsa, 1 | $0110$ | 6 |

**AND** ("va") faqat ikkala sonda ham yoqilgan bitlarni qoldiradi. **OR** ("yoki") ikkala sondagi yoqilgan bitlarni birlashtiradi. **XOR** ("yoki-yoki", exclusive OR) bitlar farq qiladigan joyda 1 beradi.

**NOT** (`~a`) sonning barcha bitlarini teskarisiga aylantiradi. `int` uchun natija doim $-a-1$ bo'ladi: `~12 == -13`. Shuning uchun `~` deyarli har doim boshqa amal ichida ishlatiladi.

### Siljitish

**Chapga siljitish (left shift)** `x << k` sonning bitlarini $k$ ta joy chapga suradi, o'ng tomondan nollar qo'shiladi. $5 = 101_2$, `5 << 2` $= 10100_2 = 20$. Har bir siljitish sonni 2 ga ko'paytiradi, demak `x << k` $= x \cdot 2^k$.

**O'ngga siljitish (right shift)** `x >> k` bitlarni o'ngga suradi, eng o'ngdagi $k$ ta bit tashlab yuboriladi. $13 = 1101_2$, `13 >> 1` $= 110_2 = 6$. Manfiy bo'lmagan $x$ uchun `x >> k` $= \lfloor x / 2^k \rfloor$.

Eng muhim ifoda — `1 << k`. Bu faqat $k$-biti yoqilgan son: `1 << 3` $= 1000_2 = 8$.

### Bitta bit bilan ishlash

Bitlar o'ngdan chapga **0 dan** boshlab raqamlanadi. $x = 13 = 1101_2$ da 0-, 2- va 3-bitlar yoqilgan, 1-bit o'chirilgan.

`1 << k` ni boshqa amallar bilan birlashtirsak, istalgan bitni boshqara olamiz:

| Vazifa | Ifoda | $x = 13 = 1101_2$ da misol |
|---|---|---|
| $k$-bitni tekshirish | `(x >> k) & 1` | $k=1$: $110_2 \,\&\, 1 = 0$ |
| $k$-bitni yoqish | `x \| (1 << k)` | $k=1$: $1111_2 = 15$ |
| $k$-bitni o'chirish | `x & ~(1 << k)` | $k=2$: $1001_2 = 9$ |
| $k$-bitni almashtirish | `x ^ (1 << k)` | $k=0$: $1100_2 = 12$ |

Masalan, $k$-bitni o'chirishda `~(1 << k)` faqat $k$-biti 0 bo'lgan, qolgan bitlari 1 bo'lgan son beradi. AND uni qo'llaganda qolgan bitlar o'zgarmaydi, $k$-bit esa 0 ga aylanadi.

Eng ko'p ishlatiladigan holat — `x & 1`. U 0-bitni beradi, ya'ni son juft bo'lsa 0, toq bo'lsa 1.

> [!IMPORTANT]
> Bitta bit bilan ishlashning to'rtta ifodasini yod oling: tekshirish `(x >> k) & 1`, yoqish `x | (1 << k)`, o'chirish `x & ~(1 << k)`, almashtirish `x ^ (1 << k)`.

### XOR xossalari

Endi masalaga qaytamiz. XOR'ning uchta xossasi bor:

- $a \oplus a = 0$ — son o'zi bilan XOR qilinsa, barcha bitlar bir xil, natija 0.
- $a \oplus 0 = a$ — 0 bilan XOR sonni o'zgartirmaydi.
- Tartib muhim emas: $a \oplus b \oplus a = a \oplus a \oplus b = b$.

XOR'ni chiroq tugmasiga o'xshatish mumkin. Har bir son o'zining bitlaridagi "chiroqlarni" bir marta bosadi. Ikki marta bosilgan chiroq yana o'chadi. Oxirida faqat bir marta bosilganlar yonib qoladi.

**Barcha sonlarni XOR qilsak, juft sonlar bir-birini yo'q qiladi va faqat yagona son qoladi.**

Nega bu doim ishlaydi? Bitta bit ustuniga qarang. XOR natijasida shu ustunda 1 bo'ladi, faqat birlar soni toq bo'lsa. Har bir juft son ustunga juft miqdorda birlar qo'shadi. Demak ustunning juft-toqligini faqat yagona sonning biti belgilaydi.

> [!NOTE]
> To'xtang va o'ylang: agar har bir son **uch marta**, bittasi esa bir marta uchrasa, XOR ishlaydimi?

Yo'q. $a \oplus a \oplus a = (a \oplus a) \oplus a = a$, ya'ni uch marta uchragan son yo'qolmaydi. XOR faqat **juft** marta uchragan sonlarni yo'q qiladi.

## Amalga oshirish

Sonlarni massivda saqlash shart emas: har birini o'qib, darhol javobga XOR qilamiz.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    // Boshida javob 0, chunki a ^ 0 = a
    int ans = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        // Juft uchragan sonlar bir-birini yo'q qiladi
        ans ^= x;
    }

    cout << ans << "\n";
    return 0;
}
```

Kodning muhim joylari:

- `ans` 0 dan boshlanadi. Bu XOR uchun "neytral" qiymat, xuddi yig'indi uchun 0 kabi.
- `ans ^= x` — bu `ans = ans ^ x` ning qisqa yozuvi.
- $a_i \le 10^9 < 2^{30}$, shuning uchun natija ham $2^{30}$ dan kichik va `int` ga sig'adi. XOR yangi yuqori bit yaratmaydi, shu sababli to'lib ketish (overflow) bo'lmaydi.

## Misol

Testni qadamma-qadam ko'raylik. Jadvalda har bir son va `ans` ikkilik ko'rinishda berilgan.

| Qadam | $x$ | $x$ (ikkilik) | `ans ^ x` (ikkilik) | `ans` |
|---|---|---|---|---|
| boshi | — | — | $0000$ | 0 |
| 1 | 4 | $0100$ | $0100$ | 4 |
| 2 | 7 | $0111$ | $0011$ | 3 |
| 3 | 2 | $0010$ | $0001$ | 1 |
| 4 | 7 | $0111$ | $0110$ | 6 |
| 5 | 4 | $0100$ | $0010$ | 2 |
| 6 | 9 | $1001$ | $1011$ | 11 |
| 7 | 2 | $0010$ | $1001$ | 9 |

Oraliq qiymatlar tartibsiz ko'rinadi, lekin oxirida juftlar yo'qoladi. Javob `9` — testdagi bilan bir xil.

## Murakkablik

Har bir son bitta XOR amali bilan qayta ishlanadi, shuning uchun vaqt murakkabligi $O(n)$. $n = 10^6$ da bu taxminan $10^6$ amal, ya'ni soniyaning kichik bir qismi. Massiv saqlanmagani uchun xotira $O(1)$.

Har qanday bit amali (`&`, `|`, `^`, `~`, `<<`, `>>`) bitta protsessor buyrug'ida bajariladi, ya'ni $O(1)$.

## Variantlar

### Birlar sonini sanash

Sondagi yoqilgan bitlar soni uchun tayyor funksiya bor: `__builtin_popcount(x)`. Masalan, `__builtin_popcount(13)` $= 3$, chunki $13 = 1101_2$. `long long` uchun `__builtin_popcountll(x)` ishlatiladi.

### Eng kichik yoqilgan bit va ikkining darajasi

`x & (x - 1)` sondagi eng o'ngdagi 1 ni o'chiradi: $12 = 1100_2$, $11 = 1011_2$, natija $1000_2 = 8$. Bundan ikkining darajasini tekshirish kelib chiqadi: ikkining darajasida faqat bitta bit yoqilgan.

```cpp
bool isPowerOfTwo(long long x) {
    return x > 0 && (x & (x - 1)) == 0;
}
```

`x & (-x)` esa aksincha, faqat eng o'ngdagi 1 ni qoldiradi: `12 & -12` $= 4$.

### Tez ko'paytirish va bo'lish

Juftlikni `x & 1`, 2 ning darajasiga ko'paytirishni `x << k`, bo'lishni `x >> k` bilan yozish mumkin. Bu ifodalar tez-tez boshqa odamlarning yechimlarida uchraydi, ularni o'qiy olish muhim.

## Ko'p uchraydigan xatolar

### Amallar ustuvorligi

> [!WARNING]
> `if (x & 1 == 0)` — juftlikni tekshirmaydi. C++ da `==` amali `&` dan oldin bajariladi, shuning uchun bu `x & (1 == 0)`, ya'ni `x & 0` bo'ladi va doim 0 qaytaradi. To'g'risi: `if ((x & 1) == 0)`. Bit amallarini doim qavsga oling.

### `1 << k` ning to'lib ketishi

> [!WARNING]
> `long long mask = 1 << 40;` — xato. `1` bu `int`, u faqat 32 bit; 31 dan katta siljitishda natija noto'g'ri bo'ladi. To'g'risi: `1LL << 40`. $k \ge 31$ bo'lishi mumkin bo'lsa, doim `1LL` yozing.

### `^` daraja emas

> [!WARNING]
> `int p = 2 ^ 3;` — natija 8 emas, 1 bo'ladi, chunki `^` bu XOR: $10_2 \oplus 11_2 = 01_2$. Ikkining darajasi uchun `1 << 3` yozing.

### `popcount` noto'g'ri turda

> [!WARNING]
> `long long x = 1LL << 40; __builtin_popcount(x);` — 0 qaytaradi, chunki funksiya faqat `int` qabul qiladi va yuqori bitlar kesiladi. `long long` uchun `__builtin_popcountll(x)` ishlating.

### `~` ni "bitlarni aylantirish" deb kutish

> [!WARNING]
> $5 = 101_2$ uchun `~5` natijasi $010_2 = 2$ emas, balki $-6$. `int` ning 32 bitining hammasi aylanadi, yuqoridagi nollar ham. Faqat pastki $k$ bitni aylantirish kerak bo'lsa, `x ^ ((1 << k) - 1)` yozing: `5 ^ 7` $= 2$.

## Xulosa

- AND (`&`), OR (`|`), XOR (`^`) har bir bit ustunini alohida qayta ishlaydi; `<<` va `>>` bitlarni suradi.
- `1 << k` — faqat $k$-biti yoqilgan son. U bilan istalgan bitni tekshirish, yoqish, o'chirish va almashtirish mumkin.
- $a \oplus a = 0$ va $a \oplus 0 = a$: juft marta uchragan sonlar XOR'da yo'qoladi.
- Bit amallarini doim qavsga oling, katta siljitishda `1LL` yozing.

**Masalada qanday tanib olish mumkin:** shartda "XOR", "bitwise", "ikkilik ko'rinish" so'zlari bor; "har bir son juft marta uchraydi, bittasidan tashqari"; sonning bitlari yoki 2 ning darajalari haqida savol; birlar sonini sanash kerak.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Bit amali | bitwise operation | Sonlarning har bir bitini alohida qayta ishlaydigan amal. |
| AND | bitwise AND | Ikkala bit ham 1 bo'lsagina 1 beradigan amal. |
| OR | bitwise OR | Kamida bitta bit 1 bo'lsa 1 beradigan amal. |
| XOR | exclusive OR | Bitlar har xil bo'lsa 1, bir xil bo'lsa 0 beradigan amal. |
| NOT | bitwise NOT | Sonning barcha bitlarini teskarisiga aylantiradigan amal. |
| Chapga siljitish | left shift | Bitlarni chapga surish; sonni $2^k$ ga ko'paytiradi. |
| O'ngga siljitish | right shift | Bitlarni o'ngga surish; sonni $2^k$ ga bo'lib, butun qismini qoldiradi. |
| $k$-bit | $k$-th bit | Ikkilik yozuvda o'ngdan 0 dan boshlab sanalgan $k$-o'rindagi raqam. |

> [!TIP] O'zingizni tekshiring
> 1. `6 & 3`, `6 | 3` va `6 ^ 3` nechaga teng?
> 2. $x = 20$ uchun 2-bit yoqilganmi? Qaysi ifoda bilan tekshirasiz?
> 3. Nega `1 << 35` noto'g'ri natija beradi va uni qanday tuzatish mumkin?
>
> <details>
> <summary>Javoblar</summary>
>
> 1. $6 = 110_2$, $3 = 011_2$: AND $= 010_2 = 2$, OR $= 111_2 = 7$, XOR $= 101_2 = 5$.
> 2. $20 = 10100_2$, 2-bit yoqilgan. Ifoda: `(20 >> 2) & 1` $= 101_2 \,\&\, 1 = 1$.
> 3. `1` — 32 bitli `int`, 35 ta siljitish unga sig'maydi. To'g'risi: `1LL << 35`.
>
> </details>
