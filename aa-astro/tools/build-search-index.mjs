import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDirs = [
  path.join(rootDir, 'src/content/pages'),
  path.join(rootDir, 'src/content/posts'),
];

async function readMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => path.join(dir, e.name));
}

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return [{}, text];
  const end = text.indexOf('---', 3);
  if (end === -1) return [{}, text];
  const raw = text.slice(3, end).trim();
  let data = {};
  try {
    data = JSON.parse(raw);
  } catch {
    data = {};
  }
  const body = text.slice(end + 3);
  return [data, body];
}

function stripMarkdown(text) {
  let t = text.replace(/```[\s\S]*?```/g, ''); // code blocks
  t = t.replace(/!\[[^\]]*\]\([^\)]*\)/g, ''); // images
  t = t.replace(/\[[^\]]*\]\([^\)]*\)/g, '$1'); // links
  t = t.replace(/[#>*_`~-]/g, '');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

async function build() {
  const docs = [];
  for (const dir of contentDirs) {
    const files = await readMarkdownFiles(dir);
    for (const file of files) {
      const raw = await fs.readFile(file, 'utf8');
      const [frontmatter, body] = parseFrontmatter(raw);
      const slug = path.basename(file, '.md');
      const text = stripMarkdown(body);
      const excerpt = text.slice(0, 160);
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
      const title = frontmatter.title || '';
      docs.push({ title, slug, excerpt, tags });
    }
  }
  const outDir = path.join(rootDir, 'src/data');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'search-index.json');
  await fs.writeFile(outPath, JSON.stringify(docs, null, 2));
  console.log(`Indexed ${docs.length} documents.`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
