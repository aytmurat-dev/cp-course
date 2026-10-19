---
title: "Prefiks yig'indilar"
section: "Asoslar"
order: 3
summary: "Massivning istalgan qismi yig'indisini bitta ayirish amali bilan — O(1) da hisoblash."
prerequisites: [complexity]
problems:
  - title: "Range Sum Query - Immutable"
    url: "https://leetcode.com/problems/range-sum-query-immutable/"
    difficulty: easy
    note: "Klassik 1D prefiks"
  - title: "Find Pivot Index"
    url: "https://leetcode.com/problems/find-pivot-index/"
    difficulty: easy
  - title: "Ilya and Queries"
    url: "https://codeforces.com/problemset/problem/313/B"
    difficulty: easy
    rating: 1100
    note: "Prefiksni nimaga qurish kerak?"
  - title: "Kuriyama Mirai's Stones"
    url: "https://codeforces.com/problemset/problem/433/B"
    difficulty: easy
    rating: 1200
  - title: "Subarray Sum Equals K"
    url: "https://leetcode.com/problems/subarray-sum-equals-k/"
    difficulty: medium
    note: "Prefiks + hash map"
  - title: "Greg and Array"
    url: "https://codeforces.com/problemset/problem/295/A"
    difficulty: medium
    rating: 1400
    note: "Ayirmalar massivi ikki marta"
  - title: "Number of Ways"
    url: "https://codeforces.com/problemset/problem/466/C"
    difficulty: hard
    rating: 1700
---

Tasavvur qiling: sizga $n$ ta sondan iborat massiv va $q$ ta so'rov berilgan. Har bir so'rovda $l$-elementdan $r$-elementgacha bo'lgan sonlar yig'indisini aytish kerak. Har safar qaytadan qo'shib chiqish juda sekin. **Prefiks yig'indi (prefix sum)** — massivni bir marta oldindan qayta ishlab, keyin har bir so'rovga bir zumda javob berish usuli. Bu competitive programmingdagi eng ko'p ishlatiladigan g'oyalardan biri.

## Muammo

Masala: uzunligi $n$ bo'lgan $a_1, a_2, \dots, a_n$ massiv va $q$ ta so'rov berilgan. Har bir so'rov $(l, r)$ uchun

$$
a_l + a_{l+1} + \dots + a_r
$$

ni chiqaring. Cheklovlar: $n, q \le 2 \cdot 10^5$.

Eng sodda yechim — har bir so'rov uchun $l$ dan $r$ gacha sikl yurgizish:

```cpp
for (int i = 0; i < q; i++) {
    int l, r;
    cin >> l >> r;
    long long sum = 0;
    for (int j = l; j <= r; j++) sum += a[j];
    cout << sum << '\n';
}
```

Bitta so'rov eng yomon holatda $O(n)$ vaqt oladi, demak jami $O(n \cdot q)$. Bizning cheklovlarda bu $4 \cdot 10^{10}$ amal — vaqt limitiga (odatda 1–2 soniya, ya'ni ~$10^8$–$10^9$ amal) umuman sig'maydi.

> [!NOTE]
> Muammo shundaki, biz bir xil qo'shishlarni qayta-qayta bajaryapmiz. Masalan, $(2, 9)$ va $(3, 9)$ so'rovlari deyarli bir xil elementlarni qo'shadi.

## G'oya

Yangi massiv tuzamiz: $p_i$ — birinchi $i$ ta element yig'indisi.

$$
p_0 = 0, \qquad p_i = a_1 + a_2 + \dots + a_i = p_{i-1} + a_i
$$

Bu **prefiks yig'indilar massivi** deyiladi. Uni bitta sikl bilan, $O(n)$ da qurish mumkin, chunki har bir $p_i$ oldingi $p_{i-1}$ dan bitta qo'shish bilan olinadi.

Endi asosiy kuzatuv: $p_r$ — bu $a_1$ dan $a_r$ gacha yig'indi, $p_{l-1}$ esa $a_1$ dan $a_{l-1}$ gacha. Ularni ayirsak, aynan $a_l$ dan $a_r$ gacha qism qoladi:

$$
\text{sum}(l, r) = p_r - p_{l-1}
$$

> [!IMPORTANT]
> $p_0 = 0$ ekanini unutmang. Aynan shu tufayli $l = 1$ bo'lgan so'rovlar ham alohida tekshiruvsiz to'g'ri ishlaydi: $\text{sum}(1, r) = p_r - p_0 = p_r$.

## Amalga oshirish

