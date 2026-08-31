export type FormFieldType =
  | "text"
  | "number"
  | "tel"
  | "email"
  | "date"
  | "time"
  | "textarea"
  | "select";

export type FormFieldOption = {
  label: string;
  value: string;
};

export type FormFieldConfig = {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  value?: string;
  options?: FormFieldOption[];
  helperText?: string;
};

export type FormSectionConfig = {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
};

export type StaticFormConfig = {
  title: string;
  description: string;
  submitLabel: string;
  note?: string;
  sections: FormSectionConfig[];
};

type FormMode = "create" | "edit";

function buildConfig(
  entity: string,
  mode: FormMode,
  sections: FormSectionConfig[],
  note?: string
): StaticFormConfig {
  const actionLabel = mode === "create" ? "Create" : "Update";

  return {
    title: `${actionLabel} ${entity}`,
    description: `Static ${mode} screen for ${entity.toLowerCase()} management.`,
    submitLabel: actionLabel,
    note,
    sections,
  };
}

function value(mode: FormMode, createValue: string, editValue: string) {
  return mode === "create" ? createValue : editValue;
}

function commonStatus(mode: FormMode): FormFieldConfig {
  return {
    id: "status",
    label: "Status",
    type: "select",
    value: value(mode, "enabled", "enabled"),
    options: [
      { label: "Enabled", value: "enabled" },
      { label: "Disabled", value: "disabled" },
      { label: "Draft", value: "draft" },
      { label: "Scheduled", value: "scheduled" },
      { label: "Active", value: "active" },
      { label: "Blocked", value: "blocked" },
    ],
  };
}

