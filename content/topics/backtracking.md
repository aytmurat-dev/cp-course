---
summary: "Yechimni qadamma-qadam qurish, natija bermaydigan davomlarni kesish va tanlovdan keyin holatni tiklash."
prerequisites: [recursion, complete-search]
---

## Kirish

1, 2, 3, 4 sonlarini bir qatorga joylashtiraylik. Yonma-yon sonlarning farqi kamida 2 bo'lishi kerak bo'lsa, `1 2` deb boshlangan tartibni davom ettirishdan foyda yo'q. Qolgan sonlarni qayerga qo'ymaylik, boshidagi qo'shnilar shartni buzib turaveradi. Bu darsda siz shunday holatlarni erta to'xtatish va oldingi tanlovga qaytib, boshqasini sinashni o'rganasiz.

## Muammo

1 dan $n$ gacha bo'lgan sonlarni har biri aynan bir marta qatnashadigan qilib joylashtiring. Har bir yonma-yon juftlik farqining mutlaq qiymati kamida 2 bo'lsin. Shunday tartiblar sonini toping.

- **Kirish:** bitta butun son $n$.
- **Chiqish:** shartga mos tartiblar soni.
- **Cheklovlar:** $1\le n\le9$.
- Vaqt chegarasi: 2 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
4
```

Chiqish:

```text
2
```

Mos tartiblar `2 4 1 3` va `3 1 4 2`. Ularning har birida qo'shnilar farqi 2 yoki 3. Bitta elementli tartibda qo'shnilar yo'q, shuning uchun $n=1$ uchun javob 1.

"To'liq qidiruv" darsida shu masalani `next_permutation` orqali yechganmiz: avval butun tartibni olamiz, keyin qo'shnilarini tekshiramiz. $n=4$ da 24 ta, $n=9$ da $362\,880$ ta tartib bor. Har birini tekshirish bilan vaqt $O(n\cdot n!)$ bo'ladi. Bu cheklovlarda o'sha yechim ham yaroqli; endi to'liq tartibni qurmasdan oldin keraksiz ishni aniqlashni o'rganamiz.

## G'oya

### Qisman yechimdan boshlash

Hozircha `2 4` ni joylashtirdik deylik. Qolgan sonlar 1 va 3. Oxirgi 4 yoniga 1 ni qo'yish mumkin, chunki farq 3. Ammo 3 ni qo'yib bo'lmaydi: farq 1.

Hali tugallanmagan `2 4` kabi ketma-ketlik **qisman yechim (partial solution)** deyiladi. Uni dasturda `path` massivida saqlaymiz. Qaysi sonlar olinganini `used` massivida belgilaymiz.

Yechimni tanlovlar orqali qurish, bir davomni tekshirgach oldingi holatga qaytib boshqa davomni sinash usuli **backtracking** deyiladi. Rekursiya keyingi o'rinlarni to'ldiradi; qaytish esa boshqa tanlovga o'tishga imkon beradi.

**Yangi sonni qo'shishdan oldin u oxirgi son bilan shartni buzmasligini tekshiramiz.** Oldin qo'yilgan qo'shnilarni qayta tekshirish kerak emas: ular avvalgi qadamlarda tekshirilgan.

### Nima uchun ertaroq to'xtash mumkin?

`1 2` boshidagi farq 1. Keyin 3 va 4 ni qo'shish bu farqni o'zgartirmaydi. Demak, bu boshlanishdan hech qanday to'g'ri javob chiqmaydi. Natija bermasligi asoslangan davomni tekshirmaslik **kesish (pruning)** deyiladi.

Barcha tanlovlarni shoxlangan sxemada tasvirlash mumkin. Har bir tugun — joriy ketma-ketlik, undan chiquvchi shox — keyingi sonni qo'shish. Bu **qidiruv daraxti (search tree)** deyiladi. Quyida faqat `2` dan boshlangan qismi ko'rsatilgan:

```text
[2]
├── 1: farq 1 → qo'shmaymiz
├── 2: ishlatilgan → qo'shmaymiz
├── 3: farq 1 → qo'shmaymiz
└── 4 → [2, 4]
    ├── 1 → [2, 4, 1]
    │   └── 3 → [2, 4, 1, 3] → bitta yechim
    └── 3: farq 1 → qo'shmaymiz
