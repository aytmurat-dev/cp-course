---
summary: "Qiymatlarning uchrash sonini oldindan sanash, so'rovlarga javob berish va qiymatlar diapazonini baholash."
prerequisites: [brute-force]
---

## Kirish

Ro'yxatda 3, 1, 3, 5, 1, 3, 2 sonlari turibdi. "Nechta 3 bor?" degan savolga ularni birma-bir sanab, 3 deb javob beramiz. Lekin yana minglab shunday savol berilsa, har safar boshidan sanash ortiqcha ish bo'ladi. Bu darsda har bir qiymatning sonini bir marta hisoblab, keyingi savollarga tayyor jadvaldan javob olishni o'rganasiz.

## Muammo

$n$ ta butun son berilgan. Keyin $q$ ta savol keladi: berilgan $x$ qiymati shu sonlar orasida necha marta uchraydi? Dastur javob berishi kerak bo'lgan bunday alohida savol **so'rov (query)** deyiladi. So'rovlar davomida boshlang'ich sonlar o'zgarmaydi.

- **Kirish:** birinchi qatorda $n$ va $q$, ikkinchi qatorda $n$ ta qiymat, uchinchi qatorda $q$ ta so'rov qiymati.
- **Chiqish:** har bir so'rovga alohida qatorda uning javobi.
- **Cheklovlar:** $1\le n,q\le2\cdot10^5$, $0\le a_i,x_j\le10^6$.
- Vaqt chegarasi: 2 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
7 3
3 1 3 5 1 3 2
3 4 1
```

Chiqish:

```text
3
0
2
```

3 uch marta, 1 ikki marta uchraydi. 4 esa yo'q, shuning uchun uning javobi 0.

Eng sodda usul — har bir so'rovda boshlang'ich massivning barcha elementlarini tekshirish. Har safar $n$ ta taqqoslash, jami $nq$ ta taqqoslash bajariladi. Eng katta chegaralarda bu $200\,000\cdot200\,000=40\,000\,000\,000$ ta tekshiruv. "Brute force va Big-O" darsidagi kabi, ish miqdorini baholaymiz: bir xil ma'lumotni ko'p marta qayta ko'rish odatiy vaqt chegaralari uchun juda qimmat.

## G'oya

### Har bir qiymatga alohida katak

Ro'yxatdagi birinchi 3 ni ko'rganimizda "3" katagiga 1 yozamiz. Keyingi 1 uchun "1" katagiga 1 yozamiz. Yana 3 kelsa, uning katagidagi sonni 2 ga oshiramiz.

Oxirida quyidagi jadval hosil bo'ladi:

| Qiymat | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Necha marta uchradi? | 0 | 2 | 1 | 3 | 0 | 1 |

Qiymatning necha marta uchrashi uning **chastotasi (frequency)** deyiladi. Jadvalni massivda saqlasak, **chastota massivi (frequency array)** hosil bo'ladi: `freq[v]` ichida $v$ qiymatining chastotasi turadi.

**Elementning qiymatini indeks sifatida ishlatamiz, shu indeksdagi katakda esa uning uchrash sonini saqlaymiz.** Masalan, `freq[3] = 3`, `freq[1] = 2`. Boshlang'ich massivdagi uchinchi elementni olish bilan 3 qiymatining chastotasini olish boshqa-boshqa ishlar.

### Qaysi o'lcham kerak?

Bitta elementimiz bor va uning qiymati $10^6$ bo'lsin. Chastotasi atigi 1, lekin `freq[1000000]` katagi baribir kerak. Demak, chastota massivi uzunligini elementlar soni $n$ belgilamaydi.

Qiymatlar kirishi mumkin bo'lgan oraliq **qiymatlar diapazoni (value range)** deyiladi. Bizda u 0 dan $V=10^6$ gacha. Ikkala chet ham kirgani uchun $V+1$ ta katak yaratamiz.

1. `freq` massivining barcha kataklarini 0 qilamiz.
2. Har bir o'qilgan `value` uchun `freq[value]++` bajaramiz.
3. Har bir so'rov $x$ uchun `freq[x]` ni chiqaramiz.

> [!NOTE]
> To'xtang va o'ylang: massivda umuman uchramagan 4 qiymati haqida so'ralsa, uni alohida qidirish kerakmi?

Yo'q. `freq[4]` boshida 0 edi va hech kim uni oshirmadi. Tayyor javob shu katakda turibdi. Bu faqat 4 ruxsat etilgan indekslar oralig'ida bo'lgani uchun xavfsiz; diapazondan tashqaridagi indeksni o'qish mumkin emas.

### Nega sanash to'g'ri?

Boshida hech qanday element o'qilmagan, hamma chastotalar 0. Navbatdagi qiymat $v$ bo'lsa, faqat `freq[v]` bittaga oshadi. Boshqa qiymatlarning soni o'zgarmaydi.

Shunday qilib, har bir qadamdan keyin jadval o'qilgan elementlarning aniq chastotalarini saqlaydi. Barcha $n$ ta element o'qilgach, u butun massiv uchun to'g'ri bo'ladi. So'rovga javob berish yangi hisob emas, shu jadvaldan o'qishdir.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    cin >> n >> q;

    const int MAX_VALUE = 1000000;
    vector<int> freq(MAX_VALUE + 1, 0);

    // Har bir qiymat kelganda uning hisoblagichini oshiramiz.
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        freq[value]++;
    }

    // Jadval tayyor: har bir so'rov bitta katakdan olinadi.
    for (int i = 0; i < q; i++) {
        int x;
        cin >> x;
        cout << freq[x] << '\n';
    }

    return 0;
}
```

