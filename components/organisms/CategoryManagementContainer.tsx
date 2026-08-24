"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Text } from "@/components/atoms/Text";
import { ApiError } from "@/lib/api-client";
import {
  createCategory,
  deleteCategory,
  fetchCategoriesWithCounts,
  formatRecordId,
  updateCategory,
} from "@/lib/catalog-api";
import { ActionMenu, ActionMenuItem } from "@/components/molecules/ActionMenu";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Modal } from "@/components/molecules/Modal";
import type { Category, CategoryInput } from "@/types/category";
import Link from "next/link";
import { useEffect, useState } from "react";

const emptyForm: CategoryInput = {
  name: "",
  slug: "",
  description: "",
};

type FormErrors = Partial<Record<keyof CategoryInput, string>>;

function validateCategory(input: CategoryInput): FormErrors {
  const errors: FormErrors = {};

  if (!input.name.trim()) {
    errors.name = "Category name is required.";
  }

  if (!input.slug.trim()) {
    errors.slug = "Slug is required.";
  }

  return errors;
}

export function CategoryManagementContainer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleteError, setDeleteError] = useState("");

  async function refreshCategories() {
    setIsLoading(true);

    try {
      setCategories(await fetchCategoriesWithCounts());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshCategories();
  }, []);

  function openCreateModal() {
    setEditingCategory(null);
    setForm(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleSubmit() {
    const nextErrors = validateCategory(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
      } else {
        await createCategory(form);
      }

      await refreshCategories();
      closeModal();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ name: error.message });
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
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      setDeleteError("");
      await refreshCategories();
    } catch (error) {
      if (error instanceof ApiError) {
        setDeleteError(error.message);
      }
    }
  }

  async function handleToggleStatus(category: Category) {
    await updateCategory(category.id, {
      status: category.status === "active" ? "inactive" : "active",
    });
    await refreshCategories();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            Categories
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage category records from the API and control whether they are active.
          </Text>
        </div>
        <Button onClick={openCreateModal}>Add category</Button>
      </div>

      {!isLoading && categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first category using the backend API."
          action={<Button onClick={openCreateModal}>Create first category</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Loading categories...
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/categories/${category.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {formatRecordId("CAT", category.id)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="font-medium">{category.name}</Text>
                      {category.description ? (
                        <Text className="mt-1 max-w-md text-sm text-zinc-500">
                          {category.description}
                        </Text>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <Text className="text-sm text-zinc-500">{category.slug}</Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text className="text-sm text-zinc-500">
                        {category.productCount ?? 0}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={category.status === "active" ? "success" : "neutral"}
                      >
                        {category.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <ActionMenu label={`Actions for ${category.name}`}>
                        <Link
                          href={`/categories/${category.id}`}
                          role="menuitem"
                          className="flex rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                        >
                          View
                        </Link>
                        <ActionMenuItem onSelect={() => openEditModal(category)}>
                          Edit
                        </ActionMenuItem>
                        <ActionMenuItem onSelect={() => handleToggleStatus(category)}>
                          {category.status === "active" ? "Deactivate" : "Activate"}
                        </ActionMenuItem>
                        <ActionMenuItem
                          tone="danger"
                          onSelect={() => setDeleteTarget(category)}
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
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? "Edit category" : "Create category"}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Text as="span" className="text-sm font-medium">
              Name
            </Text>
            <Input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Electronics"
              hasError={Boolean(errors.name)}
            />
            {errors.name ? (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Text as="span" className="text-sm font-medium">
              Slug
            </Text>
            <Input
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({ ...current, slug: event.target.value }))
              }
              placeholder="electronics"
              hasError={Boolean(errors.slug)}
            />
            {errors.slug ? (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.slug}
              </Text>
            ) : null}
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
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-foreground/20 dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="Devices, accessories, and tech products."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingCategory
                  ? "Save changes"
                  : "Create category"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category"
        message={
          deleteError ||
          `Delete "${deleteTarget?.name}"? This action cannot be undone.`
        }
        confirmLabel="Delete category"
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError("");
        }}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
