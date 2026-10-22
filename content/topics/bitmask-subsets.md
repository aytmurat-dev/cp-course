---
summary: "Qism to'plamni bitmask bilan ifodalash, barcha tanlovlarni takrorsiz sanash va ularning yig'indisini tekshirish."
prerequisites: [complete-search, binary-numbers, bit-operations]
---

## Kirish

1, 2, 3 qiymatli uchta kartochkadan yig'indisi 3 bo'ladiganlarini tanlaymiz. Birinchi va ikkinchi kartochkani yoki faqat uchinchisini olish mumkin. Har bir kartochka uchun "olindi yoki olinmadi" degan bitta belgi yetadi. Bu darsda siz shu belgilarni bitta butun sonning bitlarida saqlab, barcha tanlovlarni sikl orqali tekshirasiz.

## Muammo

$n$ ta manfiy bo'lmagan butun son va $S$ maqsad yig'indi berilgan. Yig'indisi aynan $S$ bo'ladigan qism to'plamlar sonini toping. Har bir elementni ko'pi bilan bir marta tanlash mumkin, tanlash tartibi muhim emas.

Elementlar **indekslari bo'yicha farqlanadi**. Masalan, $[2,2]$ massivida yig'indisi 2 bo'lgan ikkita tanlov bor: birinchi element yoki ikkinchi element. Bo'sh tanlov ham ruxsat etiladi va uning yig'indisi 0.

