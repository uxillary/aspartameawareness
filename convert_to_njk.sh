#!/bin/bash
set -e
for file in "$@"; do
  base="${file%.html}"
  out="$base.njk"
  title=$(grep -m1 -o '<title>[^<]*</title>' "$file" | sed 's#</\?title>##g')
  awk '/<div id="main">/{flag=1;next}/<\/div><!-- \/main -->/{flag=0}flag' "$file" > body.tmp
  {
    echo '---'
    echo 'layout: base.njk'
    echo "title: \"$title\""
    echo '---'
    cat body.tmp
  } > "$out"
  rm body.tmp
  git rm -f "$file"
  echo "Converted $file -> $out"
done
