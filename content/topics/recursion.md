---
summary: "Raqamlar yig'indisi va Hanoi minoralari misolida rekursiyani tuzish hamda vaqt va xotira cheklovlariga qarab sikl yoki rekursiyani tanlash."
prerequisites: [brute-force]
---

## Kirish

4096 sonining raqamlari yig'indisini topmoqchimiz. Oxirgi raqam 6 ekanini bilsak, qolgan ish — 409 sonining raqamlari yig'indisini topish. Kichraygan sonda ham ayni savol takrorlanadi. Shu darsda siz bunday bog'lanishni funksiyaga aylantirasiz, chaqiruvlar qayerda to'xtashi va javob qanday qaytishini kuzatasiz.

## Muammo

Manfiy bo'lmagan $n$ butun son berilgan. Uning o'nlik yozuvidagi raqamlar yig'indisini chiqaring.

- **Kirish:** bitta butun son $n$.
- **Chiqish:** raqamlar yig'indisi.
- **Cheklovlar:** $0 \le n \le 10^{18}$.
- Vaqt chegarasi: 1 soniya. Xotira chegarasi: 256 MB.

Kirish:

```text
4096
```

Chiqish:

```text
19
```

Chunki $4+0+9+6=19$. Buni sikl bilan ham yechish mumkin: oxirgi raqamni yig'indiga qo'shib, sondan olib tashlaymiz. Bu darsda xuddi shu ishni kichikroq son uchun javob qaytaradigan funksiya orqali ifodalaymiz. Maqsad — rekursiya qanday ishlashini ko'rish; bu masalada sikl ham yaxshi yechim.

## G'oya

### Javobni kichikroq masalaga bog'lash

C++ da `4096 % 10` natijasi 6, `4096 / 10` natijasi esa 409 bo'ladi. Butun sonlarni bo'lishda kasr qismi tashlab yuboriladi. Demak, `% 10` bilan oxirgi raqamni olamiz, `/ 10` bilan uni olib tashlaymiz.

Raqamlar yig'indisini qaytaradigan funksiyani `digitSum` deb ataymiz. `digitSum(409)` natijasi 13 bo'lsa, `digitSum(4096)` natijasi $6+13=19$ bo'lishi kerak.

**Sonning raqamlari yig'indisi — uning oxirgi raqami va qolgan son raqamlari yig'indisining yig'indisi.** Buni quyidagicha yozamiz:

```text
digitSum(4096) = 6 + digitSum(409)
digitSum(409)  = 9 + digitSum(40)
digitSum(40)   = 0 + digitSum(4)
digitSum(4)    = 4 + digitSum(0)
```

Funksiyaning o'zini o'zi chaqirishi **rekursiya (recursion)** deyiladi. Bu yerda `digitSum` o'zidan kichikroq son uchun yana `digitSum` ni chaqiradi.

### Qayerda to'xtaymiz?

0 sonining raqamlari yig'indisi 0. Bu javobni yana funksiya chaqirmasdan qaytaramiz. **Asos holati (base case)** — javobi bevosita qaytariladigan, yangi rekursiv chaqiruv kerak bo'lmagan holat.

Qolgan sonlarda oxirgi raqamni olib, funksiyani qolgan qism uchun chaqiramiz. Bu **rekursiv qadam (recursive step)** — javobni kichikroq masalaning javobidan quradigan qism.

> [!NOTE]
> To'xtang va o'ylang: `n == 0` tekshiruvini yozmasak, chaqiruvlar qayergacha davom etadi?

`digitSum(0)` ham `digitSum(0 / 10)`, ya'ni yana `digitSum(0)` ni chaqiradi. Argument o'zgarmaydi va hech bir chaqiruv javob qaytarishga yetib bormaydi. Demak, faqat sonni kichraytirish yetmaydi: to'xtash holati ham zarur.

