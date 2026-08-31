export type MetricTone = "neutral" | "success" | "danger";

export type StatusTone = "neutral" | "success" | "danger" | "info";

export type CellValue =
  | string
  | number
  | {
      value: string;
      tone?: StatusTone;
    };

export type Metric = {
  label: string;
  value: string;
  hint?: string;
  tone?: MetricTone;
};

export type ChartPoint = {
  label: string;
  value: number;
  change: string;
};

export type TableConfig = {
  columns: string[];
  rows: Array<Record<string, CellValue>>;
};

export type PanelConfig = {
  title: string;
  description?: string;
  items: string[];
};

export type PageConfig = {
  title: string;
  description: string;
  actions?: string[];
  filters?: string[];
  metrics?: Metric[];
  charts?: ChartPoint[];
  highlights?: Array<{
    label: string;
    value: string;
  }>;
  table?: TableConfig;
  panels?: PanelConfig[];
  timeline?: Array<{
    label: string;
    tone?: StatusTone;
  }>;
  note?: string;
};

const status = (value: string, tone: StatusTone = "neutral") => ({
  value,
  tone,
});

const dashboardMetrics: Metric[] = [
  { label: "Today's Orders", value: "124", hint: "+18 vs yesterday", tone: "success" },
  { label: "Pending Orders", value: "31", hint: "Needs store confirmation" },
  { label: "In Progress Orders", value: "44", hint: "Packing and dispatch" },
  { label: "Completed Orders", value: "287", hint: "Delivered this week", tone: "success" },
  { label: "Cancelled Orders", value: "9", hint: "2.4% cancellation rate", tone: "danger" },
  { label: "Returned Orders", value: "6", hint: "Mostly quality issues" },
  { label: "New Customers Today", value: "42", hint: "Mobile-first signups", tone: "success" },
  { label: "Total Sales", value: "$18,760", hint: "Gross merchandise value", tone: "success" },
  { label: "Total Revenue", value: "$14,920", hint: "Net after discounts", tone: "success" },
];

