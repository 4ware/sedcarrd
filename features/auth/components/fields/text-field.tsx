import type { ComponentProps, ReactNode } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TextFieldProps = ComponentProps<typeof Input> & {
  name: string;
  label: string;
  description?: string;
  /** Field-level error; marks the input invalid and is announced via aria-describedby. */
  error?: string | null;
  /** Control rendered inside the input on the right (e.g. a show-password button). */
  endAdornment?: ReactNode;
};

/** Labelled input wired up for accessibility (label, optional hint and error via aria-describedby). */
export function TextField({
  name,
  label,
  description,
  error,
  endAdornment,
  id = `field-${name}`,
  className,
  ...inputProps
}: TextFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  const input = (
    <Input
      id={id}
      name={name}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      className={cn("h-11 bg-background", endAdornment && "pr-11", className)}
      {...inputProps}
    />
  );

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {endAdornment ? (
        <div className="relative">
          {input}
          <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>
        </div>
      ) : (
        input
      )}
      {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  );
}
