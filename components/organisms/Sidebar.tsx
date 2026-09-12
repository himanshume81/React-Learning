"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/atoms/Logo";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/user";

type NavItem = {
  href: string;
  label: string;
  roles?: UserRole[];
};

type NavSection = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const navigation: NavSection[] = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Orders",
    children: [
      { href: "/orders", label: "Orders" },
      { href: "/orders/abandoned-carts", label: "Abandoned Carts" },
      { href: "/orders/returns", label: "Order Returns" },
    ],
  },
  {
    label: "Customers",
    children: [
      { href: "/customers", label: "Customers" },
      { href: "/customers/notify-me", label: "Notify Me" },
      { href: "/customers/tags", label: "Customer Tags" },
      { href: "/customers/wallet", label: "Wallet" },
    ],
  },
  {
    label: "Catalogue",
    children: [
      { href: "/products", label: "Products" },
      { href: "/categories", label: "Categories" },
      { href: "/brands", label: "Brands" },
      { href: "/tags", label: "Tags" },
      { href: "/product-variants", label: "Product Variants" },
      { href: "/stock-overrides", label: "Stock Overrides" },
    ],
  },
  { label: "Inventory", children: [{ href: "/inventory", label: "Stock Management" }] },
  {
    label: "Storefront",
    children: [
      { href: "/storefront/website", label: "Website" },
      { href: "/storefront/blog", label: "Blog" },
      { href: "/storefront/static-pages", label: "Static Pages" },
      { href: "/banners", label: "Marketing Banners" },
      { href: "/storefront/facebook-sdk", label: "Facebook SDK" },
      { href: "/storefront/seo", label: "SEO" },
      { href: "/storefront/customer-sign-up", label: "Customer Sign-Up" },
      { href: "/storefront/preferences", label: "Preferences" },
    ],
  },
  {
    label: "Marketing",
    children: [
      { href: "/marketing/coupons", label: "Coupons" },
      { href: "/marketing/google-analytics", label: "Google Analytics" },
      { href: "/marketing/google-merchant-center", label: "Google Merchant Center" },
      { href: "/marketing/google-tag-manager", label: "Google Tag Manager" },
      { href: "/marketing/campaigns", label: "Campaigns" },
      { href: "/marketing/facebook-analytics", label: "Facebook Analytics" },
      { href: "/marketing/offers-management", label: "Offers Management" },
      { href: "/marketing/referral-management", label: "Referral Management" },
    ],
  },
  {
    label: "Fulfilment",
    children: [
      { href: "/fulfilment/packaging", label: "Packaging" },
      { href: "/fulfilment/slot-blocking", label: "Slot Blocking" },
    ],
  },
  {
    label: "Delivery",
    children: [
      { href: "/delivery/delivery-areas", label: "Delivery Areas" },
      { href: "/delivery/manage-runner", label: "Manage Runner" },
      { href: "/delivery/delivery-support", label: "Delivery Support" },
      { href: "/delivery/slot-charges", label: "Slot Charges" },
      { href: "/delivery/slots", label: "Slots" },
      { href: "/delivery/trip-planner", label: "Trip Planner" },
      { href: "/delivery/trips", label: "Trips" },
      { href: "/delivery/vehicle", label: "Vehicle" },
      { href: "/delivery/vehicle-planner", label: "Vehicle Planner" },
      { href: "/delivery/configuration", label: "Delivery Configuration" },
    ],
  },
  {
    label: "Insights",
    children: [
      { href: "/insights/order-analytics", label: "Order Analytics" },
      { href: "/insights/reports", label: "Reports" },
      { href: "/insights/user-activity-logs", label: "User Activity Logs" },
    ],
  },
  {
    label: "Team",
    children: [
      { href: "/team/staff-management", label: "Staff Management", roles: ["admin"] },
      { href: "/users", label: "Users and Permissions", roles: ["admin"] },
    ],
  },
  {
    label: "Integrations",
    children: [
      { href: "/integrations/google-api-keys", label: "Google API Keys" },
      { href: "/integrations/health-check", label: "Health Check" },
      { href: "/integrations/webhook-integration", label: "Webhook Integration" },
      { href: "/integrations/partner-integration", label: "Partner Integration" },
    ],
  },
  {
    label: "Settings",
    children: [
      { href: "/settings/stores", label: "Stores" },
      { href: "/settings/my-plans", label: "My Plans" },
      { href: "/settings/custom-fields", label: "Custom Fields" },
      { href: "/settings/extensions", label: "Extensions" },
    ],
  },
];

function routeIsActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarNavProps = {
  pathname: string;
  onNavigate?: () => void;
};

function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  const { user, status } = useAuth();
  const initialExpanded = navigation.find((section) =>
    section.children?.some((item) => routeIsActive(pathname, item.href))
  )?.label ?? null;
  const [expanded, setExpanded] = useState<string | null>(initialExpanded);

  function itemIsVisible(item: NavItem) {
    if (!item.roles) return true;
    return status === "authenticated" && Boolean(user) && item.roles.includes(user!.role);
  }

  return (
    <nav aria-label="Primary navigation" className="py-4">
      {navigation.map((section) => {
        const children = section.children?.filter(itemIsVisible) ?? [];
        if (!section.href && children.length === 0) return null;

        if (section.href) {
          const active = routeIsActive(pathname, section.href);
          return (
            <Link
              key={section.label}
              href={section.href}
              onClick={onNavigate}
              className={`flex h-11 cursor-pointer items-center px-[22px] text-[15px] transition-colors ${
                active
                  ? "bg-[#f0faeb] font-medium text-[#4a942e] dark:bg-green-950/40 dark:text-green-400"
                  : "text-[#6b7580] hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {section.label}
            </Link>
          );
        }

        const active = children.some((item) => routeIsActive(pathname, item.href));
        const isExpanded = expanded === section.label;
        return (
          <div key={section.label}>
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() =>
                setExpanded((current) => current === section.label ? null : section.label)
              }
              className={`flex h-11 w-full cursor-pointer items-center justify-between px-[22px] text-left text-[15px] transition-colors ${
                active
                  ? "bg-[#f0faeb] font-medium text-[#4a942e] dark:bg-green-950/40 dark:text-green-400"
                  : "text-[#6b7580] hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              <span>{section.label}</span>
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 border-b-[1.5px] border-r-[1.5px] border-current transition-transform duration-200 ${isExpanded ? "rotate-45" : "-rotate-45"}`}
              />
            </button>

            {isExpanded ? (
              <div className="py-1.5">
                {children.map((item) => {
                  const childActive = routeIsActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`mx-[18px] flex min-h-10 cursor-pointer items-center rounded-md px-6 py-2 text-[14px] transition-colors ${
                        childActive
                          ? "bg-[#f0faeb] font-medium text-[#4a942e] dark:bg-green-950/40 dark:text-green-400"
                          : "text-[#6b7580] hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

type SidebarProps = {
  isMobileOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isMobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMobileOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onClose]);

  const sidebarContent = (mobile = false) => (
    <>
      <div className="flex h-[72px] items-center justify-between border-b border-[#e8ede8] px-[22px] dark:border-zinc-800">
        <Logo />
        {mobile ? (
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">✕</button>
        ) : null}
      </div>
      <SidebarNav key={pathname} pathname={pathname} onNavigate={mobile ? onClose : undefined} />
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 overflow-y-auto border-r border-[#e8ede8] bg-white md:block dark:border-zinc-800 dark:bg-zinc-950">
        {sidebarContent()}
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 h-full w-full bg-black/40" />
          <aside role="dialog" aria-modal="true" aria-label="Menu" className="absolute inset-y-0 left-0 w-[280px] overflow-y-auto border-r border-[#e8ede8] bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            {sidebarContent(true)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
