---
summary: "Funksiya o'zini o'zi chaqirishi: asos holati, rekursiv qadam va chaqiruvlar steki."
prerequisites: [brute-force]
---

## Kirish

Ba'zi masalalarni sikl bilan yozish juda qiyin. Lekin ularga "katta masala — xuddi shu masala, faqat kichikroq" deb qarasak, yechim bir necha qatorga tushadi. Funksiyaning o'zini o'zi chaqirishi **rekursiya (recursion)** deyiladi. Rekursiya backtracking, graf bo'ylab yurishlar va dinamik dasturlashning poydevori. Bu darsdan keyin siz rekursiv funksiya yoza olasiz, uning to'xtash shartini topasiz va chaqiruvlar sonini hisoblay olasiz.

## Muammo

**Hanoi minoralari.** Uchta qoziq bor: 1, 2 va 3. 1-qoziqda $n$ ta disk turibdi: pastda eng kattasi, tepada eng kichigi. Barcha disklarni 3-qoziqqa o'tkazish kerak. Qoidalar:

- bir yurishda faqat bitta diskni, eng tepadagisini olish mumkin;
- katta diskni kichik disk ustiga qo'yib bo'lmaydi.

**Kirish:** bitta son $n$ ($1 \le n \le 20$).
**Chiqish:** eng kam yurishlar soni $k$, keyin $k$ ta qatorda yurishlar: `a b` — diskni $a$ qoziqdan $b$ qoziqqa o'tkazish.

```text
Kirish:     Chiqish:
2           3
            1 2
            1 3
            2 3
```

Birinchi urinish — kichik $n$ uchun yurishlarni qo'lda topib, dasturga yozib qo'yish:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n == 1) {
        cout << "1\n1 3\n";
    } else if (n == 2) {
        cout << "3\n1 2\n1 3\n2 3\n";
    } else if (n == 3) {
        cout << "7\n1 3\n1 2\n3 2\n1 3\n2 1\n2 3\n1 3\n";
    }
    // n = 4, 5, ..., 20 uchun-chi?
}
```

Bu yo'l tezda sinadi. Yurishlar soni har safar deyarli ikki barobar ortadi: 1, 3, 7, 15, … $n = 20$ da $1\,048\,575$ ta yurish kerak — ularni qo'lda yozib bo'lmaydi. Oddiy sikl ham yordam bermaydi: yurishlarda ko'zga tashlanadigan sodda naqsh yo'q. Bizga istalgan $n$ uchun yurishlarni o'zi "ishlab chiqaradigan" usul kerak.

## G'oya

### Kichik misoldan boshlaylik

$4! = 4 \cdot 3 \cdot 2 \cdot 1 = 24$ ni hisoblaylik. E'tibor bering: $3 \cdot 2 \cdot 1$ — bu $3!$ ning o'zi. Demak, $4! = 4 \cdot 3!$. Xuddi shunday $3! = 3 \cdot 2!$, $2! = 2 \cdot 1!$, $1! = 1$.

| $n$ | $n!$ | qanday topildi |
|---|---|---|
| 1 | 1 | to'g'ridan-to'g'ri |
| 2 | 2 | $2 \cdot 1!$ |
| 3 | 6 | $3 \cdot 2!$ |
| 4 | 24 | $4 \cdot 3!$ |

Umumiy holda $n! = n \cdot (n-1)!$. Buni kodga to'g'ridan-to'g'ri ko'chiramiz:

```cpp
long long fact(int n) {
    if (n <= 1) return 1;        // asos holati
    return n * fact(n - 1);      // rekursiv qadam
}
```

Funksiya ikki qismdan iborat. **Asos holati (base case)** — javobi darhol ma'lum bo'lgan, funksiya o'zini chaqirmaydigan holat. **Rekursiv qadam (recursive step)** — funksiya o'zini kichikroq argument bilan chaqiradigan qism. `long long` tanlanganiga e'tibor bering: $13! \approx 6 \cdot 10^9$, u `int` ga sig'maydi.

Asosiy qoida: **har bir rekursiv funksiyada asos holati bo'lishi va har bir chaqiruv unga yaqinlashishi shart.**

### Chaqiruvlar steki

`fact(4)` ishlaganda nima bo'ladi? U `fact(3)` ni chaqiradi va javobni kutib turadi. O'z navbatida `fact(3)` ham kutadi va hokazo. Kompyuter hali tugamagan chaqiruvlarni **chaqiruvlar steki (call stack)** da saqlaydi — bu xotiradagi joy bo'lib, unda har bir tugallanmagan chaqiruvning o'zgaruvchilari turadi.

```text
fact(4) → 4 * fact(3)              kutmoqda
  fact(3) → 3 * fact(2)            kutmoqda
    fact(2) → 2 * fact(1)          kutmoqda
      fact(1) → 1                  asos holati
    fact(2) = 2 * 1 = 2
  fact(3) = 3 * 2 = 6
