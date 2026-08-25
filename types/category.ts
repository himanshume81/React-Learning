export type CategoryStatus = "active" | "inactive";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  productCount?: number;
};

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
};