const pageConfigs: Record<string, PageConfig> = {
  dashboard: {
    title: "Dashboard",
    description: "Static admin overview with KPIs, growth snapshots, and operational signals.",
    filters: ["Today", "Yesterday", "7 Days", "30 Days", "Custom Range"],
    metrics: dashboardMetrics,
    charts: [
      { label: "Sales", value: 74, change: "+12.4%" },
      { label: "Orders", value: 61, change: "+8.1%" },
      { label: "Revenue", value: 69, change: "+10.7%" },
    ],
    panels: [
      {
        title: "Operational focus",
        items: [
          "3 stores are close to low-stock thresholds on top sellers.",
          "14 orders are waiting for manual payment verification.",
          "2 delivery slots are nearing max capacity for the evening window.",
        ],
      },
      {
        title: "What this static version includes",
        items: [
          "Module-ready KPIs and chart placeholders.",
          "Mock data that can be swapped for API responses later.",
          "A route structure aligned with the requirement document.",
        ],
      },
    ],
  },
  userStores: {
    title: "Stores",
    description: "Manage retail stores, managers, status, and operational coverage.",
    actions: ["Add store", "Export"],
    filters: ["Search", "Status", "Location", "Manager", "Created At"],
    metrics: [
      { label: "Total Stores", value: "18" },
      { label: "Active Stores", value: "15", tone: "success" },
      { label: "Disabled Stores", value: "3", tone: "danger" },
      { label: "New This Month", value: "2", tone: "success" },
    ],
    table: {
      columns: [
        "Store Name",
        "Code",
        "Location",
        "Manager",
        "Phone",
        "Status",
        "Created At",
        "Actions",
      ],
      rows: [
        {
          "Store Name": "Downtown Fresh",
          Code: "STR-001",
          Location: "Bangalore Central",
          Manager: "Aarav Menon",
          Phone: "+91 98765 12001",
          Status: status("Enabled", "success"),
          "Created At": "2026-01-12",
          Actions: "Edit / Disable / Delete",
        },
        {
          "Store Name": "Lakeside Mart",
          Code: "STR-004",
          Location: "Whitefield",
          Manager: "Nisha Rao",
          Phone: "+91 98765 12004",
          Status: status("Enabled", "success"),
          "Created At": "2026-03-18",
          Actions: "Edit / Disable / Delete",
        },
        {
          "Store Name": "Express Pickup Hub",
          Code: "STR-009",
          Location: "Indiranagar",
          Manager: "Karan Gill",
          Phone: "+91 98765 12009",
          Status: status("Disabled", "danger"),
          "Created At": "2025-11-06",
          Actions: "Edit / Enable / Delete",
        },
      ],
    },
  },
  userStaff: {
    title: "Staff",
    description: "Track store staff, shifts, assignment, attendance tolerance, and salary reporting.",
    actions: ["Add staff", "Generate attendance report"],
    filters: ["Search", "Store", "Designation", "Status", "Shift"],
    metrics: [
      { label: "Total Staff", value: "64" },
      { label: "Present Today", value: "51", tone: "success" },
      { label: "Late Check-ins", value: "7", tone: "danger" },
      { label: "Stores Covered", value: "18" },
    ],
    table: {
      columns: [
        "Name",
        "Designation",
        "Salary",
        "Store",
        "Time In",
        "Time Out",
        "Attendance Tolerance",
        "Status",
        "Actions",
      ],
      rows: [
        {
          Name: "Ritika Shah",
          Designation: "Store Supervisor",
          Salary: "$1,250",
          Store: "Downtown Fresh",
          "Time In": "08:55 AM",
          "Time Out": "06:10 PM",
          "Attendance Tolerance": "15 mins",
          Status: status("Enabled", "success"),
          Actions: "Edit / Disable / Report",
        },
        {
          Name: "Manav Suri",
          Designation: "Cashier",
          Salary: "$720",
          Store: "Lakeside Mart",
          "Time In": "09:07 AM",
          "Time Out": "05:45 PM",
          "Attendance Tolerance": "10 mins",
          Status: status("Enabled", "success"),
          Actions: "Edit / Disable / Report",
        },
        {
          Name: "Priya Nair",
          Designation: "Picker",
          Salary: "$640",
          Store: "Express Pickup Hub",
          "Time In": "10:18 AM",
          "Time Out": "07:00 PM",
          "Attendance Tolerance": "10 mins",
          Status: status("Disabled", "danger"),
          Actions: "Edit / Enable / Report",
        },
      ],
    },
    panels: [
      {
        title: "Static report blocks",
        items: [
          "Monthly salary summary by staff member.",
          "Attendance variance against shift start and end.",
          "Store assignment coverage for understaffed branches.",
        ],
      },
    ],
  },
  userRoles: {
    title: "Roles & Permissions",
    description: "Module-wise permission management for admin, store, operations, and marketing teams.",
    actions: ["Create role", "Clone role"],
    metrics: [
      { label: "Roles", value: "6" },
      { label: "Permission Sets", value: "15" },
      { label: "Modules Covered", value: "15" },
    ],
    table: {
      columns: ["Role", "Users", "Dashboard", "Orders", "Catalogue", "Reports", "Actions"],
      rows: [
        {
          Role: "Super Admin",
          Users: "3",
          Dashboard: "View / Manage",
          Orders: "View / Create / Update / Delete / Export / Manage",
          Catalogue: "View / Create / Update / Delete / Export",
          Reports: "View / Export",
          Actions: "Edit permissions",
        },
        {
          Role: "Store Manager",
          Users: "18",
          Dashboard: "View",
          Orders: "View / Update / Manage",
          Catalogue: "View / Update",
          Reports: "View",
          Actions: "Edit permissions",
        },
        {
          Role: "Marketing Executive",
          Users: "5",
          Dashboard: "View",
          Orders: "View",
          Catalogue: "View",
          Reports: "View / Export",
          Actions: "Edit permissions",
        },
      ],
    },
    panels: [
      {
        title: "Available permissions",
        items: ["View", "Create", "Update", "Delete", "Export", "Manage"],
      },
    ],
  },
  catalogueProducts: {
    title: "Products",
    description: "Product catalogue with search, sorting, filters, pagination, and store-level visibility.",
    actions: ["Add product", "Bulk import", "Export"],
    filters: ["Search", "Category", "Brand", "Store", "Status", "Stock", "Sort"],
    metrics: [
      { label: "Products", value: "428" },
      { label: "Low Stock", value: "27", tone: "danger" },
      { label: "Active", value: "392", tone: "success" },
      { label: "Draft / Disabled", value: "36" },
    ],
    table: {
      columns: [
        "Name",
        "SKU",
        "Category",
        "Brand",
        "Price",
        "Discount Price",
        "Stock",
        "Status",
        "Store",
        "Updated At",
      ],
      rows: [
        {
          Name: "Cold Brew Coffee 1L",
          SKU: "CB-1001",
          Category: "Beverages / Coffee",
          Brand: "Bean & Barrel",
          Price: "$8.99",
          "Discount Price": "$7.49",
          Stock: "42",
          Status: status("Enabled", "success"),
          Store: "Downtown Fresh",
          "Updated At": "2026-08-25",
        },
        {
          Name: "Organic Almond Butter",
          SKU: "AB-2208",
          Category: "Pantry / Spreads",
          Brand: "Nutri Roots",
          Price: "$11.25",
          "Discount Price": "$9.99",
          Stock: "9",
          Status: status("Low Stock", "danger"),
          Store: "Lakeside Mart",
          "Updated At": "2026-08-26",
        },
        {
          Name: "Fresh Basil Pack",
          SKU: "FV-0310",
          Category: "Produce / Herbs",
          Brand: "Farm Drop",
          Price: "$2.40",
          "Discount Price": "$2.10",
          Stock: "65",
          Status: status("Enabled", "success"),
          Store: "All Stores",
          "Updated At": "2026-08-27",
        },
      ],
    },
  },
  catalogueCategories: {
    title: "Categories",
    description: "Hierarchical category management for top-level and nested catalogue classification.",
    actions: ["Add category"],
    table: {
      columns: ["Name", "Parent Category", "Description", "Image", "Status", "Actions"],
      rows: [
        {
          Name: "Beverages",
          "Parent Category": "Root",
          Description: "Cold drinks, juices, tea, and coffee.",
          Image: "beverages.jpg",
          Status: status("Enabled", "success"),
          Actions: "Edit / Disable",
        },
        {
          Name: "Coffee",
          "Parent Category": "Beverages",
          Description: "Ground coffee, beans, instant, and brew packs.",
          Image: "coffee.jpg",
          Status: status("Enabled", "success"),
          Actions: "Edit / Disable",
        },
        {
          Name: "Seasonal Specials",
          "Parent Category": "Root",
          Description: "Limited-time collections.",
          Image: "seasonal.jpg",
          Status: status("Disabled", "danger"),
          Actions: "Edit / Enable",
        },
      ],
    },
  },
  catalogueBrands: {
    title: "Brands",
    description: "Brand master data, logos, descriptions, and publish status.",
    actions: ["Add brand"],
    table: {
      columns: ["Name", "Logo", "Description", "Status", "Actions"],
      rows: [
        {
          Name: "Bean & Barrel",
          Logo: "bean-barrel.svg",
          Description: "Premium coffee and cafe essentials.",
          Status: status("Enabled", "success"),
          Actions: "Edit / Disable",
        },
        {
          Name: "Nutri Roots",
          Logo: "nutri-roots.svg",
          Description: "Healthy pantry staples and protein snacks.",
          Status: status("Enabled", "success"),
          Actions: "Edit / Disable",
        },
        {
          Name: "FreshFoundry",
          Logo: "freshfoundry.svg",
          Description: "Private-label grocery essentials.",
          Status: status("Draft", "info"),
          Actions: "Edit / Publish",
        },
      ],
    },
  },
  catalogueTags: {
    title: "Tags",
    description: "Simple tag CRUD for merchandising, discovery, and dynamic collections.",
    actions: ["Add tag"],
    table: {
      columns: ["Tag", "Usage", "Status", "Actions"],
      rows: [
        { Tag: "Best Seller", Usage: "34 products", Status: status("Active", "success"), Actions: "Edit / Delete" },
        { Tag: "New Arrival", Usage: "19 products", Status: status("Active", "success"), Actions: "Edit / Delete" },
        { Tag: "Weekend Deal", Usage: "11 products", Status: status("Scheduled", "info"), Actions: "Edit / Delete" },
      ],
    },
  },
  ordersAll: {
    title: "Orders",
    description: "Full order management with customer, store, payment, and delivery filters.",
    actions: ["Create manual order", "Export"],
    filters: ["Search", "Status", "Store", "Customer", "Payment Status", "Start Date", "End Date"],
    metrics: [
      { label: "Total Orders", value: "1,284" },
      { label: "Pending", value: "31" },
      { label: "Processing", value: "44" },
      { label: "Completed", value: "1,113", tone: "success" },
    ],
    table: {
      columns: [
        "Order ID",
        "Customer",
        "Store",
        "Items",
        "Total",
        "Payment Status",
        "Order Status",
        "Delivery Status",
        "Order Date",
        "Actions",
      ],
      rows: [
        {
          "Order ID": "#ORD-10021",
          Customer: "Anika Sharma",
          Store: "Downtown Fresh",
          Items: "5",
          Total: "$78.60",
          "Payment Status": status("Paid", "success"),
          "Order Status": status("Pending", "info"),
          "Delivery Status": status("Awaiting Pickup", "neutral"),
          "Order Date": "2026-08-27 09:14",
          Actions: "View / Update",
        },
        {
          "Order ID": "#ORD-10018",
          Customer: "Rahul Verma",
          Store: "Lakeside Mart",
          Items: "3",
          Total: "$42.10",
          "Payment Status": status("Paid", "success"),
          "Order Status": status("Processing", "info"),
          "Delivery Status": status("Out for Delivery", "info"),
          "Order Date": "2026-08-27 08:42",
          Actions: "View / Update",
        },
        {
          "Order ID": "#ORD-10002",
          Customer: "Maya Kapoor",
          Store: "Downtown Fresh",
          Items: "7",
          Total: "$91.25",
          "Payment Status": status("Refunded", "danger"),
          "Order Status": status("Returned", "danger"),
          "Delivery Status": status("Closed", "neutral"),
          "Order Date": "2026-08-26 18:30",
          Actions: "View / Update",
        },
      ],
    },
  },
  ordersPending: {
    title: "Pending Orders",
    description: "Orders waiting for confirmation or payment verification.",
    filters: ["Search", "Store", "Payment Status"],
    table: {
      columns: ["Order ID", "Customer", "Store", "Total", "Payment Status", "Order Date"],
      rows: [
        {
          "Order ID": "#ORD-10021",
          Customer: "Anika Sharma",
          Store: "Downtown Fresh",
          Total: "$78.60",
          "Payment Status": status("Paid", "success"),
          "Order Date": "2026-08-27 09:14",
        },
        {
          "Order ID": "#ORD-10017",
          Customer: "Dev Mehta",
          Store: "Koramangala Hub",
          Total: "$31.40",
          "Payment Status": status("Awaiting Confirmation", "info"),
          "Order Date": "2026-08-27 08:20",
        },
      ],
    },
  },
  ordersInProgress: {
    title: "In Progress Orders",
    description: "Packing, picking, and dispatch operations that are currently active.",
    filters: ["Search", "Store", "Delivery Status"],
    table: {
      columns: ["Order ID", "Customer", "Store", "Items", "Order Status", "Delivery Status"],
      rows: [
        {
          "Order ID": "#ORD-10018",
          Customer: "Rahul Verma",
          Store: "Lakeside Mart",
          Items: "3",
          "Order Status": status("Processing", "info"),
          "Delivery Status": status("Out for Delivery", "info"),
        },
        {
          "Order ID": "#ORD-10011",
          Customer: "Pooja Iyer",
          Store: "Downtown Fresh",
          Items: "8",
          "Order Status": status("Confirmed", "info"),
          "Delivery Status": status("Picking", "neutral"),
        },
      ],
    },
  },
  ordersCompleted: {
    title: "Completed Orders",
    description: "Delivered and closed orders.",
    table: {
      columns: ["Order ID", "Customer", "Store", "Total", "Delivery Status", "Order Date"],
      rows: [
        {
          "Order ID": "#ORD-09992",
          Customer: "Sana Joseph",
          Store: "Whitefield Metro",
          Total: "$66.50",
          "Delivery Status": status("Delivered", "success"),
          "Order Date": "2026-08-26 13:08",
        },
        {
          "Order ID": "#ORD-09983",
          Customer: "Ali Khan",
          Store: "Downtown Fresh",
          Total: "$54.20",
          "Delivery Status": status("Delivered", "success"),
          "Order Date": "2026-08-26 11:44",
        },
      ],
    },
  },
  ordersCancelled: {
    title: "Cancelled Orders",
    description: "Orders cancelled before completion for customer or operational reasons.",
    table: {
      columns: ["Order ID", "Customer", "Store", "Total", "Payment Status", "Reason"],
      rows: [
        {
          "Order ID": "#ORD-09977",
          Customer: "Asha Kulkarni",
          Store: "Downtown Fresh",
          Total: "$23.90",
          "Payment Status": status("Refund Initiated", "danger"),
          Reason: "Customer requested cancellation",
        },
        {
          "Order ID": "#ORD-09961",
          Customer: "Imran Sheikh",
          Store: "Lakeside Mart",
          Total: "$19.75",
          "Payment Status": status("Refunded", "danger"),
          Reason: "Store out of stock",
        },
      ],
    },
  },
  ordersReturned: {
    title: "Returned Orders",
    description: "Orders returned after delivery with financial and inventory impact.",
    table: {
      columns: ["Order ID", "Customer", "Store", "Total", "Return Status", "Reason"],
      rows: [
        {
          "Order ID": "#ORD-10002",
          Customer: "Maya Kapoor",
          Store: "Downtown Fresh",
          Total: "$91.25",
          "Return Status": status("Approved", "danger"),
          Reason: "Damaged item",
        },
        {
          "Order ID": "#ORD-09952",
          Customer: "Tara Das",
          Store: "Whitefield Metro",
          Total: "$38.90",
          "Return Status": status("Inspection Pending", "info"),
          Reason: "Wrong item received",
        },
      ],
    },
  },
  ordersStoreWise: {
    title: "Store-wise Orders",
    description: "Order performance broken down by branch and fulfillment load.",
    metrics: [
      { label: "Highest Volume Store", value: "Downtown Fresh" },
      { label: "Top Fulfillment Rate", value: "Whitefield Metro", tone: "success" },
      { label: "At-Risk Store", value: "Express Pickup Hub", tone: "danger" },
    ],
    table: {
      columns: ["Store", "Orders", "Completed", "Cancelled", "Returned", "Revenue"],
      rows: [
        { Store: "Downtown Fresh", Orders: "418", Completed: "384", Cancelled: "11", Returned: "4", Revenue: "$42,180" },
        { Store: "Lakeside Mart", Orders: "276", Completed: "238", Cancelled: "16", Returned: "7", Revenue: "$26,470" },
        { Store: "Whitefield Metro", Orders: "312", Completed: "297", Cancelled: "5", Returned: "3", Revenue: "$34,210" },
      ],
    },
  },
  ordersAbandonedCarts: {
    title: "Abandoned Carts",
    description: "Recovery snapshot for carts that did not convert into orders.",
    metrics: [
      { label: "Open Carts", value: "86" },
      { label: "Recoverable", value: "41", tone: "success" },
      { label: "Potential Value", value: "$2,940" },
    ],
    panels: [
      {
        title: "Recovery triggers",
        items: [
          "Push reminder after 30 minutes.",
          "Apply coupon to carts above $50.",
          "Send SMS follow-up for mobile-first customers.",
        ],
      },
    ],
    table: {
      columns: ["Customer", "Store", "Items", "Cart Value", "Last Activity", "Suggested Action"],
      rows: [
        {
          Customer: "Rohan Bhat",
          Store: "Downtown Fresh",
          Items: "4",
          "Cart Value": "$32.20",
          "Last Activity": "2026-08-27 10:05",
          "Suggested Action": "Send reminder",
        },
        {
          Customer: "Neha Sood",
          Store: "Lakeside Mart",
          Items: "7",
          "Cart Value": "$64.80",
          "Last Activity": "2026-08-27 09:37",
          "Suggested Action": "Offer coupon",
        },
      ],
    },
  },
  customersAll: {
    title: "Customers",
    description: "Customer management with mobile-first identity, wallet, loyalty, and order history context.",
    actions: ["Add customer", "Export"],
    filters: ["Search", "Status", "Wallet Balance", "Loyalty Tier", "Created At"],
    metrics: [
      { label: "Customers", value: "5,842" },
      { label: "Active", value: "5,311", tone: "success" },
      { label: "Disabled", value: "108", tone: "danger" },
      { label: "New Today", value: "42", tone: "success" },
    ],
    table: {
      columns: [
        "Name",
        "Mobile",
        "Email",
        "Status",
        "Wallet Balance",
        "Loyalty Points",
        "Total Orders",
        "Total Spend",
        "Created At",
      ],
      rows: [
        {
          Name: "Anika Sharma",
          Mobile: "+91 99887 61001",
          Email: "anika@example.com",
          Status: status("Active", "success"),
          "Wallet Balance": "$42.50",
          "Loyalty Points": "380",
          "Total Orders": "24",
          "Total Spend": "$1,428",
          "Created At": "2025-09-18",
        },
        {
          Name: "Rahul Verma",
          Mobile: "+91 99887 61002",
          Email: "rahul@example.com",
          Status: status("Active", "success"),
          "Wallet Balance": "$15.20",
          "Loyalty Points": "120",
          "Total Orders": "11",
          "Total Spend": "$496",
          "Created At": "2026-02-02",
        },
        {
          Name: "Maya Kapoor",
          Mobile: "+91 99887 61003",
          Email: "maya@example.com",
          Status: status("Disabled", "danger"),
          "Wallet Balance": "$0.00",
          "Loyalty Points": "44",
          "Total Orders": "7",
          "Total Spend": "$231",
          "Created At": "2026-04-11",
        },
      ],
    },
  },
  customersWallet: {
    title: "Customer Wallet",
    description: "Wallet balance, credit/debit, and transaction history with negative-balance guardrails.",
    metrics: [
      { label: "Wallet Holders", value: "3,912" },
      { label: "Total Balance", value: "$18,204" },
      { label: "Credits Today", value: "$640", tone: "success" },
      { label: "Debits Today", value: "$388" },
    ],
    table: {
      columns: ["Customer", "Current Balance", "Credit", "Debit", "Reason", "Reference", "Created At"],
      rows: [
        {
          Customer: "Anika Sharma",
          "Current Balance": "$42.50",
          Credit: "$10.00",
          Debit: "$0.00",
          Reason: "Order compensation",
          Reference: "WAL-20018",
          "Created At": "2026-08-27 09:25",
        },
        {
          Customer: "Rahul Verma",
          "Current Balance": "$15.20",
          Credit: "$0.00",
          Debit: "$6.50",
          Reason: "Wallet checkout use",
          Reference: "WAL-20017",
          "Created At": "2026-08-27 08:44",
        },
      ],
    },
    note: "Static validation note: prevent debits that push current balance below zero.",
  },
  customersLoyalty: {
    title: "Loyalty Points",
    description: "Available, earned, redeemed, and expired points with configurable earning rules.",
    actions: ["Configure points rules"],
    table: {
      columns: ["Customer", "Available Points", "Earned", "Redeemed", "Expired", "History"],
      rows: [
        {
          Customer: "Anika Sharma",
          "Available Points": "380",
          Earned: "560",
          Redeemed: "150",
          Expired: "30",
          History: "View history",
        },
        {
          Customer: "Rahul Verma",
          "Available Points": "120",
          Earned: "180",
          Redeemed: "60",
          Expired: "0",
          History: "View history",
        },
      ],
    },
    panels: [
      {
        title: "Sample rules",
        items: [
          "1 point for every $1 spent.",
          "Double points on weekends for selected categories.",
          "200-point birthday bonus for active customers.",
        ],
      },
    ],
  },
  discountsProducts: {
    title: "Product Offers",
    description: "Discounts applied to selected products with min order value and max discount controls.",
    actions: ["Create product offer"],
    table: {
      columns: ["Name", "Discount Type", "Value", "Start Date", "End Date", "Status", "Maximum Discount"],
      rows: [
        {
          Name: "Weekend Coffee Blast",
          "Discount Type": "Percentage",
          Value: "15%",
          "Start Date": "2026-08-28",
          "End Date": "2026-08-31",
          Status: status("Scheduled", "info"),
          "Maximum Discount": "$12",
        },
        {
          Name: "Protein Combo",
          "Discount Type": "Fixed",
          Value: "$5",
          "Start Date": "2026-08-20",
          "End Date": "2026-08-30",
          Status: status("Active", "success"),
          "Maximum Discount": "$5",
        },
      ],
    },
  },
  discountsCategories: {
    title: "Category Offers",
    description: "Category-level promotional rules for broad catalogue campaigns.",
    actions: ["Create category offer"],
    table: {
      columns: ["Name", "Category", "Discount Type", "Value", "Status", "Minimum Order Value"],
      rows: [
        {
          Name: "Pantry Saver",
          Category: "Pantry",
          "Discount Type": "Percentage",
          Value: "10%",
          Status: status("Active", "success"),
          "Minimum Order Value": "$25",
        },
        {
          Name: "Fresh Produce Friday",
          Category: "Produce",
          "Discount Type": "Fixed",
          Value: "$4",
          Status: status("Scheduled", "info"),
          "Minimum Order Value": "$18",
        },
      ],
    },
  },
  discountsBrands: {
    title: "Brand Offers",
    description: "Brand-specific promotional rules with clear visibility windows.",
    actions: ["Create brand offer"],
    table: {
      columns: ["Name", "Brand", "Discount Type", "Value", "Start Date", "End Date", "Status"],
      rows: [
        {
          Name: "Bean & Barrel Launch",
          Brand: "Bean & Barrel",
          "Discount Type": "Percentage",
          Value: "12%",
          "Start Date": "2026-08-21",
          "End Date": "2026-09-05",
          Status: status("Active", "success"),
        },
        {
          Name: "FreshFoundry Intro",
          Brand: "FreshFoundry",
          "Discount Type": "Fixed",
          Value: "$3",
          "Start Date": "2026-09-01",
          "End Date": "2026-09-10",
          Status: status("Scheduled", "info"),
        },
      ],
    },
  },
  discountsCoupons: {
    title: "Coupons",
    description: "Coupon rules with limits, validity windows, and customer restrictions.",
    actions: ["Create coupon"],
    table: {
      columns: ["Coupon Code", "Type", "Value", "Usage Limit", "Per Customer Limit", "Minimum Order Value", "Status"],
      rows: [
        {
          "Coupon Code": "WELCOME10",
          Type: "Percentage",
          Value: "10%",
          "Usage Limit": "500",
          "Per Customer Limit": "1",
          "Minimum Order Value": "$20",
          Status: status("Active", "success"),
        },
        {
          "Coupon Code": "FREESHIP50",
          Type: "Fixed",
          Value: "$5",
          "Usage Limit": "200",
          "Per Customer Limit": "2",
          "Minimum Order Value": "$50",
          Status: status("Scheduled", "info"),
        },
      ],
    },
  },
  marketingNotifications: {
    title: "Notifications",
    description: "Audience targeting for customer pushes, store customer messaging, and segment sends.",
    actions: ["Send notification"],
    panels: [
      {
        title: "Target audience options",
        items: ["All Customers", "Selected Customers", "Store Customers", "Customer Segment"],
      },
      {
        title: "Sample notifications",
        items: [
          "Order status updates for in-progress orders.",
          "Weekend campaign reminders.",
          "Low wallet balance nudges for frequent buyers.",
        ],
      },
    ],
  },
  marketingCampaigns: {
    title: "Campaigns",
    description: "Multi-channel campaign scheduling, audience, and performance snapshots.",
    actions: ["Create campaign"],
    table: {
      columns: ["Campaign Name", "Channel", "Audience", "Schedule", "Status", "Performance"],
      rows: [
        {
          "Campaign Name": "Weekend Saver",
          Channel: "Push + SMS",
          Audience: "High-value customers",
          Schedule: "2026-08-28 10:00",
          Status: status("Scheduled", "info"),
          Performance: "CTR 6.2%",
        },
        {
          "Campaign Name": "Fresh Produce Drop",
          Channel: "Push",
          Audience: "All customers",
          Schedule: "2026-08-24 08:00",
          Status: status("Completed", "success"),
          Performance: "CTR 8.1%",
        },
      ],
    },
  },
  marketingSms: {
    title: "SMS Campaigns",
    description: "SMS messaging with delivery status tracking and retry visibility.",
    actions: ["Create SMS campaign"],
    table: {
      columns: ["Campaign", "Audience", "Sent", "Delivered", "Failed", "Status"],
      rows: [
        {
          Campaign: "Abandoned Cart Recovery",
          Audience: "Recoverable carts",
          Sent: "120",
          Delivered: "114",
          Failed: "6",
          Status: status("Running", "info"),
        },
        {
          Campaign: "Store Launch Alert",
          Audience: "Whitefield customers",
          Sent: "840",
          Delivered: "829",
          Failed: "11",
          Status: status("Completed", "success"),
        },
      ],
    },
  },
  marketingSocial: {
    title: "Social Media Settings",
    description: "Configurable social channels and integration placeholders for future automation.",
    table: {
      columns: ["Platform", "Handle", "Status", "Last Sync", "Actions"],
      rows: [
        { Platform: "Instagram", Handle: "@freshcart", Status: status("Connected", "success"), "Last Sync": "2026-08-27 07:30", Actions: "Edit / Disconnect" },
        { Platform: "Facebook", Handle: "FreshCart Official", Status: status("Connected", "success"), "Last Sync": "2026-08-27 07:15", Actions: "Edit / Disconnect" },
        { Platform: "X", Handle: "@freshcart_help", Status: status("Pending", "info"), "Last Sync": "Never", Actions: "Connect" },
      ],
    },
  },
  banners: {
    title: "Banner Management",
    description: "Platform-aware banners for desktop, Android, and iOS with scheduling fields.",
    actions: ["Add banner"],
    table: {
      columns: [
        "Title",
        "Platform",
        "Store",
        "Redirect URL",
        "Start Date",
        "End Date",
        "Status",
        "Priority",
      ],
      rows: [
        {
          Title: "Weekend Essentials",
          Platform: "Desktop",
          Store: "All Stores",
          "Redirect URL": "/offers/weekend",
          "Start Date": "2026-08-28 00:00",
          "End Date": "2026-08-31 23:59",
          Status: status("Scheduled", "info"),
          Priority: "1",
        },
        {
          Title: "App-only Coffee Deal",
          Platform: "Android / iOS",
          Store: "Downtown Fresh",
          "Redirect URL": "/products/cb-1001",
          "Start Date": "2026-08-27 09:00",
          "End Date": "2026-09-03 22:00",
          Status: status("Active", "success"),
          Priority: "2",
        },
      ],
    },
  },
  deliveryBoys: {
        title: "Delivery Boys",
    description: "Delivery staff performance, login/logout, active deliveries, and on-time tracking.",
    actions: ["Add delivery boy", "Open tracking view"],
    metrics: [
      { label: "Riders", value: "34" },
      { label: "Active Deliveries", value: "18" },
      { label: "On-time Rate", value: "94.2%", tone: "success" },
      { label: "Delayed Deliveries", value: "5", tone: "danger" },
    ],
    table: {
      columns: [
        "Name",
        "Phone",
        "Store",
        "Status",
        "Total Orders",
        "Completed Orders",
        "Delayed Orders",
        "Distance Travelled",
        "Average Delivery Time",
      ],
      rows: [
        {
          Name: "Kishore Patil",
          Phone: "+91 99111 22001",
          Store: "Downtown Fresh",
          Status: status("Active", "success"),
          "Total Orders": "142",
          "Completed Orders": "136",
          "Delayed Orders": "4",
          "Distance Travelled": "418 km",
          "Average Delivery Time": "24 mins",
        },
        {
          Name: "Sohan Malik",
          Phone: "+91 99111 22002",
          Store: "Lakeside Mart",
          Status: status("Logged Out", "neutral"),
          "Total Orders": "118",
          "Completed Orders": "110",
          "Delayed Orders": "6",
          "Distance Travelled": "356 km",
          "Average Delivery Time": "27 mins",
        },
      ],
    },
  },
  deliveryAreas: {
    title: "Delivery Areas",
    description: "Area coverage setup for stores, zones, and dispatch boundaries.",
    actions: ["Add area"],
    table: {
      columns: ["Area", "Store", "Pincode", "Status", "Coverage Note"],
      rows: [
        { Area: "Indiranagar Core", Store: "Downtown Fresh", Pincode: "560038", Status: status("Active", "success"), "Coverage Note": "Fast delivery zone" },
        { Area: "Whitefield East", Store: "Whitefield Metro", Pincode: "560066", Status: status("Active", "success"), "Coverage Note": "Standard delivery zone" },
        { Area: "Sarjapur Extension", Store: "Lakeside Mart", Pincode: "560102", Status: status("Blocked", "danger"), "Coverage Note": "Temporary staffing issue" },
      ],
    },
  },
  deliveryTimeSlots: {
    title: "Delivery Time Slots",
    description: "Store-level slot capacity, timing, and status management.",
    actions: ["Add time slot"],
    table: {
      columns: ["Slot Name", "Start Time", "End Time", "Max Orders", "Store", "Status"],
      rows: [
        {
          "Slot Name": "Morning Express",
          "Start Time": "08:00",
          "End Time": "10:00",
          "Max Orders": "40",
          Store: "Downtown Fresh",
          Status: status("Active", "success"),
        },
        {
          "Slot Name": "Evening Prime",
          "Start Time": "18:00",
          "End Time": "21:00",
          "Max Orders": "65",
          Store: "All Stores",
          Status: status("Active", "success"),
        },
      ],
    },
  },
  deliverySlotBlocking: {
    title: "Slot Blocking",
    description: "Date, slot, store, and area blocking for exceptional operational controls.",
    actions: ["Block slot"],
    table: {
      columns: ["Date", "Time Slot", "Store", "Delivery Area", "Reason", "Status"],
      rows: [
        {
          Date: "2026-08-29",
          "Time Slot": "Evening Prime",
          Store: "Lakeside Mart",
          "Delivery Area": "Sarjapur Extension",
          Reason: "City event road closures",
          Status: status("Blocked", "danger"),
        },
        {
          Date: "2026-08-30",
          "Time Slot": "Morning Express",
          Store: "Downtown Fresh",
          "Delivery Area": "Indiranagar Core",
          Reason: "Warehouse maintenance",
          Status: status("Blocked", "danger"),
        },
      ],
    },
  },
  deliveryShipping: {
    title: "Shipping Configuration",
    description: "Shipping partners, rules, and charge settings for order fulfillment.",
    actions: ["Add shipping rule"],
    table: {
      columns: ["Rule", "Partner", "Condition", "Charge", "Status"],
      rows: [
        { Rule: "Standard under $20", Partner: "In-house", Condition: "Order < $20", Charge: "$3.99", Status: status("Active", "success") },
        { Rule: "Free shipping threshold", Partner: "In-house", Condition: "Order >= $50", Charge: "$0.00", Status: status("Active", "success") },
        { Rule: "Long-distance zone", Partner: "QuickShip", Condition: "Outer delivery area", Charge: "$5.50", Status: status("Active", "success") },
      ],
    },
  },
  reportsSales: {
    title: "Sales Report",
    description: "Sales KPIs, charts, filters, and export-ready static reporting blocks.",
    actions: ["Export CSV", "Export Excel", "Export PDF"],
    filters: ["Start Date", "End Date", "Store", "Category", "Brand", "Status"],
    metrics: [
      { label: "Gross Sales", value: "$184,220" },
      { label: "Net Revenue", value: "$149,880", tone: "success" },
      { label: "Average Order Value", value: "$38.42" },
    ],
    charts: [
      { label: "Revenue trend", value: 72, change: "+9.3%" },
      { label: "Order trend", value: 66, change: "+6.4%" },
      { label: "Refund impact", value: 18, change: "-1.8%" },
    ],
    table: {
      columns: ["Store", "Orders", "Gross Sales", "Discounts", "Net Revenue"],
      rows: [
        { Store: "Downtown Fresh", Orders: "418", "Gross Sales": "$52,100", Discounts: "$4,860", "Net Revenue": "$41,240" },
        { Store: "Lakeside Mart", Orders: "276", "Gross Sales": "$33,700", Discounts: "$3,420", "Net Revenue": "$27,640" },
      ],
    },
  },
  reportsProducts: {
    title: "Product-wise Report",
    description: "Product performance across sales, stock movement, and return trends.",
    actions: ["Export CSV", "Export Excel", "Export PDF"],
    table: {
      columns: ["Product", "SKU", "Orders", "Revenue", "Returns", "Current Stock"],
      rows: [
        { Product: "Cold Brew Coffee 1L", SKU: "CB-1001", Orders: "188", Revenue: "$1,408", Returns: "3", "Current Stock": "42" },
        { Product: "Organic Almond Butter", SKU: "AB-2208", Orders: "121", Revenue: "$1,210", Returns: "1", "Current Stock": "9" },
      ],
    },
  },
  reportsUsers: {
    title: "Staff/User-wise Sales Report",
    description: "Sales attribution and order processing performance by internal user.",
    actions: ["Export CSV", "Export Excel", "Export PDF"],
    table: {
      columns: ["User", "Role", "Store", "Orders Managed", "Sales Value", "Completion Rate"],
      rows: [
        { User: "Ritika Shah", Role: "Store Supervisor", Store: "Downtown Fresh", "Orders Managed": "92", "Sales Value": "$8,940", "Completion Rate": "97%" },
        { User: "Manav Suri", Role: "Cashier", Store: "Lakeside Mart", "Orders Managed": "61", "Sales Value": "$4,180", "Completion Rate": "95%" },
      ],
    },
  },
  reportsCategories: {
    title: "Category-wise Report",
    description: "Revenue and order contribution by category.",
    actions: ["Export CSV", "Export Excel", "Export PDF"],
    table: {
      columns: ["Category", "Orders", "Revenue", "Discount Impact", "Top Store"],
      rows: [
        { Category: "Beverages", Orders: "640", Revenue: "$28,140", "Discount Impact": "$2,340", "Top Store": "Downtown Fresh" },
        { Category: "Pantry", Orders: "512", Revenue: "$24,400", "Discount Impact": "$1,920", "Top Store": "Whitefield Metro" },
      ],
    },
  },
  reportsBrands: {
    title: "Brand-wise Report",
    description: "Brand contribution across catalogue performance.",
    actions: ["Export CSV", "Export Excel", "Export PDF"],
    table: {
      columns: ["Brand", "Orders", "Revenue", "Returns", "Stock Value"],
      rows: [
        { Brand: "Bean & Barrel", Orders: "288", Revenue: "$12,660", Returns: "4", "Stock Value": "$4,220" },
        { Brand: "Nutri Roots", Orders: "216", Revenue: "$9,410", Returns: "2", "Stock Value": "$3,740" },
      ],
    },
  },
  reportsDelivery: {
    title: "Delivery Report",
    description: "Delivery performance, delays, and rider efficiency.",
    actions: ["Export CSV", "Export Excel", "Export PDF"],
    table: {
      columns: ["Rider", "Orders", "On-time", "Delayed", "Avg Time", "Distance"],
      rows: [
        { Rider: "Kishore Patil", Orders: "142", "On-time": "136", Delayed: "4", "Avg Time": "24 mins", Distance: "418 km" },
        { Rider: "Sohan Malik", Orders: "118", "On-time": "110", Delayed: "6", "Avg Time": "27 mins", Distance: "356 km" },
      ],
    },
  },
  integrations: {
    title: "Partner Integrations",
    description: "Generic future-ready configuration blocks for ERP, billing, payments, SMS, shipping, and external systems.",
    actions: ["Add integration"],
    table: {
      columns: ["Integration", "Category", "Auth Type", "Status", "Last Updated", "Actions"],
      rows: [
        { Integration: "Acme ERP", Category: "ERP", "Auth Type": "API Key", Status: status("Connected", "success"), "Last Updated": "2026-08-24", Actions: "Configure / Disable" },
        { Integration: "PayFlow", Category: "Payment System", "Auth Type": "OAuth", Status: status("Connected", "success"), "Last Updated": "2026-08-20", Actions: "Configure / Disable" },
        { Integration: "TextBridge", Category: "SMS", "Auth Type": "Username + Token", Status: status("Draft", "info"), "Last Updated": "2026-08-12", Actions: "Configure / Enable" },
      ],
    },
    panels: [
      {
        title: "Suggested generic fields",
        items: [
          "Provider name and category",
          "Endpoint / callback URLs",
          "Authentication fields and secret placeholders",
          "Status, last sync, and environment selection",
        ],
      },
    ],
  },
  cmsAboutUs: {
    title: "CMS: About Us",
    description: "Simple content editor placeholder with SEO and status metadata.",
    highlights: [
      { label: "Title", value: "About FreshCart" },
      { label: "SEO Title", value: "About FreshCart | Fresh Groceries Delivered" },
      { label: "Status", value: "Published" },
      { label: "Updated At", value: "2026-08-24 14:20" },
    ],
    panels: [
      {
        title: "Content",
        items: [
          "FreshCart helps local stores fulfill grocery orders faster.",
          "The admin CMS can manage content blocks, brand messaging, and store information.",
        ],
      },
    ],
  },
  cmsOffers: {
    title: "CMS: Offers",
    description: "Static CMS placeholder for promotional content and SEO fields.",
    highlights: [
      { label: "Title", value: "Current Offers" },
      { label: "SEO Description", value: "Browse weekly savings and app-only deals." },
      { label: "Status", value: "Published" },
    ],
  },
  cmsContactUs: {
    title: "CMS: Contact Us",
    description: "Static CMS page for customer contact information and support messaging.",
    highlights: [
      { label: "Title", value: "Contact Us" },
      { label: "SEO Title", value: "Contact FreshCart Support" },
      { label: "Status", value: "Published" },
    ],
  },
  cmsStores: {
    title: "CMS: Stores",
    description: "Static CMS page for store finder content and branch notes.",
    highlights: [
      { label: "Title", value: "Our Stores" },
      { label: "SEO Description", value: "Discover the nearest FreshCart-enabled branch." },
      { label: "Status", value: "Published" },
    ],
  },
  cmsPrivacyPolicy: {
    title: "CMS: Privacy Policy",
    description: "Static legal content placeholder with update metadata.",
    highlights: [
      { label: "Title", value: "Privacy Policy" },
      { label: "SEO Title", value: "FreshCart Privacy Policy" },
      { label: "Status", value: "Published" },
    ],
  },
  cmsTerms: {
    title: "CMS: Terms",
    description: "Static terms and conditions page scaffold.",
    highlights: [
      { label: "Title", value: "Terms & Conditions" },
      { label: "SEO Description", value: "Terms for using FreshCart services and offers." },
      { label: "Status", value: "Published" },
    ],
  },
  cmsRefundReturn: {
    title: "CMS: Refund & Return",
    description: "Static refund and return policy page scaffold.",
    highlights: [
      { label: "Title", value: "Refund & Return Policy" },
      { label: "SEO Title", value: "Refund and Return | FreshCart" },
      { label: "Status", value: "Published" },
    ],
  },
};