fact(4) = 4 * 6 = 24
```

Jarayon ikki bosqichdan iborat: avval asos holatigacha "tushamiz", keyin javoblar bilan yuqoriga "qaytamiz". Stekda bir vaqtda turgan chaqiruvlarning eng ko'p soni **rekursiya chuqurligi (recursion depth)** deyiladi. `fact(4)` uchun u 4 ga teng.

> [!NOTE]
> To'xtang va o'ylang: agar asos holati `if (n == 1)` bo'lsa, `fact(0)` chaqirilganda nima bo'ladi?

$n = 0$ birga teng emas, shuning uchun `fact(-1)`, keyin `fact(-2)` chaqiriladi… Argument asos holatidan uzoqlashib boradi va funksiya hech qachon to'xtamaydi. Stek to'lib, dastur qulaydi. Bu xato **stekning to'lib ketishi (stack overflow)** deyiladi. Shuning uchun biz `n <= 1` shartini yozdik.

### Rekursiv ishonch

Rekursiv funksiya yozganda barcha chaqiruvlarni boshda kuzatish shart emas. Biz shunchaki **`fact(n - 1)` to'g'ri javob qaytaradi deb ishonamiz** va undan foydalanamiz. Bu domino toshlariga o'xshaydi: birinchi tosh yiqilsa (asos holati) va har bir tosh keyingisini yiqitsa (rekursiv qadam), barcha toshlar yiqiladi. Aynan shu sabab rekursiya doim to'g'ri ishlaydi.

### Hanoi minoralariga qo'llaymiz

Faraz qilaylik, bizda `hanoi(k, from, to, via)` funksiyasi bor. U $k$ ta diskni `from` qoziqdan `to` qoziqqa, `via` qoziqdan yordamchi sifatida foydalanib o'tkazadi. $n$ ta diskni 1 dan 3 ga o'tkazish uchun uch qadam yetarli:

1. Yuqoridagi $n-1$ ta diskni 1 dan 2 ga o'tkazamiz (3 — yordamchi). Bu rekursiv chaqiruv.
2. Eng katta diskni 1 dan 3 ga o'tkazamiz. Bu bitta yurish.
3. $n-1$ ta diskni 2 dan 3 ga o'tkazamiz (1 — yordamchi). Yana rekursiv chaqiruv.

Nega bu qoidalarni buzmaydi? Eng katta disk doim eng pastda turadi va uning ustiga istalgan diskni qo'yish mumkin. Shuning uchun 1- va 3-qadamlarda u "yo'qdek" bo'ladi. Asos holati: $k = 0$ — o'tkaziladigan disk yo'q, hech narsa qilmaymiz.

Yurishlar sonini $T(n)$ deb belgilaylik. Uch qadamdan $T(n) = 2T(n-1) + 1$ va $T(0) = 0$ kelib chiqadi. Qiymatni kichikroq argumentdagi qiymatlar orqali ifodalovchi bunday formula **rekursiv munosabat (recurrence relation)** deyiladi. Hisoblaymiz: $1, 3, 7, 15, \dots$, ya'ni $T(n) = 2^n - 1$.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<pair<int, int>> moves;

// k ta diskni from qoziqdan to qoziqqa, via qoziq orqali o'tkazadi
void hanoi(int k, int from, int to, int via) {
    // asos holati: o'tkaziladigan disk yo'q
    if (k == 0) return;
    // 1) yuqoridagi k-1 diskni yordamchi qoziqqa
    hanoi(k - 1, from, via, to);
    // 2) eng katta diskni maqsad qoziqqa
    moves.push_back({from, to});
    // 3) k-1 diskni yordamchidan maqsad qoziqqa
    hanoi(k - 1, via, to, from);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    hanoi(n, 1, 3, 2);

    // yurishlar soni va yurishlarning o'zi
    cout << moves.size() << "\n";
    for (auto [a, b] : moves) {
        cout << a << " " << b << "\n";
    }
}
```

Kodning muhim joylari:

- Asos holati funksiyaning birinchi qatorida: $k = 0$ bo'lsa, darhol qaytamiz.
- Har bir chaqiruvda $k$ bittaga kamayadi, ya'ni asos holatiga yaqinlashamiz.
- 1-qadamda `to` va `via` o'rin almashadi, 3-qadamda esa `from` va `via`.
- Yurishlarni `vector` ga yig'amiz, chunki avval ularning sonini chiqarish kerak. Sonni `(1 << n) - 1` formulasi bilan ham chiqarish mumkin edi.

## Misol

$n = 3$ uchun dasturni qadamma-qadam bajaraylik. Disklarni o'lchami bo'yicha 1 (kichik), 2, 3 (katta) deb belgilaymiz. Qoziqdagi disklar pastdan yuqoriga yozilgan.

