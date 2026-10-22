---
summary: "Qism to'plamlar va permutatsiyalarni to'liq sanash, har birini tekshirish va eng yaxshi javobni tanlash."
prerequisites: [brute-force]
---

## Kirish

Uchta kitobdan istalganlarini safarga olish mumkin. Masalan, faqat birinchisini yoki birinchi va uchinchisini tanlaysiz. Endi uchala kitobni javonga terish kerak bo'lsa, ularning tartibi ham muhim bo'ladi. Bu darsda siz tanlash va tartiblash o'rtasidagi farqni ajratasiz, ikkala holatda ham barcha variantlarni sanaydigan dastur yozasiz.

## Muammo

Sizda og'irliklari 3, 2 va 7 bo'lgan uchta yuk bor. Ularni ikki guruhga bo'lish kerak. Birinchi guruhga 3 va 2 ni, ikkinchisiga 7 ni qo'ysak, guruhlar og'irligi 5 va 7 bo'ladi. Ular orasidagi farq 2; bundan kichik farq olish mumkinmi?

Masalaning umumiy ko'rinishi: $n$ ta yukning og'irliklari $p_0, p_1, \dots, p_{n-1}$ berilgan. Har bir yukni aynan bitta guruhga joylashtiring. Guruhlar jami og'irliklari orasidagi farqning eng kichik qiymatini toping. Guruhlardan biri bo'sh bo'lishi mumkin.

