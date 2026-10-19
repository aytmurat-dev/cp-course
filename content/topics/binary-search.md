---
title: "Binar qidiruv"
section: "Saralash va qidiruv"
order: 21
summary: "Saralangan massivda va monoton shartlarda javobni O(log n) da topish."
prerequisites: [complexity]
problems:
  - title: "Interesting drink"
    url: "https://codeforces.com/problemset/problem/706/B"
    difficulty: easy
    rating: 1100
    note: "upper_bound"
  - title: "Worms"
    url: "https://codeforces.com/problemset/problem/474/B"
    difficulty: easy
    rating: 1200
  - title: "Queries about less or equal elements"
    url: "https://codeforces.com/problemset/problem/600/B"
    difficulty: easy
    rating: 1300
    note: "Saralash + upper_bound"
  - title: "Snuke Festival"
    url: "https://atcoder.jp/contests/abc077/tasks/arc084_a"
    difficulty: medium
    note: "O'rtadagi element bo'yicha sanash"
  - title: "Buy an Integer"
    url: "https://atcoder.jp/contests/abc146/tasks/abc146_c"
    difficulty: medium
    note: "Javob bo'yicha qidiruv"
  - title: "Maximum Median"
    url: "https://codeforces.com/problemset/problem/1201/C"
    difficulty: medium
    rating: 1400
  - title: "Frodo and pillows"
    url: "https://codeforces.com/problemset/problem/760/B"
    difficulty: medium
    rating: 1500
  - title: "Hamburgers"
    url: "https://codeforces.com/problemset/problem/371/C"
    difficulty: medium
    rating: 1600
  - title: "Magic Ship"
    url: "https://codeforces.com/problemset/problem/1117/C"
    difficulty: hard
    rating: 1900
---

Lug'atdan so'z qidirganda uni birinchi betdan boshlab varaqlamaysiz — o'rtasini ochasiz va kerakli yarmiga o'tasiz. **Binar qidiruv (binary search)** aynan shu g'oya: har qadamda qidiruv sohasini ikki marta qisqartirish. Natijada $10^9$ ta variant orasidan ham javob atigi ~30 qadamda topiladi.

## Muammo

Masala: o'sish tartibida saralangan $a_0 \le a_1 \le \dots \le a_{n-1}$ massiv va $q$ ta so'rov berilgan. Har bir so'rovda $x$ soni massivda bormi, deb so'raladi. Cheklovlar: $n, q \le 2 \cdot 10^5$.

Sodda yechim — har bir so'rovda massivni boshidan oxirigacha ko'rib chiqish: bitta so'rov $O(n)$, jami $O(n \cdot q) = 4 \cdot 10^{10}$. Juda sekin. Biz esa massiv **saralangan** ekanidan umuman foydalanmayapmiz.

## G'oya

$x$ ni o'rtadagi element $a_m$ bilan solishtiramiz:

- $a_m = x$ — topdik.
- $a_m < x$ — $x$ faqat o'ng yarmida bo'lishi mumkin (chap yarmidagi hamma son $\le a_m < x$).
- $a_m > x$ — $x$ faqat chap yarmida.

Har qadamda soha ikki marta kichrayadi: $n \to n/2 \to n/4 \to \dots \to 1$. Qadamlar soni $\log_2 n$; $n = 2 \cdot 10^5$ uchun bu atigi 18.

### Umumiy ko'rinish: monoton shart

Binar qidiruvni faqat "sonni topish" deb emas, kengroq tushunish kerak. Faraz qilaylik, $f(x)$ — rost/yolg'on qaytaradigan shart va u **monoton**: biror nuqtagacha yolg'on, undan keyin doim rost:

| $x$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| $f(x)$ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |

Binar qidiruv birinchi ✓ ni (bu yerda $x = 4$) $O(\log n)$ marta $f$ ni chaqirib topadi.

> [!IMPORTANT]
> Binar qidiruv ishlatish uchun massiv saralangan bo'lishi shart emas — **shart monoton** bo'lishi kifoya. Bu "javob bo'yicha binar qidiruv" deb ataladigan kuchli usulning asosi.

## Amalga oshirish