Avval chaqiruvlar daraxtini ko'raylik ($k = 0$ chaqiruvlari tushirib qoldirilgan):

```text
hanoi(3,1,3,2)
├── hanoi(2,1,2,3)
│   ├── hanoi(1,1,3,2) → 1 3
│   ├── 1 2
│   └── hanoi(1,3,2,1) → 3 2
├── 1 3
└── hanoi(2,2,3,1)
    ├── hanoi(1,2,1,3) → 2 1
    ├── 2 3
    └── hanoi(1,1,3,2) → 1 3
```

Endi qoziqlar holatini kuzatamiz:

| # | Yurishni bajargan chaqiruv | Yurish | Disk | 1-qoziq | 2-qoziq | 3-qoziq |
|---|---|---|---|---|---|---|
| 0 | — | — | — | 3 2 1 | | |
| 1 | `hanoi(1,1,3,2)` | 1 → 3 | 1 | 3 2 | | 1 |
| 2 | `hanoi(2,1,2,3)` | 1 → 2 | 2 | 3 | 2 | 1 |
| 3 | `hanoi(1,3,2,1)` | 3 → 2 | 1 | 3 | 2 1 | |
| 4 | `hanoi(3,1,3,2)` | 1 → 3 | 3 | | 2 1 | 3 |
| 5 | `hanoi(1,2,1,3)` | 2 → 1 | 1 | 1 | 2 | 3 |
| 6 | `hanoi(2,2,3,1)` | 2 → 3 | 2 | 1 | | 3 2 |
| 7 | `hanoi(1,1,3,2)` | 1 → 3 | 1 | | | 3 2 1 |

Hech qaysi qadamda katta disk kichigining ustiga tushmadi. Yurishlar soni $7 = 2^3 - 1$. Muammodagi $n = 2$ testi uchun dastur `3`, `1 2`, `1 3`, `2 3` chiqaradi — kutilgan javob bilan bir xil.

## Murakkablik

Rekursiv funksiyaning ish vaqti = **chaqiruvlar soni × bitta chaqiruvdagi ish**. `fact(n)` da $n$ ta chaqiruv, har biri $O(1)$ — jami $O(n)$.

`hanoi(k)` o'zini ikki marta chaqiradi, shuning uchun chaqiruvlar soni har darajada ikki barobar ortadi. Jami $2^{n+1} - 1$ chaqiruv va $2^n - 1$ yurish bo'ladi. $n = 20$ da bu taxminan $2 \cdot 10^6$ chaqiruv — 1 soniyadagi $10^8$ amal chegarasidan ancha kam.

- **Vaqt:** $O(2^n)$.
- **Xotira:** stek chuqurligi $n + 1$, ya'ni $O(n)$. Yurishlar ro'yxati esa $O(2^n)$ joy oladi.

Stek hajmi cheklangan: ko'p tizimlarda u bir necha megabayt. Chuqurlik $10^5$ atrofida odatda xavfsiz, lekin $10^7$ chuqurlikdagi rekursiya dasturni qulatishi mumkin.

## Variantlar

### Qiymat qaytaruvchi rekursiya

Sonning raqamlari yig'indisi: oxirgi raqam + qolgan qismning raqamlari yig'indisi. Masalan, $4096$ uchun $6 + S(409) = 6 + 9 + S(40) = \dots = 19$.

```cpp
int digitSum(long long n) {
    if (n == 0) return 0;
    return n % 10 + digitSum(n / 10);
}
```

Qachon kerak: masalani "kichik bo'lak + qolgan qism uchun xuddi shu masala" ko'rinishida yozish mumkin bo'lganda.

### Amal chaqiruvdan oldin yoki keyin

Amal rekursiv chaqiruvdan keyin bajarilsa, natija teskari tartibda chiqadi. Quyidagi funksiya sonning raqamlarini to'g'ri tartibda, bo'sh joy bilan chiqaradi: `printDigits(123)` → `1 2 3`.

```cpp
void printDigits(int n) {
    if (n >= 10) printDigits(n / 10);  // avval qolgan raqamlar
    cout << n % 10 << " ";            // keyin oxirgi raqam
}
```

Agar `cout` qatorini chaqiruvdan oldinga qo'ysak, `3 2 1` chiqadi.

### Ikki marta chaqiruv va takroriy hisoblar

Fibonachchi sonlari: $F(n) = F(n-1) + F(n-2)$, $F(0) = 0$, $F(1) = 1$.