Musbat $n$ uchun `n / 10` doim $n$ dan kichik. Har safar oxirgi raqam olib tashlangani uchun bir payt 0 ga yetamiz. Masala faqat manfiy bo'lmagan sonlarni qabul qiladi; funksiyaning ishlashini ham shu sohada asoslaymiz.

### Chaqirish va qaytish

`digitSum(4096)` natijani darhol bilmaydi: avval `digitSum(409)` tugashi kerak. U tugamaguncha tashqi chaqiruv kutadi. Ichki chaqiruv tugagach, tashqi chaqiruv ishini qolgan joyidan davom ettiradi.

```text
digitSum(4096)  6 + ? ni kutadi
  digitSum(409) 9 + ? ni kutadi
    digitSum(40) 0 + ? ni kutadi
      digitSum(4) 4 + ? ni kutadi
        digitSum(0) → 0
      digitSum(4) → 4 + 0 = 4
    digitSum(40) → 0 + 4 = 4
  digitSum(409) → 9 + 4 = 13
digitSum(4096) → 6 + 13 = 19
```

Bu chaqiruvlarning har biri o'zining `n` qiymatiga ega. Ichki chaqiruvda `n=409` bo'lishi tashqi chaqiruvdagi `n=4096` ni o'zgartirmaydi. Bu kodda parametr qiymat bo'yicha uzatiladi.

Kompyuter tugamagan chaqiruvlarning davom etish joyi va mahalliy ma'lumotlarini **chaqiruvlar steki (call stack)** orqali saqlaydi. Oxirgi boshlangan chaqiruv birinchi tugaydi. Bir vaqtda faol turgan rekursiv chaqiruvlarning eng katta sonini shu darsda **rekursiya chuqurligi (recursion depth)** deb hisoblaymiz. Yuqoridagi misolda `digitSum(0)` ham qo'shilganda chuqurlik 5.

### Nega javob to'g'ri?

0 uchun funksiya to'g'ri javob — 0 ni qaytaradi. Endi kichikroq sonning raqamlari yig'indisi to'g'ri hisoblangan deb olaylik. Har qanday musbat sonni $n=10q+r$ ko'rinishida yozish mumkin. Bu yerda $r$ oxirgi raqam, $q$ esa qolgan raqamlardan tuzilgan son. Demak, $q$ ning raqamlari yig'indisiga $r$ ni qo'shish bilan har bir raqamni aynan bir marta hisobga olamiz.

Bizning funksiya aynan shu ishni qiladi: `n % 10` ni `digitSum(n / 10)` natijasiga qo'shadi. Har bir musbat son kichrayib asos holatiga yetgani uchun hisob qaytishda ham to'g'ri davom etadi. Bu yerda to'g'rilik uch narsaga tayanadi: asos holati, kichikroq masalaga o'tish va javoblarni to'g'ri birlashtirish.

## Amalga oshirish

```cpp
#include <bits/stdc++.h>
using namespace std;

int digitSum(long long n) {
    // Asos holati: boshqa raqam qolmadi.
    if (n == 0) return 0;

    int last = n % 10;
    // Kichikroq sonning javobini kutamiz.
    int rest = digitSum(n / 10);
    return last + rest;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long n;
    cin >> n;
    cout << digitSum(n) << '\n';
    return 0;
}
```

- `n` uchun `long long` kerak: kiruvchi son $10^{18}$ gacha boradi.
- Javob uchun `int` yetadi. Ko'pi bilan 19 ta raqam bor; hatto har birini 9 deb baholasak ham yig'indi 171 dan oshmaydi.
- `rest` ichki chaqiruv qaytargan natijani saqlaydi. Uning qiymati olinmaguncha keyingi `return` bajarilmaydi.
- `return` faqat joriy chaqiruvni tugatadi. Uni chaqirgan funksiya o'z ishini davom ettiradi.

## Misol

Kirishdagi 4096 soni uchun qaytish bosqichini jadvalda kuzataylik. `last` va `rest` har bir chaqiruvning o'ziga tegishli.