- **Kirish:** birinchi qatorda $n$ va $S$, ikkinchi qatorda $n$ ta son.
- **Chiqish:** mos qism to'plamlar soni.
- **Cheklovlar:** $1\le n\le20$, $0\le a_i\le10^9$, $0\le S\le2\cdot10^{10}$.
- Vaqt chegarasi: 2 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
3 3
1 2 3
```

Chiqish:

```text
2
```

"To'liq qidiruv" darsida har bir tanlovni alohida 0/1 massiv bilan yozganmiz. Uni qo'lda hisoblagich kabi o'zgartirib, barcha $2^n$ holatni olganmiz. Endi "Ikkilik sonlar" va "Bit amallari" darslaridagi bilimlar bilan shu hisoblagichni bitta sonda saqlaymiz. Tanlovlar soni kamaymaydi, ularni ifodalash va sanash qulaylashadi.

## G'oya

### Element bilan bitni moslashtirish

Elementlarni $a_0,a_1,a_2$ deb raqamlaymiz. 0-bit $a_0$ uchun, 1-bit $a_1$ uchun, 2-bit $a_2$ uchun javob beradi. Bit 1 bo'lsa, tegishli element tanlangan; 0 bo'lsa, tanlanmagan.

Masalan, $5=101_2$. Unda 0- va 2-bitlar 1, demak $a_0$ va $a_2$ tanlangan. Bizning massivda bu 1 va 3 qiymatlari; yig'indi 4.

Har bir biti bir elementning tanlanganini bildiradigan butun sonni **bitmask (bitmask)** deb ataymiz. Oldingi darsdagi bit niqobi endi butun qism to'plamni ifodalayapti.

> [!IMPORTANT]
> Sonning bitlari o'ngdan 0 dan boshlanadi. `101` yozuvida o'ngdagi belgi $a_0$ ga, chapdagi belgi $a_2$ ga tegishli. Jadvalda ustunlar $a_2,a_1,a_0$ tartibida turadi.

### Barcha tanlovlarni qaysi sonlar beradi?

Uchta element uchun 0 dan 7 gacha sonlar yetadi:

| Son | Bitlar: $a_2,a_1,a_0$ | Tanlangan indekslar |
|---|---|---|
| 0 | `000` | Yo'q |
| 1 | `001` | 0 |
| 2 | `010` | 1 |
| 3 | `011` | 0, 1 |
| 4 | `100` | 2 |
| 5 | `101` | 0, 2 |
| 6 | `110` | 1, 2 |
| 7 | `111` | 0, 1, 2 |

Har bir element uchun ikkita imkoniyat bor. $n$ ta elementda $2^n$ ta tanlov hosil bo'ladi. $n$ ta bitning barcha ko'rinishlari esa aynan 0 dan $2^n-1$ gacha sonlar.

**`mask` ni 0 dan $2^n-1$ gacha oshirish barcha qism to'plamlarni bir martadan ko'rib chiqadi.** `mask = 0` bo'sh tanlovni, `mask = 2^n-1` hamma elementlarni bildiradi.

Bu yerda har bir bitning o'rni oldindan belgilangan. Shu sababli $a_0$ va $a_1$ ni tanlash ularni qanday tartibda olganimizdan qat'i nazar bitta maskka mos keladi. Permutatsiyalarni alohida sanash kerak emas.

### Bitta tanlovning yig'indisi

$\text{mask}=3=011_2$ bo'lsin. 0-bit 1 — $a_0=1$ ni qo'shamiz. 1-bit ham 1 — $a_1=2$ ni qo'shamiz. 2-bit 0 — $a_2=3$ ni olmaymiz. Yig'indi 3 bo'ldi.

Bitni tekshirish uchun oldingi darsdagi `(mask >> i) & uint64_t{1}` ifodasini ishlatamiz. Siljitish $i$-bitni eng o'ngga olib keladi, AND esa boshqa bitlarni olib tashlaydi. Natija 0 yoki 1.

1. `limit` ni $2^n$ ga tenglaymiz.
2. Har bir `mask < limit` uchun yig'indini 0 dan boshlaymiz.
3. Barcha $i=0,1,\dots,n-1$ bitlarni tekshiramiz va tanlangan elementlarni qo'shamiz.
4. Yig'indi $S$ ga teng bo'lsa, javobni bittaga oshiramiz.

> [!NOTE]
> To'xtang va o'ylang: $a=[2,2]$, $S=2$ bo'lsa, `01` va `10` ni bir xil tanlov deb hisoblash kerakmi?

Yo'q. `01` birinchi elementni, `10` ikkinchi elementni tanlaydi. Qiymatlar teng, lekin indekslar boshqa. Masala sharti bo'yicha ular ikkita yechim.

### Nega sanash to'g'ri?

Har qanday tanlov uchun olingan elementlarning bitlarini 1 qilsak, yagona mask hosil bo'ladi. Aksincha, maskning bitlari tanlangan indekslarni to'liq belgilaydi. Ikki xil mask kamida bitta bitda farq qiladi, demak kamida bitta element tanlovi ham farq qiladi.

Sikl barcha masklarni bir martadan oladi. Ichki sikl aynan 1 bitlarga mos elementlarni qo'shadi. Javob faqat yig'indi mos kelganda oshgani uchun kerakli tanlovlar qolib ketmaydi va takror sanalmaydi.

## Amalga oshirish

Mask uchun oldingi darsdagidek `uint64_t` ishlatamiz. Yig'indilar esa `long long` da saqlanadi.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long target;
    cin >> n >> target;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    uint64_t limit = uint64_t{1} << n;
    long long answer = 0;

    for (uint64_t mask = 0; mask < limit; mask++) {
        // Har bir yangi tanlovning yig'indisi alohida hisoblanadi.
        long long sum = 0;
        for (int i = 0; i < n; i++) {
            if (((mask >> i) & uint64_t{1}) != 0) {
                sum += a[i];
            }
        }
        if (sum == target) answer++;
    }

    cout << answer << '\n';
    return 0;
}
```

- `uint64_t{1} << n` $2^n$ ni beradi. Bu yerda $n\le20$, shuning uchun siljitish 64 bitli tur uchun ruxsat etilgan oraliqda.
- `mask < limit`: `limit` ning o'zi qism to'plam emas, siklning yuqori chegarasi.
- `sum` ko'pi bilan $20\cdot10^9=2\cdot10^{10}$ bo'ladi. Shu sababli uni `long long` da hisoblaymiz.
- `answer` ko'pi bilan $2^{20}=1\,048\,576$. Barcha elementlar 0 va maqsad ham 0 bo'lsa, barcha masklar mos keladi.

## Misol

$a=[1,2,3]$, $S=3$ uchun barcha tanlovlar:

