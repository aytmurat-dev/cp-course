---
summary: "Barcha juftliklarni takrorsiz tekshirish va yechimning vaqt hamda xotira sarfini oldindan baholash."
prerequisites: []
---

## Kirish

Stolda 1, 4, 2, 3 yozilgan to'rtta kartochka bor. Yig'indisi 5 bo'ladigan ikkita kartochkani necha xil tanlash mumkin? Kartochkalar oz bo'lsa, barcha juftliklarni tekshirib javob topamiz. Bu darsda siz shu usulni kodga aylantirasiz va kartochkalar ko'payganda tekshiruvlar soni qanday o'sishini baholaysiz.

## Muammo

Sizga $n$ ta butun sondan iborat massiv va $k$ soni beriladi. Turli o'rinlarda turgan, yig'indisi $k$ ga teng elementlar juftliklari sonini toping. Juftlikdagi tartib muhim emas: birinchi va ikkinchi elementni tanlash bilan ikkinchi va birinchini tanlash bitta juftlik hisoblanadi.

Bir xil qiymatli elementlar turli o'rinlarda tursa, ular alohida elementlar. Masalan, $[2, 2, 2]$ massivida yig'indisi 4 bo'lgan uchta juftlik bor: o'rinlari $(1, 2)$, $(1, 3)$ va $(2, 3)$.

- **Kirish:** birinchi qatorda $n$ va $k$, ikkinchi qatorda massivning $n$ ta elementi.
- **Chiqish:** shartni qanoatlantiradigan juftliklar soni.
- **Cheklovlar (constraints)** — kirish qiymatlarining ruxsat etilgan chegaralari: $1 \le n \le 5000$, $-10^9 \le a_i \le 10^9$, $-2 \cdot 10^9 \le k \le 2 \cdot 10^9$.
- Vaqt chegarasi: 2 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
4 5
1 4 2 3
```

Chiqish:

```text
2
```

Mos juftliklar — qiymatlari 1 va 4 bo'lgan elementlar hamda qiymatlari 2 va 3 bo'lgan elementlar.

Eng sodda reja: birinchi elementni tanlaymiz, unga sherik bo'ladigan elementlarni tekshiramiz. Keyin keyingi elementga o'tamiz. Bu masalada shu rejaning o'zi yetarli; uni amalga oshirishdan oldin bir juftlikni ikki marta sanamaslik yo'lini aniqlaymiz.

## G'oya

### Har bir juftlikni bir marta ko'rish

Kartochkalar misoliga qaytaylik. 1 yozilgan kartochkani 4, 2, 3 bilan tekshiramiz. Keyin 4 yozilgan kartochkani faqat undan keyingi 2 va 3 bilan tekshiramiz. Uni 1 bilan yana tekshirish shart emas — bu juftlikni oldin ko'rdik.

**Har bir elementni faqat o'zidan keyingi elementlar bilan juftlaymiz.** Shunda element o'zi bilan tanlanmaydi va bir juftlik takrorlanmaydi.

Barcha mumkin bo'lgan variantlarni birma-bir tekshirish usuli **to'liq tanlash (brute force)** deyiladi. Bizda variant — ikkita turli o'rin. Uni tekshirish — shu o'rinlardagi qiymatlarni qo'shib, $k$ bilan solishtirish.

Kodda o'rinlarni 0 dan boshlab raqamlaymiz: birinchi element `a[0]`, oxirgisi `a[n - 1]`. Birinchi o'rinni $i$, ikkinchisini $j$ deb belgilasak, faqat $i < j$ bo'lgan juftliklar kerak.

1. Javob hisoblagichini noldan boshlaymiz.
2. $i$ ni 0 dan $n-1$ gacha tanlaymiz.
3. Har bir $i$ uchun $j$ ni $i+1$ dan $n-1$ gacha tanlaymiz.
4. $a_i + a_j = k$ bo'lsa, hisoblagichga bir qo'shamiz.

> [!NOTE]
> To'xtang va o'ylang: $[2, 2, 2]$ massivida ikkinchi siklni $i+1$ o'rniga $i$ dan boshlasak, nima o'zgaradi?

Har bir element o'zi bilan ham juftlanadi. Uchta haqiqiy juftlikka yana uchta noto'g'ri juftlik qo'shilib, javob 6 bo'ladi. Demak, `j = i + 1` masalaning ikki xil element tanlash talabini bajaradi.

### Nega javob to'g'ri?

Istalgan ikkita turli o'rinni olaylik. Ularning biri chaproqda, ikkinchisi o'ngroqda turadi. Tashqi sikl chapdagi o'ringa kelganda, ichki sikl o'ngdagi o'ringa albatta yetib boradi. Demak, hech bir juftlik qolib ketmaydi.

Ichki sikl faqat o'ngga yuradi, shuning uchun ayni juftlik teskari tartibda qayta ko'rilmaydi. Hisoblagich esa faqat yig'indi $k$ ga teng bo'lganda oshadi. Shu sababli barcha kerakli juftliklar aynan bir martadan sanaladi.

## Amalga oshirish

Quyidagi C++17 dastur yuqoridagi to'rtta qadamni bajaradi. Qiymatlar va yig'indi bilan hisoblash uchun `long long` ishlatamiz.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long k;
    cin >> n >> k;

    vector<long long> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    long long count = 0;
    for (int i = 0; i < n; i++) {
        // Faqat o'ngdagi elementlar: har bir juftlik bir marta.
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) {
                count++;
            }
        }
    }

    cout << count << '\n';
    return 0;
}
```

