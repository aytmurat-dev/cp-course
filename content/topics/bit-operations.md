---
summary: "AND, OR, XOR va siljitish orqali bitlarni boshqarish hamda XOR bilan bir marta uchragan sonni topish."
prerequisites: [binary-numbers]
---

## Kirish

$12=1100_2$ va $10=1010_2$ yozuvlarini ustma-ust qo'yaylik. Ikkalasida ham 1 turgan joyni qoldirsak, `1000`, ya'ni 8 hosil bo'ladi. Har bir xonani alohida solishtirish sonlar ustida yangi amallarni bajarishga imkon beradi. Bu darsda siz shu amallarni qo'lda hisoblaysiz, alohida bitlarni o'zgartirasiz va takrorlangan sonlar orasidan yagona sonni topasiz.

## Muammo

$n$ ta manfiy bo'lmagan butun son berilgan. Aynan bitta qiymat bir marta, qolgan har bir qiymat ikki marta uchraydi. Bir marta uchragan qiymatni toping.

- **Kirish:** birinchi qatorda toq son $n$, ikkinchi qatorda $n$ ta qiymat.
- **Cheklovlar:** $1\le n\le10^6$, $0\le a_i\le10^{18}$. Takrorlanish sharti bajarilishi kafolatlangan.
- **Chiqish:** bir marta uchragan qiymat.
- Vaqt chegarasi: 2 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
7
4 7 2 7 4 9 2
```

Chiqish:

```text
9
```

Siz biladigan `map` orqali har bir qiymatning takrorlanishini sanash mumkin. Bu $O(n\log n)$ vaqt va eng yomon holatda $O(n)$ xotira talab qiladi. Saralab, yonma-yon teng qiymatlarni tekshirish ham mumkin. Bu darsda esa takrorlanish shartidan foydalanib, sonlarni bir marta o'qish va bitta hisoblagichda javob olish usulini ko'ramiz.

## G'oya

### Har bir ustunni alohida hisoblash

Quyidagi misollarda oldingi nollar xona qiymatlarini tenglashtirish uchun yozilgan:

```text
12: 1100
10: 1010
```

**Bit amali (bitwise operation)** butun sonning bitlarini alohida qayta ishlaydi. Asosiy uch amalning bir bit uchun qoidasi:

| Birinchi bit | Ikkinchi bit | AND: ikkalasi ham 1 | OR: kamida bittasi 1 | XOR: bitlar turlicha |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

**AND** C++ da `&` bilan yoziladi: ikkala bit ham 1 bo'lgandagina 1 beradi. **OR** `|` bilan yoziladi: kamida bitta bit 1 bo'lsa, 1 beradi. **XOR (exclusive OR)** `^` bilan yoziladi: bitlar turlicha bo'lsa 1, bir xil bo'lsa 0 beradi.

Shu qoidalarni har bir ustunga qo'llaymiz:

```text
  1100      1100      1100
& 1010    | 1010    ^ 1010
------    ------    ------
  1000      1110      0110
