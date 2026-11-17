export const MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "orders", label: "Orders", href: "/orders" },
  { key: "users", label: "Users", href: "/users" },
  { key: "products", label: "Products", href: "/products" },
  { key: "categories", label: "Category", href: "/categories" },
] as const;

export type MenuKey = (typeof MENU_ITEMS)[number]["key"];
export type PermissionAction = "view" | "addEdit" | "delete";
export type MenuPermissions = Record<PermissionAction, boolean>;
export type Permissions = Record<MenuKey, MenuPermissions>;
export type PermissionUser = {
  role: string;
  status: string;
  permissions?: Permissions;
} | null;

export function emptyPermissions(): Permissions {
  return Object.fromEntries(MENU_ITEMS.map(({ key }) => [key, { view: false, addEdit: false, delete: false }])) as Permissions;
}

// Treat missing or malformed grants as denied. Unsupported writes never apply.
export function normalizePermissions(value: unknown): Permissions {
  const result = emptyPermissions();
  if (!value || typeof value !== "object") return result;
  for (const { key } of MENU_ITEMS) {
    const grant = (value as Record<string, unknown>)[key];
    if (!grant || typeof grant !== "object") continue;
    const row = grant as Record<string, unknown>;
    const view = row.view === true;
    const writable = key !== "dashboard" && key !== "users";
    result[key] = { view, addEdit: writable && view && row.addEdit === true, delete: writable && view && row.delete === true };
  }
  return result;
}

export function isAdmin(user: PermissionUser): boolean {
  return user?.status === "active" && user.role === "admin";
}

export function can(user: PermissionUser, menu: MenuKey, action: PermissionAction = "view"): boolean {
  if (!user || user.status !== "active") return false;
  if (isAdmin(user)) return true;
  if ((menu === "users" || menu === "dashboard") && action !== "view") return false;
  return user.permissions?.[menu]?.view === true && user.permissions[menu][action] === true;
}

export function firstPermittedPage(user: PermissionUser): string {
  return MENU_ITEMS.find(({ key }) => can(user, key))?.href ?? "/no-access";
}

export function changePermission(permissions: Permissions, menu: MenuKey, action: PermissionAction, checked: boolean): Permissions {
  if ((menu === "dashboard" || menu === "users") && action !== "view") return permissions;
  const row = { ...permissions[menu], [action]: checked };
  if (action === "view" && !checked) { row.addEdit = false; row.delete = false; }
  if (action !== "view" && checked) row.view = true;
  return { ...permissions, [menu]: row };
}

export function routeAllowed(user: PermissionUser, pathname: string): boolean {
  if (pathname === "/no-access") return true;
  if (isAdmin(user)) return true;
  if (pathname === "/") return can(user, "dashboard");
  const item = MENU_ITEMS.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`));
  if (!item) return false; // Previously hidden modules remain admin-only.
  if (item.key === "users" && (pathname === "/users/add" || pathname.endsWith("/edit"))) return false;
  return can(user, item.key);
}