- `vector<int> freq(MAX_VALUE + 1, 0)` barcha kataklarni aniq 0 bilan boshlaydi.
- Boshlang'ich massivni saqlamaymiz: qiymat o'qilishi bilan hisobga qo'shiladi.
- Chastota ko'pi bilan $n=200\,000$, shu sababli odatdagi musobaqa muhitidagi `int` yetarli.
- Elementlar ham, so'rovlar ham 0–$10^6$ oralig'ida ekani shartda kafolatlangan. Kod shu kafolatga tayanadi.

## Misol

$a=[3,1,3,5,1,3,2]$ uchun jadvalning 1–5 kataklarini kuzataylik. 0-katak bu misolda o'zgarmaydi.

| Qadam | O'qilgan qiymat | `freq[1]` | `freq[2]` | `freq[3]` | `freq[4]` | `freq[5]` |
|---|---|---|---|---|---|---|
| Boshi | — | 0 | 0 | 0 | 0 | 0 |
| 1 | 3 | 0 | 0 | 1 | 0 | 0 |
| 2 | 1 | 1 | 0 | 1 | 0 | 0 |
| 3 | 3 | 1 | 0 | 2 | 0 | 0 |
| 4 | 5 | 1 | 0 | 2 | 0 | 1 |
| 5 | 1 | 2 | 0 | 2 | 0 | 1 |
| 6 | 3 | 2 | 0 | 3 | 0 | 1 |
| 7 | 2 | 2 | 1 | 3 | 0 | 1 |

Har bir qatorda faqat o'qilgan qiymatning katagi oshadi. Oxirgi chastotalar yig'indisi $2+1+3+0+1=7$, ya'ni elementlar soniga teng. Bu sanashni qo'lda tekshirish uchun ham foydali belgi.

Endi 3 so'roviga `freq[3] = 3`, 4 so'roviga `freq[4] = 0`, 1 so'roviga `freq[1] = 2` chiqaramiz. Bir xil so'rov yana kelsa, javob yana shu katakdan olinadi.

## Murakkablik

0 dan $V$ gacha kataklarni yaratish va nollash $O(V+1)$ vaqt oladi. Elementlarni sanash $O(n)$, $q$ ta so'rovga javob berish $O(q)$. Umumiy vaqt **$O(V+n+q)$**, xotira $O(V+1)$.

Jadval tayyor bo'lgandan keyin bitta so'rov $O(1)$ vaqt oladi. Bu butun dasturning murakkabligi $O(1)$ degani emas: tayyorlash xarajatini ham hisoblaymiz.

Bizning chegaralarda taxminan bir million katak nollanadi, ikki yuz ming chastota oshiriladi va ikki yuz ming javob o'qiladi. Bu oldingi usuldagi 40 milliard taqqoslashdan ancha kam ish. Aniq soniyalar esa ishlash muhitiga bog'liq.

Odatdagi 4 baytli `int` muhitida $1\,000\,001$ ta katak $4\,000\,004$ bayt, taxminan 4 MB oladi. Ammo $V=10^9$ bo'lsa, shu usulning massiviga taxminan 4 GB kerak bo'ladi. Tanlovni faqat $n$ emas, qiymatlar diapazoni va jami xotira chegarasi belgilaydi.

