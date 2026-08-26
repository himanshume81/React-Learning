"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Select } from "@/components/atoms/Select";
import { Text } from "@/components/atoms/Text";
import { ActionMenu, ActionMenuItem } from "@/components/molecules/ActionMenu";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Modal } from "@/components/molecules/Modal";
import { ApiError } from "@/lib/api-client";
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProductById,
  fetchProducts,
  formatRecordId,
  uploadProductImages,
  updateProduct,
} from "@/lib/catalog-api";
import { useToast } from "@/context/ToastContext";
import type { Category } from "@/types/category";
import type { Product, ProductInput } from "@/types/product";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

const emptyForm: ProductInput = {
  name: "",
  description: "",
  imageUrls: [],
  sku: "",
  price: 0,
  stock: 0,
  categoryId: "",
};

type FormErrors = {
  name?: string;
  description?: string;
  imageUrls?: string;
  sku?: string;
  price?: string;
  stock?: string;
  categoryId?: string;
};

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function validateProduct(input: ProductInput): FormErrors {
  const errors: FormErrors = {};

  if (!input.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!input.description.trim()) {
    errors.description = "Product description is required.";
  }

  if (!input.sku.trim()) {
    errors.sku = "SKU is required.";
  }

  if (!input.categoryId) {
    errors.categoryId = "Choose a category for this product.";
  }

  if (!Number.isFinite(input.price) || input.price <= 0) {
    errors.price = "Price must be greater than 0.";
  }

  if (!Number.isFinite(input.stock) || input.stock < 0) {
    errors.stock = "Stock must be 0 or greater.";
  }

  return errors;
}