| Tugayotgan chaqiruv | `last` | Ichki chaqiruv qaytargan `rest` | Qaytadigan qiymat |
|---|---|---|---|
| `digitSum(0)` | Hisoblanmaydi | Chaqiruv yo'q | 0 |
| `digitSum(4)` | 4 | 0 | 4 |
| `digitSum(40)` | 0 | 4 | 4 |
| `digitSum(409)` | 9 | 4 | 13 |
| `digitSum(4096)` | 6 | 13 | 19 |

Oxirgi 19 qiymati `main` ga qaytadi va ekranga chiqariladi. O'rtadagi 0 raqami ham yo'qolmagan: u yig'indiga 0 qo'shgan. Kirishning o'zi 0 bo'lsa, funksiya darhol 0 qaytaradi.

## Murakkablik

Musbat sonning o'nlik yozuvida $d$ ta raqam bo'lsin. Har chaqiruv bitta raqamni ajratadi. Oxirida yana bitta chaqiruv 0 ni qaytaradi. Har bir qadam $O(1)$ vaqt oladi, demak jami vaqt $O(d)$. Eng chuqur nuqtada barcha $d+1$ ta chaqiruv faol bo'lgani uchun stekka $O(d)$ joy kerak. Berilgan cheklovda son ko'pi bilan 19 raqamli, ya'ni chuqurlik ko'pi bilan 20.

### Shu hisobni sikl bilan bajarsak-chi?

```cpp
int digitSumLoop(long long n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}
```

4096 uchun sikl 6, 9, 0, 4 raqamlarini shu tartibda oladi. Har qadamdan keyin `sum` qiymati mos ravishda 6, 15, 15, 19 bo'ladi. Rekursiv funksiya ajratilgan raqamlarni qaytishda qo'shgan edi. Siklda esa yig'indi darhol yangilanadi, shuning uchun oldingi qadamlarni saqlashga hojat yo'q. Kirishda 0 berilsa, siklga kirmaymiz va boshlang'ich yig'indi 0 qaytadi.

**Vaqt limiti (time limit).** Ikkala yechim ham har bir raqamga bir marta murojaat qiladi va $O(d)$ vaqt oladi. Funksiyani chaqirish va undan qaytish qo'shimcha vaqt olishi mumkin. Bitta 19 raqamli son uchun bu farq juda kichik. Tarmoqlanuvchi masalada esa vaqtni baholash uchun barcha shoxlarda bajariladigan ishni qo'shib chiqing.

**Xotira limiti (memory limit).** Siklga son va joriy yig'indini saqlash kifoya, ya'ni qo'shimcha xotira $O(1)$. Rekursiyada esa eng chuqur nuqtada nechta chaqiruv faol bo'lishini va har birida nima saqlanishini tekshiring. Masaladagi 256 MB butun dastur uchun berilgan. Chaqiruvlar stekining o'z chegarasi bo'lishi mumkin, shuning uchun umumiy xotira hali yetarli bo'lsa ham, chuqur rekursiya dasturni bajarilish xatosi bilan to'xtatishi mumkin.

## Variantlar

### Amalni chaqiruvdan oldin yoki keyin bajarish

123 sonining raqamlarini chapdan o'ngga chiqarish uchun avval 12 ning raqamlarini chiqaramiz, keyin 3 ni. Bunda chiqarish amali rekursiv chaqiruvdan keyin turadi. Quyidagi funksiya $0\le n\le10^{18}$ uchun ishlaydi:

```cpp
void printDigits(long long n) {
    if (n >= 10) printDigits(n / 10);
    cout << n % 10 << ' ';
}
```

`printDigits(123)` avval `printDigits(12)`, u esa `printDigits(1)` ni chaqiradi. So'ng 1, 2, 3 shu tartibda chiqadi. `printDigits(0)` esa 0 chiqaradi: asos holati har doim alohida `return` bilan yozilishi shart emas.