```

Sxemaning keyingi qatorlarida ishlatilgan sonlarni qayta sanamadik. Dastur esa har safar 1 dan $n$ gacha nomzodlarni ko'radi va `used` orqali ularni o'tkazib yuboradi.

### Tanlashdan keyin holatni tiklash

`path = [2,4]` holatida 1 ni sinaymiz. `path` oxiriga 1 qo'shamiz va `used[1]` ni belgilaymiz. Ichki chaqiruv shu tanlov bilan mumkin bo'lgan davomlarni tekshiradi.

U qaytganda boshqa nomzodni sinashimiz kerak. Buning uchun qo'shilgan 1 ni olib tashlaymiz va `used[1]` belgisini o'chiramiz. O'zgartirilgan ma'lumotni avvalgi ko'rinishiga qaytarish **holatni tiklash (undo)** deyiladi.

> [!NOTE]
> To'xtang va o'ylang: `path` dan 1 ni o'chirib, `used[1]` ni o'chirmasak, keyingi shoxlarda nima bo'ladi?

1 ketma-ketlikda bo'lmasa ham band deb hisoblanadi. Dastur keyingi tartiblarga uni qo'sha olmaydi va ayrim yechimlar yo'qoladi. Shuning uchun tanlov o'zgartirgan ikkala ma'lumot ham tiklanishi kerak.

"Rekursiya asoslari" darsida `n` qiymat bo'yicha uzatilgani uchun har bir chaqiruvda alohida edi. Bu safar `path` va `used` barcha chaqiruvlar uchun umumiy. Funksiyadan qaytish ularni avtomatik tiklamaydi.

### Nega barcha kerakli tartiblar sanaladi?

Har bir chaqiruv boshida `path` ichidagi sonlar turli va barcha qo'shnilar shartga mos. Yangi son ishlatilmaganini hamda oxirgi son bilan farqini tekshirish shu xususiyatlarni saqlaydi. Ketma-ketlik uzunligi $n$ ga yetganda haqiqiy yechim hosil bo'ladi.

Istalgan to'g'ri tartibni olaylik. Undagi navbatdagi son ishlatilmagan bo'ladi va qo'shnilik tekshiruvidan o'tadi. Demak, dastur shu yo'lni kesmaydi va oxirigacha quradi. Har bir tartibning tanlovlar ketma-ketligi yagona, shuning uchun u bir marta sanaladi.

## Amalga oshirish

`search()` funksiyasi joriy `path` ning barcha mos davomlarini sanaydi. `used[x]` 1 bo'lsa, $x$ soni hozir ketma-ketlikda bor.

```cpp
#include <bits/stdc++.h>
using namespace std;

int n;
vector<int> path;
vector<int> used;
long long answer = 0;

