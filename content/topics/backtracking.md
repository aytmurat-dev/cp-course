---
summary: "Yechimni qadamma-qadam quradigan va noto'g'ri yo'lni darhol tashlab, orqaga qaytadigan qidiruv usuli."
prerequisites: [recursion, complete-search]
---

## Kirish

To'liq qidiruvda biz barcha variantlarni oxirigacha quramiz va faqat keyin tekshiramiz. Ko'p masalalarda esa variant yarim yo'lda ham "buzilgan"ligi ko'rinib turadi. **Backtracking** — yechimni bo'lakma-bo'lak quradigan va xato bo'lak qo'yilishi bilan shu yo'lni tashlab, orqaga qaytadigan usul.

Bu usul farzinlarni joylashtirish, sudoku, labirint, berilgan yig'indili kombinatsiyalarni topish kabi masalalarda uchraydi. Shu darsdan keyin siz to'liq qidiruvni keraksiz shoxlarsiz, bir necha ming marta tezroq yozishni o'rganasiz.

## Muammo

$n \times n$ shaxmat taxtasiga $n$ ta farzinni (ferz) shunday qo'yish kerakki, hech qaysi ikkitasi bir-birini urmasin. Farzin o'z qatori, ustuni va ikkala diagonali bo'ylab uradi. Nechta usul borligini toping.

- **Kirish:** bitta son $n$ ($1 \le n \le 12$).
- **Chiqish:** joylashtirishlar soni.

**Test:** $n = 4$ bo'lsa, javob $2$. Mana ikkala joylashtirish (`Q` — farzin):

```text
. Q . .      . . Q .
. . . Q      Q . . .
Q . . .      . . . Q
. . Q .      . Q . .
```

Har bir qatorda aynan bitta farzin bo'ladi, aks holda ikkitasi bir qatorda turib, bir-birini uradi. Demak, har bir qator uchun ustun tanlash yetarli.

Eng sodda yechim: oldingi darsdagi to'liq qidiruv bilan barcha $n^n$ ta tanlovni quramiz, oxirida tekshiramiz.

```cpp
int n, cnt = 0, col[13];          // col[r] — r-qatordagi farzin ustuni

bool good() {                     // oxirida butun taxtani tekshirish
    for (int i = 1; i <= n; i++)
        for (int j = i + 1; j <= n; j++)
            if (col[i] == col[j] || abs(col[i] - col[j]) == j - i) return false;
    return true;
}

void gen(int r) {
    if (r > n) { if (good()) cnt++; return; }
    for (int c = 1; c <= n; c++) { col[r] = c; gen(r + 1); }
}
```

Hisoblab ko'raylik. $n = 12$ da $12^{12} \approx 8.9 \cdot 10^{12}$ ta tanlov bor, har birini tekshirish yana $\approx 66$ juft. Bu $10^{14}$ dan ortiq amal — 1 soniyada $\approx 10^8$ amal bajarilishini eslasak, bir necha kun ishlaydi.

## G'oya

Sodda yechimning xatosi oddiy. Birinchi ikki farzinni bir ustunga qo'ydik deylik. Qolgan 10 ta qatorni qanday to'ldirmaylik, javob baribir noto'g'ri. Lekin sodda kod shu $12^{10}$ ta keraksiz variantni ham birma-bir quradi.

**Asosiy kuzatish: agar qisman qurilgan yechim allaqachon shartni buzsa, uni davom ettirishning ma'nosi yo'q — darhol orqaga qaytamiz.**

Bu yerda **qisman yechim (partial solution)** — yechimning hozircha qurilgan qismi. Masalan, faqat 1- va 2-qatorlarga farzin qo'yilgan holat.

Backtracking har bir qadamda to'rt ish qiladi:

1. **Tanlash.** Joriy qator uchun navbatdagi ustunni olamiz.
2. **Tekshirish.** Bu farzin oldingilar bilan to'qnashmasligini tekshiramiz. To'qnashsa — bu ustunni tashlab, keyingisiga o'tamiz.
3. **Chuqurlashish.** Tekshiruvdan o'tsa, farzinni qo'yamiz va keyingi qatorga rekursiv o'tamiz.
4. **Bekor qilish.** Rekursiyadan qaytgach, farzinni olib tashlaymiz. Shunda taxta keyingi ustunni sinash uchun avvalgi holatiga qaytadi.

Yuqoridagi 4-qadam — usulning nomi shundan: biz "orqaga qaytamiz" (back-track). Taxta holatini oldingi ko'rinishiga qaytarish **holatni tiklash (undo)** deyiladi.

Barcha tanlovlarni daraxt ko'rinishida tasavvur qilish qulay. Har bir uch — qisman yechim, undan chiquvchi shoxlar — keyingi qatordagi tanlovlar. Bu **qidiruv daraxti (search tree)** deyiladi. $n = 4$ uchun uning boshlanishi:

