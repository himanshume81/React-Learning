import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Text } from "@/components/atoms/Text";
import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({
  id,
  label,
  error,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} hasError={Boolean(error)} aria-invalid={Boolean(error)} {...inputProps} />
      {error && (
        <Text className="text-sm text-red-600 dark:text-red-400">
          {error}
        </Text>
      )}
    </div>
  );
}
