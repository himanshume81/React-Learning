export type ProductStatus = "active" | "inactive";

export type Product = {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  status: ProductStatus;
};

export type ProductInput = {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string;
};
