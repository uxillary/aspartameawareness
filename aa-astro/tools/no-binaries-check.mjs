import { execSync } from 'node:child_process';

function getFiles() {
  let files = [];
  try {
    files = execSync('git diff --name-only --cached', { encoding: 'utf8' })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);
    const unstaged = execSync('git diff --name-only', { encoding: 'utf8' })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);
    files = Array.from(new Set([...files, ...unstaged]));
  } catch {}
  if (files.length === 0) {
    try {
      files = execSync('git ls-files', { encoding: 'utf8' })
        .trim()
        .split(/\r?\n/)
        .filter(Boolean);
    } catch {}
  }
  return files;
}

const pattern = /\.(png|jpe?g|gif|webp|svg|ico|ttf|otf|woff2?|eot|mp4|mov|pdf)$/i;
const files = getFiles();
const offenders = files.filter((f) => pattern.test(f));

if (offenders.length) {
  console.error('Binary files detected. Please remove or unstage:\n' + offenders.join('\n'));
  process.exit(1);
}

console.log('No binary files detected.');
