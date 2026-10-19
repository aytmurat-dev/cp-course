/**
 * Kurs kontentini tekshiradi:
 *  - content/course.yaml tuzilmasi, takrorlangan slug'lar
 *  - content/topics/*.md frontmatter formati, course.yaml da bormi, prerequisites
 *  (Masalalar admin paneldan qo'shiladi va o'sha paytda platformada tekshiriladi.)
 *
 *   npm run check-content
 */
import fs from "node:fs";
import path from "node:path";
import { flattenCourse, parseCourse } from "../src/lib/course-parser";
import { parseTopic, type TopicContent } from "../src/lib/topic-parser";

const CONTENT = path.join(process.cwd(), "content");
const DIR = path.join(CONTENT, "topics");

let errors = 0;
let warnings = 0;
const err = (m: string) => (errors++, console.log(`  ✗ ${m}`));
const warn = (m: string) => (warnings++, console.log(`  ! ${m}`));

function main() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const topics: TopicContent[] = [];
  for (const f of files) {
    try {
      topics.push(parseTopic(f, fs.readFileSync(path.join(DIR, f), "utf8")));
    } catch (e) {
      err((e as Error).message);
    }
  }

  let courseSlugs = new Set<string>();
  try {
    const course = flattenCourse(parseCourse(fs.readFileSync(path.join(CONTENT, "course.yaml"), "utf8"), new Map()));
    courseSlugs = new Set(course.map((t) => t.slug));
    console.log(`\nKurs: ${course.length} ta mavzu, shundan ${topics.filter((t) => courseSlugs.has(t.slug)).length} tasi yozilgan.\n`);
  } catch (e) {
    err((e as Error).message);
  }

  for (const t of topics) {
    if (!courseSlugs.has(t.slug)) err(`${t.slug}.md: content/course.yaml da bunday slug yo'q — mavzu saytda ko'rinmaydi`);
    if (t.ignoredKeys.length) warn(`${t.slug}: frontmatter'dagi ${t.ignoredKeys.join(", ")} e'tiborga olinmaydi (nom va tartib — course.yaml da, masalalar — admin panelda)`);
    for (const p of t.prerequisites) if (!courseSlugs.has(p)) err(`${t.slug}: prerequisites'da noma'lum mavzu "${p}"`);
    if (/^#\s/m.test(t.body)) err(`${t.slug}: matnda "# " (H1) bo'lmasin — sarlavha course.yaml dan olinadi`);
    if (/^##\s+Masalalar\s*$/m.test(t.body)) warn(`${t.slug}: "## Masalalar" bo'limini yozmang — u avtomatik chiqadi`);
  }

  console.log(`\nNatija: ${errors} xato, ${warnings} ogohlantirish\n`);
  process.exit(errors ? 1 : 0);
}

main();
