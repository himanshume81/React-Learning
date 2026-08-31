import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { Card } from "@/components/molecules/Card";
import { KPICard } from "@/components/molecules/KPICard";
import type { CellValue, PageConfig } from "@/lib/admin-static-data";

function getBadgeTone(value: CellValue) {
  if (typeof value === "string" || typeof value === "number") {
    return null;
  }

  return value.tone ?? "neutral";
}

function getCellLabel(value: CellValue) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return value.value;
}

function DataTable({ table }: { table: NonNullable<PageConfig["table"]> }) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {table.rows.map((row, index) => (
          <article
            key={index}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="grid gap-3">
              {table.columns.map((column) => {
                const value = row[column];

                return (
                  <div key={column} className="flex items-start justify-between gap-4">
                    <Text className="text-sm text-zinc-500">{column}</Text>
                    <div className="text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {getBadgeTone(value) ? (
                        <Badge tone={getBadgeTone(value) ?? "neutral"}>
                          {getCellLabel(value)}
                        </Badge>
                      ) : (
                        getCellLabel(value)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 md:block dark:border-zinc-800">
        <table className="w-full min-w-[780px] text-left">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
              {table.columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-zinc-200 align-top last:border-0 dark:border-zinc-800"
              >
                {table.columns.map((column) => {
                  const value = row[column];
                  const tone = getBadgeTone(value);

                  return (
                    <td
                      key={column}
                      className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      {tone ? (
                        <Badge tone={tone}>{getCellLabel(value)}</Badge>
                      ) : (
                        getCellLabel(value)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Highlights({
  items,
}: {
  items: NonNullable<PageConfig["highlights"]>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <Text className="text-sm text-zinc-500">{item.label}</Text>
          <Text as="h3" className="mt-2 text-base font-semibold">
            {item.value}
          </Text>
        </div>
      ))}
    </div>
  );
}

export function StaticAdminPage({ config }: { config: PageConfig }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            {config.title}
          </Text>
          <Text className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            {config.description}
          </Text>
        </div>
        {config.actions && config.actions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {config.actions.map((action, index) => (
              <Button key={action} variant={index === 0 ? "primary" : "secondary"}>
                {action}
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      {config.filters && config.filters.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {config.filters.map((filter) => (
            <Badge key={filter} className="px-3 py-1 text-xs" tone="neutral">
              {filter}
            </Badge>
          ))}
        </div>
      ) : null}

      {config.metrics && config.metrics.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {config.metrics.map((metric) => (
            <KPICard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              hint={metric.hint}
              tone={metric.tone ?? "neutral"}
            />
          ))}
        </div>
      ) : null}

      {config.charts && config.charts.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {config.charts.map((chart) => (
            <article
              key={chart.label}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between">
                <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {chart.label}
                </Text>
                <Badge tone={chart.change.startsWith("+") ? "success" : "danger"}>
                  {chart.change}
                </Badge>
              </div>
              <div className="mt-5 h-24 rounded-xl bg-[linear-gradient(135deg,rgba(24,24,27,0.08),rgba(24,24,27,0.02))] p-3 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
                <div className="flex h-full items-end gap-2">
                  {Array.from({ length: 7 }, (_, index) => {
                    const height = Math.max(
                      18,
                      Math.min(100, chart.value - 12 + index * 4)
                    );

                    return (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-foreground/70"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {config.highlights && config.highlights.length > 0 ? (
        <Highlights items={config.highlights} />
      ) : null}

      {config.timeline && config.timeline.length > 0 ? (
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Text as="h2" className="text-lg font-semibold">
            Status Timeline
          </Text>
          <div className="mt-4 flex flex-wrap gap-3">
            {config.timeline.map((step) => (
              <Badge key={step.label} tone={step.tone ?? "neutral"} className="px-3 py-1">
                {step.label}
              </Badge>
            ))}
          </div>
        </article>
      ) : null}

      {config.table ? <DataTable table={config.table} /> : null}

      {config.panels && config.panels.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {config.panels.map((panel) => (
            <Card
              key={panel.title}
              title={panel.title}
              description={panel.description}
              footer={
                <div className="space-y-2">
                  {panel.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              }
            />
          ))}
        </div>
      ) : null}

      {config.note ? (
        <article className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          {config.note}
        </article>
      ) : null}
    </section>
  );
}