- `j = i + 1` o'zini o'zi tanlash va takror sanashning oldini oladi.
- `j < n` 0 dan boshlangan indekslashga mos: `a[n]` degan element yo'q.
- $n=1$ bo'lsa, ichki sikl ishlamaydi. Javob 0 bo'ladi, alohida shart yozish kerak emas.

## Misol

$a = [1, 4, 2, 3]$ va $k=5$ uchun dastur bajaradigan barcha tekshiruvlarni yozamiz. Jadvaldagi indekslar koddagidek 0 dan boshlanadi.

| $i$ | $j$ | $a_i + a_j$ | Yig'indi 5 ga tengmi? | Tekshiruvdan keyingi `count` |
|---|---|---|---|---|
| 0 | 1 | $1+4=5$ | Ha | 1 |
| 0 | 2 | $1+2=3$ | Yo'q | 1 |
| 0 | 3 | $1+3=4$ | Yo'q | 1 |
| 1 | 2 | $4+2=6$ | Yo'q | 1 |
| 1 | 3 | $4+3=7$ | Yo'q | 1 |
| 2 | 3 | $2+3=5$ | Ha | 2 |

$i=3$ bo'lganda o'ngda element qolmaydi. Jami oltita juftlik tekshirildi, ulardan ikkitasi mos keldi. Dastur 2 chiqaradi.

## Murakkablik

### Tekshiruvlar sonidan Big-O ga

To'rtta elementda $3+2+1=6$ ta juftlikni tekshirdik. Beshta elementda $4+3+2+1=10$ ta tekshiruv bo'ladi. Umuman, $n$ ta element uchun bu son:

$$
\frac{n(n-1)}{2} = \frac{n^2-n}{2}.
$$

Har bir juftlikda bitta yig'indi va taqqoslash bor. Bu yerda "tekshiruv" kompyuterning bitta buyrug'i degani emas, lekin ish hajmini baholash uchun qulay birlik.

Kirish hajmi oshganda bajariladigan ish miqdori qanday o'sishi **vaqt murakkabligi (time complexity)** deyiladi. Juftliklar sonida $n^2$ hadi ustun: $n$ katta bo'lganda uni ikki baravar oshirish ishni taxminan to'rt baravar oshiradi.

**Big-O belgilash (Big-O notation)** o'sish uchun yuqori chegara beradi: yetarlicha katta $n$ da ish miqdori ko'rsatilgan funksiyaning biror o'zgarmas karrasidan oshmaydi. Biz odatda algoritm o'sishini yaqindan ifodalovchi bahoni tanlaymiz. Shu algoritm uchun $O(n^2)$ deb yozamiz.

Quyidagi kabi yig'indi va darajali ifodalarda eng tez o'sadigan hadni qoldirib, o'zgarmas ko'paytuvchini olib tashlash mumkin:

| Ish miqdori | Odatda yoziladigan baho | Misol |
|---|---|---|
| $7$ | $O(1)$ | Tayyor massivning bitta elementini olish |
| $3n+2$ | $O(n)$ | Massivni bir marta ko'rib chiqish |
| $(n^2-n)/2$ | $O(n^2)$ | Barcha juftliklarni tekshirish |
| $n^3$ | $O(n^3)$ | Har biri $n$ marta ishlaydigan uchta ichma-ich sikl |

$O(1)$ aynan bitta amal degani emas; ish miqdori $n$ oshishiga bog'liq emasligini bildiradi. $O(n)$ bo'lgan ikkita dastur ham amalda turli tezlikda ishlashi mumkin.

### Cheklovlarda tekshirish

