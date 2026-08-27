import { apiFetch } from "@/lib/api-client";
import type { Category, CategoryInput, CategoryStatus } from "@/types/category";
import type { Product, ProductInput, ProductStatus } from "@/types/product";

type ApiStatus = "ACTIVE" | "INACTIVE";

type RawCategory = {
  id: number | string;
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: unknown;
};

type RawProduct = {
  id: number | string;
  name: string;
  description?: string | null;
  image?: string | null;
  imageUrl?: string[] | null;
  images?: unknown;
  sku?: string | null;
  price: number | string;
  stock?: number | string | null;
  categoryId: number | string;
  status?: ApiStatus | ProductStatus;
  category?: {
    id: number | string;
    name: string;
  } | null;
};

type ProductListResponse =
  | RawProduct[]
  | {
      data?: RawProduct[];
      items?: RawProduct[];
      products?: RawProduct[];
    };

function fromApiStatus(status?: unknown): CategoryStatus {
  if (typeof status === "boolean") {
    return status ? "active" : "inactive";
  }

  if (typeof status === "number") {
    return status === 0 ? "inactive" : "active";
  }

  if (typeof status !== "string") {
    return "active";
  }

  return status.toLowerCase() === "inactive" ? "inactive" : "active";
}

function toApiStatus(status: CategoryStatus | ProductStatus): ApiStatus {
  return status === "inactive" ? "INACTIVE" : "ACTIVE";
}

function toCategoryApiStatus(status: CategoryStatus): boolean {
  return status === "active";
}

export function formatRecordId(prefix: "CAT" | "PRD", id: string) {
  const numeric = Number(id);

  if (Number.isInteger(numeric) && numeric >= 0) {
    return `${prefix}-${String(numeric).padStart(4, "0")}`;
  }

  return `${prefix}-${id}`;
}

function toCategory(raw: RawCategory, productCount?: number): Category {
  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.slug ?? "",
    description: raw.description ?? "",
    status: fromApiStatus(raw.status),
    productCount,
  };
}

function extractImageUrls(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => extractImageUrls(entry))
      .filter((imageUrl, index, array) => array.indexOf(imageUrl) === index);
  }

  if (typeof value === "string") {
    const directValue = value.trim();

    if (
      directValue === "" ||
      directValue === "{}" ||
      directValue === "[]" ||
      directValue.toLowerCase() === "null"
    ) {
      return [];
    }

    const matches = directValue.match(/https?:\/\/[^"',}\]\s]+/g);

    if (matches && matches.length > 0) {
      return matches.filter(
        (imageUrl, index, array) => array.indexOf(imageUrl) === index
      );
    }

    return directValue ? [directValue] : [];
  }

  if (value && typeof value === "object") {
    const candidate = value as {
      url?: unknown;
      image?: unknown;
      imageUrl?: unknown;
      src?: unknown;
      secure_url?: unknown;
    };

    return [
      candidate.url,
      candidate.image,
      candidate.imageUrl,
      candidate.src,
      candidate.secure_url,
    ]
      .flatMap((entry) => extractImageUrls(entry))
      .filter((imageUrl, index, array) => array.indexOf(imageUrl) === index);
  }

  return [];
}

function toProduct(raw: RawProduct, categories: Category[]): Product {
  const categoryId = String(raw.categoryId);
  const categoryName =
    raw.category?.name ??
    categories.find((category) => category.id === categoryId)?.name ??
    `Category ${categoryId}`;
  const normalizedImageUrls = [
    ...extractImageUrls(raw.images),
    ...extractImageUrls(raw.imageUrl),
    ...extractImageUrls(raw.image),
  ].filter((imageUrl, index, array) => array.indexOf(imageUrl) === index);

  return {
    id: String(raw.id),
    name: raw.name,
    description: raw.description ?? "",
    imageUrl: normalizedImageUrls[0] ?? "",
    imageUrls: normalizedImageUrls,
    sku: raw.sku ?? "",
    price: Number(raw.price),
    stock: Number(raw.stock ?? 0),
    categoryId,
    categoryName,
    status: fromApiStatus(raw.status),
  };
}

function normalizeProductListResponse(payload: ProductListResponse): RawProduct[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload.items)) {
      return payload.items;
    }

    if (Array.isArray(payload.products)) {
      return payload.products;
    }
  }

  return [];
}

export async function fetchCategories(): Promise<Category[]> {
  const rawCategories = await apiFetch<RawCategory[]>("/categories", { auth: true });
  return rawCategories.map((category) => toCategory(category));
}