```text
                    (bo'sh)
          /        |        |        \
       r1=1      r1=2     r1=3     r1=4
       /  \        |
   r2=3   r2=4   r2=4
    ✗      |       |
         r3=2    r3=1
          ✗        |
                 r4=3  ✓ yechim
```

`✗` belgisi — bu uchdan pastga hech qanday davom yo'q. Daraxtning shu qismini butunlay tashlab yuborish **kesish (pruning)** deyiladi. Kesish qanchalik erta bo'lsa, shuncha ko'p ish tejaladi.

> [!NOTE]
> To'xtang va o'ylang: yangi farzin qo'yilganda u oldingi barcha farzinlar bilan to'qnashmasligini tekshirish uchun har safar $O(n)$ tsikl kerakmi?

Yo'q, uni $O(1)$ da qilish mumkin. Kichik misolni ko'raylik: $(1, 1)$ va $(3, 3)$ kataklar bir diagonalda yotadi, ikkalasida ham $r - c = 0$. $(1, 4)$ va $(3, 2)$ esa teskari diagonalda, ikkalasida $r + c = 5$. Demak, har bir diagonal bitta son bilan aniqlanadi:

| Yo'nalish | Bir chiziqda nima o'zgarmaydi | Qiymatlar oralig'i |
|---|---|---|
| Ustun | $c$ | $1 \dots n$ |
| Bosh diagonal ↘ | $r - c$ | $-(n-1) \dots n-1$ |
| Teskari diagonal ↙ | $r + c$ | $2 \dots 2n$ |

Uchta mantiqiy massiv tutamiz: band ustunlar, band ↘ diagonallar, band ↙ diagonallar. $r - c$ manfiy bo'lishi mumkin, shuning uchun indeksga $n$ qo'shamiz: $r - c + n$.

Nega bu usul hech bir yechimni o'tkazib yubormaydi? Biz faqat aniq noto'g'ri bo'lgan qisman yechimlarni tashlaymiz. To'g'ri yechimning har bir boshlang'ich qismi ham shartni buzmaydi, demak u hech qachon kesilmaydi va oxirigacha quriladi.

## Amalga oshirish

Qatorlar va ustunlar 1 dan $n$ gacha raqamlangan.

```cpp
#include <bits/stdc++.h>
using namespace std;

int n;
long long cnt = 0;
bool colUsed[15], diag1[30], diag2[30];   // ustun, r-c+n, r+c

void solve(int r) {
    // barcha qatorlar to'ldi — bitta yechim topildi
    if (r > n) {
        cnt++;
        return;
    }
    for (int c = 1; c <= n; c++) {
        // tekshirish: ustun yoki diagonal band bo'lsa — kesamiz
        if (colUsed[c] || diag1[r - c + n] || diag2[r + c]) continue;
        // tanlash: farzinni qo'yamiz
        colUsed[c] = diag1[r - c + n] = diag2[r + c] = true;
        // chuqurlashish: keyingi qator
        solve(r + 1);
        // bekor qilish: farzinni olib tashlaymiz
        colUsed[c] = diag1[r - c + n] = diag2[r + c] = false;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n;
    solve(1);
    cout << cnt << "\n";
    return 0;
}
```

Kodning muhim joylari:

- `continue` — kesishning o'zi. To'qnashuv bo'lsa, rekursiya chaqirilmaydi va daraxtning butun shoxi tashlanadi.
- "Qo'yish" va "olib tashlash" qatorlari bir-birining aynan ko'zgusi. Ular doim juft bo'lishi shart.
- `diag1` indeksi $r - c + n$ eng ko'pi $2n - 1$ ga, `diag2` indeksi $r + c$ eng ko'pi $2n$ ga yetadi. Shuning uchun massiv o'lchami $2n$ dan katta olingan.
- Holat global massivlarda saqlanadi. Har chaqiruvda nusxa olinmaydi, shuning uchun xotira tejaladi.

## Misol

$n = 4$ uchun kod ishini kuzataylik. Ustunda `qo'yilgan` — hozir taxtada turgan farzinlarning ustunlari (1-qatordan boshlab).

