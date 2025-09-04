#!/usr/bin/env python3
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / 'content-mdx'
REPORT_DIR = ROOT / 'reports'
REPORT_DIR.mkdir(exist_ok=True)
IMAGES_DIR = ROOT / 'images'

def normalize(slug: str) -> str:
    if slug != '/' and slug.endswith('/'):
        return slug[:-1]
    return slug

mdx_files = sorted(CONTENT_DIR.rglob('*.mdx'))
mdx_data = []
slugs = set()

for path in mdx_files:
    text = path.read_text(encoding='utf-8')
    fm_match = re.match(r'^---\n(.*?)\n---\n', text, re.DOTALL)
    frontmatter = {}
    body = text
    if fm_match:
        fm_text = fm_match.group(1)
        try:
            frontmatter = yaml.safe_load(fm_text) or {}
        except Exception:
            frontmatter = {}
        body = text[fm_match.end():]
    mdx_data.append({'path': path, 'frontmatter': frontmatter, 'body': body})
    slug = frontmatter.get('slug')
    if isinstance(slug, str):
        slugs.add(normalize(slug.strip()))
slugs.add('/')

missing_frontmatter = []
broken_links = []
missing_images = []

link_re = re.compile(r'(?<!!)[\[][^\]]*\(([^)]+)\)')
md_image_re = re.compile(r'!\[[^\]]*\]\(([^)]+)\)')
html_img_re = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']')

for item in mdx_data:
    path = item['path']
    rel = path.relative_to(ROOT).as_posix()
    fm = item['frontmatter']
    body = item['body']

    missing = []
    for field in ('title', 'description'):
        if field not in fm or fm[field] in (None, ''):
            missing.append(field)
    if 'posts' in path.parts and 'publishDate' not in fm:
        missing.append('publishDate')
    if missing:
        missing_frontmatter.append({'file': rel, 'missing': missing})

    for match in link_re.finditer(body):
        url = match.group(1).strip()
        if not url or url.startswith('#'):
            continue
        if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', url):
            continue
        url = normalize(url.split('#')[0].split('?')[0])
        if not url.startswith('/'):
            continue
        if url not in slugs:
            broken_links.append({'file': rel, 'link': url})

    image_candidates = []
    image_val = fm.get('image')
    if isinstance(image_val, str):
        image_candidates.append(image_val)
    elif isinstance(image_val, list):
        for img in image_val:
            if isinstance(img, str):
                image_candidates.append(img)

    for m in md_image_re.finditer(body):
        image_candidates.append(m.group(1).strip())
    for m in html_img_re.finditer(body):
        image_candidates.append(m.group(1).strip())

    for img in image_candidates:
        img = img.split('#')[0].split('?')[0].strip()
        if not img:
            continue
        if img.startswith('data:'):
            missing_images.append({'file': rel, 'image': img})
            continue
        if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', img):
            continue
        img_path = (path.parent / img).resolve()
        try:
            img_rel = img_path.relative_to(ROOT)
        except ValueError:
            missing_images.append({'file': rel, 'image': img})
            continue
        if IMAGES_DIR not in img_path.parents and img_path != IMAGES_DIR:
            missing_images.append({'file': rel, 'image': img})
            continue
        if not img_path.exists():
            missing_images.append({'file': rel, 'image': img})

with open(REPORT_DIR / 'missing-frontmatter.json', 'w', encoding='utf-8') as f:
    json.dump(missing_frontmatter, f, indent=2)

with open(REPORT_DIR / 'broken-links.json', 'w', encoding='utf-8') as f:
    json.dump(broken_links, f, indent=2)

with open(REPORT_DIR / 'missing-images.json', 'w', encoding='utf-8') as f:
    json.dump(missing_images, f, indent=2)

if not missing_frontmatter and not broken_links and not missing_images:
    print('MDX VALIDATION OK')
else:
    print(f'Frontmatter: {len(missing_frontmatter)}; Broken links: {len(broken_links)}; Missing images: {len(missing_images)}')