- **Kirish:** birinchi qatorda $n$, ikkinchi qatorda $n$ ta og'irlik.
- **Chiqish:** mumkin bo'lgan eng kichik farq.
- **Cheklovlar:** $1 \le n \le 20$, $1 \le p_i \le 10^9$.
- Vaqt chegarasi: 2 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
3
3 2 7
```

Chiqish:

```text
2
```

"Brute force va Big-O" darsida barcha juftliklarni ko'rdik. Bu safar birinchi guruhga ikkita yuk tushishi shart emas: hech biri, bittasi yoki bir nechtasi tushishi mumkin. Demak, ikkita indeks tanlaydigan sikllar yetmaydi. Har bir yuk uchun alohida "olamiz yoki olmaymiz" qarori kerak.

## G'oya

### Tanlovni 0 va 1 bilan yozish

Yuklarning tartibini $[3,2,7]$ deb belgilaymiz. `101` yozuvi birinchi va uchinchi yukni birinchi guruhga olishni bildiradi. Ikkinchi yuk ikkinchi guruhga tushadi. Bu yerda raqamlarning qiymatini ikkilik son sifatida hisoblash shart emas — ular faqat tanlov belgilari.

Berilgan elementlardan ayrimlarini tanlash natijasi **qism to'plam (subset)** deyiladi. Hech birini tanlamaslik ham, hammasini tanlash ham mumkin. Biz yuklarni o'rinlari orqali farqlaymiz: og'irligi teng ikki yuk ham ikkita alohida tanlovdir.

**Birinchi guruhga qaysi yuklar kirishini bilsak, ikkinchi guruh ham to'liq aniqlanadi.** Shuning uchun ikki guruhni alohida sanamaymiz. `chosen[i]` birinchi guruhga $i$-yuk kirsa 1, aks holda 0 bo'ladi.

Uchta yuk uchun tanlovlar quyidagicha:

```text
000 → 001 → 010 → 011 → 100 → 101 → 110 → 111
```

Har bir yangi yuk oldingi har bir variantni ikkiga ajratadi: uni olmaymiz yoki olamiz. Bitta yukda 2 ta, ikkita yukda 4 ta, uchtada 8 ta variant bor. Umuman, $n$ ta yuk uchun $2^n$ ta tanlov chiqadi.

### Keyingi tanlovga o'tish

`011` dan `100` ga qanday o'tamiz? O'ngdagi 1 ni 0 qilamiz. Uning chapidagi 1 ni ham 0 qilamiz. Keyingi 0 ni 1 qilamiz va to'xtaymiz.

Bu hisoblagichga o'xshaydi: raqam eng katta qiymatiga yetganda nollanadi va uning chapidagi raqam oshadi. Faqat bizda raqamlar 0 va 1 dan iborat.

1. `chosen` massivini nollar bilan boshlaymiz va joriy tanlovni tekshiramiz.
2. O'ngdan yurib, ketma-ket uchragan 1 larni 0 qilamiz.
3. Birinchi uchragan 0 ni 1 qilib, yangi tanlovni tekshirishga qaytamiz.
4. Chap chetdan chiqib ketsak, oxirgi tanlov ham tekshirilgan bo'ladi — tugatamiz.

> [!NOTE]
> To'xtang va o'ylang: `101` dan keyin nima keladi? `111` dan keyin-chi?

`101` dan keyin `110` keladi. `111` da esa almashtirilmagan 0 qolmaydi, shuning uchun sanash tugaydi. Oxirgi variantni ham tekshirish uchun keyingi tanlovga o'tishni hisoblashdan keyin bajaramiz.

### Har bir tanlovdan javob olish

Bizning misolda umumiy og'irlik $3+2+7=12$. `101` tanlovida birinchi guruh $3+7=10$, ikkinchisi $12-10=2$ bo'ladi. Farq 8. `110` tanlovida esa guruhlar 5 va 7, farq 2.

Umumiy og'irlikni $T$, birinchi guruhnikini $S$ deb olsak, ikkinchi guruhniki $T-S$. Farq $|S-(T-S)|$ ga teng. **Mutlaq qiymat (absolute value)** sonning ishorasiz kattaligi: masalan, $|-8|=8$. Shuning uchun guruhlarni qaysi tartibda ayirishimiz natijani o'zgartirmaydi.

### Nega hech bir variant qolib ketmaydi?

Avval oxirgi belgi 0 bo'lgan tanlov, keyin u 1 bo'lgan tanlov keladi. Bu ikkisi tugagach, chapdagi belgilar keyingi holatga o'tadi va oxirgi belgi yana 0 dan boshlanadi. Xuddi shu qoida barcha o'rinlarda ishlaydi. Natijada har bir 0/1 tanlov bir marta olinadi.

Har bir bo'linish shu tanlovlardan biriga mos keladi. Dastur har birida to'g'ri farqni hisoblab, eng kichigini saqlaydi. Demak, oxirida eng yaxshi bo'linishning farqi qoladi.

Guruhlar o'rnini almashtirish bir xil farq beradi: masalan, `001` va `110`. Eng kichik qiymatni izlashda ularni qayta tekshirish javobni buzmaydi. Lekin turli bo'linishlarni **sanash** masalasida bunday takrorlarni alohida hisobga olish kerak.

## Amalga oshirish

Indekslar 0 dan boshlanadi. `chosen` ham, og'irliklar massivi ham bir xil indekslashdan foydalanadi.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<long long> p(n);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        cin >> p[i];
        total += p[i];
    }

    vector<int> chosen(n, 0);
    long long best = total;

    while (true) {
        // Joriy tanlovdagi birinchi guruh og'irligi.
        long long first = 0;
        for (int i = 0; i < n; i++) {
            if (chosen[i] == 1) first += p[i];
        }
        long long second = total - first;
        best = min(best, abs(first - second));

        // Keyingi tanlov: o'ngdagi 1 larni 0 qilamiz.
        int pos = n - 1;
        while (pos >= 0 && chosen[pos] == 1) {
            chosen[pos] = 0;
            pos--;
        }
        if (pos < 0) break;
        chosen[pos] = 1;
    }

    cout << best << '\n';
    return 0;
}
```

- `best = total` — hamma yuk bir guruhda bo'lgan haqiqiy bo'linishning farqi.
- `long long` kerak: jami og'irlik $20\cdot10^9=2\cdot10^{10}$ gacha yetadi.
- Avval joriy tanlov tekshiriladi, keyin hisoblagich o'zgaradi. Shunda `000...0` ham qolib ketmaydi.
- `pos >= 0` birinchi tekshiriladi: `pos` manfiy bo'lsa, `chosen[pos]` o'qilmaydi.

## Misol

$p=[3,2,7]$, umumiy og'irlik 12. Jadval hisoblagichning barcha sakkiz holatini ko'rsatadi.

| `chosen` | Birinchi guruh | $S$ | $T-S$ | Farq | `best` |
|---|---|---|---|---|---|
| `000` | Bo'sh | 0 | 12 | 12 | 12 |
| `001` | 7 | 7 | 5 | 2 | 2 |
| `010` | 2 | 2 | 10 | 8 | 2 |
| `011` | 2, 7 | 9 | 3 | 6 | 2 |
| `100` | 3 | 3 | 9 | 6 | 2 |
| `101` | 3, 7 | 10 | 2 | 8 | 2 |
| `110` | 3, 2 | 5 | 7 | 2 | 2 |
| `111` | 3, 2, 7 | 12 | 0 | 12 | 2 |

