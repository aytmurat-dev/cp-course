/**
 * content/topics/*.md fayllarini tekshiradi:
 *  - frontmatter formati, takrorlangan order/slug, prerequisites
 *  - masalalar haqiqatan mavjudmi (Codeforces / AtCoder API orqali)
 *
 *   npm run check-content
 *   npm run check-content -- --offline   (faqat format, tarmoqsiz)
 */
import fs from "node:fs";
import path from "node:path";
import { parseTopic, type Topic } from "../src/lib/topic-parser";

const DIR = path.join(process.cwd(), "content", "topics");
const offline = process.argv.includes("--offline");

let errors = 0;
let warnings = 0;
const err = (m: string) => (errors++, console.log(`  ✗ ${m}`));
const warn = (m: string) => (warnings++, console.log(`  ! ${m}`));

async function main() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const topics: Topic[] = [];

  console.log(`\n${files.length} ta mavzu fayli tekshirilmoqda…\n`);
  for (const f of files) {
    try {
      topics.push(parseTopic(f, fs.readFileSync(path.join(DIR, f), "utf8")));
    } catch (e) {
      err((e as Error).message);
    }
  }

  const slugs = new Set(topics.map((t) => t.slug));
  const orders = new Map<number, string>();
  const problemOwner = new Map<string, string>();

  for (const t of topics) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug)) err(`${t.slug}: fayl nomi kebab-case bo'lsin (masalan prefix-sums.md)`);
    if (orders.has(t.order)) err(`${t.slug}: order=${t.order} "${orders.get(t.order)}" bilan bir xil`);
    orders.set(t.order, t.slug);
    for (const p of t.prerequisites) if (!slugs.has(p)) err(`${t.slug}: prerequisites'da noma'lum mavzu "${p}"`);
    if (/^#\s/m.test(t.body)) err(`${t.slug}: matnda "# " (H1) bo'lmasin — sarlavha frontmatter'dan olinadi`);
    if (/^##\s+Masalalar\s*$/m.test(t.body)) warn(`${t.slug}: "## Masalalar" bo'limini yozmang — u avtomatik chiqadi`);
    if (t.problems.length < 3) warn(`${t.slug}: masalalar soni ${t.problems.length} (kamida 5 tavsiya etiladi)`);
    for (const p of t.problems) {
      if (problemOwner.has(p.key)) warn(`${t.slug}: ${p.key} "${problemOwner.get(p.key)}" mavzusida ham bor`);
      problemOwner.set(p.key, t.slug);
    }
  }

  if (!offline) await checkProblemsExist(topics);

  console.log(`\nNatija: ${errors} xato, ${warnings} ogohlantirish\n`);
  process.exit(errors ? 1 : 0);
}

async function checkProblemsExist(topics: Topic[]) {
  const all = topics.flatMap((t) => t.problems.map((p) => ({ ...p, topic: t.slug })));
  console.log("\nMasalalar platformalarda tekshirilmoqda…");

  if (all.some((p) => p.platform === "codeforces")) {
    const res = await fetch("https://codeforces.com/api/problemset.problems").then((r) => r.json());
    const names = new Map<string, string>();
    for (const p of res.result.problems) names.set(`cf:${p.contestId}${p.index}`, p.name);
    for (const p of all.filter((p) => p.platform === "codeforces")) {
      const contest = Number(p.key.slice(3).match(/^\d+/)![0]);
      if (contest >= 100000) continue; // gym masalalari ro'yxatda yo'q
      if (!names.has(p.key)) err(`${p.topic}: Codeforces masala topilmadi — ${p.url}`);
      else if (!sameTitle(names.get(p.key)!, p.title)) warn(`${p.topic}: ${p.key} asl nomi "${names.get(p.key)}", siz "${p.title}" deb yozgansiz`);
    }
  }

  if (all.some((p) => p.platform === "atcoder")) {
    const list = await fetch("https://kenkoooo.com/atcoder/resources/problems.json").then((r) => r.json());
    const names = new Map<string, string>(list.map((p: { id: string; title: string }) => [`ac:${p.id}`, p.title]));
    for (const p of all.filter((p) => p.platform === "atcoder")) {
      if (!names.has(p.key)) err(`${p.topic}: AtCoder masala topilmadi — ${p.url}`);
    }
  }
}

function sameTitle(a: string, b: string) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return norm(b).includes(norm(a)) || norm(a).includes(norm(b));
}

main();
