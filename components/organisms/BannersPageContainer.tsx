"use client";

import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { ActionMenu, ActionMenuItem } from "@/components/molecules/ActionMenu";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Modal } from "@/components/molecules/Modal";
import { useToast } from "@/context/ToastContext";
import {
  BANNER_LIMITS,
  createBanner,
  deleteBanner,
  fetchBanners,
  reorderBanner,
  updateBanner,
  uploadBannerImage,
} from "@/lib/banners-api";
import type { Banner } from "@/types/banner";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";

type FormState = {
  title: string;
  description: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  imageUrl: "",
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read banner image."));
    };

    reader.onerror = () => reject(new Error("Could not read banner image."));
    reader.readAsDataURL(file);
  });
}

export function BannersPageContainer() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [draggedBannerId, setDraggedBannerId] = useState<string | null>(null);
  const [dragTargetBannerId, setDragTargetBannerId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function refreshBanners() {
    setBanners(await fetchBanners());
  }

  useEffect(() => {
    async function loadBanners() {
      setIsLoading(true);

      try {
        await refreshBanners();
      } finally {
        setIsLoading(false);
      }
    }

    loadBanners();
  }, []);

  function openCreateModal() {
    setEditingBanner(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  }

  function openEditModal(banner: Banner) {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
    });
    setSelectedFile(null);
    setFormError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingBanner(null);
    setForm(emptyForm);
    setFormError("");
    setSelectedFile(null);
    setIsSubmitting(false);
    setIsModalOpen(false);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError("Please choose an image file for the banner.");
      return;
    }

    try {
      const imageUrl = await readFileAsDataUrl(file);
      setForm((current) => ({
        ...current,
        imageUrl,
      }));
      setSelectedFile(file);
      setFormError("");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not prepare the banner image."
      );
    } finally {
      event.target.value = "";
    }
  }

  function triggerUpload() {
    fileInputRef.current?.click();
  }

  async function handleSubmit() {
    if (!form.title.trim()) {
      setFormError("Banner title is required.");
      return;
    }

    if (!form.description.trim()) {
      setFormError("Banner description is required.");
      return;
    }

    if (!form.imageUrl) {
      setFormError("Please upload a banner image.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      if (selectedFile) {
        imageUrl = await uploadBannerImage(selectedFile);

        if (!imageUrl) {
          throw new Error("Image upload did not return a URL.");
        }
      }

      if (editingBanner) {
        await updateBanner(editingBanner.id, {
          title: form.title,
          description: form.description,
          imageUrl,
        });
      } else {
        await createBanner({
          title: form.title,
          description: form.description,
          imageUrl,
          featuredRank: null,
        });
      }

      await refreshBanners();
      closeModal();
      showToast(
        editingBanner
          ? "Banner updated successfully."
          : "Banner uploaded successfully."
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Banner could not be saved. Please try again."
      );
      showToast(
        error instanceof Error
          ? error.message
          : "Banner could not be saved. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDragStart(event: DragEvent<HTMLTableRowElement>, banner: Banner) {
    if (banner.featuredRank === null) {
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", banner.id);
    setDraggedBannerId(banner.id);
    setDragTargetBannerId(banner.id);
  }

  function handleDragOver(event: DragEvent<HTMLTableRowElement>, banner: Banner) {
    if (
      banner.featuredRank === null ||
      !draggedBannerId ||
      draggedBannerId === banner.id
    ) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragTargetBannerId(banner.id);
  }

  function handleDragEnd() {
    setDraggedBannerId(null);
    setDragTargetBannerId(null);
  }

  async function handleMoveFeatured(
    banner: Banner,
    direction: "up" | "down"
  ) {
    if (banner.featuredRank === null) {
      return;
    }

    const currentIndex = featuredBanners.findIndex(
      (currentBanner) => currentBanner.id === banner.id
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= featuredBanners.length) {
      return;
    }

    const reordered = [...featuredBanners];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    try {
      await Promise.all(
        reordered.map((currentBanner, index) =>
          reorderBanner(currentBanner, index + 1)
        )
      );
      await refreshBanners();
      showToast(
        `Banner moved ${direction === "up" ? "up" : "down"} in the ranking.`
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Banner position could not be updated.",
        "error"
      );
    }
  }

  function handleDrop(event: DragEvent<HTMLTableRowElement>, targetBanner: Banner) {
    event.preventDefault();

    if (
      !draggedBannerId ||
      draggedBannerId === targetBanner.id ||
      targetBanner.featuredRank === null
    ) {
      handleDragEnd();
      return;
    }

    const featuredBanners = banners.filter((banner) => banner.featuredRank !== null);
    const targetIndex = featuredBanners.findIndex(
      (banner) => banner.id === targetBanner.id
    );

    if (targetIndex === -1) {
      handleDragEnd();
      return;
    }

    const draggedBanner = featuredBanners.find((banner) => banner.id === draggedBannerId);

    if (!draggedBanner) {
      handleDragEnd();
      return;
    }

    const reordered = [...featuredBanners];
    const currentIndex = reordered.findIndex((banner) => banner.id === draggedBannerId);
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    Promise.all(
      reordered.map((banner, index) =>
        reorderBanner(banner, index + 1)
      )
    )
      .then(async () => {
        await refreshBanners();
        showToast("Banner position updated.");
      })
      .catch((error) => {
        showToast(
          error instanceof Error
            ? error.message
            : "Banner position could not be updated.",
          "error"
        );
      });

    handleDragEnd();
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteBanner(deleteTarget.id);
      await refreshBanners();
      setDeleteTarget(null);
      showToast("Banner deleted successfully.");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Banner could not be deleted.",
        "error"
      );
    }
  }

  const featuredCount = banners.filter((banner) => banner.featuredRank !== null).length;
  const featuredBanners = banners.filter((banner) => banner.featuredRank !== null);
  const modalTitle = editingBanner ? "Edit banner" : "Upload banner";
  const modalSubmitLabel = isSubmitting
    ? editingBanner
      ? "Saving..."
      : "Uploading..."
    : editingBanner
      ? "Save changes"
      : "Save banner";

  return (
    <section className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            Banners
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Upload multiple banners, choose featured items, and manage their order from a single list.
          </Text>
        </div>
        <Button onClick={openCreateModal}>Upload banner</Button>
      </div>

      {!isLoading && banners.length === 0 ? (
        <EmptyState
          title="No banners uploaded"
          description="Upload a banner image to start building the banner list."
          action={<Button onClick={openCreateModal}>Upload banner</Button>}
        />
      ) : (
        <section className="space-y-4">
          <div>
            <Text as="h2" className="text-lg font-semibold">
              Banner list
            </Text>
            <Text className="mt-1 text-sm text-zinc-500">
              Drag ranked rows in the table to change position. Up to {BANNER_LIMITS.maxFeatured} banners can be ranked at once.
            </Text>
          </div>

          <div className="space-y-3 md:hidden">
            {isLoading ? (
              Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <Skeleton className="h-40 w-full rounded-xl" />
                  <Skeleton className="mt-3 h-5 w-36" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
              ))
            ) : (
              banners.map((banner) => (
                <article
                  key={banner.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-40 w-full rounded-xl bg-zinc-100 object-cover dark:bg-zinc-900"
                  />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Text className="font-medium">{banner.title}</Text>
                      <Text className="mt-1 text-sm text-zinc-500">
                        {banner.description}
                      </Text>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                          {banner.featuredRank === null
                            ? "No rank"
                            : `Rank ${banner.featuredRank}`}
                        </span>
                        {banner.featuredRank !== null ? (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => handleMoveFeatured(banner, "up")}
                              disabled={banner.featuredRank === 1}
                            >
                              Move up
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => handleMoveFeatured(banner, "down")}
                              disabled={banner.featuredRank === featuredCount}
                            >
                              Move down
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <ActionMenu label={`Actions for ${banner.title}`}>
                      <ActionMenuItem onSelect={() => openEditModal(banner)}>
                        Edit
                      </ActionMenuItem>
                      {/* {Array.from(
                        { length: BANNER_LIMITS.maxFeatured },
                        (_, index) => index + 1
                      ).map((rank) => (
                        <ActionMenuItem
                          key={rank}
                          onSelect={async () => {
                            try {
                              const occupiedBanner = banners.find(
                                (currentBanner) =>
                                  currentBanner.id !== banner.id &&
                                  currentBanner.featuredRank === rank
                              );

                              if (occupiedBanner) {
                                await updateBanner(occupiedBanner.id, {
                                  featuredRank: banner.featuredRank,
                                });
                              } else if (
                                banner.featuredRank === null &&
                                featuredCount >= BANNER_LIMITS.maxFeatured
                              ) {
                                showToast(
                                  `Only ${BANNER_LIMITS.maxFeatured} ranked banners can be shown at once.`,
                                  "error"
                                );
                                return;
                              }

                              await updateBanner(banner.id, { featuredRank: rank });
                              await refreshBanners();
                              showToast(`Banner moved to rank ${rank}.`);
                            } catch (error) {
                              showToast(
                                error instanceof Error
                                  ? error.message
                                  : "Banner rank could not be updated.",
                                "error"
                              );
                            }
                          }}
                        >
                          Set rank {rank}
                        </ActionMenuItem>
                      ))} */}
                      {banner.featuredRank !== null ? (
                        <ActionMenuItem
                          onSelect={async () => {
                            try {
                              await updateBanner(banner.id, { featuredRank: null });
                              await refreshBanners();
                              showToast("Banner removed from ranking.");
                            } catch (error) {
                              showToast(
                                error instanceof Error
                                  ? error.message
                                  : "Banner rank could not be updated.",
                                "error"
                              );
                            }
                          }}
                        >
                          Remove rank
                        </ActionMenuItem>
                      ) : null}
                      <ActionMenuItem
                        tone="danger"
                        onSelect={() => setDeleteTarget(banner)}
                      >
                        Delete
                      </ActionMenuItem>
                    </ActionMenu>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:block dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto overflow-y-visible rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900/60">
                  <tr className="text-left text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    <th className="px-5 py-4">Banner</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Position</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {isLoading
                    ? Array.from({ length: 4 }, (_, index) => (
                        <tr key={index}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-4">
                              <Skeleton className="h-14 w-20 rounded-lg" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-40" />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <Skeleton className="h-10 w-16" />
                              <Skeleton className="h-4 w-28" />
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Skeleton className="ml-auto h-8 w-10" />
                          </td>
                        </tr>
                      ))
                    : banners.map((banner) => {
                        const isDropTarget =
                          dragTargetBannerId === banner.id &&
                          draggedBannerId !== banner.id;

                        return (
                          <tr
                            key={banner.id}
                            draggable={banner.featuredRank !== null}
                            onDragStart={(event) => handleDragStart(event, banner)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(event) => handleDragOver(event, banner)}
                            onDrop={(event) => handleDrop(event, banner)}
                            className={
                              banner.featuredRank !== null
                                ? `transition ${
                                    isDropTarget ? "bg-zinc-50 dark:bg-zinc-900/40" : ""
                                  }`
                                : ""
                            }
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={banner.imageUrl}
                                  alt={banner.title}
                                  className="h-14 w-20 rounded-lg bg-zinc-100 object-cover dark:bg-zinc-900"
                                />
                                <div>
                                  <Text className="font-medium">{banner.title}</Text>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-zinc-500">
                              {banner.description}
                            </td>
                            <td className="px-5 py-4 text-sm text-zinc-500">
                              <div className="flex items-center gap-3">
                                {banner.featuredRank !== null ? (
                                  <>
                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                                      #{banner.featuredRank}
                                    </span>
                                    <span className="text-xs text-zinc-400">
                                      Drag row to reorder
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xs text-zinc-400">
                                    No rank
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <ActionMenu label={`Actions for ${banner.title}`}>
                                <ActionMenuItem onSelect={() => openEditModal(banner)}>
                                  Edit
                                </ActionMenuItem>
                                {/* {Array.from(
                                  { length: BANNER_LIMITS.maxFeatured },
                                  (_, index) => index + 1
                                ).map((rank) => (
                                  <ActionMenuItem
                                    key={rank}
                                    onSelect={async () => {
                                      try {
                                        const occupiedBanner = banners.find(
                                          (currentBanner) =>
                                            currentBanner.id !== banner.id &&
                                            currentBanner.featuredRank === rank
                                        );

                                        if (occupiedBanner) {
                                          await updateBanner(occupiedBanner.id, {
                                            featuredRank: banner.featuredRank,
                                          });
                                        } else if (
                                          banner.featuredRank === null &&
                                          featuredCount >= BANNER_LIMITS.maxFeatured
                                        ) {
                                          showToast(
                                            `Only ${BANNER_LIMITS.maxFeatured} ranked banners can be shown at once.`,
                                            "error"
                                          );
                                          return;
                                        }

                                        await updateBanner(banner.id, {
                                          featuredRank: rank,
                                        });
                                        await refreshBanners();
                                        showToast(`Banner moved to rank ${rank}.`);
                                      } catch (error) {
                                        showToast(
                                          error instanceof Error
                                            ? error.message
                                            : "Banner rank could not be updated.",
                                          "error"
                                        );
                                      }
                                    }}
                                  >
                                    Set rank {rank}
                                  </ActionMenuItem>
                                ))} */}
                                {banner.featuredRank !== null ? (
                                  <ActionMenuItem
                                    onSelect={async () => {
                                      try {
                                        await updateBanner(banner.id, {
                                          featuredRank: null,
                                        });
                                        await refreshBanners();
                                        showToast("Banner removed from ranking.");
                                      } catch (error) {
                                        showToast(
                                          error instanceof Error
                                            ? error.message
                                            : "Banner rank could not be updated.",
                                          "error"
                                        );
                                      }
                                    }}
                                  >
                                    Remove rank
                                  </ActionMenuItem>
                                ) : null}
                                <ActionMenuItem
                                  tone="danger"
                                  onSelect={() => setDeleteTarget(banner)}
                                >
                                  Delete
                                </ActionMenuItem>
                              </ActionMenu>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <Modal open={isModalOpen} onClose={closeModal} title={modalTitle}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Banner title</label>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Homepage hero banner"
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Banner description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={4}
              placeholder="Add a short banner description"
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-100"
            />
          </div>

          <div>
            <Text as="span" className="mb-2 block text-sm font-medium">
              Banner image
            </Text>
            <div className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                    {form.imageUrl
                      ? editingBanner
                        ? "Current image loaded. Select another image to replace it."
                        : "Banner image selected."
                      : "Choose a banner image to upload."}
                  </Text>
                </div>
                <Button variant="secondary" onClick={triggerUpload}>
                  {editingBanner ? "Replace image" : "Select image"}
                </Button>
              </div>

              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Banner preview"
                  className="mt-4 h-40 w-full rounded-xl bg-zinc-100 object-cover dark:bg-zinc-900"
                />
              ) : null}
            </div>
          </div>

          {formError ? (
            <Text className="text-sm text-red-600 dark:text-red-400">
              {formError}
            </Text>
          ) : null}

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {modalSubmitLabel}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete banner"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.title}" from the banner library?`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
