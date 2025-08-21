// TEXT-ONLY. Accessible client-side search (small + header-friendly).
import { useEffect, useMemo, useRef, useState } from "react";
import indexData from "../data/search-index.json";

type Item = {
  title: string;
  url: string;
  excerpt: string;
  tags?: string[];
  type: "page" | "post";
};

function useDebounced<T>(value: T, delay = 160) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SearchBox({
  placeholder = "Search…",
  max = 8,
  className = ""
}: {
  placeholder?: string;
  max?: number;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounced = useDebounced(q);

  const items: Item[] = (indexData as Item[]) || [];
  const results = useMemo(() => {
    if (!debounced.trim()) return [];
    const needle = debounced.toLowerCase();
    return items
      .filter(i =>
        i.title.toLowerCase().includes(needle) ||
        i.excerpt.toLowerCase().includes(needle) ||
        (i.tags || []).some(t => t.toLowerCase().includes(needle))
      )
      .slice(0, max);
  }, [debounced, items, max]);

  useEffect(() => {
    setOpen(results.length > 0);
    setActive(0);
  }, [results.length]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(a => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[active];
      if (target) window.location.href = target.url;
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={`relative ${className}`} role="combobox" aria-expanded={open} aria-owns="aa-search-list">
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setOpen(results.length > 0)}
        onKeyDown={onKeyDown}
        aria-autocomplete="list"
        aria-controls="aa-search-list"
        className="w-full rounded-md border border-slate-500/40 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
      />
      {open && (
        <ul
          id="aa-search-list"
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-80 overflow-auto rounded-md border border-slate-600/40 bg-slate-900/95 backdrop-blur p-2 shadow-lg"
        >
          {results.map((r, i) => (
            <li
              key={r.url}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                window.location.href = r.url;
              }}
              className={`cursor-pointer rounded p-2 ${i === active ? "bg-slate-700/60" : "hover:bg-slate-800/50"}`}
            >
              <div className="text-sm font-medium">{r.title}</div>
              <div className="text-xs opacity-70 line-clamp-2">{r.excerpt}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide opacity-60">{r.type}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