| `mask` | Ikkilik yozuv | Tanlangan qiymatlar | Yig'indi | Tekshiruvdan keyingi `answer` |
|---|---|---|---|---|
| 0 | `000` | Bo'sh | 0 | 0 |
| 1 | `001` | 1 | 1 | 0 |
| 2 | `010` | 2 | 2 | 0 |
| 3 | `011` | 1, 2 | 3 | 1 |
| 4 | `100` | 3 | 3 | 2 |
| 5 | `101` | 1, 3 | 4 | 2 |
| 6 | `110` | 2, 3 | 5 | 2 |
| 7 | `111` | 1, 2, 3 | 6 | 2 |

Mos masklar 3 va 4. Birinchisi ikkita elementni, ikkinchisi bitta elementni bildiradi. Dastur 2 chiqaradi.

Mask soni elementlar yig'indisi emas. Masalan, `mask = 4` ning ma'nosi "2-bit yoqilgan"; yig'indi esa o'sha indeksdagi $a_2=3$ qiymatidan olinadi.

## Murakkablik

Tashqi sikl $2^n$ marta, ichki sikl har safar $n$ marta ishlaydi. Vaqt **$O(n2^n)$**. Maskning bitta sonda saqlanishi barcha qism to'plamlarni tekshirish ishini yo'qotmaydi.

| $n$ | Masklar soni $2^n$ | Ichki sikl qadamlari $n2^n$ |
|---|---|---|
| 10 | 1 024 | 10 240 |
| 20 | 1 048 576 | 20 971 520 |
| 25 | 33 554 432 | 838 860 800 |
| 30 | 1 073 741 824 | 32 212 254 720 |

$n=20$ uchun yigirma bir millionga yaqin bit tekshiruvi bajariladi. $n=30$ da ish hajmi keskin oshadi. Jadval aniq ishlash vaqtini bermaydi: muhit, kompilyator va har bir tanlovdagi ish ham muhim.

Massiv $O(n)$ xotira oladi. Mask, yig'indi va hisoblagich uchun qo'shimcha xotira $O(1)$. Barcha qism to'plamlarni alohida saqlamaganimiz uchun umumiy xotira $O(n)$.

> [!IMPORTANT]
> 64 bitli turga tanlovni sig'dirish va barcha tanlovlarni vaqtida tekshirish boshqa-boshqa masalalar. 60 elementning bitta maski sig'adi, lekin $2^{60}$ ta maskni birma-bir ko'rish amaliy emas.

## Variantlar

### Aynan $k$ ta elementni tanlash

Maskdagi birlar soni tanlangan elementlar soniga teng. Masalan, $13=1101_2$ uchta elementni bildiradi. "Bit amallari" darsidagi `countOnes` funksiyasi bilan sonini tekshirish mumkin.

Yoki asosiy dasturdagi ichki siklda yig'indi bilan birga elementlar sonini ham sanaymiz:

```cpp
long long sum = 0;
int selected = 0;
for (int i = 0; i < n; i++) {
    if (((mask >> i) & uint64_t{1}) != 0) {
        sum += a[i];
        selected++;
    }
}
if (selected == k && sum == target) answer++;
```

Bu parcha asosiy dasturdagi bitta maskni tekshirish qismining o'rniga qo'yiladi; $k$ qo'shimcha kirish qiymati bo'ladi. Barcha masklar baribir ko'riladi, vaqt bahosi $O(n2^n)$ bo'lib qoladi.

### Ikki guruhga ajratish

Mask birinchi guruhni bildirsa, olinmagan elementlar ikkinchi guruhga tushadi. Berilgan barcha elementlar ichida tanlanmaganlar **to'ldiruvchi qism to'plam (complement)** deyiladi.

Masalan, uchta elementda `001` ning to'ldiruvchisi `110`. Kodda `full = limit - 1` deb olsak, `full ^ mask` faqat pastki $n$ bitni almashtiradi. `~mask` esa 64 bitning hammasini almashtiradi va bizda yo'q elementlarning bitlarini ham yoqadi.

Guruhlar og'irligi farqini izlashda to'ldiruvchi maskni hisoblash shart emas: barcha qiymatlar yig'indisi $T$, tanlanganlar yig'indisi $S_1$ bo'lsa, qolganlar yig'indisi $T-S_1$. Farq $|S_1-(T-S_1)|$ bo'ladi.

