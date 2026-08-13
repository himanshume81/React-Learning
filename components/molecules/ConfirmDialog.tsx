import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { Modal } from "@/components/molecules/Modal";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <Text className="text-sm text-zinc-600 dark:text-zinc-400">{message}</Text>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isPending}>
          {isPending ? "Deleting..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