export function ProductListContainer() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("Could not read product image."));
      };

      reader.onerror = () => reject(new Error("Could not read product image."));
      reader.readAsDataURL(file);
    });
  }

  async function refreshCategories() {
    setCategories(await fetchCategories());
  }

  async function refreshProducts(categoryId = selectedCategoryId) {
    setIsLoading(true);

    try {
      setProducts(
        await fetchProducts(categoryId === "all" ? undefined : categoryId)
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    Promise.all([refreshCategories(), refreshProducts("all")]);
  }, []);

  useEffect(() => {
    refreshProducts(selectedCategoryId);
  }, [selectedCategoryId]);

  function openCreateModal() {
    setEditingProduct(null);
    setErrors({});
    setPendingImages([]);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
    });
    setIsModalOpen(true);
  }

  async function openEditModal(product: Product) {
    setIsEditLoading(true);
    setErrors({});

    try {
      const latestProduct = await fetchProductById(product.id);

      if (!latestProduct) {
        showToast("Product details could not be loaded.", "error");
        return;
      }

      setEditingProduct(latestProduct);
      setPendingImages([]);
      setForm({
        name: latestProduct.name,
        description: latestProduct.description,
        imageUrls: latestProduct.imageUrls,
        sku: latestProduct.sku,
        price: latestProduct.price,
        stock: latestProduct.stock,
        categoryId: latestProduct.categoryId,
      });
      setIsModalOpen(true);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Product details could not be loaded.",
        "error"
      );
    } finally {
      setIsEditLoading(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setErrors({});
    setPendingImages([]);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setErrors({ imageUrls: "Please choose image files for the product." });
      return;
    }

    try {
      const preparedImages = await Promise.all(
        files.map(async (file, index) => ({
          id: `${Date.now()}-${index}-${file.name}`,
          file,
          previewUrl: await readFileAsDataUrl(file),
        }))
      );
      setPendingImages((current) => [...current, ...preparedImages]);
      setErrors((current) => ({ ...current, imageUrls: undefined }));
    } catch (error) {
      setErrors({
        imageUrls:
          error instanceof Error ? error.message : "Could not prepare the product image.",
      });
    } finally {
      event.target.value = "";
    }
  }

  function triggerUpload() {
    fileInputRef.current?.click();
  }

  function removeExistingImage(index: number) {
    setForm((current) => ({
      ...current,
      imageUrls: current.imageUrls.filter((_, currentIndex) => currentIndex !== index),
    }));
    setErrors((current) => ({ ...current, imageUrls: undefined }));
  }

  function removePendingImage(id: string) {
    setPendingImages((current) => current.filter((image) => image.id !== id));
    setErrors((current) => ({ ...current, imageUrls: undefined }));
  }

  async function handleSubmit() {
    const nextErrors = validateProduct(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls = form.imageUrls;

      if (pendingImages.length > 0) {
        const uploadedImages = await uploadProductImages(
          pendingImages.map((image) => image.file)
        );

        if (uploadedImages.length !== pendingImages.length) {
          throw new Error("One or more product images could not be uploaded.");
        }

        imageUrls = [...form.imageUrls, ...uploadedImages];
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          ...form,
          imageUrls,
        });
        showToast("Product updated successfully.");
      } else {
        await createProduct({
          ...form,
          imageUrls,
        });
        showToast("Product created successfully.");
      }

      await Promise.all([refreshCategories(), refreshProducts()]);
      closeModal();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ name: error.message });
        showToast(error.message, "error");
      } else if (error instanceof Error) {
        setErrors({ imageUrls: error.message });
        showToast(error.message, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteProduct(deleteTarget.id);
      showToast("Product deleted successfully.");
      setDeleteTarget(null);
      await Promise.all([refreshCategories(), refreshProducts()]);
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      }
    }
  }

  async function handleToggleStatus(product: Product) {
    try {
      const nextStatus = product.status === "active" ? "inactive" : "active";
      await updateProduct(product.id, {
        status: nextStatus,
      });
      showToast(
        `Product ${nextStatus === "active" ? "activated" : "deactivated"} successfully.`
      );
      await refreshProducts();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      }
    }
  }

  return (
    <section className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            Products
          </Text>
          <Text className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Manage products from the API and filter the list by category.
          </Text>
        </div>

        <Button onClick={openCreateModal} disabled={categories.length === 0}>
          Add product
        </Button>
      </div>

      <div className="max-w-xs">
        <Text as="span" className="mb-1 block text-sm font-medium">
          Filter by category
        </Text>
        <Select
          value={selectedCategoryId}
          onChange={(event) => setSelectedCategoryId(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      {categories.length === 0 && !isLoading ? (
        <EmptyState
          title="Create a category first"
          description="Products need a category before they can be added."
        />
      ) : !isLoading && products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            selectedCategoryId === "all"
              ? "Add your first product to start building the catalog."
              : "There are no products for this category yet."
          }
          action={
            categories.length > 0 ? (
              <Button onClick={openCreateModal}>Create product</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {isLoading ? (
              Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-5 w-40" />
                  <Skeleton className="mt-2 h-4 w-28" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-5/6" />
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
            ) : (
              products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {formatRecordId("PRD", product.id)}
                      </Link>
                      <Text className="mt-2 font-medium">{product.name}</Text>
                      <Text className="mt-1 text-sm text-zinc-500">
                        {product.sku}
                      </Text>
                    </div>
                    <ActionMenu label={`Actions for ${product.name}`}>
                      <Link
                        href={`/products/${product.id}`}
                        role="menuitem"
                        className="flex rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        View
                      </Link>
                      <ActionMenuItem onSelect={() => void openEditModal(product)}>
                        Edit
                      </ActionMenuItem>
                      <ActionMenuItem onSelect={() => handleToggleStatus(product)}>
                        {product.status === "active" ? "Deactivate" : "Activate"}
                      </ActionMenuItem>
                      <ActionMenuItem
                        tone="danger"
                        onSelect={() => setDeleteTarget(product)}
                      >
                        Delete
                      </ActionMenuItem>
                    </ActionMenu>
                  </div>

                  <Text className="mt-3 text-sm text-zinc-500">
                    {product.description}
                  </Text>

                  {product.imageUrls.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {product.imageUrls.slice(0, 3).map((imageUrl, index) => (
                        <img
                          key={`${product.id}-mobile-${index}`}
                          src={imageUrl}
                          alt={`${product.name} ${index + 1}`}
                          className={`rounded-xl bg-zinc-100 object-cover dark:bg-zinc-900 ${
                            index === 0 ? "col-span-2 h-40 sm:col-span-3" : "h-24"
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge tone="info">{product.categoryName}</Badge>
                    <Badge
                      tone={product.status === "active" ? "success" : "neutral"}
                    >
                      {product.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Text className="text-zinc-500">Price</Text>
                      <Text className="mt-1 font-medium">
                        {formatPrice(product.price)}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-zinc-500">Stock</Text>
                      <Text className="mt-1 font-medium">{product.stock}</Text>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 md:block dark:border-zinc-800">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }, (_, index) => (
                  <tr
                    key={index}
                    className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
                  >
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-2 h-4 w-64" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-8 w-10 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {formatRecordId("PRD", product.id)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-4">
                        {product.imageUrl ? (
                          <div className="relative shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-14 w-20 rounded-lg bg-zinc-100 object-cover dark:bg-zinc-900"
                            />
                            {product.imageUrls.length > 1 ? (
                              <span className="absolute -right-2 -top-2 rounded-full bg-zinc-950 px-1.5 py-0.5 text-[10px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-950">
                                +{product.imageUrls.length - 1}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="min-w-0">
                        <Text className="font-medium">{product.name}</Text>
                        <Text className="max-w-md text-sm text-zinc-500">
                          {product.description}
                        </Text>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="text-sm text-zinc-500">{product.sku}</Text>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="info">{product.categoryName}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="text-sm text-zinc-500">
                        {formatPrice(product.price)}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="text-sm text-zinc-500">{product.stock}</Text>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={product.status === "active" ? "success" : "neutral"}
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <ActionMenu label={`Actions for ${product.name}`}>
                        <Link
                          href={`/products/${product.id}`}
                          role="menuitem"
                          className="flex rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                        >
                          View
                        </Link>
                        <ActionMenuItem onSelect={() => void openEditModal(product)}>
                          Edit
                        </ActionMenuItem>
                        <ActionMenuItem onSelect={() => handleToggleStatus(product)}>
                          {product.status === "active" ? "Deactivate" : "Activate"}
                        </ActionMenuItem>
                        <ActionMenuItem
                          tone="danger"
                          onSelect={() => setDeleteTarget(product)}
                        >
                          Delete
                        </ActionMenuItem>
                      </ActionMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </>
      )}

      {products.length > 0 && !isLoading ? (
        <Text className="text-sm text-zinc-500">
          Showing {products.length} product{products.length === 1 ? "" : "s"}
          {selectedCategoryId === "all" ? "" : " in the selected category"}
        </Text>
      ) : null}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? "Edit product" : "Create product"}
      >
        <div className="space-y-4">
          {isEditLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : null}

          {!isEditLoading ? (
          <>
          <div className="space-y-1.5">
            <Text as="span" className="text-sm font-medium">
              Name
            </Text>
            <Input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Laptop"
              hasError={Boolean(errors.name)}
            />
            {errors.name ? (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </Text>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Text as="span" className="text-sm font-medium">
                SKU
              </Text>
              <Input
                value={form.sku}
                onChange={(event) =>
                  setForm((current) => ({ ...current, sku: event.target.value }))
                }
                placeholder="LAPTOP-001"
                hasError={Boolean(errors.sku)}
              />
              {errors.sku ? (
                <Text className="text-sm text-red-600 dark:text-red-400">
                  {errors.sku}
                </Text>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Text as="span" className="text-sm font-medium">
                Category
              </Text>
              <Select
                value={form.categoryId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    categoryId: event.target.value,
                  }))
                }
                hasError={Boolean(errors.categoryId)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId ? (
                <Text className="text-sm text-red-600 dark:text-red-400">
                  {errors.categoryId}
                </Text>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Text as="span" className="text-sm font-medium">
                Price
              </Text>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price || ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: Number(event.target.value),
                  }))
                }
                placeholder="1200.50"
                hasError={Boolean(errors.price)}
              />
              {errors.price ? (
                <Text className="text-sm text-red-600 dark:text-red-400">
                  {errors.price}
                </Text>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Text as="span" className="text-sm font-medium">
                Stock
              </Text>
              <Input
                type="number"
                min="0"
                step="1"
                value={form.stock || ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    stock: Number(event.target.value),
                  }))
                }
                placeholder="10"
                hasError={Boolean(errors.stock)}
              />
              {errors.stock ? (
                <Text className="text-sm text-red-600 dark:text-red-400">
                  {errors.stock}
                </Text>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Text as="span" className="text-sm font-medium">
              Description
            </Text>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={4}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors focus:ring-2 dark:bg-zinc-950 ${
                errors.description
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-zinc-300 focus:border-foreground focus:ring-foreground/20 dark:border-zinc-700"
              }`}
              placeholder="Developer laptop"
            />
            {errors.description ? (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Text as="span" className="text-sm font-medium">
              Product images
            </Text>
            <div className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  {form.imageUrls.length + pendingImages.length > 0
                    ? pendingImages.length > 0
                      ? "New images selected."
                      : editingProduct
                        ? "Existing images loaded. Add more or remove any image below."
                        : "Product images selected."
                    : "Choose one or more product images to upload."}
                </Text>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={triggerUpload}>
                    {editingProduct ? "Add more images" : "Select images"}
                  </Button>
                </div>
              </div>
            </div>
            {errors.imageUrls ? (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.imageUrls}
              </Text>
            ) : null}
            {form.imageUrls.length + pendingImages.length > 0 ? (
              <div className="space-y-3">
                {editingProduct && form.imageUrls.length > 0 ? (
                  <div>
                    <Text className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Existing images
                    </Text>
                    <div className="-mx-1 overflow-x-auto pb-2">
                      <div className="flex min-w-max gap-3 px-1">
                        {form.imageUrls.map((imageUrl, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative w-36 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                          >
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm text-zinc-700 shadow transition hover:bg-white dark:bg-zinc-950/90 dark:text-zinc-200"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              x
                            </button>
                            <img
                              src={imageUrl}
                              alt={`Product preview ${index + 1}`}
                              className="h-32 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {pendingImages.length > 0 ? (
                  <div>
                    <Text className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                      New images
                    </Text>
                    <div className="-mx-1 overflow-x-auto pb-2">
                      <div className="flex min-w-max gap-3 px-1">
                        {pendingImages.map((image, index) => (
                          <div
                            key={image.id}
                            className="relative w-36 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                          >
                            <button
                              type="button"
                              onClick={() => removePendingImage(image.id)}
                              className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm text-zinc-700 shadow transition hover:bg-white dark:bg-zinc-950/90 dark:text-zinc-200"
                              aria-label={`Remove new image ${index + 1}`}
                            >
                              x
                            </button>
                            <img
                              src={image.previewUrl}
                              alt={`New product preview ${index + 1}`}
                              className="h-32 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || isEditLoading}>
              {isSubmitting
                ? "Saving..."
                : editingProduct
                  ? "Save changes"
                  : "Create product"}
            </Button>
          </div>
          </>
          ) : null}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
        message={`Delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete product"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
