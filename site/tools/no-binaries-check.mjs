import { execSync } from 'node:child_process';

const binaryPattern = /\.(png|jpe?g|gif|webp|svg|ico|ttf|otf|woff2?|eot|mp4|mov|pdf)$/i;

const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
const files = output.split(/\r?\n/).filter(Boolean);
const offenders = files.filter((f) => binaryPattern.test(f));

if (offenders.length) {
  console.error('Binary files detected in commit:');
  offenders.forEach((file) => console.error(` - ${file}`));
  console.error('\nUpload these manually via GitHub after merge.');
  process.exit(1);
}
