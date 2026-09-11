"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import { useToast } from "@/context/ToastContext";
import { bulkUploadProducts } from "@/lib/catalog-api";

export function ProductBulkUpload({ onUploaded }: { onUploaded: () => Promise<void> }) {
  const { showToast } = useToast();
  const uploadingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function closeModal() {
    if (uploadingRef.current) return;
    setOpen(false);
    setFile(null);
    setError("");
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(null);
    setError("");
    if (!selected) return;

    if (!/\.(xlsx|xls|csv)$/i.test(selected.name)) {
      setError("Choose an Excel (.xlsx or .xls) or CSV (.csv) file.");
      event.target.value = "";
      return;
    }
    if (selected.size === 0) {
      setError("The selected file is empty. Choose a file containing products.");
      event.target.value = "";
      return;
    }
    setFile(selected);
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadingRef.current) return;
    if (!file) {
      setError("Choose a product file to upload.");
      return;
    }

    uploadingRef.current = true;
    setIsUploading(true);
    setError("");
    try {
      await bulkUploadProducts(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed. Please try again.");
      return;
    } finally {
      uploadingRef.current = false;
      setIsUploading(false);
    }

    closeModal();
    showToast("Product file uploaded successfully.");
    try {
      await onUploaded();
    } catch {
      showToast("Upload succeeded, but the product list could not refresh. Reload the page to see the latest products.", "error");
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Bulk upload
      </Button>
      <Modal open={open} onClose={closeModal} title="Bulk upload products">
        <form onSubmit={upload} className="space-y-4" aria-busy={isUploading}>
          <p id="product-bulk-help" className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload an Excel (.xlsx or .xls) or CSV (.csv) file containing your products.
            Use the column names and format required by your product import.
          </p>
          <div className="space-y-2 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
            <label htmlFor="product-bulk-file" className="block text-sm font-medium">
              Product file
            </label>
            <input
              id="product-bulk-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={isUploading}
              onChange={selectFile}
              aria-describedby={`product-bulk-help${error ? " product-bulk-error" : ""}`}
              aria-invalid={Boolean(error)}
              className="block w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-zinc-900 dark:file:bg-zinc-800 dark:file:text-zinc-100"
            />
            {file ? <p className="break-all text-sm text-zinc-500">Selected: {file.name}</p> : null}
          </div>
          {error ? (
            <p id="product-bulk-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          {isUploading ? <p role="status" className="text-sm text-zinc-500">Uploading products. Please keep this page open.</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload products"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