Bizning masalada eng katta $n=5000$. Shunda $5000 \cdot 4999 / 2 = 12\,497\,500$ ta juftlik tekshiriladi. Har bir tekshiruv sodda bo'lgani uchun bu yechimni berilgan vaqt chegarasida sinab ko'rish asosli.

$n=200\,000$ bo'lsa, tekshiruvlar soni $19\,999\,900\,000$ taga yetadi. Xuddi shu kod odatiy bir necha soniyalik chegaralar uchun juda ko'p ish bajaradi. Demak, brute force'ning yaroqliligi masala cheklovlariga bog'liq.

> [!IMPORTANT]
> $10^8$ ta sodda amal/soniya — faqat qo'pol mo'ljal. Protsessor, kompilyator va sikl ichidagi ish natijaga ta'sir qiladi. Shu songa bo'lib aniq vaqt aytmang; chegaraga yaqin yechimni o'lchab ko'rish kerak.

Quyidagi jadval turli o'sishlarni taqqoslashga yordam beradi. Bu "albatta vaqtga sig'adi" jadvali emas.

| Ish miqdori modeli | Misol hajm | Taxminiy miqdor |
|---|---|---|
| $n$ | $10^6$ | $10^6$ |
| $n\log_2 n$ | $2\cdot10^5$ | $3{,}5\cdot10^6$ |
| $n^2$ | $5000$ | $2{,}5\cdot10^7$ |
| $n^3$ | $500$ | $1{,}25\cdot10^8$ |
| $2^n$ | $20$ | $1\,048\,576$ |
| $n!$ | $10$ | $3\,628\,800$ |

Masalan, $8\to4\to2\to1$ ketma-ketligida sonni uch marta ikkiga bo'ldik: $\log_2 8=3$. **Ikkilik logarifm (binary logarithm)** — 2 ni qaysi darajaga ko'targanda berilgan son chiqishini ko'rsatadi. Sonni qayta-qayta ikkiga bo'ladigan algoritmlarda shu o'sish uchraydi.

Yana bir misol: $4!=1\cdot2\cdot3\cdot4=24$. **Faktorial (factorial)** — 1 dan berilgan musbat butun songacha bo'lgan sonlarning ko'paytmasi. Bu o'sishlar boshqa darslarda uchraydi; hozir ularning miqyosi turlicha ekanini ko'rish yetarli.

Agar har bir variantni tekshirishning o'zi $n$ qadam olsa, variantlar sonini yana $n$ ga ko'paytiramiz. Masalan, $2^n$ ta variantning har biriga $n$ qadam sarflansa, vaqt $O(n2^n)$ bo'ladi. Bir nechta test bo'lsa, ularning jami ishini ham hisobga olish kerak.

### Xotirani hisoblash

Dastur $n$ ta elementli massiv saqlaydi. Elementlar ikki baravar ko'paysa, massiv uchun kerakli xotira ham ikki baravar oshadi. Kirish hajmi oshganda ishlatiladigan xotira qanday o'sishi **xotira murakkabligi (space complexity)** deyiladi.

Bizda jami xotira $O(n)$. Massivdan tashqari bir nechta o'zgaruvchi bor — qo'shimcha xotira $O(1)$. Odatdagi musobaqa muhitida `long long` 8 bayt egallaydi. $5000$ ta elementning o'zi $40\,000$ bayt, taxminan 40 KB bo'ladi. Juftliklarni alohida saqlamaymiz: tekshiramiz va keyingisiga o'tamiz.

## Ko'p uchraydigan xatolar

### Bir juftlikni ikki marta sanash

`j = 0` dan boshlash $(0,1)$ va $(1,0)$ ni alohida tekshiradi, o'zini o'zi tanlashga ham yo'l ochadi. Javobni shunchaki ikkiga bo'lish ikkinchi muammoni tuzatmaydi. To'g'risi — boshidanoq `j = i + 1` ishlatish.

### Qiymatlar bilan o'rinlarni adashtirish

Massivni `set` ga aylantirsak, $[2,2,2]$ dagi uchta elementdan bitta qiymat qoladi. Natijada uchta haqiqiy juftlik yo'qoladi. Bu masalada o'rinlar turlicha bo'lishi kerak; qiymatlar teng bo'lishi mumkin.

### Son turi chegarasini tekshirmaslik

Odatdagi 32 bitli `int` ning eng katta qiymati $2\,147\,483\,647$. Masalan, $2\cdot10^9+2\cdot10^9=4\cdot10^9$ unga sig'maydi. Hisob natijasi tanlangan son turiga sig'masligi **to'lib ketish (overflow)** deyiladi. Bizning masalamizning ayni cheklovlarida yig'indi va javob `int` ga sig'adi, lekin cheklovlar kengaysa, bu holat o'zgaradi.

