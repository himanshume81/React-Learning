export type ScreenField = {
  readonly label: string;
  readonly placeholder?: string;
  readonly type?: "text" | "number" | "url" | "textarea" | "select";
};

export type ScreenCard = {
  readonly label: string;
  readonly value: string;
};

type ScreenBase = {
  readonly title: string;
  readonly nodeId: string;
};

export type TableScreenDefinition = ScreenBase & {
  readonly kind: "table";
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly actionLabel?: string;
};

export type FormScreenDefinition = ScreenBase & {
  readonly kind: "form";
  readonly fields: readonly ScreenField[];
};

export type CardsScreenDefinition = ScreenBase & {
  readonly kind: "cards" | "analytics";
  readonly cards: readonly ScreenCard[];
};

export type ScreenDefinition =
  | TableScreenDefinition
  | FormScreenDefinition
  | CardsScreenDefinition;

const standardRows = [
  ["Sample record", "Default", "Enabled", "12 Sep 2026"],
  ["Example record", "Custom", "Enabled", "11 Sep 2026"],
  ["Another record", "Default", "Disabled", "10 Sep 2026"],
] as const;

const table = (
  title: string,
  nodeId: string,
  columns: readonly string[] = ["Name", "Type", "Status", "Updated"],
  rows: readonly (readonly string[])[] = standardRows,
  actionLabel = "+ Add"
): TableScreenDefinition => ({ title, nodeId, kind: "table", columns, rows, actionLabel });

const form = (title: string, nodeId: string, fields: readonly ScreenField[]): FormScreenDefinition => ({
  title,
  nodeId,
  kind: "form",
  fields,
});

