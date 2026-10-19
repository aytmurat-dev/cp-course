---
summary: "Satrdagi har bir harf necha marta uchrashini O(n) da sanash va anagramma, palindrom kabi masalalarni hal qilish."
prerequisites: [frequency-array, brute-force]
---

## Kirish

Satrlar bilan bog'liq ko'p masalalarda harflarning tartibi emas, balki **qaysi harf necha marta uchrashi** muhim bo'ladi. "Bu ikki so'z bir xil harflardan tuzilganmi?", "Harflarni joyini almashtirib palindrom yasash mumkinmi?" — bunday savollarga chastota massivi bir zumda javob beradi. Bu darsda oldingi darsdagi chastota massivini satrlarga qo'llaymiz. Dars oxirida siz istalgan satrning harflarini $O(n)$ da sanab, anagramma va palindrom masalalarini mustaqil yecha olasiz.

## Muammo

Ikkita satr berilgan: $s$ va $t$. Ular faqat kichik lotin harflaridan iborat. $t$ satri $s$ ning harflarini joyini almashtirib hosil qilinganmi?

Boshqacha aytganda, $t$ satri $s$ ning **anagrammasi (anagram)** mi? Anagramma — bir satr harflarining o'rnini almashtirib hosil qilingan boshqa satr. Masalan, `kitob` va `bokit` — anagrammalar, `olma` va `olam` ham.

- **Kirish:** bitta qatorda $s$, keyingi qatorda $t$.
- **Chiqish:** anagramma bo'lsa `YES`, aks holda `NO`.
- **Cheklovlar:** $1 \le |s|, |t| \le 2 \cdot 10^5$.

| Kirish | Chiqish |
|---|---|
| `banana` <br> `nabana` | `YES` |

Eng sodda yechim: $s$ dagi har bir belgi uchun u $s$ da ham, $t$ da ham necha marta uchrashini qaytadan sanaymiz. Agar biror harf uchun sonlar farq qilsa — javob `NO`.

```cpp
bool ok = (s.size() == t.size());
for (int i = 0; i < (int)s.size() && ok; i++) {
    int inS = 0, inT = 0;
    for (char c : s) if (c == s[i]) inS++;
    for (char c : t) if (c == s[i]) inT++;
    if (inS != inT) ok = false;
}
cout << (ok ? "YES" : "NO") << "\n";
```

Har bir $i$ uchun ikkala satrni to'liq aylanib chiqamiz, ya'ni taxminan $2n$ amal. Jami $n \cdot 2n = 2n^2$ amal. $n = 2 \cdot 10^5$ da bu $8 \cdot 10^{10}$ amal — 1 soniyaga ($\approx 10^8$ amal) sig'maydi, 800 baravar ko'p.

E'tibor bering: bu yechim bir xil ishni qayta-qayta bajaradi. `banana` da `a` harfi uch marta uchraydi, va biz uni uch marta qaytadan sanaymiz.

## G'oya

Keling, avval `banana` so'zini qo'lda sanaymiz: `a` — 3 marta, `n` — 2 marta, `b` — 1 marta. Endi `nabana` ni sanaymiz: `a` — 3, `n` — 2, `b` — 1. Sonlar bir xil, demak harflar ham bir xil, faqat tartibi boshqa.

**Asosiy kuzatish: ikki satr anagramma bo'ladi faqat va faqat har bir harf ikkalasida bir xil marta uchrasa.**

Nega bu doim to'g'ri? Harflarning o'rnini almashtirish ularning sonini o'zgartirmaydi — shuning uchun anagrammalarda sonlar teng. Teskarisi ham to'g'ri: agar har bir harf soni teng bo'lsa, $s$ ning harflarini birma-bir kerakli joyga qo'yib, $t$ ni hosil qilamiz.

### Harfni indeksga aylantirish