```

Natijalar mos ravishda 8, 14 va 6. Oddiy qo'shishdan farqli ravishda bu amallarda bir xonadan keyingisiga ko'chadigan raqam yo'q: har bir ustun mustaqil hisoblanadi.

### XOR juftlarni qanday yo'qotadi?

Masalan, $7\mathbin{\oplus}7=0$: ikki yozuvdagi barcha bitlar bir xil. Bu yerda $\oplus$ matematik yozuvda XOR ni bildiradi; C++ da uning o'rniga `^` ishlatiladi. Shuningdek, $7\mathbin{\oplus}0=7$.

XOR ni bitni almashtiradigan tugma deb tasavvur qilish mumkin. 1 bilan XOR qilish bitni almashtiradi, 0 bilan XOR qilish o'zgartirmaydi. Bir bitni ikki marta almashtirsak, u avvalgi holatiga qaytadi.

**Barcha qiymatlarni XOR qilsak, ikki marta uchragan qiymatlarning ta'siri bekor bo'ladi.** XOR da qiymatlar tartibi va qavslarni joylashtirish natijani o'zgartirmaydi. Shuning uchun misolni quyidagicha guruhlash mumkin:

$$
4\oplus7\oplus2\oplus7\oplus4\oplus9\oplus2
=(4\oplus4)\oplus(7\oplus7)\oplus(2\oplus2)\oplus9=9.
$$

Bu xossa har bir bitda ham ko'rinadi: shu ustundagi 1 lar soni toq bo'lsa, XOR natijasidagi bit 1 bo'ladi. Ikki bir xil qiymat har bir ustunga juft miqdorda bir qo'shadi. Natijani faqat bir marta uchragan qiymatning bitlari belgilaydi.

> [!NOTE]
> To'xtang va o'ylang: qolgan qiymatlar ikki emas, to'rt martadan uchrasa-chi? Uch martadan uchrasa-chi?

To'rt martaliklar ham juft-juft bekor bo'ladi. Uch martalik qiymat esa $a\oplus a\oplus a=a$ bo'lib qoladi. Demak, qolgan qiymatlar juft marta uchrashi muhim. Masalada bir nechta toq marta uchragan qiymat bo'lsa, ularning XOR i chiqadi; bu yagona qiymatni aniqlash bilan bir xil emas.

## Amalga oshirish

Bitlar bilan ishlashni aniq qilish uchun `uint64_t` dan foydalanamiz. Bu `<cstdint>` dagi ishorasiz, 64 bitli butun son turi; biz ishlatayotgan musobaqa muhitlarida mavjud. U $0$ dan $2^{64}-1$ gacha qiymatlarni saqlaydi. Manfiy qiymatlar bu darsga kirmaydi.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    uint64_t answer = 0;
    for (int i = 0; i < n; i++) {
        uint64_t x;
        cin >> x;
        answer ^= x;
    }

    cout << answer << '\n';
    return 0;
}
```

- `answer` 0 dan boshlanadi, chunki 0 bilan XOR qiymatni o'zgartirmaydi.
- `answer ^= x` yozuvi `answer = answer ^ x` degani.
- Qiymatlarni keyin qayta ko'rmaymiz, shuning uchun massiv saqlash kerak emas.
- Dastur takrorlanish kafolatiga tayanadi. U kirish shu shartga mosligini o'zi tekshirmaydi.

## Misol

Misoldagi qiymatlar kichik, shuning uchun jadvalda faqat pastki to'rtta bit ko'rsatilgan. Yuqoridagi bitlar 0.

| Qadam | O'qilgan $x$ | $x$ ikkilikda | Yangilangan `answer` | O'nlik qiymat |
|---|---|---|---|---|
| Boshi | — | — | `0000` | 0 |
| 1 | 4 | `0100` | `0100` | 4 |
| 2 | 7 | `0111` | `0011` | 3 |
| 3 | 2 | `0010` | `0001` | 1 |
| 4 | 7 | `0111` | `0110` | 6 |
| 5 | 4 | `0100` | `0010` | 2 |
| 6 | 9 | `1001` | `1011` | 11 |
| 7 | 2 | `0010` | `1001` | 9 |

Oraliq natija massivda umuman bo'lmagan son ham bo'lishi mumkin: masalan, 3 yoki 11. U hozirgacha o'qilgan qiymatlarning XOR i. Faqat barcha qiymatlar o'qilgach, kafolatlangan juftlar bekor bo'ladi va 9 qoladi.

## Murakkablik

Har bir qiymatni o'qib, bitta XOR bajaramiz: vaqt $O(n)$, qo'shimcha xotira $O(1)$. $n=10^6$ bo'lsa, bir millionta XOR bor; o'qish xarajati ham umumiy vaqtga kiradi.

Bu darsda son kengligi doim 64 bit bo'lgani uchun bitta bit amalini $O(1)$ deb baholaymiz. Bu har qanday ifoda aynan bitta protsessor buyrug'i yoki barcha kompyuterlarda bir xil vaqt degani emas.

## Variantlar

### Bitlarni siljitish

$5=101_2$ yozuvini ikki xona chapga sursak, $10100_2=20$ bo'ladi. **Chapga siljitish (left shift)** C++ da `x << k` orqali yoziladi; o'ngdan $k$ ta nol qo'shiladi.