Eng ishonchli shablon — **chegaralar invarianti** bilan: doim $f(lo) =$ ✗ va $f(hi) =$ ✓ bo'lsin. Ular qo'shni bo'lganda $hi$ — javob.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;

    while (q--) {
        long long x;
        cin >> x;
        // a[i] >= x bo'lgan birinchi i ni qidiramiz.
        // Invariant: a[lo] < x (lo = -1 — "minus cheksizlik"), a[hi] >= x (hi = n — "plus cheksizlik").
        int lo = -1, hi = n;
        while (hi - lo > 1) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= x) hi = mid;
            else lo = mid;
        }
        bool found = (hi < n && a[hi] == x);
        cout << (found ? "YES" : "NO") << '\n';
    }
}
```

C++ da tayyor funksiyalar ham bor (ular aynan shu ishni qiladi):

- `lower_bound(a.begin(), a.end(), x)` — $\ge x$ bo'lgan birinchi element.
- `upper_bound(a.begin(), a.end(), x)` — $> x$ bo'lgan birinchi element.
- $x$ ga teng elementlar soni: `upper_bound(...) - lower_bound(...)`.

## Misol

$a = [1, 3, 3, 5, 8, 13]$, $x = 5$. $a_i \ge 5$ bo'lgan birinchi $i$ ni izlaymiz:

| Qadam | $lo$ | $hi$ | $mid$ | $a_{mid}$ | $a_{mid} \ge 5$? |
|---|---|---|---|---|---|
| 1 | -1 | 6 | 2 | 3 | yo'q → $lo = 2$ |
| 2 | 2 | 6 | 4 | 8 | ha → $hi = 4$ |
| 3 | 2 | 4 | 3 | 5 | ha → $hi = 3$ |
| — | 2 | 3 | | | $hi - lo = 1$, to'xtaymiz |

Javob: $hi = 3$, $a_3 = 5 = x$ — topildi ✓

## Murakkablik

- Bitta qidiruv: $O(\log n)$ qadam.
- $q$ ta so'rov: $O(q \log n)$, agar massivni saralash kerak bo'lsa, qo'shimcha $O(n \log n)$.
- Javob bo'yicha qidiruv: $O(\log(\text{diapazon}) \cdot T_f)$, bu yerda $T_f$ — shartni bir marta tekshirish vaqti.

## Variantlar

### Javob bo'yicha binar qidiruv

Ko'p masalalar "eng kichik $X$ ni toping, shunday ki ..." ko'rinishida bo'ladi. Agar $X$ yaroqli bo'lsa, undan kattasi ham yaroqli bo'lsa — shart monoton, javobni binar qidiruv bilan topamiz.

Misol: $n$ ta uyumda bananlar bor. Soatiga $k$ ta banan yesak, $h$ soatda hammasini yeb bo'ladimi? $k$ oshgani sari kerakli vaqt kamayadi — monoton. Demak, eng kichik yaroqli $k$ ni qidiramiz:

```cpp
auto ok = [&](long long k) {
    long long hours = 0;
    for (long long p : piles) hours += (p + k - 1) / k;  // yuqoriga yaxlitlash
    return hours <= h;
};
long long lo = 0, hi = 1e9;  // ok(lo) = false, ok(hi) = true
while (hi - lo > 1) {
    long long mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid;
}
// javob: hi
```

> [!TIP]
> Javob bo'yicha qidiruvda avval ikki savolga javob bering: (1) shart nima va u monotonmi? (2) $lo$ aniq yaroqsiz, $hi$ aniq yaroqli bo'ladigan boshlang'ich qiymatlar qanday?

### Haqiqiy sonlarda qidiruv

Javob kasr son bo'lsa, `while (hi - lo > 1)` o'rniga qat'iy sonli iteratsiya ishlatiladi — masalan, 100 marta. Har iteratsiya xatolikni ikki marta kamaytiradi, 100 ta iteratsiya istalgan aniqlik uchun yetarli.

## Ko'p uchraydigan xatolar

- **Cheksiz sikl.** `lo = mid` va `mid = (lo + hi) / 2` bo'lsa, $hi = lo + 1$ da $mid = lo$ bo'lib, sikl to'xtamaydi. Yuqoridagi `hi - lo > 1` shabloni bundan himoyalangan.
- **To'lib ketish.** `(lo + hi) / 2` da $lo + hi$ `int` ga sig'masligi mumkin. `lo + (hi - lo) / 2` yozing yoki `long long` ishlating.
- **Noto'g'ri boshlang'ich chegaralar.** $hi$ haqiqatan yaroqli bo'lishi kerak: agar javob $10^9$ ga teng bo'lishi mumkin bo'lsa, $hi = 10^9$ yetarli, lekin $hi = 10^9 - 1$ emas.
- **Saralanmagan massivda `lower_bound`.** Natija ma'nosiz bo'ladi — avval `sort` qiling.
- **Shart monoton emas.** Har doim tekshiring: $f(x) =$ ✓ bo'lsa, $f(x+1) =$ ✓ mi?

> [!WARNING]
> Javob bo'yicha qidiruvda `ok()` ichidagi yig'indilar ko'pincha `long long` dan ham oshib ketishi mumkin. Yig'indi chegaradan o'tishi bilan siklni to'xtatib, `true` qaytaring.

## Xulosa

- Binar qidiruv monoton shartda chegarani $O(\log n)$ da topadi.
- Ishonchli shablon: invariant $f(lo) =$ ✗, $f(hi) =$ ✓, sikl `hi - lo > 1`.
- C++ da: `lower_bound` ($\ge x$) va `upper_bound` ($> x$).
- "Eng kichik/katta $X$ ni toping" — ko'pincha javob bo'yicha binar qidiruv.
