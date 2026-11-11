"use client";

import { useForm } from "@tanstack/react-form";
import { type PersonFieldsValues, personFieldsSchema } from "@/features/people";

type Options = {
  /** Starting values: the person loaded from the API, as form values. */
  defaultValues: PersonFieldsValues;
  /** Runs only with valid values; a rejected promise keeps the form (and drawer) as it is. */
  onSubmit?: (values: PersonFieldsValues) => void | Promise<void>;
};

/**
 * TanStack Form for every field of a person, validated with the shared zod schema on change and on
 * submit. Leaving a field also runs the change validation (see FormTextField), so an emptied required
 * field is flagged without typing and there is only one error source that typing can clear.
 */
export function usePersonForm({ defaultValues, onSubmit }: Options) {
  return useForm({
    defaultValues,
    validators: { onChange: personFieldsSchema, onSubmit: personFieldsSchema },
    onSubmit: ({ value }) => onSubmit?.(value),
  });
}

export type PersonForm = ReturnType<typeof usePersonForm>;
