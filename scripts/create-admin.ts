/**
 * Admin akkauntini yaratadi yoki parolini yangilaydi.
 *   npm run admin -- <login> <parol> ["Ism Familiya"]
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

async function main() {
  const [username, password, name = "Admin"] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Foydalanish: npm run admin -- <login> <parol> ["Ism Familiya"]');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Admin paroli kamida 8 belgi bo'lsin");
    process.exit(1);
  }
  const { db, users } = await import("../src/db");
  const passwordHash = await bcrypt.hash(password, 10);
  await db
    .insert(users)
    .values({ username: username.toLowerCase(), name, passwordHash, role: "admin" })
    .onConflictDoUpdate({
      target: users.username,
      set: { passwordHash, role: "admin", name, sessionVersion: sql`${users.sessionVersion} + 1` },
    });
  console.log(`✓ Admin tayyor: ${username.toLowerCase()}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
