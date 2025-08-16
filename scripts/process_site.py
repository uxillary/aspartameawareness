import os, json, hashlib, re
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from urllib.parse import urlparse
import cssutils

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_EXT = '.html'

# Load posts and blogs metadata if available
posts_meta = {}
blogs_meta = {}

posts_json_path = os.path.join(ROOT, 'json', 'posts.json')
if os.path.exists(posts_json_path):
    with open(posts_json_path) as f:
        for item in json.load(f):
            posts_meta[item['url'].rstrip('/')] = item

blogs_json_path = os.path.join(ROOT, 'json', 'blogs.json')
if os.path.exists(blogs_json_path):
    with open(blogs_json_path) as f:
        for item in json.load(f):
            blogs_meta[item['url'].rstrip('/')] = item

pages_info = []
header_hashes = {}
footer_hashes = {}
aside_hashes = {}
search_index = []

EXTRACT_DIR = os.path.join(ROOT, '_extracted-md')
DATA_DIR = os.path.join(ROOT, '_data')
os.makedirs(EXTRACT_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# helper functions
def hash_block(html):
    return hashlib.md5(html.encode('utf-8')).hexdigest()

def normalize_href(href):
    if not href:
        return href
    parsed = urlparse(href)
    if parsed.scheme or parsed.netloc or href.startswith('#'):
        return href
    path = parsed.path
    if path.endswith('.html'):
        path = path[:-5]
    return path + (('?' + parsed.query) if parsed.query else '') + (('#' + parsed.fragment) if parsed.fragment else '')

for root, dirs, files in os.walk(ROOT):
    # skip directories that shouldn't be processed for html extraction
    if any(part in root for part in ['_extracted-md', '_data', 'node_modules', 'scripts', 'template', 'components', 'private-dev']):
        continue
    for filename in files:
        if not filename.endswith(HTML_EXT):
            continue
        file_path = os.path.join(root, filename)
        rel_path = os.path.relpath(file_path, ROOT)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f, 'lxml')
        title = soup.title.string.strip() if soup.title else ''
        meta = {m.get('name', m.get('property')): m.get('content') for m in soup.find_all('meta') if m.get('content')}
        scripts = [s.get('src') for s in soup.find_all('script') if s.get('src')]
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            size = None
            if src and not src.startswith('http') and not src.startswith('data:'):
                img_path = os.path.join(ROOT, src)
                if os.path.exists(img_path):
                    size = os.path.getsize(img_path)
            images.append({'src': src, 'size': size})
        page_record = {
            'file': rel_path,
            'title': title,
            'meta': meta,
            'scripts': scripts,
            'images': images
        }
        pages_info.append(page_record)

        # hash blocks for duplication
        header = soup.find('header')
        if header:
            h = hash_block(str(header))
            header_hashes.setdefault(h, []).append(rel_path)
        footer = soup.find('footer')
        if footer:
            h = hash_block(str(footer))
            footer_hashes.setdefault(h, []).append(rel_path)
        aside = soup.find('aside')
        if aside:
            h = hash_block(str(aside))
            aside_hashes.setdefault(h, []).append(rel_path)

        # extraction to markdown
        main = soup.find(id='main') or soup.find('main')
        if main:
            # normalize links
            for a in main.find_all('a'):
                href = a.get('href')
                a['href'] = normalize_href(href)
            content_md = md(str(main), heading_style="ATX")
            slug = rel_path[:-5]  # remove .html
            out_path = os.path.join(EXTRACT_DIR, slug + '.md')
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            description = meta.get('description', '')
            # tags
            tags = []
            slug_key = slug.rstrip('/')
            if slug_key in blogs_meta:
                tags = blogs_meta[slug_key].get('keywords', [])
            elif 'keywords' in meta:
                tags = [t.strip() for t in meta['keywords'].split(',')]
            # date
            date = None
            if slug_key in posts_meta:
                date = posts_meta[slug_key].get('date_one')
            fm = {
                'title': title,
                'description': description
            }
            if date:
                fm['date'] = date
            if tags:
                fm['tags'] = tags
            # write markdown with front matter
            with open(out_path, 'w', encoding='utf-8') as outf:
                outf.write('---\n')
                outf.write(json.dumps(fm, indent=2))
                outf.write('\n---\n\n')
                outf.write(content_md.strip() + '\n')
            # prepare search index entry
            excerpt = ''
            if slug_key in posts_meta:
                excerpt = posts_meta[slug_key].get('sub', '')
            if not excerpt:
                text = main.get_text(' ', strip=True)
                excerpt = text[:200]
            search_index.append({
                'title': title,
                'slug': slug,
                'excerpt': excerpt,
                'tags': tags
            })

# duplicate css selectors
css_selectors = {}
css_dir = os.path.join(ROOT, 'css')
for root, dirs, files in os.walk(css_dir):
    for filename in files:
        if filename.endswith('.css'):
            css_path = os.path.join(root, filename)
            with open(css_path, 'r', encoding='utf-8', errors='ignore') as f:
                sheet = cssutils.parseString(f.read())
            for rule in sheet:
                if rule.type == rule.STYLE_RULE:
                    for selector in rule.selectorList:
                        sel = selector.selectorText.strip()
                        css_selectors.setdefault(sel, []).append(os.path.relpath(css_path, ROOT))

duplicate_selectors = {sel: paths for sel, paths in css_selectors.items() if len(paths) > 1}

inventory = {
    'pages': pages_info,
    'duplicate_css_selectors': duplicate_selectors,
    'repeated_html_blocks': {
        'header': {h: files for h, files in header_hashes.items() if len(files) > 1},
        'footer': {h: files for h, files in footer_hashes.items() if len(files) > 1},
        'sidebar': {h: files for h, files in aside_hashes.items() if len(files) > 1}
    },
    'static_files': {
        'sw.js': os.path.exists(os.path.join(ROOT, 'sw.js')),
        'sitemap.xml': os.path.exists(os.path.join(ROOT, 'sitemap.xml')),
        'robots.txt': os.path.exists(os.path.join(ROOT, 'robots.txt'))
    }
}

with open(os.path.join(DATA_DIR, 'posts.json'), 'w', encoding='utf-8') as f:
    json.dump(search_index, f, indent=2)

with open(os.path.join(DATA_DIR, 'search-index.json'), 'w', encoding='utf-8') as f:
    json.dump(search_index, f, indent=2)

with open(os.path.join(ROOT, 'inventory.json'), 'w', encoding='utf-8') as f:
    json.dump(inventory, f, indent=2)