Eng kichik farqni topishda guruhlar o'rnini almashtirib qayta ko'rish natijani buzmaydi. Ammo nomlanmagan ikki guruhga bo'lish usullarini sanashda bunday juft holatlar takror hisoblanishini alohida hal qilish kerak.

## Ko'p uchraydigan xatolar

### Bitta ortiqcha maskni tekshirish

`mask <= limit` yozilsa, $2^n$ ham kiradi. Uning faqat $n$-biti yoqilgan, ichki sikl esa 0–$n-1$ bitlarni tekshiradi. Natijada ortiqcha holat yig'indisi 0 bo'lib, $S=0$ da noto'g'ri qo'shimcha javob beradi. To'g'ri chegara — `mask < limit`.

### Bo'sh tanlovni tasodifan chiqarib tashlash

Bizning masalada `mask = 0` ham ruxsat etilgan. $S=0$ bo'lsa, uni sanash kerak. Agar boshqa masalada faqat bo'sh bo'lmagan tanlovlar so'ralsa, siklni 1 dan boshlash mumkin.

### Yig'indini eski maskdan olib qolish

`sum` ni tashqi sikldan oldin yaratib, har safar nollamaslik oldingi qism to'plam yig'indisini yangi hisobga aralashtiradi. Har bir mask mustaqil tanlov; yig'indini uning ichida 0 dan boshlang.

### Yig'indi topilishi bilan butun qidiruvni to'xtatish

Bitta mos mask topilishi qolganlari yo'q degani emas. Bizning testda `011` dan keyin `100` ham mos keladi. Masala barcha usullar sonini so'ragani uchun qidiruv davom etishi kerak.

Nollar ham muhim: $[0,0]$, $S=0$ uchun bo'sh tanlov, har bir alohida element va ikkala element — jami 4 ta yechim. Teng yig'indilarni birlashtirib yubormang.

## Xulosa

- $i$-bitni $a_i$ elementga bog'lang; ikkilik yozuvda 0-bit o'ngda turadi.
- 0 dan $2^n-1$ gacha sonlar indekslar bo'yicha barcha qism to'plamlarni bir martadan ifodalaydi.
- Har bir mask uchun shartni alohida tekshiring; maskning o'zi elementlar yig'indisi emas.
- Bo'sh tanlov va teng qiymatli elementlar qanday hisoblanishini masala shartidan aniqlang.
- Vaqtni masklar soni va bitta maskni tekshirish xarajati orqali baholang.

**Qachon qo'llash mumkin?** Har bir element olinishi yoki olinmasligi kerak bo'lsa va jami tanlovlarni tekshirish cheklovlarga mos kelsa. Kichik $n$ bitmaskni ko'rib chiqishga sabab, lekin yetarlilikni $n2^n$ kabi hisob bilan tekshiramiz.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Bitmask | Bitmask | Har bir biti tegishli element tanlanganini bildiradigan butun son. |
| To'ldiruvchi qism to'plam | Complement | Berilgan elementlar ichidan joriy tanlovga kirmaganlari. |

### O'zingizni tekshiring

1. $n=5$, `mask = 13` bo'lsa, qaysi indekslar tanlangan?
2. $a=[2,2,2]$, $S=4$ bo'lsa, nechta mos mask bor?
3. $a=[0,0,0]$, $S=0$ bo'lsa, javob qancha?
4. $n=4$ va `mask = 5` bo'lsa, uning shu to'rtta element ichidagi to'ldiruvchisi qanday?

<details>
<summary>Javoblarni ko'rish</summary>

1. $13=01101_2$: 0, 2 va 3 indekslar.
2. Uchta: `011`, `101`, `110`. Har birida boshqa ikkita indeks tanlangan.
3. $2^3=8$. Har bir tanlov yig'indisi 0, bo'sh tanlov ham hisoblanadi.
4. `full = 15 = 1111` va `mask = 5 = 0101`. XOR natijasi `1010`, ya'ni 10; 1- va 3-indekslar tanlanadi.

</details>