void search() {
    if (static_cast<int>(path.size()) == n) {
        answer++;
        return;
    }

    for (int x = 1; x <= n; x++) {
        if (used[x]) continue;
        if (!path.empty() && abs(path.back() - x) < 2) continue;

        // Tanlaymiz: x ni joriy ketma-ketlikka qo'shamiz.
        path.push_back(x);
        used[x] = 1;

        search();

        // Qaytgach, shu tanlov o'zgartirgan holatni tiklaymiz.
        used[x] = 0;
        path.pop_back();
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> n;
    used.assign(n + 1, 0);
    path.reserve(n);

    search();
    cout << answer << '\n';
    return 0;
}
```

- `path.empty()` bo'lsa, birinchi son uchun qo'shnilik tekshiruvi kerak emas. `path.back()` faqat massiv bo'sh bo'lmaganda o'qiladi.
- `used` o'lchami $n+1$: unda 1 dan $n$ gacha bo'lgan sonlarni indeks sifatida ishlatyapmiz.
- Har bir ichki chaqiruv oldidan uzunlik birga oshadi. Ko'pi bilan $n$ ta son qo'yilgach asos holatiga yetamiz.
- `answer` tiklanmaydi: u barcha shoxlarda topilgan yechimlarning umumiy soni. Faqat joriy tanlovga tegishli `path` va `used` tiklanadi.

## Misol

$n=4$ uchun dastur nomzodlarni kichikdan kattaga sinaydi. Quyidagi jadval `2` dan boshlangan shoxdagi barcha holat o'zgarishlarini ko'rsatadi. Tekshiruvdan o'tmagan nomzodlar holatni o'zgartirmaydi.

| Qadam | Amal | `path` | Band sonlar | `answer` |
|---|---|---|---|---|
| 1 | 2 ni tanlaymiz | `[2]` | 2 | 0 |
| 2 | 1 va 3 mos emas; 4 ni tanlaymiz | `[2,4]` | 2, 4 | 0 |
| 3 | 1 ni tanlaymiz | `[2,4,1]` | 1, 2, 4 | 0 |
| 4 | 3 ni tanlaymiz | `[2,4,1,3]` | 1, 2, 3, 4 | 0 |
| 5 | Uzunlik 4: javobni oshiramiz | `[2,4,1,3]` | 1, 2, 3, 4 | 1 |
| 6 | Qaytib, 3 ni olib tashlaymiz | `[2,4,1]` | 1, 2, 4 | 1 |
| 7 | Boshqa davom yo'q; 1 ni olib tashlaymiz | `[2,4]` | 2, 4 | 1 |
| 8 | 3 ham mos emas; 4 ni olib tashlaymiz | `[2]` | 2 | 1 |
| 9 | Shox tugadi; 2 ni olib tashlaymiz | `[]` | Yo'q | 1 |

Bu shoxdan oldin 1 bilan boshlangan davomlar tekshirilgan, ularda yechim yo'q. Keyin 3 bilan boshlangan shox `3 1 4 2` yechimini beradi. 4 bilan boshlangan shoxda yechim topilmaydi. Natijada `answer = 2` bo'ladi.

9-qadamda ketma-ketlik yana bo'sh, barcha belgilar o'chirilgan. Lekin topilgan birinchi yechim hisoblagichda qolgan. Holatni tiklash bilan natijani yo'qotmaslik orasidagi farq shu.

## Murakkablik

Kesish qidiruvni kamaytirishi mumkin, ammo u har qanday masalani tez qilib bermaydi. Ish hajmi nechta qisman ketma-ketlikka kirishimizga bog'liq. Har bir tugallanmagan holatda kod $n$ ta nomzodni tekshiradi.

Qo'shnilik shartini vaqtincha olib tashlasak, uzunligi 0 bo'lgan bitta holat, uzunligi 1 bo'lgan $n$ ta, uzunligi 2 bo'lgan $n(n-1)$ ta holat bor. To'liq ketma-ketliklar soni $n!$. Barcha uzunliklardagi holatlar yig'indisi $n!$ ning o'zgarmas karrasi bilan chegaralanadi. Shuning uchun kod uchun xavfsiz yuqori baho **$O(n\cdot n!)$** bo'ladi.

$n=9$ da kesishsiz barcha uzunliklar bo'yicha $986\,410$ ta holat bor. Har biriga 9 ta tekshiruv deb ortig'i bilan baholasak, $8\,877\,690$ chiqadi. Aslida to'liq holatlarda sikl ishlamaydi va qo'shnilik sharti ko'p shoxlarni kesadi. Bu aniq soniya emas, ish hajmini baholashdir.

`path` va `used` $O(n)$ joy oladi. Bo'sh boshlang'ich holat va to'liq holat bilan birga rekursiya chuqurligi ko'pi bilan $n+1$. Har chaqiruvdagi mahalliy ma'lumot o'zgarmas hajmli, jami xotira $O(n)$.

## Variantlar

### Faqat bitta yechim kerak bo'lsa

Barcha tartiblarni sanash o'rniga bittasini topish talab qilinishi mumkin. Unda to'liq `path` ni alohida javob massiviga nusxalaymiz va funksiya `true` qaytaradi. Chaqiruvchi ham qidiruvni to'xtatadi, ammo umumiy holatni avval tiklaydi:

```cpp
// findOne() bool qaytaradigan variantdagi rekursiv qadam.
path.push_back(x);
used[x] = 1;
bool found = findOne();
used[x] = 0;
path.pop_back();
if (found) return true;
```

Bu parcha to'liq dastur emas, qaytish tartibini ko'rsatadi. Javob nusxasi alohida saqlangani uchun `path` ni tiklash uni yo'qotmaydi. Barcha yechimlarni sanash vazifasida esa birinchisidan keyin to'xtash mumkin emas.

### Yig'indi bo'yicha kesish

Musbat sonlardan yig'indisi 10 bo'lgan qism to'plam qidiraylik. Joriy yig'indi 12 bo'lsa, yana musbat son qo'shib 10 ga tushira olmaymiz. Demak, bu shoxni kesish asosli.

> [!WARNING]
> Manfiy sonlar bo'lsa, shu kesish noto'g'ri bo'lishi mumkin: 12 ga keyin $-2$ qo'shilsa, 10 hosil bo'ladi. Har bir kesish qoidasi masala cheklovlari bilan asoslanishi kerak.

Yig'indi `sum` parametri orqali qiymat bo'yicha uzatilsa, `go(i + 1, sum + a[i])` chaqiruvi tashqi `sum` ni o'zgartirmaydi. Uni alohida ayirib tiklash kerak emas. Ammo tanlangan elementlar umumiy massivga qo'shilsa, o'sha massivni tiklash kerak.

## Ko'p uchraydigan xatolar

### Rekursiyadan qaytishni holat tiklanishi deb o'ylash

`search()` tugashi umumiy massivlarga kiritilgan o'zgarishlarni bekor qilmaydi. `push_back` ga mos `pop_back`, `used[x] = 1` ga mos `used[x] = 0` bo'lishi kerak. Har bir shoxdan keyin aynan kirishdagi holat tiklanganini tekshiring.

### Shartni to'liq asoslamasdan kesish

"Bu boshlanish yomon ko'rinyapti" yetarli sabab emas. Undan hech qanday kerakli javob chiqmasligini ko'rsata olish kerak. Bizning masalada buzilgan qo'shnilar o'z joyida qoladi, shuning uchun keyingi tanlov ularni tuzata olmaydi.

### Natijani ham bekor qilish

`answer++` dan keyin qaytishda `answer--` qilish topilgan yechimni yo'qotadi. Hisoblagich umumiy natija, vaqtinchalik tanlov emas. Qaysi o'zgaruvchi qidiruv holati, qaysisi natija ekanini oldindan ajrating.

### Kesish bo'lmasa, usul noto'g'ri deb o'ylash

Tekshiruvni faqat to'liq ketma-ketlikda qilish ham to'g'ri javob berishi mumkin. Bunda ko'proq variant quriladi. Backtracking tanlovdan qaytib boshqasini sinashni tashkil qiladi; erta kesish esa imkon bo'lganda ishni kamaytiradi.

## Xulosa

- Qisman yechim va foydalanilgan tanlovlarni aniq saqlang.
- Yangi tanlov mos bo'lsa, uni qo'shib rekursiyaga o'ting.
- Qaytganda umumiy holatga kiritilgan o'zgarishlarni tiklang.
- Faqat kerakli yechimga olib bormasligi asoslangan shoxlarni kesing.
- Tezlikni baholaganda ko'riladigan holatlar va har biridagi ishni birga hisoblang.

**Qachon bu usulni o'ylab ko'rish kerak?** Javob ketma-ket tanlovlardan tuzilsa va tanlovlarning mosligini qurish davomida tekshirish mumkin bo'lsa. Tartiblar, joylashtirishlar va qism to'plamlar shunday masalalarga misol bo'ladi. Elementlar sonining kichikligi yordam beradi, lekin hisob-kitob o'rnini bosmaydi.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Qisman yechim | Partial solution | Hali tugallanmagan, hozirgacha tanlangan qismlar. |
| Backtracking | Backtracking | Tanlovni davom ettirib, keyin oldingi holatga qaytib boshqa tanlovni sinash usuli. |
| Kesish | Pruning | Kerakli natija bermasligi asoslangan davomni tekshirmaslik. |
| Qidiruv daraxti | Search tree | Qisman yechimlar va ulardan keyingi tanlovlarni ko'rsatadigan shoxlangan tuzilma. |
| Holatni tiklash | Undo | Vaqtinchalik tanlov kiritgan o'zgarishlarni bekor qilish. |

### O'zingizni tekshiring

1. `path = [3,1]`, $n=4$ bo'lsa, keyingi son sifatida qaysi sonni qo'shish mumkin?
2. Nega `answer` tiklanmaydi, lekin `used[x]` tiklanadi?
3. $n=2$ uchun nechta yechim bor? $n=1$ uchun-chi?
4. Qism to'plam yig'indisi maqsaddan oshgan shoxni kesish uchun sonlar musbat bo'lishi shartmi yoki manfiy bo'lmasligi yetarlimi?

<details>
<summary>Javoblarni ko'rish</summary>

1. Faqat 4. 1 va 3 ishlatilgan, 2 bilan oxirgi 1 ning farqi esa 1.
2. `answer` barcha shoxlarning natijasini yig'adi. `used[x]` faqat joriy yo'lda $x$ tanlanganini bildiradi; boshqa yo'lga o'tganda belgi o'chiriladi.
3. $n=2$ uchun 0: ikkala tartibda ham farq 1. $n=1$ uchun 1: tekshiriladigan qo'shnilar yo'q.
4. Manfiy bo'lmasligi yetarli: 0 qo'shish yig'indini kamaytirmaydi. Ammo yig'indi maqsadga tenglashganda darhol qaytish boshqa qoida — nollar bor bo'lsa, u ayrim qo'shimcha qism to'plamlarni o'tkazib yuborishi mumkin.

</details>
