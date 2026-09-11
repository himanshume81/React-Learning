"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import { useToast } from "@/context/ToastContext";
import { bulkUploadProducts } from "@/lib/catalog-api";

type Props = {
  onUploaded: () => Promise<void>;
};

export function ProductBulkUpload({ onUploaded }: Props) {
  const { showToast } = useToast();
  const uploadingRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function close() {
    if (uploadingRef.current) return;
    setIsOpen(false);
    setFile(null);
    setError("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(null);
    setError("");

    if (!selectedFile) return;
    if (!/\.(xlsx|xls|csv)$/i.test(selectedFile.name)) {
      setError("Choose an Excel (.xlsx or .xls) or CSV (.csv) file.");
      event.target.value = "";
      return;
    }
    if (selectedFile.size === 0) {
      setError("The selected file is empty.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      showToast("Products uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
      return;
    } finally {
      uploadingRef.current = false;
      setIsUploading(false);
    }

    close();
    try {
      await onUploaded();
    } catch {
      showToast("Upload succeeded, but the product list could not refresh.", "error");
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Bulk upload
      </Button>
      <Modal open={isOpen} onClose={close} title="Bulk upload products">
        <form className="space-y-4" onSubmit={handleSubmit} aria-busy={isUploading}>
          <p id="bulk-upload-help" className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload an Excel (.xlsx or .xls) or CSV (.csv) file containing products.
          </p>
          <div className="space-y-2 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
            <label htmlFor="bulk-product-file" className="block text-sm font-medium">
              Product file
            </label>
            <input
              id="bulk-product-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={isUploading}
              onChange={handleFileChange}
              aria-describedby={`bulk-upload-help${error ? " bulk-upload-error" : ""}`}
              aria-invalid={Boolean(error)}
              className="block w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 dark:file:bg-zinc-800"
            />
            {file ? <p className="break-all text-sm text-zinc-500">Selected: {file.name}</p> : null}
          </div>
          {error ? <p id="bulk-upload-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          {isUploading ? <p role="status" className="text-sm text-zinc-500">Uploading products…</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={close} disabled={isUploading}>Cancel</Button>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? "Uploading…" : "Upload products"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
