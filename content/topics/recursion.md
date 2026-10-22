---
summary: "Kichikroq masala orqali javob topish, rekursiv chaqiruvlardan qaytish va stek sarfini baholash."
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

0 uchun funksiya to'g'ri javob — 0 ni qaytaradi. Endi kichikroq sonning raqamlari yig'indisi to'g'ri hisoblangan deb olaylik. Uning oldiga emas, oxiriga qo'shilgan raqamni yig'indiga qo'shsak, butun sonning raqamlari yig'indisi chiqadi.

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

Sonning raqamlari sonini $d$ deb olaylik. Musbat son uchun $d$ ta raqamli chaqiruv va bitta asos holati bor. Har birida, ichki chaqiruv sarfini alohida hisoblaganda, o'zgarmas miqdorda ish bajariladi. Vaqt $O(d)$, stek xotirasi ham $O(d)$.

Bizning cheklovlarda musbat son ko'pi bilan 19 raqamli. Demak, asos holati bilan ko'pi bilan 20 ta chaqiruv faol turadi. $n=0$ uchun bitta chaqiruv yetadi.

Oldingi darsdagi murakkablik bahosini qo'llashda **jami chaqiruvlar soni** va **bir vaqtdagi chaqiruvlar soni**ni ajrating. Birinchisi vaqtni, ikkinchisi stek sarfini baholashga yordam beradi. Agar har bir chaqiruv katta massiv yaratsa, uning xotirasini ham qo'shish kerak.

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

### Bir chaqiruv ichida ikkita kichik masala

Hanoi minoralarida uchta qoziq bor. Birinchi qoziqdagi disklar pastdan yuqoriga kattadan kichikka joylashgan. Ularni uchinchi qoziqqa ko'chiramiz: faqat tepadagi disk olinadi va katta disk kichik disk ustiga qo'yilmaydi.

Ikki diskda uch yurish yetadi: kichigini 1 dan 2 ga, kattasini 1 dan 3 ga, kichigini 2 dan 3 ga ko'chiramiz. Uch diskda esa katta diskka tegishdan oldin uning ustidagi ikkita diskni yordamchi qoziqqa o'tkazish kerak.

Shundan umumiy reja keladi: yuqoridagi $k-1$ diskni yordamchi qoziqqa o'tkazamiz, eng kattasini maqsad qoziqqa ko'chiramiz, keyin $k-1$ diskni uning ustiga o'tkazamiz. Quyidagi funksiya shu yurishlarni chiqaradi; disklar sonini kichik, masalan $0\le k\le15$ deb olamiz.

```cpp
void hanoi(int k, int from, int to, int via) {
    if (k == 0) return;

    hanoi(k - 1, from, via, to);
    cout << from << ' ' << to << '\n';
    hanoi(k - 1, via, to, from);
}
```

`hanoi(2, 1, 3, 2)` quyidagini chiqaradi:

```text
1 2
1 3
2 3
```

Birinchi ichki chaqiruv **to'liq tugagach**, o'rtadagi yurish chiqariladi. Shundan keyingina ikkinchi chaqiruv boshlanadi. Ikki shox bir vaqtda bajarilmaydi. Yuqoridagi disklar kichik bo'lgani uchun ularni eng katta disk ustiga qo'yish qoidani buzmaydi; $k=0$ holatida ko'chirish kerak emas.

Yurishlar soni 0 diskda 0, 1 diskda 1, 2 diskda 3, 3 diskda 7. Har safar oldingi sondan ikki baravar ko'p va yana bitta yurish bajariladi: $M(k)=2M(k-1)+1$. Kichikroq qiymatlar orqali berilgan bunday bog'lanish **rekursiv munosabat (recurrence relation)** deyiladi. Undan $M(k)=2^k-1$ kelib chiqadi.

Bu kodda asos holatlari bilan jami $2^{k+1}-1$ ta chaqiruv bor, vaqt $O(2^k)$. Ammo bir vaqtda ko'pi bilan $k+1$ ta `hanoi` chaqiruvi faol: stek $O(k)$. Yurishlarni ro'yxatga yig'may, darhol chiqarayotganimiz uchun ularni saqlashga qo'shimcha joy ketmaydi.

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

Masalan, millionta massiv elementini bittadan rekursiv qo'shish millionga yaqin chuqurlik talab qiladi. Bunday oddiy hisobda sikl qulayroq. Bizning raqamlar yig'indisi misolimizda esa chuqurlik ko'pi bilan 20. Dastur rekursiyani avtomatik siklga aylantiradi deb hisoblamang.

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

<details>
<summary>Javoblarni ko'rish</summary>

1. Javob 1. Chaqiruvlar: 1000, 100, 10, 1, 0 — jami 5 ta.
2. Yo'q. Bu kodda har bir chaqiruv o'zining qiymat bo'yicha uzatilgan parametriga ega. Ichki chaqiruv qaytgach, tashqisida `n` hamon 409.
3. Avvalgi kod `5 0 7` chiqaradi. `cout` oldinga o'tsa, `7 0 5` chiqadi.
4. 7 ta yurish, asos holatlari bilan 15 ta chaqiruv. Eng katta chuqurlik 4: $k=3,2,1,0$ holatlari bir vaqtda faol bo'ladi.

</details>