| Qadam | Qator $r$ | Ustun $c$ | Natija | Qo'yilgan |
|---|---|---|---|---|
| 1 | 1 | 1 | qo'yamiz | 1 |
| 2 | 2 | 1, 2 | ustun band, diagonal band | 1 |
| 3 | 2 | 3 | qo'yamiz | 1 3 |
| 4 | 3 | 1, 2, 3, 4 | hammasi band → orqaga | 1 3 |
| 5 | 2 | 3 | olib tashlaymiz | 1 |
| 6 | 2 | 4 | qo'yamiz | 1 4 |
| 7 | 3 | 1 | ustun band | 1 4 |
| 8 | 3 | 2 | qo'yamiz | 1 4 2 |
| 9 | 4 | 1, 2, 3, 4 | hammasi band → orqaga | 1 4 2 |
| 10 | 3 | 3, 4 | diagonal band, ustun band → orqaga | 1 4 |
| 11 | 2 | — | ustunlar tugadi → orqaga | 1 |
| 12 | 1 | 2 | qo'yamiz | 2 |
| 13 | 2 | 1, 2, 3 | diagonal, ustun, diagonal band | 2 |
| 14 | 2 | 4 | qo'yamiz | 2 4 |
| 15 | 3 | 1 | qo'yamiz | 2 4 1 |
| 16 | 4 | 1, 2 | ustun band | 2 4 1 |
| 17 | 4 | 3 | qo'yamiz, $r = 5 > n$ → `cnt = 1` | 2 4 1 3 |

Shu tarzda davom etsak, 1-qatorda 3-ustundan boshlangan shox ikkinchi yechimni beradi: `3 1 4 2`. 1-qatordagi 4-ustundan esa birorta ham yechim chiqmaydi. Natija: `cnt = 2`, testdagi javob bilan mos.

E'tibor bering: 4-qadamda 3-qatorda hech qanday ustun to'g'ri kelmadi. Shu sababli 4-qatorni umuman ko'rmadik — sodda yechim `1 3` bilan boshlanadigan $4 \cdot 4 = 16$ ta keraksiz to'liq variantni qurib, keyin tekshirgan bo'lardi.

## Murakkablik

Backtracking'ning aniq murakkabligini formula bilan yozish qiyin, chunki u qancha shox kesilishiga bog'liq. Eng yomon chegara — kesishsiz qidiruv daraxti: $O(n^n)$. Har bir qatorda faqat bo'sh ustunlarni hisoblasak, $O(n!)$ ga tushadi. Amalda esa bundan ancha kam.

Yuqoridagi kodda `for` ichidagi tekshiruvlar sonini o'lchab ko'raylik:

| $n$ | Yechimlar soni | Tekshiruvlar soni | $n^n$ (sodda yechim) |
|---|---|---|---|
| 4 | 2 | 60 | 256 |
| 8 | 92 | 15 720 | $\approx 1.7 \cdot 10^7$ |
| 12 | 14 200 | $\approx 10^7$ | $\approx 8.9 \cdot 10^{12}$ |

$n = 12$ da $10^7$ ta tekshiruv — $10^8$ dan ancha kam, dastur 0.1 soniyaga ham bormaydi. Har bir tekshiruv $O(1)$, chunki uchta massivga murojaat qilamiz.

Xotira: $O(n)$ — uchta massiv va rekursiya chuqurligi $n$ ga teng.

## Variantlar

### Birinchi yechim bilan to'xtash

Ba'zan barcha yechimlar emas, bittasi kerak bo'ladi. Funksiya `bool` qaytaradi: yechim topilsa `true`, va chaqiruvchi darhol undan chiqadi.

```cpp
bool solve(int r) {
    if (r > n) return true;
    for (int c = 1; c <= n; c++) {
        if (colUsed[c] || diag1[r - c + n] || diag2[r + c]) continue;
        colUsed[c] = diag1[r - c + n] = diag2[r + c] = true;
        pos[r] = c;                         // yechimni eslab qolamiz
        if (solve(r + 1)) return true;      // topildi — qolganini qidirmaymiz
        colUsed[c] = diag1[r - c + n] = diag2[r + c] = false;
    }
    return false;
}
```

### Yig'indi bo'yicha kesish

Masala: $n$ ta musbat sondan yig'indisi aynan $S$ bo'lgan barcha qism to'plamlarni toping. Agar joriy yig'indi $S$ dan oshib ketsa, keyingi musbat sonlar uni faqat oshiradi. Demak, bu shoxni kesamiz. Sonlarni avval o'sish tartibida saralasak, `break` bilan butun tsikldan ham chiqish mumkin.

```cpp
void go(int i, long long sum) {         // a[] o'sish tartibida saralangan
    if (sum == S) { cnt++; return; }
    for (int j = i; j < n; j++) {
        if (sum + a[j] > S) break;      // keyingilari bundan ham katta
        go(j + 1, sum + a[j]);
    }
}
```

Bu yerda holat `sum` parametrida uzatiladi, shuning uchun alohida "bekor qilish" kerak emas: rekursiyadan qaytganda `sum` o'z-o'zidan eski qiymatida qoladi.

### Javobga yetib bo'lmasligini oldindan bilish

