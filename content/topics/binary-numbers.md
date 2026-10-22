---
summary: "Ikkilik yozuvdagi xona qiymatlarini tushunish, sonni ikkilikka va ikkilik satrni songa o'tkazish."
prerequisites: [brute-force]
---

## Kirish

13 sonini $8+4+1$ ko'rinishida yozish mumkin. 8, 4, 2, 1 qiymatli to'rtta katak ajratsak, 13 ni ifodalash uchun birinchi, ikkinchi va to'rtinchi katakni belgilaymiz: `1101`. Bu sonni 0 va 1 bilan yozishning bir misoli. Dars davomida siz bu yozuvni o'qish, hosil qilish va undagi birlarni sanashni o'rganasiz.

## Muammo

Manfiy bo'lmagan $n$ butun son berilgan. Uning ikkilik yozuvini hamda shu yozuvdagi 1 raqamlari sonini chiqaring.

- **Kirish:** bitta butun son $n$, $0\le n\le10^{18}$.
- **Chiqish:** birinchi qatorda ikkilik yozuv, ikkinchi qatorda birlar soni.
- Yozuv boshida ortiqcha nollar bo'lmasin. 0 soni `0` deb chiqarilsin.
- Vaqt chegarasi: 1 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
13
```

Chiqish:

```text
1101
3
```

Sonni 0 dan boshlab bittalab sanash shart emas. Bizga faqat uning raqamlari kerak. "Rekursiya asoslari" darsidagi o'nlik raqamlar bilan ishlashni eslasangiz, `% 10` oxirgi raqamni, `/ 10` qolgan qismini bergan edi. Quyida xuddi shu fikrni 2 asosida qo'llaymiz; rekursiya talab qilinmaydi.

## G'oya

### Xona qiymatlari

O'nlikdagi $345$ yozuvi $3\cdot100+4\cdot10+5\cdot1$ degani. O'ngdan chapga xona qiymatlari $1,10,100,\dots$ bo'lib o'sadi. Sonni raqamlar va ularning o'rni orqali yozish qoidasi **pozitsion sanoq sistemasi (positional numeral system)** deyiladi.

Har bir xona o'ng qo'shnisidan necha marta katta ekanini ko'rsatuvchi son **asos (base)** deyiladi. O'nlik yozuvda asos 10, raqamlar esa 0 dan 9 gacha.

Ikkilik yozuvda xona qiymatlari $1,2,4,8,16,\dots$. **Ikkilik sanoq sistemasi (binary numeral system)** — asosi 2 bo'lgan, faqat 0 va 1 raqamlari ishlatiladigan sistema. Uning bitta raqami **bit (bit)** deyiladi.

| Bit o'rni | 3 | 2 | 1 | 0 |
|---|---|---|---|---|
| Xona qiymati | 8 | 4 | 2 | 1 |
| 13 ning biti | 1 | 1 | 0 | 1 |
| Yig'indiga hissasi | 8 | 4 | 0 | 1 |

Demak, $1101_2=8+4+1=13$. Pastdagi 2 yozuvning asosini bildiradi. Oddiy `1101` satrini esa qaysi sanoq sistemasida o'qiyotganimizni kontekstdan bilamiz.

Bitlar **o'ngdan 0 dan boshlab** raqamlanadi. $k$-o'rinning qiymati $2^k$. Masalan, 2-bitning qiymati 4, 3-bitniki 8.

### Nega 2 ga bo'lamiz?

13 ni 2 ga bo'lsak, butun qismi 6, qoldig'i 1: $13=2\cdot6+1$. Ikkilik yozuvda ham $1101_2$ ning oxirgi biti 1, qolgan qismi $110_2=6$.

**`n % 2` oxirgi bitni beradi, `n / 2` esa shu bit olib tashlangan sonni beradi.** Sababi: eng o'ngdagi xonadan boshqa barcha xona qiymatlari 2 ga bo'linadi. Ularning hissasi qoldiq bermaydi; qoldiqni faqat oxirgi bit belgilaydi.

Keyin 6 uchun shu ishni takrorlaymiz: $6=2\cdot3+0$. Shunday davom etib, bitlarni o'ngdan chapga yig'amiz.

1. Son 0 bo'lsa, uning yozuvi `0`.
2. Aks holda `n % 2` ni satr oxiriga qo'shamiz.
3. `n` ni 2 ga butun bo'lamiz va u musbat ekan, takrorlaymiz.
4. Yig'ilgan satrni teskari aylantiramiz.

> [!NOTE]
> To'xtang va o'ylang: 6 uchun qoldiqlar `0`, `1`, `1` chiqadi. Natijani `011` deb chiqarish nega noto'g'ri?

Birinchi topilgan 0 eng o'ngdagi bit edi. Uni satrning chap tomoniga yozib qo'ydik. Tartibni tuzatsak, `110` hosil bo'ladi: $4+2=6$. `011` esa $2+1=3$.

### Nega usul barcha bitlarni topadi?

Har qadamda $n=2q+r$, bu yerda $q$ — butun bo'linma, $r$ esa 0 yoki 1. Qoldiq oxirgi bitni aniq belgilaydi, qolgan bitlar $q$ ichida qoladi. Musbat son 2 ga butun bo'linganda kichrayadi, shuning uchun oxir-oqibat 0 ga yetamiz.

Oxirgi musbat qiymat 1 bo'ladi. Undan olingan qoldiq teskari aylantirilgach yozuvning boshiga keladi. Shu sababli musbat sonning natijasida ortiqcha boshlang'ich nol bo'lmaydi.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

string toBinary(long long n) {
    if (n == 0) return "0";

    string digits;
    while (n > 0) {
        // Qoldiq 0 yoki 1; uni satr belgisi sifatida qo'shamiz.
        digits.push_back(char('0' + n % 2));
        n /= 2;
    }

    reverse(digits.begin(), digits.end());
    return digits;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    cin >> n;
    string binary = toBinary(n);

    int ones = 0;
    for (char digit : binary) {
        if (digit == '1') ones++;
    }

    cout << binary << '\n' << ones << '\n';
    return 0;
}
```