## Variantlar

### Turli qiymatlar va eng ko'p uchragan qiymat

Misolimizda 1, 2, 3, 5 uchragan — to'rtta turli qiymat. Demak, chastotasi musbat kataklarni sanash yetarli. Eng ko'p uchragan qiymat **moda (mode)** deyiladi; bu yerda u 3.

Quyidagi parcha tayyor `freq` uchun turli qiymatlar sonini va chastotasi eng katta qiymatni topadi. Chastotalar teng bo'lsa, eng kichik qiymatni tanlaymiz:

```cpp
int distinct = 0;
int mode = 0;
for (int v = 0; v <= MAX_VALUE; v++) {
    if (freq[v] > 0) distinct++;
    if (freq[v] > freq[mode]) mode = v;
}
```

Qiymatlarni kichikdan kattaga ko'rib, faqat qat'iy katta chastotada javobni almashtiryapmiz. Shuning uchun tenglikda kichik qiymat qoladi. Bizda $n\ge1$, demak kamida bitta qiymat uchragan. Qo'shimcha ko'rib chiqish $O(V+1)$ vaqt oladi.

### Manfiy qiymatlar

Qiymatlar $-2$ dan 2 gacha bo'lsin. Ularni 0–4 indekslarga o'tkazish uchun har biriga 2 qo'shamiz: $-2\to0$, $-1\to1$, $0\to2$, $1\to3$, $2\to4$. Indeksni shunday ko'chirish **siljitish (offset)** deyiladi.

Umuman, $L\le value\le R$ bo'lsa, indeks `value - L`, kataklar soni esa $R-L+1$. Masalan, $-100000$ dan $100000$ gacha oraliqda:

```cpp
const int LOW = -100000;
const int HIGH = 100000;
vector<int> freq(HIGH - LOW + 1, 0);

// value va x shu oraliqda ekani kafolatlangan.
freq[value - LOW]++;
cout << freq[x - LOW] << '\n';
```

Bu asosiy koddagi sanash va so'rovga javob berish qatorlarining moslashtirilgan ko'rinishi. Katta chegaralarda `R-L+1` hisobining o'zi ham tanlangan turga sig'ishini tekshirish kerak.

### Keng diapazonda `map`

Qiymatlar 1 va $10^9$ bo'lsa, oradagi hamma sonlar uchun katak ajratish shart emas. Siz biladigan `map` faqat kiritilgan kalitlarni saqlaydi. Sanashda `freq[value]++` ishlatamiz; so'rov paytida mavjud bo'lmagan kalitni qo'shmaslik uchun `find` ishlatish mumkin:

```cpp
map<long long, int> freq;

// Har bir o'qilgan value uchun:
freq[value]++;

// Har bir x so'rovi uchun:
auto it = freq.find(x);
cout << (it == freq.end() ? 0 : it->second) << '\n';
```

Bu parcha ma'lumot tuzilmasi va uning amallarini ko'rsatadi, to'liq dastur emas. Turli qiymatlar soni $D$ bo'lsa, xotira $O(D)$, umumiy vaqt $O((n+q)\log(D+1))$ deb baholanadi. Massiv bilan `map` orasida tanlashda tezlik bilan birga ajratiladigan xotirani ham solishtiring.

### Chastotalardan saralangan ro'yxat olish

Har bir qiymatni kichikdan kattaga qarab, chastotasicha marta chiqarsak, saralangan qiymatlar hosil bo'ladi. Bu **sanab saralash (counting sort)** g'oyasining butun sonlar uchun sodda ko'rinishi:

```cpp
for (int v = 0; v <= MAX_VALUE; v++) {
    for (int times = 0; times < freq[v]; times++) {
        cout << v << ' ';
    }
}
```

Misolimizdan `1 1 2 3 3 3 5` chiqadi. Ichki sikllar jami $n$ marta ishlaydi, chunki chastotalar yig'indisi $n$. Tayyor jadvaldan chiqarish $O(V+n)$ vaqt oladi. Diapazon katta bo'lsa, `sort` qulayroq bo'lishi mumkin.

## Ko'p uchraydigan xatolar

### Massivni $n$ o'lchamda yaratish

`vector<int> freq(n)` faqat qiymatlar 0–$n-1$ oralig'ida bo'lsa yetadi. Bizda $n=1$ bo'lsa ham qiymat $10^6$ bo'lishi mumkin. Massiv o'lchamini qiymatlar chegarasidan oling va oxirgi indeks uchun bitta qo'shishni unutmang.

