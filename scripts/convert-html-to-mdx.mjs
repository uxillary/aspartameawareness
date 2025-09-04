import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import gfm from 'turndown-plugin-gfm';

const rootDir = process.cwd();
const htmlDirs = ['.', 'blogs'];
const outputBase = path.join(rootDir, 'content-mdx');
const reportsBase = path.join(rootDir, 'reports');

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
turndown.use(gfm.gfm);

// Trackers for reports
const pages = [];
const posts = [];
const missingHtml = [];
const brokenLinks = [];
let shortcodeCounts = { Callout: 0 };
const missingBinaries = new Set();
const redirects = [];

// Helper to ensure directory
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

ensureDir(outputBase);
ensureDir(path.join(outputBase, 'pages'));
ensureDir(path.join(outputBase, 'posts'));
ensureDir(path.join(outputBase, 'legal'));
ensureDir(reportsBase);

// Gather all html files
let htmlFiles = [];
for (const dir of htmlDirs) {
  const full = path.join(rootDir, dir);
  if (!fs.existsSync(full)) continue;
  for (const file of fs.readdirSync(full)) {
    if (file.endsWith('.html')) {
      htmlFiles.push(path.join(dir, file));
    }
  }
}

// Map slugs to avoid collisions
const slugSet = new Set();
function getSlug(file) {
  let slug;
  if (file === 'index.html') slug = '/';
  else if (file.startsWith('blogs/')) {
    const base = path.basename(file, '.html');
    slug = '/blog/' + base;
  } else {
    const base = path.basename(file, '.html');
    slug = '/' + base;
  }
  if (slugSet.has(slug)) {
    let i = 2;
    let newSlug = slug + '-' + i;
    while (slugSet.has(newSlug)) {
      i++;
      newSlug = slug + '-' + i;
    }
    slug = newSlug;
  }
  slugSet.add(slug);
  return slug;
}

// Precompute slug map for redirect & link fixing
const slugMap = {};
for (const file of htmlFiles) {
  slugMap['/' + file] = getSlug(file); // path with leading /
}

function slugForHref(href) {
  if (href.startsWith('/')) {
    if (href in slugMap) return slugMap[href];
    if (href.endsWith('.html')) {
      const base = href.replace('.html', '');
      return base;
    }
    return href;
  }
  return href;
}

for (const file of htmlFiles) {
  const fullPath = path.join(rootDir, file);
  const html = fs.readFileSync(fullPath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Extract meta
  let title = document.querySelector('title')?.textContent?.trim() || '';
  let description = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  let publishDate = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || document.querySelector('time')?.getAttribute('datetime') || '';
  let tags = [];
  const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
  if (keywords) tags = keywords.split(',').map(s=>s.trim()).filter(Boolean);

  const slug = slugMap['/' + file];

  // Find main content
  let main = document.querySelector('main, #main, article');
  if (!main) main = document.body;

  // Remove nav/footer
  main.querySelectorAll('nav, header, footer').forEach(el => el.remove());

  // Handle callouts
  main.querySelectorAll('div').forEach(div => {
    const cls = div.className || '';
    const match = cls.match(/(note|tip|warning|danger)/i);
    if (match) {
      const type = match[1].toLowerCase();
      const inner = div.innerHTML;
      shortcodeCounts.Callout++;
      div.outerHTML = `<Callout type="${type}">${inner}</Callout>`;
    }
  });

  // Images
  let heroImage = '';
  let imageMeta = null;
  const firstImg = main.querySelector('img');
  if (firstImg) {
    heroImage = firstImg.getAttribute('src') || '';
    const w = firstImg.getAttribute('width');
    const h = firstImg.getAttribute('height');
    if (w && h) imageMeta = { width: Number(w), height: Number(h) };
    // Remove hero from body
    firstImg.remove();
    // Check file exists
    const imgPath = heroImage.startsWith('/') ? heroImage.slice(1) : heroImage;
    if (!fs.existsSync(path.join(rootDir, imgPath))) {
      missingBinaries.add(heroImage);
    }
  }
  // Check remaining images for existence
  main.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    const imgPath = src.startsWith('/') ? src.slice(1) : src;
    if (!fs.existsSync(path.join(rootDir, imgPath))) {
      missingBinaries.add(src);
    }
  });

  // Handle links
  main.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('/')) {
      const newHref = slugForHref(href);
      if (href !== newHref) a.setAttribute('href', newHref);
      if (!(href in slugMap) && href.endsWith('.html')) {
        brokenLinks.push({ from: slug, href: slugForHref(href) });
      }
    } else if (!href.startsWith('#') && !/^[a-zA-Z]+:/.test(href)) {
      const abs = '/' + href.replace(/^\.?\//, '');
      const newHref = slugForHref(abs);
      a.setAttribute('href', newHref);
      if (!(abs in slugMap) && abs.endsWith('.html')) {
        brokenLinks.push({ from: slug, href: newHref });
      }
    }
  });

  let md = turndown.turndown(main.innerHTML);

  // Fix Callout tag case
  md = md.replace(/<callout/gi, '<Callout').replace(/<\/callout>/gi, '</Callout>');

  // Write frontmatter
  const fm = {
    title,
    description,
    publishDate: publishDate || undefined,
    tags: tags.length ? tags : undefined,
    slug,
    image: heroImage || undefined,
    imageMeta: imageMeta || undefined
  };
  // Remove undefined
  Object.keys(fm).forEach(k => fm[k] === undefined && delete fm[k]);

  const yaml = yamlString(fm);
  const content = `---\n${yaml}---\n\n${md}\n`;

  // Determine output path
  let outDir = 'pages';
  if (file === 'privacy.html' || file === 'service.html') outDir = 'legal';
  if (file.startsWith('blogs/')) outDir = 'posts';

  const fileName = path.basename(slug === '/' ? 'index' : slug.split('/').pop()) + '.mdx';
  const outPath = path.join(outputBase, outDir, fileName);
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, content, 'utf-8');

  // Record for reports
  redirects.push({ from: '/' + file, to: slug });
  if (outDir === 'posts') posts.push(slug);
  else pages.push(slug);
}

function yamlString(obj) {
  const lines = [];
  const indent = (level) => '  '.repeat(level);
  function write(key, value, level = 0) {
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      lines.push(`${indent(level)}${key}:`);
      value.forEach(v => lines.push(`${indent(level+1)}- ${v}`));
    } else if (typeof value === 'object') {
      lines.push(`${indent(level)}${key}:`);
      Object.entries(value).forEach(([k,v]) => write(k,v,level+1));
    } else {
      lines.push(`${indent(level)}${key}: ${value}`);
    }
  }
  Object.entries(obj).forEach(([k,v]) => write(k,v));
  return lines.join('\n') + '\n';
}

// Write reports
const extraction = {
  totalHtml: htmlFiles.length,
  converted: htmlFiles.length - missingHtml.length,
  pages,
  posts,
  missing: missingHtml,
  brokenLinks,
  shortcodesUsed: shortcodeCounts
};
fs.writeFileSync(path.join(reportsBase, 'extraction.json'), JSON.stringify(extraction, null, 2));
fs.writeFileSync(path.join(reportsBase, 'redirects.map'), redirects.map(r=>JSON.stringify(r)).join('\n') + '\n');
fs.writeFileSync(path.join(reportsBase, 'missing-binaries.json'), JSON.stringify(Array.from(missingBinaries), null, 2));

console.log('Converted', htmlFiles.length, 'HTML files');
