---
title: "Vaqt murakkabligi"
section: "Asoslar"
order: 1
summary: "Yechim vaqt limitiga sig'ishini kod yozishdan oldin qanday baholash mumkin."
problems:
  - title: "Watermelon"
    url: "https://codeforces.com/problemset/problem/4/A"
    difficulty: easy
    rating: 800
    note: "Birinchi masala — kirish/chiqish"
  - title: "Theatre Square"
    url: "https://codeforces.com/problemset/problem/1/A"
    difficulty: easy
    rating: 1000
    note: "Sikl kerak emas, O(1)"
  - title: "Product"
    url: "https://atcoder.jp/contests/abs/tasks/abc086_a"
    difficulty: easy
  - title: "Shift only"
    url: "https://atcoder.jp/contests/abs/tasks/abc081_b"
    difficulty: easy
  - title: "Two Sum"
    url: "https://leetcode.com/problems/two-sum/"
    difficulty: easy
    note: "O(n²) va O(n) yechimlarni solishtiring"
  - title: "Coins"
    url: "https://atcoder.jp/contests/abs/tasks/abc087_b"
    difficulty: easy
    note: "Uchta ichma-ich sikl yetarlimi?"
---

Competitive programmingda to'g'ri yechimning o'zi yetarli emas — u **vaqt limiti** ichida ishlashi ham kerak. Yaxshi xabar: yechim tez yoki sekin ekanini kod yozmasdan oldin, faqat cheklovlarga qarab baholash mumkin. Buning vositasi — **vaqt murakkabligi (time complexity)** va "katta O" belgilashi.

## Muammo

Masala: $n$ ta sondan iborat massivda yig'indisi $s$ ga teng ikkita element bormi? Cheklov: $n \le 2 \cdot 10^5$.

Birinchi xayolga keladigan yechim — barcha juftliklarni tekshirish:

```cpp
bool found = false;
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (a[i] + a[j] == s) found = true;
```

Bu kod to'g'ri. Lekin u necha amal bajaradi? Juftliklar soni $\frac{n(n-1)}{2} \approx 2 \cdot 10^{10}$. Zamonaviy kompyuter soniyasiga taxminan $10^8$–$10^9$ oddiy amal bajaradi, demak bu yechim o'nlab soniya ishlaydi — **TLE** (Time Limit Exceeded).

## G'oya

Aniq amallar sonini sanash shart emas. Muhimi — kirish hajmi $n$ o'sganda amallar soni **qanday tezlikda** o'sishi. Buni $O(\cdot)$ bilan yozamiz va konstantalar hamda kichik hadlarni tashlab yuboramiz:

$$
3n^2 + 5n + 100 = O(n^2)
$$

Kodga qarab murakkablikni aniqlashning oddiy qoidalari:

