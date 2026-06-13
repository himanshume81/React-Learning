export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  status: ProductStatus;
};