### Diapazondan tashqari so'rovni o'qish

Bizning masalada so'rovlar ham ruxsat etilgan oraliqda. Boshqa masalada bu kafolat bo'lmasa, `freq[x]` dan oldin chegarani tekshirish kerak. Boshlang'ich qiymatlar 0–$V$ bilan cheklangan bo'lsa, bu oraliqdan tashqaridagi so'rovga javob 0 bo'ladi.

### Chastota massivida tartib ham saqlanadi deb o'ylash

$[1,2,1]$ va $[1,1,2]$ uchun chastotalar bir xil. Demak, chastota massividan elementlarning boshlang'ich o'rnini tiklab bo'lmaydi. Masala indekslar yoki yonma-yon elementlar haqida so'rasa, qo'shimcha ma'lumot kerak bo'lishi mumkin.

### Testlar orasida eski sanashni qoldirish

Bir nechta test bo'lsa, har bir test uchun chastotalar yangidan boshlanishi kerak. Butun jadvalni nollashning o'zi har testda $O(V+1)$ ish oladi. Testlar ko'p va har birida elementlar oz bo'lsa, bu xarajatni ham qo'shing.

> [!WARNING]
> Masalan, $10^4$ ta testda har safar $10^6$ katakni tozalash taxminan $10^{10}$ ta katakka yozish demakdir. Zarur bo'lsa, ishlatilgan qiymatlarni eslab qolib, faqat ularning kataklarini 0 ga qaytaring. Buning uchun qo'shimcha ro'yxat saqlanishini ham hisobga oling.

## Xulosa

- `freq[v]` qiymatning o'rnini emas, necha marta uchrashini saqlaydi.
- Qiymat kelganda uning katagini bittaga oshiramiz; so'rovga tayyor katakdan javob beramiz.
- Jadval o'lchami qiymatlar diapazoniga, katak turi esa eng katta chastotaga bog'liq.
- Umumiy vaqtga jadvalni yaratish va nollashni ham qo'shing.
- Diapazon juda keng bo'lsa, faqat uchragan qiymatlarni saqlaydigan `map` ni ko'rib chiqing.

**Qachon kerak?** "Necha marta uchraydi?", "nechta turli qiymat bor?" yoki "eng ko'p qaysi qiymat uchraydi?" kabi savollarda. Keyingi darsda shu sanash g'oyasini sonlar o'rniga harflarga qo'llaymiz.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| So'rov | Query | Dastur javob berishi kerak bo'lgan alohida savol. |
| Chastota | Frequency | Qiymatning necha marta uchrashi. |
| Chastota massivi | Frequency array | Qiymat indeksida uning uchrash sonini saqlaydigan massiv. |
| Qiymatlar diapazoni | Value range | Qiymatlar kirishi mumkin bo'lgan oraliq. |
| Moda | Mode | Eng ko'p uchraydigan qiymat. |
| Siljitish | Offset | Qiymatlarni ruxsat etilgan indekslarga o'tkazish uchun bir xil miqdorga ko'chirish. |
| Sanab saralash | Counting sort | Chastotalardan foydalanib qiymatlarni tartiblash usuli. |

### O'zingizni tekshiring

1. $n=3$, qiymatlar $[0,1000000,0]$. `freq[0]` va `freq[1000000]` nechaga teng? Nechta katak kerak?
2. $[4,2,4,2]$ uchun yuqoridagi moda kodi qaysi qiymatni tanlaydi?
3. $-50\le value\le50$ bo'lsa, 0 va 50 qaysi indekslarga o'tadi? Jadval uzunligi qancha?
4. Jadvalni nollashni hisobga olsak, umumiy vaqtni nega faqat $O(n+q)$ deb yozmaymiz?

<details>
<summary>Javoblarni ko'rish</summary>

1. Mos ravishda 2 va 1. To'g'ridan-to'g'ri qiymatni indeks qiladigan jadvalga $1\,000\,001$ ta katak kerak.
2. 2 ni. Ikkala chastota ham 2, lekin kichik qiymat avval uchraydi va tenglikda almashtirilmaydi.
3. `value + 50` ishlatiladi: 0 → 50, 50 → 100. Jadval uzunligi 101.
4. $V+1$ katakni tayyorlash ham vaqt oladi. $V$ o'zgaruvchi chegara sifatida qaralganda umumiy baho $O(V+n+q)$ bo'ladi.

</details>
