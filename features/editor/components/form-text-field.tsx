"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FormTextFieldProps = Omit<ComponentProps<typeof Input>, "value" | "onChange" | "onBlur" | "name" | "id"> & {
  field: AnyFieldApi;
  label: string;
  description?: string;
};

/**
 * A TanStack Form field rendered with shadcn's Field + Input. Errors (zod message keys, translated
 * via `People.form.errors`) appear once the field was left or the form was submitted, and update live.
 */
export function FormTextField({ field, label, description, ...inputProps }: FormTextFieldProps) {
  const t = useTranslations("People.form.errors");
  const id = `editor-${field.name}`;
  const { meta } = field.state;
  const showErrors = meta.isBlurred || field.form.state.submissionAttempts > 0;
  const message = showErrors
    ? meta.errors.map((error) => (typeof error === "string" ? error : error?.message)).find(Boolean)
    : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = message ? `${id}-error` : undefined;

  return (
    <Field data-invalid={message ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={() => {
          field.handleBlur();
          void field.validate("change");
        }}
        aria-invalid={message ? true : undefined}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        className="h-11 bg-background"
        {...inputProps}
      />
      {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
      {message ? <FieldError id={errorId}>{t(message)}</FieldError> : null}
    </Field>
  );
}