const screenDefinitions = {
  "storefront/website": form("Website", "2:658", [
    { label: "Store Name", placeholder: "The Fresh Tokri" },
    { label: "Website URL", type: "url", placeholder: "https://www.thefreshtokri.com" },
    { label: "Theme / Appearance", type: "select" },
  ]),
  "storefront/blog": table("Blog", "2:694"),
  "storefront/static-pages": table("Static Pages", "2:750"),
  "storefront/facebook-sdk": form("Facebook SDK", "2:862", [
    { label: "Facebook App ID" },
    { label: "Facebook App Secret" },
    { label: "Facebook Pixel ID" },
  ]),
  "storefront/seo": form("SEO", "2:898", [
    { label: "Site Title" },
    { label: "Meta Description", type: "textarea" },
    { label: "Meta Keywords" },
    { label: "Search Engine Indexing", type: "select" },
  ]),
  "storefront/customer-sign-up": form("Customer Sign-Up", "2:941", [
    { label: "Sign-Up Method", type: "select" },
    { label: "OTP Verification", type: "select" },
    { label: "Welcome Message", type: "textarea" },
  ]),
  "storefront/preferences": form("Preferences", "2:977", [
    { label: "Store Language", type: "select" },
    { label: "Currency", type: "select" },
    { label: "Timezone", type: "select" },
    { label: "Date Format", type: "select" },
  ]),

  "marketing/coupons": table(
    "Coupons",
    "2:1013",
    ["Coupon", "Discount", "Usage", "Status"],
    [
      ["WELCOME10", "10%", "24", "Enabled"],
      ["FRESH50", "₹50", "12", "Enabled"],
      ["SAVE20", "20%", "8", "Disabled"],
    ],
    "+ Add Coupon"
  ),
  "marketing/google-analytics": form("Google Analytics", "2:1069", [
    { label: "Measurement ID", placeholder: "G-XXXXXXXXXX" },
    { label: "Enable Enhanced Ecommerce", type: "select" },
  ]),
  "marketing/google-merchant-center": form("Google Merchant Center", "2:1103", [
    { label: "Merchant ID" },
    { label: "Product Feed Country", type: "select" },
    { label: "Product Feed Language", type: "select" },
  ]),
  "marketing/google-tag-manager": form("Google Tag Manager", "2:1139", [
    { label: "Container ID", placeholder: "GTM-XXXXXXX" },
    { label: "Enable Tag Manager", type: "select" },
  ]),
  "marketing/campaigns": table("Campaigns", "2:1173", ["Campaign", "Channel", "Status", "Updated"], undefined, "+ Add Campaign"),
  "marketing/facebook-analytics": form("Facebook Analytics", "2:1229", [
    { label: "Pixel ID" },
    { label: "Conversion API Token" },
    { label: "Track Customer Events", type: "select" },
  ]),
  "marketing/offers-management": table("Offers Management", "2:1263", ["Offer", "Type", "Status", "Updated"], undefined, "+ Add Offer"),
  "marketing/referral-management": form("Referral Management", "2:1319", [
    { label: "Referral Reward" },
    { label: "Referee Reward" },
    { label: "Minimum Order Value", type: "number" },
    { label: "Referral Program Status", type: "select" },
  ]),

  "fulfilment/packaging": table("Packaging", "2:1355", ["Packaging", "Charge", "Status", "Updated"], undefined, "+ Add Packaging"),
  "fulfilment/slot-blocking": form("Slot Blocking", "2:1405", [
    { label: "Store", type: "select" },
    { label: "Delivery Date" },
    { label: "Slots to Block", type: "select" },
    { label: "Reason", type: "textarea" },
  ]),

  "delivery/delivery-areas": table("Delivery Areas", "2:1435", ["Area", "Postal Codes", "Charge", "Status"], undefined, "+ Add Area"),
  "delivery/manage-runner": table(
    "Manage Runner",
    "2:1476",
    ["Runner", "Contact", "Vehicle", "Status"],
    [
      ["Aman Singh", "+91 98765 43210", "Bike", "Available"],
      ["Ravi Kumar", "+91 98111 22334", "Scooter", "On delivery"],
    ],
    "+ Add Runner"
  ),
  "delivery/delivery-support": form("Delivery Support", "2:1534", [
    { label: "Support Phone" },
    { label: "Support Email" },
    { label: "Support Message", type: "textarea" },
  ]),
  "delivery/slot-charges": table("Slot Charges", "2:1572", ["Slot", "Minimum Order", "Charge", "Status"], undefined, "+ Add Charge"),
  "delivery/slots": table(
    "Slots",
    "2:1630",
    ["Slot", "Capacity", "Cut-Off", "Status"],
    [
      ["08:00 AM – 10:00 AM", "30 orders", "60 minutes", "Enabled"],
      ["10:00 AM – 12:00 PM", "30 orders", "60 minutes", "Enabled"],
    ],
    "+ Add Slot"
  ),
  "delivery/trip-planner": form("Trip Planner", "2:1688", [
    { label: "Delivery Date" },
    { label: "Delivery Slot", type: "select" },
    { label: "Delivery Area", type: "select" },
    { label: "Assign Runner", type: "select" },
  ]),
  "delivery/trips": table("Trips", "2:1726", ["Trip", "Runner", "Orders", "Status"], undefined, "+ Create Trip"),
  "delivery/vehicle": table("Vehicle", "2:1784", ["Vehicle", "Registration", "Type", "Status"], undefined, "+ Add Vehicle"),
  "delivery/vehicle-planner": form("Vehicle Planner", "2:1842", [
    { label: "Delivery Date" },
    { label: "Vehicle", type: "select" },
    { label: "Runner", type: "select" },
    { label: "Trip", type: "select" },
  ]),
  "delivery/configuration": form("Delivery Configuration", "2:1880", [
    { label: "Default Delivery Charge", type: "number" },
    { label: "Free Delivery Above", type: "number" },
    { label: "Maximum Delivery Distance", type: "number" },
    { label: "Delivery Assignment", type: "select" },
  ]),

  "insights/order-analytics": {
    title: "Order Analytics",
    nodeId: "2:1916",
    kind: "analytics",
    cards: [
      { label: "Total Orders", value: "39" },
      { label: "Completed Orders", value: "31" },
      { label: "Average Order Value", value: "₹412" },
      { label: "Fill Rate", value: "96.4%" },
    ],
  },
  "insights/reports": table(
    "Reports",
    "2:1949",
    ["Report", "Period", "Generated", "Format"],
    [
      ["Sales Report", "This month", "12 Sep 2026", "PDF"],
      ["Inventory Report", "This week", "11 Sep 2026", "CSV"],
    ],
    "+ Generate Report"
  ),
  "insights/user-activity-logs": table(
    "User Activity Logs",
    "2:1978",
    ["User", "Activity", "IP Address", "Time"],
    [
      ["Admin", "Updated product", "192.168.1.10", "12 Sep 2026, 10:35 AM"],
      ["Mohit", "Completed order", "192.168.1.12", "12 Sep 2026, 10:20 AM"],
    ],
    ""
  ),

  "team/staff-management": table("Staff Management", "2:2029", ["Staff", "Role", "Contact", "Status"], undefined, "+ Add Staff"),

  "integrations/google-api-keys": form("Google API Keys", "2:2125", [
    { label: "Google Maps API Key" },
    { label: "Places API Key" },
    { label: "Firebase Server Key" },
  ]),
  "integrations/health-check": {
    title: "Health Check",
    nodeId: "2:2157",
    kind: "cards",
    cards: [
      { label: "Storefront", value: "Operational" },
      { label: "Order Service", value: "Operational" },
      { label: "Payment Gateway", value: "Operational" },
      { label: "Notification Service", value: "Operational" },
    ],
  },
  "integrations/webhook-integration": table("Webhook Integration", "2:2189", ["Webhook", "Event", "Status", "Updated"], undefined, "+ Add Webhook"),
  "integrations/partner-integration": table("Partner Integration", "2:2221", ["Partner", "Type", "Status", "Updated"], undefined, "+ Add Partner"),

  "settings/stores": table("Stores", "2:2273"),
  "settings/my-plans": {
    title: "My Plans",
    nodeId: "2:2325",
    kind: "cards",
    cards: [
      { label: "Current Plan", value: "Growth" },
      { label: "Billing cycle", value: "Monthly" },
      { label: "Stores used", value: "1 of 3" },
      { label: "Users used", value: "4 of 10" },
      { label: "Upgrade plan", value: "View plans" },
    ],
  },
  "settings/custom-fields": table("Custom Fields", "2:2359"),
  "settings/extensions": {
    title: "Extensions",
    nodeId: "2:2411",
    kind: "cards",
    cards: [
      { label: "Installed Extensions", value: "4" },
      { label: "Available Extensions", value: "12" },
      { label: "Payment integrations", value: "Manage" },
      { label: "Delivery integrations", value: "Manage" },
    ],
  },
} satisfies Readonly<Record<string, ScreenDefinition>>;

export const postInventoryScreens = screenDefinitions;
export type PostInventoryScreenKey = keyof typeof postInventoryScreens;

export function getPostInventoryScreen(moduleName: string, screen: string): ScreenDefinition | undefined {
  const key = `${moduleName}/${screen}` as PostInventoryScreenKey;
  return postInventoryScreens[key];
}
