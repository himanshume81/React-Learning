export type AdminDataCell = string | { readonly type: "image" };

export type AdminTableDefinition = {
  readonly title: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly AdminDataCell[])[];
  readonly actionLabel?: string;
  readonly tabs?: readonly string[];
  readonly searchable?: boolean;
};

const image = { type: "image" } as const;

export const adminTableDefinitions = {
  orders: {
    title: "Orders",
    columns: ["Order Type & Store", "Cart ID", "Customer", "Items", "Total", "Created"],
    tabs: ["All Orders", "Pending", "Processing", "Confirmed", "Completed"],
    rows: [
      ["DELIVERY / Fresh Tokri", "AIG14", "Virender Kumar", "5", "₹338", "12 Sep 2026"],
      ["DELIVERY / Fresh Tokri", "PU2V2U", "Chandni Goyal", "5", "₹413", "12 Sep 2026"],
      ["DELIVERY / Fresh Tokri", "TMLVV24", "Sarita Chandra", "1", "₹20", "12 Sep 2026"],
    ],
  },
  abandonedCarts: {
    title: "Abandoned Carts",
    columns: ["Order Type & Store", "Cart ID", "Customer", "Items", "Total", "Created"],
    rows: [
      ["DELIVERY / Fresh Tokri", "AIG14", "Virender Kumar", "5", "₹338", "12 Sep 2026"],
      ["DELIVERY / Fresh Tokri", "PU2V2U", "Chandni Goyal", "5", "₹413", "12 Sep 2026"],
      ["DELIVERY / Fresh Tokri", "YKBC0U", "Heena Kalsi", "3", "₹120", "12 Sep 2026"],
    ],
  },
  customers: {
    title: "Customers",
    actionLabel: "+ Create Customer",
    columns: ["", "Name", "Contact", "Join Date", "Status"],
    rows: [
      ["LO", "Lovina", "+918806060680", "03 Sep 2026", "Enabled"],
      ["AJ", "Ajay Chauhan", "+919334448645", "12 Aug 2026", "Enabled"],
      ["SA", "Safdar Bano", "+918857330200", "12 Aug 2026", "Enabled"],
    ],
  },
  products: {
    title: "Products",
    columns: ["Image", "Product", "Category / Brand / Tag", "Status"],
    rows: [
      [image, "TF BROWN BREAD 350GM", "Bread, Bun, Pav", "Enabled"],
      [image, "TF MILK BREAD 350GM", "Bread, Bun, Pav", "Enabled"],
      [image, "TF TEJPATTA 50G", "TFY SPICES", "Enabled"],
    ],
  },
  categories: {
    title: "Categories",
    columns: ["Image", "Category", "Product Count", "Status"],
    rows: [
      [image, "Milk", "3", "Enabled"],
      [image, "Dairy and Bakery", "3", "Enabled"],
      [image, "Sweets", "4", "Hidden"],
      [image, "Kitchen Must-Haves", "4", "Enabled"],
    ],
  },
  brands: {
    title: "Brands",
    actionLabel: "+ Add Brand",
    columns: ["Logo", "Brand", "Product Count", "Status"],
    rows: [
      [image, "Bobby Mart", "0", "Enabled"],
      [image, "Daawat", "0", "Enabled"],
      [image, "Amul", "0", "Enabled"],
      [image, "Fortune", "0", "Enabled"],
    ],
  },
  tags: {
    title: "Tags",
    actionLabel: "+ Add Tag",
    columns: ["Image", "Tag", "Minimum Order Value", "Product Count"],
    rows: [
      [image, "TF SPICES", "0", "18"],
      [image, "TF PULSES", "0", "8"],
      [image, "TFY DRY FRUITS", "0", "9"],
      [image, "Salad Essentials", "0", "0"],
    ],
  },
  productVariants: {
    title: "Product Variants",
    actionLabel: "+ Add Variant",
    columns: ["Product", "Variant", "SKU", "Price", "Stock", "Status"],
    rows: [
      ["TF BROWN BREAD 350GM", "Default", "TF-BB-350", "₹45", "24", "Enabled"],
      ["TF MILK BREAD 350GM", "Default", "TF-MB-350", "₹42", "18", "Enabled"],
      ["TF TEJPATTA 50G", "50 g", "TF-TP-050", "₹32", "36", "Enabled"],
    ],
  },
  stockManagement: {
    title: "Stock Management",
    columns: ["Product", "SKU", "Current Stock", "Reserved", "Available", "Status"],
    rows: [
      ["TF BROWN BREAD 350GM", "TF-BB-350", "24", "3", "21", "In stock"],
      ["TF MILK BREAD 350GM", "TF-MB-350", "18", "2", "16", "In stock"],
      ["TF TEJPATTA 50G", "TF-TP-050", "6", "1", "5", "Low stock"],
    ],
  },
  stockOverrides: {
    title: "Stock Overrides",
    actionLabel: "+ Add Override",
    columns: ["Product", "Store", "Override Stock", "Effective Date", "Status"],
    rows: [
      ["TF BROWN BREAD 350GM", "The Fresh Tokri Sector 50", "20", "12 Sep 2026", "Active"],
      ["TF TEJPATTA 50G", "The Fresh Tokri Sector 50", "10", "12 Sep 2026", "Active"],
    ],
  },
  customerTags: {
    title: "Customer Tags",
    actionLabel: "+ Add Customer Tag",
    columns: ["Tag", "Customers", "Description", "Status"],
    rows: [
      ["VIP", "18", "High-value repeat customers", "Enabled"],
      ["New Customer", "42", "Customers on their first order", "Enabled"],
      ["Inactive", "9", "No recent orders", "Enabled"],
    ],
  },
  orderReturns: {
    title: "Order Returns",
    columns: ["Order", "Customer", "Reason", "Amount", "Requested", "Status"],
    rows: [
      ["#386972", "Ranita", "Damaged item", "₹127", "12 Sep 2026", "Pending"],
      ["#386947", "Abhimanyu", "Wrong item", "₹86", "11 Sep 2026", "Processing"],
    ],
  },
} satisfies Readonly<Record<string, AdminTableDefinition>>;

export type AdminTableKey = keyof typeof adminTableDefinitions;

export const notificationChannels = [
  "Email — Setup needed",
  "Push Notification — Configured",
  "SMS — Setup needed",
  "WhatsApp — Setup needed",
] as const;

export const walletFields = [
  { label: "Expires after *", type: "number" },
  { label: "Cashback Percentage *", type: "number" },
  { label: "Days After Order Completion For Cashback *", type: "number" },
  { label: "Maximum Cashback Amount *", type: "number" },
  { label: "Minimum Recharge Amount For Cashback *", type: "number" },
] as const;