`cout` ni `if` dan oldinga ko'chirsak, 3, 2, 1 chiqadi. Demak, chaqiruvning oldidagi ish ichkariga kirishda, keyingisi esa qaytishda bajariladi. Bu funksiya qiymat qaytarmaydi, chiqarish amalini bajaradi.

### Hanoi minoralari

**Masala sharti.** Uchta qoziq 1, 2 va 3 raqamlari bilan belgilangan. Dastlab 1-qoziqda har xil kattalikdagi $k$ ta disk bor. Eng katta disk pastda, qolganlari esa kattaligiga qarab kichrayib boradigan tartibda uning ustiga terilgan. 2- va 3-qoziqlar bo'sh.

Barcha disklarni 1-qoziqdan 3-qoziqqa **eng kam yurish bilan** ko'chiring. 2-qoziqdan yordamchi sifatida foydalanishingiz mumkin. Har bir yurishda quyidagi ikki qoidaga rioya qiling:

1. Istalgan qoziqning faqat eng yuqoridagi bitta diskini olib, boshqa qoziqqa ko'chiring.
2. Olingan diskni bo'sh qoziqqa yoki o'zidan kattaroq diskning ustiga qo'ying.

**Kirish.** Bitta butun son $k$ ($0 le k le 15$) — disklar soni.

**Chiqish.** Har bir yurish uchun alohida satrda bo'sh joy bilan ajratilgan ikkita son `a b` chiqaring. Bu yurishda disk `a` raqamli qoziqdan `b` raqamli qoziqqa ko'chiriladi. Satrlarni yurishlar bajariladigan tartibda chiqaring. Agar $k=0$ bo'lsa, chiqish bo'sh bo'ladi.

**Kirish namunasi**

```text
2
```

**Chiqish namunasi**

```text
1 2
1 3
2 3
```

Katta diskni 3-qoziqqa o'tkazish uchun avval uning ustidagi kichik diskni 2-qoziqqa olib turamiz (`1 2`). Endi katta diskning yo'li ochiq (`1 3`). Oxirida kichik diskni uning ustiga qo'yamiz (`2 3`).

**Rekursiv yechim.** Eng katta diskni boshlang'ich qoziqdan maqsad qoziqqa o'tkazish paytida qolgan $k-1$ ta disk yordamchi qoziqda turishi kerak. Shuning uchun avval $k-1$ ta diskni yordamchi qoziqqa ko'chiramiz. Keyin eng katta diskni maqsad qoziqqa o'tkazamiz. Oxirida yordamchi qoziqdagi $k-1$ ta diskni uning ustiga ko'chiramiz. Birinchi va oxirgi qadamda yana o'sha masalani yechamiz, faqat disklar soni va qoziqlarning vazifalari o'zgaradi.

`from` — boshlang'ich qoziq, `to` — maqsad qoziq, `via` — yordamchi qoziq. Kirishdan `k` ni o'qigach, `hanoi(k, 1, 3, 2)` ni chaqiramiz.

```cpp
void hanoi(int k, int from, int to, int via) {
    if (k == 0) return;

    hanoi(k - 1, from, via, to);
    cout << from << ' ' << to << '\n';
    hanoi(k - 1, via, to, from);
}
```

Birinchi ichki chaqiruv **to'liq tugagach**, o'rtadagi yurish chiqariladi. Shundan keyingina ikkinchi chaqiruv boshlanadi. Ikki shox bir vaqtda bajarilmaydi. Yuqoridagi disklar kichik bo'lgani uchun ularni eng katta disk ustiga qo'yish qoidani buzmaydi; $k=0$ holatida ko'chirish kerak emas.

Yurishlar soni 0 diskda 0, 1 diskda 1, 2 diskda 3, 3 diskda 7. Har safar oldingi sondan ikki baravar ko'p va yana bitta yurish bajariladi: $M(k)=2M(k-1)+1$. Kichikroq qiymatlar orqali berilgan bunday bog'lanish **rekursiv munosabat (recurrence relation)** deyiladi. Undan $M(k)=2^k-1$ kelib chiqadi.