export function getAdminPageConfig(key: string) {
  return pageConfigs[key];
}

export function getOrderDetailConfig(orderId: string): PageConfig {
  return {
    title: `Order ${orderId.toUpperCase()}`,
    description: "Order detail snapshot with status timeline, items, and summary.",
    actions: ["Update status", "Print invoice"],
    highlights: [
      { label: "Order ID", value: orderId.toUpperCase() },
      { label: "Customer", value: "Anika Sharma" },
      { label: "Phone", value: "+91 99887 61001" },
      { label: "Email", value: "anika@example.com" },
      { label: "Store", value: "Downtown Fresh" },
      { label: "Order Date", value: "2026-08-27 09:14" },
      { label: "Payment Status", value: "Paid" },
      { label: "Order Status", value: "Processing" },
      { label: "Delivery Status", value: "Out for Delivery" },
      { label: "Total Amount", value: "$78.60" },
    ],
    timeline: [
      { label: "Pending", tone: "success" },
      { label: "Confirmed", tone: "success" },
      { label: "Processing", tone: "info" },
      { label: "Completed" },
      { label: "Cancelled" },
      { label: "Returned" },
    ],
    table: {
      columns: ["Product", "SKU", "Price", "Quantity", "Discount", "Total"],
      rows: [
        {
          Product: "Cold Brew Coffee 1L",
          SKU: "CB-1001",
          Price: "$8.99",
          Quantity: "2",
          Discount: "$3.00",
          Total: "$14.98",
        },
        {
          Product: "Fresh Basil Pack",
          SKU: "FV-0310",
          Price: "$2.40",
          Quantity: "3",
          Discount: "$0.30",
          Total: "$6.90",
        },
        {
          Product: "Organic Almond Butter",
          SKU: "AB-2208",
          Price: "$11.25",
          Quantity: "1",
          Discount: "$1.26",
          Total: "$9.99",
        },
      ],
    },
    panels: [
      {
        title: "Order summary",
        items: [
          "Subtotal: $70.10",
          "Discount: $4.56",
          "Shipping: $3.99",
          "Tax: $5.07",
          "Wallet Used: $0.00",
          "Grand Total: $78.60",
        ],
      },
      {
        title: "Allowed status actions",
        items: [
          "Move from Pending to Confirmed.",
          "Move from Confirmed to Processing.",
          "Mark as Completed after delivery success.",
          "Cancel or Return based on fulfillment stage.",
        ],
      },
    ],
  };
}

