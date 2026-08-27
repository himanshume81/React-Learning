export type ProductStatus = "active" | "inactive";

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
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
  imageUrls: string[];
  sku: string;
  price: number;
  stock: number;
  categoryId: string;
};
