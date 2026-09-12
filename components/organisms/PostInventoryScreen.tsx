"use client";

import {
  getPostInventoryScreen,
  type CardsScreenDefinition,
  type ScreenDefinition,
  type TableScreenDefinition,
} from "@/assets/data/post-inventory-screens";
import { Text } from "@/components/atoms/Text";
import { AdminForm } from "@/components/organisms/AdminForm";
import { AdminTable } from "@/components/organisms/AdminTable";

function ScreenHeader({ definition }: {
  definition: ScreenDefinition;
}) {
  return (
    <div>
      <Text as="h1" className="text-2xl font-semibold">{definition.title}</Text>
      <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Review and manage {definition.title.toLowerCase()}.
      </Text>
    </div>
  );
}

function StaticTableScreen({ definition }: { definition: TableScreenDefinition }) {
  return (
    <AdminTable
      title={definition.title}
      columns={[...definition.columns, "Actions"]}
      rows={definition.rows.map((row) => [
        ...row,
        <button
          key="actions"
          type="button"
          className="zopping-actions cursor-pointer"
          aria-label={`Actions for ${row[0]}`}
        >
          ⋮
        </button>,
      ])}
      actionLabel={definition.actionLabel}
      dataNodeId={definition.nodeId}
    />
  );
}

function CardsScreen({ definition }: { definition: CardsScreenDefinition }) {
  const isAnalytics = definition.kind === "analytics";

  return (
    <div className={`mt-9 grid gap-4 ${isAnalytics ? "sm:grid-cols-2 xl:grid-cols-4" : "max-w-[720px]"}`}>
      {definition.cards.map((card) => (
        <article
          key={card.label}
          className="flex min-h-[72px] items-center justify-between rounded-[4px] border border-[#e8ede8] bg-[#fafbfa] px-5 py-4"
        >
          <span className="text-xs font-medium text-[#6b7580]">{card.label}</span>
          <strong className="text-sm font-semibold text-[#1f2124]">{card.value}</strong>
        </article>
      ))}
    </div>
  );
}

export function PostInventoryScreen({ moduleName, screen }: {
  moduleName: string;
  screen: string;
}) {
  const definition = getPostInventoryScreen(moduleName, screen);

  if (!definition) return null;
  if (definition.kind === "table") return <StaticTableScreen definition={definition} />;
  if (definition.kind === "form") {
    return <AdminForm title={definition.title} fields={definition.fields} dataNodeId={definition.nodeId} />;
  }

  return (
    <section className="space-y-6" data-node-id={definition.nodeId}>
      <ScreenHeader definition={definition} />
      {definition.kind === "cards" || definition.kind === "analytics" ? (
        <CardsScreen definition={definition} />
      ) : null}
    </section>
  );
}
