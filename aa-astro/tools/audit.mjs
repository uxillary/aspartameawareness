import { promises as fs } from 'fs';
import path from 'path';

const repoRoot = path.resolve(process.cwd(), '..');
const contentDir = path.join(repoRoot, 'aa-astro', 'src', 'content');
const reportsDir = path.join(repoRoot, '.reports');
await fs.mkdir(reportsDir, { recursive: true });

async function getMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getMarkdownFiles(res));
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      files.push(res);
    }
  }
  return files;
}

const files = await getMarkdownFiles(contentDir);

const routes = new Set();
const fileRoutes = {};

for (const file of files) {
  const rel = path.relative(contentDir, file).split(path.sep);
  let route;
  if (rel[0] === 'pages') {
    const slug = rel.slice(1).join('/').replace(/\.(md|mdx)$/i, '');
    route = slug === 'index' ? '/' : `/${slug}`;
  } else if (rel[0] === 'posts') {
    const slug = rel.slice(1).join('/').replace(/\.(md|mdx)$/i, '');
    route = `/blog/${slug}`;
  } else {
    const slug = rel.join('/').replace(/\.(md|mdx)$/i, '');
    route = `/${slug}`;
  }
  routes.add(route);
  fileRoutes[file] = route;
}

const brokenLinks = [];
const missingFrontmatter = [];

const binaryExt = /\.(png|jpe?g|gif|webp|svg|ico|ttf|otf|woff2?|eot|mp4|mov|pdf)$/i;

for (const file of files) {
  const raw = await fs.readFile(file, 'utf8');
  const relPath = path.relative(repoRoot, file);
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  let body = raw;
  const issues = [];
  let data = {};
  if (fmMatch) {
    body = raw.slice(fmMatch[0].length);
    try {
      data = JSON.parse(fmMatch[1]);
    } catch {
      issues.push('invalid frontmatter');
    }
  } else {
    issues.push('missing frontmatter');
  }
  if (!data.title) issues.push('title');
  if (!data.description) issues.push('description');
  if (issues.length) {
    missingFrontmatter.push({ file: relPath, missing: issues });
  }

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(body)) !== null) {
    if (body[match.index - 1] === '!') continue; // image
    let url = match[2].trim();
    if (/^(https?:|mailto:|#|javascript:)/i.test(url)) continue;
    if (binaryExt.test(url)) continue;
    url = url.split('#')[0].split('?')[0];
    url = url.replace(/\.html?$/i, '').replace(/\.mdx?$/i, '').replace(/\.md$/i, '');
    let resolved;
    if (url.startsWith('/')) {
      resolved = url;
    } else {
      const base = path.posix.dirname(fileRoutes[file]);
      resolved = path.posix.normalize(path.posix.join(base === '/' ? '' : base, url));
      if (!resolved.startsWith('/')) resolved = '/' + resolved;
    }
    if (!routes.has(resolved)) {
      brokenLinks.push({ file: relPath, link: url });
    }
  }
}

await fs.writeFile(path.join(reportsDir, 'broken-links.json'), JSON.stringify(brokenLinks, null, 2));
await fs.writeFile(path.join(reportsDir, 'missing-frontmatter.json'), JSON.stringify(missingFrontmatter, null, 2));

console.log(`Checked ${files.length} files: ${missingFrontmatter.length} with frontmatter issues, ${brokenLinks.length} broken links.`);
