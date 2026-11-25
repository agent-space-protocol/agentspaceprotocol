// Checks that the Chinese site keeps the structure of the English one, which is normative for the
// specification: the same files, frontmatter keys, headings (level and order), table rows and
// columns, code blocks (identical), and links, for every page. The schema reference is generated
// in English only. Prose is compared by people; structure is compared here.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");
const en = join(root, "en");
const zh = join(root, "zh");
let failures = 0;
const fail = (file: string, what: string) => {
  failures++;
  console.error(`${file}: ${what}`);
};

function shape(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const fm: string[] = [];
  const headings: string[] = [];
  const tables: number[][] = [];
  const code: string[] = [];
  const links: string[] = [];
  let i = 0;
  if (lines[0] === "---") {
    for (i = 1; lines[i] !== "---"; i++) fm.push(lines[i].split(":")[0]);
    i++;
  }
  let inCode = false;
  let block: string[] = [];
  let table: number[] | undefined;
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("```")) {
      if (inCode) code.push(block.join("\n"));
      inCode = !inCode;
      block = [];
      continue;
    }
    if (inCode) {
      block.push(l);
      continue;
    }
    const h = /^(#+) /.exec(l);
    if (h) headings.push(`h${h[1].length}`);
    if (l.startsWith("|")) {
      if (!table) tables.push((table = []));
      table.push(l.split("|").length);
    } else table = undefined;
    for (const m of l.matchAll(/\]\(([^)]+)\)/g)) links.push(m[1]);
  }
  return { fm, headings, tables, code, links };
}

const ENGLISH_ONLY = ["specification/draft/reference/"];
function pages(dir: string, prefix = ""): string[] {
  return readdirSync(dir).flatMap((f) => {
    const rel = prefix + f;
    if (statSync(join(dir, f)).isDirectory()) return pages(join(dir, f), rel + "/");
    return f.endsWith(".md") && !ENGLISH_ONLY.some((p) => rel.startsWith(p)) ? [rel] : [];
  });
}
const enFiles = pages(en);
const zhFiles = pages(zh);
for (const f of enFiles) if (!zhFiles.includes(f)) fail(`zh/${f}`, "missing");
for (const f of zhFiles) if (!enFiles.includes(f)) fail(`zh/${f}`, "has no English original");
for (const f of enFiles) {
  if (!existsSync(join(zh, f))) continue;
  const a = shape(readFileSync(join(en, f), "utf8"));
  const b = shape(readFileSync(join(zh, f), "utf8"));
  if (a.fm.join() !== b.fm.join()) fail(f, `frontmatter keys differ: ${a.fm} / ${b.fm}`);
  if (a.headings.join() !== b.headings.join()) fail(f, `headings differ: ${a.headings.length} / ${b.headings.length}`);
  if (JSON.stringify(a.tables) !== JSON.stringify(b.tables)) fail(f, `tables differ: ${JSON.stringify(a.tables)} / ${JSON.stringify(b.tables)}`);
  if (JSON.stringify(a.code) !== JSON.stringify(b.code)) fail(f, "code blocks differ");
  if (a.links.join() !== b.links.join()) fail(f, `links differ: ${a.links} / ${b.links}`);
}
if (failures) {
  console.error(`${failures} difference(s) between docs/en and docs/zh`);
  process.exit(1);
}
console.log(`docs/zh keeps the structure of docs/en in all ${enFiles.length} pages`);
