"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Text } from "@/components/atoms/Text";
import { useState } from "react";

export type AdminFormField = {
  readonly label: string;
  readonly placeholder?: string;
  readonly type?: "text" | "number" | "url" | "textarea" | "select";
};

export type AdminFormProps = {
  title: string;
  fields: readonly AdminFormField[];
  dataNodeId?: string;
  description?: string;
};

function FormControl({ field }: { field: AdminFormField }) {
  if (field.type === "textarea") {
    return (
      <textarea
        rows={4}
        placeholder={field.placeholder}
        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-foreground focus:ring-2 focus:ring-foreground/20 dark:border-zinc-700 dark:bg-zinc-950"
      />
    );
  }

  if (field.type === "select") {
    return (
      <Select className="mt-1" defaultValue="">
        <option value="" disabled>Select an option</option>
        <option>Enabled</option>
        <option>Disabled</option>
      </Select>
    );
  }

  return <Input className="mt-1" type={field.type ?? "text"} placeholder={field.placeholder} />;
}

export function AdminForm({
  title,
  fields,
  dataNodeId,
  description = `Configure and manage ${title.toLowerCase()}.`,
}: AdminFormProps) {
  const [saved, setSaved] = useState(false);

  return (
    <section className="space-y-6" data-node-id={dataNodeId}>
      <div>
        <Text as="h1" className="text-2xl font-semibold">{title}</Text>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</Text>
      </div>

      <form
        className="max-w-3xl rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        onChange={() => setSaved(false)}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.label} className={`block text-sm font-medium ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
              {field.label}
              <FormControl field={field} />
            </label>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          {saved ? <Text as="span" role="status" className="text-sm font-medium text-[#4a942e]">Saved</Text> : null}
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
}