- Oddiy amallar (qo'shish, solishtirish, massiv elementiga murojaat) — $O(1)$.
- $n$ marta takrorlanadigan sikl — $O(n)$.
- Ichma-ich ikki sikl — $O(n^2)$, uchta — $O(n^3)$.
- Har qadamda masalani ikkiga bo'lish — $O(\log n)$.
- `sort` — $O(n \log n)$.

### Cheklovdan murakkablikni topish

Eng foydali jadval — masalani o'qishingiz bilan qaysi murakkablik kerakligini ko'rsatadi:

| $n$ ning chegarasi | Mos murakkablik | Odatiy usullar |
|---|---|---|
| $n \le 10$ | $O(n!)$ | barcha o'rin almashtirishlar |
| $n \le 20$ | $O(2^n \cdot n)$ | barcha qism to'plamlar, bitmask |
| $n \le 500$ | $O(n^3)$ | uchta sikl, Floyd |
| $n \le 5000$ | $O(n^2)$ | ikki sikl, oddiy DP |
| $n \le 2 \cdot 10^5$ | $O(n \log n)$ | saralash, binar qidiruv, segmentlar daraxti |
| $n \le 10^7$ | $O(n)$ | bitta o'tish, prefiks yig'indi |
| $n \le 10^{18}$ | $O(\log n)$ yoki $O(1)$ | formula, tez darajaga ko'tarish |

> [!TIP]
> Murakkablikka $n$ ning maksimal qiymatini qo'yib hisoblang. Natija $\approx 10^8$ dan oshmasa — yechim deyarli har doim o'tadi.

## Amalga oshirish

Yuqoridagi masalani $O(n \log n)$ da yechamiz: massivni saralab, ikki chetdan yaqinlashamiz.

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long long s;
    cin >> n >> s;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;

    sort(a.begin(), a.end());          // O(n log n)
    int i = 0, j = n - 1;
    bool found = false;
    while (i < j) {                    // O(n): har qadamda i yoki j siljiydi
        long long cur = a[i] + a[j];
        if (cur == s) { found = true; break; }
        if (cur < s) i++;
        else j--;
    }
    cout << (found ? "YES" : "NO") << '\n';
}
```

Jami: $O(n \log n) + O(n) = O(n \log n)$. $n = 2 \cdot 10^5$ uchun bu taxminan $3.5 \cdot 10^6$ amal — bir zumda.

## Misol

Bir xil masalani turli usullar bilan $n = 2 \cdot 10^5$ uchun solishtiramiz:

| Usul | Murakkablik | Taxminiy amallar | Natija |
|---|---|---|---|
| Barcha juftliklar | $O(n^2)$ | $2 \cdot 10^{10}$ | TLE |
| Saralash + ikki ko'rsatkich | $O(n \log n)$ | $3.5 \cdot 10^6$ | ✓ |
| Hash to'plam | $O(n)$ o'rtacha | $2 \cdot 10^5$ | ✓ |

Agar cheklov $n \le 3000$ bo'lganida, birinchi usul ham ($4.5 \cdot 10^6$ amal) bemalol o'tardi. Shuning uchun **har doim avval cheklovni o'qing**.

## Murakkablik

Murakkablik ikki xil bo'ladi:

- **Vaqt** — nechta amal bajariladi.
- **Xotira** — qancha joy kerak. Odatda limit 256 MB: bu taxminan $6 \cdot 10^7$ ta `int` yoki $3 \cdot 10^7$ ta `long long`.

Yuqoridagi yechim: vaqt $O(n \log n)$, xotira $O(n)$.

## Ko'p uchraydigan xatolar

- **Yashirin sikllar.** `s.find(x)` (string uchun), `vector::erase`, `count` — bular $O(n)$. Ularni sikl ichida chaqirish $O(n^2)$ beradi.
- **Bir nechta test.** Agar kirishda $t$ ta test bo'lsa va "barcha testlar bo'yicha $n$ yig'indisi $\le 2 \cdot 10^5$" deyilgan bo'lsa — murakkablikni yig'indi bo'yicha hisoblang. Har testda $10^5$ hajmli massivni nolga tozalash esa xato.
- **`endl` va sekin kiritish.** Katta kirishda `ios::sync_with_stdio(false)` siz va `endl` bilan to'g'ri yechim ham TLE olishi mumkin.
- **Konstantani unutish.** $O(n \log n)$ va $n = 10^6$ — yaxshi, lekin `map` bilan $O(n \log n)$ massivdan 5–10 marta sekin.

> [!WARNING]
> `string` ni sikl ichida `s = s + c` ko'rinishida to'ldirish har safar butun satrni nusxalaydi — $O(n^2)$. To'g'ri yo'li: `s += c` yoki `s.push_back(c)`.

## Xulosa

- Murakkablik — $n$ o'sganda vaqt qanday o'sishi; konstantalar tashlanadi.
- ~$10^8$ oddiy amal ≈ 1 soniya.
- Cheklovga qarab kerakli murakkablikni jadvaldan toping va shunga mos usulni tanlang.
- Yashirin $O(n)$ amallar va sekin kiritish-chiqarishga e'tibor bering.
