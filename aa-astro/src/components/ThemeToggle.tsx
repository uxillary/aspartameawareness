import { useState, useEffect } from 'react';
import { setTheme } from '../scripts/dark-mode';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setThemeState(current);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  };

  return (
    <button onClick={toggle} className="border border-border px-2 py-1 rounded">
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
