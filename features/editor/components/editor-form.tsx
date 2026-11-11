"use client";

import { useTranslations } from "next-intl";
import { FieldGroup } from "@/components/ui/field";
import { LIST_FIELDS, type PersonFieldName, type PersonSectionKey, personSections } from "@/features/people";
import type { PersonForm } from "../lib/use-person-form";
import { FormTextField } from "./form-text-field";

export const EDITOR_FORM_ID = "editor-form";

const NUMERIC: readonly PersonFieldName[] = ["birthYear", "heightCm", "weightKg"];
const AUTOCOMPLETE: Partial<Record<PersonFieldName, string>> = { firstName: "off", lastName: "off" };

/**
 * The fields of one section. The form holds every field of the person; "Done" (or Enter) submits
 * all of them, so edits in other sections are saved too.
 */
export function EditorForm({ form, section }: { form: PersonForm; section: PersonSectionKey }) {
  const t = useTranslations("People");
  const fields = personSections.find((s) => s.key === section)?.fields ?? [];

  return (
    <form
      id={EDITOR_FORM_ID}
      noValidate
      aria-label={t(`sections.${section}`)}
      onSubmit={(event) => {
        event.preventDefault();
        // A failed save is shown in the drawer (useUpdatePerson's error state).
        form.handleSubmit().catch(() => {});
      }}
    >
      <FieldGroup>
        {fields.map((name) => (
          <form.Field key={name} name={name}>
            {(field) => (
              <FormTextField
                field={field}
                label={t(`fields.${name}`)}
                description={(LIST_FIELDS as readonly string[]).includes(name) ? t("listHint") : undefined}
                inputMode={NUMERIC.includes(name) ? "numeric" : undefined}
                autoComplete={AUTOCOMPLETE[name]}
              />
            )}
          </form.Field>
        ))}
      </FieldGroup>
    </form>
  );
}