export function getCustomerDetailConfig(customerId: string): PageConfig {
  return {
    title: `Customer ${customerId.toUpperCase()}`,
    description: "Customer profile snapshot with wallet, loyalty, and order history context.",
    actions: ["Edit customer", "Reset password", "Disable customer"],
    highlights: [
      { label: "Name", value: "Anika Sharma" },
      { label: "Mobile", value: "+91 99887 61001" },
      { label: "Email", value: "anika@example.com" },
      { label: "Status", value: "Active" },
      { label: "Wallet Balance", value: "$42.50" },
      { label: "Loyalty Points", value: "380" },
      { label: "Total Orders", value: "24" },
      { label: "Total Spend", value: "$1,428" },
      { label: "Created At", value: "2025-09-18" },
    ],
    table: {
      columns: ["Order ID", "Order Date", "Store", "Amount", "Payment Status", "Order Status"],
      rows: [
        {
          "Order ID": "#ORD-10021",
          "Order Date": "2026-08-27 09:14",
          Store: "Downtown Fresh",
          Amount: "$78.60",
          "Payment Status": status("Paid", "success"),
          "Order Status": status("Processing", "info"),
        },
        {
          "Order ID": "#ORD-09992",
          "Order Date": "2026-08-26 13:08",
          Store: "Whitefield Metro",
          Amount: "$66.50",
          "Payment Status": status("Paid", "success"),
          "Order Status": status("Completed", "success"),
        },
      ],
    },
    panels: [
      {
        title: "Wallet history",
        items: [
          "2026-08-27: +$10 order compensation",
          "2026-08-18: -$5.50 wallet checkout use",
          "2026-08-02: +$15 referral reward",
        ],
      },
      {
        title: "Loyalty history",
        items: [
          "Earned 48 points from last 3 orders",
          "Redeemed 120 points on 2026-08-10",
          "No expired points in the current cycle",
        ],
      },
    ],
  };
}