- `long long` berilgan $10^{18}$ gacha bo'lgan qiymatlarni saqlay oladi.
- `'0'` va `'1'` — belgilar; 0 va 1 esa sonlar. `char('0' + n % 2)` kerakli belgini hosil qiladi.
- `toBinary` parametrni qiymat bo'yicha oladi. Ichidagi bo'lishlar `main` dagi `n` ni o'zgartirmaydi.
- 0 ning yozuvi bitta belgidan iborat, lekin unda birlar soni 0.

## Misol

$n=13$ uchun barcha qadamlar:

| Qadam | Bo'lishdan oldingi $n$ | Qoldiq | Yangi $n$ | Yig'ilgan satr |
|---|---|---|---|---|
| 1 | 13 | 1 | 6 | `1` |
| 2 | 6 | 0 | 3 | `10` |
| 3 | 3 | 1 | 1 | `101` |
| 4 | 1 | 1 | 0 | `1011` |

Sikl tugagach, `1011` satrini teskari aylantirib `1101` olamiz. Birlar soni 3. Xona qiymatlari orqali qayta hisoblasak, $8+4+1=13$ — boshlang'ich son qaytdi.

## Murakkablik

Ikkilik yozuv uzunligini $b$ deb olaylik. Bo'lish sikli musbat son uchun $b$ marta ishlaydi. Satrni teskari aylantirish va birlarni sanash ham $O(b)$ vaqt oladi. Jami vaqt $O(b)$, satr uchun xotira $O(b)$.

Musbat $n$ uchun $b=\lfloor\log_2 n\rfloor+1$. Masalan, $8=1000_2$ to'rt bitli; $\log_2 8=3$ darajani bildiradi, uzunlik esa undan bitta ko'p. $\lfloor x\rfloor$ belgisi $x$ dan katta bo'lmagan eng katta butun sonni bildiradi.

$2^{59}\le10^{18}<2^{60}$ bo'lgani uchun bizning musbat kirishlarimiz ko'pi bilan 60 bitli. Algoritmning bo'lish sikli ham ko'pi bilan 60 marta aylanadi. 0 uchun logarifm formulasini ishlatmaymiz: uni alohida, bir belgili yozuv deb olganmiz.

## Variantlar

### Ikkilik satrdan son olish

`1101` ni chapdan o'ngga o'qiylik. Avvalgi qiymatni ikki baravar oshirib, keyingi bitni qo'shamiz:

| O'qilgan qism | Hisob | Qiymat |
|---|---|---|
| `1` | $0\cdot2+1$ | 1 |
| `11` | $1\cdot2+1$ | 3 |
| `110` | $3\cdot2+0$ | 6 |
| `1101` | $6\cdot2+1$ | 13 |

Yangi xona qo'shilganda oldingi xonalarning qiymati ikki baravar oshadi. Shu sababli quyidagi funksiya ishlaydi. Uning sharti: satr bo'sh emas, faqat `0` va `1` dan iborat, uzunligi ko'pi bilan 60.

```cpp
long long toDecimal(const string& binary) {
    long long value = 0;
    for (char digit : binary) {
        value = value * 2 + (digit - '0');
    }
    return value;
}
```

