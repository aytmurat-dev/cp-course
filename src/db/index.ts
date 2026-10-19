import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL o'rnatilmagan (.env.local yoki Vercel env)");
  return drizzle(neon(url), { schema });
}

let instance: ReturnType<typeof createDb> | undefined;

/** Birinchi murojaatda ulanadi — build vaqtida DATABASE_URL bo'lmasa ham xato bermaydi. */
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    instance ??= createDb();
    return Reflect.get(instance, prop, instance);
  },
});

export * from "./schema";