```cpp
long long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

Kod to'g'ri, lekin sekin: `fib(5)` ichida `fib(3)` ikki marta, `fib(2)` uch marta hisoblanadi. $n = 50$ da chaqiruvlar soni $4 \cdot 10^{10}$ dan oshadi. Bu muammoni "Memoizatsiyali rekursiya" darsida hal qilamiz.

## Ko'p uchraydigan xatolar

Birinchi va eng ko'p uchraydigan xato — asos holati barcha kirishlarni qamrab olmaydi.

> [!WARNING] Asos holatiga yetib bo'lmaydi
> ```cpp
> if (n == 1) return 1;
> return n * fact(n - 1);   // fact(0) cheksiz chaqiruvga olib keladi
> ```
> $n = 0$ dan argument faqat kamayadi va 1 ga hech qachon teng bo'lmaydi. To'g'risi: `if (n <= 1) return 1;`

Ikkinchi xato — argument kamaymaydi.

> [!WARNING] `n--` argumentni kamaytirmaydi
> ```cpp
> return n * fact(n--);     // fact(n) qayta chaqiriladi
> ```
> `n--` avval eski qiymatni beradi, keyin kamaytiradi. Natijada funksiya o'zini o'sha $n$ bilan chaqiradi va stek to'lib ketadi. To'g'risi: `fact(n - 1)`.

Uchinchi xato — natija hisoblanadi, lekin qaytarilmaydi.

> [!WARNING] `return` unutilgan
> ```cpp
> if (n <= 1) return 1;
> n * fact(n - 1);          // natija yo'qoladi
> ```
> Funksiya oxirida `return` bo'lmasa, tasodifiy qiymat qaytadi. To'g'risi: `return n * fact(n - 1);`

To'rtinchi xato — juda chuqur rekursiya.

> [!WARNING] Sikl o'rniga chuqur rekursiya
> ```cpp
> long long sum(int i) {    // n = 10^7 bo'lsa, chuqurlik 10^7
>     if (i == n) return 0;
>     return a[i] + sum(i + 1);
> }
> ```
> Har bir chaqiruv stekda joy oladi va dastur qulashi mumkin. Oddiy yig'indini sikl bilan hisoblang; rekursiyani chuqurlik kichik bo'lganda ishlating.

## Xulosa

- Rekursiv funksiya ikki qismdan iborat: asos holati va rekursiv qadam.
- Har bir chaqiruv asos holatiga yaqinlashishi shart, aks holda stek to'lib ketadi.
- Funksiya yozganda kichikroq chaqiruv to'g'ri ishlaydi deb ishoning — butun daraxtni kuzatish shart emas.
- Ish vaqti = chaqiruvlar soni × bitta chaqiruvdagi ish; xotira = rekursiya chuqurligi.
- Bir nechta rekursiv chaqiruv chaqiruvlar sonini tez oshiradi: $2^n$ yoki undan ham ko'p.

**Masalada rekursiyani qanday tanib olish mumkin:** shartda "har bir qism xuddi shunday tuzilgan" degan ma'no bor; javob kichikroq $n$ dagi javob orqali ifodalanadi; $n$ kichik (masalan, $n \le 20$), javobda esa $2^n$ ta element bor.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Rekursiya | recursion | Funksiyaning o'zini o'zi chaqirishi. |
| Asos holati | base case | Javobi darhol ma'lum bo'lgan, funksiya o'zini chaqirmaydigan holat. |
| Rekursiv qadam | recursive step | Funksiya o'zini kichikroq argument bilan chaqiradigan qism. |
| Chaqiruvlar steki | call stack | Hali tugamagan chaqiruvlar va ularning o'zgaruvchilari saqlanadigan xotira. |
| Rekursiya chuqurligi | recursion depth | Stekda bir vaqtda turgan chaqiruvlarning eng ko'p soni. |
| Stekning to'lib ketishi | stack overflow | Chaqiruvlar juda ko'payib, stekka sig'may qolishi va dasturning qulashi. |
| Rekursiv munosabat | recurrence relation | Qiymatni kichikroq argumentdagi qiymatlar orqali ifodalovchi formula. |

> [!TIP] O'zingizni tekshiring
> 1. `int f(int n) { if (n == 0) return 0; return f(n - 2) + 1; }` uchun `f(5)` nima qaytaradi?
> 2. $n = 10$ disk uchun Hanoi minoralarida nechta yurish kerak?
> 3. `fact(5)` chaqirilganda rekursiya chuqurligi nechaga teng (asos holati `n <= 1`)?
>
> <details>
> <summary>Javoblar</summary>
>
> 1. Hech narsa qaytarmaydi: $5, 3, 1, -1, \dots$ — argument 0 dan "sakrab o'tadi", stek to'lib ketadi. Asos holatini `n <= 0` qilish kerak.
> 2. $2^{10} - 1 = 1023$ ta yurish.
> 3. 5: `fact(5)`, `fact(4)`, `fact(3)`, `fact(2)`, `fact(1)`.
>
> </details>