$13=1101_2$ ni bir xona o'ngga sursak, $110_2=6$. **O'ngga siljitish (right shift)** `x >> k` orqali yoziladi; pastki $k$ ta bit tashlab yuboriladi. Ishorasiz turda chapdan nollar kiradi.

Quyida `x` turi `uint64_t`, siljish miqdori esa $0\le k<64$ bo'lsin. `x >> k` butun bo'lishdagi $\lfloor x/2^k\rfloor$ ga teng. `x << k` natijasi $x\cdot2^k$ ga faqat yuqoridan bitlar tushib qolmasa teng. 64 bitga sig'magan yuqori bitlar ishorasiz turda tashlab yuboriladi.

Masalan, `uint64_t{1} << 3` faqat 3-biti yoqilgan 8 sonini beradi. `uint64_t{1}` yozuvi 1 qiymatini boshidanoq 64 bitli ishorasiz turda yaratadi.

### Bitta bitni tekshirish va o'zgartirish

$x=13=1101_2$ ning 1-bitini yoqmoqchimiz. Shu o'rinda 1 turgan son $2=0010_2$. OR qilsak, `1111`, ya'ni 15 chiqadi. Kerakli o'rinlarni ajratish uchun ishlatiladigan bunday bitlar naqshi **bit niqobi (bit mask)** deyiladi.

Quyidagi ifodalarda `uint64_t mask = uint64_t{1} << k;`, $0\le k<64$. Har bir misol asl $x=13$ qiymatiga alohida qo'llanadi:

| Vazifa | C++ ifodasi | Misol |
|---|---|---|
| $k$-bit 1 ekanini tekshirish | `(x & mask) != 0` | $k=1$: yolg'on |
| $k$-bitni 0 yoki 1 sifatida olish | `(x >> k) & uint64_t{1}` | $k=2$: 1 |
| $k$-bitni yoqish | `x \| mask` | $k=1$: 15 |
| $k$-bitni o'chirish | `x & ~mask` | $k=2$: 9 |
| $k$-bitni almashtirish | `x ^ mask` | $k=0$: 12 |

`~` — **NOT**, har bir bitni teskarisiga aylantiradi. `mask` ning faqat $k$-biti 1 bo'lsa, `~mask` ning shu biti 0, qolganlari 1 bo'ladi. Shuning uchun `x & ~mask` faqat kerakli bitni o'chiradi.

> [!IMPORTANT]
> NOT sonning qisqa ikkilik yozuvini emas, turdagi barcha bitlarni almashtiradi. `uint64_t` da 5 ning yozuvi 64 xonali deb qaraladi. `~x` natijasidagi yuqori nollar ham birga aylanadi.

Faqat pastki uch bitni almashtirish uchun `x ^ uint64_t{7}` ishlatish mumkin, chunki $7=111_2$. $x=5$ bo'lsa, $101_2\oplus111_2=010_2=2$. Yuqoridagi bitlar o'zgarishsiz qoladi.

### Eng o'ngdagi birni o'chirish

$12=1100_2$ dan 1 ayirsak, $11=1011_2$. AND natijasi $1000_2=8$: eng o'ngdagi bir o'chdi. Umuman, musbat `x` uchun `x & (x - 1)` eng o'ngdagi birni o'chiradi. Chunki ayirishda shu bir 0 ga, uning o'ngidagi nollar 1 ga aylanadi; AND ularni o'chiradi.

Bundan ikkining darajasini tekshirish kelib chiqadi. Musbat ikkining darajasida faqat bitta bir bor:

```cpp
bool isPowerOfTwo(uint64_t x) {
    return x != 0 && (x & (x - 1)) == 0;
}
```

Birlarni sanash uchun esa shu amalni 0 qolguncha takrorlaymiz:

```cpp
int countOnes(uint64_t x) {
    int count = 0;
    while (x != 0) {
        x &= x - 1;
        count++;
    }
    return count;
}
```

Sikl birlar sonicha ishlaydi: 64 bitli qiymat uchun ko'pi bilan 64 marta. 0 uchun bir marta ham ishlamaydi va 0 qaytaradi.

## Ko'p uchraydigan xatolar