Harflarni sanash uchun 26 ta katakli massiv kerak: 0-katak `a` uchun, 1-katak `b` uchun va hokazo. Lekin harfdan indeksni qanday olamiz?

C++ da har bir belgi (`char`) aslida kichik butun son — uning **ASCII kodi (ASCII code)**. ASCII kodi — kompyuter har bir belgini saqlash uchun ishlatadigan raqam. Kichik harflar ketma-ket kodlarga ega:

| Belgi | `a` | `b` | `c` | … | `n` | … | `z` |
|---|---|---|---|---|---|---|---|
| ASCII kodi | 97 | 98 | 99 | … | 110 | … | 122 |
| `c - 'a'` | 0 | 1 | 2 | … | 13 | … | 25 |

Demak, `c - 'a'` ifodasi har qanday kichik harfni $0$ dan $25$ gacha bo'lgan indeksga aylantiradi. Masalan, `'n' - 'a'` $= 110 - 97 = 13$.

Bu yerdagi 26 — **alifbo hajmi (alphabet size)**, ya'ni satrda uchrashi mumkin bo'lgan turli belgilar soni. Biz uni $k$ bilan belgilaymiz.

### Algoritm

1. Uzunliklar teng bo'lmasa — darhol `NO`.
2. `int cnt[26]` massivini nollar bilan to'ldiramiz.
3. $s$ ning har bir harfi uchun `cnt[c - 'a']` ni 1 ga oshiramiz.
4. $t$ ning har bir harfi uchun `cnt[c - 'a']` ni 1 ga kamaytiramiz.
5. Barcha 26 katak nol bo'lsa — `YES`, aks holda `NO`.

> [!NOTE]
> To'xtang va o'ylang: nega $s$ va $t$ uchun ikkita alohida massiv shart emas?

