"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Text } from "@/components/atoms/Text";
import { SelectField } from "@/components/molecules/SelectField";
import type { StaticFormConfig } from "@/lib/admin-static-forms";

function TextareaField({
  id,
  label,
  placeholder,
  value,
  helperText,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  helperText?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        defaultValue={value}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-foreground focus:ring-2 focus:ring-foreground/20 dark:border-zinc-700 dark:bg-zinc-950"
      />
      {helperText ? (
        <Text className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</Text>
      ) : null}
    </div>
  );
}

export function StaticAdminFormPage({ config }: { config: StaticFormConfig }) {
  return (
    <section className="space-y-6">
      <div>
        <Text as="h1" className="text-2xl font-semibold">
          {config.title}
        </Text>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {config.description}
        </Text>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        {config.sections.map((section) => (
          <article
            key={section.title}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-5">
              <Text as="h2" className="text-lg font-semibold">
                {section.title}
              </Text>
              {section.description ? (
                <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {section.description}
                </Text>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => {
                if (field.type === "textarea") {
                  return (
                    <div key={field.id} className="md:col-span-2">
                      <TextareaField
                        id={field.id}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={field.value}
                        helperText={field.helperText}
                      />
                    </div>
                  );
                }

                if (field.type === "select") {
                  return (
                    <SelectField
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      defaultValue={field.value}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectField>
                  );
                }

                return (
                  <div key={field.id} className="space-y-1.5">
                    <label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                    </label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      defaultValue={field.value}
                    />
                    {field.helperText ? (
                      <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                        {field.helperText}
                      </Text>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </article>
        ))}

        {config.note ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            {config.note}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit">{config.submitLabel}</Button>
          <Button type="button" variant="secondary">
            Save as Draft
          </Button>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}
