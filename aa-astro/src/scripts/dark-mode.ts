export type Theme = 'light' | 'dark';
const storageKey = 'theme';

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(storageKey, theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      'content',
      getComputedStyle(root).getPropertyValue('--color-bg').trim()
    );
  }
}

export function initTheme() {
  const stored = localStorage.getItem(storageKey) as Theme | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(stored ?? (prefersDark ? 'dark' : 'light'));
}

if (typeof window !== 'undefined') {
  initTheme();
}
