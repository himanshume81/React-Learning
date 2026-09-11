"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onSearch: (params: { q: string } | null) => void;
  isLoading: boolean;
  subject: "product" | "order";
  placeholder: string;
  hint: string;
  initialQuery?: string;
  id?: string;
  compact?: boolean;
};

export function AiSearchForm({
  onSearch,
  isLoading,
  subject,
  placeholder,
  hint,
  initialQuery = "",
  id = `${subject}-search`,
  compact = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    if (q) onSearch({ q });
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label={`AI ${subject} search`}
      className={compact ? "space-y-2" : "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"}
    >
      <div className="flex items-center overflow-hidden rounded-xl border border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="ml-3 h-5 w-5 shrink-0 text-zinc-500">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
        <input
          name="q"
          aria-label={`Search ${subject}s using natural language`}
          aria-describedby={`${id}-hint`}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!event.target.value.trim()) onSearch(null);
          }}
          placeholder={placeholder}
          className={`min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-zinc-400 ${compact ? "py-2.5" : "py-3 sm:text-base"}`}
        />
        {query ? (
          <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); onSearch(null); }} className="rounded px-2 py-1 text-zinc-500 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-violet-500 dark:hover:text-white">
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
        <button type="submit" disabled={isLoading || !query.trim()} title="Search using natural language" className={`flex shrink-0 items-center gap-2 self-stretch border-l border-violet-200 bg-violet-50 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/50 ${compact ? "px-3" : "px-3 sm:px-5 sm:text-base"}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="hidden h-5 w-5 sm:block">
            <path d="m10 3 2.5 6.5L19 12l-6.5 2.5L10 21l-2.5-6.5L1 12l6.5-2.5L10 3Z" />
            <path d="M20 2v6m-3-3h6" />
          </svg>
          {isLoading ? "Loading..." : compact ? "Search" : "AI Search"}
        </button>
      </div>
      <p id={`${id}-hint`} className={`${compact ? "" : "mt-2"} text-xs text-zinc-500`}>{hint}</p>
    </form>
  );
}