Hech bir holatda farq 2 dan kamaymadi. Dastur 2 chiqaradi; bu Muammo bo'limidagi javob bilan mos.

## Murakkablik

$2^n$ ta tanlovning har birida $n$ ta belgini ko'ramiz. Hisoblagichni o'zgartirish ham ko'pi bilan $n$ qadam oladi. Jami vaqt $O(n2^n)$, xotira $O(n)$: barcha tanlovlarni saqlamaymiz, faqat joriysini saqlaymiz.

$n=20$ da $2^{20}=1\,048\,576$ ta tanlov bor. Faqat og'irliklarni tekshirishning o'zi $20\cdot2^{20}=20\,971\,520$ ta element ko'rish demakdir. $n=30$ da esa bu miqdor $32$ milliarddan oshadi. "Brute force va Big-O" darsidagi kabi, variantlar sonini ularni tekshirish xarajatiga ko'paytiramiz; aniq soniyalarni esa faqat shu hisobdan aytmaymiz.

## Variantlar

### Tartib muhim bo'lsa: permutatsiyalar

Uchta kitobni A, B, C deb belgilaylik. Ularni javonga `A B C` yoki `B A C` tartibida terish — ikki xil variant. Elementlarning har birini aynan bir marta ishlatadigan tartib **permutatsiya (permutation)** deyiladi.

Birinchi o'ringa uchta kitobdan birini, ikkinchisiga qolgan ikkitadan birini qo'yamiz. Oxirgisiga bitta kitob qoladi: $3\cdot2\cdot1=6$ ta tartib. Umuman, $n$ ta turli element uchun $n!$ ta permutatsiya bor. Faktorial bilan oldingi darsda tanishganmiz.

STL'dagi `next_permutation` joriy ketma-ketlikni **lug'aviy tartibdagi (lexicographic order)** keyingisiga o'zgartiradi. Bu tartibda ketma-ketliklar birinchi farq qiladigan element bo'yicha solishtiriladi: masalan, `1 3 2` ketma-ketligi `2 1 3` dan oldin keladi, chunki birinchi o'rinda $1<2$.

| Qadam | Joriy permutatsiya | Keyingi holat |
|---|---|---|
| 1 | `1 2 3` | `1 3 2` |
| 2 | `1 3 2` | `2 1 3` |
| 3 | `2 1 3` | `2 3 1` |
| 4 | `2 3 1` | `3 1 2` |
| 5 | `3 1 2` | `3 2 1` |
| 6 | `3 2 1` | Tugaydi; funksiya `false` qaytaradi |

Oxirgi holatda funksiya ketma-ketlikni eng kichik tartibga qaytaradi. Barcha variantlarni olish uchun saralangan holatdan boshlaymiz va birinchi holatni ham tekshiramiz.