> [!WARNING]
> `int` elementlar uchun `long long sum = a[i] + a[j];` yozish qo'shishdagi to'lib ketishdan himoya qilmaydi: qo'shish avval `int` da bajariladi. `1LL * a[i] + a[j]` yozing yoki bizning koddagidek elementlarni `long long` da saqlang. C++ da ishorali butun sonning to'lib ketishi ishonchli natija bermaydi.

### Sikllarni faqat sanab xulosa qilish

Ketma-ket turgan ikkita $n$ qadamli sikl jami $2n$ qadam, ya'ni $O(n)$ vaqt oladi. Ichma-ich sikllarda esa ichki sikl necha marta qayta bajarilishini hisoblaymiz. Tashqi sikl $n$, ichki sikl doim 10 marta ishlasa, $10n$ qadam — bu ham $O(n)$.

## Xulosa

- Brute force yozishda variant nimadan iboratligini va uni qanday tekshirishni aniq belgilang.
- To'g'rilik uchun barcha kerakli variantlar ko'rilishini, ortiqchasi sanalmasligini asoslang.
- Vaqtni baholashda variantlar soni bilan bitta variantni tekshirish ishini birga hisoblang.
- Big-O o'sishni ifodalaydi. Amaliy yaroqlilikni baholash uchun cheklovlar, son turlari va xotirani ham tekshiring.

**Qachon bu usulni o'ylab ko'rish kerak?** Mumkin bo'lgan tanlovlar soni oz bo'lsa yoki ularni tekshirish arzon bo'lsa. "Barcha juftliklar" kabi talablar yaxshi ishora, ammo oxirgi qarorni hisob-kitob beradi. Keyingi darsda tanlov ikki element bilan cheklanmagan holatlarni ko'ramiz.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Cheklovlar | Constraints | Kirish qiymatlarining masalada ruxsat etilgan chegaralari. |
| To'liq tanlash | Brute force | Barcha mumkin bo'lgan variantlarni birma-bir tekshirish usuli. |
| Vaqt murakkabligi | Time complexity | Kirish hajmiga qarab bajariladigan ish miqdorining o'sishi. |
| Big-O belgilash | Big-O notation | Yetarlicha katta kirishlarda o'sishning yuqori chegarasini ifodalovchi belgilash. |
| Ikkilik logarifm | Binary logarithm | 2 ni qaysi darajaga ko'targanda berilgan son chiqishini ko'rsatadi; $\log_2 8=3$. |
| Faktorial | Factorial | 1 dan berilgan musbat butun songacha bo'lgan sonlarning ko'paytmasi. |
| Xotira murakkabligi | Space complexity | Kirish hajmiga qarab ishlatiladigan xotiraning o'sishi. |
| To'lib ketish | Overflow | Hisob natijasi tanlangan son turining chegarasidan chiqishi. |

### O'zingizni tekshiring

Javoblarni ochishdan oldin har birini o'zingiz asoslang.

1. $a=[0,0,0,0]$, $k=0$ bo'lsa, dastur nima chiqaradi? Nega?
2. Bitta sikl $n$ marta, undan keyingi sikl $n^2$ marta ishlaydi. Jami vaqt murakkabligi qanday?
3. $n=500$ uchun $O(n^3)$ bahodan dastur 1 soniyaga sig'ishini qat'iy aytish mumkinmi?
4. Dastur mos juftliklar soni o'rniga kamida bitta mos juftlik borligini aniqlashi kerak bo'lsa, qayerda ertaroq to'xtash mumkin? Eng yomon holatdagi vaqt o'zgaradimi?

<details>
<summary>Javoblarni ko'rish</summary>

1. 6 chiqaradi: $4\cdot3/2=6$ ta turli o'rinlar juftligi bor. Qiymatlar tengligi elementlarni birlashtirmaydi.
2. $O(n^2)$: ishlar qo'shiladi, $n+n^2$ ichida kvadrat had ustun.
3. Yo'q. $500^3=125\,000\,000$ — ish miqyosi uchun mo'ljal. Aniq vaqt sikl ichidagi amallar va ishlash muhitiga ham bog'liq.
4. Birinchi mos juftlik topilganda to'xtash mumkin. Lekin mos juftlik umuman bo'lmasa, hammasi tekshiriladi; eng yomon holatda vaqt hamon $O(n^2)$.

</details>