### Kichik turdagi 1 ni siljitish

Odatdagi 32 bitli `int` muhitida `uint64_t mask = 1 << 40;` noto'g'ri: siljitish chapdagi `1` ning turida bajariladi. Natijani katta turga yozish oldingi hisobni tuzatmaydi. `uint64_t{1} << 40` deb yozing.

Siljish miqdori ham tekshirilsin: 64 bitli turda $k=64$ yoki manfiy $k$ bilan siljitish mumkin emas. 64 ta bitning indekslari 0–63.

### Qavslarni tashlab ketish

`x & 1 == 0` ifodasida avval `1 == 0` hisoblanadi. Juftlikni tekshirish uchun `(x & uint64_t{1}) == 0` yozing. `&` va `&&` ham boshqa amallar: birinchisi bitlarni, ikkinchisi mantiqiy shartlarni birlashtiradi.

### XOR ni daraja deb o'ylash

`2 ^ 3` natijasi 8 emas, 1: $10_2\oplus11_2=01_2$. Ikkining uchinchi darajasi uchun `uint64_t{1} << 3` yozish mumkin.

### Niqobni tekshirib, natijani 1 bilan solishtirish

`x & mask` natijasi 0 yoki niqobning o'zi bo'ladi. Masalan, $x=13$, $k=2$ da natija 4. Shuning uchun `(x & mask) == 1` o'rniga `(x & mask) != 0` kerak.

## Xulosa

- AND umumiy birlarni, OR kamida bittasida bor birlarni, XOR farq qiladigan bitlarni qoldiradi.
- Juft marta uchragan qiymatlar XOR da bekor bo'ladi; undan foydalanish uchun masala kafolatini tekshiring.
- Alohida bit uchun 64 bitli 1 dan niqob yarating va indeksni 0–63 oralig'ida tuting.
- NOT hamda siljitishni tushunishda son turi kengligini hisobga oling.

**Qachon kerak?** Masala bitlar holati, ikkining darajalari yoki XOR orqali juft ta'sirlarni bekor qilish haqida bo'lsa. Keyingi darsda bitlar orqali qaysi elementlar tanlanganini bitta sonda saqlaymiz.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Bit amali | Bitwise operation | Butun sonning bitlarini alohida qayta ishlash amali. |
| AND | Bitwise AND | Ikkala bit ham 1 bo'lgandagina 1 beradi. |
| OR | Bitwise OR | Kamida bitta bit 1 bo'lsa, 1 beradi. |
| XOR | Exclusive OR | Ikki bit turlicha bo'lsa, 1 beradi. |
| NOT | Bitwise NOT | Turdagi har bir bitni teskarisiga aylantiradi. |
| Chapga siljitish | Left shift | Bitlarni chapga surib, o'ngdan nollar kiritish. |
| O'ngga siljitish | Right shift | Bitlarni o'ngga surib, pastki bitlarni tashlab yuborish. |
| Bit niqobi | Bit mask | Kerakli bit o'rinlarini ajratish uchun ishlatiladigan bitlar naqshi. |

### O'zingizni tekshiring

1. `6 & 3`, `6 | 3`, `6 ^ 3` natijalari qanday?
2. $x=20$ ning 2-bitini o'chirsak, qanday son qoladi?
3. 0 ni nega ikkining darajasi tekshiruvida alohida chiqarib tashlaymiz?
4. Massiv `[5,5,7,9]` bo'lsa, XOR natijasi nimani bildiradi?

<details>
<summary>Javoblarni ko'rish</summary>

1. $110_2$ va $011_2$ uchun mos ravishda 2, 7 va 5.
2. $20=10100_2$, 2-bit o'chsa $10000_2=16$ qoladi.
3. 0 da birorta bir bit yo'q, lekin `(x & (x - 1)) == 0` ifodasining o'zi ishorasiz 0 uchun ham rost bo'ladi. $2^k$ esa manfiy bo'lmagan butun $k$ uchun doim musbat.
4. $7\oplus9=14$ chiqadi. Bu kirishda ikkita qiymat bir martadan uchragan, shuning uchun yagona qiymatni topish kafolati bajarilmagan.

</details>
