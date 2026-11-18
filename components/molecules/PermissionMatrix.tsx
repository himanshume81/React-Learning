"use client";

import { changePermission, MENU_ITEMS, type PermissionAction, type Permissions } from "@/lib/rbac/permissions";

const actions: { key: PermissionAction; label: string }[] = [
  { key: "view", label: "View" }, { key: "addEdit", label: "Add/Edit" }, { key: "delete", label: "Delete" },
];

export function PermissionMatrix({ permissions, disabled = false, onChange }: {
  permissions: Permissions;
  disabled?: boolean;
  onChange: (permissions: Permissions) => void;
}) {
  return (
          <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left text-sm">
            <caption className="sr-only">Menu permissions</caption>
            <thead><tr><th scope="col" className="p-3">Menu</th>{actions.map(({ key, label }) => <th key={key} scope="col" className="p-3 text-center">{label}</th>)}</tr></thead>
            <tbody>{MENU_ITEMS.map(({ key: menu, label }) => <tr key={menu} className="border-t border-zinc-200 dark:border-zinc-800">
              <th scope="row" className="p-3 font-medium">{menu === "categories" ? "Categories" : label}</th>
              {actions.map(({ key: action, label: actionLabel }) => <td key={action} className="p-3 text-center"><input type="checkbox" aria-label={`${label}: ${actionLabel}`} checked={permissions[menu][action]} disabled={disabled || ((menu === "dashboard" || menu === "users") && action !== "view")} onChange={(event) => onChange(changePermission(permissions, menu, action, event.target.checked))} className="h-4 w-4 accent-green-700" /></td>)}
            </tr>)}</tbody>
          </table></div>
  );
}