Chunki bizga sonlarning o'zi emas, ularning **farqi** kerak. $s$ dagi harf uchun $+1$, $t$ dagi harf uchun $-1$ qo'shsak, katakda "$s$ dagi soni minus $t$ dagi soni" qoladi. Sonlar teng bo'lsa, farq nolga teng bo'ladi.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s, t;
    cin >> s >> t;

    // Uzunliklar har xil bo'lsa, anagramma bo'lishi mumkin emas
    if (s.size() != t.size()) {
        cout << "NO\n";
        return 0;
    }

    // s harflari uchun +1, t harflari uchun -1
    int cnt[26] = {};
    for (char c : s) cnt[c - 'a']++;
    for (char c : t) cnt[c - 'a']--;

    // Biror harf soni farq qilsa, katakda nol bo'lmaydi
    for (int i = 0; i < 26; i++) {
        if (cnt[i] != 0) {
            cout << "NO\n";
            return 0;
        }
    }
    cout << "YES\n";
    return 0;
}
```

Kodning muhim joylari:

- `int cnt[26] = {};` — barcha kataklarni nol qiladi. Faqat `int cnt[26];` deb yozsangiz, ichida tasodifiy qiymatlar qolishi mumkin.
- `c - 'a'` — harfni $0..25$ oralig'idagi indeksga aylantiradi.
- Uzunlikni tekshirish shart emas (u holda ham biror katak nol bo'lmaydi), lekin u ortiqcha ishni oldini oladi va kodni tushunarli qiladi.

## Misol

Muammodagi testni olamiz: $s =$ `banana`, $t =$ `nabana`. Faqat o'zgaradigan kataklarni ko'rsatamiz.

| Qadam | Satr | Belgi | Amal | `cnt[a]` | `cnt[b]` | `cnt[n]` |
|---|---|---|---|---|---|---|
| 0 | — | — | boshlanish | 0 | 0 | 0 |
| 1 | $s$ | `b` | $+1$ | 0 | 1 | 0 |
| 2 | $s$ | `a` | $+1$ | 1 | 1 | 0 |
| 3 | $s$ | `n` | $+1$ | 1 | 1 | 1 |
| 4 | $s$ | `a` | $+1$ | 2 | 1 | 1 |
| 5 | $s$ | `n` | $+1$ | 2 | 1 | 2 |
| 6 | $s$ | `a` | $+1$ | 3 | 1 | 2 |
| 7 | $t$ | `n` | $-1$ | 3 | 1 | 1 |
| 8 | $t$ | `a` | $-1$ | 2 | 1 | 1 |
| 9 | $t$ | `b` | $-1$ | 2 | 0 | 1 |
| 10 | $t$ | `a` | $-1$ | 1 | 0 | 1 |
| 11 | $t$ | `n` | $-1$ | 1 | 0 | 0 |
| 12 | $t$ | `a` | $-1$ | 0 | 0 | 0 |

Oxirida barcha kataklar nolga teng. Javob — `YES`, kutilgan natija bilan mos keladi.

Endi $t =$ `bananb` bo'lsin. Xuddi shunday hisoblasak, oxirida `cnt[a] = 1` va `cnt[b] = -1` bo'ladi. Demak $s$ da bitta `a` ortiqcha, $t$ da bitta `b` ortiqcha — javob `NO`.

## Murakkablik

- **Vaqt:** $O(n + k)$. Har bir satrni bir marta aylanib chiqamiz ($2n$ amal), so'ng 26 ta katakni tekshiramiz. $n = 2 \cdot 10^5$ da bu taxminan $4 \cdot 10^5$ amal — sodda yechimdan 200 000 baravar tez.
- **Xotira:** $O(k)$ — atigi 26 ta `int`. Satrlar uzunligi qancha bo'lishidan qat'i nazar, massiv o'lchami o'zgarmaydi.

## Variantlar

### Palindrom yasash mumkinmi?

**Palindrom (palindrome)** — chapdan ham, o'ngdan ham bir xil o'qiladigan satr: `kiyik`, `abba`. Savol: $s$ harflarining o'rnini almashtirib palindrom yasash mumkinmi?

Palindromda harflar juft-juft bo'lib, chetlarda simmetrik turadi. Faqat o'rtadagi bitta harf jufti bo'lmasligi mumkin. Demak, **toq marta uchraydigan harflar soni 1 dan oshmasligi kerak.** Masalan, `aabbc` dan `abcba` yasaladi (faqat `c` toq), `aabc` dan esa yasab bo'lmaydi (`b` va `c` toq).

```cpp
int cnt[26] = {};
for (char c : s) cnt[c - 'a']++;
int odd = 0;
for (int i = 0; i < 26; i++)
    if (cnt[i] % 2 == 1) odd++;
