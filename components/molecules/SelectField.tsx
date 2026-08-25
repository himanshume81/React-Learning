import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { Text } from "@/components/atoms/Text";
import type { SelectHTMLAttributes } from "react";

type SelectFieldProps = {
  id: string;
  label: string;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({
  id,
  label,
  error,
  children,
  ...selectProps
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} hasError={Boolean(error)} aria-invalid={Boolean(error)} {...selectProps}>
        {children}
      </Select>
      {error && (
        <Text className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </Text>
      )}
    </div>
  );
}