60 bitli yozuvning eng katta qiymati $2^{60}-1$ bo'lib, `long long` ga sig'adi. Uzunlik cheklanmasa, bu kod uchun to'lib ketish ehtimolini alohida tekshirish kerak.

### Yozuv uzunligi va birlar soni

$8=1000_2$: uzunligi 4, birlar soni 1. $7=111_2$: uzunligi 3, birlar soni 3. Demak, bu ikki savol boshqa-boshqa natija beradi.

Har qanday $2^k$ sonining yozuvi bitta 1 va undan keyingi $k$ ta noldan iborat. $2^k-1$ esa $k$ ta birdan iborat: $15=16-1=1111_2$. Bu kuzatishlar keyingi bit amallari darsida kerak bo'ladi.

### Boshlang'ich nollar

`1101` va `00001101` bir xil 13 sonini bildiradi. Qo'shilgan nollar yangi qiymat bermaydi. Sonning o'ziga kerak bo'lgan yozuv uzunligi bilan dasturdagi son turi uchun ajratilgan bitlar sonini ajrating.

Masalan, odatdagi musobaqa muhitida `int` 32 bitli, `long long` esa 64 bitli. C++ da `int` ning aniq o'lchami barcha muhitlar uchun bir xil deb belgilanmagan. Son turi chegarasini tekshirish kerak bo'lsa, `numeric_limits<T>::max()` dan foydalanish mumkin.

## Ko'p uchraydigan xatolar

### Nol uchun bo'sh satr chiqarish

Faqat `while (n > 0)` ga tayansak, 0 uchun hech qanday raqam yig'ilmaydi. `if (n == 0) return "0";` shu holatni to'g'rilaydi.

### Bit indeksini satr indeksi bilan adashtirish

`1101` satrida chapdagi belgi `binary[0]`, lekin u sonning 3-biti. Sonning 0-biti eng o'ngda. Satr bilan ishlaganda yo'nalishni aniq belgilang.

### Natija har doim son turiga sig'adi deb o'ylash

Ikkilikdan qaytishda `value * 2 + bit` ham son turi chegarasidan oshishi mumkin. C++ da ishorali butun sonning to'lib ketishini "son aylanib ketadi" deb ishonchli qoida sifatida ishlatib bo'lmaydi. Yuqoridagi funksiyada xavfsizlik kirish uzunligi orqali ta'minlangan.

### Butun son hisobiga keraksiz `pow` qo'shish

Bu masalada darajalarni haqiqiy sonlarda hisoblash shart emas. `value = value * 2 + bit` aniq butun son arifmetikasida ishlaydi. Katta sonlarni `double` orqali yig'ish barcha butun qiymatlarni aniq saqlash kafolatini bermaydi.

## Xulosa

- Ikkilik yozuvda $k$-bitning xona qiymati $2^k$; indekslar o'ngdan 0 dan boshlanadi.
- Sonni 2 ga bo'lib, qoldiqlarni yig'amiz va ularni teskari tartibga keltiramiz.
- Ikkilik satrni o'qishda oldingi qiymatni 2 ga ko'paytirib, yangi bitni qo'shamiz.
- Yozuv uzunligi, birlar soni va son turi kengligi — uchta alohida tushuncha.

**Qachon kerak?** Masala sonning ikkilik yozuvi, alohida bitlari yoki ikkining darajalari haqida bo'lsa. Keyingi darsda bitlarni satrga aylantirmasdan tekshirish va o'zgartirishni ko'ramiz.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Pozitsion sanoq sistemasi | Positional numeral system | Raqamning hissasi uning yozuvdagi o'rniga bog'liq bo'lgan yozish qoidasi. |
| Asos | Base | Har bir xona o'ng qo'shnisidan necha marta katta ekanini bildiruvchi son. |
| Ikkilik sanoq sistemasi | Binary numeral system | 0 va 1 raqamlari ishlatiladigan, asosi 2 bo'lgan sistema. |
| Bit | Bit | Ikkilik yozuvdagi bitta raqam. |

### O'zingizni tekshiring

1. $100110_2$ o'nlikda nechaga teng?
2. 25 ning ikkilik yozuvi, yozuv uzunligi va birlar soni qanday?
3. 0 uchun dastur ikki qatorda nima chiqaradi?
4. Nega $2^{10}=1024$ sonining yozuvi 10 emas, 11 bitli?

<details>
<summary>Javoblarni ko'rish</summary>

1. $32+4+2=38$.
2. `11001`, uzunligi 5, birlar soni 3.
3. Birinchi qatorda `0`, ikkinchisida ham `0`.
4. 10-bit yoqilgan, undan pastda 0–9 bitlar bor: jami 11 ta xona. Yozuv bitta 1 va o'nta noldan iborat.

</details>