Massivni **1-indeksli** saqlaymiz — shunda $p_{l-1}$ har doim mavjud bo'ladi.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    cin >> n >> q;
    vector<long long> pref(n + 1, 0);  // pref[0] = 0
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        pref[i] = pref[i - 1] + x;
    }

    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << pref[r] - pref[l - 1] << '\n';
    }
}
```

E'tibor bering: asl massiv `a` ni saqlash shart emas — barcha kerakli ma'lumot `pref` ichida.

## Misol

$a = [3, 1, 4, 1, 5, 9]$ bo'lsin. Prefiks yig'indilarni hisoblaymiz:

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| $a_i$ | — | 3 | 1 | 4 | 1 | 5 | 9 |
| $p_i$ | 0 | 3 | 4 | 8 | 9 | 14 | 23 |

Endi so'rovlarga javob beramiz:

- $(2, 4)$: $p_4 - p_1 = 9 - 3 = 6$. Tekshiramiz: $1 + 4 + 1 = 6$ ✓
- $(1, 6)$: $p_6 - p_0 = 23 - 0 = 23$ ✓
- $(5, 5)$: $p_5 - p_4 = 14 - 9 = 5$ — bitta element, ya'ni $a_5$ ✓

## Murakkablik

- **Oldindan hisoblash:** $O(n)$ — bitta sikl.
- **Har bir so'rov:** $O(1)$ — bitta ayirish.
- **Jami:** $O(n + q)$ vaqt, $O(n)$ qo'shimcha xotira.

$n = q = 2 \cdot 10^5$ uchun bu atigi ~$4 \cdot 10^5$ amal — oldingi $4 \cdot 10^{10}$ bilan solishtiring.

## Variantlar

### Ikki o'lchamli prefiks yig'indi

$n \times m$ jadvalda to'rtburchak ichidagi yig'indini topish uchun $P_{i,j}$ — $(1,1)$ dan $(i,j)$ gacha bo'lgan to'rtburchak yig'indisi:

$$
P_{i,j} = a_{i,j} + P_{i-1,j} + P_{i,j-1} - P_{i-1,j-1}
$$

$(x_1, y_1)$ – $(x_2, y_2)$ to'rtburchak yig'indisi:

$$
P_{x_2,y_2} - P_{x_1-1,y_2} - P_{x_2,y_1-1} + P_{x_1-1,y_1-1}
$$

Oxirgi qo'shiluvchi ikki marta ayirilgan burchakni qaytarish uchun kerak (kiritish-chiqarish prinsipi).

### Ayirmalar massivi (difference array)

Teskari masala: "$[l, r]$ oraliqdagi barcha elementlarga $x$ qo'sh" degan ko'p amallar, so'ngra yakuniy massiv kerak. Buning uchun $d$ massivida faqat ikki nuqtani o'zgartiramiz:

```cpp
d[l] += x;
d[r + 1] -= x;
```

Barcha amallardan keyin $d$ ning prefiks yig'indisi yakuniy qo'shimchalarni beradi. Har bir amal $O(1)$, yakunda bitta $O(n)$ o'tish.

> [!TIP]
> "Oraliqqa qo'shish, keyin hammasini so'rash" — ayirmalar massivi. "Oraliq yig'indisini so'rash, o'zgarishlarsiz" — prefiks yig'indi. Ikkalasi ham kerak bo'lsa (o'zgarish va so'rov aralash) — keyingi mavzulardagi Fenwick yoki segmentlar daraxti.

### Yig'indi berilgan qism massivlar soni

"Yig'indisi $k$ ga teng nechta qism massiv bor?" — $\text{sum}(l, r) = k$ shartini $p_{l-1} = p_r - k$ ko'rinishida yozamiz. Massivni chapdan o'ngga yurib, oldingi prefikslarni `map` da sanaymiz va har bir $r$ uchun `cnt[p_r - k]` ni javobga qo'shamiz. Natija — $O(n \log n)$ (yoki `unordered_map` bilan o'rtacha $O(n)$).

## Ko'p uchraydigan xatolar

- **To'lib ketish (overflow).** $n = 2 \cdot 10^5$ ta $10^9$ gacha sonlar yig'indisi `int` ga sig'maydi. Prefiks massivi har doim `long long` bo'lsin.
- **$p_{l-1}$ o'rniga $p_l$ ayirish.** Natijada $a_l$ yig'indidan tushib qoladi. Formulani misolda tekshirib ko'ring.
- **0-indeksli massiv bilan aralashtirish.** Agar kirish 0-indeksli bo'lsa, `pref` ni baribir $n+1$ uzunlikda qurib, `pref[i + 1] = pref[i] + a[i]` deb yozing.
- **Massiv o'zgarganda.** Prefiks yig'indi faqat massiv **o'zgarmas** bo'lganda ishlaydi. Elementlar o'zgarsa, har safar qayta qurish $O(n)$ bo'ladi.
- **Sekin kiritish-chiqarish.** $2 \cdot 10^5$ ta so'rovda `endl` ishlatish TLE ga olib kelishi mumkin — `'\n'` yozing.

> [!WARNING]
> Ayirmalar massivida `d` uzunligi $n + 2$ bo'lsin — aks holda `d[r + 1]` da $r = n$ bo'lganda massivdan chiqib ketasiz.

## Xulosa

- $p_i = p_{i-1} + a_i$, $p_0 = 0$ — $O(n)$ da quriladi.
- Oraliq yig'indisi: $\text{sum}(l, r) = p_r - p_{l-1}$ — $O(1)$ da.
- Ikki o'lchamda — kiritish-chiqarish prinsipi bilan to'rt hadli formula.
- Oraliqqa ko'p qo'shishlar uchun — ayirmalar massivi (prefiks yig'indining "teskarisi").
- Yig'indilar uchun doim `long long` ishlating.