Bu kodda asos holatlari bilan jami $2^{k+1}-1$ ta chaqiruv bor, vaqt $O(2^k)$. Ammo bir vaqtda ko'pi bilan $k+1$ ta `hanoi` chaqiruvi faol: stek $O(k)$. Yurishlarni ro'yxatga yig'may, darhol chiqarayotganimiz uchun ularni saqlashga qo'shimcha joy ketmaydi.

### Qachon sikl, qachon rekursiya qulay?

| Masalaning tuzilishi | Tanlov va sababi |
|---|---|
| Massiv yig'indisi kabi har qadamda faqat navbatdagi elementga o'tamiz. | Sikl qulay. Indeks va joriy yig'indi kifoya, hatto millionta elementda ham qo'shimcha xotira $O(1)$. |
| Hanoi minoralaridagi kabi bir kichik masaladan qaytib, amal bajarib, keyin boshqasiga o'tamiz. | Chuqurlik kichik bo'lsa, rekursiya qulay. Har bir chaqiruv qaysi qoziqlar bilan ishlayotganini va qaytgach qayerdan davom etishini saqlaydi. |
| Daraxt shoxlarini ko'rish kerak, lekin daraxt bitta uzun zanjir bo'lishi ham mumkin. | Sikl va alohida stek ishlating. Ko'rilishi kerak bo'lgan tugunlarni o'zingiz saqlaysiz. Bu funksiya stekiga tushadigan yukni kamaytiradi, alohida stekdagi tugunlar esa umumiy xotiradan joy oladi. |

Hanoi misolida 15 ta disk uchun eng chuqur nuqtada atigi 16 ta chaqiruv faol, lekin dastur 32 767 ta yurishni chiqaradi. Agar vaqtning asosiy qismi chiqarishga ketsa, siklga o'tish bilan bu xarajatni yo'qota olmaymiz. Avval masala barcha yurishlarni so'rayaptimi yoki faqat ularning soninimi, shuni aniqlang.

## Ko'p uchraydigan xatolar

### Kichrayish bilan to'xtashni bir xil deb o'ylash

Argument kamayishi asos holatiga yetishni kafolatlamaydi. Masalan, faqat `n == 0` da to'xtab, har safar `n - 2` ni chaqirsak, 5 dan $5,3,1,-1,\dots$ ketma-ketligi hosil bo'ladi. To'xtash sharti bilan qadamni birga tekshiring. Shartni shunchaki `n <= 0` ga almashtirishdan oldin manfiy holat uchun qanday javob kerakligini aniqlang.

### O'sha argumentni yana uzatish

`digitSum(n)` ichida yana `digitSum(n)` chaqirilsa, masala kichraymaydi. To'g'ri qadam — `digitSum(n / 10)`. Shuningdek, `f(n--)` eski qiymatni uzatadi; kichraygan argument kerak bo'lsa, uni aniq `f(n - 1)` deb yozing.

### Hisoblangan natijani qaytarmaslik

`last + rest;` ifodasi natijani hisoblaydi, ammo chaqiruvchiga bermaydi. Qiymat qaytaruvchi funksiyada `return last + rest;` kerak. C++ da bunday funksiyaning oxiriga qiymat qaytarmasdan yetish noto'g'ri ishlashga olib keladi.

### Chuqurlikni tekshirmaslik

> [!WARNING]
> Stek uchun ajratilgan xotira cheklangan. Chaqiruvlar unga sig'may qolishi **stekning to'lib ketishi (stack overflow)** deyiladi. Barcha muhitlar uchun xavfsiz bitta chuqurlik yo'q: u stek hajmi va har bir chaqiruvdagi ma'lumotga bog'liq.