Masalan, 1 dan $n$ gacha sonlarni shunday joylashtirish kerakki, yonma-yon sonlar farqining mutlaq qiymati kamida 2 bo'lsin. Shunday tartiblar sonini topamiz, $1\le n\le9$. Bu endi alohida mashq: quyidagi to'liq dastur faqat $n$ ni o'qiydi.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> order(n);
    for (int i = 0; i < n; i++) order[i] = i + 1;

    long long count = 0;
    do {
        // Joriy tartibdagi barcha qo'shnilarni tekshiramiz.
        bool valid = true;
        for (int i = 0; i + 1 < n; i++) {
            if (abs(order[i] - order[i + 1]) < 2) {
                valid = false;
                break;
            }
        }
        if (valid) count++;
    } while (next_permutation(order.begin(), order.end()));

    cout << count << '\n';
    return 0;
}
```

$n=4$ da mos tartiblar `2 4 1 3` va `3 1 4 2`; javob 2. $n=1$ da tekshiriladigan qo'shnilar yo'q, yagona tartib shartga mos va javob 1.

Har bir tartibni tekshirish va keyingisiga o'tish ko'pi bilan $O(n)$ vaqt oladi. Jami vaqt $O(n\cdot n!)$, xotira $O(n)$. $n=9$ da $9!=362\,880$, lekin $n=12$ da $12!=479\,001\,600$. Hatto tekshirish xarajatini qo'shmasdan ham o'sish juda tezligini ko'ramiz.

> [!IMPORTANT]
> Qism to'plamda "qaysilarini olamiz?", permutatsiyada "qaysi tartibda joylaymiz?" deb so'raymiz. $2^n$ va $n!$ bir xil variantlarni sanamaydi.

## Ko'p uchraydigan xatolar

### Hisoblagichni noto'g'ri tekshirish

`while (chosen[pos] == 1 && pos >= 0)` yozilsa, `pos=-1` da mavjud bo'lmagan element o'qiladi. Bu **massiv chegarasidan chiqish (out of bounds)** — massivning ruxsat etilmagan indeksiga murojaat qilish. Chegarani oldin tekshiring: `pos >= 0 && chosen[pos] == 1`.

### Bo'sh tanlovni sababsiz tashlab ketish

Bu masalada guruh bo'sh bo'lishi mumkin. Ayniqsa $n=1$ da javob aynan yagona yukning og'irligi bo'ladi. Boshqa masalada ikkala guruh bo'sh bo'lmasligi talab qilinsa, mos kelmagan tanlovlarni alohida chiqarib tashlash kerak. Sanash tartibi bilan masala shartiga moslikni ajrating.

### Permutatsiyani o'zgartirib, keyin tekshirish

`while (next_permutation(...))` tananing birinchi bajarilishidan oldin tartibni o'zgartiradi. Natijada boshlang'ich permutatsiya tekshirilmaydi. `do-while` bilan avval tekshiring, keyin o'zgartiring. Boshlang'ich massivni esa saralang; aks holda undan oldingi tartiblar qolib ketadi.

### Teng qiymatli elementlarni chalkashtirish

`[1,1,2]` qiymatlari uchun `next_permutation` uchta turli qiymatlar ketma-ketligini beradi: `112`, `121`, `211`. Agar ikkita 1 aslida alohida odamlar yoki buyumlar bo'lsa, ularning o'rnini almashtirish ham boshqa variant bo'lishi mumkin. Bunday holatda qiymatlarni emas, turli indekslarni tartiblang.

## Xulosa

- Variantni avval aniq tasvirlang: qism to'plam uchun har bir elementni olish yoki olmaslikni belgilaymiz.
- 0/1 hisoblagich bilan $2^n$ ta tanlovni rekursiya va bit amallarisiz sanash mumkin.
- Tartib muhim bo'lsa, permutatsiyalarni tekshiramiz; turli elementlarda ular $n!$ ta.
- To'liq sanashning o'zi yetmaydi: shartni to'g'ri tekshirish va javobni to'g'ri yangilash ham kerak.

**Qachon qo'llash mumkin?** Elementlar soni kichik bo'lsa, avval variantlar sonini hisoblang. So'ng har birini tekshirish qancha ish olishini baholang. Rekursiya, backtracking va bitmask darslarida tanlovlarni sanashning boshqa usullarini ko'ramiz.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Qism to'plam | Subset | Berilgan elementlardan tanlab olingan qism; bo'sh tanlov ham mumkin. |
| Mutlaq qiymat | Absolute value | Sonning ishorasiz kattaligi. |
| Permutatsiya | Permutation | Har bir element aynan bir marta qatnashadigan tartib. |
| Lug'aviy tartib | Lexicographic order | Ketma-ketliklarni birinchi farq qiladigan element bo'yicha solishtirish tartibi. |
| Massiv chegarasidan chiqish | Out of bounds | Massivda ruxsat etilmagan indeksga murojaat qilish. |

### O'zingizni tekshiring

1. `chosen = 10111` bo'lsa, keyingi tanlov qanday? Beshta elementda jami nechta tanlov bor?
2. Og'irliklar $[5,5]$ bo'lsa, eng kichik farq qancha? Birinchi guruhga faqat bitta yukni olishning nechta usuli bor?
3. $n=20$ da permutatsiyalarni sanashni ham qism to'plamlar kabi bemalol ishlatish mumkinmi?
4. `[1,1,2]` qiymatlarini va ularning uchta turli indeksini tartiblashda variantlar soni nega farq qiladi?

<details>
<summary>Javoblarni ko'rish</summary>

1. `11000`; $2^5=32$ ta tanlov bor.
2. Farq 0. Bitta yukni olishning ikki usuli bor: birinchi yoki ikkinchi yuk tanlanadi.
3. Yo'q. $2^{20}=1\,048\,576$, lekin $20!\approx2{,}43\cdot10^{18}$. Variantlar soni mutlaqo boshqa miqyosda.
4. Qiymatlar bo'yicha uchta turli ketma-ketlik bor. Indekslar turli bo'lgani uchun ularning $3!=6$ ta tartibi bor; teng qiymatli elementlar o'rnini almashtirish ham alohida hisoblanadi.

</details>
