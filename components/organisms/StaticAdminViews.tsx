import { adminTableDefinitions, type AdminDataCell, type AdminTableKey } from "@/assets/data/admin-views";
import { AdminTable } from "@/components/organisms/AdminTable";
import type { ReactNode } from "react";

function renderCell(cell: AdminDataCell): ReactNode {
  if (typeof cell === "string") return cell;
  return <span aria-hidden="true" className="zopping-image-placeholder">▧</span>;
}

function StaticAdminTable({ view }: { view: AdminTableKey }) {
  const definition = adminTableDefinitions[view];
  const rows = definition.rows.map((row) => [
    ...row.map(renderCell),
    <button key="actions" type="button" aria-label={`More actions for ${String(row[0])}`} className="zopping-actions cursor-pointer">⋮</button>,
  ]);

  return (
    <AdminTable
      title={definition.title}
      columns={[...definition.columns, "Actions"]}
      rows={rows}
      actionLabel={"actionLabel" in definition ? definition.actionLabel : undefined}
      tabs={"tabs" in definition ? definition.tabs : undefined}
    />
  );
}

export function OrdersView({ abandoned = false }: { abandoned?: boolean }) {
  return <StaticAdminTable view={abandoned ? "abandonedCarts" : "orders"} />;
}

export const CustomersView = () => <StaticAdminTable view="customers" />;
export const ProductsView = () => <StaticAdminTable view="products" />;
export const CategoriesView = () => <StaticAdminTable view="categories" />;
export const BrandsView = () => <StaticAdminTable view="brands" />;
export const TagsView = () => <StaticAdminTable view="tags" />;
export const ProductVariantsView = () => <StaticAdminTable view="productVariants" />;
export const StockManagementView = () => <StaticAdminTable view="stockManagement" />;
export const StockOverridesView = () => <StaticAdminTable view="stockOverrides" />;
export const CustomerTagsView = () => <StaticAdminTable view="customerTags" />;
export const OrderReturnsView = () => <StaticAdminTable view="orderReturns" />;