function storeForm(mode: FormMode) {
  return buildConfig(
    "Store",
    mode,
    [
      {
        title: "Store Information",
        fields: [
          {
            id: "name",
            label: "Store Name",
            type: "text",
            placeholder: "Enter store name",
            value: value(mode, "", "Downtown Fresh"),
          },
          {
            id: "code",
            label: "Code",
            type: "text",
            placeholder: "STR-001",
            value: value(mode, "", "STR-001"),
          },
          {
            id: "location",
            label: "Location",
            type: "text",
            placeholder: "Store location",
            value: value(mode, "", "Bangalore Central"),
          },
          {
            id: "manager",
            label: "Manager",
            type: "text",
            placeholder: "Manager name",
            value: value(mode, "", "Aarav Menon"),
          },
          {
            id: "phone",
            label: "Phone",
            type: "tel",
            placeholder: "+91 98765 12001",
            value: value(mode, "", "+91 98765 12001"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function staffForm(mode: FormMode) {
  return buildConfig(
    "Staff",
    mode,
    [
      {
        title: "Profile",
        fields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Staff name",
            value: value(mode, "", "Ritika Shah"),
          },
          {
            id: "designation",
            label: "Designation",
            type: "text",
            placeholder: "Store Supervisor",
            value: value(mode, "", "Store Supervisor"),
          },
          {
            id: "salary",
            label: "Salary",
            type: "number",
            placeholder: "0",
            value: value(mode, "", "1250"),
          },
          {
            id: "store",
            label: "Store Assignment",
            type: "select",
            value: value(mode, "Downtown Fresh", "Downtown Fresh"),
            options: [
              { label: "Downtown Fresh", value: "Downtown Fresh" },
              { label: "Lakeside Mart", value: "Lakeside Mart" },
              { label: "Whitefield Metro", value: "Whitefield Metro" },
            ],
          },
          {
            id: "timeIn",
            label: "Time In",
            type: "time",
            value: value(mode, "09:00", "08:55"),
          },
          {
            id: "timeOut",
            label: "Time Out",
            type: "time",
            value: value(mode, "18:00", "18:10"),
          },
          {
            id: "attendanceTolerance",
            label: "Attendance Tolerance",
            type: "number",
            placeholder: "Minutes",
            value: value(mode, "10", "15"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function roleForm(mode: FormMode) {
  return buildConfig(
    "Role",
    mode,
    [
      {
        title: "Role Setup",
        fields: [
          {
            id: "roleName",
            label: "Role Name",
            type: "text",
            placeholder: "Operations Manager",
            value: value(mode, "", "Store Manager"),
          },
          {
            id: "dashboard",
            label: "Dashboard Permissions",
            type: "text",
            placeholder: "View, Manage",
            value: value(mode, "View", "View"),
          },
          {
            id: "orders",
            label: "Order Permissions",
            type: "text",
            placeholder: "View, Create, Update",
            value: value(mode, "View, Update", "View, Update, Manage"),
          },
          {
            id: "catalogue",
            label: "Catalogue Permissions",
            type: "text",
            placeholder: "View, Create, Update",
            value: value(mode, "View", "View, Update"),
          },
          {
            id: "reports",
            label: "Report Permissions",
            type: "text",
            placeholder: "View, Export",
            value: value(mode, "View", "View"),
          },
        ],
      },
    ],
    "Use permissions like View, Create, Update, Delete, Export, and Manage."
  );
}

function productForm(mode: FormMode) {
  return buildConfig(
    "Product",
    mode,
    [
      {
        title: "Basic Details",
        fields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Product name",
            value: value(mode, "", "Cold Brew Coffee 1L"),
          },
          {
            id: "sku",
            label: "SKU",
            type: "text",
            placeholder: "CB-1001",
            value: value(mode, "", "CB-1001"),
          },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Product description",
            value: value(
              mode,
              "",
              "Smooth ready-to-drink cold brew with a balanced roast profile."
            ),
          },
          {
            id: "category",
            label: "Category",
            type: "select",
            value: value(mode, "Beverages", "Beverages"),
            options: [
              { label: "Beverages", value: "Beverages" },
              { label: "Pantry", value: "Pantry" },
              { label: "Produce", value: "Produce" },
            ],
          },
          {
            id: "subcategory",
            label: "Subcategory",
            type: "text",
            placeholder: "Coffee",
            value: value(mode, "", "Coffee"),
          },
          {
            id: "brand",
            label: "Brand",
            type: "select",
            value: value(mode, "Bean & Barrel", "Bean & Barrel"),
            options: [
              { label: "Bean & Barrel", value: "Bean & Barrel" },
              { label: "Nutri Roots", value: "Nutri Roots" },
              { label: "FreshFoundry", value: "FreshFoundry" },
            ],
          },
          {
            id: "tags",
            label: "Tags",
            type: "text",
            placeholder: "Best Seller, New Arrival",
            value: value(mode, "", "Best Seller, Weekend Deal"),
          },
        ],
      },
      {
        title: "Pricing & Inventory",
        fields: [
          {
            id: "price",
            label: "Price",
            type: "number",
            placeholder: "0.00",
            value: value(mode, "", "8.99"),
          },
          {
            id: "discountPrice",
            label: "Discount Price",
            type: "number",
            placeholder: "0.00",
            value: value(mode, "", "7.49"),
          },
          {
            id: "stock",
            label: "Stock",
            type: "number",
            placeholder: "0",
            value: value(mode, "", "42"),
          },
          {
            id: "lowStockThreshold",
            label: "Low Stock Threshold",
            type: "number",
            placeholder: "0",
            value: value(mode, "", "10"),
          },
          {
            id: "store",
            label: "Store",
            type: "select",
            value: value(mode, "Downtown Fresh", "Downtown Fresh"),
            options: [
              { label: "Downtown Fresh", value: "Downtown Fresh" },
              { label: "Lakeside Mart", value: "Lakeside Mart" },
              { label: "All Stores", value: "All Stores" },
            ],
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function categoryForm(mode: FormMode) {
  return buildConfig(
    "Category",
    mode,
    [
      {
        title: "Category Details",
        fields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Category name",
            value: value(mode, "", "Beverages"),
          },
          {
            id: "parentCategory",
            label: "Parent Category",
            type: "select",
            value: value(mode, "Root", "Root"),
            options: [
              { label: "Root", value: "Root" },
              { label: "Beverages", value: "Beverages" },
              { label: "Pantry", value: "Pantry" },
            ],
          },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Category description",
            value: value(mode, "", "Cold drinks, juices, tea, and coffee."),
          },
          {
            id: "image",
            label: "Image",
            type: "text",
            placeholder: "category.jpg",
            value: value(mode, "", "beverages.jpg"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function brandForm(mode: FormMode) {
  return buildConfig(
    "Brand",
    mode,
    [
      {
        title: "Brand Details",
        fields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Brand name",
            value: value(mode, "", "Bean & Barrel"),
          },
          {
            id: "logo",
            label: "Logo",
            type: "text",
            placeholder: "logo.svg",
            value: value(mode, "", "bean-barrel.svg"),
          },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Brand description",
            value: value(mode, "", "Premium coffee and cafe essentials."),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function tagForm(mode: FormMode) {
  return buildConfig(
    "Tag",
    mode,
    [
      {
        title: "Tag Details",
        fields: [
          {
            id: "tag",
            label: "Tag",
            type: "text",
            placeholder: "Tag name",
            value: value(mode, "", "Best Seller"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function customerForm(mode: FormMode) {
  return buildConfig(
    "Customer",
    mode,
    [
      {
        title: "Customer Profile",
        fields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Customer name",
            value: value(mode, "", "Anika Sharma"),
          },
          {
            id: "mobile",
            label: "Mobile",
            type: "tel",
            placeholder: "+91 99887 61001",
            value: value(mode, "", "+91 99887 61001"),
          },
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "customer@example.com",
            value: value(mode, "", "anika@example.com"),
          },
          {
            id: "walletBalance",
            label: "Wallet Balance",
            type: "number",
            placeholder: "0.00",
            value: value(mode, "0.00", "42.50"),
          },
          {
            id: "loyaltyPoints",
            label: "Loyalty Points",
            type: "number",
            placeholder: "0",
            value: value(mode, "0", "380"),
          },
          commonStatus(mode),
        ],
      },
    ],
    "Customer login identity is primarily mobile number."
  );
}

function orderForm(mode: FormMode) {
  return buildConfig(
    "Manual Order",
    mode,
    [
      {
        title: "Order Details",
        fields: [
          {
            id: "customer",
            label: "Customer",
            type: "text",
            placeholder: "Customer name or mobile number",
            value: value(mode, "", "Anika Sharma"),
          },
          {
            id: "store",
            label: "Store",
            type: "text",
            placeholder: "Downtown Fresh",
            value: value(mode, "", "Downtown Fresh"),
          },
          {
            id: "items",
            label: "Items",
            type: "textarea",
            placeholder: "Product x Qty",
            value: value(mode, "", "Cold Brew Coffee 1L x 2\nFresh Basil Pack x 3"),
          },
          {
            id: "paymentStatus",
            label: "Payment Status",
            type: "select",
            value: value(mode, "paid", "paid"),
            options: [
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
              { label: "Refunded", value: "refunded" },
            ],
          },
          {
            id: "orderStatus",
            label: "Order Status",
            type: "select",
            value: value(mode, "pending", "processing"),
            options: [
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Processing", value: "processing" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Returned", value: "returned" },
            ],
          },
          {
            id: "deliveryStatus",
            label: "Delivery Status",
            type: "text",
            placeholder: "Awaiting Pickup",
            value: value(mode, "", "Out for Delivery"),
          },
        ],
      },
    ]
  );
}

function offerForm(mode: FormMode, entity: string, targetLabel: string, targetValue: string) {
  return buildConfig(
    entity,
    mode,
    [
      {
        title: `${entity} Details`,
        fields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Offer name",
            value: value(mode, "", "Weekend Saver"),
          },
          {
            id: "target",
            label: targetLabel,
            type: "text",
            placeholder: targetLabel,
            value: value(mode, "", targetValue),
          },
          {
            id: "discountType",
            label: "Discount Type",
            type: "select",
            value: value(mode, "percentage", "percentage"),
            options: [
              { label: "Percentage", value: "percentage" },
              { label: "Fixed", value: "fixed" },
            ],
          },
          {
            id: "value",
            label: "Percentage / Fixed",
            type: "text",
            placeholder: "15% or 5.00",
            value: value(mode, "", "15%"),
          },
          {
            id: "minimumOrderValue",
            label: "Minimum Order Value",
            type: "number",
            placeholder: "0.00",
            value: value(mode, "", "25"),
          },
          {
            id: "maximumDiscount",
            label: "Maximum Discount",
            type: "number",
            placeholder: "0.00",
            value: value(mode, "", "12"),
          },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: value(mode, "2026-08-28", "2026-08-28"),
          },
          {
            id: "endDate",
            label: "End Date",
            type: "date",
            value: value(mode, "2026-08-31", "2026-08-31"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function couponForm(mode: FormMode) {
  return buildConfig(
    "Coupon",
    mode,
    [
      {
        title: "Coupon Details",
        fields: [
          {
            id: "couponCode",
            label: "Coupon Code",
            type: "text",
            placeholder: "WELCOME10",
            value: value(mode, "", "WELCOME10"),
          },
          {
            id: "type",
            label: "Type",
            type: "select",
            value: value(mode, "percentage", "percentage"),
            options: [
              { label: "Percentage", value: "percentage" },
              { label: "Fixed", value: "fixed" },
            ],
          },
          {
            id: "value",
            label: "Value",
            type: "text",
            placeholder: "10% or 5.00",
            value: value(mode, "", "10%"),
          },
          {
            id: "usageLimit",
            label: "Usage Limit",
            type: "number",
            placeholder: "0",
            value: value(mode, "", "500"),
          },
          {
            id: "perCustomerLimit",
            label: "Per Customer Limit",
            type: "number",
            placeholder: "0",
            value: value(mode, "", "1"),
          },
          {
            id: "minimumOrderValue",
            label: "Minimum Order Value",
            type: "number",
            placeholder: "0.00",
            value: value(mode, "", "20"),
          },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: value(mode, "2026-08-28", "2026-08-28"),
          },
          {
            id: "endDate",
            label: "End Date",
            type: "date",
            value: value(mode, "2026-09-30", "2026-09-30"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function campaignForm(mode: FormMode) {
  return buildConfig(
    "Campaign",
    mode,
    [
      {
        title: "Campaign Details",
        fields: [
          {
            id: "campaignName",
            label: "Campaign Name",
            type: "text",
            placeholder: "Weekend Saver",
            value: value(mode, "", "Weekend Saver"),
          },
          {
            id: "channel",
            label: "Channel",
            type: "text",
            placeholder: "Push + SMS",
            value: value(mode, "", "Push + SMS"),
          },
          {
            id: "audience",
            label: "Audience",
            type: "text",
            placeholder: "High-value customers",
            value: value(mode, "", "High-value customers"),
          },
          {
            id: "schedule",
            label: "Schedule",
            type: "text",
            placeholder: "2026-08-28 10:00",
            value: value(mode, "", "2026-08-28 10:00"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function bannerForm(mode: FormMode) {
  return buildConfig(
    "Banner",
    mode,
    [
      {
        title: "Banner Details",
        fields: [
          {
            id: "title",
            label: "Title",
            type: "text",
            placeholder: "Weekend Essentials",
            value: value(mode, "", "Weekend Essentials"),
          },
          {
            id: "image",
            label: "Image",
            type: "text",
            placeholder: "banner.jpg",
            value: value(mode, "", "weekend-essentials.jpg"),
          },
          {
            id: "platform",
            label: "Platform",
            type: "select",
            value: value(mode, "desktop", "desktop"),
            options: [
              { label: "Desktop", value: "desktop" },
              { label: "Android", value: "android" },
              { label: "iOS", value: "ios" },
            ],
          },
          {
            id: "store",
            label: "Store",
            type: "text",
            placeholder: "All Stores",
            value: value(mode, "", "All Stores"),
          },
          {
            id: "redirectUrl",
            label: "Redirect URL",
            type: "text",
            placeholder: "/offers/weekend",
            value: value(mode, "", "/offers/weekend"),
          },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: value(mode, "2026-08-28", "2026-08-28"),
          },
          {
            id: "startTime",
            label: "Start Time",
            type: "time",
            value: value(mode, "00:00", "00:00"),
          },
          {
            id: "endDate",
            label: "End Date",
            type: "date",
            value: value(mode, "2026-08-31", "2026-08-31"),
          },
          {
            id: "endTime",
            label: "End Time",
            type: "time",
            value: value(mode, "23:59", "23:59"),
          },
          {
            id: "priority",
            label: "Priority",
            type: "number",
            placeholder: "1",
            value: value(mode, "1", "1"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function deliveryBoyForm(mode: FormMode) {
  return buildConfig(
    "Delivery Boy",
    mode,
    [
      {
        title: "Rider Profile",
        fields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Rider name",
            value: value(mode, "", "Kishore Patil"),
          },
          {
            id: "phone",
            label: "Phone",
            type: "tel",
            placeholder: "+91 99111 22001",
            value: value(mode, "", "+91 99111 22001"),
          },
          {
            id: "store",
            label: "Store",
            type: "text",
            placeholder: "Assigned store",
            value: value(mode, "", "Downtown Fresh"),
          },
          {
            id: "loginTime",
            label: "Login Time",
            type: "time",
            value: value(mode, "08:00", "08:10"),
          },
          {
            id: "logoutTime",
            label: "Logout Time",
            type: "time",
            value: value(mode, "18:00", "18:20"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function deliveryAreaForm(mode: FormMode) {
  return buildConfig(
    "Delivery Area",
    mode,
    [
      {
        title: "Area Details",
        fields: [
          {
            id: "area",
            label: "Area",
            type: "text",
            placeholder: "Indiranagar Core",
            value: value(mode, "", "Indiranagar Core"),
          },
          {
            id: "store",
            label: "Store",
            type: "text",
            placeholder: "Downtown Fresh",
            value: value(mode, "", "Downtown Fresh"),
          },
          {
            id: "pincode",
            label: "Pincode",
            type: "text",
            placeholder: "560038",
            value: value(mode, "", "560038"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function deliveryTimeSlotForm(mode: FormMode) {
  return buildConfig(
    "Time Slot",
    mode,
    [
      {
        title: "Slot Details",
        fields: [
          {
            id: "slotName",
            label: "Slot Name",
            type: "text",
            placeholder: "Morning Express",
            value: value(mode, "", "Morning Express"),
          },
          {
            id: "startTime",
            label: "Start Time",
            type: "time",
            value: value(mode, "08:00", "08:00"),
          },
          {
            id: "endTime",
            label: "End Time",
            type: "time",
            value: value(mode, "10:00", "10:00"),
          },
          {
            id: "maxOrders",
            label: "Max Orders",
            type: "number",
            placeholder: "0",
            value: value(mode, "", "40"),
          },
          {
            id: "store",
            label: "Store",
            type: "text",
            placeholder: "Downtown Fresh",
            value: value(mode, "", "Downtown Fresh"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function slotBlockingForm(mode: FormMode) {
  return buildConfig(
    "Slot Blocking",
    mode,
    [
      {
        title: "Blocking Details",
        fields: [
          {
            id: "date",
            label: "Date",
            type: "date",
            value: value(mode, "2026-08-29", "2026-08-29"),
          },
          {
            id: "timeSlot",
            label: "Time Slot",
            type: "text",
            placeholder: "Evening Prime",
            value: value(mode, "", "Evening Prime"),
          },
          {
            id: "store",
            label: "Store",
            type: "text",
            placeholder: "Lakeside Mart",
            value: value(mode, "", "Lakeside Mart"),
          },
          {
            id: "deliveryArea",
            label: "Delivery Area",
            type: "text",
            placeholder: "Sarjapur Extension",
            value: value(mode, "", "Sarjapur Extension"),
          },
          {
            id: "reason",
            label: "Reason",
            type: "textarea",
            placeholder: "Reason for block",
            value: value(mode, "", "City event road closures"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function shippingForm(mode: FormMode) {
  return buildConfig(
    "Shipping Rule",
    mode,
    [
      {
        title: "Shipping Details",
        fields: [
          {
            id: "rule",
            label: "Rule",
            type: "text",
            placeholder: "Free shipping threshold",
            value: value(mode, "", "Free shipping threshold"),
          },
          {
            id: "partner",
            label: "Partner",
            type: "text",
            placeholder: "In-house",
            value: value(mode, "", "In-house"),
          },
          {
            id: "condition",
            label: "Condition",
            type: "text",
            placeholder: "Order >= $50",
            value: value(mode, "", "Order >= $50"),
          },
          {
            id: "charge",
            label: "Charge",
            type: "number",
            placeholder: "0.00",
            value: value(mode, "", "0.00"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function integrationForm(mode: FormMode) {
  return buildConfig(
    "Integration",
    mode,
    [
      {
        title: "Integration Setup",
        fields: [
          {
            id: "provider",
            label: "Provider Name",
            type: "text",
            placeholder: "Acme ERP",
            value: value(mode, "", "Acme ERP"),
          },
          {
            id: "category",
            label: "Category",
            type: "select",
            value: value(mode, "erp", "erp"),
            options: [
              { label: "Billing software", value: "billing" },
              { label: "ERP", value: "erp" },
              { label: "Payment system", value: "payment" },
              { label: "SMS", value: "sms" },
              { label: "Shipping partner", value: "shipping" },
              { label: "Other external system", value: "other" },
            ],
          },
          {
            id: "authType",
            label: "Auth Type",
            type: "text",
            placeholder: "API Key / OAuth / Token",
            value: value(mode, "", "API Key"),
          },
          {
            id: "endpoint",
            label: "Endpoint URL",
            type: "text",
            placeholder: "https://api.example.com",
            value: value(mode, "", "https://api.acmeerp.test"),
          },
          {
            id: "callbackUrl",
            label: "Callback URL",
            type: "text",
            placeholder: "https://app.example.com/callback",
            value: value(mode, "", "https://admin.freshcart.test/callback"),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

function cmsForm(mode: FormMode, titleValue: string) {
  return buildConfig(
    "CMS Page",
    mode,
    [
      {
        title: "Content",
        fields: [
          {
            id: "title",
            label: "Title",
            type: "text",
            placeholder: "Page title",
            value: value(mode, "", titleValue),
          },
          {
            id: "content",
            label: "Content",
            type: "textarea",
            placeholder: "Page content",
            value: value(
              mode,
              "",
              "Static CMS content placeholder for this admin module."
            ),
          },
          {
            id: "seoTitle",
            label: "SEO Title",
            type: "text",
            placeholder: "SEO title",
            value: value(mode, "", `${titleValue} | FreshCart`),
          },
          {
            id: "seoDescription",
            label: "SEO Description",
            type: "textarea",
            placeholder: "SEO description",
            value: value(mode, "", `SEO description for ${titleValue}.`),
          },
          commonStatus(mode),
        ],
      },
    ]
  );
}

const formFactories = {
  storeForm,
  staffForm,
  roleForm,
  productForm,
  categoryForm,
  brandForm,
  tagForm,
  customerForm,
  orderForm,
  productOfferForm: (mode: FormMode) =>
    offerForm(mode, "Product Offer", "Product", "Cold Brew Coffee 1L"),
  categoryOfferForm: (mode: FormMode) =>
    offerForm(mode, "Category Offer", "Category", "Pantry"),
  brandOfferForm: (mode: FormMode) =>
    offerForm(mode, "Brand Offer", "Brand", "Bean & Barrel"),
  couponForm,
  campaignForm,
  bannerForm,
  deliveryBoyForm,
  deliveryAreaForm,
  deliveryTimeSlotForm,
  slotBlockingForm,
  shippingForm,
  integrationForm,
  cmsAboutForm: (mode: FormMode) => cmsForm(mode, "About Us"),
  cmsOffersForm: (mode: FormMode) => cmsForm(mode, "Offers"),
  cmsContactForm: (mode: FormMode) => cmsForm(mode, "Contact Us"),
  cmsStoresForm: (mode: FormMode) => cmsForm(mode, "Stores"),
  cmsPrivacyForm: (mode: FormMode) => cmsForm(mode, "Privacy Policy"),
  cmsTermsForm: (mode: FormMode) => cmsForm(mode, "Terms & Conditions"),
  cmsRefundForm: (mode: FormMode) => cmsForm(mode, "Refund & Return Policy"),
};

export type StaticFormKey = keyof typeof formFactories;

export function getAdminStaticFormConfig(key: StaticFormKey, mode: FormMode) {
  return formFactories[key](mode);
}
