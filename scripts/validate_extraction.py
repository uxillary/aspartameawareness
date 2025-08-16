#!/usr/bin/env python3
import os
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
EXTRACT_DIR = ROOT / '_extracted-md'
REPORT_DIR = ROOT / '_reports'
REPORT_DIR.mkdir(exist_ok=True)

SKIP_PARTS = {'_extracted-md', '_data', 'node_modules', 'scripts', 'template', 'components', 'private-dev'}

def is_skipped(path: Path) -> bool:
    return any(part in SKIP_PARTS for part in path.parts)

# gather html files
html_files = []
for path in ROOT.rglob('*.html'):
    if is_skipped(path):
        continue
    html_files.append(path)
html_rel = sorted([p.relative_to(ROOT).as_posix() for p in html_files])

# gather markdown files
md_files = sorted(EXTRACT_DIR.rglob('*.md'))
md_rel = [p.relative_to(ROOT).as_posix() for p in md_files]

# build manifest
missing_md = []
for rel in html_rel:
    expected = (EXTRACT_DIR / Path(rel).with_suffix('.md')).relative_to(ROOT).as_posix()
    if expected not in md_rel:
        missing_md.append(rel)

orphan_md = []
html_set = set(html_rel)
for rel in md_rel:
    html_candidate = Path(rel).relative_to('_extracted-md').with_suffix('.html').as_posix()
    if html_candidate not in html_set:
        orphan_md.append(rel)

manifest = {
    "total_html": len(html_rel),
    "extracted_md": len(md_rel),
    "missing_md": sorted(missing_md),
    "orphan_md": sorted(orphan_md)
}
with open(REPORT_DIR / 'extraction-manifest.json', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2)

# slug map and redirects
slug_map = []
redirect_lines = []
for rel in html_rel:
    file_path = ROOT / rel
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f, 'lxml')
    except Exception:
        soup = None
    title = soup.title.string.strip() if soup and soup.title else ''
    slug = Path(rel).stem
    if rel.startswith('blogs/'):
        target_route = f"/blog/{slug}"
    elif rel == 'index.html':
        target_route = '/'
    else:
        target_route = '/' + Path(rel).with_suffix('').as_posix()
    slug_map.append({
        "htmlPath": rel,
        "detectedTitle": title,
        "suggestedSlug": slug,
        "targetRoute": target_route
    })
    redirect_lines.append(json.dumps({"from": "/" + rel, "to": target_route}))

with open(REPORT_DIR / 'slug-map.json', 'w', encoding='utf-8') as f:
    json.dump(slug_map, f, indent=2)

with open(REPORT_DIR / 'redirects.map', 'w', encoding='utf-8') as f:
    f.write("\n".join(redirect_lines) + ("\n" if redirect_lines else ""))

# broken links
md_targets = set()
for md in md_files:
    rel = md.relative_to(EXTRACT_DIR).with_suffix('').as_posix()
    md_targets.add(rel)

image_re = re.compile(r'!\[[^\]]*\]\([^\)]*\)')
link_re = re.compile(r'\[[^\]]*\]\(([^)]+)\)')
broken = []
for md in md_files:
    with open(md, 'r', encoding='utf-8') as f:
        content = f.read()
    content = image_re.sub('', content)
    rel_md = md.relative_to(ROOT).as_posix()
    for match in link_re.finditer(content):
        url = match.group(1).strip()
        if not url or url.startswith('#'):
            continue
        if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', url):
            continue  # has scheme
        candidate = url.split('#')[0].split('?')[0].lstrip('/')
        if candidate == '':
            candidate = 'index'
        if candidate.endswith('/'):
            candidate = candidate[:-1]
        if candidate not in md_targets:
            broken.append({"file": rel_md, "link": url})

with open(REPORT_DIR / 'broken-links.json', 'w', encoding='utf-8') as f:
    json.dump(broken, f, indent=2)

print('EXTRACTION VALIDATED')
