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
