// TEXT-ONLY. Build a lightweight search index from MD/MDX files.
import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const ROOT = path.resolve(process.cwd(), "src", "content");
const OUT = path.resolve(process.cwd(), "src", "data", "search-index.json");

const collections = [
  { dir: "pages", type: "page", base: "/"},
  { dir: "posts", type: "post", base: "/blog/"}
];

function toSlug(filePath) {
  const name = path.basename(filePath).replace(/\.(md|mdx)$/i, "");
  return name.toLowerCase();
}

function toExcerpt(markdown, n = 160) {
  // strip code fences and HTML tags very roughly
  const text = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[(.*?)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, n).trim();
}

async function build() {
  const records = [];

  for (const col of collections) {
    const dir = path.join(ROOT, col.dir);
    if (!fs.existsSync(dir)) continue;

    const files = await fg(["**/*.md", "**/*.mdx"], { cwd: dir, absolute: true });

    for (const file of files) {
      const raw = fs.readFileSync(file, "utf8");
      const { data: fm, content } = matter(raw);

      const slug = fm.slug?.toString() || toSlug(file);
      const title = (fm.title || slug).toString();
      const description = (fm.description || "").toString();
      const tags = Array.isArray(fm.tags) ? fm.tags : [];
      const excerpt = description || toExcerpt(content, 180);

      const url = path.posix.join(col.base, slug).replace(/\/+/g, "/");

      records.push({
        title,
        slug,
        url,
        excerpt,
        tags,
        type: col.type
      });
    }
  }

  // Ensure output dir exists
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(records, null, 2), "utf8");
  console.log(`Search index: wrote ${records.length} records → ${path.relative(process.cwd(), OUT)}`);
}

build().catch((e) => {
  console.error("Failed to build search index:", e);
  process.exit(1);
});