Eng katta kirish qiymati uchun asos holatigacha necha qadam borligini hisoblang. Masalan, 1 000 000 dan 0 gacha bittadan kamayish 1 000 001 ta faol chaqiruvga olib kelishi mumkin. C++ kompilyatori bunday chaqiruvlarni siklga aylantirishiga kafolat yo'q.

## Xulosa

- Funksiya nimani qaytarishini yoki qanday amal bajarishini oldindan aniq ayting.
- Asos holatini belgilang va har bir chaqiruv shu holatga yetishini tekshiring.
- Ichki chaqiruv tugagach, tashqi chaqiruv qolgan ishini davom ettiradi.
- Vaqt uchun jami ishni, stek uchun bir vaqtdagi chaqiruvlar va ulardagi ma'lumotni hisoblang.

**Qachon rekursiyani o'ylab ko'rish kerak?** Katta masalani xuddi shu turdagi kichikroq masalalarga ajratish mumkin bo'lsa. Keyingi backtracking darsida bu xususiyatdan tanlovlarni qadamma-qadam qurishda foydalanamiz.

### Atamalar

| Atama | Inglizcha | Ma'nosi |
|---|---|---|
| Rekursiya | Recursion | Funksiyaning o'zini o'zi chaqirishi. |
| Asos holati | Base case | Yangi rekursiv chaqiruvsiz hal qilinadigan holat. |
| Rekursiv qadam | Recursive step | Javobni kichikroq masalaning javobidan qurish qismi. |
| Chaqiruvlar steki | Call stack | Tugamagan chaqiruvlarning davom etish joyi va mahalliy ma'lumotlari saqlanadigan tuzilma. |
| Rekursiya chuqurligi | Recursion depth | Bir vaqtda faol turgan rekursiv chaqiruvlarning eng katta soni. |
| Rekursiv munosabat | Recurrence relation | Qiymatni kichikroq holatlarning qiymatlari orqali ifodalovchi bog'lanish. |
| Stekning to'lib ketishi | Stack overflow | Chaqiruvlar uchun kerakli xotiraning ajratilgan stekka sig'may qolishi. |

### O'zingizni tekshiring

1. `digitSum(1000)` qanday javob qaytaradi? Asos holati bilan nechta chaqiruv bajariladi?
2. Ichki `digitSum(40)` chaqiruvi tashqi `digitSum(409)` ning `n` qiymatini 40 ga almashtiradimi?
3. `printDigits(507)` nimani chiqaradi? `cout` rekursiv chaqiruvdan oldinga o'tkazilsa-chi?
4. `hanoi(3, 1, 3, 2)` uchun yurishlar soni, jami chaqiruvlar soni va eng katta chuqurlik nechta?
5. 200 000 ta element yig'indisini topishda sikl va elementlarni bittadan qo'shadigan rekursiya vaqt va qo'shimcha xotira bo'yicha qanday farq qiladi?

<details>
<summary>Javoblarni ko'rish</summary>

1. Javob 1. Chaqiruvlar: 1000, 100, 10, 1, 0 — jami 5 ta.
2. Yo'q. Bu kodda har bir chaqiruv o'zining qiymat bo'yicha uzatilgan parametriga ega. Ichki chaqiruv qaytgach, tashqisida `n` hamon 409.
3. Avvalgi kod `5 0 7` chiqaradi. `cout` oldinga o'tsa, `7 0 5` chiqadi.
4. 7 ta yurish, asos holatlari bilan 15 ta chaqiruv. Eng katta chuqurlik 4: $k=3,2,1,0$ holatlari bir vaqtda faol bo'ladi.
5. Ikkalasi ham har bir elementni bir marta o'qiydi va $O(n)$ vaqt oladi. Siklga $O(1)$ qo'shimcha xotira yetadi. Rekursiyada chuqurlik 200 000 ga yaqinlashadi va stek to'lishi mumkin. Shu cheklovda siklni tanlaymiz.

</details>
