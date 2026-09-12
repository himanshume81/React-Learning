"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { useMemo, useState, type ReactNode } from "react";

type TableRow = readonly ReactNode[];

export type AdminTableProps = {
  title: string;
  columns: readonly string[];
  rows: readonly TableRow[];
  actionLabel?: string;
  tabs?: readonly string[];
  searchable?: boolean;
  dataNodeId?: string;
  description?: string;
};

export function AdminTable({
  title,
  columns,
  rows,
  actionLabel,
  tabs,
  searchable = true,
  dataNodeId,
  description = `Review and manage ${title.toLowerCase()}.`,
}: AdminTableProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(tabs?.[0] ?? "");
  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      row.some((cell) => String(cell ?? "").toLowerCase().includes(term))
    );
  }, [query, rows]);

  return (
    <section className="space-y-6" data-node-id={dataNodeId}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">{title}</Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</Text>
        </div>
        {actionLabel ? <Button type="button">{actionLabel}</Button> : null}
      </div>

      {tabs?.length ? (
        <div className="flex min-w-0 gap-8 overflow-x-auto border-b border-[#e1e8ea] sm:gap-11" role="tablist" aria-label={`Filter ${title}`}>
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                className={`h-11 shrink-0 cursor-pointer border-b-2 px-1 text-sm font-medium transition-colors sm:text-base ${active ? "border-[#4a942e] text-[#1f2124] dark:text-white" : "border-transparent text-[#6b7f89] hover:text-[#1f2124] dark:hover:text-white"}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      ) : null}

      {searchable ? (
        <Input
          type="search"
          aria-label={`Search ${title}`}
          placeholder={`Search ${title.toLowerCase()}...`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:max-w-xs"
        />
      ) : null}

      {visibleRows.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} found`}
          description={query ? "Try adjusting your search." : "Records will appear here when they are available."}
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {visibleRows.map((row, rowIndex) => (
              <article key={rowIndex} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {row.map((cell, cellIndex) => (
                    <div key={cellIndex} className={cellIndex === 0 ? "col-span-2" : "min-w-0"}>
                      <dt className="text-xs font-medium text-zinc-500">{columns[cellIndex]}</dt>
                      <dd className="mt-1 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">{cell}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 md:block dark:border-zinc-800">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                  {columns.map((column) => <th key={column} className="px-4 py-3 font-semibold">{column}</th>)}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-zinc-200 last:border-0 dark:border-zinc-800">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
