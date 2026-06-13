import type { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    category: "Electronics",
    description: "Noise-cancelling over-ear headphones with 30h battery.",
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    price: 129.0,
    category: "Electronics",
    description: "Compact layout with hot-swappable switches.",
  },
  {
    id: "3",
    name: "Desk Lamp",
    price: 45.5,
    category: "Home",
    description: "Adjustable LED lamp with warm and cool light modes.",
  },
  {
    id: "4",
    name: "Notebook Set",
    price: 18.0,
    category: "Stationery",
    description: "Pack of 3 dotted notebooks, 120 pages each.",
  },
  {
    id: "5",
    name: "Water Bottle",
    price: 24.99,
    category: "Outdoors",
    description: "Insulated stainless steel, keeps drinks cold for 24h.",
  },
  {
    id: "6",
    name: "USB-C Hub",
    price: 49.99,
    category: "Electronics",
    description: "7-in-1 adapter with HDMI, SD card, and fast charging.",
  },
  {
    id: "7",
    name: "Standing Desk Mat",
    price: 35.0,
    category: "Home",
    description: "Anti-fatigue mat with beveled edges for standing desks.",
  },
  {
    id: "8",
    name: "Gel Pens",
    price: 12.5,
    category: "Stationery",
    description: "Smooth-writing gel pens in assorted colors, pack of 10.",
  },
  {
    id: "9",
    name: "Camping Lantern",
    price: 32.0,
    category: "Outdoors",
    description: "Rechargeable LED lantern with three brightness levels.",
  },
  {
    id: "10",
    name: "Webcam HD",
    price: 59.99,
    category: "Electronics",
    description: "1080p webcam with built-in microphone and privacy cover.",
  },
  {
    id: "11",
    name: "Throw Pillow",
    price: 28.0,
    category: "Home",
    description: "Soft cotton cover with removable insert, 18x18 inches.",
  },
  {
    id: "12",
    name: "Sticky Notes",
    price: 8.99,
    category: "Stationery",
    description: "Assorted neon colors, 3x3 inches, 12 pads per pack.",
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProducts(ms = 1200): Promise<Product[]> {
  await delay(ms);
  return mockProducts;
}

export async function fetchEmptyProducts(ms = 1200): Promise<Product[]> {
  await delay(ms);
  return [];
}