cout << (odd <= 1 ? "YES" : "NO") << "\n";
```

### Bir satr harflaridan boshqasini yasash

Qachon kerak: "$t$ dagi harflardan foydalanib $s$ ni yozish mumkinmi? Har bir harf bir marta ishlatiladi, ortib qolsa ham bo'ladi." Bu anagrammaga o'xshaydi, lekin sonlar teng bo'lishi shart emas. Har bir harf uchun $t$ dagi soni $s$ dagi sonidan kam bo'lmasligi kifoya. $t$ uchun $+1$, $s$ uchun $-1$ qilamiz va **hech bir katak manfiy bo'lmasligini** tekshiramiz.

### Boshqa belgilar to'plami

Agar satrda katta harflar, raqamlar yoki boshqa belgilar ham bo'lsa, indeksni boshqacha olamiz:

- faqat katta harflar: `cnt[c - 'A']`;
- faqat raqamlar: `cnt[c - '0']`;
- istalgan belgilar: 256 katakli massiv, `cnt[(unsigned char)c]++`.

Butun so'zlarni sanash kerak bo'lsa, massiv o'rniga `map<string, int>` ishlatiladi: `freq[word]++`.

## Ko'p uchraydigan xatolar

### Indeksni siljitishni unutish

> [!WARNING]
> ```cpp
> int cnt[26] = {};
> cnt[c]++;   // xato
> ```
> `c` ning qiymati 97 dan 122 gacha, massivda esa faqat 26 katak bor. Dastur massiv chegarasidan chiqib, boshqa xotirani buzadi. To'g'ri variant: `cnt[c - 'a']++;`

### Katta harflarni hisobga olmaslik

> [!WARNING]
> Shart "harflar" deydi, lekin katta harflar ham kelishi mumkin. `'A' - 'a'` $= 65 - 97 = -32$ — manfiy indeks, dastur buziladi. Chegaralarni diqqat bilan o'qing. Katta va kichik harf farqlanmasa, avval `c = tolower(c);` qiling.

### Massivni nolga to'ldirmaslik

> [!WARNING]
> ```cpp
> while (T--) {
>     int cnt[26];   // xato: ichida tasodifiy qiymatlar
>     ...
> }
> ```
> `main` ichidagi massiv avtomatik nolga to'ldirilmaydi. Bir nechta test bo'lsa, har bir testda yangidan nol qilish kerak. To'g'ri variant: `int cnt[26] = {};`

### Sonlar o'rniga "bor-yo'q"ni tekshirish

> [!WARNING]
> Ba'zan faqat "$s$ dagi har bir harf $t$ da bormi?" deb tekshiriladi. Lekin `aab` va `abb` da bir xil harflar bor, ular esa anagramma emas. Harf **bor-yo'qligini** emas, **necha marta** uchrashini solishtiring.

## Xulosa

- Satrdagi harflarni sanash uchun 26 katakli `cnt` massivi va `c - 'a'` indeksi yetarli.
- Ikki satr anagramma bo'ladi faqat va faqat barcha harflar soni teng bo'lsa.
- Ikki satrni solishtirishda bitta massivga $+1$ va $-1$ qo'shish qulay.
- Palindrom yasash uchun toq marta uchraydigan harflar soni 1 dan oshmasligi kerak.
- Murakkablik $O(n + k)$ — satr uzunligiga chiziqli bog'liq.

**Masalada bu texnikani qanday tanib olish mumkin:** shartda "harflarning o'rnini almashtirish", "anagramma", "qayta tartiblash", "palindrom yasash", "har bir harfdan necha marta" kabi so'zlar bor. Harflar tartibi ahamiyatsiz, faqat ularning soni muhim. Satr uzunligi $10^5$ va undan katta.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| ASCII kodi | ASCII code | Kompyuter har bir belgini saqlash uchun ishlatadigan raqam, masalan `'a'` — 97. |
| Alifbo hajmi | alphabet size | Satrda uchrashi mumkin bo'lgan turli belgilar soni, kichik lotin harflari uchun 26. |
| Anagramma | anagram | Bir satr harflarining o'rnini almashtirib hosil qilingan satr. |
| Palindrom | palindrome | Chapdan ham, o'ngdan ham bir xil o'qiladigan satr. |

> [!TIP] O'zingizni tekshiring
> 1. `'z' - 'a'` nechaga teng va nega?
> 2. `racecar` harflaridan palindrom yasash mumkinmi? `aabbcd` dan-chi?
> 3. Nega anagramma tekshiruvida faqat harflar bor-yo'qligini solishtirish yetarli emas?
>
> <details>
> <summary>Javoblar</summary>
>
> 1. 25. Chunki `'z'` ning kodi 122, `'a'` niki 97, ayirmasi $122 - 97 = 25$ — oxirgi katak indeksi.
> 2. `racecar`: `r`, `a`, `c` — 2 martadan, `e` — 1 marta. Toq harf bitta, demak mumkin (u o'zi palindrom). `aabbcd`: `c` va `d` toq, ikkita toq harf — mumkin emas.
> 3. Chunki harflar to'plami bir xil bo'lsa ham, ularning soni farq qilishi mumkin: `aab` va `abb`.
>
> </details>