Kesishni kuchaytirish mumkin: agar qolgan elementlar bilan ham maqsadga yetib bo'lmasa, to'xtaymiz. Masalan, eng ko'p yig'indini qidirayotganda "hozirgi yig'indi + qolgan barcha sonlar yig'indisi" topilgan eng yaxshi javobdan kichik bo'lsa, davom etish befoyda.

## Ko'p uchraydigan xatolar

> [!WARNING]
> **Holatni tiklashni unutish.**
> ```cpp
> colUsed[c] = true;
> solve(r + 1);
> // olib tashlash yo'q!
> ```
> Rekursiyadan qaytgach, `c` ustun band bo'lib qoladi. Keyingi barcha shoxlarda u "band" deb hisoblanadi va yechimlar yo'qoladi. To'g'ri: `solve(r + 1);` dan keyin `colUsed[c] = false;` yozing.

> [!WARNING]
> **Tekshiruvni rekursiyadan keyin qilish.**
> ```cpp
> if (r > n) { if (good()) cnt++; return; }
> ```
> Bu backtracking emas, sodda to'liq qidiruv: shox oxirigacha quriladi, keyin tashlanadi. Tekshiruv yangi bo'lak qo'yilishidan oldin bo'lishi kerak — `continue` bilan.

> [!WARNING]
> **Manfiy indeks.**
> ```cpp
> diag1[r - c] = true;   // r = 1, c = 4 bo'lsa, indeks -3
> ```
> Massivdan tashqariga yozish dasturni buzadi yoki boshqa o'zgaruvchini o'zgartiradi. To'g'ri: `diag1[r - c + n]`, massiv o'lchami esa kamida $2n$.

> [!WARNING]
> **"Qo'yish" va "olib tashlash" mos kelmasligi.**
> ```cpp
> colUsed[c] = diag1[r - c + n] = diag2[r + c] = true;
> solve(r + 1);
> colUsed[c] = diag1[r - c + n] = false;   // diag2 unutildi
> ```
> Uchta belgidan bittasi tiklanmay qoladi. Eng ishonchli yo'l — ikkala qatorni bir xil ko'rinishda, yonma-yon yozish va ko'chirib olish.

## Xulosa

- Backtracking — to'liq qidiruv, lekin noto'g'ri qisman yechim darhol tashlanadi.
- Har qadam to'rt bosqichdan iborat: tanlash → tekshirish → chuqurlashish → bekor qilish.
- Tekshiruv qancha erta va qancha tez ($O(1)$) bo'lsa, shuncha ko'p shox kesiladi.
- Global holatni o'zgartirsangiz, rekursiyadan keyin uni albatta tiklang.

**Masalada qanday tanib olish mumkin:** chegaralar juda kichik ($n \le 10 \dots 20$); "barcha joylashtirishlarni sanang", "biror usul bormi?", "barcha kombinatsiyalarni chiqaring" kabi so'zlar; javob qadamma-qadam quriladi va har qadamda shart buzilganini sezish mumkin.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Backtracking | backtracking | Yechimni bo'lakma-bo'lak quradigan, xato bo'lakda orqaga qaytadigan qidiruv usuli. |
| Qisman yechim | partial solution | Yechimning hozircha qurilgan, hali tugallanmagan qismi. |
| Qidiruv daraxti | search tree | Har bir uchi qisman yechim, shoxlari esa keyingi tanlovlar bo'lgan daraxt. |
| Kesish | pruning | Natija bermasligi aniq bo'lgan shoxni oxirigacha qurmasdan tashlab yuborish. |
| Holatni tiklash | undo | Rekursiyadan qaytgach, o'zgartirilgan ma'lumotlarni avvalgi ko'rinishiga qaytarish. |

> [!TIP] O'zingizni tekshiring
> 1. Agar `solve` ichidagi "olib tashlash" qatorini o'chirsak, $n = 4$ uchun dastur nima chiqaradi va nega?
> 2. Farzinlar masalasida nega har bir qator uchun alohida tekshirish shart emas?
> 3. Yig'indi bo'yicha kesishda `break` ishlatish uchun nega massiv saralangan bo'lishi kerak?
>
> <details>
> <summary>Javoblar</summary>
>
> 1. `0` chiqaradi. Birinchi farzin qo'yilgandan keyin uning ustuni va diagonallari hech qachon bo'shamaydi, taxta tez orada "to'lib" qoladi va birorta ham to'liq joylashtirish topilmaydi.
> 2. Har bir qatorga aynan bitta farzin qo'yamiz, shuning uchun ikki farzin hech qachon bir qatorda bo'lmaydi.
> 3. Saralangan massivda `a[j]` dan keyingi barcha sonlar undan katta yoki teng. Agar `a[j]` bilan yig'indi $S$ dan oshsa, keyingilari bilan ham oshadi — ularni sinab ko'rishning keragi yo'q.
>
> </details>