export async function fetchCategoriesWithCounts(): Promise<Category[]> {
  const [rawCategories, rawProducts] = await Promise.all([
    apiFetch<RawCategory[]>("/categories", { auth: true }),
    apiFetch<ProductListResponse>("/products", { auth: true })
      .then(normalizeProductListResponse)
      .catch(() => []),
  ]);

  const countByCategoryId = rawProducts.reduce<Record<string, number>>(
    (accumulator, product) => {
      const categoryId = String(product.categoryId);
      accumulator[categoryId] = (accumulator[categoryId] ?? 0) + 1;
      return accumulator;
    },
    {}
  );

  return rawCategories.map((category) =>
    toCategory(category, countByCategoryId[String(category.id)] ?? 0)
  );
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  try {
    const [rawCategory, rawProducts] = await Promise.all([
      apiFetch<RawCategory>(`/categories/${id}`, { auth: true }),
      apiFetch<ProductListResponse>("/products", { auth: true })
        .then(normalizeProductListResponse)
        .catch(() => []),
    ]);

    const productCount = rawProducts.filter(
      (product) => String(product.categoryId) === String(id)
    ).length;

    return toCategory(rawCategory, productCount);
  } catch {
    return null;
  }
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const raw = await apiFetch<RawCategory>("/categories", {
    method: "POST",
    body: {
      name: input.name.trim(),
      slug: input.slug.trim(),
      description: input.description.trim(),
    },
    auth: true,
  });

  return toCategory(raw, 0);
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput & { status: CategoryStatus }>
): Promise<Category> {
  const body: Record<string, unknown> = {};

  if (input.name !== undefined) {
    body.name = input.name.trim();
  }

  if (input.slug !== undefined) {
    body.slug = input.slug.trim();
  }

  if (input.description !== undefined) {
    body.description = input.description.trim();
  }

  if (input.status !== undefined) {
    body.status = toCategoryApiStatus(input.status);
  }

  const raw = await apiFetch<RawCategory>(`/categories/${id}`, {
    method: "PATCH",
    body,
    auth: true,
  });

  return toCategory(raw);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  const [rawProducts, categories] = await Promise.all([
    apiFetch<ProductListResponse>(
      categoryId ? `/products?categoryId=${encodeURIComponent(categoryId)}` : "/products",
      { auth: true }
    ).then(normalizeProductListResponse),
    fetchCategories(),
  ]);

  return rawProducts.map((product) => toProduct(product, categories));
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const [rawProduct, categories] = await Promise.all([
      apiFetch<RawProduct>(`/products/${id}`, { auth: true }),
      fetchCategories(),
    ]);

    return toProduct(rawProduct, categories);
  } catch {
    return null;
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const raw = await apiFetch<RawProduct>("/products", {
    method: "POST",
    body: {
      categoryId: Number(input.categoryId),
      name: input.name.trim(),
      description: input.description.trim(),
      image: input.imageUrls[0] ?? undefined,
      images: input.imageUrls.length > 0 ? input.imageUrls : undefined,
      sku: input.sku.trim(),
      price: input.price,
      stock: input.stock,
      status: "ACTIVE",
    },
    auth: true,
  });

  const categories = await fetchCategories();
  return toProduct(raw, categories);
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const raw = await apiFetch<{
    url?: string;
    secure_url?: string;
    image?: string;
    data?: { url?: string };
  }>("/uploads?folder=products", {
    method: "POST",
    body: formData,
    auth: true,
  });

  return raw.url ?? raw.secure_url ?? raw.image ?? raw.data?.url ?? "";
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
  const uploadedImages = await Promise.all(files.map(uploadProductImage));
  return uploadedImages.filter((imageUrl) => Boolean(imageUrl));
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput & { status: ProductStatus }>
): Promise<Product> {
  const body: Record<string, unknown> = {};

  if (input.name !== undefined) {
    body.name = input.name.trim();
  }

  if (input.description !== undefined) {
    body.description = input.description.trim();
  }

  if (input.imageUrls !== undefined) {
    body.image = input.imageUrls[0] ?? null;
    body.images = input.imageUrls;
  }

  if (input.sku !== undefined) {
    body.sku = input.sku.trim();
  }

  if (input.price !== undefined) {
    body.price = input.price;
  }

  if (input.stock !== undefined) {
    body.stock = input.stock;
  }

  if (input.categoryId !== undefined) {
    body.categoryId = Number(input.categoryId);
  }

  if (input.status !== undefined) {
    body.status = toApiStatus(input.status);
  }

  const raw = await apiFetch<RawProduct>(`/products/${id}`, {
    method: "PATCH",
    body,
    auth: true,
  });

  const categories = await fetchCategories();
  return toProduct(raw, categories);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
