import type { ComponentProps } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TextFieldProps = ComponentProps<typeof Input> & {
  name: string;
  label: string;
  description?: string;
};

/** Labelled input wired up for accessibility (label + optional hint via aria-describedby). */
export function TextField({ name, label, description, id = `field-${name}`, ...inputProps }: TextFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} name={name} aria-describedby={descriptionId} className="h-11 bg-background" {...inputProps} />
      {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
    </Field>
  );
}
