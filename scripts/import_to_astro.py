#!/usr/bin/env python3
"""Import extracted markdown into aa-astro content directories, fix internal links,
collect binary asset references, and generate redirects and missing binary report."""
import json
import os
import re
import shutil
from pathlib import Path

SRC_DIR = Path('_extracted-md')
ASTRO_DIR = Path('aa-astro')
PAGES_DIR = ASTRO_DIR / 'src' / 'content' / 'pages'
POSTS_DIR = ASTRO_DIR / 'src' / 'content' / 'posts'
REDIRECTS_SRC = Path('_reports') / 'redirects.map'
REDIRECTS_DEST = ASTRO_DIR / 'redirects.map'
MISSING_BINARIES = Path('MISSING-BINARIES.md')

ASSET_EXTS = {
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff',
    '.pdf', '.mp4', '.mov', '.avi', '.mp3', '.wav', '.ogg', '.flac',
    '.ttf', '.otf', '.woff', '.woff2', '.eot'
}

link_pattern = re.compile(r'(!?)\[([^\]]*)\]\(([^)]+)\)')
asset_paths = set()

def transform_url(url: str) -> str:
    url = url.strip()
    if url.startswith(('http://', 'https://', 'mailto:', '#', '/')):
        return url
    if url.endswith('.html'):
        url = url[:-5]
    while url.startswith('../'):
        url = url[3:]
    if url.startswith('blogs/'):
        slug = url.split('/', 1)[1]
        return f'/blog/{slug}'
    if url.startswith('images/'):
        return '/' + url
    return '/' + url

def process_markdown(text: str) -> str:
    def repl(match: re.Match) -> str:
        prefix, label, url = match.groups()
        new_url = transform_url(url)
        ext = os.path.splitext(new_url)[1].lower()
        if prefix == '!' or ext in ASSET_EXTS:
            if not new_url.startswith(('http://', 'https://', 'mailto:')):
                asset_paths.add(new_url.lstrip('/'))
        return f'{prefix}[{label}]({new_url})'
    text = link_pattern.sub(repl, text)
    # Second pass for links with nested elements that the first regex misses
    text = re.sub(r'(?<!!)\]\(blogs/([^)]+)\)', r'](/blog/\1)', text)
    text = re.sub(
        r'(?<!!)\]\((?!https?://|mailto:|#|/)([^)]+)\)',
        lambda m: f']({transform_url(m.group(1))})',
        text,
    )
    return text

def scan_frontmatter(text: str) -> None:
    if text.startswith('---'):
        end = text.find('\n---', 3)
        if end != -1:
            fm_json = text[4:end]
            try:
                data = json.loads(fm_json)
            except json.JSONDecodeError:
                return
            for v in data.values():
                if isinstance(v, str):
                    ext = os.path.splitext(v)[1].lower()
                    if ext in ASSET_EXTS and not v.startswith(('http://', 'https://')):
                        asset_paths.add(v.lstrip('/'))


def import_file(src: Path, dest: Path) -> None:
    text = src.read_text(encoding='utf-8')
    scan_frontmatter(text)
    processed = process_markdown(text)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(processed, encoding='utf-8')


def main() -> None:
    page_files = sorted(p for p in SRC_DIR.glob('*.md'))
    for src in page_files:
        import_file(src, PAGES_DIR / src.name)
    post_files = sorted(p for p in (SRC_DIR / 'blogs').glob('*.md'))
    for src in post_files:
        import_file(src, POSTS_DIR / src.name)
    ASTRO_DIR.mkdir(exist_ok=True)
    if REDIRECTS_SRC.exists():
        REDIRECTS_DEST.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(REDIRECTS_SRC, REDIRECTS_DEST)
    with MISSING_BINARIES.open('w', encoding='utf-8') as f:
        f.write('# Missing Binaries\n\n')
        for path in sorted(asset_paths):
            f.write(f'- [ ] {path}\n')
    print(f'Pages imported: {len(page_files)}')
    print(f'Posts imported: {len(post_files)}')

if __name__ == '__main__':
    main()
